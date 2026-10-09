import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault, RegistrarServicioAsistencialDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta, formatearHora } from "../../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../../utils/helpers";
import { useAuthStore } from "../../../../../../store/auth";

const baseUrl = "/asistencial/historia-asistencial/historia-mujer-o-varon-adulto";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso
// se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/HistoriaClinicaMujerVaronAdulto/*.jsx");
const rutaJasper =
    "../../../../../jaspers/ModuloAsistencial/HistoriaClinicaMujerVaronAdulto/HistoriaClinicaMujerVaronAdulto_Digitalizado.jsx";
const rutaJasperResumen =
    "../../../../../jaspers/ModuloAsistencial/HistoriaClinicaMujerVaronAdulto/ResumenAsistencial.jsx";
const triajeUrl = "/asistencial/triaje";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

const pacienteDe = (data) => data?.paciente ?? data?.antecedentesInformativos?.paciente ?? null;
const tieneHistoria = (data) => data.id !== null && data.id !== undefined && data.id !== "";

const boolToSiNo = (value) => (value === true ? "SI" : value === false ? "NO" : undefined);
const siNoToBool = (value) => (value === "SI" ? true : value === "NO" ? false : null);

// "Antecedentes Patológicos Personales" (16 ítems) NO vive en la Historia Clínica propia: es un
// cruce de solo lectura con antecedentesInformativos.personales, el mismo array de claves que usa
// AntecedentesPatologicos (ENFERMEDADES). Confirmado contra un response real con datos. Algunos
// ítems del formulario no tienen una clave 1:1 exacta en ese array (p. ej. "Tuberculosis" existe
// como "tuberculosis" Y "tbc" por separado en AntecedentesPatologicos) — se listan las claves
// candidatas y basta con que UNA esté presente.
const AP_ENFERMEDAD_KEYS = {
    ap_obesidad: ["obesidad"],
    ap_epilepsia: ["epilepsiaConvulsiones"],
    ap_asma: ["asma"],
    ap_tuberculosis: ["tuberculosis", "tbc"],
    ap_dengue: ["dengue"],
    ap_malaria: ["paludismoMalaria"],
    ap_its: ["its"],
    ap_glaucoma: ["glaucoma"],
    ap_vih_sida: ["vih"],
    ap_hepatitis_b: ["hepatitis"],
    ap_depresion: ["depresion"],
    ap_infarto_cardiaco: ["ima"],
    ap_dislipidemia: ["dislipidemia"],
    ap_transfusion_sanguinea: ["transfusionSanguinea"],
    ap_insuficiencia_renal: ["insuficienciaRenalCronica"],
    ap_neoplasia: ["neoplasias"],
};

// El ítem "15. Neoplasia" es texto libre en este formulario pero en AntecedentesPatologicos es
// un simple checkbox ("neoplasias") sin descripción asociada — no hay de dónde sacar el detalle,
// así que solo se marca "SI" cuando el checkbox de origen está presente.
// El ítem "16. Alergia Medicamentos" SÍ tiene su propio texto en el origen:
// antecedentesInformativos.reaccionAdversaMedicamentosEspecificar.
const formFromAntecedentesInformativos = (antecedentesInformativos) => {
    const personales = new Set(antecedentesInformativos?.personales ?? []);
    const apEnfermedades = Object.fromEntries(
        Object.entries(AP_ENFERMEDAD_KEYS).map(([campo, claves]) => [
            campo,
            claves.some((clave) => personales.has(clave)),
        ])
    );
    const alergiaEspecificar = antecedentesInformativos?.reaccionAdversaMedicamentosEspecificar ?? "";

    return {
        ...apEnfermedades,
        ap_neoplasia: personales.has("neoplasias") ? "SI" : "",
        ap_alergia_medicamentos: alergiaEspecificar ? "SI" : "NO",
        ap_alergia_medicamentos_especificar: alergiaEspecificar,
    };
};

