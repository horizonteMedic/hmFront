import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/registroConformidadEmo/reporteRegistroConformidadEmo";
const registrarUrl = "/api/v01/ct/registroConformidadEmo/registrarActualizarRegistroConformidadEmo";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fechaEmo ?? "",
            nombreExamen: res.nombreExamen ?? "",
            edad: res.edadPaciente ?? "",
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            empresa: res.empresa ?? "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            // RegistroConformidadEmoReporteDTO solo devuelve `userRegistro`: las fechas y el editor quedan
            // vacíos hasta que el backend los agregue.
            fechaRegistro: res.fechaRegistro ?? "",
            userRegistro: res.userRegistro ?? "",
            fechaActualizacion: res.fechaActualizacion ?? "",
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
// Campos propios del consentimiento (sin auditoría): el usuario que registra lo agrega sellarAuditoria.
const construirBase = (form) => ({
    norden: form.norden,
    fechaEmo: form.fecha,
    fechaEntrega: form.fecha,

    tipoEmo: form.nombreExamen,
    apellidosNombres: form.nombres,
    dni: form.dni,
    puestoTrabajo: form.ocupacion,

    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). RegistroConformidadEmoDTO usa `userRegistro` para el usuario que
// registra. El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el
// creador, se manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro || user,
        fechaRegistro: form.fechaRegistro,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConstanciaLecturaYEntregaResultadosEMO_boro/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloConsentimientos/ConstanciaLecturaYEntregaResultadosEMO_boro"
    );
};

// ===== Búsqueda / verificación por N° Orden (valida también la sede) =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
    verificarRegistro({
        nro,
        tabla,
        token,
        sede,
        onNuevo: () => GetInfoPac(nro, set, token, sede),
        onExistente: () =>
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros del Consentimiento.",
                    "warning"
                );
            }),
    });

const GetInfoPac = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            ...res,
            fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
            nombres: res.nombresApellidos ?? prev.nombres ?? "",
            ocupacion: res.cargo ?? prev.ocupacion ?? "",
            dni: res.dni ?? prev.dni ?? "",
            empresa: res.empresa ?? prev.empresa ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};

