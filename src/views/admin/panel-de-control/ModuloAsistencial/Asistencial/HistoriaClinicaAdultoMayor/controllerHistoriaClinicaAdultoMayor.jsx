import Swal from "sweetalert2";
import { deleteData, getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault, RegistrarServicioAsistencialDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../../utils/helpers";
import { completarSellosFirma } from "../../../../../utils/registroAsistencialUtils";
import { useAuthStore } from "../../../../../../store/auth";

const baseUrl = "/asistencial/historia-asistencial/historia-adulto-mayor";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso se
// declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/HistoriaClinicaAdultoMayor/*.jsx");
const rutaJasper =
    "../../../../../jaspers/ModuloAsistencial/HistoriaClinicaAdultoMayor/HistoriaClinicaAdultoMayor_Digitalizado.jsx";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const pacienteDe = (data) => data?.paciente ?? null;
const tieneHistoria = (data) => data.id !== null && data.id !== undefined && data.id !== "";

const boolToSiNo = (value) => (value === true ? "SI" : value === false ? "NO" : undefined);
const siNoToBool = (value) => (value === "SI" ? true : value === "NO" ? false : null);

const textoONull = (value) => {
    const texto = String(value ?? "").trim();
    return texto ? texto : null;
};
// Los inputs numéricos del formulario son texto: se comparan como texto contra el valor original.
const numeroATexto = (value) => (value === null || value === undefined ? "" : String(value));
const numeroONull = (value) => {
    const texto = String(value ?? "").trim();
    return texto && Number.isFinite(Number(texto)) ? Number(texto) : null;
};

// Antecedentes Personales: NO se registran en esta Historia Clínica. El backend los entrega de solo
// lectura en "antecedentesPatologicos" (array de claves del registro de AntecedentesPatologicos del
// mismo paciente, ver ENFERMEDADES en ese formulario). Cada ítem del formulario puede salir de una o
// varias claves; basta con que UNA esté presente. Las claves se comparan normalizadas (sin tildes,
// espacios ni mayúsculas) por si el backend entrega la etiqueta en vez de la clave.
// Cáncer y Mordedura de animales además piden especificar: sus claves son "cancer" / "mordeduraAnimales"
// y el detalle llega aparte en tipoCancer / descripcionMordedura (el ítem también se marca si solo
// llega el detalle).
// Sin clave equivalente hoy en AntecedentesPatologicos (quedan sin marcar): osteoporosis,
// hospitalización, accidentes, osteoartrosis y riesgo ocupacional.
const AP_CLAVES = {
    ap_hipertension: ["hipertensionArterial"],
    ap_diabetes: ["diabetes"],
    ap_obesidad: ["obesidad"],
    ap_infarto_cardiaco: ["ima", "insuficienciaCardiaca"],
    ap_acv: ["acv"],
    ap_transfusion: ["transfusionSanguinea"],
    ap_cancer: ["cancer"],
    ap_mordedura_animales: ["mordeduraAnimales"],
    ap_tuberculosis: ["tuberculosis", "tbc"],
    ap_its_vih: ["its", "ets", "vih"],
    ap_hepatitis_b: ["hepatitis"],
    ap_malaria: ["paludismoMalaria"],
    ap_glaucoma: ["glaucoma"],
    ap_convulsiones: ["epilepsiaConvulsiones"],
    ap_depresion: ["depresion"],
};

const normalizar = (valor) =>
    String(valor ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

// Devuelve "SI"/"NO" por ítem solo si el paciente tiene un registro de AntecedentesPatologicos de
// origen (numeroTicketAntecedentes o alguna enfermedad marcada); si no, los deja sin seleccionar en
// vez de afirmar "NO" sin tener de dónde.
const formFromAntecedentes = (data) => {
    const presentes = new Set((data.antecedentesPatologicos ?? []).map(normalizar));
    const quirurgicos = Array.isArray(data.antecedentesQuirurgicos) ? data.antecedentesQuirurgicos : [];
    const tipoCancer = textoONull(data.tipoCancer);
    const mordedura = textoONull(data.descripcionMordedura);

    const hayOrigen =
        (data.numeroTicketAntecedentes !== null && data.numeroTicketAntecedentes !== undefined) ||
        presentes.size > 0 ||
        quirurgicos.length > 0;

    const siNo = (marcado) => (hayOrigen || marcado ? (marcado ? "SI" : "NO") : undefined);

    const marcados = Object.fromEntries(
        Object.entries(AP_CLAVES).map(([campo, claves]) => [
            campo,
            claves.some((clave) => presentes.has(normalizar(clave))),
        ])
    );

    return {
        ...Object.fromEntries(Object.entries(marcados).map(([campo, marcado]) => [campo, siNo(marcado)])),
        ap_cancer: siNo(marcados.ap_cancer || Boolean(tipoCancer)),
        ap_interv_quirurgica: siNo(quirurgicos.length > 0),
        ap_mordedura_animales: siNo(marcados.ap_mordedura_animales || Boolean(mordedura)),
        tipoCancer: data.tipoCancer ?? "",
        descripcionMordedura: data.descripcionMordedura ?? "",
    };
};

// GET .../ticket/{numeroTicket} SIEMPRE responde 200 con { codigo, estatus, resultado }, exista o no una
// Historia Clínica para ese ticket: si no existe, "resultado.id" viene null pero igual trae el paciente
// (resultado.paciente) y el ticket (resultado.infoTicket). Por eso "tiene registro" se decide mirando
// resultado.id y NO si la petición tuvo error de red.
const formFromPaciente = (paciente) => ({
    pacienteId: paciente?.id ?? null,
    dni: paciente?.numeroDocumento ?? "",
    nombres: `${paciente?.nombres ?? ""} ${paciente?.apellidos ?? ""}`.trim(),
    fechaNacimiento: formatearFechaCorta(paciente?.fechaNacimiento ?? ""),
    lugarNacimiento: paciente?.lugarNacimiento ?? "",
    edad: paciente?.edad ?? "",
    sexo: convertirGenero(paciente?.sexo) ?? "",
    estadoCivil: paciente?.estadoCivil ?? "",
    nivelEstudios: paciente?.nivelEstudios ?? "",
    domicilio: paciente?.direccion ?? "",
    telefono: paciente?.celular ?? "",
});

// "doctorAsignado" viaja como NOMBRE (string), no como id/username. EmpleadoComboBox necesita además el
// id (user_medicoFirma): su propio useEffect busca en listaEmpleados el empleado cuyo username ===
// form.user_medicoFirma y PISA nombre_medico con el nombre de ESE empleado. Si user_medicoFirma quedara
// con el usuario logueado (valor por defecto de un registro nuevo) se perdería el doctorAsignado real
// apenas cargue el registro. Por eso se resuelve el username por coincidencia de nombre contra
// listaEmpleados; si no hay coincidencia, se limpia en vez de dejarlo pegado al usuario logueado.
const resolverMedico = (doctorAsignado, listaEmpleados, prev) => {
    if (!doctorAsignado) {
        return { nombre_medico: prev.nombre_medico, user_medicoFirma: prev.user_medicoFirma };
    }
    const empleado = (listaEmpleados || []).find(
        (emp) => (emp.nombres || "").trim().toUpperCase() === doctorAsignado.trim().toUpperCase()
    );
    return {
        nombre_medico: doctorAsignado,
        user_medicoFirma: empleado ? empleado.username : "",
    };
};

// Campos PROPIOS de la Historia Clínica (los que este formulario registra). Mismos nombres que el
// body de construirBody: lo que se lee acá es lo que se vuelve a enviar al guardar.
const formFromHistoriaPropia = (data, today) => ({
    id: data.id ?? null,
    fecha_apertura_hcl: data.fechaApertura ?? today,
    religion: data.religion ?? "",
    raza: data.raza ?? "",
    procedencia: data.procedencia ?? "",
    // Familiar o Cuidador Responsable
    familiar_responsable: data.cuidadorNombres ?? "",
    edad_familiar: numeroATexto(data.cuidadorEdad),
    domicilio_telefono_familiar: data.cuidadorDomicilioTelefono ?? "",
    parentesco: data.cuidadorParentesco ?? "",
    // El formulario ya no muestra estos dos (los familiares salen de AntecedentesPatologicos), pero el
    // backend los guarda en la misma fila: se conservan tal cual para no borrarlos al actualizar.
    antecedentesFamiliares: Array.isArray(data.antecedentesFamiliares) ? data.antecedentesFamiliares : [],
    violenciaFamiliar: data.violenciaFamiliar ?? null,
    sexualmente_activo: boolToSiNo(data.sexualmenteActivo),
    problema_sexualidad: boolToSiNo(data.problemasSexualidad),
    // Medicamentos
    reaccion_adversa_medicamentos: boolToSiNo(data.reaccionAdversaMedicamentos),
    reaccion_adversa_medicamentos_cual: data.reaccionAdversaCual ?? "",
    medicamentos_uso_frecuente: boolToSiNo(data.medicamentosUsoFrecuente),
    medicamentos_uso_frecuente_cual: data.tiposMedicamentos ?? "",
    medicamentos_observacion: data.anotacionAdicional ?? "",
    // Síndromes y Problemas Geriátricos
    spg_incontinencia_urinaria: boolToSiNo(data.incontinenciaUrinaria),
    spg_estrenimiento: boolToSiNo(data.estrenimiento),
    spg_ulceras_presion: boolToSiNo(data.ulcerasPresion),
    spg_insomnio: boolToSiNo(data.insomnio),
    spg_inmovilizacion: boolToSiNo(data.inmovilizacion),
    spg_confusion_aguda: boolToSiNo(data.confusionAguda),
    spg_vertigo: boolToSiNo(data.vertigo),
    spg_sincope: boolToSiNo(data.sincope),
    spg_prostatismo: boolToSiNo(data.prostatismo),
    spg_deprivacion_auditiva: boolToSiNo(data.deprivacionAuditiva),
    spg_deprivacion_visual: boolToSiNo(data.deprivacionVisual),
    spg_caidas: boolToSiNo(data.caidas),
    spg_caidas_ultimo_ano: boolToSiNo(data.caidasUltimoAnio),
    spg_n_caidas: numeroATexto(data.numeroCaidas),
    spg_fracturas: data.fracturas ?? "",
    spg_sitio_anatomico: data.sitioAnatomico ?? "",
    observaciones: data.observaciones ?? "",
    // Examen / diagnóstico / tratamiento: editables y se envían al guardar, así que también se completan
    // desde un registro previo (ver OpenModalHistorialPrevio).
    examenFisico: data.examenFisico ?? "",
    examenesAuxiliares: data.examenesAuxiliares ?? "",
    diagnostico: data.diagnostico ?? "",
    tratamiento: data.tratamiento ?? "",
    seguimientoYControl: data.seguimientoYControl ?? "",
});

// Campos de SOLO LECTURA que el backend arma a partir de OTROS módulos (AntecedentesPatologicos): no se
// envían al guardar (son readOnly en el DTO). Pertenecen al paciente, no a esta Historia Clínica, así que
// solo se cargan con el ticket buscado y NUNCA al completar con un registro previo (ver
// OpenModalHistorialPrevio).
const formFromInformativos = (data) => ({
    numeroHistoriaClinica: data.numeroHistoriaClinica ?? data.paciente?.numeroHistoriaClinica ?? "",
    grupo_sanguineo: data.grupoSanguineo ?? "",
    padre: data.antecedentesFamiliaresPorParentesco?.padre ?? "",
    madre: data.antecedentesFamiliaresPorParentesco?.madre ?? "",
    hermanos: data.antecedentesFamiliaresPorParentesco?.hermanos ?? "",
    hijos: data.antecedentesFamiliaresPorParentesco?.hijos ?? "",
    esposaConyuge: data.antecedentesFamiliaresPorParentesco?.esposaConyuge ?? "",
    ...formFromAntecedentes(data),
    // Antecedentes Quirúrgicos (solo lectura): "anio" en este DTO; se tolera "fecha" como en AntecedentePacienteDTO.
    quirurgicos: (Array.isArray(data.antecedentesQuirurgicos) ? data.antecedentesQuirurgicos : []).map((q) => ({
        anio: q.anio ?? q.fecha ?? "",
        hospital: q.hospital ?? "",
        operacion: q.operacion ?? "",
        diasHospitalizacion: q.diasHospitalizacion ?? "",
        complicaciones: q.complicaciones ?? "",
    })),
    // Vacunas ya registradas (con id para poder eliminarlas). Las nuevas se agregan en vacunasNuevas.
    vacunas: (Array.isArray(data.vacunas) ? data.vacunas : []).map((v) => ({
        id: v.id,
        vacuna: v.vacuna ?? "",
        fecha: v.fecha ?? "",
    })),
});

const formFromHistoria = (data, today) => ({
    ...formFromHistoriaPropia(data, today),
    ...formFromInformativos(data),
});

// Busca la Historia Clínica por N° de Ticket: GET .../ticket/{numeroTicket}. Un solo llamado trae
// paciente + historia (si existe) + los datos de solo lectura de otros módulos.
export const VerifyTR = async (numeroTicket, token, set, today, listaEmpleados) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe ingresar un N° de Ticket válido", "error");
        return;
    }

    LoadingDefault("Validando datos");

    const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}`, token);
    Swal.close();

    const data = unwrap(res);
    const paciente = pacienteDe(data);

    if (res?.error || !data || !paciente) {
        await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
        return;
    }

    const tieneRegistro = tieneHistoria(data);

    set((prev) => ({
        ...prev,
        ...formFromPaciente(paciente),
        ...formFromHistoria(data, today),
        ...resolverMedico(data.doctorAsignado, listaEmpleados, prev),
        // Un registro NUEVO siempre abre con la fecha de hoy; la fecha guardada solo manda si ya existe.
        ...(tieneRegistro ? {} : { fecha_apertura_hcl: today }),
        n_hcl: String(numeroTicket),
        // Si ya hay Historia Clínica, el bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: tieneRegistro ? String(numeroTicket) : "",
        tieneRegistro,
        // La auditoría del DTO usa "usuarioRegistro"; el formulario (buildAuditoria) la lee como userRegistro.
        userRegistro: data.usuarioRegistro ?? "",
        fechaRegistro: data.fechaRegistro ?? "",
        usuarioActualizacion: data.usuarioActualizacion ?? "",
        fechaActualizacion: data.fechaActualizacion ?? "",
    }));

    if (tieneRegistro) {
        Swal.fire("Alerta", "Este paciente ya cuenta con una Historia Clínica de Adulto Mayor.", "warning");
    } else {
        await OpenModalHistorialPrevio(numeroTicket, token, set, today, listaEmpleados);
    }
};

// Ofrece completar el formulario con una Historia Clínica anterior del paciente
// (GET .../ticket/{numeroTicket}/historial) cuando el ticket buscado todavía no tiene una propia.
const OpenModalHistorialPrevio = async (numeroTicket, token, set, today, listaEmpleados) => {
    const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}/historial`, token);
    const data = unwrap(res);
    const lista = Array.isArray(data) ? data : [];

    if (res?.error || lista.length === 0) return;

    const inputOptions = lista.reduce((acc, item, index) => {
        const key = String(item.id ?? index);
        const fechaLabel = formatearFechaCorta(item.fechaApertura ?? "") || item.fechaApertura || "Sin fecha";
        acc[key] = item.numeroTicket ? `${fechaLabel} - Ticket N° ${item.numeroTicket}` : fechaLabel;
        return acc;
    }, {});

    const resultadoModal = await Swal.fire({
        title: "Historia Clínica previa del paciente",
        html: `<p style="margin:0 0 4px;color:#64748b;font-size:12px;">Selecciona un registro anterior para completar el formulario actual.</p>`,
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
            if (!value) return "Debes seleccionar una opción o cancelar.";
        },
        showCancelButton: true,
        confirmButtonText: "Usar seleccionado",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
    });

    const seleccion = resultadoModal.value;
    if (!seleccion) return;

    const registro = lista.find((item, index) => String(item.id ?? index) === seleccion);
    if (!registro) return;

    set((prev) => ({
        ...prev,
        // Solo campos propios: lo informativo (familiares, antecedentes, vacunas registradas) se conserva
        // del ticket actual. Es un registro NUEVO: sin id ni auditoría.
        ...formFromHistoriaPropia(registro, today),
        ...resolverMedico(registro.doctorAsignado, listaEmpleados, prev),
        // La fecha de apertura es la de ESTE formulario (hoy), no la del registro que se copia.
        fecha_apertura_hcl: prev.fecha_apertura_hcl || today,
        id: null,
        tieneRegistro: false,
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    }));
};

