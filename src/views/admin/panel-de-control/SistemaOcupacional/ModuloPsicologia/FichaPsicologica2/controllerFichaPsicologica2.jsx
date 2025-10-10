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
            fechaExamen: res.fechaExamen || "",
            nombres: res.nombresPaciente,
            apellidos: res.apellidosPaciente,
            fechaNacimiento: res.fechaNacimientoPaciente,
            lugarNacimiento: res.lugarNacimientoPaciente,
            domicilioActual: res.direccionPaciente,
            edad: String(res.edadPaciente) + " AÑOS",
            estadoCivil: res.estadoCivilPaciente,
            nivelEstudios: res.nivelEstudioPaciente,

            // Datos Laborales
            ocupacion: res.ocupacionPaciente,
            cargoDesempenar: res.cargoPaciente,

            // Motivo de evaluación
            motivoEvaluacion: res.motivoEvaluacion ?? "",

            // Observación de Conductas
            presentacion: res.presentacion ?? "",
            postura: res.postura ?? "",
            discursoRitmo: res.discursoRitmo ?? "",
            discursoTono: res.discursoTono ?? "",
            discursoArticulacion: res.discursoArticulacion ?? "",
            orientacionTiempo: res.orientacionTiempo ?? "",
            orientacionEspacio: res.orientacionEspacio ?? "",
            orientacionPersona: res.orientacionPersona ?? "",

            // Resultados de evaluación
            nivelIntelectual: res.nivelIntelectual ?? "",
            coordinacionVisomotriz: res.coordinacionVisomotriz ?? "",
            nivelMemoria: res.nivelMemoria ?? "",
            personalidad: res.personalidad ?? "",
            afectividad: res.afectividad ?? "",

            // Recomendaciones y Conclusiones
            recomendaciones: res.recomendaciones ?? "",
            areaCognitiva: res.areaCognitiva ?? "",
            areaEmocional: res.areaEmocional ?? "",

            // Aptitud
            esApto: res.esApto ?? false,
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
        fechaExamen: form.fechaExamen,
        edad: form.edad.replace(" AÑOS", ""),
        motivoEvaluacion: form.motivoEvaluacion,
        
        // Observación de Conductas
        presentacion: form.presentacion,
        postura: form.postura,
        discursoRitmo: form.discursoRitmo,
        discursoTono: form.discursoTono,
        discursoArticulacion: form.discursoArticulacion,
        orientacionTiempo: form.orientacionTiempo,
        orientacionEspacio: form.orientacionEspacio,
        orientacionPersona: form.orientacionPersona,

        // Resultados de evaluación
        nivelIntelectual: form.nivelIntelectual,
        coordinacionVisomotriz: form.coordinacionVisomotriz,
        nivelMemoria: form.nivelMemoria,
        personalidad: form.personalidad,
        afectividad: form.afectividad,

        // Recomendaciones y Conclusiones
        recomendaciones: form.recomendaciones,
        areaCognitiva: form.areaCognitiva,
        areaEmocional: form.areaEmocional,

        // Aptitud
        esApto: form.esApto ?? false,
        usuarioRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../jaspers/ModuloPsicologia/FichaPsicologica2/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/ModuloPsicologia/FichaPsicologica2"
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
                    "Este paciente ya cuenta con registros de Ficha Psicológica 2.",
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
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            edad: res.edad + " AÑOS",
            ocupacion: res.areaO ?? "",
            cargoDesempenar: res.cargo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};