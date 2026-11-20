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

const obtenerReporteUrl = "/api/v01/ct/constaBrigadista/reporteConstaBrigadista";
const registrarUrl = "/api/v01/ct/constaBrigadista/registrarActualizarConstaBrigadista";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fecha ?? "",
            edad: res.edadPaciente ?? "",
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            empresa: res.empresa ?? "",

            aptitud: res.esActivo ?? false,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            // ConstaBrigadistaReporteDTO solo devuelve `userRegistro`: las fechas y el editor quedan vacíos
            // hasta que el backend los agregue.
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
    fecha: form.fecha,
    esActivo: form.aptitud,
    usuarioFirma: form.user_medicoFirma,
});

// Body completo (creación / actualización). ConstaBrigadistaDTO usa `userRegistro` para el usuario que registra.
// El reporte (GET) aún no devuelve la fecha de registro, así que al editar, si no se conoce el creador, se
// manda el usuario en sesión (como siempre) en vez de null para no borrarlo.
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro || user,
        fechaRegistro: form.fechaRegistro,
    });

// La aptitud es obligatoria tanto al guardar como al editar (devuelve false si falta algo, tras avisar).
const validarFormulario = async (form) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return false;
    }
    if (form.aptitud === undefined || form.aptitud === null) {
        await Swal.fire("Error", "Seleccione Aptitud", "error");
        return false;
    }
    return true;
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!(await validarFormulario(form))) return;
    await guardarRegistro({
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
export const UpdateDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
    if (!(await validarFormulario(form))) return;
    await actualizarRegistro({
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

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/SuficienciaBrigadista/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloConsentimientos/SuficienciaBrigadista"
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

