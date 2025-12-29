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

// Endpoints (placeholder, ajustar cuando estén disponibles)
const obtenerReporteUrl = "/api/v01/ct/informeBurnout/obtenerReporteInformeBurnout";
const registrarUrl = "/api/v01/ct/informeBurnout/registrarActualizarInformeBurnout";

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
            norden: res.norden ?? "",
            fecha: res.fecha,

            nombreExamen: res.nombreExamen ?? "",
            dni: res.dniPaciente ?? "",

            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
            lugarNacimiento: res.lugarNacimientoPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
            estadoCivil: res.estadoCivilPaciente ?? "",
            nivelEstudios: res.nivelEstudioPaciente ?? "",
            // Datos Laborales
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            ocupacion: res.ocupacionPaciente ?? "",
            cargoDesempenar: res.cargoPaciente ?? "",

            // Síndrome de Burnout
            sindromeBurnout: res.sindromeBurnout ?? "",
            agotamientoEmocional: res.agotamientoEmocional ?? "",
            despersonalizacion: res.despersonalizacion ?? "",
            realizacionPersonal: res.realizacionPersonal ?? "",

            // Textos libres
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
        fecha: form.fecha,
        sindromeBurnout: form.sindromeBurnout,
        agotamientoEmocional: form.agotamientoEmocional,
        despersonalizacion: form.despersonalizacion,
        realizacionPersonal: form.realizacionPersonal,
        resultados: form.resultados,
        conclusiones: form.conclusiones,
        recomendaciones: form.recomendaciones,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob(
        "../../../../../../jaspers/ModuloPsicologia/InformeBurnout/*.jsx"
    );
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformeBurnout"
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