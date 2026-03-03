import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRJsReportDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl = "/api/v01/ct/etanolSaliva/obtenerReporte";
const obtenerReporteJsReportUrl = "/api/v01/ct/etanolSaliva/descargarReporte";
const registrarUrl = "/api/v01/ct/etanolSaliva/registrarActualizar";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );

    console.log("Respuesta Etanol Saliva:", res);

    if (res) {
        set((prev) => ({
            ...prev,
            norden: res.norden ?? "",
            fecha: res.fechaExamen,
            nombres: res.nombres ?? "",
            apellidos: res.apellidos ?? "",
            edad: res.edad ?? "",

            resultado: res.resultado ?? "",
            muestra: (res.muestra ?? "").toUpperCase(),
            pruebaRapida: res.pruebaRapida ?? "",

            user_medicoFirma: res.usuarioFirma ?? "",
            user_doctorAsignado: res.doctorAsignado ?? "",

            nombreExamen: res.tipoExamen ?? "",

            dni: res.dniPaciente ?? "",
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.cargoPaciente ?? "",
            cargoDesempenar: res.areaPaciente ?? "",

            resultado: res.resultado ?? "",
            muestra: res.muestra ?? "",


            user_medicoFirma: res.usuarioFirma ?? "",
            user_doctorAsignado: res.doctorAsignado ?? "",
        }));
    }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }

    const body = {
        muestra: form.muestra,
        resultado: form.resultado,
        userRegistro: user,
        fechaExamen: form.fecha,
        norden: form.norden,

        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const PrintHojaR = (nro, token, tabla) => {
    PrintHojaRJsReportDefault(nro, token, tabla, obtenerReporteJsReportUrl);
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Etanol en Saliva",
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
            sexo:
                res.genero === "M"
                    ? "MASCULINO"
                    : res.genero === "F"
                        ? "FEMENINO"
                        : "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};