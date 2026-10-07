import Swal from "sweetalert2";
import {
    GetInfoPacDefault,
    GetInfoServicioDefault,
    VerifyTRPerzonalizadoDefault,
    LoadingDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../utils/auditoriaUtils";
import {
    guardarRegistro,
    actualizarRegistro,
    validarSede,
    imprimirReporteJasper,
} from "../../../../utils/registroOcupacionalUtils";

// ===== Configuración =====
const obtenerReporteUrl = "/api/v01/ct/fichaApneaSueno/obtenerReporteFichaSas";
const registrarUrl = "/api/v01/ct/fichaApneaSueno/registrarActualizarFichaSas";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../jaspers/FichasSAS/*.jsx");
const rutaReporte = "../../../../jaspers/FichasSAS/FichaDetencionSAS_boro_Digitalizado.jsx";

const sexoLegible = (sexo) => (sexo === "M" ? "MASCULINO" : sexo === "F" ? "FEMENINO" : "");

// El obtenerReporte de Ficha SAS no devuelve fecha de nacimiento / lugar de nacimiento /
// estado civil / nivel de estudios, así que se completan desde el endpoint de paciente.
// Si falla, el formulario sigue cargando (esos campos solo son informativos).
const GetDatosPersonalesExtra = async (nro, token, sede) => {
    try {
        const res = await GetInfoPacDefault(nro, token, sede);
        if (!res || res.error) return {};
        return {
            fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
            lugarNacimiento: res.lugarNacimiento ?? "",
            estadoCivil: res.estadoCivil ?? "",
            nivelEstudios: res.nivelEstudios ?? "",
        };
    } catch {
        return {};
    }
};

// ===== Mapeo Registro nuevo =====
export const GetInfoServicio = async (nro, tabla, set, token, sede, onFinish = () => { }) => {
    const extra = await GetDatosPersonalesExtra(nro, token, sede);
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;

    let concatenacionObservacion = "";

    // Validación presión
    const presion_sistolica = parseFloat(res.sistolicaTriaje);
    const presion_diastolica = parseFloat(res.diastolicaTriaje);
    let htaNueva = false;
    if (!isNaN(presion_sistolica) && !isNaN(presion_diastolica) &&
        (presion_sistolica >= 140 || presion_diastolica >= 90)) {
        htaNueva = true;
    }

    // Validación cuello
    let cuello_varon_normal = true;
    let cuello_mujer_normal = true;
    let criterio_d_cuello = false;
    const sexo = res.sexoPaciente ?? "";
    const textoCuello = "EVALUACIÓN POR NEUROLOGÍA";
    if (res.perimetroCuelloTriaje) {
        const cuello = parseFloat(res.perimetroCuelloTriaje);
        if (!isNaN(cuello)) {
            if (sexo == "M" && cuello > 43.2) {
                cuello_varon_normal = false;
                criterio_d_cuello = true;
                concatenacionObservacion += textoCuello + "\n";
            } else if (sexo == "F" && cuello >= 40.6) {
                cuello_mujer_normal = false;
                criterio_d_cuello = true;
                concatenacionObservacion += textoCuello + "\n";
            }
        }
    }

    // Validación IMC
    let imc = res.imcTriaje ?? "";
    let criterio_d_imc = false;
    if (imc) {
        imc = parseFloat(imc);
        if (!isNaN(imc) && imc >= 30) {
            criterio_d_imc = true;
        }
    }

    set((prev) => ({
        ...prev,
        norden: res.norden ?? "",
        tipoExamen: res.nombreExamen ?? "",
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: sexoLegible(res.sexoPaciente),
        fechaNacimiento: extra.fechaNacimiento ?? formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: extra.lugarNacimiento ?? "",
        estadoCivil: extra.estadoCivil ?? "",
        nivelEstudios: extra.nivelEstudios ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",

        // Examen Físico
        peso_kg: res.pesoTriaje ?? "",
        talla_mts: res.tallaTriaje ?? "",
        imc_kg_m2: res.imcTriaje ?? "",
        circunferencia_cuello: res.perimetroCuelloTriaje ?? "",
        presion_sistolica: res.sistolicaTriaje ?? "",
        presion_diastolica: res.diastolicaTriaje ?? "",

        hta_nueva: htaNueva,
        cuello_varon_normal: cuello_varon_normal,
        cuello_mujer_normal: cuello_mujer_normal,
        criterio_d_cuello: criterio_d_cuello,
        criterio_d_imc: criterio_d_imc,
        criterio_d: criterio_d_cuello && criterio_d_imc,
        observaciones: concatenacionObservacion,
        tieneRegistro: false,
    }));
};

// ===== Mapeo Edición =====
export const GetInfoServicioEditar = async (nro, tabla, set, token, sede, onFinish = () => { }) => {
    // Primero los datos extra: su helper cierra el Swal de carga y no debe pisar la alerta final.
    const extra = await GetDatosPersonalesExtra(nro, token, sede);
    const res = await GetInfoServicioDefault(nro, tabla, token, obtenerReporteUrl, onFinish);
    if (!res) return;
    set((prev) => ({
        ...prev,
        // Header
        norden: res.norden ?? "",
        codigoSas: res.codigoSas_cod_sas ?? null,
        fechaExam: res.fechaSas_fecha_sas ?? "",
        tipoExamen: res.nombreExamen ?? "",
        tipoLicencia: res.tipoLicencia_licencia_sas ?? "",
        // Datos personales
        nombres: `${res.nombresPaciente ?? ""} ${res.apellidosPaciente ?? ""}`.trim(),
        dni: res.dniPaciente ?? "",
        edad: res.edadPaciente ?? "",
        sexo: sexoLegible(res.sexoPaciente),
        fechaNacimiento: extra.fechaNacimiento ?? formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
        lugarNacimiento: extra.lugarNacimiento ?? "",
        estadoCivil: extra.estadoCivil ?? "",
        nivelEstudios: extra.nivelEstudios ?? "",
        // Datos laborales
        empresa: res.empresa ?? "",
        contrata: res.contrata ?? "",
        ocupacion: res.ocupacionPaciente ?? "",
        cargoDesempenar: res.cargoPaciente ?? "",
        // Trabaja de noche
        trabajoNoche: res.trabajaNocheSi_tbtrabajanochesi ?? false,
        diasTrabajoNoche: res.diasTrabajo_txtdiastrabajo ?? "",
        diasDescansoNoche: res.descanso_txtdescanso ?? "",
        anosTrabajoNoche: res.anosTrabajo_txtanostrabajo ?? "",
        // Antecedentes personales
        apneaDelSueno: res.apneaSi_rbapneasi ?? false,
        ultimoControl: res.ultimoControl_txtultimocontrol ?? "",
        hta: res.htaSi_rbhtasi ?? false,
        medicacionRiesgo: res.medicacionRiesgo_txtriesgo ?? "",
        polisomnografiaRealizada: res.polisomnografiaSi_rbpsgsi ?? false,
        fechaUltimaPolisomnografia: res.fechaUltimaPolisomnografia_fechapsg ?? "",
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
        indique_familiar_apnea: res.entrevistaApneaDescripcion_txtantecedentefamiliar ?? "",

        // Entrevista al paciente
        ronca_al_dormir: res.entrevistaPregunta1Si_chk1_esi ?? false,
        ruidos_respirar_durmiendo: res.entrevistaPregunta2Si_chk2_esi ?? false,
        deja_respirar_durmiendo: res.entrevistaPregunta3Si_chk3_esi ?? false,
        mas_sueno_cansancio: res.entrevistaPregunta4Si_chk4_esi ?? false,
        entrevistaPuntuacion: res.entrevistaPuntuacion_txtpuntuacion ?? "0",

        // Examen Físico
        peso_kg: res.pesoTriaje ?? "",
        talla_mts: res.tallaTriaje ?? "",
        imc_kg_m2: res.imcTriaje ?? "",
        circunferencia_cuello: res.perimetroCuelloTriaje ?? "",
        cuello_varon_normal: res.sexoPaciente == "M" ? res.examenFisicoVaronSi_chkvaronsi ?? false : false,
        cuello_mujer_normal: res.sexoPaciente == "F" ? res.examenFisicoMujerSi_chkmujersi ?? false : false,
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
        conclusionesCie10: res.conclusionesCie10 ?? "",

        user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,

        // Auditoría (FichaSasReporteDTO: userRegistro, fechaRegistro, fechaActualizacion,
        // usuarioActualizacion). Se guarda CRUDA (la vista la formatea: UTC -> local). La creación
        // se conserva para reenviarla al editar.
        fechaRegistro: res.fechaRegistro ?? "",
        userRegistro: res.userRegistro ?? res.usuarioRegistro ?? "",
        fechaActualizacion: res.fechaActualizacion ?? "",
        usuarioActualizacion: res.usuarioActualizacion ?? "",
        tieneRegistro: true,
    }));
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
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
    entrevistaPuntuacion: form.entrevistaPuntuacion,
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
    conclusionesCie10: form.conclusionesCie10,
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

    usuarioFirma: form.user_medicoFirma,
});



const construirBody = (form, user, esActualizacion) =>
    sellarAuditoria(construirBase(form), {
        user,
        esActualizacion,
        userRegistro: form.userRegistro || user,
        fechaRegistro: form.fechaRegistro,
        campoUserRegistro: "usuarioRegistrar",
    });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla, datosFooter, sede) =>
    imprimirReporteJasper({
        nro,
        token,
        tabla,
        datosFooter,
        sede,
        obtenerReporteUrl,
        jasperModules,
        rutaModulo: rutaReporte,
    });

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    guardarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, datosFooter) =>
    actualizarRegistro({
        form,
        token,
        user,
        tabla,
        limpiar,
        registrarUrl,
        buildBody: construirBody,
        onPrint: () => PrintHojaR(form.norden, token, tabla, datosFooter),
    });

// ===== Búsqueda / verificación por N° Orden =====
// Este examen exige que el paciente haya pasado Triaje antes de poder registrarse, por eso se
// usa VerifyTRPerzonalizadoDefault (3 estados: nuevo / existente / necesita Triaje) en vez del
// verificarRegistro binario, anteponiendo la validación de sede como el resto de formularios.
export const VerifyTR = async (nro, tabla, token, set, sede) => {
    if (!nro) {
        await Swal.fire({
            icon: "error",
            title: '<i class="fa-solid fa-keyboard"></i>Error',
            html: "Debe Introducir un N° Orden válido",
        });
        return;
    }

    LoadingDefault("Validando datos");

    if (sede) {
        const { estado, descripcionSede } = await validarSede(nro, sede, token);
        if (estado === "otraSede") {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
                html: `El N° Orden ${nro} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.`,
            });
            return;
        }
        if (estado !== "ok") {
            Swal.fire({
                icon: "error",
                title: '<i class="fa-solid fa-triangle-exclamation"></i>Error',
                html: `Verifique el número de orden ${nro} e intente nuevamente.`,
            });
            return;
        }
    }

    VerifyTRPerzonalizadoDefault(
        nro,
        tabla,
        token,
        set,
        sede,
        () => GetInfoServicio(nro, tabla, set, token, sede, () => { Swal.close(); }),
        () =>
            GetInfoServicioEditar(nro, tabla, set, token, sede, () => {
                Swal.fire({
                    icon: "warning",
                    title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
                    html: "Este paciente ya cuenta con registros de Ficha SAS",
                });
            }),
        () => {
            Swal.fire({
                icon: "warning",
                title: '<i class="fa-solid fa-eye"></i>Alerta',
                html: "El paciente necesita pasar por Triaje.",
            });
        }
    );
};
