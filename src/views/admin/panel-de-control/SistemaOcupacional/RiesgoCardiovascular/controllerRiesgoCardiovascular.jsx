import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    SubmitDataServiceDefault,
    VerifyTRPerzonalizadoDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { convertirGenero } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/riesgoCardiovascular/obtenerReporte";
const registrarUrl = "/api/v01/ct/riesgoCardiovascular/registrarActualizar";

export const GetInfoServicio = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        const rese = res.resultado || {}
        set((prev) => ({
            ...prev,
            norden: rese.norden ?? "",
            id: rese.id,
            nombreExamen: rese.tipoExamen ?? "",
            dni: rese.dniPaciente ?? "",

            nombres: `${rese.nombresPaciente ?? ""} ${rese.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            edad: rese.edadPaciente ?? "",
            sexo: convertirGenero(rese.sexoPaciente),
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",
            // Datos Laborales
            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",
            ocupacion: rese.areaPaciente ?? "",
            cargoDesempenar: rese.cargoPaciente ?? "",

            diabetes: rese.diabetes ?? false,
            fuma: rese.fuma ?? false,
            tensionSistolica: rese.sistolica
                ? parseInt(rese.sistolica).toString()
                : "",

            tensionDiastolica: rese.diastolica
                ? parseInt(rese.diastolica).toString()
                : "",

            colesterolTotal: rese.colesterol
                ? parseInt(rese.colesterol).toString()
                : "",

            colesterolHdl: rese.hdlColesterol
                ? parseInt(rese.hdlColesterol).toString()
                : "",

            trigliceridos: rese.trigliseridos
                ? parseInt(rese.trigliseridos).toString()
                : "",

            colesterolLdl: rese.ldlColesterol
                ? parseInt(rese.ldlColesterol).toString()
                : "",
        }));
    }
};
export const GetInfoServicioEditar = async (
    nro,
    tabla,
    set,
    token,
    onFinish = () => { }
) => {
    const res = await GetInfoServicioDefault(
        nro,
        tabla,
        token,
        obtenerReporteUrl,
        onFinish
    );
    if (res) {
        const rese = res.resultado || {}
        set((prev) => ({
            ...prev,
            norden: rese.norden ?? "",
            id: rese.id,
            fecha: rese.fecha,
            nombreExamen: rese.tipoExamen ?? "",
            dni: rese.dniPaciente ?? "",

            nombres: `${rese.nombresPaciente ?? ""} ${rese.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(rese.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: rese.lugarNacimientoPaciente ?? "",
            edad: rese.edadPaciente ?? "",
            sexo: convertirGenero(rese.sexoPaciente),
            estadoCivil: rese.estadoCivilPaciente ?? "",
            nivelEstudios: rese.nivelEstudioPaciente ?? "",
            // Datos Laborales
            empresa: rese.empresa ?? "",
            contrata: rese.contrata ?? "",
            ocupacion: rese.areaPaciente ?? "",
            cargoDesempenar: rese.cargoPaciente ?? "",

            diabetes: rese.diabetes ?? false,
            fuma: rese.fuma ?? false,
            tensionSistolica: rese.sistolica
                ? parseInt(rese.sistolica).toString()
                : "",

            tensionDiastolica: rese.diastolica
                ? parseInt(rese.diastolica).toString()
                : "",

            colesterolTotal: rese.colesterol
                ? parseInt(rese.colesterol).toString()
                : "",

            colesterolHdl: rese.hdlColesterol
                ? parseInt(rese.hdlColesterol).toString()
                : "",

            trigliceridos: rese.trigliseridos
                ? parseInt(rese.trigliseridos).toString()
                : "",

            colesterolLdl: rese.ldlColesterol
                ? parseInt(rese.ldlColesterol).toString()
                : "",
            user_medicoFirma: rese.usuarioFirma ? rese.usuarioFirma : prev.user_medicoFirma,
        }));
    }
};

export const SubmitDataService = async (
    form,
    token,
    user,
    limpiar,
    tabla,
    datosFooter
) => {
    if (!form.norden) {
        await Swal.fire("Error", "Datos Incompletos", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fecha: form.fecha,
        id: form.id,
        riesgoCoronario: form.riesgoEventoCoronario10,
        riesgoIdeal: form.riesgoIdealEventoCoronario10,
        riesgoPromedio: form.riesgoPromedioEventoCoronario10,
        riesgoPromedioSevero: form.riesgoPromedioEventoCoronarioSevero10,

        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

// export const PrintHojaR = (nro, token, tabla, datosFooter) => {
//     const jasperModules = import.meta.glob("../../../../../../jaspers/RiesgoCardiovascular/*.jsx");
//     PrintHojaRDefault(
//         nro,
//         token,
//         tabla,
//         datosFooter,
//         obtenerReporteUrl,
//         jasperModules,
//         "../../../../../../jaspers/RiesgoCardiovascular"
//     );
// };
export const PrintHojaR = (nro, token, tabla) => {
    Loading('Cargando Formato a Imprimir')
    getFetch(`${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`, token)
        .then(async (res) => {
            if (res?.resultado?.norden) {
                const nombre = res.resultado?.nameJasper || res.resultado?.namejasper;
                const jasperModules = import.meta.glob('../../../../jaspers/RiesgoCardiovascular/*.jsx');
                const modulo = await jasperModules[`../../../../jaspers/RiesgoCardiovascular/${nombre}.jsx`]();
                // Ejecuta la función exportada por default con los datos
                if (typeof modulo.default === 'function') {
                    modulo.default(res.resultado);
                } else {
                    console.error(`El archivo ${nombre}.jsx no exporta una función por defecto`);
                }
                Swal.close()
            } else {
                Swal.close()
            }
        })
}

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.close();
            });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Riesgo Cardiovascular.",
                    "warning"
                );
            });
        },
        () => {
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Antecedentes Patológicos, Perfil Lipídico y Triaje.",
                "warning"
            );
        }
    );
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
