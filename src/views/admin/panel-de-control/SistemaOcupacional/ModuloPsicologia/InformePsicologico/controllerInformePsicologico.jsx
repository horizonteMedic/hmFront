import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
    "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico";
const registrarUrl =
    "/api/v01/ct/informePsicologico/obtenerReporteInformePsicologico";

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
            codigoInforme: res.codigoInforme,
            fechaEntrevista: res.fechaEntrevista || "",
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: res.fechaNacimientoPaciente,
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            edad: res.edadPaciente,
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos Laborales
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            // Área Intelectual
            areaIntelectual: res.areaIntelectual || "EL EVALUADO POSEE UN NIVEL INTELECTUAL PROMEDIO.",
            promedio: false, //revisar - no hay mapeo directo en JSON
            superior: false, //revisar - no hay mapeo directo en JSON
            nInferior: false, //revisar - no hay mapeo directo en JSON
            alto: false, //revisar - no hay mapeo directo en JSON

            pSuperior: false, //revisar - no hay mapeo directo en JSON
            pMedio: false, //revisar - no hay mapeo directo en JSON
            pBajo: false, //revisar - no hay mapeo directo en JSON
            bajo: false, //revisar - no hay mapeo directo en JSON

            facilidad: false, //revisar - no hay mapeo directo en JSON
            dificultad: false, //revisar - no hay mapeo directo en JSON

            pnAdecuado: false, //revisar - no hay mapeo directo en JSON
            nAlto: false, //revisar - no hay mapeo directo en JSON
            nBajo: false, //revisar - no hay mapeo directo en JSON

            yNumerica: false, //revisar - no hay mapeo directo en JSON
            yCalculo: false, //revisar - no hay mapeo directo en JSON

            adecuadaR: false, //revisar - no hay mapeo directo en JSON
            inadecuada: false, //revisar - no hay mapeo directo en JSON

            // Área de Personalidad
            areaPersonalidad: res.areaPersonalidad,

            // Área de Psicomotricidad
            areaPsicomotricidad: res.areaPsicomotricidad,
            nivelAltoPs: false, //revisar - no hay mapeo directo en JSON
            nivelAdecuadoPs: false, //revisar - no hay mapeo directo en JSON
            nivelBajoPs: false, //revisar - no hay mapeo directo en JSON

            facilidadPs: false, //revisar - no hay mapeo directo en JSON
            dificultadPs: false, //revisar - no hay mapeo directo en JSON

            // Área de Organicidad
            areaOrganicidad: res.areaOrganicidad,
            orientadoEnTiempo: false, //revisar - no hay mapeo directo en JSON

            poseeAltoManejo: false, //revisar - no hay mapeo directo en JSON
            pAdecuadoManejo: false, //revisar - no hay mapeo directo en JSON
            pBajoManejo: false, //revisar - no hay mapeo directo en JSON

            noSeEnvidencia: false, //revisar - no hay mapeo directo en JSON

            // Recomendaciones
            recomendaciones: res.recomendaciones,

            // Aprobó Test
            aproboTest: res.aprobo ?? false,
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
        codigoInforme: form.codigoInforme,
        norden: form.norden,
        fechaEntrevista: form.fechaEntrevista,
        edad: form.edad.replace(" AÑOS", ""),
        areaIntelectual: form.areaIntelectual,
        areaPersonalidad: form.areaPersonalidad,
        areaOrganicidad: form.areaOrganicidad,
        areaPsicomotricidad: form.areaPsicomotricidad,
        recomendaciones: form.recomendaciones,
        aproboTest: form.aproboTest ?? false,
        desaproboTest: form.aproboTest ?? false,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../jaspers/ModuloPsicologia/InformePsicologico/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/ModuloPsicologia/InformePsicologico"
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
                    "Este paciente ya cuenta con registros de Informe Psicologico.",
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
            fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad + " años",
            nombres: res.nombresApellidos,
        }));
    }
};


export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
