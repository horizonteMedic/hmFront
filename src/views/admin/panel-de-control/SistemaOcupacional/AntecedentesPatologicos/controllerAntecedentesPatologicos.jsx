import Swal from "sweetalert2";
import {
    GetInfoServicioDefault,
    LoadingDefault,
    PrintHojaRDefault,
    SubmitDataServiceDefault,
} from "../../../../utils/functionUtils";
import { getFetch } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
    "/api/v01/ct/antecedentesPatologicos/obtenerReporteAntecedentesPatologicos";
const registrarUrl =
    "/api/v01/ct/antecedentesPatologicos/registrarActualizarAntecedentesPatologicos";

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
        let presion_sistolica = parseFloat(res.sistolica);
        let presion_diastolica = parseFloat(res.diastolica);
        let hipertension = false;
        if (!isNaN(presion_sistolica) && !isNaN(presion_diastolica) &&
            (presion_sistolica >= 140 || presion_diastolica >= 90)) {
            // concatenacionObservacion += "HTA NO CONTROLADA.\n";
            hipertension = true;
        }

        const medicamentosAnexo16A = res.medicamentosAnexo16A ?? "";

        set((prev) => ({
            ...prev,
            norden: res.n_orden,
            codigoAntecedentesPatologicos_cod_ap: res.codigoAntecedentesPatologicos_cod_ap,
            nombres: res.nombres_nombres_pa + " " + res.apellidos_apellidos_pa,
            sexo: res.sexo_sexo_pa == "M" ? "MASCULINO" : "FEMENINO",
            edad: res.edad_edad + " AÑOS",
            boroo: res.esBoro ?? false,

            hipertensionArterial: hipertension,

            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares,
            enfOculares: (res.enfermedadesocularesoftalmo_e_oculares || "") != "" && !(res.enfermedadesocularesoftalmo_e_oculares || "").includes("NINGUNA"),
            vcOD: res.visioncercasincorregirod_v_cerca_s_od,
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi,
            vcCorregidaOD: res.oftalodccmologia_odcc,
            vcCorregidaOI: res.oiccoftalmologia_oicc,
            vlOD: res.visionlejossincorregirod_v_lejos_s_od,
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi,
            vlCorregidaOD: res.odlcoftalmologia_odlc,
            vlCorregidaOI: res.oilcoftalmologia_oilc,
            vclrs: res.vcoftalmologia_vc,
            vb: res.vboftalmologia_vb,
            rp: res.rpoftalmologia_rp,
            cocaina: res.cocainaLaboratorioClinico_txtcocaina,
            cocainaRed: (res.cocainaLaboratorioClinico_txtcocaina ?? "") == "POSITIVO",
            marihuana: res.marihuanaLaboratorioClinico_txtmarihuana,
            marihuanaRed: (res.marihuanaLaboratorioClinico_txtmarihuana ?? "") == "POSITIVO",

            medicamentos: medicamentosAnexo16A != "",
            especifiqueMedicamentos: medicamentosAnexo16A,

            antecedentes: res.antecedentesPatologicosQuirurjicos.map((item) => ({
                codAntecedentesPatologicosQuirurgicos: item.codAntecedentesPatologicosQuirurgicos,
                quirurjicosId: item.quirurjicosId,
                fecha: item.fecha,
                hospitalOperacion: item.hospitalOperacion,
                operacion: item.operacion,
                diasHospitalizado: item.diasHospitalizado,
                complicaciones: item.complicaciones,
            })) || [],
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
            //PRIMERA TAB==========================================================================
            norden: res.n_orden,
            codigoAntecedentesPatologicos_cod_ap: res.codigoAntecedentesPatologicos_cod_ap,
            fechaExam: res.fechaAntecedentesPatologicos_fecha_ap,
            nombres: res.nombres_nombres_pa + " " + res.apellidos_apellidos_pa,
            sexo: res.sexo_sexo_pa == "M" ? "MASCULINO" : "FEMENINO",
            edad: res.edad_edad + " AÑOS",
            boroo: res.esBoro ?? false,

            covid19: res.covid_chkcovid,
            fechaCovid: res.fechaCovid_fechacovid,
            severidadCovid: res.covidLevel_chkcovidl ? "LEVE" : res.covidModerado_chkcovidm ? "MODERADA" : res.covidSevero_chkcovids ? "SEVERA" : "",

            ruido: res.ruidoAnexo7c_chkruido,
            polvo: res.polvoAnexo7c_chkpolvo,
            vidSegmentario: res.vidSegmentarioAnexo7c_chkvidsegmentario,
            vidTotal: res.vidTotalAnexo7c_chkvidtotal,
            alturaEstruct: res.alturaEstructuraAnexo7c_altura_estructura,
            vibraciones: res.vibracionesAnexo7c_vibraciones,
            cancerigenos: res.cancerigenosAnexo7c_chkcancerigenos,
            mutagenicos: res.mutagenicosAnexo7c_chkmutagenicos,
            solventes: res.solventesAnexo7c_chksolventes,
            metales: res.metalesAnexo7c_chkmetales,
            alturaGeograf: res.alturaGeograficaAnexo7c_altura_geog,
            temperaturaAgente: res.temperaturaAnexo7c_chktemperatura,
            biologicos: res.biologicosAnexo7c_chkbiologicos,
            posturas: res.posturasAnexo7c_chkposturas,
            turnos: res.turnosAnexo7c_chkturnos,
            quimicos: res.quimicosAnexo7c_quimicos,
            cargas: res.cargasAnexo7c_chkcargas,
            movRepet: res.movRepetAnexo7c_chkmovrepet,
            pvd: res.pvdAnexo7c_chkpvd,
            electricos: res.electricosAnexo7c_electricos,
            otrosAgentes: res.otrosAnexo7c_chkotros,

            alergias: res.alergias_chk1,
            amigdalitisCronica: res.amigdalitisCronica_chk2,
            arritmiasCardiacas: res.arritmiasCardiacas_chk3,
            asma: res.asma_chk4,
            bocio: res.bocio_chk5,
            bronconeumonia: res.bronconeumonia_chk6,
            bronquitisRepeticion: res.bronquitisARepeticion_chk7,
            cariesGingivitis: res.cariesOGingivitis_chk8,
            colecistitis: res.colecistitis_chk9,
            dermatitis: res.dermatitis_chk10,
            diabetes: res.diabetes_chk11,
            disenteria: res.disenteria_chk12,
            enfCorazon: res.enfermedadesCorazon_chk13,
            enfOculares: res.enfermedadesOculares_chk14,

            epilepsiaConvulsiones: res.epilsepsiaOConvulsiones_chk15,
            faringitisCronica: res.faringitisCronica_chk16,
            fiebreMalta: res.fiebreMalta_chk17,
            fiebreTifoidea: res.fiebreTifoidea_chk18,
            tifoidea: res.tifoideaBoro_tifoidea,
            vertigos: res.vertigosBoro_vertigos,
            fiebreReumatica: res.fiebreReumatica_chk19,
            forunculosis: res.foruncolois_chk20,

            gastritisCronica: res.gastritisCronica_chk21,
            gonorrea: res.gonorrea_chk22,
            gota: res.gota_chk23,
            hemorroides: res.hemorroides_chk24,
            hepatitis: res.hepatitis_chk25,
            hernias: res.hernias_chk26,
            hipertensionArterial: res.hipertencionArterial_chk27,
            infUrinariasRepetidas: res.urinariasRepetidas_chk28,
            intoxicaciones: res.intoxicaciones_chk29,
            insuficienciaCardiaca: res.insuficienciaCardiaca_chk30,
            insuficienciaCoronariaCronica: res.insuficienciaCoronariaCronica_chk31,
            insuficienciaRenalCronica: res.insuficienciaRenalCronica_chk32,
            litiasisUrinaria: res.litiasisUrinaria_chk33,
            meningitis: res.meningitis_chk34,
            neuritisRepeticion: res.neuritis_chk35,
            otitisMedia: res.otitisMedia_chk36,
            presionAltaBaja: res.presionAltaOBaja_chk37,
            paludismoMalaria: res.paludismoOMalaria_chk38,
            parasitosisIntestinal: res.parasitosisIntestinal_chk39,
            parotiditis: res.paratiditis_chk40,

            pleuresia: res.pleuresia_chk41,
            plumbismo: res.plumbismo_chk42,
            poliomielitis: res.poliomielitis_chk43,
            portadorMarcapaso: res.portadorMarcapasos_chk44,
            protesisCardiacasValvulares: res.protesisCardiacasValvulares_chk45,
            resfriosFrecuentes: res.resfriosFrecuentes_chk46,
            reumatismoRepeticion: res.reumatismo_chk47,
            sarampion: res.sarampion_chk48,
            sifilis: res.sifilis_chk49,
            silicosis: res.silicosis_chk50,
            sinusitisCronica: res.sinusitisCronica_chk51,
            tosConvulsiva: res.tosConvulsiva_chk52,
            trastornosNerviosos: res.transtornosNerviosos_chk53,
            traumatismoEncefalocraneano: res.traumatismoEncefalocraneano_chk54,
            tuberculosis: res.tuberculosis_chk55,
            tumoresQuistes: res.tumoresQuistes_chk56,
            ulceraPeptica: res.ulceraPeptica_chk57,
            varicela: res.varicela_chk58,
            varices: res.varices_chk59,
            varicocele: res.varicocele_chk60,

            ima: res.imaBoro_ima,
            acv: res.acvBoro_acv,
            tbc: res.tbcBoro_tbc,
            ets: res.etsBoro_ets,
            vih: res.vihBoro_vih,
            fobias: res.fobiasBoro_fobias,

            neoplasias: res.neoplasiasBoro_neoplasias,
            quemaduras: res.quemadurasBoro_quemaduras,
            discopatias: res.discopatiasBoro_discopatias,
            columna: res.columnaBoro_columna,
            enfPsiquiatricas: res.enfermedadesPsiquiatricasBoro_enf_psiquiatricas,

            enfReumatica: res.enfermedadesReumaticasBoro_enf_reumatica,
            enfPulmonares: res.enfermedadesPulmonaresBoro_enf_pulmonares,
            enfPiel: res.enfermedadesPielBoro_enf_piel,
            tendinitis: res.tendinitisBoro_tendinitis,
            onicomicosis: res.onicomicosisBoro_onicomicosis,
            fracturas: res.fracturasBoro_fracturas,
            anemia: res.anemiaBoro_anemia,
            obesidad: res.obesidadBoro_obesidad,
            dislipidemia: res.dislipidemiaBoro_dislipidemia,
            amputacion: res.amputacionBoro_amputacion,
            sordera: res.sorderaBoro_sordera,
            migrana: res.migranaBoro_migrana,

            otrasPatologias: res.otrosDescripcionAntecedentesPatologicos_txtotrosap,
            detallesTratamiento: res.especifiqueTratamientoBoro_especifique_detalleenfermedades,
            alergiasMedicamentos: res.alergiasAlimentosBoro_alergias_medic_alim,
            especifiqueAlergias: res.alergiasAlimentosEspecifiqueBoro_alergias_medic_alimdetall,

            accidenteTrabajo: res.accidenteTrabajoBoro_accitrabajo,
            fechaAccidente: res.accidenteTrabajoFechaBoro_accit_fecha,
            tiempoPerdido: res.descansoMedicoBoro_accit_descanso,
            especifiqueTiempoPerdido: res.descansoMedicoEspecifiqueBoro_accit_descanso_detal,
            tipoIncapacidad: res.tiempoIncapacidadBoro_timeincapacidad,

            enfermedadProfesional: res.enfermedadesProfesionalesBoro_enfe_prof,
            evaluadoCalificacion: res.enfermedadesLaboralesCalificacionBoro_enfe_lab_calif,
            especifiqueCalificacion: res.enfermedadesLaboralesEspecifiqueBoro_enfe_lab_califdetal,
            fechaCalificacion: res.enfermedadesProfesionalesFechaBoro_enfe_profecha,

            //LATERAL TAB==========================================================================
            vcOD: res.visioncercasincorregirod_v_cerca_s_od,
            vlOD: res.visionlejossincorregirod_v_lejos_s_od,
            vcOI: res.visioncercasincorregiroi_v_cerca_s_oi,
            vlOI: res.visionlejossincorregiroi_v_lejos_s_oi,
            vcCorregidaOD: res.oftalodccmologia_odcc,
            vlCorregidaOD: res.odlcoftalmologia_odlc,
            vcCorregidaOI: res.oiccoftalmologia_oicc,
            vlCorregidaOI: res.oilcoftalmologia_oilc,
            vclrs: res.vcoftalmologia_vc,
            vb: res.vboftalmologia_vb,
            rp: res.rpoftalmologia_rp,
            enfermedadesOculares: res.enfermedadesocularesoftalmo_e_oculares,
            dosisVacunas: res.dosisVacunas_txtdosis,
            cocaina: res.cocainaLaboratorioClinico_txtcocaina,
            cocainaRed: (res.cocainaLaboratorioClinico_txtcocaina ?? "") == "POSITIVO",
            marihuana: res.marihuanaLaboratorioClinico_txtmarihuana,
            marihuanaRed: (res.marihuanaLaboratorioClinico_txtmarihuana ?? "") == "POSITIVO",

            //SEGUNDA TAB==========================================================================
            perdidaMemoria: res.perdidaMemoria_chk61,
            preocupacionesAngustia: res.preocupacionesAngustia_chk62,
            doloresArticulares: res.doloresArticulares_chk63,
            aumentoDisminucionPeso: res.aumentoDisminucionPeso_chk64,
            dolorCabeza: res.dolorCabeza_chk65,
            diarrea: res.diarrea_chk66,
            agitacionEjercicios: res.agitacionEjercicio_chk67,
            dolorOcular: res.dolorOcular_chk68,
            dolorOpresivoTorax: res.dolorOpresivoTorax_chk69,
            hinchazonPiesManos: res.hinchazonPiesOManos_chk70,

            estrenimiento: res.estrenimiento_chk71,
            vomitosSangre: res.vomitosConSangre_chk72,
            sangradoOrina: res.sangradoPorOrina_chk73,
            tosSangre: res.tosConSangre_chk74,
            coloracionAmarilla: res.coloracionAmarrillaPiel_chk75,
            indigestionFrecuente: res.indigestionFrecuente_chk76,
            insomnio: res.insomnio_chk77,
            lumbalgias: res.lumbalgiaODolorCintura_chk78,
            mareosDesmayos: res.mareos_chk79,
            hecesNegras: res.hecesNegras_chk80,

            orinaDolorArdor: res.orinaConDolor_chk81,
            orinaInvoluntaria: res.orinaInvoluntaria_chk82,
            dolorOido: res.dolorOido_chk83,
            secrecionesOido: res.secrecionesOido_chk84,
            palpitaciones: res.palpitaciones_chk85,
            adormecimientos: res.adormecimientos_chk86,
            pesadillasFrecuentes: res.pesadillasFrecuentes_chk87,
            doloresMusculares: res.doloresMusculares_chk88,
            tosCronica: res.tosCronica_chk89,
            sangradoEncias: res.sangradoEncias_chk90,
            otrasEnfermedades: res.otrosDescripcionIndicarEnfermedades_txtotros1ap,

            antitetanica: res.antitetanicaBoro_antitetanica,
            fiebreAmarilla: res.fiebreAmarillaBoro_fiebre_amarilla,
            influenza: res.influenzaBoro_influenza,
            hepatitisA: res.hepatitisABoro_hepatitisa,
            hepatitisB: res.hepatitisBBoro_hepatitisb,

            gripeInfluenza: res.gripeInfluenzaBoro_gripe_influenza,
            neumococo: res.neumococoBoro_neumococo,
            rabia: res.rabiaBoro_rabia,
            papilomaHumano: res.papilomaHumanoBoro_papiloma_humano,
            covidAntecedentePatologico: res.covidAntecedentePatologicoBoro_covid_antepatologico,

            drogas: res.drogasSi_rbdrogassi ?? false,
            tipoDrogas: res.drogasTipo_txtdrogastipo ?? "",
            frecuenciaDrogas: res.drogasFrecuencia_txtdrogasfrecuencia ?? "",

            licor: res.licorSi_rblicorsi ?? false,
            tipoLicor: res.licorTipoFrecuente_txtlicortipofrecuente ?? "",
            frecuenciaLicor: res.licorFrecuencia_txtlicorfrecuencia ?? "",

            fumar: res.fumarSi_rbfumarsi ?? false,
            numeroCigarrillos: res.numeroCigarrillos_txtncigarrillos ?? "",

            otros: res.otrosSiIndicarEnfermedades_rbotrossi ?? false,
            tipoOtros: res.otrosTipoIndicarEnfermedades_txtotros ?? "",
            frecuenciaOtros: res.otrosFrecuenciaIndicarEnfermedades_txtotrosfrecuencia ?? "",

            medicamentos: res.medicamentoBoro_medicamento,
            especifiqueMedicamentos: res.medicamentoEspecifiqueBoro_medicamento_detal,

            actividadFisica: res.actividadFisicaBoro_activ_fisic,
            especifiqueActividadFisica: res.actividadFisicaEspecifiqueBoro_activ_fisic_detal,

            //TERCERA TAB==========================================================================
            // antecedentes: res.antecedentesPatologicosQuirurjicos || [],
            antecedentes: res.antecedentesPatologicosQuirurjicos.map((item) => ({
                codAntecedentesPatologicosQuirurgicos: item.codAntecedentesPatologicosQuirurgicos,
                quirurjicosId: item.quirurjicosId,
                fecha: item.fecha,
                hospitalOperacion: item.hospitalOperacion,
                operacion: item.operacion,
                diasHospitalizado: item.diasHospitalizado,
                complicaciones: item.complicaciones,
            })) || [],

            hijosVivos: res.hijosVivosVarones_txtvhijosvivos,
            hijosFallecidos: res.hijosFallecidosVarones_txtvhijosfallecidos,
            abortosParejas: res.abortosParejasVarones_txtvnabortosparejas,
            causasAbortos: res.precisarCausasVarones_txtvcausas,

            inicioMenstruacion: res.inicioMestruacionDamas_txtdiniciomestruacion,
            inicioVidaSexual: res.inicioVidaSexualDamas_txtdiniciovidasexual,
            parejasSexuales: res.numeroParejasSexActualidadDamas_txtdnumparejassexactualidad,
            hijosVivosDamas: res.hijosVivosDamas_txtdhijosvivos,
            hijosFallecidosDamas: res.hijosFallecidosDamas_txtdhijosfallecidos,
            abortosDamas: res.numerosDeAbortosDamas_txtdnumerosdeabortos,
            causasAbortosDamas: res.precisarCausasDamas_txtdcausas,

            padre: res.padreEspecifiqueBoro_padre_detall,
            madre: res.madreEspecifiqueBoro_madre_detall,
            hermanos: res.hermanosEspecifiqueBoro_hermanos_detall,
            hijos: res.hijosEspecifiqueBoro_hijos_detall,
            esposaConyuge: res.esposConyEspecifiqueBoro_espos_cony_detall,
            carnetConadis: res.conadisEspecifiqueBoro_conadisdetalle,
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
    console.log({ ff: form.antecedentesEliminados })
    const body = {
        norden: form.norden,
        codigoAntecedentesPatologicos: form.codigoAntecedentesPatologicos_cod_ap,
        edad: form.edad.replace(" AÑOS", ""),
        fechaAntecedentesPatologicos: form.fechaExam,
        dniUsuario: form.dniUsuario,
        alergias: form.alergias,
        amigdalitisCronica: form.amigdalitisCronica,
        arritmiasCardiacas: form.arritmiasCardiacas,
        asma: form.asma,
        bocio: form.bocio,
        bronconeumonia: form.bronconeumonia,
        bronquitisARepeticion: form.bronquitisRepeticion,
        cariesOGingivitis: form.cariesGingivitis,
        colecistitis: form.colecistitis,
        dermatitis: form.dermatitis,
        diabetes: form.diabetes,
        disenteria: form.disenteria,
        enfermedadesCorazon: form.enfCorazon,
        enfermedadesOculares: form.enfOculares,
        epilsepsiaOConvulsiones: form.epilepsiaConvulsiones,
        faringitisCronica: form.faringitisCronica,
        fiebreMalta: form.fiebreMalta,
        fiebreTifoidea: form.fiebreTifoidea,
        fiebreReumatica: form.fiebreReumatica,
        foruncolois: form.forunculosis,
        gastritisCronica: form.gastritisCronica,
        gonorrea: form.gonorrea,
        gota: form.gota,
        hemorroides: form.hemorroides,
        hepatitis: form.hepatitis,
        hernias: form.hernias,
        hipertencionArterial: form.hipertensionArterial,
        urinariasRepetidas: form.infUrinariasRepetidas,
        intoxicaciones: form.intoxicaciones,
        insuficienciaCardiaca: form.insuficienciaCardiaca,
        insuficienciaCoronariaCronica: form.insuficienciaCoronariaCronica,
        insuficienciaRenalCronica: form.insuficienciaRenalCronica,
        litiasisUrinaria: form.litiasisUrinaria,
        meningitis: form.meningitis,
        neuritis: form.neuritisRepeticion,
        otitisMedia: form.otitisMedia,
        presionAltaOBaja: form.presionAltaBaja,
        paludismoOMalaria: form.paludismoMalaria,
        parasitosisIntestinal: form.parasitosisIntestinal,
        paratiditis: form.parotiditis,
        pleuresia: form.pleuresia,
        plumbismo: form.plumbismo,
        poliomielitis: form.poliomielitis,
        portadorMarcapasos: form.portadorMarcapaso,
        protesisCardiacasValvulares: form.protesisCardiacasValvulares,
        resfriosFrecuentes: form.resfriosFrecuentes,
        reumatismo: form.reumatismoRepeticion,
        sarampion: form.sarampion,
        sifilis: form.sifilis,
        silicosis: form.silicosis,
        sinusitisCronica: form.sinusitisCronica,
        tosConvulsiva: form.tosConvulsiva,
        transtornosNerviosos: form.trastornosNerviosos,
        traumatismoEncefalocraneano: form.traumatismoEncefalocraneano,
        tuberculosis: form.tuberculosis,
        tumoresQuistes: form.tumoresQuistes,
        ulceraPeptica: form.ulceraPeptica,
        varicela: form.varicela,
        varices: form.varices,
        varicocele: form.varicocele,
        perdidaMemoria: form.perdidaMemoria,
        preocupacionesAngustia: form.preocupacionesAngustia,
        doloresArticulares: form.doloresArticulares,
        aumentoDisminucionPeso: form.aumentoDisminucionPeso,
        dolorCabeza: form.dolorCabeza,
        diarrea: form.diarrea,
        agitacionEjercicio: form.agitacionEjercicios,
        dolorOcular: form.dolorOcular,
        dolorOpresivoTorax: form.dolorOpresivoTorax,
        hinchazonPiesOManos: form.hinchazonPiesManos,
        estrenimiento: form.estrenimiento,
        vomitosConSangre: form.vomitosSangre,
        sangradoPorOrina: form.sangradoOrina,
        tosConSangre: form.tosSangre,
        coloracionAmarillaPiel: false,//enviar false
        indigestionFrecuente: form.indigestionFrecuente,
        coloracionAmarrillaPiel: form.coloracionAmarilla,
        insomnio: form.insomnio,
        lumbalgiaODolorCintura: form.lumbalgias,
        mareos: form.mareosDesmayos,
        hecesNegras: form.hecesNegras,
        orinaConDolor: form.orinaDolorArdor,
        orinaInvoluntaria: form.orinaInvoluntaria,
        dolorOido: form.dolorOido,
        secrecionesOido: form.secrecionesOido,
        palpitaciones: form.palpitaciones,
        adormecimientos: form.adormecimientos,
        pesadillasFrecuentes: form.pesadillasFrecuentes,
        doloresMusculares: form.doloresMusculares,
        tosCronica: form.tosCronica,
        sangradoEncias: form.sangradoEncias,
        drogasNo: !form.drogas,
        drogasSi: form.drogas,
        licorNo: !form.licor,
        licorSi: form.licor,
        fumarNo: !form.fumar,
        fumarSi: form.fumar,
        drogasFrecuencia: form.frecuenciaDrogas,
        drogasTipo: form.tipoDrogas,
        licorFrecuencia: form.frecuenciaLicor,
        licorTipoFrecuente: form.tipoLicor,
        numeroCigarrillos: form.numeroCigarrillos,
        precisarCausasVarones: form.causasAbortos,
        hijosVivosVarones: form.hijosVivos,
        hijosFallecidosVarones: form.hijosFallecidos,
        abortosParejasVarones: form.abortosParejas,
        inicioMestruacionDamas: form.inicioMenstruacion,
        inicioVidaSexualDamas: form.inicioVidaSexual,
        numeroParejasSexActualidadDamas: form.parejasSexuales,
        hijosVivosDamas: form.hijosVivosDamas,
        hijosFallecidosDamas: form.hijosFallecidosDamas,
        numerosDeAbortosDamas: form.abortosDamas,
        precisarCausasDamas: form.causasAbortosDamas,
        otrosDescripcionAntecedentesPatologicos: form.otrasPatologias,
        otrosDescripcionIndicarEnfermedades: form.otrasEnfermedades,
        covid: form.covid19,
        fechaCovid: form.fechaCovid,
        covidLevel: form.severidadCovid === "LEVE",
        covidModerado: form.severidadCovid === "MODERADA",
        covidSevero: form.severidadCovid === "SEVERA",
        dosisVacunas: form.dosisVacunas,
        otrosTipoIndicarEnfermedades: form.tipoOtros,
        otrosFrecuenciaIndicarEnfermedades: form.frecuenciaOtros,
        otrosSiIndicarEnfermedades: form.otros,
        otrosNoIndicarEnfermedades: !form.otros,
        imaBoro: form.ima,
        acvBoro: form.acv,
        tbcBoro: form.tbc,
        vihBoro: form.vih,
        fobiasBoro: form.fobias,
        vertigosBoro: form.vertigos,
        tifoideaBoro: form.tifoidea,
        neoplasiasBoro: form.neoplasias,
        quemadurasBoro: form.quemaduras,
        discopatiasBoro: form.discopatias,
        columnaBoro: form.columna,
        enfermedadesPsiquiatricasBoro: form.enfPsiquiatricas,
        enfermedadesReumaticasBoro: form.enfReumatica,
        enfermedadesPulmonaresBoro: form.enfPulmonares,
        enfermedadesPielBoro: form.enfPiel,
        tendinitisBoro: form.tendinitis,
        onicomicosisBoro: form.onicomicosis,
        fracturasBoro: form.fracturas,
        anemiaBoro: form.anemia,
        obesidadBoro: form.obesidad,
        dislipidemiaBoro: form.dislipidemia,
        intoxicacionesBoro: form.intoxicaciones,
        amputacionBoro: form.amputacion,
        sorderaBoro: form.sordera,
        especifiqueDetallesOTratamientoBoro: form.detallesTratamiento,
        alergiasMedicamentosAlimentosBoro: form.alergiasMedicamentos,
        alergiasMedicamentosAlimentosEspecifiqueBoro: form.especifiqueAlergias,
        accidenteTrabajoBoro: form.accidenteTrabajo,
        accidenteTrabajoFechaBoro: form.fechaAccidente,
        descansoMedicoBoro: form.tiempoPerdido,
        descansoMedicoEspecifiqueBoro: form.especifiqueTiempoPerdido,
        enfermedadesProfesionalesBoro: form.enfermedadProfesional,
        enfermedadesProfesionalesFechaBoro: form.fechaCalificacion,
        enfermedadesLaboralesCalificacionBoro: form.evaluadoCalificacion,
        enfermedadesLaboralesCalificacionEspecifiqueBoro: form.especifiqueCalificacion,
        antitetanicaBoro: form.antitetanica,
        fiebreAmarillaBoro: form.fiebreAmarilla,
        influenzaBoro: form.influenza,
        hepatitisABoro: form.hepatitisA,
        hepatitisBBoro: form.hepatitisB,
        gripeInfluenzaBoro: form.gripeInfluenza,
        neumococoBoro: form.neumococo,
        rabiaBoro: form.rabia,
        papilomaHumanoBoro: form.papilomaHumano,
        covidAntecedentePatologico: form.covidAntecedentePatologico,
        cantidosisBoro: false, //enviar false
        medicamentoBoro: form.medicamentos,
        medicamentoEspecifiqueBoro: form.especifiqueMedicamentos,
        actividadFisicaBoro: form.actividadFisica,
        actividadFisicaEspecifiqueBoro: form.especifiqueActividadFisica,
        padreEspecifiqueBoro: form.padre,
        madreEspecifiqueBoro: form.madre,
        hermanosEspecifiqueBoro: form.hermanos,
        hijosEspecifiqueBoro: form.hijos,
        esposConyEspecifiqueBoro: form.esposaConyuge,
        conadisEspecifiqueBoro: form.carnetConadis,
        etsBoro: form.ets,
        migranaBoro: form.migrana,
        tiempoIncapacidadBoro: form.tipoIncapacidad,

        ruido: form.ruido,
        polvo: form.polvo,
        vidSegmentario: form.vidSegmentario,
        vidTotal: form.vidTotal,
        alturaEstructura: form.alturaEstruct,
        vibraciones: form.vibraciones,
        cancerigenos: form.cancerigenos,
        mutagenicos: form.mutagenicos,
        solventes: form.solventes,
        metales: form.metales,
        alturaGeografica: form.alturaGeograf,
        temperatura: form.temperaturaAgente,
        biologicos: form.biologicos,
        posturas: form.posturas,
        turnos: form.turnos,
        quimicos: form.quimicos,
        cargas: form.cargas,
        movRepet: form.movRepet,
        pvd: form.pvd,
        electricos: form.electricos,
        otros: form.otrosAgentes,

        antecedentesPatologicosQuirurgicos: form.antecedentes.map(reg => ({
            ...reg,
            quirurjicosId: form.codigoAntecedentesPatologicos_cod_ap ? reg.quirurjicosId : null,
        })),//form.antecedentes || null,
        eliminarPatologicosQuirurjicos:
            form.codigoAntecedentesPatologicos_cod_ap ? form.antecedentesEliminados : null,
        userRegistro: user,
    };
    console.log(body)

    await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
        PrintHojaR(form.norden, token, tabla, datosFooter);
    });
};