// GET .../ticket/{numeroTicket} SIEMPRE responde 200 con { codigo, estatus, resultado }, exista
// o no una Historia Clínica propia para ese ticket: si no existe, "resultado.id" viene null pero
// igual trae el paciente (resultado.paciente) y el ticket (resultado.infoTicket). Por eso "tiene
// registro" se decide mirando resultado.id, NO si la petición tuvo error de red.
const formFromPaciente = (paciente, infoTicket) => ({
    pacienteId: paciente?.id ?? null,
    dni: paciente?.numeroDocumento ?? "",
    nombres: paciente?.nombres + " " + paciente?.apellidos ?? "",
    fechaNacimiento: formatearFechaCorta(paciente?.fechaNacimiento ?? ""),
    lugarNacimiento: paciente?.lugarNacimiento ?? "",
    edad: paciente?.edad ?? "",
    sexo: convertirGenero(paciente?.sexo) ?? "",
    estadoCivil: paciente?.estadoCivil ?? "",
    nivelEstudios: paciente?.nivelEstudios ?? "",
    ocupacion: paciente?.ocupacion ?? "",
    direccion: paciente?.direccion ?? "",
    distrito: paciente?.distrito ?? "",
    provincia: paciente?.provincia ?? "",
    departamento: paciente?.departamento ?? "",
    empresa: infoTicket?.empresa ?? "",
});

// "doctorAsignado" viaja como NOMBRE (string), no como id/username. EmpleadoComboBox necesita
// además el id (user_medicoFirma) para no reasignarlo por accidente: su propio useEffect busca
// en listaEmpleados el empleado cuyo username === form.user_medicoFirma y, si lo encuentra,
// PISA nombre_medico con el nombre de ESE empleado. Si dejáramos user_medicoFirma con el usuario
// logueado (valor por defecto de un registro nuevo) se perdería el doctorAsignado real apenas
// cargue el registro. Por eso se resuelve el username por coincidencia de nombre contra
// listaEmpleados; si no hay coincidencia, se limpia user_medicoFirma en vez de dejarlo pegado al
// usuario logueado.
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

// Mapea la Historia Clínica propiamente dicha (resultado de .../ticket/{numeroTicket}, o un
// registro de .../ticket/{numeroTicket}/historial) a los campos PROPIOS de este formulario.
// Los checkboxes de Consumo de Drogas/Sedentarismo se guardan como booleano en el backend
// pero el formulario los maneja como RadioTable "SI"/"NO". Los campos informativos de solo
// lectura (familiares / antecedentes patológicos) se mapean aparte en formFromInformativos.
const formFromHistoriaPropia = (data, today) => ({
    id: data.id ?? null,
    fecha_apertura_hcl: data.fechaApertura ?? today,
    nombre_padre: data.nombrePadre ?? "",
    nombre_madre: data.nombreMadre ?? "",
    localidad: data.localidad ?? "",
    nacionalidad: data.nacionalidad ?? "",
    lugares_6_meses: data.lugaresUltimos6Meses ?? "",
    sustancia_hoja_coca: Boolean(data.consumoHojaCoca),
    sustancia_alcohol: Boolean(data.consumoBebidasAlcoholicas),
    sustancia_tabaco: Boolean(data.consumoTabaco),
    sustancia_cafe: Boolean(data.consumoCafe),
    consumo_drogas: boolToSiNo(data.consumoDrogas),
    sedentarismo: boolToSiNo(data.sedentarismo),
    especificarDrogasSedentarismo: data.especificarDrogasSedentarismo ?? "",
    menarquiaAnios: data.menarquiaAnios ?? "",
    regimenCatamenialSangrado: data.regimenCatamenialSangrado ?? "",
    regimenCatamenialCiclo: data.regimenCatamenialCiclo ?? "",
    vigilancia_diabetes: Boolean(data.vigilanciaDiabetes),
    vigilancia_hipertension: Boolean(data.vigilanciaHipertensionArterial),
    vigilancia_violencia: Boolean(data.vigilanciaViolenciaIntrafamiliar),
    inicio_relaciones_sexuales: data.edadInicioRelacionesSexuales ?? "",
    vacuna_dt_1_dosis: data.vacunaDtDosis1 ?? "",
    vacuna_dt_1_fecha: data.vacunaDtFecha1 ?? "",
    vacuna_dt_2_dosis: data.vacunaDtDosis2 ?? "",
    vacuna_dt_2_fecha: data.vacunaDtFecha2 ?? "",
    vacuna_dt_3_dosis: data.vacunaDtDosis3 ?? "",
    vacuna_dt_3_fecha: data.vacunaDtFecha3 ?? "",
    vacuna_hvb_1_dosis: data.vacunaHvbDosis1 ?? "",
    vacuna_hvb_1_fecha: data.vacunaHvbFecha1 ?? "",
    vacuna_hvb_2_dosis: data.vacunaHvbDosis2 ?? "",
    vacuna_hvb_2_fecha: data.vacunaHvbFecha2 ?? "",
    vacuna_hvb_3_dosis: data.vacunaHvbDosis3 ?? "",
    vacuna_hvb_3_fecha: data.vacunaHvbFecha3 ?? "",
    vacuna_antiamarilica_1_dosis: data.vacunaAntiamarilicaDosis ?? "",
    vacuna_antiamarilica_1_fecha: data.vacunaAntiamarilicaFecha ?? "",
    examenFisico: data.examenFisico ?? "",
    examenesAuxiliares: data.examenesAuxiliares ?? "",
    diagnostico: data.diagnostico ?? "",
    tratamiento: data.tratamiento ?? "",
    seguimientoYControl: data.seguimientoYControl ?? "",
});

