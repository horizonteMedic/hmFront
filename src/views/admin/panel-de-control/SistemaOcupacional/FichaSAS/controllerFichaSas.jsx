import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";
import { getHoraActual } from "../../../../utils/helpers";

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
            norden: res.norden,
            tipoExamen: res.nombreExamen,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            areaTrabajo: res.areaPaciente,
            puestoActual: res.cargoPaciente,
            esOhla: res.esOhla ?? false,

            conclusiones: res.observacionesFichaMedica,

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,
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
            norden: res.norden,
            tipoExamen: res.nombreExamen,
            fechaExam: res.fechaDesde,
            nombres: res.nombresPaciente + " " + res.apellidosPaciente,
            dni: res.dniPaciente,
            edad: res.edadPaciente,
            sexo: res.sexoPaciente,
            empresa: res.empresa,
            contrata: res.contrata,
            puestoPostula: res.ocupacionPaciente,
            areaTrabajo: res.areaPaciente,
            puestoActual: res.cargoPaciente,
            esOhla: res.esOhla ?? false,

            conclusiones: res.conclusiones,
            apto: res.apto ? "APTO" :
                (res.aptoConRestriccion ? "APTO CON RESTRICCION" : res.noApto ?
                    "NO APTO" : res.conObservacion ?
                        "CON OBSERVACION" :
                        res.evaluado ? "EVALUADO" : ""),
            fechaValido: res.fechaDesde,
            fechaVencimiento: res.fechaHasta,
            recomendaciones: res.recomendaciones,
            restricciones: res.restriccionesDescripcion,

            // Checkboxes de recomendaciones - mapeados basados en restriccionesDescripcion
            corregirAgudezaVisualTotal: res.restriccionesDescripcion?.includes("CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            corregirAgudezaVisual: res.restriccionesDescripcion?.includes("CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            dietaHipocalorica: res.restriccionesDescripcion?.includes("DIETA HIPOCALÓRICA Y EJERCICIOS") || false,
            evitarMovimientosDisergonomicos: res.restriccionesDescripcion?.includes("EVITAR MOVIMIENTOS Y POSICIONES DISERGONÓMICAS") || false,
            noHacerTrabajoAltoRiesgo: res.restriccionesDescripcion?.includes("NO HACER TRABAJO DE ALTO RIESGO") || false,
            noHacerTrabajoSobre18: res.restriccionesDescripcion?.includes("NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            usoEppAuditivo: res.restriccionesDescripcion?.includes("USO DE EPP AUDITIVO ANTE EXPOSICIÓN A RUIDO >=80 DB") || false,
            usoLentesConducir: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHÍCULOS MOTORIZADOS") || false,
            usoLentesTrabajo: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA TRABAJO.") || false,
            usoLentesTrabajoSobre18: res.restriccionesDescripcion?.includes("USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO") || false,
            ninguno: res.restriccionesDescripcion?.includes("NINGUNO") || res.restriccionesDescripcion === "NINGUNO." || false,
            noConducirVehiculos: res.restriccionesDescripcion?.includes("NO CONDUCIR VEHÍCULOS") || false,
            // Médico que Certifica
            nombre_medico: res.nombreMedico,

            visionCercaOd: res.visioncercasincorregirodVCercaSOd,
            visionLejosOd: res.visionlejossincorregirodVLejosSOd,
            visionCercaOi: res.visioncercasincorregiroiVCercaSOi,
            visionLejosOi: res.visionlejossincorregiroiVLejosSOi,

            visionCercaOdCorregida: res.oftalodccmologiaOdcc,
            visionLejosOdCorregida: res.odlcoftalmologiaOdlc,
            visionCercaOiCorregida: res.oiccoftalmologiaOicc,
            visionLejosOiCorregida: res.oilcoftalmologiaOilc,

            visionColores: res.vcoftalmologiaVc,
            visionBinocular: res.vboftalmologiaVb,
            reflejosPupilares: res.rpoftalmologiaRp,
            enfermedadOculares: res.enfermedadesocularesoftalmoEOculares,

            hemoglobina: res.hemoglobinaTxthemoglobina,
            vsg: res.vsglabclinicoTxtvsg,
            glucosa: res.glucosalabclinicoTxtglucosabio,
            creatinina: res.creatininalabclinicoTxtcreatininabio,
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
        entrevistaPuntuacion: (form.ronca_al_dormir ? 1 : 0) + (form.ruidos_respirar_durmiendo ? 1 : 0) + (form.deja_respirar_durmiendo ? 1 : 0) + (form.mas_sueno_cansancio ? 1 : 0).toString(),
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
    const jasperModules = import.meta.glob("../../../../../jaspers/Ficha_Anexo16/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../../jaspers/Ficha_Anexo16"
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
                    "Este paciente ya cuenta con registros de Ficha Aptitud Anexo 16.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Anexo 16 para poder registrarse.",
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
