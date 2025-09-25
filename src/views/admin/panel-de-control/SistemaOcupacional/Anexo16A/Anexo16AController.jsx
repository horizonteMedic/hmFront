import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/anexos/anexo16a/obtenerReporteAnexo16a";
const registrarUrl =
    "/api/v01/ct/anexos/anexo16a/registrarActualizarAnexo16a";

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
        evaluarObservacionesObtener(res, set);
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden_n_orden,
            dni: res.dni_cod_pa,
            nombres: res.nombres_nombres_pa + " " + res.apellidos_apellidos_pa,
            sexo: res.sexo_sexo_pa,
            fechaNac: formatearFechaCorta(res.fechaNacimientoPaciente_fecha_nacimiento_pa),
            edad: res.edad_edad + " años",
            actividadRealizar: res.cargo_cargo_de,
            contrata: res.contrata_razon_contrata,
            empresa: res.empresa_razon_empresa,
            fc: res.frecuenciaCardiacaTriaje_f_cardiaca,
            pa: `${res.sistolicaTriaje_sistolica}/${res.diastolicaTriaje_diastolica}`, //revisar - combinando sistólica y diastólica
            fr: res.frecuenciaRespiratoriaTriaje_f_respiratoria,
            imc: res.imcTriaje_imc,
            satO2: res.saturacionOxigenoTriaje_sat_02,
            peso: res.pesoTriaje_peso,
            talla: res.tallaTriaje_talla,
            temperatura: res.temperaturaTriaje_temperatura,
            vcOD: res.visionCercaSinCorregirOd_v_cerca_s_od ?? "",
            vlOD: res.visionLejosSinCorregirOd_v_lejos_s_od ?? "",
            vcOI: res.visionCercaSinCorregirOi_v_cerca_s_oi ?? "",
            vlOI: res.visionLejosSinCorregirOi_v_lejos_s_oi ?? "",
            vcCorregidaOD: res.odccOftalmologia_odcc ?? "",
            vlCorregidaOD: res.odlcOftalmologia_odlc ?? "",
            vclrs: res.vcOftalmologia_vc ?? "",
            vb: res.vbOftalmologia_vb ?? "",
            rp: res.rpOftalmologia_rp ?? "",
            vcCorregidaOI: res.oiccOftalmologia_oicc ?? "",
            vlCorregidaOI: res.oilcOftalmologia_oilc ?? "",
            enfermedadesOculares: res.enfermedadesOcularesOftalmo_e_oculares ?? "",
        }));
    }
};
function evaluarObservacionesObtener(res, set) {
    let imc = res.imcTriaje_imc ?? "";
    let imcValue = parseFloat(imc);

    let imcRed = false;
    let nuevasObservaciones = "";
    let obesidadMorbida = false;
    let obesidadMorbidaRed = false;

    let vcercasod = res.visionCercaSinCorregirOd_v_cerca_s_od || "";
    let vcercasoi = res.visionCercaSinCorregirOi_v_cerca_s_oi || "";

    let vcercacod = res.odccOftalmologia_odcc || "";
    let vcercacoi = res.oiccOftalmologia_oicc || "";

    let vlejossod = res.visionLejosSinCorregirOd_v_lejos_s_od || "";
    let vlejossoi = res.visionLejosSinCorregirOi_v_lejos_s_oi || "";

    let vlejoscod = res.odlcOftalmologia_odlc || "";
    let vlejoscoi = res.oilcOftalmologia_oilc || "";

    // Evaluación IMC - Convertido desde Java (líneas 150-165)
    if (!isNaN(imcValue) && imcValue > 25) {
        imcRed = true;
        if (imcValue >= 25 && imcValue < 29.91) {
            nuevasObservaciones += "- SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
        } else if (imcValue >= 29.91 && imcValue < 35) {
            obesidadMorbida = true;
            obesidadMorbidaRed = true;
            nuevasObservaciones += "- OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
        } else if (imcValue >= 35) {
            obesidadMorbida = true;
            obesidadMorbidaRed = true;
            nuevasObservaciones += "- OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
        }
    }

    // Evaluación oftalmológica - Convertido desde Java (líneas 168-175)
    let problemasOftalmologicos = false;
    let problemasOftalmologicosRed = false;

    // Verificar lentes correctores usando las variables del objeto res
    if (
        (res.odccOftalmologia_odcc && res.odccOftalmologia_odcc !== "00" && res.odccOftalmologia_odcc !== "") ||
        (res.oiccOftalmologia_oicc && res.oiccOftalmologia_oicc !== "00" && res.oiccOftalmologia_oicc !== "") ||
        (res.odlcOftalmologia_odlc && res.odlcOftalmologia_odlc !== "00" && res.odlcOftalmologia_odlc !== "") ||
        (res.oilcOftalmologia_oilc && res.oilcOftalmologia_oilc !== "00" && res.oilcOftalmologia_oilc !== "")
    ) {
        problemasOftalmologicos = true;
        problemasOftalmologicosRed = true;
        nuevasObservaciones += "- USO DE LENTES CORRECTORES.\n";
    } else if (res.visionCercaSinCorregirOd_v_cerca_s_od && res.visionCercaSinCorregirOd_v_cerca_s_od !== "") {
        // Obtener valores de los campos de visión (asumiendo que son referencias a elementos del DOM o estado)
        //****************************************************************
        if (vcercacod === "00" && vcercacoi === "00") {
            if ((vcercasod === "20/20" && vcercasoi === "20/20")
                || (vcercasod === "20/20-1" && vcercasoi === "20/20-1")
                || (vcercasod === "20/20-2" && vcercasoi === "20/20-2")
                || (vcercasod === "20/20-3" && vcercasoi === "20/20-3")
                || (vcercasod === "20/20-1" && vcercasoi === "20/20")
                || (vcercasod === "20/20" && vcercasoi === "20/20-1")
                || (vcercasod === "20/20" && vcercasoi === "20/20-2")
                || (vcercasod === "20/20-2" && vcercasoi === "20/20")
                || (vcercasod === "20/20" && vcercasoi === "20/20-3")
                || (vcercasod === "20/20-3" && vcercasoi === "20/20")
                || (vcercasod === "20/20-1" && vcercasoi === "20/20-2")
                || (vcercasod === "20/20-2" && vcercasoi === "20/20-1")
                || (vcercasod === "20/20-1" && vcercasoi === "20/20-3")
                || (vcercasod === "20/20-3" && vcercasoi === "20/20-1")
                || (vcercasod === "20/20-2" && vcercasoi === "20/20-3")
                || (vcercasod === "20/20-3" && vcercasoi === "20/20-2")) {
                if (vlejoscod === "00" && vlejoscoi === "00") {
                    if ((vlejossod === "20/20" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                        // Establecer estado para "no11" como seleccionado y color negro para "jLabel28"
                        // no11.setSelected(true);
                        // jLabel28.setForeground(Color.black);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = false;
                    } else {
                        // Establecer estado para "si11" como seleccionado y color rojo para "jLabel28"
                        // si11.setSelected(true);
                        // jLabel28.setForeground(Color.red);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = true;
                        nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                    }
                } else {
                    if ((vlejossod === "20/20" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                        // no11.setSelected(true);
                        // jLabel28.setForeground(Color.black);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = false;
                    } else if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
                        // no11.setSelected(true);
                        // jLabel28.setForeground(Color.black);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = false;
                    } else {
                        // si11.setSelected(true);
                        // jLabel28.setForeground(Color.red);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = true;
                        nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                    }
                }
            } else {
                // si11.setSelected(true);
                // jLabel28.setForeground(Color.red);
                problemasOftalmologicos = true;
                problemasOftalmologicosRed = true;
                nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
            }

        } else {
            if ((vcercacod === "20/20" && vcercacoi === "20/20")
                || (vcercacod === "20/20-1" && vcercacoi === "20/20-1")
                || (vcercacod === "20/20-2" && vcercacoi === "20/20-2")
                || (vcercacod === "20/20-3" && vcercacoi === "20/20-3")
                || (vcercacod === "20/20-1" && vcercacoi === "20/20")
                || (vcercacod === "20/20" && vcercacoi === "20/20-1")
                || (vcercacod === "20/20" && vcercacoi === "20/20-2")
                || (vcercacod === "20/20-2" && vcercacoi === "20/20")
                || (vcercacod === "20/20" && vcercacoi === "20/20-3")
                || (vcercacod === "20/20-3" && vcercacoi === "20/20")
                || (vcercacod === "20/20-1" && vcercacoi === "20/20-2")
                || (vcercacod === "20/20-2" && vcercacoi === "20/20-1")
                || (vcercacod === "20/20-1" && vcercacoi === "20/20-3")
                || (vcercacod === "20/20-3" && vcercacoi === "20/20-1")
                || (vcercacod === "20/20-2" && vcercacoi === "20/20-3")
                || (vcercacod === "20/20-3" && vcercacoi === "20/20-2")) {
                if (vlejoscod === "00" && vlejoscoi === "00") {
                    if ((vlejossod === "20/20" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                        || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                        || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                        || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                        // no11.setSelected(true);
                        // jLabel28.setForeground(Color.black);
                        problemasOftalmologicos = false;
                        problemasOftalmologicosRed = false;
                    } else {
                        // si11.setSelected(true);
                        // jLabel28.setForeground(Color.red);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = true;
                        nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                    }
                } else {
                    if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
                        || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
                        || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
                        // no11.setSelected(true);
                        // jLabel28.setForeground(Color.black);
                        problemasOftalmologicos = false;
                        problemasOftalmologicosRed = false;
                    } else {
                        // si11.setSelected(true);
                        // jLabel28.setForeground(Color.red);
                        problemasOftalmologicos = true;
                        problemasOftalmologicosRed = true;
                        nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                    }
                }
            } else {
                // si11.setSelected(true); 
                // jLabel28.setForeground(Color.red); 
                problemasOftalmologicos = true;
                problemasOftalmologicosRed = true;
                nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
            }
        }
    } else {
        problemasOftalmologicos = false;
    }

    // Evaluación de presión arterial - Convertido desde Java (líneas 176-181)
    let hipertension = false;
    let hipertensionRed = false;

    let sistolica = res.sistolicaTriaje_sistolica || "";
    let diastolica = res.diastolicaTriaje_diastolica || "";

    if (sistolica && diastolica) {
        let sistolicValue = parseFloat(sistolica);
        let diastolicValue = parseFloat(diastolica);

        if (!isNaN(sistolicValue) && !isNaN(diastolicValue) &&
            (sistolicValue >= 140 || diastolicValue >= 90)) {
            hipertension = true;
            hipertensionRed = true;
            nuevasObservaciones += "- HTA NO CONTROLADA.\n";
        }
    }

    set(prev => ({
        ...prev,
        imcRed,
        obesidadMorbida,
        obesidadMorbidaRed,
        hipertension,
        hipertensionRed,
        problemasOftalmologicos,
        problemasOftalmologicosRed,
        observaciones: nuevasObservaciones.trim(),
    }))
}
function evaluarObservacionesEditar(res, set) {
    // Variables para el estado de las evaluaciones
    let nuevasObservaciones = "";
    let imcRed = false;
    let obesidadMorbida = false;
    let obesidadMorbidaRed = false;
    let hipertension = false;
    let hipertensionRed = false;
    let problemasOftalmologicos = false;
    let problemasOftalmologicosRed = false;

    let vcercasod = res.visionCercaSinCorregirOd_v_cerca_s_od || "";
    let vcercasoi = res.visionCercaSinCorregirOi_v_cerca_s_oi || "";

    let vcercacod = res.odccOftalmologia_odcc || "";
    let vcercacoi = res.oiccOftalmologia_oicc || "";

    let vlejossod = res.visionLejosSinCorregirOd_v_lejos_s_od || "";
    let vlejossoi = res.visionLejosSinCorregirOi_v_lejos_s_oi || "";

    let vlejoscod = res.odlcOftalmologia_odlc || "";
    let vlejoscoi = res.oilcOftalmologia_oilc || "";

    if (vcercacod === "00" && vcercacoi === "00") {
        if ((vcercasod === "20/20" && vcercasoi === "20/20")
            || (vcercasod === "20/20-1" && vcercasoi === "20/20-1")
            || (vcercasod === "20/20-2" && vcercasoi === "20/20-2")
            || (vcercasod === "20/20-3" && vcercasoi === "20/20-3")
            || (vcercasod === "20/20-1" && vcercasoi === "20/20")
            || (vcercasod === "20/20" && vcercasoi === "20/20-1")
            || (vcercasod === "20/20" && vcercasoi === "20/20-2")
            || (vcercasod === "20/20-2" && vcercasoi === "20/20")
            || (vcercasod === "20/20" && vcercasoi === "20/20-3")
            || (vcercasod === "20/20-3" && vcercasoi === "20/20")
            || (vcercasod === "20/20-1" && vcercasoi === "20/20-2")
            || (vcercasod === "20/20-2" && vcercasoi === "20/20-1")
            || (vcercasod === "20/20-1" && vcercasoi === "20/20-3")
            || (vcercasod === "20/20-3" && vcercasoi === "20/20-1")
            || (vcercasod === "20/20-2" && vcercasoi === "20/20-3")
            || (vcercasod === "20/20-3" && vcercasoi === "20/20-2")) {
            if (vlejoscod === "00" && vlejoscoi === "00") {
                if ((vlejossod === "20/20" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                    // Establecer estado para "no11" como seleccionado y color negro para "jLabel28"
                    // no11.setSelected(true);
                    // jLabel28.setForeground(Color.black);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = false;
                } else {
                    // Establecer estado para "si11" como seleccionado y color rojo para "jLabel28"
                    // si11.setSelected(true);
                    // jLabel28.setForeground(Color.red);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = true;
                    nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                }
            } else {
                if ((vlejossod === "20/20" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                    // no11.setSelected(true);
                    // jLabel28.setForeground(Color.black);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = false;
                } else if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
                    // no11.setSelected(true);
                    // jLabel28.setForeground(Color.black);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = false;
                } else {
                    // si11.setSelected(true);
                    // jLabel28.setForeground(Color.red);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = true;
                    nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                }
            }
        } else {
            // si11.setSelected(true);
            // jLabel28.setForeground(Color.red);
            problemasOftalmologicos = true;
            problemasOftalmologicosRed = true;
            nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
        }

    } else {
        if ((vcercacod === "20/20" && vcercacoi === "20/20")
            || (vcercacod === "20/20-1" && vcercacoi === "20/20-1")
            || (vcercacod === "20/20-2" && vcercacoi === "20/20-2")
            || (vcercacod === "20/20-3" && vcercacoi === "20/20-3")
            || (vcercacod === "20/20-1" && vcercacoi === "20/20")
            || (vcercacod === "20/20" && vcercacoi === "20/20-1")
            || (vcercacod === "20/20" && vcercacoi === "20/20-2")
            || (vcercacod === "20/20-2" && vcercacoi === "20/20")
            || (vcercacod === "20/20" && vcercacoi === "20/20-3")
            || (vcercacod === "20/20-3" && vcercacoi === "20/20")
            || (vcercacod === "20/20-1" && vcercacoi === "20/20-2")
            || (vcercacod === "20/20-2" && vcercacoi === "20/20-1")
            || (vcercacod === "20/20-1" && vcercacoi === "20/20-3")
            || (vcercacod === "20/20-3" && vcercacoi === "20/20-1")
            || (vcercacod === "20/20-2" && vcercacoi === "20/20-3")
            || (vcercacod === "20/20-3" && vcercacoi === "20/20-2")) {
            if (vlejoscod === "00" && vlejoscoi === "00") {
                if ((vlejossod === "20/20" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20")
                    || (vlejossod === "20/20" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
                    || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
                    || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
                    // no11.setSelected(true);
                    // jLabel28.setForeground(Color.black);
                    problemasOftalmologicos = false;
                    problemasOftalmologicosRed = false;
                } else {
                    // si11.setSelected(true);
                    // jLabel28.setForeground(Color.red);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = true;
                    nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                }
            } else {
                if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
                    || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
                    || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
                    // no11.setSelected(true);
                    // jLabel28.setForeground(Color.black);
                    problemasOftalmologicos = false;
                    problemasOftalmologicosRed = false;
                } else {
                    // si11.setSelected(true);
                    // jLabel28.setForeground(Color.red);
                    problemasOftalmologicos = true;
                    problemasOftalmologicosRed = true;
                    nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
                }
            }
        } else {
            // si11.setSelected(true); 
            // jLabel28.setForeground(Color.red); 
            problemasOftalmologicos = true;
            problemasOftalmologicosRed = true;
            nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
        }
    }

    // Evaluación del IMC - Convertido desde Java
    let imc = res.imcTriaje_imc || "";
    if (imc) {
        let imcValue = parseFloat(imc);
        if (!isNaN(imcValue) && imcValue > 25) {
            imcRed = true;

            if (imcValue >= 25 && imcValue < 29.91) {
                nuevasObservaciones += "- SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
            } else if (imcValue >= 29.91 && imcValue < 35) {
                obesidadMorbida = true;
                obesidadMorbidaRed = true;
                nuevasObservaciones += "- OBESIDAD I: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
            } else if (imcValue >= 35) {
                obesidadMorbida = true;
                obesidadMorbidaRed = true;
                nuevasObservaciones += "- OBESIDAD II: NO HACER TRABAJO 1.8 M.N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.\n";
            }
        }
    }

    // Evaluación oftalmológica - Convertido desde Java
    if (
        (res.odccOftalmologia_odcc && res.odccOftalmologia_odcc !== "00" && res.odccOftalmologia_odcc !== "") ||
        (res.oiccOftalmologia_oicc && res.oiccOftalmologia_oicc !== "00" && res.oiccOftalmologia_oicc !== "") ||
        (res.odlcOftalmologia_odlc && res.odlcOftalmologia_odlc !== "00" && res.odlcOftalmologia_odlc !== "") ||
        (res.oilcOftalmologia_oilc && res.oilcOftalmologia_oilc !== "00" && res.oilcOftalmologia_oilc !== "")
    ) {
        problemasOftalmologicos = true;
        problemasOftalmologicosRed = true;
        nuevasObservaciones += "- USO DE LENTES CORRECTORES.\n";
    }

    // Evaluación de presión arterial - Convertido desde Java
    let sistolica = res.sistolicaTriaje_sistolica || "";
    let diastolica = res.diastolicaTriaje_diastolica || "";

    if (sistolica && diastolica) {
        let sistolicValue = parseFloat(sistolica);
        let diastolicValue = parseFloat(diastolica);

        if (!isNaN(sistolicValue) && !isNaN(diastolicValue) &&
            (sistolicValue >= 140 || diastolicValue >= 90)) {
            hipertension = true;
            hipertensionRed = true;
            nuevasObservaciones += "- HTA NO CONTROLADA.\n";
        }
    }
    set(prev => ({
        ...prev,
        imcRed,
        obesidadMorbida,
        obesidadMorbidaRed,
        hipertension,
        hipertensionRed,
        problemasOftalmologicos,
        problemasOftalmologicosRed,
        observaciones: nuevasObservaciones.trim()
    }))
}
// function diagnosticoOftalmologia(res, set) {
//     // Obtener valores de los campos de visión (asumiendo que son referencias a elementos del DOM o estado)
//     let vcercasod = res.visionCercaSinCorregirOd_v_cerca_s_od || "";
//     let vcercasoi = res.visionCercaSinCorregirOi_v_cerca_s_oi || "";

//     let vcercacod = res.odccOftalmologia_odcc || "";
//     let vcercacoi = res.oiccOftalmologia_oicc || "";

//     let vlejossod = res.visionLejosSinCorregirOd_v_lejos_s_od || "";
//     let vlejossoi = res.visionLejosSinCorregirOi_v_lejos_s_oi || "";

//     let vlejoscod = res.odlcOftalmologia_odlc || "";
//     let vlejoscoi = res.oilcOftalmologia_oilc || "";

//     //****************************************************************
//     if (vcercacod === "00" && vcercacoi === "00") {
//         if ((vcercasod === "20/20" && vcercasoi === "20/20")
//             || (vcercasod === "20/20-1" && vcercasoi === "20/20-1")
//             || (vcercasod === "20/20-2" && vcercasoi === "20/20-2")
//             || (vcercasod === "20/20-3" && vcercasoi === "20/20-3")
//             || (vcercasod === "20/20-1" && vcercasoi === "20/20")
//             || (vcercasod === "20/20" && vcercasoi === "20/20-1")
//             || (vcercasod === "20/20" && vcercasoi === "20/20-2")
//             || (vcercasod === "20/20-2" && vcercasoi === "20/20")
//             || (vcercasod === "20/20" && vcercasoi === "20/20-3")
//             || (vcercasod === "20/20-3" && vcercasoi === "20/20")
//             || (vcercasod === "20/20-1" && vcercasoi === "20/20-2")
//             || (vcercasod === "20/20-2" && vcercasoi === "20/20-1")
//             || (vcercasod === "20/20-1" && vcercasoi === "20/20-3")
//             || (vcercasod === "20/20-3" && vcercasoi === "20/20-1")
//             || (vcercasod === "20/20-2" && vcercasoi === "20/20-3")
//             || (vcercasod === "20/20-3" && vcercasoi === "20/20-2")) {
//             if (vlejoscod === "00" && vlejoscoi === "00") {
//                 if ((vlejossod === "20/20" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
//                     // Establecer estado para "no11" como seleccionado y color negro para "jLabel28"
//                     // no11.setSelected(true);
//                     // jLabel28.setForeground(Color.black);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = false;
//                 } else {
//                     // Establecer estado para "si11" como seleccionado y color rojo para "jLabel28"
//                     // si11.setSelected(true);
//                     // jLabel28.setForeground(Color.red);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = true;
//                     nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//                 }
//             } else {
//                 if ((vlejossod === "20/20" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
//                     // no11.setSelected(true);
//                     // jLabel28.setForeground(Color.black);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = false;
//                 } else if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
//                     // no11.setSelected(true);
//                     // jLabel28.setForeground(Color.black);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = false;
//                 } else {
//                     // si11.setSelected(true);
//                     // jLabel28.setForeground(Color.red);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = true;
//                     nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//                 }
//             }
//         } else {
//             // si11.setSelected(true);
//             // jLabel28.setForeground(Color.red);
//             problemasOftalmologicos = true;
//             problemasOftalmologicosRed = true;
//             nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//         }

//     } else {
//         if ((vcercacod === "20/20" && vcercacoi === "20/20")
//             || (vcercacod === "20/20-1" && vcercacoi === "20/20-1")
//             || (vcercacod === "20/20-2" && vcercacoi === "20/20-2")
//             || (vcercacod === "20/20-3" && vcercacoi === "20/20-3")
//             || (vcercacod === "20/20-1" && vcercacoi === "20/20")
//             || (vcercacod === "20/20" && vcercacoi === "20/20-1")
//             || (vcercacod === "20/20" && vcercacoi === "20/20-2")
//             || (vcercacod === "20/20-2" && vcercacoi === "20/20")
//             || (vcercacod === "20/20" && vcercacoi === "20/20-3")
//             || (vcercacod === "20/20-3" && vcercacoi === "20/20")
//             || (vcercacod === "20/20-1" && vcercacoi === "20/20-2")
//             || (vcercacod === "20/20-2" && vcercacoi === "20/20-1")
//             || (vcercacod === "20/20-1" && vcercacoi === "20/20-3")
//             || (vcercacod === "20/20-3" && vcercacoi === "20/20-1")
//             || (vcercacod === "20/20-2" && vcercacoi === "20/20-3")
//             || (vcercacod === "20/20-3" && vcercacoi === "20/20-2")) {
//             if (vlejoscod === "00" && vlejoscoi === "00") {
//                 if ((vlejossod === "20/20" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-2")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-1" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-1")
//                     || (vlejossod === "20/20-2" && vlejossoi === "20/20-3")
//                     || (vlejossod === "20/20-3" && vlejossoi === "20/20-2")) {
//                     // no11.setSelected(true);
//                     // jLabel28.setForeground(Color.black);
//                     problemasOftalmologicos = false;
//                     problemasOftalmologicosRed = false;
//                 } else {
//                     // si11.setSelected(true);
//                     // jLabel28.setForeground(Color.red);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = true;
//                     nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//                 }
//             } else {
//                 if ((vlejoscod === "20/20" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-2")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-1" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-1")
//                     || (vlejoscod === "20/20-2" && vlejoscoi === "20/20-3")
//                     || (vlejoscod === "20/20-3" && vlejoscoi === "20/20-2")) {
//                     // no11.setSelected(true);
//                     // jLabel28.setForeground(Color.black);
//                     problemasOftalmologicos = false;
//                     problemasOftalmologicosRed = false;
//                 } else {
//                     // si11.setSelected(true);
//                     // jLabel28.setForeground(Color.red);
//                     problemasOftalmologicos = true;
//                     problemasOftalmologicosRed = true;
//                     nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//                 }
//             }
//         } else {
//             // si11.setSelected(true); 
//             // jLabel28.setForeground(Color.red); 
//             problemasOftalmologicos = true;
//             problemasOftalmologicosRed = true;
//             nuevasObservaciones += "- CORREGIR AGUDEZA VISUAL.\n";
//         }
//     }
//     set((prev) => ({
//         ...prev,
//         problemasOftalmologicos,
//         problemasOftalmologicosRed,
//         nuevasObservaciones,
//     }))
// }
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
        evaluarObservacionesEditar(res, set);
        set((prev) => ({
            ...prev,
            ...res,
            norden: res.norden_n_orden,
            codigoAnexo: res.codigoAnexo16a,
            fechaExam: res.fechaAnexo16a_fecha_anexo,
            apto: res.aptoAnexo16a_apto,
            actividadRealizar: res.cargo_cargo_de,
            dni: res.dni_cod_pa,
            nombres: res.nombres_nombres_pa + " " + res.apellidos_apellidos_pa,
            sexo: res.sexo_sexo_pa,
            fechaNac: formatearFechaCorta(res.fechaNacimientoPaciente_fecha_nacimiento_pa),
            edad: res.edad_edad + " años",
            fc: res.frecuenciaCardiacaTriaje_f_cardiaca,
            pa: `${res.sistolicaTriaje_sistolica}/${res.diastolicaTriaje_diastolica}`, //revisar - combinando sistólica y diastólica
            fr: res.frecuenciaRespiratoriaTriaje_f_respiratoria,
            imc: res.imcTriaje_imc,
            satO2: res.saturacionOxigenoTriaje_sat_02,
            temperatura: res.temperaturaTriaje_temperatura,
            peso: res.pesoTriaje_peso,
            talla: res.tallaTriaje_talla,
            cirugiaMayor: res.cirujiaMayorRecienteSiAnexo16a_si1,
            desordenesCoagulacion: res.desordenCoagulacionSiAnexo16a_si2,
            diabetes: res.diabetesMellitusSiAnexo16a_si3,
            hipertension: res.hipertensionArterialSiAnexo16a_si4,
            embarazo: res.embarazoSiAnexo16a_si5,
            fur: res.furDescripcionAnexo16a_txtfur != null && res.furDescripcionAnexo16a_txtfur != "",
            furDescripcion: res.furDescripcionAnexo16a_txtfur,
            problemasNeurologicos: res.problemaNeurologicoSiAnexo16a_si6,
            infeccionesRecientes: res.infeccionRecienteSiAnexo16a_si7,
            obesidadMorbida: res.obesidadMorbididadSiAnexo16a_si8,
            problemasCardiacos: res.problemasCardiacoSiAnexo16a_si9,
            problemasRespiratorios: res.problemasRespiratoriosSiAnexo16a_si10,
            problemasOftalmologicos: res.problemasOftalmologicosSiAnexo16a_si11,
            problemasDigestivos: res.problemasDigestivosSiAnexo16a_si12,
            apneaSueño: res.apneaDelSuenoSiAnexo16a_si13,
            otraCondicion: res.otraCondicionMedicaSiAnexo16a_si14,
            alergias: res.alergiasSiAnexo16a_si15,
            usoMedicacion: res.usoMedicacionActualSiAnexo16a_si16,
            corregirAgudeza: res.observacionesAnexo16a_observaciones?.includes("Corregir Agudeza Visual") || false,
            obesidadDieta: res.observacionesAnexo16a_observaciones?.includes("Obesidad I. Dieta Hipocalórica y Ejercicios") || false,
            diabetesControlado: res.observacionesAnexo16a_observaciones?.includes("D m II controlado, tto con:.....") || false,
            sobrepeso: res.observacionesAnexo16a_observaciones?.includes("Sobrepeso. Dieta Hipocalórica y Ejercicios") || false,
            htaControlada: res.observacionesAnexo16a_observaciones?.includes("HTA Controlada, en tto con:...") || false,
            lentesCorrectivos: res.observacionesAnexo16a_observaciones?.includes("Uso de Lentes Correct. Lectura de Cerca") || false,
            contrata: res.contrata_razon_contrata,
            empresa: res.empresa_razon_empresa,
            observaciones: res.observacionesAnexo16a_observaciones,
            //Agudeza Visual
            vcOD: res.visionCercaSinCorregirOd_v_cerca_s_od,
            vlOD: res.visionLejosSinCorregirOd_v_lejos_s_od,
            vcOI: res.visionCercaSinCorregirOi_v_cerca_s_oi,
            vlOI: res.visionLejosSinCorregirOi_v_lejos_s_oi,
            vcCorregidaOD: res.odccOftalmologia_odcc,
            vlCorregidaOD: res.odlcOftalmologia_odlc,
            vclrs: res.vcOftalmologia_vc,
            vb: res.vbOftalmologia_vb,
            rp: res.rpOftalmologia_rp,
            vcCorregidaOI: res.oiccOftalmologia_oicc,
            vlCorregidaOI: res.oilcOftalmologia_oilc,
            enfermedadesOculares: res.enfermedadesOcularesOftalmo_e_oculares,
            medicacionActual: res.medicacionActualAnexo16a_m_actual,
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
        codigoAnexo16a: form.codigoAnexo,
        fechaExamen: form.fechaExam,
        edad: form.edad,
        dni: form.dni,
        direccionClinica: form.medicoDireccion,
        apto: form.apto,
        noApto: !form.apto,
        cirujiaMayorRecienteNo: !form.cirugiaMayor,
        cirujiaMayorRecienteSi: form.cirugiaMayor,
        desordenCoagulacionNo: !form.desordenesCoagulacion,
        desordenCoagulacionSi: form.desordenesCoagulacion,
        diabetesMellitusNo: !form.diabetes,
        diabetesMellitusSi: form.diabetes,
        hipertensionArterialNo: !form.hipertension,
        hipertensionArterialSi: form.hipertension,
        embarazoNo: !form.embarazo,
        embarazoSi: form.embarazo,
        furDescripcion: form.furDescripcion,
        problemaNeurologicoNo: !form.problemasNeurologicos,
        problemaNeurologicoSi: form.problemasNeurologicos,
        infeccionRecienteNo: !form.infeccionesRecientes,
        infeccionRecienteSi: form.infeccionesRecientes,
        obesidadMorbididadNo: !form.obesidadMorbida,
        obesidadMorbididadSi: form.obesidadMorbida,
        problemasCardiacoNo: !form.problemasCardiacos,
        problemasCardiacoSi: form.problemasCardiacos,
        problemasRespiratoriosNo: !form.problemasRespiratorios,
        problemasRespiratoriosSi: form.problemasRespiratorios,
        problemasOftalmologicosNo: !form.problemasOftalmologicos,
        problemasOftalmologicosSi: form.problemasOftalmologicos,
        problemasDigestivosNo: !form.problemasDigestivos,
        problemasDigestivosSi: form.problemasDigestivos,
        apneaDelSuenoNo: !form.apneaSueño,
        apneaDelSuenoSi: form.apneaSueño,
        otraCondicionMedicaNo: !form.otraCondicion,
        otraCondicionMedicaSi: form.otraCondicion,
        alergiasNo: !form.alergias,
        alergiasSi: form.alergias,
        usoMedicacionActualNo: !form.usoMedicacion,
        usoMedicacionActualSi: form.usoMedicacion,
        medicacionActual: form.medicacionActual,
        observaciones: form.observaciones,
        userRegistro: user,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};


export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../jaspers/EKG/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/EKG"
    );
};

export const VerifyTR = async (nro, tabla, token, set, sede) => {
    VerifyTRPerzonalizado(
        nro,
        tabla,
        token,
        set,
        sede,
        () => {
            //NO Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            //Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Anexo 16 A.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita triaje
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje para poder registrarse.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaTriaje = () => { }) => {
    if (!nro) {
        await Swal.fire(
            "Error",
            "Debe Introducir un Nro de Historia Clínica válido",
            "error"
        );
        return;
    }
    Loading("Validando datos");
    getFetch(
        `/api/v01/ct/consentDigit/existenciaExamenes?nOrden=${nro}&nomService=${tabla}`,
        token
    ).then((res) => {
        console.log(res);
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaTriaje();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
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
            sexo: res.genero,
            actividadRealizar: res.cargo,
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