// Campos de solo lectura que vienen de OTRO formulario (AntecedentesPatologicos): familiares y
// antecedentes patológicos personales. Pertenecen al paciente, no a esta Historia Clínica, así que
// solo se cargan con el ticket buscado y NUNCA al completar con un registro previo (ver
// OpenModalHistorialPrevio): ahí solo se reemplazan los campos propios.
const formFromInformativos = (data) => ({
    padre: data.antecedentesInformativos?.familiares?.padre ?? "",
    madre: data.antecedentesInformativos?.familiares?.madre ?? "",
    hermanos: data.antecedentesInformativos?.familiares?.hermanos ?? "",
    hijos: data.antecedentesInformativos?.familiares?.hijos ?? "",
    esposaConyuge: data.antecedentesInformativos?.familiares?.esposaConyuge ?? "",
    ...formFromAntecedentesInformativos(data.antecedentesInformativos),
});

const formFromHistoria = (data, today) => ({
    ...formFromHistoriaPropia(data, today),
    ...formFromInformativos(data),
});

// Busca la Historia Clínica por N° de Ticket: GET .../ticket/{numeroTicket}. Un solo llamado
// alcanza para todo (paciente + historia, si existe) — no hace falta el endpoint compartido de
// tickets que usan Triaje/AntecedentesPatologicos.
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
        ...formFromPaciente(paciente, data.infoTicket),
        ...formFromHistoria(data, today),
        ...resolverMedico(data.doctorAsignado, listaEmpleados, prev),
        n_hcl: String(numeroTicket),
        // Si ya hay Historia Clínica, el bloque IMPRIMIR queda apuntando a este ticket.
        ticketImprimir: tieneRegistro ? String(numeroTicket) : "",
        tieneRegistro,
        userRegistro: data.usuarioRegistro ?? "",
        fechaRegistro: data.fechaRegistro ?? "",
        usuarioActualizacion: data.usuarioActualizacion ?? "",
        fechaActualizacion: data.fechaActualizacion ?? "",
    }));

    if (tieneRegistro) {
        Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con una Historia Clínica de la Mujer y el Varón Adulto.",
            "warning"
        );
    } else {
        await OpenModalHistorialPrevio(numeroTicket, token, set, today, listaEmpleados);
    }
};

