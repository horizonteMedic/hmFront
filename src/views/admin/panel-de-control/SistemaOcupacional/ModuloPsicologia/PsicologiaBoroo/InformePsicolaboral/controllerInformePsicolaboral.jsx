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

const obtenerReporteUrl =
    "/api/v01/ct/informePsicolaboral/obtenerReporteInformePsicolaboral";
const registrarUrl =
    "/api/v01/ct/informePsicolaboral/registrarActualizarInformePsicolaboral";
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
            tipoExamen: res.nombreExamen,
            anual: res.nombreExamen == "ANUAL",
            fechaExam: res.fecha,
            nombres: `${res.nombresPaciente} ${res.apellidosPaciente}`,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            empresa: res.empresa,
            contrata: res.contrata,
            // Campos usados por la interfaz principal
            puestoPostula: res.cargoPaciente,
            puestoActual: res.ocupacionPaciente,
            esApto: res.apto ? true : false,
            // ASPECTO INTELECTUAL
            razonamientoProblemas: res.aspectoIntelectual1I ? "I" : res.aspectoIntelectual1NP ? "NP" : res.aspectoIntelectual1NPI ? "NPI" : res.aspectoIntelectual1NPS ? "NPS" : res.aspectoIntelectual1S ? "S" : undefined, // I, NP1, NP, NPS, S
            memoria: res.aspectoIntelectual2I ? "I" : res.aspectoIntelectual2NP ? "NP" : res.aspectoIntelectual2NPI ? "NPI" : res.aspectoIntelectual2NPS ? "NPS" : res.aspectoIntelectual2S ? "S" : undefined,
            atencionConcentracion: res.aspectoIntelectual3I ? "I" : res.aspectoIntelectual3NP ? "NP" : res.aspectoIntelectual3NPI ? "NPI" : res.aspectoIntelectual3NPS ? "NPS" : res.aspectoIntelectual3S ? "S" : undefined,
            coordinacionVisoMotora: res.aspectoIntelectual4I ? "I" : res.aspectoIntelectual4NP ? "NP" : res.aspectoIntelectual4NPI ? "NPI" : res.aspectoIntelectual4NPS ? "NPS" : res.aspectoIntelectual4S ? "S" : undefined,
            orientacionEspacial: res.aspectoIntelectual5I ? "I" : res.aspectoIntelectual5NP ? "NP" : res.aspectoIntelectual5NPI ? "NPI" : res.aspectoIntelectual5NPS ? "NPS" : res.aspectoIntelectual5S ? "S" : undefined,
            comprensionVerbal: res.aspectoIntelectual6I ? "I" : res.aspectoIntelectual6NP ? "NP" : res.aspectoIntelectual6NPI ? "NPI" : res.aspectoIntelectual6NPS ? "NPS" : res.aspectoIntelectual6S ? "S" : undefined,

            // ASPECTOS PERSONALIDAD
            estabilidadEmocional: res.aspectoPersonalidad1A ? "A" : res.aspectoPersonalidad1B ? "B" : res.aspectoPersonalidad1NP ? "NP" : res.aspectoPersonalidad1NPA ? "NPA" : res.aspectoPersonalidad1NPB ? "NPB" : undefined, // B, NPB, NP, NPA, A
            toleranciaFrustracion: res.aspectoPersonalidad2A ? "A" : res.aspectoPersonalidad2B ? "B" : res.aspectoPersonalidad2NP ? "NP" : res.aspectoPersonalidad2NPA ? "NPA" : res.aspectoPersonalidad2NPB ? "NPB" : undefined,
            autoestima: res.aspectoPersonalidad3A ? "A" : res.aspectoPersonalidad3B ? "B" : res.aspectoPersonalidad3NP ? "NP" : res.aspectoPersonalidad3NPA ? "NPA" : res.aspectoPersonalidad3NPB ? "NPB" : undefined,
            asertividad: res.aspectoPersonalidad4A ? "A" : res.aspectoPersonalidad4B ? "B" : res.aspectoPersonalidad4NP ? "NP" : res.aspectoPersonalidad4NPA ? "NPA" : res.aspectoPersonalidad4NPB ? "NPB" : undefined,
            ansiedadEstado: res.aspectoPersonalidad5A ? "A" : res.aspectoPersonalidad5B ? "B" : res.aspectoPersonalidad5NP ? "NP" : res.aspectoPersonalidad5NPA ? "NPA" : res.aspectoPersonalidad5NPB ? "NPB" : undefined,
            ansiedadRasgo: res.aspectoPersonalidad6A ? "A" : res.aspectoPersonalidad6B ? "B" : res.aspectoPersonalidad6NP ? "NP" : res.aspectoPersonalidad6NPA ? "NPA" : res.aspectoPersonalidad6NPB ? "NPB" : undefined,

            // ASPECTOS PSICOLABORALES
            capacidadInfluencia: res.aspectosPsicolaborales1A ? "A" : res.aspectosPsicolaborales1D ? "D" : res.aspectosPsicolaborales1NA ? "NA" : res.aspectosPsicolaborales1NM ? "NM" : res.aspectosPsicolaborales1PD ? "PD" : undefined,// PD, NM, A, D, E
            adaptacionCambios: res.aspectosPsicolaborales2A ? "A" : res.aspectosPsicolaborales2D ? "D" : res.aspectosPsicolaborales2NA ? "NA" : res.aspectosPsicolaborales2NM ? "NM" : res.aspectosPsicolaborales2PD ? "PD" : undefined,
            trabajoEquipoColaboracion: res.aspectosPsicolaborales3A ? "A" : res.aspectosPsicolaborales3D ? "D" : res.aspectosPsicolaborales3NA ? "NA" : res.aspectosPsicolaborales3NM ? "NM" : res.aspectosPsicolaborales3PD ? "PD" : undefined,
            orientacionAccionMejoraProcesos: res.aspectosPsicolaborales4A ? "A" : res.aspectosPsicolaborales4D ? "D" : res.aspectosPsicolaborales4NA ? "NA" : res.aspectosPsicolaborales4NM ? "NM" : res.aspectosPsicolaborales4PD ? "PD" : undefined,
            autonomiaProactividad: res.aspectosPsicolaborales5A ? "A" : res.aspectosPsicolaborales5D ? "D" : res.aspectosPsicolaborales5NA ? "NA" : res.aspectosPsicolaborales5NM ? "NM" : res.aspectosPsicolaborales5PD ? "PD" : undefined,
            tomaDecisiones: res.aspectosPsicolaborales6A ? "A" : res.aspectosPsicolaborales6D ? "D" : res.aspectosPsicolaborales6NA ? "NA" : res.aspectosPsicolaborales6NM ? "NM" : res.aspectosPsicolaborales6PD ? "PD" : undefined,
            crecimientoPersonal: res.aspectosPsicolaborales7A ? "A" : res.aspectosPsicolaborales7D ? "D" : res.aspectosPsicolaborales7NA ? "NA" : res.aspectosPsicolaborales7NM ? "NM" : res.aspectosPsicolaborales7PD ? "PD" : undefined,
            motivacion: res.aspectosPsicolaborales8A ? "A" : res.aspectosPsicolaborales8D ? "D" : res.aspectosPsicolaborales8NA ? "NA" : res.aspectosPsicolaborales8NM ? "NM" : res.aspectosPsicolaborales8PD ? "PD" : undefined,


            user_medicoFirma: res.usuarioFirma,
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
        "norden": form.norden,
        "fecha": form.fechaExam,
        anual: form.anual ?? false,
        "aspectoIntelectual1I": form.razonamientoProblemas === "I" ? true : false,
        "aspectoIntelectual1NPI": form.razonamientoProblemas === "NPI" ? true : false,
        "aspectoIntelectual1NP": form.razonamientoProblemas === "NP" ? true : false,
        "aspectoIntelectual1NPS": form.razonamientoProblemas === "NPS" ? true : false,
        "aspectoIntelectual1S": form.razonamientoProblemas === "S" ? true : false,
        "aspectoIntelectual2I": form.memoria === "I" ? true : false,
        "aspectoIntelectual2NPI": form.memoria === "NPI" ? true : false,
        "aspectoIntelectual2NP": form.memoria === "NP" ? true : false,
        "aspectoIntelectual2NPS": form.memoria === "NPS" ? true : false,
        "aspectoIntelectual2S": form.memoria === "S" ? true : false,
        "aspectoIntelectual3I": form.atencionConcentracion === "I" ? true : false,
        "aspectoIntelectual3NPI": form.atencionConcentracion === "NPI" ? true : false,
        "aspectoIntelectual3NP": form.atencionConcentracion === "NP" ? true : false,
        "aspectoIntelectual3NPS": form.atencionConcentracion === "NPS" ? true : false,
        "aspectoIntelectual3S": form.atencionConcentracion === "S" ? true : false,
        "aspectoIntelectual4I": form.coordinacionVisoMotora === "I" ? true : false,
        "aspectoIntelectual4NPI": form.coordinacionVisoMotora === "NPI" ? true : false,
        "aspectoIntelectual4NP": form.coordinacionVisoMotora === "NP" ? true : false,
        "aspectoIntelectual4NPS": form.coordinacionVisoMotora === "NPS" ? true : false,
        "aspectoIntelectual4S": form.coordinacionVisoMotora === "S" ? true : false,
        "aspectoIntelectual5I": form.orientacionEspacial === "I" ? true : false,
        "aspectoIntelectual5NPI": form.orientacionEspacial === "NPI" ? true : false,
        "aspectoIntelectual5NP": form.orientacionEspacial === "NP" ? true : false,
        "aspectoIntelectual5NPS": form.orientacionEspacial === "NPS" ? true : false,
        "aspectoIntelectual5S": form.orientacionEspacial === "S" ? true : false,
        "aspectoIntelectual6I": form.comprensionVerbal === "I" ? true : false,
        "aspectoIntelectual6NPI": form.comprensionVerbal === "NPI" ? true : false,
        "aspectoIntelectual6NP": form.comprensionVerbal === "NP" ? true : false,
        "aspectoIntelectual6NPS": form.comprensionVerbal === "NPS" ? true : false,
        "aspectoIntelectual6S": form.comprensionVerbal === "S" ? true : false,
        "aspectoPersonalidad1B": form.estabilidadEmocional === "B" ? true : false,
        "aspectoPersonalidad1NPB": form.estabilidadEmocional === "NPB" ? true : false,
        "aspectoPersonalidad1NP": form.estabilidadEmocional === "NP" ? true : false,
        "aspectoPersonalidad1NPA": form.estabilidadEmocional === "NPA" ? true : false,
        "aspectoPersonalidad1A": form.estabilidadEmocional === "A" ? true : false,
        "aspectoPersonalidad2B": form.toleranciaFrustracion === "B" ? true : false,
        "aspectoPersonalidad2NPB": form.toleranciaFrustracion === "NPB" ? true : false,
        "aspectoPersonalidad2NP": form.toleranciaFrustracion === "NP" ? true : false,
        "aspectoPersonalidad2NPA": form.toleranciaFrustracion === "NPA" ? true : false,
        "aspectoPersonalidad2A": form.toleranciaFrustracion === "A" ? true : false,
        "aspectoPersonalidad3B": form.autoestima === "B" ? true : false,
        "aspectoPersonalidad3NPB": form.autoestima === "NPB" ? true : false,
        "aspectoPersonalidad3NP": form.autoestima === "NP" ? true : false,
        "aspectoPersonalidad3NPA": form.autoestima === "NPA" ? true : false,
        "aspectoPersonalidad3A": form.autoestima === "A" ? true : false,
        "aspectoPersonalidad4B": form.asertividad === "B" ? true : false,
        "aspectoPersonalidad4NPB": form.asertividad === "NPB" ? true : false,
        "aspectoPersonalidad4NP": form.asertividad === "NP" ? true : false,
        "aspectoPersonalidad4NPA": form.asertividad === "NPA" ? true : false,
        "aspectoPersonalidad4A": form.asertividad === "A" ? true : false,
        "aspectoPersonalidad5B": form.ansiedadEstado === "B" ? true : false,
        "aspectoPersonalidad5NPB": form.ansiedadEstado === "NPB" ? true : false,
        "aspectoPersonalidad5NP": form.ansiedadEstado === "NP" ? true : false,
        "aspectoPersonalidad5NPA": form.ansiedadEstado === "NPA" ? true : false,
        "aspectoPersonalidad5A": form.ansiedadEstado === "A" ? true : false,
        "aspectoPersonalidad6B": form.ansiedadRasgo === "B" ? true : false,
        "aspectoPersonalidad6NPB": form.ansiedadRasgo === "NPB" ? true : false,
        "aspectoPersonalidad6NP": form.ansiedadRasgo === "NP" ? true : false,
        "aspectoPersonalidad6NPA": form.ansiedadRasgo === "NPA" ? true : false,
        "aspectoPersonalidad6A": form.ansiedadRasgo === "A" ? true : false,
        "chkcsbajo": null,
        "chkcspromedio": null,
        "chkcsalto": null,
        "nivelAlerta": form.nivelAlerta,
        "hostigamientoSexual": form.hostigamientoSexual,
        "aspectosPsicolaborales1PD": form.capacidadInfluencia === "PD" ? true : false,
        "aspectosPsicolaborales1NM": form.capacidadInfluencia === "NM" ? true : false,
        "aspectosPsicolaborales1A": form.capacidadInfluencia === "A" ? true : false,
        "aspectosPsicolaborales1D": form.capacidadInfluencia === "D" ? true : false,
        "aspectosPsicolaborales1E": form.capacidadInfluencia === "E" ? true : false,
        "aspectosPsicolaborales2PD": form.adaptacionCambios === "PD" ? true : false,
        "aspectosPsicolaborales2NM": form.adaptacionCambios === "NM" ? true : false,
        "aspectosPsicolaborales2A": form.adaptacionCambios === "A" ? true : false,
        "aspectosPsicolaborales2D": form.adaptacionCambios === "D" ? true : false,
        "aspectosPsicolaborales2E": form.adaptacionCambios === "E" ? true : false,
        "aspectosPsicolaborales3PD": form.trabajoEquipoColaboracion === "PD" ? true : false,
        "aspectosPsicolaborales3NM": form.trabajoEquipoColaboracion === "NM" ? true : false,
        "aspectosPsicolaborales3A": form.trabajoEquipoColaboracion === "A" ? true : false,
        "aspectosPsicolaborales3D": form.trabajoEquipoColaboracion === "D" ? true : false,
        "aspectosPsicolaborales3E": form.trabajoEquipoColaboracion === "E" ? true : false,
        "aspectosPsicolaborales4PD": form.orientacionAccionMejoraProcesos === "PD" ? true : false,
        "aspectosPsicolaborales4NM": form.orientacionAccionMejoraProcesos === "NM" ? true : false,
        "aspectosPsicolaborales4A": form.orientacionAccionMejoraProcesos === "A" ? true : false,
        "aspectosPsicolaborales4D": form.orientacionAccionMejoraProcesos === "D" ? true : false,
        "aspectosPsicolaborales4E": form.orientacionAccionMejoraProcesos === "E" ? true : false,
        "aspectosPsicolaborales5PD": form.autonomiaProactividad === "PD" ? true : false,
        "aspectosPsicolaborales5NM": form.autonomiaProactividad === "NM" ? true : false,
        "aspectosPsicolaborales5A": form.autonomiaProactividad === "A" ? true : false,
        "aspectosPsicolaborales5D": form.autonomiaProactividad === "D" ? true : false,
        "aspectosPsicolaborales5E": form.autonomiaProactividad === "E" ? true : false,
        "aspectosPsicolaborales6PD": form.tomaDecisiones === "PD" ? true : false,
        "aspectosPsicolaborales6NM": form.tomaDecisiones === "NM" ? true : false,
        "aspectosPsicolaborales6A": form.tomaDecisiones === "A" ? true : false,
        "aspectosPsicolaborales6D": form.tomaDecisiones === "D" ? true : false,
        "aspectosPsicolaborales6E": form.tomaDecisiones === "E" ? true : false,
        "aspectosPsicolaborales7PD": form.crecimientoPersonal === "PD" ? true : false,
        "aspectosPsicolaborales7NM": form.crecimientoPersonal === "NM" ? true : false,
        "aspectosPsicolaborales7A": form.crecimientoPersonal === "A" ? true : false,
        "aspectosPsicolaborales7D": form.crecimientoPersonal === "D" ? true : false,
        "aspectosPsicolaborales7E": form.crecimientoPersonal === "E" ? true : false,
        "aspectosPsicolaborales8PD": form.motivacion === "PD" ? true : false,
        "aspectosPsicolaborales8NM": form.motivacion === "NM" ? true : false,
        "aspectosPsicolaborales8A": form.motivacion === "A" ? true : false,
        "aspectosPsicolaborales8D": form.motivacion === "D" ? true : false,
        "aspectosPsicolaborales8E": form.motivacion === "E" ? true : false,
        "consecuencia": form.consecuencia,
        "observaciones": form.observaciones,
        "recomendaciones": form.recomendaciones,
        "apto": form.esApto ? true : false,
        "noApto": form.esApto ? true : false,
        "usuarioRegistro": user,

        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloPsicologia/InformePsicolaboral/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloPsicologia/InformePsicolaboral"
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
                    "Este paciente ya cuenta con registros de Informe Psicolaboral.",
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
            nombres: res.nombresApellidos,
            sexo: `${res.sexoPaciente === "F" ? "Femenino" : "Masculino"}`,
            anual: res.nombreExamen == "ANUAL",
            dni: res.dni,
            edad: res.edad,
            tipoExamen: res.nomExam,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.cargo,
            puestoActual: res.areaO,
            fechaExamen: prev.fechaExamen
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};