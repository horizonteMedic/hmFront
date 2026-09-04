import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";
import { getFetch } from "../../../../../../utils/apiHelpers.js";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils.js";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils.js";
import CoagulacionReporte from "../../../../../../jaspers/LaboratorioClinico/Coagulacion.jsx";

const obtenerReporteUrl = "/api/v01/ct/tiempoCoagulacionSangria/obtenerReporte";
const registrarUrl = "/api/v01/ct/tiempoCoagulacionSangria/registrarActualizar";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
    const res = await GetInfoPacDefault(nro, token, sede);
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            nombres: res.nombresApellidos ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
            dni: res.dni ?? "",
            edad: res.edad ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            cargoDesempenar: res.cargo ?? "",
            ocupacion: res.areaO ?? "",
            nombreExamen: res.nomExam ?? "",
            tieneRegistro: false,
        }));
    }
};

// ===== Mapeo Edición (registro existente) =====
// El backend de este examen devuelve el registro anidado en la clave "resultado".
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    let res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        res = res.resultado;
        set((prev) => ({
            ...prev,
            fecha: res.fechaExamen ?? prev.fecha,

            nombreExamen: res.tipoExamen ?? "",
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

            // Pruebas
            coagulacion: res.tiempoCoagulacionResultado,
            sangria: res.tiempoSangriaResultado,

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado,

            // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
            fechaRegistro: res.fechaRegistro ?? "",
            userRegistro: res.userRegistro ?? "",
            fechaActualizacion: res.fechaActualizacion ?? "",
            usuarioActualizacion: res.usuarioActualizacion ?? "",
            tieneRegistro: true,
        }));
    }
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
    norden: form.norden,
    fechaExamen: form.fecha,
    tiempoCoagulacionResultado: form.coagulacion,
    tiempoSangriaResultado: form.sangria,
    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistro",
    });

// ===== Impresión =====
// Este examen no usa el mecanismo genérico de búsqueda dinámica de reporte Jasper: el reporte
// se importa e invoca directamente (única plantilla, sin variantes).
export const PrintHojaR = async (nro, token, tabla) => {
    LoadingDefault("Cargando Formato a Imprimir");
    try {
        const res = await getFetch(
            `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
            token
        );

        // El backend devuelve los datos anidados en `resultado`; desanidar si aplica.
        const data = res?.resultado ?? res;

        if (res?.error || !data?.norden) {
            Swal.fire("Error", "No existe registro para imprimir.", "error");
            return;
        }

        await CoagulacionReporte(data, null);
        Swal.close();
    } catch (error) {
        console.error("Error al imprimir Coagulación:", error);
        Swal.fire("Error", "No se pudo generar el reporte.", "error");
    }
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla),
    });

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
                    html: "Este paciente ya cuenta con registros de Tiempo de Coagulación y Sangría.",
                });
            }),
    });
