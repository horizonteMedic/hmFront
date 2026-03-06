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

const obtenerReporteUrl = "/api/v01/ct/hcAdultoMayor/obtenerReporte";
const registrarUrl = "/api/v01/ct/hcAdultoMayor/registrarActualizar";

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
            n_hcl: res.n_hcl ?? "",
            fecha_apertura_hcl: res.fecha_apertura_hcl ?? today,
            norden: res.norden ?? "",
            // Datos Generales
            domicilio: res.domicilio ?? "",
            telefono: res.telefono ?? "",
            religion: res.religion ?? "",
            raza: res.raza ?? "",
            procedencia: res.procedencia ?? "",
            grupo_sanguineo: res.grupo_sanguineo ?? "",
            // Familiar o Cuidador Responsable
            familiar_responsable: res.familiar_responsable ?? "",
            edad_familiar: res.edad_familiar ?? "",
            domicilio_telefono_familiar: res.domicilio_telefono_familiar ?? "",
            parentesco: res.parentesco ?? "",
            // Antecedentes Personales
            ap_hipertension: res.ap_hipertension,
            ap_diabetes: res.ap_diabetes,
            ap_obesidad: res.ap_obesidad,
            ap_infarto_cardiaco: res.ap_infarto_cardiaco,
            ap_acv: res.ap_acv,
            ap_osteoporosis: res.ap_osteoporosis,
            ap_hospitalizacion: res.ap_hospitalizacion,
            ap_transfusion: res.ap_transfusion,
            ap_interv_quirurgica: res.ap_interv_quirurgica,
            ap_accidentes: res.ap_accidentes,
            ap_cancer: res.ap_cancer,
            ap_cancer_especificar: res.ap_cancer_especificar ?? "",
            ap_tuberculosis: res.ap_tuberculosis,
            ap_its_vih: res.ap_its_vih,
            ap_hepatitis_b: res.ap_hepatitis_b,
            ap_malaria: res.ap_malaria,
            ap_osteoartrosis: res.ap_osteoartrosis,
            ap_glaucoma: res.ap_glaucoma,
            ap_convulsiones: res.ap_convulsiones,
            ap_depresion: res.ap_depresion,
            ap_riesgo_ocupacional: res.ap_riesgo_ocupacional,
            ap_mordedura_animales: res.ap_mordedura_animales,
            ap_tuberculosis2: res.ap_tuberculosis2,
            ap_its_vih2: res.ap_its_vih2,
            ap_hepatitis_b2: res.ap_hepatitis_b2,
            ap_enfermedades_cronicas: res.ap_enfermedades_cronicas,
            ap_violencia_familiar: res.ap_violencia_familiar,
            ap_cancer2: res.ap_cancer2,
            sexualmente_activo: res.sexualmente_activo,
            problema_sexualidad: res.problema_sexualidad ?? "",
            // Reacción Adversa a Medicamentos
            reaccion_adversa_medicamentos: res.reaccion_adversa_medicamentos,
            reaccion_adversa_medicamentos_cual: res.reaccion_adversa_medicamentos_cual ?? "",
            medicamentos_uso_frecuente: res.medicamentos_uso_frecuente,
            medicamentos_observacion: res.medicamentos_observacion ?? "",
            // Inmunizaciones
            vacuna_1: res.vacuna_1 ?? "",
            fecha_vacuna_1: res.fecha_vacuna_1 ?? "",
            vacuna_2: res.vacuna_2 ?? "",
            fecha_vacuna_2: res.fecha_vacuna_2 ?? "",
            vacuna_3: res.vacuna_3 ?? "",
            fecha_vacuna_3: res.fecha_vacuna_3 ?? "",
            vacuna_4: res.vacuna_4 ?? "",
            fecha_vacuna_4: res.fecha_vacuna_4 ?? "",
            // Síndromes y Problemas Geriátricos
            spg_incontinencia_urinaria: res.spg_incontinencia_urinaria,
            spg_estrenimiento: res.spg_estrenimiento,
            spg_ulceras_depresion: res.spg_ulceras_depresion,
            spg_insomnio: res.spg_insomnio,
            spg_inmovilizacion: res.spg_inmovilizacion,
            spg_confusion_aguda: res.spg_confusion_aguda,
            spg_vertigo: res.spg_vertigo,
            spg_sincope: res.spg_sincope,
            spg_prostatismo: res.spg_prostatismo,
            spg_deprivacion_auditiva: res.spg_deprivacion_auditiva,
            spg_deprivacion_visual: res.spg_deprivacion_visual,
            spg_caidas: res.spg_caidas,
            spg_caidas_ultimo_ano: res.spg_caidas_ultimo_ano,
            spg_n_caidas: res.spg_n_caidas ?? "",
            spg_fracturas: res.spg_fracturas ?? "",
            spg_sitio_anatomico: res.spg_sitio_anatomico ?? "",
            // Observaciones
            observaciones: res.observaciones ?? "",
            // Médico
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
    const body = {
        n_hcl: form.n_hcl,
        fecha_apertura_hcl: form.fecha_apertura_hcl,
        norden: form.norden,
        // Datos Generales
        domicilio: form.domicilio,
        telefono: form.telefono,
        religion: form.religion,
        raza: form.raza,
        procedencia: form.procedencia,
        grupo_sanguineo: form.grupo_sanguineo,
        // Familiar o Cuidador Responsable
        familiar_responsable: form.familiar_responsable,
        edad_familiar: form.edad_familiar,
        domicilio_telefono_familiar: form.domicilio_telefono_familiar,
        parentesco: form.parentesco,
        // Antecedentes Personales
        ap_hipertension: form.ap_hipertension,
        ap_diabetes: form.ap_diabetes,
        ap_obesidad: form.ap_obesidad,
        ap_infarto_cardiaco: form.ap_infarto_cardiaco,
        ap_acv: form.ap_acv,
        ap_osteoporosis: form.ap_osteoporosis,
        ap_hospitalizacion: form.ap_hospitalizacion,
        ap_transfusion: form.ap_transfusion,
        ap_interv_quirurgica: form.ap_interv_quirurgica,
        ap_accidentes: form.ap_accidentes,
        ap_cancer: form.ap_cancer,
        ap_cancer_especificar: form.ap_cancer_especificar,
        ap_tuberculosis: form.ap_tuberculosis,
        ap_its_vih: form.ap_its_vih,
        ap_hepatitis_b: form.ap_hepatitis_b,
        ap_malaria: form.ap_malaria,
        ap_osteoartrosis: form.ap_osteoartrosis,
        ap_glaucoma: form.ap_glaucoma,
        ap_convulsiones: form.ap_convulsiones,
        ap_depresion: form.ap_depresion,
        ap_riesgo_ocupacional: form.ap_riesgo_ocupacional,
        ap_mordedura_animales: form.ap_mordedura_animales,
        ap_tuberculosis2: form.ap_tuberculosis2,
        ap_its_vih2: form.ap_its_vih2,
        ap_hepatitis_b2: form.ap_hepatitis_b2,
        ap_enfermedades_cronicas: form.ap_enfermedades_cronicas,
        ap_violencia_familiar: form.ap_violencia_familiar,
        ap_cancer2: form.ap_cancer2,
        sexualmente_activo: form.sexualmente_activo,
        problema_sexualidad: form.problema_sexualidad,
        // Reacción Adversa a Medicamentos
        reaccion_adversa_medicamentos: form.reaccion_adversa_medicamentos,
        reaccion_adversa_medicamentos_cual: form.reaccion_adversa_medicamentos_cual,
        medicamentos_uso_frecuente: form.medicamentos_uso_frecuente,
        medicamentos_observacion: form.medicamentos_observacion,
        // Inmunizaciones
        vacuna_1: form.vacuna_1,
        fecha_vacuna_1: form.fecha_vacuna_1,
        vacuna_2: form.vacuna_2,
        fecha_vacuna_2: form.fecha_vacuna_2,
        vacuna_3: form.vacuna_3,
        fecha_vacuna_3: form.fecha_vacuna_3,
        vacuna_4: form.vacuna_4,
        fecha_vacuna_4: form.fecha_vacuna_4,
        // Síndromes y Problemas Geriátricos
        spg_incontinencia_urinaria: form.spg_incontinencia_urinaria,
        spg_estrenimiento: form.spg_estrenimiento,
        spg_ulceras_depresion: form.spg_ulceras_depresion,
        spg_insomnio: form.spg_insomnio,
        spg_inmovilizacion: form.spg_inmovilizacion,
        spg_confusion_aguda: form.spg_confusion_aguda,
        spg_vertigo: form.spg_vertigo,
        spg_sincope: form.spg_sincope,
        spg_prostatismo: form.spg_prostatismo,
        spg_deprivacion_auditiva: form.spg_deprivacion_auditiva,
        spg_deprivacion_visual: form.spg_deprivacion_visual,
        spg_caidas: form.spg_caidas,
        spg_caidas_ultimo_ano: form.spg_caidas_ultimo_ano,
        spg_n_caidas: form.spg_n_caidas,
        spg_fracturas: form.spg_fracturas,
        spg_sitio_anatomico: form.spg_sitio_anatomico,
        // Observaciones
        observaciones: form.observaciones,
        // Médico
        userRegistro: user,
        usuarioFirma: form.user_medicoFirma,
    };

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/HistoriaClinicaAdultoMayor/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../../jaspers/ModuloAsistencial/HistoriaClinicaAdultoMayor"
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
                    "Este paciente ya cuenta con una Historia Clínica de Adulto Mayor.",
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
            cargoDesempenar: res.cargo ?? "",
            lugarNacimiento: res.lugarNacimiento ?? "",
            sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
            // Nuevos campos de Datos Generales
            domicilio: res.domicilio ?? "",
            telefono: res.telefono ?? "",
            religion: res.religion ?? "",
            raza: res.raza ?? "",
            procedencia: res.procedencia ?? "",
            grupo_sanguineo: res.grupo_sanguineo ?? "",
        }));
    }
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
