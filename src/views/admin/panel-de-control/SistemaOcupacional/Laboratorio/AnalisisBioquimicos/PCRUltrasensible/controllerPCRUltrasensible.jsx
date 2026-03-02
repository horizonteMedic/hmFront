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

// CAMBIAR SOLO LAS URL
const obtenerReporteUrl = "/api/v01/ct/analisisBioquimico/obtenerReportePCRUltrasensible";
const registrarUrl = "/api/v01/ct/analisisBioquimico/registrarActualizarPCRUltrasensible";

// ===================== GET INFO SERVICIO =====================
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

            // CAMPOS PCR
            resultado: res.resultado ?? "",
            muestra: res.muestra ?? "SALIVA",
            examenDirecto: res.examenDirecto ?? false,
            pruebaRapida: res.pruebaRapida ?? "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
            user_doctorAsignado: res.doctorAsignado,
        }));
    }
};

// ===================== SUBMIT =====================
export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        codAb: form.codAb,
        fechaAb: form.fecha,

        resultado: form.resultado,
        muestra: form.muestra,
        examenDirecto: form.examenDirecto,
        pruebaRapida: form.pruebaRapida,

        userRegistro: user,
        userMedicoOcup: "",
        nOrden: form.norden,

        numTicket: 0,
        txtReponsable: user,
        fechaRegistro: form.fecha,

        esPCRUltrasensible: true,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

// ===================== PRINT =====================
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

// ===================== VERIFY =====================
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            // NO tiene registro
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // SI tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de PCR Ultrasensible",
                    "warning"
                );
            });
        }
    );
};

// ===================== GET INFO PAC =====================
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

// ===================== LOADING =====================
export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};