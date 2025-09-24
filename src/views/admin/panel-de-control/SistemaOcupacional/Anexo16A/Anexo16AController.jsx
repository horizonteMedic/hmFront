import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    getInfoTablaDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
    VerifyTRDefault,
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

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
    GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
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
            GetInfoServicio(nro, tabla, set, token, () => { });
        },
        () => {
            //Tiene registro
            GetInfoServicio(nro, tabla, set, token, () => {
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
