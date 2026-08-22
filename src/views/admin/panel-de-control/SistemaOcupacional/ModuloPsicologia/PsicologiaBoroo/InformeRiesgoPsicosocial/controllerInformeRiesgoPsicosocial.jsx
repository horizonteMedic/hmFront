import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
    imprimirReporteJasper,
} from "../../../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/informeRiesgoPsicosocial/obtenerReporteInformeRiesgoPsicosocial";
const registrarUrl =
    "/api/v01/ct/informeRiesgoPsicosocial/registrarActualizarInformeRiesgoPsicosocial";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformeRiesgosPsicosociales/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/InformeRiesgosPsicosociales/Informe_Riesgos_Psicosociales_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad,
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
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
        norden: res.norden ?? "",
        fecha: res.fecha,

        nombreExamen: res.nombreExamen ?? "",
        dni: res.dniPaciente ?? "",

        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
        fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
        estadoCivil: res.estadoCivilPaciente,
        nivelEstudios: res.nivelEstudioPaciente,
        // Datos Laborales
        empresa: res.empresa,
        contrata: res.contrata,
        ocupacion: res.ocupacionPaciente,
        cargoDesempenar: res.cargoPaciente,

        // Riesgos Psicosociales
        exigenciasPsicologicas: res.exigenciasPsicologicasFavorable ? "FAVORABLE" :
            res.exigenciasPsicologicasPromedio ? "PROMEDIO" :
                res.exigenciasPsicologicasDesfavorable ? "DESFAVORABLE" : "",

        trabajoActivoDesarrollo: res.trabajoActivoFavorable ? "FAVORABLE" :
            res.trabajoActivoPromedio ? "PROMEDIO" :
                res.trabajoActivoDesfavorable ? "DESFAVORABLE" : "",

        apoyoSocial: res.apoyoSocialFavorable ? "FAVORABLE" :
            res.apoyoSocialPromedio ? "PROMEDIO" :
                res.apoyoSocialDesfavorable ? "DESFAVORABLE" : "",

        compensaciones: res.compensacionesFavorable ? "FAVORABLE" :
            res.compensacionesPromedio ? "PROMEDIO" :
                res.compensacionesDesfavorable ? "DESFAVORABLE" : "",

        doblePresencia: res.doblePresenciaFavorable ? "FAVORABLE" :
            res.doblePresenciaPromedio ? "PROMEDIO" :
                res.doblePresenciaDesfavorable ? "DESFAVORABLE" : "",

        // Texto libre
        recomendaciones: res.recomendaciones ?? "",
        analisisResultados: res.analisis ?? "",
        conclusionPerfil: res.apto ?? false,

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Validación de datos obligatorios =====
const datosCompletos = (form) => {
    if (form.conclusionPerfil === undefined || form.conclusionPerfil === null) {
        Swal.fire("Error", "Debe ingresar la conclusión del perfil del paciente", "error");
        return false;
    }
    return true;
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fecha: form.fecha,

    exigenciasPsicologicasFavorable: form.exigenciasPsicologicas === "FAVORABLE",
    exigenciasPsicologicasPromedio: form.exigenciasPsicologicas === "PROMEDIO",
    exigenciasPsicologicasDesfavorable: form.exigenciasPsicologicas === "DESFAVORABLE",

    trabajoActivoFavorable: form.trabajoActivoDesarrollo === "FAVORABLE",
    trabajoActivoPromedio: form.trabajoActivoDesarrollo === "PROMEDIO",
    trabajoActivoDesfavorable: form.trabajoActivoDesarrollo === "DESFAVORABLE",

    apoyoSocialFavorable: form.apoyoSocial === "FAVORABLE",
    apoyoSocialPromedio: form.apoyoSocial === "PROMEDIO",
    apoyoSocialDesfavorable: form.apoyoSocial === "DESFAVORABLE",

    compensacionesFavorable: form.compensaciones === "FAVORABLE",
    compensacionesPromedio: form.compensaciones === "PROMEDIO",
    compensacionesDesfavorable: form.compensaciones === "DESFAVORABLE",

    doblePresenciaFavorable: form.doblePresencia === "FAVORABLE",
    doblePresenciaPromedio: form.doblePresencia === "PROMEDIO",
    doblePresenciaDesfavorable: form.doblePresencia === "DESFAVORABLE",

    analisis: form.analisisResultados,
    recomendaciones: form.recomendaciones,
    apto: form.conclusionPerfil,
    noApto: !form.conclusionPerfil,
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

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

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
                    html: "Este paciente ya cuenta con registros de Informe de Riesgos Psicosociales.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
