import Swal from "sweetalert2";
import {
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { getFetch } from "../../../../utils/apiHelpers";

const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarAnexo7c";
const obtenerSimpleUrl = "/api/v01/ct/anexos/anexo16/obtenerAnexo16";
const obtenerParaEditarUrl = "/api/v01/ct/anexos/anexo16/reporteEditarAnexo16";
const obtenerParaJasperUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16";

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
    codigoAnexo: form.codigoAnexo,
    fecha: form.fechaExam,
    ruido: form.ruido,
    polvo: form.polvo,
    vidSegmentario: form.vidSegmentario,
    vidTotal: form.vidTotal,
    cancerigenos: form.cancerigenos,
    mutagenicos: form.mutagenicos,
    solventes: form.solventes,
    metales: form.metales,
    temperatura: form.temperaturaAgente,
    biologicos: form.biologicos,
    posturas: form.posturas,
    turnos: form.turnos,
    cargas: form.cargas,
    movRepet: form.movRepet,
    pvd: form.pvd,
    otros: form.otros,
    reubicacionSi: form.reubicacion,
    reubicacionNo: !form.reubicacion,
    tabacoNada: form.tabaco === "NADA",
    tabacoPoco: form.tabaco === "POCO",
    tabacoHabitual: form.tabaco === "HABITUAL",
    tabacoExcesivo: form.tabaco === "EXCESIVO",
    alcoholNada: form.alcohol === "NADA",
    alcoholPoco: form.alcohol === "POCO",
    alcoholHabitual: form.alcohol === "HABITUAL",
    alcoholExcesivo: form.alcohol === "EXCESIVO",
    drogasNada: form.drogas === "NADA",
    drogasPoco: form.drogas === "POCO",
    drogasHabitual: form.drogas === "HABITUAL",
    drogasExcesivo: form.drogas === "EXCESIVO",
    puestoActual: form.puestoActual,
    tiempo: form.tiempoPuesto,
    antecedentesPersonales: form.antecedentesPersonalesOcupacionales,
    antecedentesFamiliares: form.antecedentesFamiliares,
    hijosVivos: form.hijosVivos,
    hijosMuertos: form.hijosMuertos,
    cabeza: form.cabeza,
    nariz: form.nariz,
    cuello: form.cuello,
    perimetro: form.perimetro,
    bocaAmigdalasFaringeLaringe: form.bocaAmigdalasFaringeLaringe,
    visionColores: form.visionColores,
    enfermedadesOculares: form.enfermedadOculares,
    reflejosPupilares: form.reflejosPupilares,
    binocular: form.visionBinocular,
    od: form.otoscopiaOd,
    oi: form.otoscopiaOi,
    torax: form.torax,
    corazon: form.corazon,
    pulmonesNormal: form.pulmones === "NORMAL",
    pulmonesAnormal: form.pulmones === "ANORMAL",
    pulmonesDescripcion: form.pulmonesObservaciones,
    miembrosSuperiores: form.miembrosSuperiores,
    miembrosInferiores: form.miembrosInferiores,
    reflejosOsteotendinosos: form.reflejosOsteotendinosos,
    marcha: form.marcha,
    columnaVertebral: form.columnaVertebral, //revisar
    abdomen: form.abdomen, //revisar
    anillosInguinales: form.anillosInguinales, //revisar
    organosGenitales: form.organosGenitales, //revisar
    tactoRectalNoHizo: form.tactoRectalNoHizo, //revisar
    tactoRectalNormal: form.tactoRectalNormal, //revisar
    tactoRectalAnormal: form.tactoRectalAnormal, //revisar
    describirObservacion: form.describirObservacion, //revisar
    hernias: form.hernias, //revisar
    varices: form.varices, //revisar
    ganglios: form.ganglios, //revisar
    lenguage: form.lenguage, //revisar
    observacionesFichaMedica: form.observacionesGenerales,
    conclusion: form.conclusionRespiratoria,
    tetano: form.tetano,
    hepatitisB: form.hepatitisB,
    fiebreAmarilla: form.fiebreAmarilla,
    edad: form.edad,
    diagnosticoAudio: form.diagnosticoAudio,
    enfermedadesOcularesOtros: form.enfermedadOtros,
    conclusionMedico: form.conclusionMedico,
    antecedentesPersonales2: form.otroAntecedentePersonal,
    estadoMental: form.estadoMental, //revisar
    anamnesis: form.anamnesis, //revisar
    alturaEstructura: form.alturaEstruct,
    alturaGeografica: form.alturaGeograf,
    quimicos: form.quimicos,
    electricos: form.electricos,
    vibraciones: form.vibraciones,
    userRegistro: user,
  };
  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob("../../../../jaspers/Anexo16/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerParaJasperUrl,
    jasperModules,
    "../../../../jaspers/Anexo16"
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
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
      });
    },
    () => {
      //Tiene registro
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Anexo 16.",
          "warning"
        );
      });
    }
  );
};

