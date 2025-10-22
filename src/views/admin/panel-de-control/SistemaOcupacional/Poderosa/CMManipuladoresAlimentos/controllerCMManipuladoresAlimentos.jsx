import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";

const obtenerReporteUrl =
    "";
const registrarUrl =
    "";

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
            fechaExam: res.fechaExamen_fecha,
            nombreExamen: res.nombreExamen,
            esApto: res.apto_apto,

            // Datos personales
            nombres: res.nombresPaciente,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,
            cargo: res.cargoPaciente,
            areaTrabajo: res.areaTrabajoPaciente,

            // Médico

            // Recomendaciones
            recomendaciones: res.recomendaciones,
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
    if (form.esApto === undefined) {
        await Swal.fire("Error", "Por favor, seleccione la aptitud.", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaExamen: form.fechaExam,
        nombreExamen: form.nombreExamen,
        esApto: form.esApto,

        // Datos personales
        nombres: form.nombres,
        dni: form.dni,
        edad: form.edad,
        sexo: form.sexo,
        empresa: form.empresa,
        contrata: form.contrata,
        cargo: form.cargo,
        areaTrabajo: form.areaTrabajo,

        // Médico
        nombre_medico: form.nombre_medico,

        // Recomendaciones
        recomendaciones: form.recomendaciones,

        usuarioRegistro: user,
    };
    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/Poderosa/CMManipuladoresAlimentos/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Poderosa/CMManipuladoresAlimentos"
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
                    "Este paciente ya cuenta con registros de Certificado de Manipuladores de Alimentos.",
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
            nombres: res.nombres,
            dni: res.dni,
            edad: res.edad + " AÑOS",
            sexo: res.sexo,
            empresa: res.empresa,
            contrata: res.contrata,
            cargo: res.cargo ?? "",
            areaTrabajo: res.areaO ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};