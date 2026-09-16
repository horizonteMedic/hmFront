import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    handleSubidaMasiva,
    handleSubirArchivoDefaultSinSellos,
    LoadingDefault,
    PrintHojaRDefault,
    ReadArchivosFormDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico";
const registrarUrl =
    "/api/v01/ct/informePsicologico/registrarActualizarInformePsicologico";
const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            domicilioActual: res.direccion ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            SubirDoc: true,
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
        fechaEntrevista: res.fechaEntrevista || "",
        nombreExamen: res.nombreExamen ?? "",
        nombres: res.nombresPaciente,
        apellidos: res.apellidosPaciente,
        dni: res.dniPaciente,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente),
        lugarNacimiento: res.lugarNacimientoPaciente,
        domicilioActual: res.direccionPaciente,
        edad: res.edadPaciente,
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivilPaciente,
        nivelEstudios: res.nivelEstudioPaciente,

        // Datos Laborales
        empresa: res.empresa,
        contrata: res.contrata,
        ocupacion: res.ocupacionPaciente,
        cargoDesempenar: res.cargoPaciente,

        // Área Intelectual
        areaIntelectual: res.areaIntelectual ?? "",
        intelectualSuperior: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL SUPERIOR."),
        intelectualPromedio: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO."),
        intelectualPromedioSuperior: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO SUPERIOR."),
        intelectualPromedioBajo: (res.areaIntelectual ?? "").includes("- EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO BAJO."),

        promSuperior: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
        promedio: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
        superior: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),
        promBajo: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD DE CÁLCULO."),

        infosencilla: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD."),
        infogeneral: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION CON FACILIDAD."),

        compInfo: (res.areaIntelectual ?? "").includes("- COMPRENDE Y PROCESA LA INFORMACION SENCILLA CON FACILIDAD."),

        supVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
        promVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
        promSupVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO SUPERIOR EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),
        promBajoVerbalNum: (res.areaIntelectual ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN COMPRENSION VERBAL Y EN CAPACIDAD NUMÉRICA."),

        adecuado: (res.areaIntelectual ?? "").includes("- ADECUADA RETENCION DE DIGITOS."),
        prmBajo: (res.areaIntelectual ?? "").includes("- PRESENTA UN NIVEL PROMEDIO BAJO RETENCION DE DIGITOS."),

        // Área de Personalidad
        areaPersonalidad: res.areaPersonalidad ?? "",

        // Área de Psicomotricidad
        areaPsicomotricidad: res.areaPsicomotricidad ?? "",
        nivAdecuado: (res.areaPsicomotricidad ?? "").includes("- NIVEL ADECUADO EN DESARROLLO PSICOMOTOR."),
        facilidad: (res.areaPsicomotricidad ?? "").includes("- REALIZA LAS INSTRUCCIONES BRINDADAS CON FACILIDAD."),
        dificultad: (res.areaPsicomotricidad ?? "").includes("- REALIZA LAS INSTRUCCIONES BRINDADAS CON DIFICULTAD."),

        // Área de Organicidad
        areaOrganicidad: res.areaOrganicidad ?? "",
        orientadoTiempo: (res.areaOrganicidad ?? "").includes("- ORIENTADO EN TIEMPO, ESPACIO, Y PERSONA."),

        adecuadoManejo: (res.areaOrganicidad ?? "").includes("- POSEE UN ADECUADO MANEJO DE FACULTADES MENTALES"),
        bajoManejo: (res.areaOrganicidad ?? "").includes("- POSEE UN NIVEL PROMEDIO BAJO EN EL MANEJO DE FACULTADES MENTALES."),

        noEnvidencia: (res.areaOrganicidad ?? "").includes("- NO SE EVIDENCIA DAÑO ORGÁNICO."),

        // Recomendaciones
        recomendaciones: res.recomendaciones,

        // Aprobó Test
        aproboTest: res.aprobo ?? false,

        SubirDoc: true,

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
    codigoInforme: form.codigoInforme,
    norden: form.norden,
    fechaEntrevista: form.fechaEntrevista,
    edad: form.edad,
    areaIntelectual: form.areaIntelectual,
    areaPersonalidad: form.areaPersonalidad,
    areaOrganicidad: form.areaOrganicidad,
    areaPsicomotricidad: form.areaPsicomotricidad,
    recomendaciones: form.recomendaciones,
    aprobo: form.aproboTest ?? false,
    desaprobo: !(form.aproboTest ?? false),
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
    if (!form.norden) {
        Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-clipboard-list"></i>Error',
            html: "Datos Incompletos",
        });
        return false;
    }
    if (form.aproboTest === undefined || form.aproboTest === null) {
        Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-clipboard-list"></i>Datos Incompletos',
            html: "Seleccione si Aprobó Test",
        });
        return false;
    }
    return true;
};

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicologico/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicologico"
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
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Informe Psicológico.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
    handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};

export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
    ReadArchivosFormDefault(form, setVisualerOpen, token)
}
export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
    handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token)
}
