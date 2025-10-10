import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl = "/api/v01/ct/respiradores/obtenerReporteRespiradores";
const registrarUrl = "/api/v01/ct/respiradores/registrarActualizarRespiradores";

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
            codigoRespiradores: res.datosRespiradores?.codigoRespiradores_cod_respiradores,
            fechaExam: res.datosRespiradores?.fechaExamen_fecha_examen ?? "",
            tipoExamen: res.nombreExamen ?? "",
            // Datos personales
            nombres: res.nombresPaciente ?? "",
            dni: res.dniPaciente ?? "",
            edad: res.edadPaciente ?? "",
            sexo: res.sexoPaciente ?? "",
            empresa: res.empresa ?? "",
            contrata: res.contrata ?? "",
            // Campos usados por la interfaz principal
            puestoPostula: res.cargoPaciente ?? "",
            puestoActual: res.ocupacionPaciente ?? "",

            // ====================== TAB LATERAL: AGUDEZA VISUAL ======================
            vcOD: res.visioncercasincorregirodVCercaSOd ?? "",
            vlOD: res.visionlejossincorregirodVLejosSOd ?? "",
            vcOI: res.visioncercasincorregiroiVCercaSOi ?? "",
            vlOI: res.visionlejossincorregiroiVLejosSOi ?? "",
            vcCorregidaOD: res.oftalodccmologiaOdcc ?? "",
            vlCorregidaOD: res.odlcoftalmologiaOdlc ?? "",
            vcCorregidaOI: res.oiccoftalmologiaOicc ?? "",
            vlCorregidaOI: res.oilcoftalmologiaOilc ?? "",
            vclrs: res.vcoftalmologiaVc ?? "",
            vb: res.vboftalmologiaVb ?? "",
            rp: res.rpoftalmologiaRp ?? "",
            enfermedadesOculares: res.enfermedadesocularesoftalmoEOculares ?? "",

            // ====================== LUGAR DE TRABAJO ======================
            // Tipo de respirador(es) a utilizar
            respiradorMascaraPolvo: res.datosRespiradores?.mascaraPolvo_chk_1 ?? false,
            respiradorMediaCara: res.datosRespiradores?.mediaCara_chk_2 ?? false,
            respiradorCaraCompleta: res.datosRespiradores?.caraCompleta_chk_3 ?? false,
            tipoRespiradorTipo:
                res.datosRespiradores?.purificadorAireSinEnergia_chk_4 ? "PURIFICADOR_SIN_ENERGIA" :
                    res.datosRespiradores?.purificadorAireConEnergia_chk_5 ? "PURIFICADOR_CON_ENERGIA" :
                        res.datosRespiradores?.respiradorSuministradorAtmosfera_chk_6 ? "SUMINISTRADOR_ATMOSFERA" :
                            res.datosRespiradores?.combinacionScba_chk_7 ? "COMBINACION_LINEA_AIRE_SCBA" :
                                res.datosRespiradores?.respiradorFlujoContinuo_chk_8 ? "FLUJO_CONTINUO" :
                                    res.datosRespiradores?.respiradorSuministradorAire_chk_9 ? "SUMINISTRO_AIRE" :
                                        res.datosRespiradores?.scbaCircuitoAbierto_chk_10 ? "SCBA_CIRCUITO_ABIERTO" :
                                            res.datosRespiradores?.scbaCircuitoCerrado_chk_11 ? "SCBA_CIRCUITO_CERRADO" :
                                                "",

            // Tipo de Protección
            tipoProteccion: "FILTRO_HEPA", //revisar - mapear según filtroHepa_chk_12 y otros cartuchos

            // Esfuerzo físico esperado requerido
            esfuerzoFisico: "MODERADO", //revisar - mapear según esfuerzoFisicoLigero_chk_17, esfuerzoFisicoModerado_chk_18, esfuerzoFisicoPesado_chk_19

            // Frecuencia de uso
            frecuenciaUso: "DIARIO", //revisar - mapear según maneraDia_chk_20, ocasional_chk_21, raraVez_chk_22
            promedioHorasDia: res.datosRespiradores?.tiempoPromedioHoras_t_prom_horas ?? "",

            // Exposición de Materiales Peligros
            expHumoMetal: res.datosRespiradores?.humoMetal_chk_23 ?? false,
            expVaporOrganico: res.datosRespiradores?.vaporOrganico_chk_30 ?? false,
            expArsenico: res.datosRespiradores?.arsenico_chk_24 ?? false,
            expAmoniaco: res.datosRespiradores?.amoniaco_chk_31 ?? false,
            expPlomo: res.datosRespiradores?.plomo_chk_25 ?? false,
            expPolvoRespirable: res.datosRespiradores?.polvoRespirable_chk_32 ?? false,
            expAsbesto: res.datosRespiradores?.asbesto_chk_26 ?? false,
            expSilice: res.datosRespiradores?.silice_chk_33 ?? false,
            expDpm: res.datosRespiradores?.dpm_chk_27 ?? false,
            expMercurio: res.datosRespiradores?.mercurio_chk_34 ?? false,
            expMonoxidoCarbono: res.datosRespiradores?.monoxidoCarbono_chk_28 ?? false,
            expDioxidoCarbono: res.datosRespiradores?.dioxidoCarbono_chk_29 ?? false,
            expOtros: res.datosRespiradores?.otros_chk_35 ?? false,

            // Condiciones Especiales de Trabajo
            elevacionesAltas: res.datosRespiradores?.elevacionesAltas_chk_36 ?? false,
            temperaturasExtremas: res.datosRespiradores?.temperaturaExtrema_chk_37 ?? false,
            atmosferasHumidas: res.datosRespiradores?.atmosferaHumeda_chk_38 ?? false,
            espaciosConfirmados: res.datosRespiradores?.espaciosConfinados_chk_39 ?? false,
            atmosferasIDLH: res.datosRespiradores?.atmosferasIdlh_chk_40 ?? false,
            hazmatFuegoRescate: res.datosRespiradores?.hazmatFuegoRescateMina_chk_41 ?? false,
            eppAdicionalUtilizado: res.datosRespiradores?.eppAdicional_chk_42 ?? false,
            otrosCondicionesTrabajo: res.datosRespiradores?.otrosCondicionesEspeciales_chk_43 ?? false,
            otrosCondicionesTrabajoDescripcion: res.datosRespiradores?.otrosCondicionesEspecialesDescripcion_t_otros0 ?? "",
            // ====================== PERSONAL EMPLEADO 1======================
            // Sección 1
            fumaUltimoMes: res.datosRespiradores?.fumaSi_chk_1_si ?? false,

            // Sección 2 - Condiciones
            condPalpitaciones: res.datosRespiradores?.palpitacionesSi_chk_2_si ?? false,
            condConvulsiones: res.datosRespiradores?.convulsionSi_chk_3_si ?? false,
            condDiabetes: res.datosRespiradores?.diabetesSi_chk_4_si ?? false,
            condReaccionesAlergicasRespiracion: res.datosRespiradores?.reaccionesAlergicasSi_chk_5_si ?? false,
            condClaustrofobia: res.datosRespiradores?.claustrofobiaSi_chk_6_si ?? false,

            // Sección 3 - Problemas pulmonares
            probPulmonAsbestosis: res.datosRespiradores?.asbestosisSi_chk_7_si ?? false,
            probPulmonAsma: res.datosRespiradores?.asmaSi_chk_8_si ?? false,
            probPulmonBronquitisCronica: res.datosRespiradores?.bronquitisCronicaSi_chk_9_si ?? false,
            probPulmonEnfisema: res.datosRespiradores?.enfisemaSi_chk_10_si ?? false,
            probPulmonNeumonia: res.datosRespiradores?.neumoniaSi_chk_11_si ?? false,
            probPulmonTuberculosis: res.datosRespiradores?.tuberculosisSi_chk_12_si ?? false,
            probPulmonSilicosis: res.datosRespiradores?.silicosisSi_chk_13_si ?? false,
            probPulmonNeumotorax: res.datosRespiradores?.neumotoraxSi_chk_14_si ?? false,
            probPulmonCancer: res.datosRespiradores?.cancerPulmonSi_chk_15_si ?? false,
            probPulmonCostillasFracturadas: res.datosRespiradores?.costillasFracturadasSi_chk_16_si ?? false,
            probPulmonLesionCirugia: res.datosRespiradores?.cualquierLesionPulmonSi_chk_17_si ?? false,
            probPulmonOtros: res.datosRespiradores?.personalEmpleado1Otros3Si_chk_18_si ?? false,
            probPulmonOtrosDescripcion: res.datosRespiradores?.personalEmpleado1Otros3Descripcion_t_otros1 ?? "",

            // Sección 4 - Síntomas pulmonares
            sintRespirarReposo: res.datosRespiradores?.dificultadRespirarReposoSi_chk_19_si ?? false,
            sintRespirarCaminaNivel: res.datosRespiradores?.dificultadRespirarCaminaNivelSueloSi_chk_20_si ?? false,
            sintRespirarCaminaInclinacion: res.datosRespiradores?.dificultadRespirarCaminaInclinadoSi_chk_21_si ?? false,
            sintRespirarAlTarea: res.datosRespiradores?.dificultadRespiraAlgunaTareaSi_chk_22_si ?? false,
            sintTosExpectoracion: res.datosRespiradores?.tosProduceExpectoracionSi_chk_23_si ?? false,
            sintTosDespiertaManana: res.datosRespiradores?.tosDespiertaTempranoSi_chk_24_si ?? false,
            sintTosEchado: res.datosRespiradores?.tosEchadoSi_chk_25_si ?? false,
            sintTosConSangre: res.datosRespiradores?.tosSangreSi_chk_26_si ?? false,
            sintSilbidosPecho: res.datosRespiradores?.silbidoPechoRespiraSi_chk_27_si ?? false,
            sintDolorPechoRespira: res.datosRespiradores?.dolorPechoRespiraProfundamenteSi_chk_28_si ?? false,
            sintOtros: res.datosRespiradores?.personalEmpleado1Otros4Si_chk_29_si ?? false,
            sintOtrosDescripcion: res.datosRespiradores?.personalEmpleado1Otros4Descripcion_t_otros2 ?? "",
            // ====================== PERSONAL EMPLEADO 2======================
            // 5. Problemas cardiovasculares
            cardioInfarto: res.datosRespiradores?.infartoSi_chk_30_si ?? false,
            cardioAngina: res.datosRespiradores?.anginaSi_chk_31_si ?? false,
            cardioInsuficienciaCardiaca: res.datosRespiradores?.insuficienciaCardiacaSi_chk_32_si ?? false,
            cardioHinchazonPiernasPies: res.datosRespiradores?.hinchazonPiernasSi_chk_33_si ?? false,
            cardioArritmiaCorazon: res.datosRespiradores?.arritmiaCorazonSi_chk_34_si ?? false,
            cardioReflujoGastroesofagicoNoComida: res.datosRespiradores?.reflujoGastroesofaticoSi_chk_35_si ?? false,
            cardioOtros: res.datosRespiradores?.personalEmpleado2Otros5Si_chk_36_si ?? false,
            cardioOtrosDescripcion: res.datosRespiradores?.personalEmpleado2Otros5Descripcion_t_otros3 ?? "",

            // 6. Síntomas cardiovasculares
            sintCardioDolorPresionPecho: res.datosRespiradores?.dolorPresionPechoSi_chk_37_si ?? false,
            sintCardioDolorPresionPechoActividadFisica: res.datosRespiradores?.dolorPresionPechoActividadFisicaSi_chk_38_si ?? false,
            sintCardioDolorPresionPechoTrabajo: res.datosRespiradores?.dolorPresionPechoActividadTrabajoSi_chk_39_si ?? false,
            sintCardioPalpitaciones: res.datosRespiradores?.palpitacionesSintomasCardiovascularesSi_chk_40_si ?? false,
            sintCardioAcidezIndigestionNoComida: res.datosRespiradores?.acidesEstomacalSi_chk_41_si ?? false,
            sintCardioOtros: res.datosRespiradores?.personalEmpleado2Otros6Si_chk_42_si ?? false,
            sintCardioOtrosDescripcion: res.datosRespiradores?.personalEmpleado2Otros6Descripcion_t_otros4 ?? "",

            // 7. Medicación actual para condiciones
            medsProblemaRespiratorio: res.datosRespiradores?.problemaRespiratorioSi_chk_43_si ?? false,
            medsProblemasCorazon: res.datosRespiradores?.problemasCorazonSi_chk_44_si ?? false,
            medsPresionSanguinea: res.datosRespiradores?.presionSanguineaSi_chk_45_si ?? false,
            medsConvulsiones: res.datosRespiradores?.convulsionesSi_chk_46_si ?? false,

            // 8. Problemas al usar respirador
            respIrritacionOjos: res.datosRespiradores?.irritacionOjosSi_chk_47_si ?? false,
            respAlergiasPielErupciones: res.datosRespiradores?.alergiasPielSi_chk_48_si ?? false,
            respAnsiedad: res.datosRespiradores?.ansiedadSi_chk_49_si ?? false,
            respFatigaDebilidad: res.datosRespiradores?.fatigaDebilidadSi_chk_50_si ?? false,
            respOtros: res.datosRespiradores?.personalEmpleado2Otros8Si_chk_51_si ?? false,
            respOtrosDescripcion: res.datosRespiradores?.personalEmpleado2Otros8Descripcion_t_otros5 ?? "",
            // ====================== PERSONAL EMPLEADO 3======================
            // 9. Visión
            visionPerdidaOjo: res.datosRespiradores?.perdidaVisionCualquierOjoSi_chk_52_si ?? false,
            visionUsaLentesContacto: res.datosRespiradores?.lentesContactoSi_chk_53_si ?? false,
            visionUsaLentes: res.datosRespiradores?.lentesSi_chk_54_si ?? false,
            visionDaltonismo: res.datosRespiradores?.daltonismoSi_chk_55_si ?? false,
            visionOtros: res.datosRespiradores?.personalEmpleado3Otros10Si_chk_56_si ?? false,
            visionOtrosDescripcion: res.datosRespiradores?.personalEmpleado3Otros10Descripcion_t_otros6 ?? "",

            // 11. Lesiones de oído
            oidoLesionTimpanoRoto: res.datosRespiradores?.lesionOidosSi_chk_57_si ?? false,

            // 12. Audición actual
            audicionDificultadEscuchar: res.datosRespiradores?.dificultadEscucharSi_chk_58_si ?? false,
            audicionUsaAudifono: res.datosRespiradores?.usaAudifonoSi_chk_59_si ?? false,
            audicionOtros: res.datosRespiradores?.personalEmpleado3Otros12Si_chk_60_si ?? false,
            audicionOtrosDescripcion: res.datosRespiradores?.personalEmpleado3Otros12Descripcion_t_otros7 ?? "",

            // 13. Lesiones a la espalda
            espaldaLesion: res.datosRespiradores?.lesionEspaldaSi_chk_61_si ?? false,

            // 14. Problemas musculoesqueléticos y de movilidad
            probGenDebilidadExtremidades: res.datosRespiradores?.debelidadBrazosManosPiernasSi_chk_62_si ?? false,
            probGenDolorEspalda: res.datosRespiradores?.dolorEspaldaSi_chk_63_si ?? false,
            probGenDificultadMoverBrazosPiernas: res.datosRespiradores?.dificultadMoverBrazosPiernasSi_chk_64_si ?? false,
            probGenDolorRigidezCintura: res.datosRespiradores?.dolorCinturaInclinaAdelanteAtrasSi_chk_65_si ?? false,
            probGenDificultadMoverCabezaArribaAbajo: res.datosRespiradores?.dificultadMoverCabezaArribaAbajoSi_chk_66_si ?? false,
            probGenDificultadMoverCabezaLadoALado: res.datosRespiradores?.dificultadMoverCabezaLadoSi_chk_67_si ?? false,
            probGenDificultadDoblarRodillas: res.datosRespiradores?.dificultadDoblarRodillasSi_chk_68_si ?? false,
            probGenDificultadCuclillas: res.datosRespiradores?.dificultadPonerCunclillasSi_chk_69_si ?? false,
            probGenSubirEscaleras: res.datosRespiradores?.subirEscalerasSi_chk_70_si ?? false,
            probGenOtros: res.datosRespiradores?.personalEmpleado3Otros14Si_chk_71_si ?? false,
            probGenOtrosDescripcion: res.datosRespiradores?.personalEmpleado3Otros14Descripcion_t_otros8 ?? "",

            // ====================== PERSONAL EMPLEADO 4======================
            alturaMareos: res.datosRespiradores?.mareosSi_chk_72_si ?? false,
            alturaDificultadRespirar: res.datosRespiradores?.dificultadRespiratoriaSi_chk_73_si ?? false,
            alturaPalpitaciones: res.datosRespiradores?.palpitacionesTrabajosAlturaSi_chk_74_si ?? false,
            alturaOtros: res.datosRespiradores?.personalEmpleado4Otros1Si_chk_75_si ?? false,
            alturaOtrosDescripcion: res.datosRespiradores?.personalEmpleado4Otros1Descripcion_t_otros9 ?? "",

            probPulmonAsbestos: res.datosRespiradores?.asbestoSi_chk_76_si ?? false,
            probPulmonSilice: res.datosRespiradores?.siliceSi_chk_77_si ?? false,
            probPulmonTungstenoCobalto: res.datosRespiradores?.tungstenoSi_chk_78_si ?? false,
            probPulmonBerilio: res.datosRespiradores?.berilioSi_chk_79_si ?? false,
            probPulmonAluminio: res.datosRespiradores?.aluminoSi_chk_80_si ?? false,
            probPulmonCarbon: res.datosRespiradores?.carbonSi_chk_81_si ?? false,
            probPulmonHierro: res.datosRespiradores?.hierroSi_chk_82_si ?? false,
            probPulmonLaton: res.datosRespiradores?.latonSi_chk_83_si ?? false,
            probPulmonAmbienteExcesoPolvo: res.datosRespiradores?.ambientesExcesoPolvoSi_chk_84_si ?? false,
            probPulmonIndustrialesOtros: res.datosRespiradores?.personalEmpleado4Otros2Si_chk_85_si ?? false,
            probPulmonIndustrialesOtrosDescripcion: res.datosRespiradores?.personalEmpleado4Otros2Descripcion_t_otros10 ?? "",

            trabajosExpuestosPeligrosRespiratorios: res.datosRespiradores?.trabajoPrevio_t_trabajo_promedio ?? "",
            servicioMilitar: res.datosRespiradores?.servicioMilitarSi_chk_86_si ?? false,
            equipoMatpelEmergencias: res.datosRespiradores?.equipoMatpelSi_chk_87_si ?? false,

            // ====================== TAB 6 FINAL AUTORIZACION======================
            supervisor: res.datosRespiradores?.supervisor_m_supervisor ?? "DESCONOCIDO",
            claseAutorizacion: "CLASE_I", //revisar - mapear según autorizacionClase1_chk_f_1, autorizacionClase2_chk_f_2, etc.
            claseIIOpcion: "", //revisar
            fechaExpiraAutorizacion: res.datosRespiradores?.fechaExpira_fecha_expira ?? getTodayPlusOneYear(),
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
        codigoRespiradores: form.codigoRespiradores,
        dniPaciente: form.dni,
        edad: form.edad,
        fechaExamen: form.fechaExam,
        tiempoPromedioHoras: form.promedioHorasDia,
        mascaraPolvo: form.respiradorMascaraPolvo,
        mediaCara: form.respiradorMediaCara,
        caraCompleta: form.respiradorCaraCompleta,
        purificadorAireSinEnergia: form.tipoRespiradorTipo === "PURIFICADOR_SIN_ENERGIA",
        purificadorAireConEnergia: form.tipoRespiradorTipo === "PURIFICADOR_CON_ENERGIA",
        respiradorSuministradorAtmosfera: form.tipoRespiradorTipo === "SUMINISTRADOR_ATMOSFERA",
        combinacionScba: form.tipoRespiradorTipo === "COMBINACION_LINEA_AIRE_SCBA",
        respiradorFlujoContinuo: form.tipoRespiradorTipo === "FLUJO_CONTINUO",
        respiradorSuministradorAire: form.tipoRespiradorTipo === "SUMINISTRO_AIRE",
        scbaCircuitoAbierto: form.tipoRespiradorTipo === "SCBA_CIRCUITO_ABIERTO",
        scbaCircuitoCerrado: form.tipoRespiradorTipo === "SCBA_CIRCUITO_CERRADO",
        filtroHepa: form.tipoProteccion === "FILTRO_HEPA",
        cartuchosGasAcido: form.tipoProteccion === "CARTUCHO_GAS_ACIDO",
        cartuchosVaporOrganico: form.tipoProteccion === "CARTUCHO_VAPOR_ORGANICO",
        cartuchosAmoniaco: form.tipoProteccion === "CARTUCHO_AMONIACO",
        cartuchosMercurio: form.tipoProteccion === "CARTUCHO_MERCURIO",
        esfuerzoFisicoLigero: form.esfuerzoFisico === "LIGERO",
        esfuerzoFisicoModerado: form.esfuerzoFisico === "MODERADO",
        esfuerzoFisicoPesado: form.esfuerzoFisico === "PESADO",
        maneraDia: form.frecuenciaUso === "DIARIO",
        ocasional: form.frecuenciaUso === "OCASIONAL",
        raraVez: form.frecuenciaUso === "EMERGENCIA",
        humoMetal: form.expHumoMetal,
        arsenico: form.expArsenico,
        plomo: form.expPlomo,
        asbesto: form.expAsbesto,
        dpm: form.expDpm,
        monoxidoCarbono: form.expMonoxidoCarbono,
        dioxidoCarbono: form.expDioxidoCarbono,
        vaporOrganico: form.expVaporOrganico,
        amoniaco: form.expAmoniaco,
        polvoRespirable: form.expPolvoRespirable,
        silice: form.expSilice,
        mercurio: form.expMercurio,
        otros: form.expOtros,
        elevacionesAltas: form.elevacionesAltas,
        temperaturaExtrema: form.temperaturasExtremas,
        atmosferaHumeda: form.atmosferasHumidas,
        espaciosConfinados: form.espaciosConfirmados,
        atmosferasIdlh: form.atmosferasIDLH,
        hazmatFuegoRescateMina: form.hazmatFuegoRescate,
        eppAdicional: form.eppAdicionalUtilizado,
        otrosCondicionesEspeciales: form.otrosCondicionesTrabajo,
        fumaSi: form.fumaUltimoMes,
        fumaNo: !form.fumaUltimoMes,
        palpitacionesSi: form.condPalpitaciones,
        palpitacionesNo: !form.condPalpitaciones,
        convulsionSi: form.condConvulsiones,
        convulsionNo: !form.condConvulsiones,
        diabetesSi: form.condDiabetes,
        diabetesNo: !form.condDiabetes,
        reaccionesAlergicasSi: form.condReaccionesAlergicasRespiracion,
        reaccionesAlergicasNo: !form.condReaccionesAlergicasRespiracion,
        claustrofobiaSi: form.condClaustrofobia,
        claustrofobiaNo: !form.condClaustrofobia,
        asbestosisSi: form.probPulmonAsbestosis,
        asbestosisNo: !form.probPulmonAsbestosis,
        asmaSi: form.probPulmonAsma,
        asmaNo: !form.probPulmonAsma,
        bronquitisCronicaSi: form.probPulmonBronquitisCronica,
        bronquitisCronicaNo: !form.probPulmonBronquitisCronica,
        enfisemaSi: form.probPulmonEnfisema,
        enfisemaNo: !form.probPulmonEnfisema,
        neumoniaSi: form.probPulmonNeumonia,
        neumoniaNo: !form.probPulmonNeumonia,
        tuberculosisSi: form.probPulmonTuberculosis,
        tuberculosisNo: !form.probPulmonTuberculosis,
        silicosisSi: form.probPulmonSilicosis,
        silicosisNo: !form.probPulmonSilicosis,
        neumotoraxSi: form.probPulmonNeumotorax,
        neumotoraxNo: !form.probPulmonNeumotorax,
        cancerPulmonSi: form.probPulmonCancer,
        cancerPulmonNo: !form.probPulmonCancer,
        costillasFracturadasSi: form.probPulmonCostillasFracturadas,
        costillasFracturadasNo: !form.probPulmonCostillasFracturadas,
        cualquierLesionPulmonSi: form.probPulmonLesionCirugia,
        cualquierLesionPulmonNo: !form.probPulmonLesionCirugia,
        personalEmpleado1Otros3Si: form.probPulmonOtros,
        personalEmpleado1Otros3No: !form.probPulmonOtros,
        dificultadRespirarReposoSi: form.sintRespirarReposo,
        dificultadRespirarReposoNo: !form.sintRespirarReposo,
        dificultadRespirarCaminaNivelSueloSi: form.sintRespirarCaminaNivel,
        dificultadRespirarCaminaNivelSueloNo: !form.sintRespirarCaminaNivel,
        dificultadRespirarCaminaInclinadoSi: form.sintRespirarCaminaInclinacion,
        dificultadRespirarCaminaInclinadoNo: !form.sintRespirarCaminaInclinacion,
        dificultadRespiraAlgunaTareaSi: form.sintRespirarAlTarea,
        dificultadRespiraAlgunaTareaNo: !form.sintRespirarAlTarea,
        tosProduceExpectoracionSi: form.sintTosExpectoracion,
        tosProduceExpectoracionNo: !form.sintTosExpectoracion,
        tosDespiertaTempranoSi: form.sintTosDespiertaManana,
        tosDespiertaTempranoNo: !form.sintTosDespiertaManana,
        tosEchadoSi: form.sintTosEchado,
        tosEchadoNo: !form.sintTosEchado,
        tosSangreSi: form.sintTosConSangre,
        tosSangreNo: !form.sintTosConSangre,
        silbidoPechoRespiraSi: form.sintSilbidosPecho,
        silbidoPechoRespiraNo: !form.sintSilbidosPecho, dolorPechoRespiraProfundamenteSi: form.sintDolorPechoRespira,
        dolorPechoRespiraProfundamenteNo: !form.sintDolorPechoRespira,
        personalEmpleado1Otros4Si: form.sintOtros,
        personalEmpleado1Otros4No: !form.sintOtros,
        infartoSi: form.cardioInfarto,
        infartoNo: !form.cardioInfarto,
        anginaSi: form.cardioAngina,
        anginaNo: !form.cardioAngina,
        insuficienciaCardiacaSi: form.cardioInsuficienciaCardiaca,
        insuficienciaCardiacaNo: !form.cardioInsuficienciaCardiaca,
        hinchazonPiernasSi: form.cardioHinchazonPiernasPies,
        hinchazonPiernasNo: !form.cardioHinchazonPiernasPies,
        arritmiaCorazonSi: form.cardioArritmiaCorazon,
        arritmiaCorazonNo: !form.cardioArritmiaCorazon,
        reflujoGastroesofaticoSi: form.cardioReflujoGastroesofagicoNoComida,
        reflujoGastroesofaticoNo: !form.cardioReflujoGastroesofagicoNoComida,
        personalEmpleado2Otros5Si: form.cardioOtros,
        personalEmpleado2Otros5No: !form.cardioOtros,
        dolorPresionPechoSi: form.sintCardioDolorPresionPecho,
        dolorPresionPechoNo: !form.sintCardioDolorPresionPecho,
        dolorPresionPechoActividadFisicaSi: form.sintCardioDolorPresionPechoActividadFisica,
        dolorPresionPechoActividadFisicaNo: !form.sintCardioDolorPresionPechoActividadFisica,
        dolorPresionPechoActividadTrabajoSi: form.sintCardioDolorPresionPechoTrabajo,
        dolorPresionPechoActividadTrabajoNo: !form.sintCardioDolorPresionPechoTrabajo,
        palpitacionesSintomasCardiovascularesSi: form.sintCardioPalpitaciones,
        palpitacionesSintomasCardiovascularesNo: !form.sintCardioPalpitaciones,
        acidesEstomacalSi: form.sintCardioAcidezIndigestionNoComida,
        acidesEstomacalNo: !form.sintCardioAcidezIndigestionNoComida,
        personalEmpleado2Otros6Si: form.sintCardioOtros,
        personalEmpleado2Otros6No: !form.sintCardioOtros,
        problemaRespiratorioSi: form.medsProblemaRespiratorio,
        problemaRespiratorioNo: !form.medsProblemaRespiratorio,
        problemasCorazonSi: form.medsProblemasCorazon,
        problemasCorazonNo: !form.medsProblemasCorazon,
        presionSanguineaSi: form.medsPresionSanguinea,
        presionSanguineaNo: !form.medsPresionSanguinea,
        convulsionesSi: form.medsConvulsiones,
        convulsionesNo: !form.medsConvulsiones,
        irritacionOjosSi: form.respIrritacionOjos,
        irritacionOjosNo: !form.respIrritacionOjos,
        alergiasPielSi: form.respAlergiasPielErupciones,
        alergiasPielNo: !form.respAlergiasPielErupciones,
        ansiedadSi: form.respAnsiedad,
        ansiedadNo: !form.respAnsiedad,
        fatigaDebilidadSi: form.respFatigaDebilidad,
        fatigaDebilidadNo: !form.respFatigaDebilidad,
        personalEmpleado2Otros8Si: form.respOtros,
        personalEmpleado2Otros8No: !form.respOtros,
        perdidaVisionCualquierOjoSi: form.visionPerdidaOjo,
        perdidaVisionCualquierOjoNo: !form.visionPerdidaOjo,
        lentesContactoSi: form.visionUsaLentesContacto,
        lentesContactoNo: !form.visionUsaLentesContacto,
        lentesSi: form.visionUsaLentes,
        lentesNo: !form.visionUsaLentes,
        daltonismoSi: form.visionDaltonismo,
        daltonismoNo: !form.visionDaltonismo,
        personalEmpleado3Otros10Si: form.visionOtros,
        personalEmpleado3Otros10No: !form.visionOtros,
        lesionOidosSi: form.oidoLesionTimpanoRoto,
        lesionOidosNo: !form.oidoLesionTimpanoRoto,
        dificultadEscucharSi: form.audicionDificultadEscuchar,
        dificultadEscucharNo: !form.audicionDificultadEscuchar,
        usaAudifonoSi: form.audicionUsaAudifono,
        usaAudifonoNo: !form.audicionUsaAudifono,
        personalEmpleado3Otros12Si: form.audicionOtros,
        personalEmpleado3Otros12No: !form.audicionOtros,
        lesionEspaldaSi: form.espaldaLesion,
        lesionEspaldaNo: !form.espaldaLesion,
        debelidadBrazosManosPiernasSi: form.probGenDebilidadExtremidades,
        debelidadBrazosManosPiernasNo: !form.probGenDebilidadExtremidades,
        dolorEspaldaSi: form.probGenDolorEspalda,
        dolorEspaldaNo: !form.probGenDolorEspalda,
        dificultadMoverBrazosPiernasSi: form.probGenDificultadMoverBrazosPiernas,
        dificultadMoverBrazosPiernasNo: !form.probGenDificultadMoverBrazosPiernas,
        dolorCinturaInclinaAdelanteAtrasSi: form.probGenDolorRigidezCintura,
        dolorCinturaInclinaAdelanteAtrasNo: !form.probGenDolorRigidezCintura,
        dificultadMoverCabezaArribaAbajoSi: form.probGenDificultadMoverCabezaArribaAbajo,
        dificultadMoverCabezaArribaAbajoNo: !form.probGenDificultadMoverCabezaArribaAbajo,
        dificultadMoverCabezaLadoSi: form.probGenDificultadMoverCabezaLadoALado,
        dificultadMoverCabezaLadoNo: !form.probGenDificultadMoverCabezaLadoALado,
        dificultadDoblarRodillasSi: form.probGenDificultadDoblarRodillas,
        dificultadDoblarRodillasNo: !form.probGenDificultadDoblarRodillas,
        dificultadPonerCunclillasSi: form.probGenDificultadCuclillas,
        dificultadPonerCunclillasNo: !form.probGenDificultadCuclillas,
        subirEscalerasSi: form.probGenSubirEscaleras,
        subirEscalerasNo: !form.probGenSubirEscaleras,
        personalEmpleado3Otros14Si: form.probGenOtros,
        personalEmpleado3Otros14No: !form.probGenOtros,
        mareosSi: form.alturaMareos,
        mareosNo: !form.alturaMareos,
        dificultadRespiratoriaSi: form.alturaDificultadRespirar,
        dificultadRespiratoriaNo: !form.alturaDificultadRespirar,
        palpitacionesTrabajosAlturaSi: form.alturaPalpitaciones,
        palpitacionesTrabajosAlturaNo: !form.alturaPalpitaciones,
        personalEmpleado4Otros1Si: form.alturaOtros,
        personalEmpleado4Otros1No: !form.alturaOtros,
        asbestosSi: form.probPulmonAsbestos,
        asbestosNo: !form.probPulmonAsbestos,
        siliceSi: form.probPulmonSilice,
        siliceNo: !form.probPulmonSilice,
        tungstenoSi: form.probPulmonTungstenoCobalto,
        tungstenoNo: !form.probPulmonTungstenoCobalto,
        berilioSi: form.probPulmonBerilio,
        berilioNo: !form.probPulmonBerilio,
        aluminoSi: form.probPulmonAluminio,
        aluminoNo: !form.probPulmonAluminio,
        carbonSi: form.probPulmonCarbon,
        carbonNo: !form.probPulmonCarbon,
        hierroSi: form.probPulmonHierro,
        hierroNo: !form.probPulmonHierro,
        latonSi: form.probPulmonLaton,
        latonNo: !form.probPulmonLaton,
        ambientesExcesoPolvoSi: form.probPulmonAmbienteExcesoPolvo,
        ambientesExcesoPolvoNo: !form.probPulmonAmbienteExcesoPolvo,
        personalEmpleado4Otros2Si: form.probPulmonIndustrialesOtros,
        personalEmpleado4Otros2No: !form.probPulmonIndustrialesOtros,
        servicioMilitarSi: form.servicioMilitar,
        servicioMilitarNo: !form.servicioMilitar,
        equipoMatpelSi: form.equipoMatpelEmergencias,
        equipoMatpelNo: !form.equipoMatpelEmergencias,
        otrosCondicionesEspecialesDescripcion: form.otrosCondicionesTrabajoDescripcion,
        personalEmpleado1Otros3Descripcion: form.probPulmonOtrosDescripcion,
        personalEmpleado1Otros4Descripcion: form.sintOtrosDescripcion,
        personalEmpleado2Otros5Descripcion: form.cardioOtrosDescripcion,
        personalEmpleado2Otros6Descripcion: form.sintCardioOtrosDescripcion,
        personalEmpleado2Otros8Descripcion: form.respOtrosDescripcion,
        personalEmpleado3Otros10Descripcion: form.visionOtrosDescripcion,
        personalEmpleado3Otros12Descripcion: form.audicionOtrosDescripcion,
        personalEmpleado3Otros14Descripcion: form.probGenOtrosDescripcion,
        personalEmpleado4Otros1Descripcion: form.alturaOtrosDescripcion,
        personalEmpleado4Otros2Descripcion: form.probPulmonIndustrialesOtrosDescripcion,
        trabajoPrevio: form.trabajosExpuestosPeligrosRespiratorios,
        idEmpleado: form.norden,
        cargo: form.puestoActual, //revisar
        mineraBarrick: form.empresa, //revisar
        supervisor: form.supervisor,
        autorizacionClase1: form.claseAutorizacion === "CLASE_I",
        autorizacionClase2: form.claseAutorizacion === "CLASE_II",
        utilizadosRespuestaEmergencia: form.claseAutorizacion === "EMERGENCIA",
        soloPapr: form.claseIIOpcion === "PAPR",
        noSbca: form.claseIIOpcion === "NO_SBCA",
        autorizacionOtros: form.claseAutorizacion === "OTROS",
        autorizacionClase3: form.claseAutorizacion === "CLASE_III",
        autorizacionClase4: form.claseAutorizacion === "CLASE_IV",
        autorizacionClase5: form.claseAutorizacion === "CLASE_V",
        fechaExpira: form.fechaExpiraAutorizacion,
        dniUsuario: form.dniUsuario,
        usuarioRegistro: user,
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
    // Ruta de jaspers (si se agregan en el futuro). No bloquea si no existen.
    const jasperModules = import.meta.glob("../../../../jaspers/UsoRespiradores/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/UsoRespiradores"
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
            // NO tiene registro
            GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
        },
        () => {
            // Tiene registro
            GetInfoServicioEditar(nro, tabla, set, token, () => {
                Swal.fire(
                    "Alerta",
                    "Este paciente ya cuenta con registros de Uso de Respiradores",
                    "warning"
                );
            });
        },
        () => {
            // Necesita agudeza visual / triaje
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
            noTieneRegistro();
        } else if (res.id === 2) {
            necesitaExamen();
        } else {
            tieneRegistro();
        }
    });
};

export const Loading = (mensaje) => {
    LoadingDefault(mensaje);
};