// Ofrece completar el formulario actual con una Historia Clínica anterior del paciente
// (GET .../ticket/{numeroTicket}/historial), cuando el ticket buscado todavía no tiene
// Historia Clínica propia. Misma idea que el modal de "antecedentes previos" del módulo.
const OpenModalHistorialPrevio = async (numeroTicket, token, set, today, listaEmpleados) => {
    const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}/historial`, token);
    const data = unwrap(res);
    const lista = Array.isArray(data) ? data : [];

    if (res?.error || lista.length === 0) return;

    const inputOptions = lista.reduce((acc, item, index) => {
        const key = String(item.id ?? index);
        const fechaLabel = formatearFechaCorta(item.fechaApertura ?? "") || item.fechaApertura || "Sin fecha";
        const ticketLabel = item.numeroTicket;
        acc[key] = ticketLabel ? `${fechaLabel} - Ticket N° ${ticketLabel}` : fechaLabel;
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
        // Solo campos propios: familiares y antecedentes patológicos se conservan del ticket actual.
        ...formFromHistoriaPropia(registro, today),
        ...resolverMedico(registro.doctorAsignado, listaEmpleados, prev),
        id: null,
        tieneRegistro: false,
        userRegistro: "",
        fechaRegistro: "",
        usuarioActualizacion: "",
        fechaActualizacion: "",
    }));
};

const construirBody = (form) => ({
    id: form.id ?? null,
    pacienteId: form.pacienteId ?? null,
    numeroTicket: form.n_hcl ? Number(form.n_hcl) : null,
    fechaApertura: form.fecha_apertura_hcl,
    nombrePadre: form.nombre_padre ?? "",
    nombreMadre: form.nombre_madre ?? "",
    localidad: form.localidad ?? "",
    nacionalidad: form.nacionalidad ?? "",
    lugaresUltimos6Meses: form.lugares_6_meses ?? "",
    consumoHojaCoca: Boolean(form.sustancia_hoja_coca),
    consumoBebidasAlcoholicas: Boolean(form.sustancia_alcohol),
    consumoTabaco: Boolean(form.sustancia_tabaco),
    consumoCafe: Boolean(form.sustancia_cafe),
    consumoDrogas: siNoToBool(form.consumo_drogas),
    sedentarismo: siNoToBool(form.sedentarismo),
    especificarDrogasSedentarismo: form.especificarDrogasSedentarismo ?? "",
    menarquiaAnios: form.menarquiaAnios ?? "",
    regimenCatamenialSangrado: form.regimenCatamenialSangrado ?? "",
    regimenCatamenialCiclo: form.regimenCatamenialCiclo ?? "",
    vigilanciaDiabetes: Boolean(form.vigilancia_diabetes),
    vigilanciaHipertensionArterial: Boolean(form.vigilancia_hipertension),
    vigilanciaViolenciaIntrafamiliar: Boolean(form.vigilancia_violencia),
    edadInicioRelacionesSexuales: form.inicio_relaciones_sexuales
        ? Number(form.inicio_relaciones_sexuales)
        : null,
    vacunaDtDosis1: form.vacuna_dt_1_dosis ?? "",
    vacunaDtFecha1: form.vacuna_dt_1_fecha ?? "",
    vacunaDtDosis2: form.vacuna_dt_2_dosis ?? "",
    vacunaDtFecha2: form.vacuna_dt_2_fecha ?? "",
    vacunaDtDosis3: form.vacuna_dt_3_dosis ?? "",
    vacunaDtFecha3: form.vacuna_dt_3_fecha ?? "",
    vacunaHvbDosis1: form.vacuna_hvb_1_dosis ?? "",
    vacunaHvbFecha1: form.vacuna_hvb_1_fecha ?? "",
    vacunaHvbDosis2: form.vacuna_hvb_2_dosis ?? "",
    vacunaHvbFecha2: form.vacuna_hvb_2_fecha ?? "",
    vacunaHvbDosis3: form.vacuna_hvb_3_dosis ?? "",
    vacunaHvbFecha3: form.vacuna_hvb_3_fecha ?? "",
    vacunaAntiamarilicaDosis: form.vacuna_antiamarilica_1_dosis ?? "",
    vacunaAntiamarilicaFecha: form.vacuna_antiamarilica_1_fecha ?? "",
    examenFisico: form.examenFisico ?? "",
    examenesAuxiliares: form.examenesAuxiliares ?? "",
    diagnostico: form.diagnostico ?? "",
    tratamiento: form.tratamiento ?? "",
    seguimientoYControl: form.seguimientoYControl ?? "",
    doctorAsignado: form.nombre_medico ?? "",
});

// Registra o actualiza la Historia Clínica: POST .../historia-mujer-o-varon-adulto?usuario=...
// Upsert por numeroTicket (igual que Triaje/AntecedentesPatologicos de este mismo módulo).
export const SubmitDataService = async (form, token, userlogued, limpiar, datosFooter) => {
    if (!form.n_hcl) {
        await Swal.fire("Error", "Debe buscar un N° de Ticket válido antes de registrar.", "error");
        return;
    }

    const body = construirBody(form);
    const query = new URLSearchParams({ usuario: userlogued ?? "" });
    // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
    const numeroTicket = form.n_hcl;

    await RegistrarServicioAsistencialDefault(
        token,
        body,
        `${baseUrl}?${query.toString()}`,
        limpiar,
        "Historia Clínica de la Mujer y el Varón Adulto registrada correctamente.",
        () => PrintHojaR(numeroTicket, token, datosFooter)
    );
};

// Nombre de la sede de la sesión actual (misma fuente que el selector de sede del Navbar): lo usa la
// cabecera del reporte.
const nombreSedeActual = () => {
    const { userlogued, selectedSede } = useAuthStore.getState();
    return userlogued?.sedes?.find((sede) => sede.cod_sede === selectedSede)?.nombre_sede ?? "";
};

// Datos que consume el Jasper: mismos nombres de campo del formulario, armados con los mappers de
// arriba a partir del registro guardado (así la impresión y la pantalla nunca se desalinean).
const construirDatosImpresion = (data) => {
    const paciente = pacienteDe(data);
    return {
        ...formFromPaciente(paciente, data.infoTicket),
        ...formFromHistoria(data, ""),
        sede: nombreSedeActual(),
        numeroTicket: data.numeroTicket ?? "",
        numeroHistoriaClinica: data.numeroHistoriaClinica ?? paciente?.numeroHistoriaClinica ?? "",
        nombre_medico: data.doctorAsignado ?? "",
    };
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
                `El ticket N° ${numeroTicket} todavía no tiene una Historia Clínica registrada.`,
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

        await modulo.default({ ...construirDatosImpresion(data), ...datosFooter });
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

// Etiqueta impresa de cada antecedente patológico personal (mismos ítems del formulario).
const AP_ETIQUETAS = {
    ap_obesidad: "Obesidad",
    ap_epilepsia: "Epilepsia",
    ap_asma: "Asma",
    ap_tuberculosis: "Tuberculosis",
    ap_dengue: "Dengue",
    ap_malaria: "Malaria",
    ap_its: "ITS",
    ap_glaucoma: "Glaucoma",
    ap_vih_sida: "VIH/SIDA",
    ap_hepatitis_b: "Hepatitis B",
    ap_depresion: "Depresión",
    ap_infarto_cardiaco: "Infarto cardiaco",
    ap_dislipidemia: "Dislipidemia",
    ap_insuficiencia_renal: "Insuficiencia renal",
    ap_neoplasia: "Neoplasia",
    ap_transfusion_sanguinea: "Transfusión sanguínea",
};

// "Antecedentes familiares y patológicos" de la hoja: los patológicos marcados y el texto de cada
// familiar, tal como están en el formulario (si el Triaje trae su propio texto, va primero).
const resumenAntecedentes = (historia, triaje) => {
    const patologicos = Object.entries(AP_ETIQUETAS)
        .filter(([campo]) => historia[campo])
        .map(([, etiqueta]) => etiqueta);
    if (historia.ap_alergia_medicamentos === "SI") {
        const detalle = String(historia.ap_alergia_medicamentos_especificar ?? "").trim();
        patologicos.push(detalle ? `Alergia a medicamentos (${detalle})` : "Alergia a medicamentos");
    }

    const familiares = [
        ["Padre", historia.padre],
        ["Madre", historia.madre],
        ["Hermanos", historia.hermanos],
        ["Hijos", historia.hijos],
        ["Esposa/Cónyuge", historia.esposaConyuge],
    ]
        .filter(([, valor]) => String(valor ?? "").trim())
        .map(([nombre, valor]) => `${nombre}: ${String(valor).trim()}`);

    return [
        String(triaje?.antecedentes ?? "").trim(),
        patologicos.length ? `Patológicos: ${patologicos.join(", ")}.` : "",
        familiares.length ? `Familiares: ${familiares.join("; ")}.` : "",
    ]
        .filter(Boolean)
        .join("\n");
};

// "horaTicket" (LocalTime) puede llegar como "HH:mm:ss", [h, m, s] o { hour, minute }.
const horaDeTicket = (hora) => {
    if (!hora) return "";
    const pad = (n) => String(n).padStart(2, "0");
    if (typeof hora === "string") return formatearHora(hora);
    const [h, m] = Array.isArray(hora) ? hora : [hora.hour, hora.minute];
    return Number.isFinite(Number(h)) && Number.isFinite(Number(m)) ? `${pad(h)}:${pad(m)}` : "";
};

const conUnidad = (valor, unidad) => {
    const v = String(valor ?? "").trim();
    return v ? `${v} ${unidad}` : "";
};

// Datos que consume el reporte Resumen Asistencial: paciente + ticket + Historia Clínica (puede no
// existir todavía: en ese caso solo trae paciente y ticket y los campos clínicos quedan en blanco) +
// signos vitales/anamnesis del Triaje del mismo ticket (si lo hay).
const construirDatosResumen = (data, triaje, numeroTicket) => {
    const paciente = pacienteDe(data);
    const ticket = data.infoTicket ?? {};
    const historia = formFromHistoria(data, "");
    const presion =
        triaje?.presionSistolica != null && triaje?.presionDiastolica != null
            ? `${triaje.presionSistolica}/${triaje.presionDiastolica} mmHg`
            : "";

    return {
        ...formFromPaciente(paciente, ticket),
        nombreCompleto: `${paciente?.apellidos ?? ""} ${paciente?.nombres ?? ""}`.trim(),
        celular: paciente?.celular ?? "",
        sede: nombreSedeActual(),
        numeroTicket: data.numeroTicket ?? ticket.numeroTicket ?? numeroTicket,
        numeroHistoriaClinica: data.numeroHistoriaClinica ?? paciente?.numeroHistoriaClinica ?? "",
        fecha: ticket.fechaTicket ?? "",
        horaIngreso: horaDeTicket(ticket.horaTicket),
        // Signos vitales (Triaje). La hoja tiene "P" (pulso) y "FC": el Triaje solo registra la
        // frecuencia cardiaca, así que "P" queda en blanco.
        presionArterial: presion,
        pulso: "",
        frecuenciaCardiaca: conUnidad(triaje?.frecuenciaCardiaca, "x'"),
        frecuenciaRespiratoria: conUnidad(triaje?.frecuenciaRespiratoria, "x'"),
        temperatura: conUnidad(triaje?.temperaturaC, "°C"),
        saturacionO2: conUnidad(triaje?.saturacionO2, "%"),
        peso: conUnidad(triaje?.pesoKg, "kg"),
        // La talla del Triaje asistencial se guarda en metros (ver ReporteTriajeAsistencial).
        talla: conUnidad(triaje?.tallaCm, "m"),
        anamnesis: triaje?.anamnesis ?? "",
        antecedentes: resumenAntecedentes(historia, triaje),
        examenFisico: historia.examenFisico,
        examenesAuxiliares: historia.examenesAuxiliares,
        diagnostico: historia.diagnostico,
        tratamiento: historia.tratamiento,
        cita: historia.seguimientoYControl || formatearFechaCorta(triaje?.fechaCita ?? ""),
    };
};

// Botón "Resumen Asistencial": imprime la hoja de Historia Clínica del ticket (paciente, signos
// vitales del Triaje y lo registrado en la Historia Clínica). No exige que la Historia Clínica ya
// esté guardada: sin ella imprime la hoja con los datos del paciente y los renglones en blanco.
export const PrintResumenAsistencial = async (numeroTicket, token, datosFooter) => {
    if (!numeroTicket) {
        await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
        return;
    }

    LoadingDefault("Cargando Resumen Asistencial");

    try {
        const res = await getFetch(`${baseUrl}/ticket/${numeroTicket}`, token);
        const data = unwrap(res);

        if (res?.error || !data || !pacienteDe(data)) {
            Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }

        // Sin Triaje (o con error) los signos vitales simplemente quedan en blanco.
        const resTriaje = await getFetch(`${triajeUrl}/numero-ticket/${numeroTicket}`, token);
        const triaje = resTriaje && !resTriaje.error ? unwrap(resTriaje) : null;

        const modulo = await jasperModules[rutaJasperResumen]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasperResumen} no exporta una función por defecto`);
            Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        await modulo.default({ ...construirDatosResumen(data, triaje, numeroTicket), ...datosFooter });
        Swal.close();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