export const PrintHojaR = (nro, token, tabla, datosFooter) => {
    const jasperModules = import.meta.glob("../../../../jaspers/AntecedentesPatologicos/*.jsx");
    PrintHojaRDefault(
        nro,
        token,
        tabla,
        datosFooter,
        obtenerReporteUrl,
        jasperModules,
        "../../../../jaspers/AntecedentesPatologicos"
    );
};

// export const VerifyTR = async (nro, tabla, token, set, sede) => {
//     VerifyTRDefault(
//         nro,
//         tabla,
//         token,
//         set,
//         sede,
//         () => {
//             //NO Tiene registro
//             GetInfoServicio(nro, tabla, set, token, () => { Swal.close(); });
//         },
//         () => {
//             //Tiene registro
//             GetInfoServicioEditar(nro, tabla, set, token, () => {
//                 Swal.fire(
//                     "Alerta",
//                     "Este paciente ya cuenta con registros de Antecedentes Patológicos.",
//                     "warning"
//                 );
//             });
//         }
//     );
// };

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
                    "Este paciente ya cuenta con registros de Antecedentes Patológicos.",
                    "warning"
                );
            });
        },
        () => {
            //Necesita Agudeza visual 
            Swal.fire(
                "Alerta",
                "El paciente necesita pasar por Agudeza visual para poder registrarse.",
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
        console.log(res);
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
