import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";

const obtenerReporteUrl = "/api/v01/ct/tiempoCoagulacionSangria/obtenerReporte";
const registrarUrl = "/api/v01/ct/tiempoCoagulacionSangria/registrarActualizar"

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
    let res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        res = res.resultado
        set((prev) => ({
            ...prev,
            fecha: res.fechaExamen ?? prev.fecha,

            nombreExamen: res.tipoExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: res.nombresPaciente + ' ' + res.apellidosPaciente,
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
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        tiempoCoagulacionResultado: form.coagulacion,
        tiempoSangriaResultado: form.sangria,
        fechaExamen: form.fecha,
        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
        doctorAsignado: form.user_doctorAsignado,
        norden: form.norden,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla);
    });
};

export const PrintHojaR = async (nro, token, tabla) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/LaboratorioClinico/*.jsx"
    );
    await PrintHojaRDefault(
        nro,
        token,
        tabla,
        null,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/LaboratorioClinico"
    );
};
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    await VerifyTRDefault(
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
                    "Este paciente ya cuenta con registros de Hematología",
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