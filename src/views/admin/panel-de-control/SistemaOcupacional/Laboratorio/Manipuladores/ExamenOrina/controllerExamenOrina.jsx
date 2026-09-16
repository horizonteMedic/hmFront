import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteOrina";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLaboratorioClinicp";

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
            fecha: res.fechaLab,

            codLabclinico: res.codLabclinico ?? "",

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dni ?? "",

            nombres: res.nombres ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimiento ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            edad: res.edad ?? "",
            sexo: res.sexo === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivil,
            nivelEstudios: res.nivelEstudios,
            // Datos Laborales
            empresa: res.empresa,
            contrata: res.contrata,
            ocupacion: res.ocupacion,
            cargoDesempenar: res.cargo,

            color: res.colorUrina ?? '',
            aspecto: res.aspecto ?? '',
            densidad: res.densidad ?? "",
            ph: res.ph ?? "",
            // Examen Químico
            nitritos: res.nitritos ?? '',
            proteinas: res.proteinas ?? '',
            cetonas: res.cetonas ?? '',
            leucocitosExamenQuimico: res.leucocitosEq ?? '',
            acAscorbico: res.acAscorbico ?? '',
            urobilinogeno: res.urobilinogeno ?? '',
            bilirrubina: res.bilirrubina ?? '',
            glucosaExamenQuimico: res.glucosa ?? '',
            sangre: res.sangre ?? '',
            // Sedimento
            leucocitosSedimentoUnitario: res.leucocitosSu ?? '',
            hematiesSedimentoUnitario: res.hematiesSu ?? '',
            celEpiteliales: res.celulasEpiteliales ?? '',
            cristales: res.cristales ?? '',
            cilindros: res.cilindros ?? '',
            bacterias: res.bacterias ?? '',
            gramSc: res.gramSC ?? '',
            otros: res.otros ?? '',

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
    codLabclinico: form.codLabclinico,
    tipoServicio: "",
    numTicket: 0,
    fechaLab: form.fecha,

    //ORINA
    txtColorEf: form.color,
    txtDensidadEf: form.densidad,
    txtAspectoEf: form.aspecto,
    txtPhEf: form.ph,
    //EXAMEN QUIMICO
    txtNitritosEq: form.nitritos,
    txtProteinasEq: form.proteinas,
    txtCetonasEq: form.cetonas,
    txtLeucocitosEq: form.leucocitosExamenQuimico,
    txtAcAscorbico: form.acAscorbico,
    txtUrobilinogenoEq: form.urobilinogeno,
    txtBilirrubinaEq: form.bilirrubina,
    txtGlucosaEq: form.glucosaExamenQuimico,
    txtSangreEq: form.sangre,
    //SEDIMIENTO
    txtLeucocitosSu: form.leucocitosSedimentoUnitario,
    txtCelEpitelialesSu: form.celEpiteliales,
    txtCilindrosSu: form.cilindros,
    txtBacteriasSu: form.bacterias,
    txtHematiesSu: form.hematiesSedimentoUnitario,
    txtCristalesSu: form.cristales,
    txtPusSu: form.gramSc,
    txtOtrosSu: form.otros,

    esOrina: true,

    userMedicoOcup: "",

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este backend reutiliza la clave "fechaRegistro" para
// la fecha del examen (no es un campo de auditoría aquí), por eso se sobrescribe después de sellar.
const construirBody = (form, user, esActualizacion) => {
    const sellado = sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro,
        fechaRegistro: form.fechaRegistro,
    });
    return { ...sellado, fechaRegistro: form.fecha };
};

// ===== Impresión =====
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
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Examen de Orina",
                    "warning"
                );
            }),
    });

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