export const Loading = (mensaje) => {
  // Función para mostrar loading con mensaje personalizado
  LoadingDefault(mensaje);
};

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(
    `${obtenerSimpleUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            observacionesGenerales: "",
            diagnosticoAudio: "",
            contador: 1
          };

          // Información radiográfica
          if (res.infoGeneralRadiografia_info_general != null) {
            data.observacionesGenerales += "-INFORME RADIOGRAFICO : " + res.infoGeneralRadiografia_info_general + "\n";
          }
          if (res.conclusionRadiografia_conclu != null) {
            data.observacionesGenerales += "-CONCLUCIONES : " + res.conclusionRadiografia_conclu + "\n";
          }

          // Radiografía de tórax
          if (res.verticesRadiografiaTorax_txtvertices != null && res.verticesRadiografiaTorax_txtvertices !== "NO SE TOMÓ RX DE TORAX") {
            if (res.verticesRadiografiaTorax_txtvertices != null && res.verticesRadiografiaTorax_txtvertices !== "LIBRES") {
              data.observacionesGenerales += data.contador + "-" + res.verticesRadiografiaTorax_txtvertices + "\n";
              data.contador++;
            }
            if (res.hiliosRadiografiaTorax_txthilios != null && res.hiliosRadiografiaTorax_txthilios !== "NORMALES") {
              data.observacionesGenerales += data.contador + "-" + res.hiliosRadiografiaTorax_txthilios + "\n";
              data.contador++;
            }
            if (res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos != null && res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos !== "LIBRES") {
              data.observacionesGenerales += data.contador + "-" + res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos + "\n";
              data.contador++;
            }
            if (res.camposPulmonesRadiografiaTorax_txtcampospulm != null && res.camposPulmonesRadiografiaTorax_txtcampospulm !== "NORMALES") {
              data.observacionesGenerales += data.contador + "-" + res.camposPulmonesRadiografiaTorax_txtcampospulm + "\n";
              data.contador++;
            }
            if (res.mediastinosRadiografiaTorax_txtmediastinos != null && res.mediastinosRadiografiaTorax_txtmediastinos !== "NORMALES") {
              data.observacionesGenerales += data.contador + "-" + res.mediastinosRadiografiaTorax_txtmediastinos + "\n";
              data.contador++;
            }
            if (res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular != null && res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular !== "NORMAL") {
              data.observacionesGenerales += data.contador + "-" + res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular + "\n";
              data.contador++;
            }
            if (res.osteomuscularRadiografiaTorax_txtosteomuscular != null && res.osteomuscularRadiografiaTorax_txtosteomuscular !== "NORMAL") {
              data.observacionesGenerales += data.contador + "-" + res.osteomuscularRadiografiaTorax_txtosteomuscular + "\n";
              data.contador++;
            }
            if (res.conclusionesRadiograficasTorax_txtconclusionesradiograficas != null && res.conclusionesRadiograficasTorax_txtconclusionesradiograficas !== "NORMAL") {
              data.observacionesGenerales += data.contador + "-" + res.conclusionesRadiograficasTorax_txtconclusionesradiograficas + "\n";
              data.contador++;
            }
          }

          if (res.observacionesRadiografiaTorax_txtobservacionesrt != null && res.observacionesRadiografiaTorax_txtobservacionesrt !== "NORMAL") {
            data.observacionesGenerales += data.contador + "-" + res.observacionesRadiografiaTorax_txtobservacionesrt + "\n";
            data.contador++;
          }
          if (res.observacionesLaboratorioClinico_txtobservacioneslb != null) {
            data.observacionesGenerales += data.contador + "-" + res.observacionesLaboratorioClinico_txtobservacioneslb + "\n";
            data.contador++;
          }
          if (res.observacionesAlturaCertificado_alturabarrick != null) {
            data.observacionesGenerales += data.contador + "-" + res.observacionesAlturaCertificado_alturabarrick + "\n";
            data.contador++;
          } else if (res.observacionesAlturaCertificacion_certialtura != null) {
            data.observacionesGenerales += data.contador + "-" + res.observacionesAlturaCertificacion_certialtura + "\n";
            data.contador++;
          }
          if (res.ordenAlturaCertificado_ordenaltura == null && res.numeroAlturaCertificacion_numalt == null) {
            if (res.observacionesConduccionCertificado_conduccion != null) {
              data.observacionesGenerales += data.contador + "-" + res.observacionesConduccionCertificado_conduccion + "\n";
              data.contador++;
            }
          }

          // Laboratorio - Drogas
          const coca = res.cocainaLaboratorioClinico_txtcocaina;
          const marig = res.marihuanaLaboratorioClinico_txtmarihuana;
          if (coca === "REACTIVO" || coca === "ACTIVO") {
            data.observacionesGenerales += data.contador + "- TEST DE COCAINA: " + coca + " COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n";
            data.cocainaRed = true;
            data.contador++;
          }
          data.cocaina = coca;

          if (marig === "REACTIVO" || marig === "ACTIVO") {
            data.observacionesGenerales += data.contador + "-MARIHUANA: " + marig + " COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n";
            data.marihuanaRed = true;
            data.contador++;
          }
          data.marihuana = marig;

          // Laboratorio - Valores básicos
          const vsg = res.vsgLaboratorioClinico_txtvsg;
          const gluc = res.glucosaLaboratorioClinico_txtglucosabio;
          const creat = res.creatininaLaboratorioClinico_txtcreatininabio;

          data.vsg = vsg;
          data.glucosa = gluc;
          data.creatinina = creat;

          // Validaciones de glucosa
          if (gluc && gluc !== "" && gluc !== "N/A") {
            const glucosa = parseFloat(gluc);
            if (glucosa >= 110 || glucosa < 70) {
              data.glucosaRed = true;
            } else {
              data.glucosaRed = false;
            }
          }

          // Validaciones de creatinina
          if (creat && creat !== "" && creat !== "N/A") {
            const cretinina = parseFloat(creat);
            if (cretinina >= 1.4 || cretinina < 0.8) {
              data.creatininaRed = true;
            } else {
              data.creatininaRed = false;
            }
          }

          // Información personal
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = formatearFechaCorta(res.fechaNacimientoPaciente_fecha_nacimiento_pa);
          data.sexo = res.sexo_sexo_pa ?? "";
          data.lugarNac = res.lugarNacimientoPaciente_lugar_nac_pa ?? "";
          data.domicilio = res.direccionPaciente_direccion_pa ?? "";
          data.telefono = res.telefonoCasaPaciente_tel_casa_pa ?? "";
          data.estadoCivil = res.estadoCivilPaciente_estado_civil_pa ?? "";
          data.gradoInstruccion = res.nivelEstudiosPaciente_nivel_est_pa ?? "";
          data.empresa = res.empresa_razon_empresa ?? "";
          data.contrata = res.contrata_razon_contrata ?? "";
          // Cálculo de edad basado en fecha de nacimiento
          if (res.fechaNacimientoPaciente_fecha_nacimiento_pa) {
            const fechaNac = new Date(res.fechaNacimientoPaciente_fecha_nacimiento_pa);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mesActual = hoy.getMonth();
            const mesNacimiento = fechaNac.getMonth();

            if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
              edad--;
            }
            data.edad = edad.toString();
          } else {
            data.edad = "";
          }
          data.explotacion = res.explotacion_nom_ex ?? "";
          data.alturaLaboral = res.altura_altura_po ?? "";
          data.mineralExp = res.mineral_mineral_po ?? "";
          data.puestoPostula = res.cargo_cargo_de ?? "";
          if (data.nomExamen === "ANUAL") {
            data.puestoActual = res.cargo_cargo_de ?? "";
            data.aptoParaTrabajar = "SI"
          }
          data.areaPuesto = res.area_area_o ?? "";
          data.grupoSanguineoPrevio = res.grupoFactorSanguineo_grupofactorsan ?? "";

          // Función respiratoria
          data.fvc = res.fvcFuncionRespiratoria_fvc ?? "";
          data.fev1 = res.fev1FuncionRespiratoria_fev1 ?? "";
          data.fev1Fvc = res.fev1FvcFuncionRespiratoria_fev1fvc ?? "";
          data.fef2575 = res.fef2575FuncionRespiratoria_fef25_75 ?? "";
          const interpretacionEspirometria = res.interpretacionFuncionRespiratoria_interpretacion ?? "";

          // Odontograma
          data.piezasMalEstado = res.piezasMalEstadoOdontograma_txtpiezasmalestado ?? "";
          if (data.piezasMalEstado && data.piezasMalEstado !== "") {
            const malEstado = parseFloat(data.piezasMalEstado);
            if (malEstado >= 1) {
              data.observacionesGenerales += data.contador + "-" + "CARIES DENTAL.TTO.EVALUACION EN 6 MESES.\n";
              data.contador++;
            }
          }
          data.piezasFaltan = res.ausentesOdontograma_txtausentes ?? "";

          // Hijos según sexo
          if (data.sexo === "M") {
            data.hijosVivos = res.hijosVivosAntecedentes_txtvhijosvivos ?? "0";
            data.hijosMuertos = res.hijosFallecidosAntecedentes_txtvhijosfallecidos ?? "0";
          } else {
            data.hijosVivos = res.getdHijosVivosAntecedentes_txtdhijosvivos ?? "0";
            data.hijosMuertos = res.getdHijosFallecidosAntecedentes_txtdhijosfallecidos ?? "0";
          }

          // IMC
          data.imc = res.imcTriaje_imc ?? "";
          if (res.ordenAlturaCertificado_ordenaltura == null && res.ordenConduccionCertificado_ordencond == null && res.numeroAlturaCertificacion_numalt == null) {
            if (data.imc && data.imc !== "") {
              const imc = parseFloat(data.imc);
              data.imcRed = false;
              if (imc >= 25 && imc < 30) {
                data.imcRed = true;
                data.observacionesGenerales += data.contador + "-" + "SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS.\n";
                data.contador++;
              } else if (imc >= 30 && imc < 35) {
                data.imcRed = true;
                data.observacionesGenerales += data.contador + "-" + "OBESIDAD I.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS\n";
                data.contador++;
              } else if (imc >= 35 && imc < 40) {
                data.imcRed = true;
                data.observacionesGenerales += data.contador + "-" + "OBESIDAD II.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
                data.contador++;
              } else if (imc >= 40 && imc < 45) {
                data.imcRed = true;
                data.observacionesGenerales += data.contador + "-" + "OBESIDAD III.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
                data.contador++;
              } else if (imc >= 45 && imc < 50) {
                data.imcRed = true;
                data.observacionesGenerales += data.contador + "-" + "OBESIDAD IV.NO HACER TRABAJOS SOBRE 1.8 M.S.N. PISO.DIETA HIPOCALORICA Y EJERCICIOS.EVALUACION POR ENDOCRINOLOGIA Y CARDIOLOGO\n";
                data.contador++;
              }
            }
          }

          // Antecedentes
          data.tabaco = res.antecedentes_rbfumarsi ? "POCO" : "NADA"; //revisar
          data.alcohol = res.antecedentes_rblicorsi ? "POCO" : "NADA"; //revisar

          // Medidas y signos vitales
          data.talla = res.tallaTriaje_talla ?? "";
          data.peso = res.pesoTriaje_peso ?? "";
          data.perimetro = res.perimetroCuelloTriaje_perimetro_cuello ?? "";
          data.temperatura = res.temperaturaTriaje_temperatura ?? "";
          data.cintura = res.cinturaTriaje_cintura ?? "";
          data.cadera = res.caderaTriaje_cadera ?? "";
          data.icc = res.iccTriaje_icc ?? "";
          data.frecuenciaRespiratoria = res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "";
          data.frecuenciaCardiaca = res.frecuenciaCardiacaTriaje_f_cardiaca ?? "";
          data.saturacionO2 = res.saturacionOxigenoTriaje_sat_02 ?? "";
          const sistolica = res.sistolicaTriaje_sistolica ?? "";
          const diastolica = res.diastolicaTriaje_diastolica ?? "";
          data.presionSistolica = sistolica;
          data.presionDiastolica = diastolica;
          data.grupoSanguineoGrupo = res.grupoFactorSanguineoLaboratorioClinico_Grupofactor ?? "";

          // Oftalmología
          data.enfermedadOtros = res.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "NINGUNA";
          data.enfermedadOculares = res.enfermedadesOcularesOftalmo_e_oculares ?? "NINGUNA";
          data.visionColores = ""; //revisar porque en el desktop no se mapea

          if (data.enfermedadOculares !== "NINGUNA" && data.enfermedadOculares !== "") {
            data.observacionesGenerales += data.contador + "-" + data.enfermedadOculares + "\n";
            data.contador++;
          }

          if (data.enfermedadOtros === "PTERIGION BILATERAL") {
            data.observacionesGenerales += data.contador + "-" + " PTERIGION BILATERAL:EVALUACION POR OFTALMOLOGIA.\n";
            data.contador++;
          } else if (data.enfermedadOtros !== "NINGUNA" && data.enfermedadOtros !== "") {
            data.observacionesGenerales += data.contador + "-" + data.enfermedadOtros + ":EVALUACION POR OFTALMOLOGIA.\n";
            data.contador++;
          }

          // Audiometría
          data.od500 = res.oidoDerecho500Audiometria_o_d_500 ?? "";
          data.od1000 = res.oidoDerecho1000Audiometria_o_d_1000 ?? "";
          data.od2000 = res.oidoDerecho2000Audiometria_o_d_2000 ?? "";
          data.od3000 = res.oidoDerecho3000Audiometria_o_d_3000 ?? "";
          data.od4000 = res.oidoDerecho4000Audiometria_o_d_4000 ?? "";
          data.od6000 = res.oidoDerecho6000Audiometria_o_d_6000 ?? "";
          data.od8000 = res.oidoDerecho8000Audiometria_o_d_8000 ?? "";
          data.oi500 = res.oidoIzquierdo500Audiometria_o_i_500 ?? "";
          data.oi1000 = res.oidoIzquierdo1000Audiometria_o_i_1000 ?? "";
          data.oi2000 = res.oidoIzquierdo2000Audiometria_o_i_2000 ?? "";
          data.oi3000 = res.oidoIzquierdo3000Audiometria_o_i_3000 ?? "";
          data.oi4000 = res.oidoIzquierdo4000Audiometria_o_i_4000 ?? "";
          data.oi6000 = res.oidoIzquierdo6000Audiometria_o_i_6000 ?? "";
          data.oi8000 = res.oidoIzquierdo8000Audiometria_o_i_8000 ?? "";

          // Diagnóstico audiométrico
          const diagnosticoAudiometrico = res.diagnosticoAudiometricoCompleto_diagnostico ?? "";
          if (data.od500 !== "" && data.od500 !== "N/A" && diagnosticoAudiometrico !== "NORMAL" && diagnosticoAudiometrico !== "") {
            data.diagnosticoAudio = "AUDIOMETRIA " + diagnosticoAudiometrico + ".EVALUACION ANUAL ";
          } else if (data.od500 === "N/A" || data.od500 === "") {
            data.diagnosticoAudio = "NO PASO EXAMEN AUDIOMETRIA.\n";
          }

          // Evaluación audiométrica detallada
          if (res.normalAudiometria_chkdnormal) {
            data.diagnosticoAudio = "NORMAL";
          } else {
            let audioObservaciones = "";
            if (res.traumaLeveOdAudiometria_chkdtaleveod && res.traumaLeveOiAudiometria_chkdtaleveoi) {
              audioObservaciones += "Trauma Acústico Bilateral Leve ";
            }
            if (res.traumaLeveOdAudiometria_chkdtaleveod) {
              audioObservaciones += "\n Trauma Acústico Leve OD";
            }
            if (res.traumaLeveOiAudiometria_chkdtaleveoi) {
              audioObservaciones += "\n Trauma Acústico Leve OI";
            }
            if (res.traumaAvanzadoOdAudiometria_chkdtaavanzadood && res.traumaAvanzadoOiAudiometria_chkdtaavanzadooi) {
              audioObservaciones += "\n Trauma Acústico Bilateral Avanzado ";
            }
            if (res.traumaAvanzadoOdAudiometria_chkdtaavanzadood) {
              audioObservaciones += "\n Trauma Acústico Avanzado OD";
            }
            if (res.traumaAvanzadoOiAudiometria_chkdtaavanzadooi) {
              audioObservaciones += "\n Trauma Acústico Avanzado OI";
            }
            if (res.hipoacusiaLeveOdAudiometria_chkdhrleveod && res.hipoacusiaLeveOiAudiometria_chkdhrleveoi) {
              audioObservaciones += "\n Hipoacusia Bilateral Inducida por Ruido, Leve ";
            }
            if (res.hipoacusiaLeveOdAudiometria_chkdhrleveod) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Leve  OD";
            }
            if (res.hipoacusiaLeveOiAudiometria_chkdhrleveoi) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Leve  OI";
            }
            if (res.hipoacusiaModeradaOdAudiometria_chkdhrmoderadood && res.hipoacusiaModeradaOiAudiometria_chkdhrmoderadooi) {
              audioObservaciones += "\n Hipoacusia Bilateral Inducida por Ruido, Moderada";
            }
            if (res.hipoacusiaModeradaOdAudiometria_chkdhrmoderadood) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Moderada OD";
            }
            if (res.hipoacusiaModeradaOiAudiometria_chkdhrmoderadooi) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Moderada OI";
            }
            if (res.hipoacusiaAvanzadaOdAudiometria_chkdhravanzadaod && res.hipoacusiaAvanzadaOiAudiometria_chkdhravanzadaoi) {
              audioObservaciones += "\n Hipoacusia Bilateral Inducida por Ruido, Avanzada ";
            }
            if (res.hipoacusiaAvanzadaOdAudiometria_chkdhravanzadaod) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Avanzada  OD";
            }
            if (res.hipoacusiaAvanzadaOiAudiometria_chkdhravanzadaoi) {
              audioObservaciones += "\n Hipoacusia Inducida por Ruido, Avanzada  OI";
            }
            if (res.otrasHipoacusiasAudiometria_chkotrashipoacusias) {
              audioObservaciones += "\n  OTRAS HIPOACUSIAS: " + (res.otrasHipoacusiasAudiometria_txtotrashipoacusias ?? "");
            }
            data.diagnosticoAudio = audioObservaciones;
          }

          // Presbiacusia
          if (data.od8000 !== "" && data.od8000 !== "N/A") {
            //revisar - necesita edad calculada
            const edad = parseFloat(data.edad) || 0;
            const od8000 = parseFloat(data.od8000);
            const oi8000 = parseFloat(data.oi8000);
            if (edad > 40) {
              if (od8000 > 25 && oi8000 > 25) {
                console.log("SOSPECHA DE PRESBIACUSIA EN OD Y OI");
              } else if (od8000 > 25) {
                console.log("SOSPECHA DE PRESBIACUSIA EN OD");
              } else if (oi8000 > 25) {
                console.log("SOSPECHA DE PRESBIACUSIA EN OI");
              }
            }
          }

          // Validación grupo sanguíneo
          //revisar - validación de grupo sanguíneo
          if (data.grupoSanguineoGrupo !== data.grupoSanguineoPrevio) {
            console.error("Grupo Sanguíneo incongruente por favor revisar");
          }

          // Odontograma observaciones
          if (res.observacionesOdontograma_txtobservaciones != null && res.observacionesOdontograma_txtobservaciones !== "NINGUNA") {
            data.observacionesGenerales += data.contador + "-ODONTOGRAMA : " + res.observacionesOdontograma_txtobservaciones + "\n";
            data.dentaduraObservaciones = res.observacionesOdontograma_txtobservaciones;
            data.contador++;
          }

          // Espirometría
          if (data.fvc === "N/A") {
            data.observacionesGenerales += data.contador + "-" + "NO PASO EXAMEN DE ESPIROMETRIA.\n";
            data.contador++;
          } else {
            if (interpretacionEspirometria && interpretacionEspirometria.trim().length > 2) {
              data.conclusionRespiratoria = interpretacionEspirometria;
            } else {
              let conclusion = "";
              if (data.fev1Fvc !== "" && data.fvc !== "N/A") {
                const fev1fvc = parseFloat(data.fev1Fvc);
                if (fev1fvc >= 70.0) {
                  if (conclusion !== "-NORMAL") {
                    conclusion += "-NORMAL\n";
                  }
                } else {
                  conclusion += "-PATRON OBSTRUCTIVO\n";
                  data.observacionesGenerales += data.contador + "-" + "PATRON OBSTRUCTIVO LEVE. EVALUACION EN 6 MESES.\n";
                  data.contador++;
                }
              }
              if (data.fvc !== "" && data.fvc !== "N/A") {
                const fvc = parseFloat(data.fvc);
                if (fvc >= 80) {
                  conclusion += "-NORMAL";
                } else {
                  conclusion += "-PATRON RESTRICTIVO\n";
                  data.observacionesGenerales += data.contador + "-" + "PATRON RESTRICTIVO LEVE.EVALUACION EN 6 MESES.\n";
                  data.contador++;
                }
              }
              data.conclusionRespiratoria = conclusion;
            }
          }

          // Visión de colores
          //revisar - mapeo de visión de colores
          if (data.visionColores !== "NINGUNA" && data.visionColores !== "NORMAL") {
            data.observacionesGenerales += data.contador + "-" + data.visionColores + "\n";
            data.contador++;
          }

          // Presión arterial
          if (sistolica !== "" && diastolica !== "") {
            const sistolica1 = parseFloat(sistolica);
            const diastolica1 = parseFloat(diastolica);
            if (sistolica1 >= 140 || diastolica1 >= 90) {
              data.observacionesGenerales += data.contador + "-" + "HTA NO CONTROLADA.\n";
              data.contador++;
            }
          }

          // Agroindustrial
          // data.anamnesisAgroindustrial = res.anamnesisAgroindustrial_txtanamnesis ?? "";
          // data.estadoMentalAgroindustrial = res.estadoMentalAgroindustrial_txtestadomental ?? "";

          console.log("DATAAA", data);
          set((prev) => ({ ...prev, ...data }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const GetInfoServicioEditar = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(
    `${obtenerParaEditarUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            codigoAnexo: res.codigoAnexo_cod_anexo,
            observacionesGenerales: "",
            otrosExamenes: "",
            conclusionRespiratoria: "",
            fechaExam: res.fechaAnexo_fecha,

            // Datos específicos del Anexo 16
            nomExamen: res.nombreExamen_nom_examen ?? "",
            dni: res.dni_cod_pa ?? "",
            nombres: res.nombres_nombres_pa ?? "",
            apellidos: res.apellidos_apellidos_pa ?? "",
            fechaNac: formatearFechaCorta(
              res.fechaNacimientoPaciente_fecha_nacimiento_pa
            ),
            sexo: res.sexo_sexo_pa ?? "",
            lugarNac: res.lugarNacPaciente_lugar_nac_pa ?? "",
            domicilio: res.direccionPaciente_direccion_pa ?? "",
            telefono: res.telefonoCasaPaciente_tel_casa_pa ?? "",
            estadoCivil: res.estadoCivilPaciente_estado_civil_pa ?? "",
            gradoInstruccion: res.nivelEstudiosPaciente_nivel_est_pa ?? "",
            empresa: res.empresa_razon_empresa ?? "",
            contrata: res.contrata_razon_contrata ?? "",
            edad: (res.edad_fecha_nacimiento_pa ?? "") + " años",
            explotacion: res.explotacion_nom_ex ?? "",
            alturaLaboral: res.altura_altura_po ?? "",
            mineralExp: res.mineral_mineral_po ?? "",
            puestoPostula: res.cargo_cargo_de ?? "",
            areaPuesto: res.area_area_o ?? "",

            aptitud: res.esApto_apto_si
              ? "APTO"
              : res.noEsApto_apto_no
                ? "NO APTO"
                : res.aptoRestriccion_apto_re
                  ? "RESTRICCION"
                  : "",
            fechaAptitud: res.fechaDesde_fechadesde ?? "",
            fechaVencimiento: res.fechaHasta_fechahasta ?? "",
            nombre_medico: res.medico_medico ?? "",
            dataEnfermedades: res.accidentes ?? [],
          };

          console.log("DATA EDITAR", data);
          set((prev) => ({ ...prev, ...data }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};
