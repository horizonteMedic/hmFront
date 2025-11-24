import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { getToday } from "../../../../../../utils/helpers";

// Endpoints (placeholder, ajustar cuando estén disponibles)
const obtenerReporteUrl = "";
const registrarUrl = "";
const today = getToday();

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
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden,
            nombreExamen: res.nombreExamen,
            fechaExamen: res.fecha ?? prev.fechaExamen ?? today,
            nombres: res.nombresPaciente ?? "",
            apellidos: res.apellidosPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            esApto: res.apto ? true : false,
            sindromeBurnout: res.sindromeBurnout ?? "",
            agotamientoEmocional: res.agotamientoEmocional ?? "",
            despersonalizacion: res.despersonalizacion ?? "",
            realizacionPersonal: res.realizacionPersonal ?? "",
            resultados: res.resultados ?? "",
            conclusiones: res.conclusiones ?? "",
            recomendaciones: res.recomendaciones ?? "",
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
    const body = {
        norden: form.norden,
        fecha: form.fechaExamen,
        nombreExamen: form.nombreExamen,
        nombresPaciente: form.nombres,
        apellidosPaciente: form.apellidos,
        dniPaciente: form.dni,
        edadPaciente: form.edad,

        // Burnout
        sindromeBurnout: form.sindromeBurnout,
        agotamientoEmocional: form.agotamientoEmocional,
        despersonalizacion: form.despersonalizacion,
        realizacionPersonal: form.realizacionPersonal,
        resultados: form.resultados,
        conclusiones: form.conclusiones,
        recomendaciones: form.recomendaciones,

        // Aptitud
        apto: form.esApto ? true : false,
        noApto: form.esApto ? true : false,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob(
        "../../../../../jaspers/ModuloPsicologia/InformeBurnout/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloPsicologia/InformeBurnout"
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
            // NO tiene registro: cargar datos personales
            GetInfoPac(nro, set, token, sede);
        },
        () => {
            // Tiene registro: obtener datos del servicio
            GetInfoServicio(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Informe Burnout.",
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
            nombres: res.nombresPaciente ?? res.nombresApellidos ?? "",
            apellidos: res.apellidosPaciente ?? "",
            dni: res.dni ?? res.dniPaciente ?? "",
            edad: res.edad ?? res.edadPaciente ?? "",
            nombreExamen: res.nomExam ?? prev.nombreExamen ?? "",
            fechaExamen: prev.fechaExamen,
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};