import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault, RegistrarServicioAsistencialDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../../utils/helpers";

const baseUrl = "/asistencial/historia-asistencial/historia-mujer-o-varon-adulto";

const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

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
    nombres: paciente?.nombres ?? "",
    apellidos: paciente?.apellidos ?? "",
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
// registro de .../ticket/{numeroTicket}/historial) a los campos propios de este formulario.
// Los checkboxes de Consumo de Drogas/Sedentarismo se guardan como booleano en el backend
// pero el formulario los maneja como RadioTable "SI"/"NO". "familiares" viaja anidado en
// antecedentesInformativos: cruce informativo de solo lectura con el registro de
// AntecedentesPatologicos del mismo paciente (por eso esos campos están disabled en el JSX).
const formFromHistoria = (data, today) => ({
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
    padre: data.antecedentesInformativos?.familiares?.padre ?? "",
    madre: data.antecedentesInformativos?.familiares?.madre ?? "",
    hermanos: data.antecedentesInformativos?.familiares?.hermanos ?? "",
    hijos: data.antecedentesInformativos?.familiares?.hijos ?? "",
    esposaConyuge: data.antecedentesInformativos?.familiares?.esposaConyuge ?? "",
    ...formFromAntecedentesInformativos(data.antecedentesInformativos),
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
    const paciente = data?.paciente ?? data?.antecedentesInformativos?.paciente ?? null;

    if (res?.error || !data || !paciente) {
        await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
        return;
    }

    const tieneRegistro = data.id !== null && data.id !== undefined && data.id !== "";

    set((prev) => ({
        ...prev,
        ...formFromPaciente(paciente, data.infoTicket),
        ...formFromHistoria(data, today),
        ...resolverMedico(data.doctorAsignado, listaEmpleados, prev),
        n_hcl: String(numeroTicket),
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
        ...formFromHistoria(registro, today),
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
    doctorAsignado: form.nombre_medico ?? "",
});

// Registra o actualiza la Historia Clínica: POST .../historia-mujer-o-varon-adulto?usuario=...
// Upsert por numeroTicket (igual que Triaje/AntecedentesPatologicos de este mismo módulo).
export const SubmitDataService = async (form, token, userlogued, limpiar) => {
    if (!form.n_hcl) {
        await Swal.fire("Error", "Debe buscar un N° de Ticket válido antes de registrar.", "error");
        return;
    }

    const body = construirBody(form);
    const query = new URLSearchParams({ usuario: userlogued ?? "" });

    await RegistrarServicioAsistencialDefault(
        token,
        body,
        `${baseUrl}?${query.toString()}`,
        limpiar,
        "Historia Clínica de la Mujer y el Varón Adulto registrada correctamente."
    );
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
