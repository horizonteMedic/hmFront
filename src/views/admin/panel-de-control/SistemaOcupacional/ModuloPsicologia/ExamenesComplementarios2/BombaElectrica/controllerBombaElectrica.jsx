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

const obtenerReporteUrl =
    "/api/v01/ct/bombaElectrica/obtenerReporteBombaElectrica";
const registrarUrl =
    "/api/v01/ct/bombaElectrica/registrarActualizarBombaElectrica";

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
            fecha: res.fechaRegistro,

            esApto: res.cumplePerfil,

            nombreExamen: res.tipoExamen ?? "",
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
            ocupacion: res.areaPaciente ?? "",
            cargoDesempenar: res.cargoPaciente ?? "",

            temorRiesgoElectrico: res.triesgoElectrico ?? "",
            temorTareaAltura: res.ttareasAltura ?? "",
            temorEspaciosConfinados: res.tespaciosConfinados ?? "",
            manejoDeHerramientas: res.manejoHerramientas ?? "",

            // Análisis FODA
            fortalezasOportunidades: res.fodaForOpor ?? "",
            amenazasDebilidades: res.fodaAmenDebi ?? "",

            // Observaciones y Recomendaciones
            observaciones: res.observacion ?? "",
            recomendaciones: res.recomenda ?? "",

            user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
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
    if (form.esApto === undefined || form.esApto === null) {
        await Swal.fire("Error", "Debe marcar aptitud", "error");
        return;
    }
    const body = {
        norden: form.norden,
        fechaRegistro: form.fecha,
        manejoHerramientas: form.manejoDeHerramientas,
        fodaForOpor: form.fortalezasOportunidades,
        fodaAmenDebi: form.amenazasDebilidades,
        observacion: form.observaciones,
        recomenda: form.recomendaciones,
        cumplePerfil: form.esApto,
        triesgoElectrico: form.temorRiesgoElectrico,
        ttareasAltura: form.temorTareaAltura,
        tespaciosConfinados: form.temorEspaciosConfinados,

        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicoBombaElectrica/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicoBombaElectrica"
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
                    "Este paciente ya cuenta con registros de Bomba Eléctrica.",
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