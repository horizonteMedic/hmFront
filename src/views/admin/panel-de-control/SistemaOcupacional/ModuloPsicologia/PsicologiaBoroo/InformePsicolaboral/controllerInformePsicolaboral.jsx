import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/informePsicolaboral/obtenerReporteInformePsicolaboral";
const registrarUrl =
    "/api/v01/ct/informePsicolaboral/registrarActualizarInformePsicolaboral";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            anual: res.nomExam === "ANUAL",
            dni: res.dni,
            edad: res.edad,
            tipoExamen: res.nomExam,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.cargo,
            puestoActual: res.areaO,
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (!res) return;

    set((prev) => ({
        ...prev,
        norden: res.norden,
        codigoInforme: res.codigoInforme,
        tipoExamen: res.nombreExamen,
        anual: res.nombreExamen == "ANUAL",
        fechaExam: res.fecha,
        nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
        dni: res.dniPaciente,
        edad: res.edadPaciente,
        sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
        empresa: res.empresa,
        contrata: res.contrata,
        // Campos usados por la interfaz principal
        puestoPostula: res.cargoPaciente,
        puestoActual: res.ocupacionPaciente,
        esApto: res.apto ? true : false,
        // ASPECTO INTELECTUAL
        razonamientoProblemas: res.aspectoIntelectual1I ? "I" : res.aspectoIntelectual1NP ? "NP" : res.aspectoIntelectual1NPI ? "NPI" : res.aspectoIntelectual1NPS ? "NPS" : res.aspectoIntelectual1S ? "S" : undefined,
        memoria: res.aspectoIntelectual2I ? "I" : res.aspectoIntelectual2NP ? "NP" : res.aspectoIntelectual2NPI ? "NPI" : res.aspectoIntelectual2NPS ? "NPS" : res.aspectoIntelectual2S ? "S" : undefined,
        atencionConcentracion: res.aspectoIntelectual3I ? "I" : res.aspectoIntelectual3NP ? "NP" : res.aspectoIntelectual3NPI ? "NPI" : res.aspectoIntelectual3NPS ? "NPS" : res.aspectoIntelectual3S ? "S" : undefined,
        coordinacionVisoMotora: res.aspectoIntelectual4I ? "I" : res.aspectoIntelectual4NP ? "NP" : res.aspectoIntelectual4NPI ? "NPI" : res.aspectoIntelectual4NPS ? "NPS" : res.aspectoIntelectual4S ? "S" : undefined,
        orientacionEspacial: res.aspectoIntelectual5I ? "I" : res.aspectoIntelectual5NP ? "NP" : res.aspectoIntelectual5NPI ? "NPI" : res.aspectoIntelectual5NPS ? "NPS" : res.aspectoIntelectual5S ? "S" : undefined,
        comprensionVerbal: res.aspectoIntelectual6I ? "I" : res.aspectoIntelectual6NP ? "NP" : res.aspectoIntelectual6NPI ? "NPI" : res.aspectoIntelectual6NPS ? "NPS" : res.aspectoIntelectual6S ? "S" : undefined,

        // ASPECTOS PERSONALIDAD
        estabilidadEmocional: res.aspectoPersonalidad1A ? "A" : res.aspectoPersonalidad1B ? "B" : res.aspectoPersonalidad1NP ? "NP" : res.aspectoPersonalidad1NPA ? "NPA" : res.aspectoPersonalidad1NPB ? "NPB" : undefined,
        toleranciaFrustracion: res.aspectoPersonalidad2A ? "A" : res.aspectoPersonalidad2B ? "B" : res.aspectoPersonalidad2NP ? "NP" : res.aspectoPersonalidad2NPA ? "NPA" : res.aspectoPersonalidad2NPB ? "NPB" : undefined,
        autoestima: res.aspectoPersonalidad3A ? "A" : res.aspectoPersonalidad3B ? "B" : res.aspectoPersonalidad3NP ? "NP" : res.aspectoPersonalidad3NPA ? "NPA" : res.aspectoPersonalidad3NPB ? "NPB" : undefined,
        asertividad: res.aspectoPersonalidad4A ? "A" : res.aspectoPersonalidad4B ? "B" : res.aspectoPersonalidad4NP ? "NP" : res.aspectoPersonalidad4NPA ? "NPA" : res.aspectoPersonalidad4NPB ? "NPB" : undefined,
        ansiedadEstado: res.aspectoPersonalidad5A ? "A" : res.aspectoPersonalidad5B ? "B" : res.aspectoPersonalidad5NP ? "NP" : res.aspectoPersonalidad5NPA ? "NPA" : res.aspectoPersonalidad5NPB ? "NPB" : undefined,
        ansiedadRasgo: res.aspectoPersonalidad6A ? "A" : res.aspectoPersonalidad6B ? "B" : res.aspectoPersonalidad6NP ? "NP" : res.aspectoPersonalidad6NPA ? "NPA" : res.aspectoPersonalidad6NPB ? "NPB" : undefined,

        // ASPECTOS CONDUCTUALES / PSICOLABORALES
        nivelAlerta: res.nivelAlerta ?? "",
        hostigamientoSexual: res.hostigamientoSexual ?? "",
        consecuencia: res.consecuencia ?? "",

        capacidadInfluencia: res.aspectosPsicolaborales1A ? "A" : res.aspectosPsicolaborales1D ? "D" : res.aspectosPsicolaborales1NA ? "NA" : res.aspectosPsicolaborales1NM ? "NM" : res.aspectosPsicolaborales1PD ? "PD" : undefined,
        adaptacionCambios: res.aspectosPsicolaborales2A ? "A" : res.aspectosPsicolaborales2D ? "D" : res.aspectosPsicolaborales2NA ? "NA" : res.aspectosPsicolaborales2NM ? "NM" : res.aspectosPsicolaborales2PD ? "PD" : undefined,
        trabajoEquipoColaboracion: res.aspectosPsicolaborales3A ? "A" : res.aspectosPsicolaborales3D ? "D" : res.aspectosPsicolaborales3NA ? "NA" : res.aspectosPsicolaborales3NM ? "NM" : res.aspectosPsicolaborales3PD ? "PD" : undefined,
        orientacionAccionMejoraProcesos: res.aspectosPsicolaborales4A ? "A" : res.aspectosPsicolaborales4D ? "D" : res.aspectosPsicolaborales4NA ? "NA" : res.aspectosPsicolaborales4NM ? "NM" : res.aspectosPsicolaborales4PD ? "PD" : undefined,
        autonomiaProactividad: res.aspectosPsicolaborales5A ? "A" : res.aspectosPsicolaborales5D ? "D" : res.aspectosPsicolaborales5NA ? "NA" : res.aspectosPsicolaborales5NM ? "NM" : res.aspectosPsicolaborales5PD ? "PD" : undefined,
        tomaDecisiones: res.aspectosPsicolaborales6A ? "A" : res.aspectosPsicolaborales6D ? "D" : res.aspectosPsicolaborales6NA ? "NA" : res.aspectosPsicolaborales6NM ? "NM" : res.aspectosPsicolaborales6PD ? "PD" : undefined,
        crecimientoPersonal: res.aspectosPsicolaborales7A ? "A" : res.aspectosPsicolaborales7D ? "D" : res.aspectosPsicolaborales7NA ? "NA" : res.aspectosPsicolaborales7NM ? "NM" : res.aspectosPsicolaborales7PD ? "PD" : undefined,
        motivacion: res.aspectosPsicolaborales8A ? "A" : res.aspectosPsicolaborales8D ? "D" : res.aspectosPsicolaborales8NA ? "NA" : res.aspectosPsicolaborales8NM ? "NM" : res.aspectosPsicolaborales8PD ? "PD" : undefined,

        observaciones: res.observaciones ?? "",
        recomendaciones: res.recomendaciones ?? "",

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fecha: form.fechaExam,
    anual: form.anual ?? false,

    aspectoIntelectual1I: form.razonamientoProblemas === "I",
    aspectoIntelectual1NPI: form.razonamientoProblemas === "NPI",
    aspectoIntelectual1NP: form.razonamientoProblemas === "NP",
    aspectoIntelectual1NPS: form.razonamientoProblemas === "NPS",
    aspectoIntelectual1S: form.razonamientoProblemas === "S",

    aspectoIntelectual2I: form.memoria === "I",
    aspectoIntelectual2NPI: form.memoria === "NPI",
    aspectoIntelectual2NP: form.memoria === "NP",
    aspectoIntelectual2NPS: form.memoria === "NPS",
    aspectoIntelectual2S: form.memoria === "S",

    aspectoIntelectual3I: form.atencionConcentracion === "I",
    aspectoIntelectual3NPI: form.atencionConcentracion === "NPI",
    aspectoIntelectual3NP: form.atencionConcentracion === "NP",
    aspectoIntelectual3NPS: form.atencionConcentracion === "NPS",
    aspectoIntelectual3S: form.atencionConcentracion === "S",

    aspectoIntelectual4I: form.coordinacionVisoMotora === "I",
    aspectoIntelectual4NPI: form.coordinacionVisoMotora === "NPI",
    aspectoIntelectual4NP: form.coordinacionVisoMotora === "NP",
    aspectoIntelectual4NPS: form.coordinacionVisoMotora === "NPS",
    aspectoIntelectual4S: form.coordinacionVisoMotora === "S",

    aspectoIntelectual5I: form.orientacionEspacial === "I",
    aspectoIntelectual5NPI: form.orientacionEspacial === "NPI",
    aspectoIntelectual5NP: form.orientacionEspacial === "NP",
    aspectoIntelectual5NPS: form.orientacionEspacial === "NPS",
    aspectoIntelectual5S: form.orientacionEspacial === "S",

    aspectoIntelectual6I: form.comprensionVerbal === "I",
    aspectoIntelectual6NPI: form.comprensionVerbal === "NPI",
    aspectoIntelectual6NP: form.comprensionVerbal === "NP",
    aspectoIntelectual6NPS: form.comprensionVerbal === "NPS",
    aspectoIntelectual6S: form.comprensionVerbal === "S",

    aspectoPersonalidad1B: form.estabilidadEmocional === "B",
    aspectoPersonalidad1NPB: form.estabilidadEmocional === "NPB",
    aspectoPersonalidad1NP: form.estabilidadEmocional === "NP",
    aspectoPersonalidad1NPA: form.estabilidadEmocional === "NPA",
    aspectoPersonalidad1A: form.estabilidadEmocional === "A",

    aspectoPersonalidad2B: form.toleranciaFrustracion === "B",
    aspectoPersonalidad2NPB: form.toleranciaFrustracion === "NPB",
    aspectoPersonalidad2NP: form.toleranciaFrustracion === "NP",
    aspectoPersonalidad2NPA: form.toleranciaFrustracion === "NPA",
    aspectoPersonalidad2A: form.toleranciaFrustracion === "A",

    aspectoPersonalidad3B: form.autoestima === "B",
    aspectoPersonalidad3NPB: form.autoestima === "NPB",
    aspectoPersonalidad3NP: form.autoestima === "NP",
    aspectoPersonalidad3NPA: form.autoestima === "NPA",
    aspectoPersonalidad3A: form.autoestima === "A",

    aspectoPersonalidad4B: form.asertividad === "B",
    aspectoPersonalidad4NPB: form.asertividad === "NPB",
    aspectoPersonalidad4NP: form.asertividad === "NP",
    aspectoPersonalidad4NPA: form.asertividad === "NPA",
    aspectoPersonalidad4A: form.asertividad === "A",

    aspectoPersonalidad5B: form.ansiedadEstado === "B",
    aspectoPersonalidad5NPB: form.ansiedadEstado === "NPB",
    aspectoPersonalidad5NP: form.ansiedadEstado === "NP",
    aspectoPersonalidad5NPA: form.ansiedadEstado === "NPA",
    aspectoPersonalidad5A: form.ansiedadEstado === "A",

    aspectoPersonalidad6B: form.ansiedadRasgo === "B",
    aspectoPersonalidad6NPB: form.ansiedadRasgo === "NPB",
    aspectoPersonalidad6NP: form.ansiedadRasgo === "NP",
    aspectoPersonalidad6NPA: form.ansiedadRasgo === "NPA",
    aspectoPersonalidad6A: form.ansiedadRasgo === "A",

    chkcsbajo: null,
    chkcspromedio: null,
    chkcsalto: null,
    nivelAlerta: form.nivelAlerta,
    hostigamientoSexual: form.hostigamientoSexual,

    aspectosPsicolaborales1PD: form.capacidadInfluencia === "PD",
    aspectosPsicolaborales1NM: form.capacidadInfluencia === "NM",
    aspectosPsicolaborales1A: form.capacidadInfluencia === "A",
    aspectosPsicolaborales1D: form.capacidadInfluencia === "D",
    aspectosPsicolaborales1E: form.capacidadInfluencia === "E",

    aspectosPsicolaborales2PD: form.adaptacionCambios === "PD",
    aspectosPsicolaborales2NM: form.adaptacionCambios === "NM",
    aspectosPsicolaborales2A: form.adaptacionCambios === "A",
    aspectosPsicolaborales2D: form.adaptacionCambios === "D",
    aspectosPsicolaborales2E: form.adaptacionCambios === "E",

    aspectosPsicolaborales3PD: form.trabajoEquipoColaboracion === "PD",
    aspectosPsicolaborales3NM: form.trabajoEquipoColaboracion === "NM",
    aspectosPsicolaborales3A: form.trabajoEquipoColaboracion === "A",
    aspectosPsicolaborales3D: form.trabajoEquipoColaboracion === "D",
    aspectosPsicolaborales3E: form.trabajoEquipoColaboracion === "E",

    aspectosPsicolaborales4PD: form.orientacionAccionMejoraProcesos === "PD",
    aspectosPsicolaborales4NM: form.orientacionAccionMejoraProcesos === "NM",
    aspectosPsicolaborales4A: form.orientacionAccionMejoraProcesos === "A",
    aspectosPsicolaborales4D: form.orientacionAccionMejoraProcesos === "D",
    aspectosPsicolaborales4E: form.orientacionAccionMejoraProcesos === "E",

    aspectosPsicolaborales5PD: form.autonomiaProactividad === "PD",
    aspectosPsicolaborales5NM: form.autonomiaProactividad === "NM",
    aspectosPsicolaborales5A: form.autonomiaProactividad === "A",
    aspectosPsicolaborales5D: form.autonomiaProactividad === "D",
    aspectosPsicolaborales5E: form.autonomiaProactividad === "E",

    aspectosPsicolaborales6PD: form.tomaDecisiones === "PD",
    aspectosPsicolaborales6NM: form.tomaDecisiones === "NM",
    aspectosPsicolaborales6A: form.tomaDecisiones === "A",
    aspectosPsicolaborales6D: form.tomaDecisiones === "D",
    aspectosPsicolaborales6E: form.tomaDecisiones === "E",

    aspectosPsicolaborales7PD: form.crecimientoPersonal === "PD",
    aspectosPsicolaborales7NM: form.crecimientoPersonal === "NM",
    aspectosPsicolaborales7A: form.crecimientoPersonal === "A",
    aspectosPsicolaborales7D: form.crecimientoPersonal === "D",
    aspectosPsicolaborales7E: form.crecimientoPersonal === "E",

    aspectosPsicolaborales8PD: form.motivacion === "PD",
    aspectosPsicolaborales8NM: form.motivacion === "NM",
    aspectosPsicolaborales8A: form.motivacion === "A",
    aspectosPsicolaborales8D: form.motivacion === "D",
    aspectosPsicolaborales8E: form.motivacion === "E",

    consecuencia: form.consecuencia,
    observaciones: form.observaciones,
    recomendaciones: form.recomendaciones,
    apto: form.esApto ? true : false,
    noApto: form.esApto ? false : true,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). El backend de este módulo espera la
// clave "usuarioRegistro" (no "userRegistro") para el usuario que registra.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (form.esApto === undefined || form.esApto === null) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, marque si es apto o no apto.",
        });
        return false;
    }
    return true;
};

// ===== Impresión =====
// El backend puede devolver 2 formatos Jasper posibles para este examen
// (Informe_PsicolaboralBoroo_Digitalizado / Informe_PsicolaboralBorooA_Digitalizado), por lo
// que la resolución del nombre de archivo debe quedar dinámica (no se puede usar el helper
// genérico imprimirReporteJasper, que exige una única ruta literal).
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicolaboral/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicolaboral"
    );
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) => {
    if (!datosCompletos(form)) return;
    return actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });
};

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoServicio(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Informe Psicolaboral.",
                    "warning"
                );
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
