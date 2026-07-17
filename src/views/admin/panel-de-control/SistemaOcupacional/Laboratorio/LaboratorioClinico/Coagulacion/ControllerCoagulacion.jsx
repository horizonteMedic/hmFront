import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";
import { getFetch } from "../../../../../../utils/apiHelpers.js";
import CoagulacionReporte from "../../../../../../jaspers/LaboratorioClinico/Coagulacion.jsx";

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