// Body al request del DTO (HistoriaAsistencialAdultoMayorDTO). Los campos readOnly del DTO
// (antecedentes, tipoCancer, descripcionMordedura, vacunas registradas, auditoría) no se envían.
const construirBody = (form) => {
    const reaccionAdversa = form.reaccion_adversa_medicamentos === "SI";
    const usoFrecuente = form.medicamentos_uso_frecuente === "SI";

    const vacunasNuevas = (form.vacunasNuevas ?? [])
        .filter((v) => String(v.vacuna ?? "").trim())
        .map((v) => ({ vacuna: v.vacuna.trim(), fecha: v.fecha || null }));

    return {
        id: form.id ?? null,
        numeroTicket: numeroONull(form.n_hcl),
        fechaApertura: form.fecha_apertura_hcl || null,
        religion: form.religion ?? "",
        raza: form.raza ?? "",
        procedencia: form.procedencia ?? "",
        // Familiar o Cuidador Responsable
        cuidadorNombres: form.familiar_responsable ?? "",
        cuidadorEdad: numeroONull(form.edad_familiar),
        cuidadorDomicilioTelefono: form.domicilio_telefono_familiar ?? "",
        cuidadorParentesco: form.parentesco ?? "",
        antecedentesFamiliares: form.antecedentesFamiliares ?? [],
        violenciaFamiliar: form.violenciaFamiliar ?? null,
        sexualmenteActivo: siNoToBool(form.sexualmente_activo),
        problemasSexualidad: siNoToBool(form.problema_sexualidad),
        // Medicamentos: el detalle solo viaja si la respuesta es SI (el campo se oculta con NO).
        reaccionAdversaMedicamentos: siNoToBool(form.reaccion_adversa_medicamentos),
        reaccionAdversaCual: reaccionAdversa ? form.reaccion_adversa_medicamentos_cual ?? "" : "",
        medicamentosUsoFrecuente: siNoToBool(form.medicamentos_uso_frecuente),
        tiposMedicamentos: usoFrecuente ? form.medicamentos_uso_frecuente_cual ?? "" : "",
        anotacionAdicional: form.medicamentos_observacion ?? "",
        // Inmunizaciones: solo las NUEVAS; las ya registradas no se reenvían (se duplicarían).
        vacunasNuevas,
        // Síndromes y Problemas Geriátricos
        incontinenciaUrinaria: siNoToBool(form.spg_incontinencia_urinaria),
        estrenimiento: siNoToBool(form.spg_estrenimiento),
        ulcerasPresion: siNoToBool(form.spg_ulceras_presion),
        insomnio: siNoToBool(form.spg_insomnio),
        inmovilizacion: siNoToBool(form.spg_inmovilizacion),
        confusionAguda: siNoToBool(form.spg_confusion_aguda),
        vertigo: siNoToBool(form.spg_vertigo),
        sincope: siNoToBool(form.spg_sincope),
        prostatismo: siNoToBool(form.spg_prostatismo),
        deprivacionAuditiva: siNoToBool(form.spg_deprivacion_auditiva),
        deprivacionVisual: siNoToBool(form.spg_deprivacion_visual),
        caidas: siNoToBool(form.spg_caidas),
        caidasUltimoAnio: siNoToBool(form.spg_caidas_ultimo_ano),
        numeroCaidas: numeroONull(form.spg_n_caidas),
        fracturas: form.spg_fracturas ?? "",
        sitioAnatomico: form.spg_sitio_anatomico ?? "",
        observaciones: form.observaciones ?? "",

        examenFisico: form.examenFisico ?? "",
        examenesAuxiliares: form.examenesAuxiliares ?? "",
        diagnostico: form.diagnostico ?? "",
        tratamiento: form.tratamiento ?? "",
        seguimientoYControl: form.seguimientoYControl ?? "",

        doctorAsignado: form.nombre_medico ?? "",
    };
};

