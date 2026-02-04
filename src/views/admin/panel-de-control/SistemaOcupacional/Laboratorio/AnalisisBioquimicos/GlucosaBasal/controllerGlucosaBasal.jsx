import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl = "/api/v01/ct/analisisBioquimico/obtenerReporteGlucosaBasal";
const registrarUrl = "/api/v01/ct/analisisBioquimico/registrarActualizarGlucosaBasal";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
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
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        codAb: form.codAb,
        fechaAb: form.fecha,
        txtColesterol: form.colesterolTotal,
        txtLdlColesterol: form.ldl,
        txtHdlColesterol: form.hdl,
        txtVldlColesterol: form.vldl,
        txtTrigliseridos: form.trigliceridos,
        glucBasal: form.glucosaBasal,
        userRegistro: user,
        userMedicoOcup: "",
        nOrden: form.norden,

        numTicket: 0,
        txtReponsable: user,
        txtCreatinina: "",
        fechaRegistro: form.fecha,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

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

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Glucosa Basal",
                    "warning"
                );
            });
        }
    );
};

const GetInfoPac = async (nro, set, token, sede) => {
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
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
