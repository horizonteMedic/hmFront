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
import { convertirGenero } from "../../../../../../utils/helpers";

// ===== Configuración =====
const obtenerReporteUrl =
    "/api/v01/ct/informePsicologicoAdeco/obtenerReporteInformePsicologicoAdeco";
const registrarUrl =
    "/api/v01/ct/informePsicologicoAdeco/registrarActualizarInformePsicologicoAdeco";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build.
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO/*.jsx");
const rutaReporte = "../../../../../../jaspers/ModuloPsicologia/InformePsicologicoADECO/InformePsicologicoAdecoEstres_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad ? `${res.edad} AÑOS` : "",
            sexo: convertirGenero(res.genero) ?? "",
            ocupacion: res.areaO ?? "",
            domicilioActual: res.direccion ?? "",
            nombreExamen: res.nomExam ?? "",
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
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
        fechaExamen: res.fechaExamen,
        nombreExamen: res.nombreExamen,
        esApto: res.apto,

        // Datos Personales
        nombres: res.nombresPaciente + " " + res.apellidosPaciente,

        fechaNacimiento: res.fechaNacimientoPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: convertirGenero(res.sexoPaciente) ?? "",
        dni: res.dniPaciente ?? "",
        lugarNacimiento: res.lugarNacimientoPaciente ?? "",
        domicilioActual: res.direccionPaciente ?? "",
        estadoCivil: res.estadoCivilPaciente ?? "",
        nivelEstudios: res.nivelEstudioPaciente ?? "",

        // Datos Laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        // Criterios Psicológicos
        escalaStress: res.escalaSintomatica ?? "",
        somnolencia: res.somnolencia ?? "",
        testFatiga: res.testFatiga ?? "",

        // Análisis FODA
        fortalezasOportunidades: res.fortalezasOportunidades ?? "",
        amenazasDebilidades: res.amenazasDebilidades ?? "",

        // Observaciones y Recomendaciones
        observaciones: res.observaciones ?? "",
        recomendaciones: res.recomendacion ?? "",

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
    fechaExamen: form.fechaExamen,
    nombreExamen: form.nombreExamen,
    escalaSintomatica: form.escalaStress,
    somnolencia: form.somnolencia,
    testFatiga: form.testFatiga,
    fortalezasOportunidades: form.fortalezasOportunidades,
    amenazasDebilidades: form.amenazasDebilidades,
    observaciones: form.observaciones,
    recomendacion: form.recomendaciones,
    apto: form.esApto,
    noApto: !form.esApto,
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
        Swal.fire("Error", "Debe marcar aptitud", "error");
        return false;
    }
    return true;
};

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
                    html: "Este paciente ya cuenta con registros de Estrés, Fatiga y Somnolencia.",
                });
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
