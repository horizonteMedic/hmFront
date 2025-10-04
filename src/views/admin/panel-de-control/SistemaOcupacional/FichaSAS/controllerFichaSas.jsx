import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";
const obtenerReporteUrl =
    "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas";
const registrarUrl =
    "/api/v01/ct/fichaApneaSueno/registrarActualizarFichaSas";

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
            tipoExamen: res.nombreExamen ?? "",
            //datos personales
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            puestoPostula: res.ocupacionPaciente ?? "",
            puestoActual: res.cargoPaciente ?? "",

            // Examen Físico
            peso_kg: res.pesoTriaje ?? "",
            talla_mts: res.tallaTriaje ?? "",
            imc_kg_m2: res.imcTriaje ?? "",
            circunferencia_cuello: res.perimetroCuelloTriaje ?? "",
            presion_sistolica: res.sistolicaTriaje ?? "",
            presion_diastolica: res.diastolicaTriaje ?? "",

            observaciones: res.conclusionObservaciones_txtobservaciones ?? "",
        }));
    }
};

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
        set((prev) => ({
            ...prev,
            // Header
            norden: res.norden ?? "",
            codigoSas: res.codigoSas_cod_sas ?? "",
            fechaExam: res.fechaSas_fecha_sas ?? "", //revisar
            tipoExamen: res.nombreExamen ?? "",
            tipoLicencia: res.tipoLicencia_licencia_sas ?? "",
            //datos personales
            nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`,
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            puestoPostula: res.ocupacionPaciente ?? "",
            puestoActual: res.cargoPaciente ?? "",
            //trabaja noche
            trabajoNoche: res.trabajaNocheSi_tbtrabajanochesi ?? false,
            diasTrabajoNoche: res.diasTrabajo_txtdiastrabajo ?? "",
            diasDescansoNoche: res.descanso_txtdescanso ?? "",
            anosTrabajoNoche: res.anosTrabajo_txtanostrabajo ?? "",
            // Antecedentes personales
            apneaDelSueno: res.apneaSi_rbapneasi ?? false,
            ultimoControl: res.ultimoControl_txtultimocontrol ?? "",
            hta: res.htaSi_rbhtasi ?? false,
            medicacionRiesgo: res.riesgo_txtriesgo ?? "",
            polisomnografiaRealizada: res.psgSi_rbpsgsi ?? false,
            fechaUltimaPolisomnografia: res.fechaPsg_fechapsg ?? "",  //revisar
            accidenteEnLaMina: res.enMinaSi_rbenminasi ?? false,
            accidenteFueraDeLaMina: res.fueraMinaSi_rbfueraminasi ?? false,
            // Antecedentes de choques
            criterio1_cabeceo: res.casoChoquePregunta1Si_chk1_sassi ?? false, //1
            accidente_nocturno: res.casoChoquePregunta2Si_chk2_sassi ?? false, //2
            ausencia_evidencia_maniobra: res.casoChoquePregunta3Si_chk3_sassi ?? false, //3
            choque_vehiculo_contra_otro: res.casoChoquePregunta4Si_chk4_sassi ?? false, //4
            vehiculo_invadio_carril: res.casoChoquePregunta5Si_chk5_sassi ?? false, //5
            conductor_no_recuerda: res.casoChoquePregunta6Si_chk6_sassi ?? false, //6
            tratamiento_medicinas_somnolencia: res.casoChoquePregunta7Si_chk7_sassi ?? false, //7
            conductor_encontraba_horas_extra: res.casoChoquePregunta8Si_chk8_sassi ?? false, //8
            accidente_confirmado_somnolencia: res.casoChoquePregunta9Si_chk9_sassi ?? false, //9
            accidente_alta_sospecha_somnolencia: res.casoChoquePregunta10Si_chk10_sassi ?? false, //10
            accidente_escasa_evidencia_somnolencia: res.casoChoquePregunta11Si_chk11_sassi ?? false, //11
            no_datos_suficientes: res.casoChoquePregunta12Si_chk12_sassi ?? false, //12
            accidente_no_debido_somnolencia: res.casoChoquePregunta13Si_chk13_sassi ?? false, //13

            // Antecedentes familiares de apnea del sueño
            antec_familiar_apnea: res.entrevistaAnteFamiliarApneaSi_chkantsi ?? false,
            indique_familiar_apnea: res.entrevistaAnteFamiliarApneaDescrip_txtantecedentefamiliar ?? "",

            // Entrevista al paciente
            ronca_al_dormir: res.entrevistaPregunta1Si_chk1_esi ?? false,
            ruidos_respirar_durmiendo: res.entrevistaPregunta2Si_chk2_esi ?? false,
            deja_respirar_durmiendo: res.entrevistaPregunta3Si_chk3_esi ?? false,
            mas_sueno_cansancio: res.entrevistaPregunta4Si_chk4_esi ?? false,

            // Examen Físico
            peso_kg: res.pesoTriaje ?? "",
            talla_mts: res.tallaTriaje ?? "",
            imc_kg_m2: res.imcTriaje ?? "",
            circunferencia_cuello: res.perimetroCuelloTriaje ?? "",
            cuello_varon_normal: res.examenFisicoVaronSi_chkvaronsi ?? false,
            cuello_mujer_normal: res.examenFisicoMujerSi_chkmujersi ?? false,
            presion_sistolica: res.sistolicaTriaje ?? "",
            presion_diastolica: res.diastolicaTriaje ?? "",
            hta_nueva: res.examenFisicoHtaNuevaSi_chkhtanuevasi ?? false,

            // Evaluación de vía aérea superior MALLAMPATI
            mallampati_grado:
                res.examenFisicoGradoI_chkgradoi
                    ? "1"
                    : res.examenFisicoGradoII_chkgradoii
                        ? "2"
                        : res.examenFisicoGradoIII_chkgradoiii
                            ? "3"
                            : res.examenFisicoGradoIV_chkgradoiiii
                                ? "4"
                                : "",

            // Conclusión de la Evaluación
            // Requiere PSG antes de certificar aptitud para conducir
            requiere_psg: res.conclusionRequierePsgSi_chk1_psg_si ?? false,
            criterio_a: res.conclusionRequierePsgASi_chk1_psg_sia ?? false,
            criterio_b: res.conclusionRequierePsgBSi_chk1_psg_sib ?? false,

            // Apto por 3 meses a renovar luego de PSG
            apto_3_meses: res.conclusionAptoPsgSi_chk1_apto_si ?? false,
            criterio_c: res.conclusionAptoCriterioCSi_chk1_apto_sic ?? false,
            criterio_d: res.conclusionAptoCriterioDSi_chk1_apto_sid ?? false,
            criterio_d_imc: res.conclusionAptoCriterioD1Si_chk1_apto_sid1 ?? false,
            criterio_d_hta: res.conclusionAptoCriterioD2Si_chk1_apto_sid2 ?? false,
            criterio_d_cuello: res.conclusionAptoCriterioD3Si_chk1_apto_sid3 ?? false,
            criterio_d_epworth: res.conclusionAptoCriterioD4Si_chk1_apto_sid4 ?? false,
            criterio_d_trastorno: res.conclusionAptoCriterioD5Si_chk1_apto_sid5 ?? false,
            criterio_d_ahi: res.conclusionAptoCriterioD6Si_chk1_apto_sid6 ?? false,
            criterio_e: res.conclusionAptoCriterioESi_chk1_apto_sie ?? false,

            // Apto con bajo riesgo de Apnea del sueño
            apto_bajo_riesgo: res.conclusionAptoBajoRiesgoSi_chkaptobajosi ?? false,
            observaciones: res.conclusionObservaciones_txtobservaciones ?? "",
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
        codigoSas: form.codigoSas,
        tipoLicencia: form.tipoLicencia,
        trabajaNocheSi: form.trabajoNoche,
        trabajaNocheNo: !form.trabajoNoche,
        diasTrabajo: form.diasTrabajoNoche,
        diasDescanso: form.diasDescansoNoche,
        anosTrabajo: form.anosTrabajoNoche,
        apneaSi: form.apneaDelSueno,
        apneaNo: !form.apneaDelSueno,
        ultimoControl: form.ultimoControl,
        htaSi: form.hta,
        htaNo: !form.hta,
        medicacionRiesgo: form.medicacionRiesgo,
        polisomnografiaSi: form.polisomnografiaRealizada,
        polisomnografiaNo: !form.polisomnografiaRealizada,
        fechaUltimaPolisomnografia: form.fechaUltimaPolisomnografia,
        enMinaSi: form.accidenteEnLaMina,
        enMinaNo: !form.accidenteEnLaMina,
        fueraMinaSi: form.accidenteFueraDeLaMina,
        fueraMinaNo: !form.accidenteFueraDeLaMina,

        casoChoquePregunta1Si: form.criterio1_cabeceo,
        casoChoquePregunta2Si: form.accidente_nocturno,
        casoChoquePregunta3Si: form.ausencia_evidencia_maniobra,
        casoChoquePregunta4Si: form.choque_vehiculo_contra_otro,
        casoChoquePregunta5Si: form.vehiculo_invadio_carril,
        casoChoquePregunta6Si: form.conductor_no_recuerda,
        casoChoquePregunta7Si: form.tratamiento_medicinas_somnolencia,
        casoChoquePregunta8Si: form.conductor_encontraba_horas_extra,
        casoChoquePregunta9Si: form.accidente_confirmado_somnolencia,
        casoChoquePregunta10Si: form.accidente_alta_sospecha_somnolencia,
        casoChoquePregunta11Si: form.accidente_escasa_evidencia_somnolencia,
        casoChoquePregunta12Si: form.no_datos_suficientes,
        casoChoquePregunta13Si: form.accidente_no_debido_somnolencia,

        casoChoquePregunta1No: !form.criterio1_cabeceo,
        casoChoquePregunta2No: !form.accidente_nocturno,
        casoChoquePregunta3No: !form.ausencia_evidencia_maniobra,
        casoChoquePregunta4No: !form.choque_vehiculo_contra_otro,
        casoChoquePregunta5No: !form.vehiculo_invadio_carril,
        casoChoquePregunta6No: !form.conductor_no_recuerda,
        casoChoquePregunta7No: !form.tratamiento_medicinas_somnolencia,
        casoChoquePregunta8No: !form.conductor_encontraba_horas_extra,
        casoChoquePregunta9No: !form.accidente_confirmado_somnolencia,
        casoChoquePregunta10No: !form.accidente_alta_sospecha_somnolencia,
        casoChoquePregunta11No: !form.accidente_escasa_evidencia_somnolencia,
        casoChoquePregunta12No: !form.no_datos_suficientes,
        casoChoquePregunta13No: !form.accidente_no_debido_somnolencia,

        entrevistaAnteFamiliarApneaSi: form.antec_familiar_apnea,
        entrevistaAnteFamiliarApneaNo: !form.antec_familiar_apnea,
        entrevistaAnteFamiliarApneaDescripcion: form.indique_familiar_apnea,
        entrevistaPregunta1Si: form.ronca_al_dormir,
        entrevistaPregunta2Si: form.ruidos_respirar_durmiendo,
        entrevistaPregunta3Si: form.deja_respirar_durmiendo,
        entrevistaPregunta4Si: form.mas_sueno_cansancio,
        entrevistaPregunta1No: !form.ronca_al_dormir,
        entrevistaPregunta2No: !form.ruidos_respirar_durmiendo,
        entrevistaPregunta3No: !form.deja_respirar_durmiendo,
        entrevistaPregunta4No: !form.mas_sueno_cansancio,
        entrevistaPuntuacion: ((form.ronca_al_dormir ? 1 : 0) + (form.ruidos_respirar_durmiendo ? 1 : 0) + (form.deja_respirar_durmiendo ? 1 : 0)+ (form.mas_sueno_cansancio ? 1 : 0)).toString(),
        examenFisicoVaronSi: form.cuello_varon_normal,
        examenFisicoVaronNo: !form.cuello_varon_normal,
        examenFisicoMujerSi: form.cuello_mujer_normal,
        examenFisicoMujerNo: !form.cuello_mujer_normal,
        examenFisicoHtaNuevaSi: form.hta_nueva,
        examenFisicoHtaNuevaNo: !form.hta_nueva,
        examenFisicoGradoI: form.mallampati_grado === "1",
        examenFisicoGradoII: form.mallampati_grado === "2",
        examenFisicoGradoIII: form.mallampati_grado === "3",
        examenFisicoGradoIV: form.mallampati_grado === "4",
        conclusionAptoBajoRiesgoSi: form.apto_bajo_riesgo,
        conclusionAptoBajoRiesgoNo: !form.apto_bajo_riesgo,
        conclusionObservaciones: form.observaciones,
        dniUsuario: form.dniUsuario,
        fechaSas: form.fechaExam,
        conclusionRequierePsgSi: form.requiere_psg,
        conclusionRequierePsgNo: !form.requiere_psg,
        conclusionAptoPsgSi: form.apto_3_meses,
        conclusionAptoPsgNo: !form.apto_3_meses,
        conclusionRequierePsgASi: form.criterio_a,
        conclusionRequierePsgANo: !form.criterio_a,
        conclusionRequierePsgBSi: form.criterio_b,
        conclusionRequierePsgBNo: !form.criterio_b,

        conclusionAptoCriterioDSi: form.criterio_d,
        conclusionAptoCriterioDNo: !form.criterio_d,
        conclusionAptoCriterioD1Si: form.criterio_d_imc,
        conclusionAptoCriterioD1No: !form.criterio_d_imc,
        conclusionAptoCriterioD2Si: form.criterio_d_hta,
        conclusionAptoCriterioD2No: !form.criterio_d_hta,
        conclusionAptoCriterioD3Si: form.criterio_d_cuello,
        conclusionAptoCriterioD3No: !form.criterio_d_cuello,
        conclusionAptoCriterioD4Si: form.criterio_d_epworth,
        conclusionAptoCriterioD4No: !form.criterio_d_epworth,
        conclusionAptoCriterioD5Si: form.criterio_d_trastorno,
        conclusionAptoCriterioD5No: !form.criterio_d_trastorno,
        conclusionAptoCriterioD6Si: form.criterio_d_ahi,
        conclusionAptoCriterioD6No: !form.criterio_d_ahi,

        conclusionAptoCriterioESi: form.criterio_e,
        conclusionAptoCriterioENo: !form.criterio_e,
        conclusionAptoCriterioCSi: form.criterio_c,
        conclusionAptoCriterioCNo: !form.criterio_c,
        usuarioRegistrar: user,
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
    const jasperModules = import.meta.glob("../../../../jaspers/FichasSAS/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/FichasSAS"
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
                    "Este paciente ya cuenta con registros de Ficha SAS",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Triaje.",
                "warning"
            );
        }
    );
};

export const VerifyTRPerzonalizado = async (nro, tabla, token, set, sede, noTieneRegistro = () => { }, tieneRegistro = () => { }, necesitaExamen = () => { }) => {
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
        if (res.id === 0) {
            //No tiene registro previo 
            noTieneRegistro();//datos paciente
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();//obtener data servicio
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};
