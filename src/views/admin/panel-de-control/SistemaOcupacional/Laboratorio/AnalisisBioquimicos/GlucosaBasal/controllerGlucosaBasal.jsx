import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/analisisBioquimico/obtenerReporteGlucosaBasal";
const registrarUrl = "/api/v01/ct/analisisBioquimico/registrarActualizarGlucosaBasal";

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
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fecha ?? "",
            codAb: res.codAb,

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: res.nombres ?? "",
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

            glucosaBasal: res.glucBasal ?? "",
            colesterolTotal: res.txtColesterol ?? "",
            ldl: res.txtLdlColesterol !== undefined && res.txtLdlColesterol !== null && res.txtLdlColesterol !== '' ? (parseFloat(res.txtLdlColesterol).toFixed(2)) : '',
            hdl: res.txtHdlColesterol !== undefined && res.txtHdlColesterol !== null && res.txtHdlColesterol !== '' ? (parseFloat(res.txtHdlColesterol).toFixed(2)) : '',
            vldl: res.txtVldlColesterol !== undefined && res.txtVldlColesterol !== null && res.txtVldlColesterol !== '' ? (parseFloat(res.txtVldlColesterol).toFixed(2)) : '',
            trigliceridos: res.txtTrigliseridos ?? "",

            examenDirecto: res.txtColesterol != "",

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
// `user` (usuario en sesión que envía el formulario) se recibe aparte porque "txtReponsable"
// no es un dato de auditoría: el backend lo trata como el responsable del examen y siempre
// se envía con el usuario que está registrando/actualizando en este momento.
const construirBase = (form, user) => ({
    codAb: form.codAb,
    fechaAb: form.fecha,
    txtColesterol: form.colesterolTotal,
    txtLdlColesterol: form.ldl,
    txtHdlColesterol: form.hdl,
    txtVldlColesterol: form.vldl,
    txtTrigliseridos: form.trigliceridos,
    glucBasal: form.glucosaBasal,
    userMedicoOcup: "",
    nOrden: form.norden,

    numTicket: 0,
    txtReponsable: user,
    txtCreatinina: "",

    esGlucosaBasal: true,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
//
// OJO: este backend usa la clave "fechaRegistro" del body para la FECHA DEL EXAMEN, no para
// la auditoría de creación. Por eso, tras sellar la auditoría (que sí necesita
// "usuarioActualizacion"/"fechaActualizacion"/"userRegistro"), se vuelve a forzar
// "fechaRegistro" al valor de `form.fecha` para no romper el contrato ya funcional.
const construirBody = (form, user, esActualizacion) => {
    const sellado = sellarAuditoria(construirBase(form, user), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });
    return {
        ...sellado,
        fechaRegistro: form.fecha,
    };
};

// ===== Impresión =====
// La carpeta "AnalisisBioquimicos" agrupa varias plantillas Jasper compartidas entre todos los
// exámenes de este módulo; se resuelve dinámicamente según el nombre que devuelva el backend.
export const PrintHojaR = (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/AnalisisBioquimicos/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/AnalisisBioquimicos"
    );
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
                    html: "Este paciente ya cuenta con registros de Glucosa Basal.",
                });
            }),
    });