// Registra o actualiza la Historia Clínica: POST .../historia-adulto-mayor?usuario=... Upsert por
// numeroTicket (igual que HistoriaClinicaMujerVaronAdulto/Triaje/AntecedentesPatologicos del módulo);
// el backend resuelve la auditoría con ?usuario=.
export const SubmitDataService = async (form, token, userlogued, limpiar, datosFooter) => {
    if (!form.n_hcl || !form.pacienteId) {
        await Swal.fire("Error", "Debe buscar un N° de Ticket válido antes de registrar.", "error");
        return;
    }

    const query = new URLSearchParams({ usuario: userlogued ?? "" });
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.n_hcl;

    await RegistrarServicioAsistencialDefault(
        token,
        construirBody(form),
        `${baseUrl}?${query.toString()}`,
        limpiar,
        "Historia Clínica del Adulto Mayor registrada correctamente.",
        () => PrintHojaR(numeroTicket, token, datosFooter)
    );
};

// Elimina una vacuna ya registrada: DELETE .../vacuna/{idVacuna}. Es inmediato (no espera a "Guardar").
export const EliminarVacuna = async (idVacuna, token, onSuccess = () => { }) => {
    const { isConfirmed } = await Swal.fire({
        title: "¿Eliminar vacuna?",
        text: "Se eliminará de inmediato del registro del paciente y no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;

    try {
        LoadingDefault("Eliminando vacuna");
        const res = await deleteData(`${baseUrl}/vacuna/${idVacuna}`, token);
        Swal.close();

        if (!res || res.ok === false || res.error === true || (res.codigo && Number(res.codigo) >= 400)) {
            Swal.fire("Error", res?.resultado?.detalle ?? res?.mensaje ?? "No se pudo eliminar la vacuna.", "error");
            return;
        }
        onSuccess();
    } catch (error) {
        Swal.close();
        console.error(error);
        Swal.fire("Error", "Ocurrió un error inesperado al eliminar la vacuna.", "error");
    }
};

// Nombre de la sede de la sesión actual (misma fuente que el selector de sede del Navbar). OJO: `selectedSede`
// solo se llena cuando el usuario elige una sede en el Navbar (al iniciar sesión queda en null), así que
// por sí sola no basta para rotular el reporte: ver sedeDelTicket.
const nombreSedeActual = () => {
    const { userlogued, selectedSede } = useAuthStore.getState();
    return userlogued?.sedes?.find((sede) => String(sede.cod_sede) === String(selectedSede))?.nombre_sede ?? "";
};

// Sede que rotula el reporte: la del TICKET (infoTicket.sede), que es donde se atendió al paciente y no
// depende de lo que haya elegido el usuario en el Navbar. Puede llegar como nombre o como código de sede
// (el ticket se emite con serieTicket = cod_sede): si es un código de las sedes del usuario se muestra su
// nombre; si no hay nada, se usa la sede de la sesión actual.
const sedeDelTicket = (ticket) => {
    const { userlogued } = useAuthStore.getState();
    const sedes = Array.isArray(userlogued?.sedes) ? userlogued.sedes : [];
    const norm = (valor) => String(valor ?? "").trim().toUpperCase();
    const nombrePorCodigo = (codigo) => (norm(codigo) ? sedes.find((sede) => norm(sede.cod_sede) === norm(codigo))?.nombre_sede : "");

    return (
        nombrePorCodigo(ticket?.sede) ||
        String(ticket?.sede ?? "").trim() ||
        nombrePorCodigo(ticket?.serieTicket) ||
        nombreSedeActual()
    );
};

// Datos que consume el Jasper: mismos nombres de campo del formulario, armados con los mappers de
// arriba a partir del registro guardado (así la impresión y la pantalla nunca se desalinean).
const construirDatosImpresion = (data) => {
    const paciente = pacienteDe(data);
    return {
        ...formFromPaciente(paciente),
        ...formFromHistoria(data, ""),
        // El reporte rotula "Apellidos y nombres" y lleva la ocupación (el formulario no la muestra).
        nombreCompleto: `${paciente?.apellidos ?? ""} ${paciente?.nombres ?? ""}`.trim(),
        ocupacion: paciente?.ocupacion ?? "",
        sede: sedeDelTicket(data.infoTicket),
        numeroTicket: data.numeroTicket ?? "",
        nombre_medico: data.doctorAsignado ?? "",
    };
};

// Sello digitalizado del médico asignado (SELLOFIRMADOCASIG) para la firma del reporte. El GET no trae
// "digitalizacion", así que se arma en el front como en el Triaje y los laboratorios asistenciales
// (completarSellosFirma: username -> empleado -> DNI -> archivo SELLOFIRMA). "doctorAsignado" viaja como
// NOMBRE, y esa utilidad busca por username: se resuelve por nombre contra listaEmpleados. Sin sello (o si
// algo falla) el reporte se imprime igual con la línea para firmar a mano.
const obtenerDigitalizacionMedico = async (doctorAsignado, token) => {
    if (!doctorAsignado) return [];
    try {
        const { listaEmpleados } = useAuthStore.getState();
        const nombre = String(doctorAsignado).trim().toUpperCase();
        const empleado = (listaEmpleados || []).find((emp) => String(emp.nombres ?? "").trim().toUpperCase() === nombre);
        return await completarSellosFirma({ doctorAsignado: empleado?.username }, token);
    } catch (error) {
        console.error("No se pudo obtener el sello del médico:", error);
        return [];
    }
};

// Imprime la Historia Clínica GUARDADA de un ticket: GET .../ticket/{numeroTicket} y Jasper.
export const PrintHojaR = async (numeroTicket, token, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}`, token);
        const data = unwrap(res);

        if (res?.error || !data || !pacienteDe(data)) {
            Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }
        if (!tieneHistoria(data)) {
            Swal.fire(
                "Sin Historia Clínica",
                `El ticket N° ${numeroTicket} todavía no tiene una Historia Clínica del Adulto Mayor registrada.`,
                "warning"
            );
            return;
        }

        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        const digitalizacion = await obtenerDigitalizacionMedico(data.doctorAsignado, token);
        await modulo.default({ ...construirDatosImpresion(data), digitalizacion, ...datosFooter });
        Swal.close();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

// Botón IMPRIMIR: pide confirmación (como handlePrintDefault, pero por N° de Ticket) y luego imprime.
export const ConfirmarImpresion = async (numeroTicket, token, datosFooter) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
        return;
    }

    const { isConfirmed } = await Swal.fire({
        title: "¿Desea Imprimir Reporte?",
        html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Ticket: ${numeroTicket}</b></div>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Imprimir",
        cancelButtonText: "Cancelar",
    });

    if (isConfirmed) PrintHojaR(numeroTicket, token, datosFooter);
};
