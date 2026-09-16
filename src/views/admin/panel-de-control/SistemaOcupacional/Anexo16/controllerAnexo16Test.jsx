import Swal from "sweetalert2";
import { handleSubidaMasiva, handleSubirArchivoDefaultSinSellos, LoadingDefault, PrintHojaRJsReportDefault, ReadArchivosFormDefault, VerifyTRDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";
import { getToday } from "../../../../utils/helpers";
import {
  limpiarObservaciones,
  validarRadiografiaColumna,
  validarGlucosa,
  validarCreatinina,
  validarRiesgoCardiovascularFramingham,
  validarInterpretacionEspirometriaAnexo16,
  validarRayosXToraxAnexo16,
  validarMusculoesqueleticoAnexo16,
  validarElectrocardiogramaAnexo16,
  validarInformeRadiograficoAnexo16,
  validarHallazgosRadiograficosToraxAnexo16,
  validarObservacionesRadiografiaToraxAnexo16,
  agregarObservacionNumerada,
  validarLabClinicoAnexo16,
  validarCocainaAnexo16,
  validarMarihuanaAnexo16,
  validarCariesDentalAnexo16,
  validarImcAnexo16,
  validarOftalmologiaAnexo16,
  validarOdontogramaAnexo16,
  validarEspirometriaAnexo16,
  validarVisionColoresAnexo16,
  validarPresionArterialAnexo16,
  validarHemoglobinaConTextoAnexo16,
  validarHemoglobinaFlagAnexo16,
  validarPerfilLipidicoAnexo16,
  validarCreatininaSericaAnexo16,
  validarUreaSericaAnexo16,
  validarAcidoUricoSericoAnexo16,
  validarGonadotropinaAnexo16,
  construirObservacionesAudioAnexo16,
} from "../Anexo2/validacionesObservaciones";

export const registrarUrl = "/api/v01/ct/anexos/anexo16/registrarActualizarAnexo7c";
const obtenerSimpleUrl = "/api/v01/ct/anexos/anexo16/obtenerAnexo16";
const obtenerParaEditarUrl = "/api/v01/ct/anexos/anexo16/reporteEditarAnexo16";
const obtenerParaJasperUrl = "/api/v01/ct/anexos/anexo16/obtenerReporteAnexo16";

const obtenerReporteJsReportUrl = "/api/v01/ct/anexos/descargarReporteAnexo16"

const obtenerExamenesRealizadosUrl = "/api/v01/ct/anexos/anexo2/obtenerExamenesRealizados";

const registrarPDF = "/api/v01/ct/archivos/archivoInterconsulta"

export const construirBodyAnexo16 = (form, user, SinReestricciones) => {

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
    antecedentesPersonales: form.antecedentesPersonales,
    antecedentesPersonales2: form.antecedentesPersonales2,
    antecedentesFamiliares: form.antecedentesFamiliares,
    hijosVivos: form.hijosVivos,
    hijosMuertos: form.hijosMuertos,
    cabeza: form.cabeza,
    nariz: form.nariz,
    cuello: form.cuello,
    perimetro: form.perimetro,
    bocaAmigdalasFaringeLaringe: form.bocaAmigdalasFaringeLaringe,
    piel: form.piel == "NORMAL",
    pielDescripcion: form.pielObservaciones,
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
    columnaVertebral: form.columnaVertebral,
    abdomen: form.abdomen,
    anillosInguinales: form.anillosInguinales,
    organosGenitales: form.organosGenitales,
    tactoRectalNoHizo: form.tactoRectal == "NO_SE_HIZO",
    tactoRectalNormal: form.tactoRectal == "NORMAL",
    tactoRectalAnormal: form.tactoRectal == "ANORMAL",
    describirObservacion: false,
    hernias: form.hernias,
    varices: form.varices,
    ganglios: form.ganglios,
    lenguage: form.evaluacionCognitiva,
    estadoMental: form.estadoMental,
    anamnesis: form.anamnesis,
    observacionesFichaMedica: form.observacionesGenerales,
    conclusion: form.conclusionRespiratoria,
    tetano: form.tetano,
    hepatitisB: form.hepatitisB,
    fiebreAmarilla: form.fiebreAmarilla,
    edad: form.edad,
    diagnosticoAudio: form.observacionesAudio,
    enfermedadesOcularesOtros: form.enfermedadOtros,
    conclusionMedico: form.conclusionMedico,
    userRegistro: user,
    alturaEstructura: form.alturaEstruct,
    alturaGeografica: form.alturaGeograf,
    quimicos: form.quimicos,
    electricos: form.electricos,
    vibraciones: form.vibraciones,
    usuarioFirma: form.user_medicoFirma,
    cerrado: form.cerrado,
    examenRadiograficoSanguineo: {
      codigoExamenRadiograficoSanguineo: form.codigoExamenRadiograficoSanguineo,
      nrx: form.numeroRx,
      fechaExamenRadiograficoSanguineo: form.fechaRx,
      calidad: form.calidadRx,
      simbolos: form.simbolosRx,
      norden: form.norden,
      calificacionEx: form.clasificacion == "0/-",
      calificacionEx0: form.clasificacion == "0/0",
      calificacionEx01: form.clasificacion == "0/1",
      calificacionEx10: form.clasificacion == "1/0",
      calificacionEx11: form.clasificacion == "1/1",
      calificacionEx12: form.clasificacion == "1/2",
      calificacionEx21: form.clasificacion == "2/1",
      calificacionEx22: form.clasificacion == "2/2",
      calificacionEx23: form.clasificacion == "2/3",
      calificacionEx32: form.clasificacion == "3/2",
      calificacionEx33: form.clasificacion == "3/3",
      calificacionEx3Mas: form.clasificacion == "3/+",
      calificacionExAbc: form.clasificacionABC == "ABC",
      calificacionExSt: form.clasificacionST == "ST",
      sinNeumoconiosis: form.sinNeumoconiosis,
      conNeumoconiosis: form.conNeumoconiosis,
      irep: form.imagenRadiograficaPolvo,
      otros: form.otrosExamenes,
      observacionesRs: "",
      aptoSi: form.aptoParaTrabajar == "SI",
      aptoNo: form.aptoParaTrabajar == "NO",
      aptoRe: form.aptoParaTrabajar == "REEVALUACION",
    },
    evaluado: form.aptoParaTrabajar == "EVALUADO",
    mercurioOrina: form.mercurioOrina,
    plomoSangre: form.plomoSangre,
    ...(form.codigoAnexo == null
      ? { registrado_sin_restriccion: SinReestricciones, }
      : { registrado_sin_restriccion: form.registrado_sin_restriccion }),
    conclusionesCie10: form.conclusionesCie10

  };
  return body;
};

export const SubmitDataService = async (
  form,
  setForm,
  token,
  user,
  limpiar,
  tabla,
  datosFooter,
  SinReestricciones
) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }
  if (form.cerrado && (form.aptoParaTrabajar == "" || form.aptoParaTrabajar == null || form.aptoParaTrabajar == undefined)) {
    await Swal.fire("Error", "Debe seleccionar aptitud", "error");
    return;
  }
  Loading("Registrando Datos");
  const body = construirBodyAnexo16(form, user, SinReestricciones);
  console.log(body);

  SubmitData(body, registrarUrl, token).then((res) => {
    console.log(res);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: "Exito",
        text: `Registro creado con éxito,\n¿Desea imprimir?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        const nordenNuevo = form.norden;
        limpiar();
        GetExamenesRealizados(nordenNuevo, setForm, token, () => {
          Swal.close();
        });
        if (result.isConfirmed) {
          PrintHojaR(form.norden, token, tabla, datosFooter);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerParaJasperUrl}?nOrden=${nro}&nameService=${tabla}`,
    token
  ).then(async (res) => {
    if (res.norden_n_orden) {
      const nombre = res.nameJasper;
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../jaspers/Anexo16/*.jsx"
      );
      const modulo = await jasperModules[
        `../../../../jaspers/Anexo16/${nombre}.jsx`
      ]();

      // Ejecuta la función exportada por default con los datos
      if (typeof modulo.default === "function") {
        modulo.default({ ...res, datosFooter });
      } else {
        console.error(
          `El archivo ${nombre}.jsx no exporta una función por defecto`
        );
      }
      Swal.close();
    } else {
      Swal.close();
    }
  });
};

// export const PrintHojaR = (nro, token, tabla) => {
//   PrintHojaRJsReportDefault(
//     nro,
//     token,
//     tabla,
//     obtenerReporteJsReportUrl
//   );
// };

export const VerifyTR = async (nro, tabla, token, set, sede, SinReestricciones) => {
  VerifyTRDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    () => {
      //NO Tiene registro
      GetInfoServicio(nro, tabla, set, token, () => {
        ValidarExamenesRealizados(nro, token, SinReestricciones, () => {
          set((prev) => ({
            ...prev,
            posibleCerrar: true,
          }))
          Swal.fire(
            "Alerta",
            "Este examen ya se puede cerrar.",
            "info"
          );
        },
          (listaFaltantes) => {
            set((prev) => ({
              ...prev,
              notasDoctor: prev.notasDoctor + "\n" + listaFaltantes,
            }))
            Swal.fire(
              "Alerta",
              listaFaltantes,
              "info"
            );
          });
      })

    },
    () => {
      //Tiene registro
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        ValidarExamenesRealizados(nro, token, SinReestricciones, () => { //en caso pase se ejectua esto 
          set((prev) => ({
            ...prev,
            posibleCerrar: true,
          }))
          Swal.fire(
            "Alerta",
            "Este paciente ya cuenta con registros de Anexo 16. Este examen ya se puede cerrar.",
            "info"
          );
        },
          (listaFaltantes) => {
            set((prev) => ({
              ...prev,
              notasDoctor: prev.notasDoctor + "\n" + listaFaltantes,
            }))
            Swal.fire(
              "Alerta",
              "Este paciente ya cuenta con registros de Anexo 16.\n" + listaFaltantes,
              "info"
            );
          }
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
  getFetch(`${obtenerSimpleUrl}?nOrden=${nro}&nameService=${tabla}`, token)
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            observacionesGenerales: "",
            observacionesAudio: "",
            contador: 1,

          };
          data.conclusiones_cie_10 = "";
          const valoresCie10 = {
            ekgConclusionesCie10: res.ekg_conclusiones_cie_10,
            ekgHallazgosCie10: res.ekg_hallazgos_cie_10,
            audiometriaDiagnosticoCie10: res.audiometriapo_diagnostico_cie_10,
            oftalmologiaVisionColoresCie10: res.oftalmologia_vision_colores_cie_10,
            oftalmologiaEnfOcularesCie10: res.oftalmologia_enf_oculares_cie_10,
            oftalmologiaPresenciaPterigionCie10: res.oftalmologia_presencia_pterigion_cie_10,
            espirometriaInterpretacionCie10: res.espirometria_interpretacion_cie_10,
            rayosxConclusionesCie10: res.rayosx_conclusiones_cie_10,
            musculoEsqueleticoDiagnosticoCie10: res.musculoesq_diagnostico_cie_10,
            rayoscolumnaConclusionCie10: res.rayoscolumna_conclusion_cie_10,
            odontologiaObservacionesCie10: res.odontologia_observaciones_cie_10,
            hematologiaObservacionesCie10: res.hematologia_observaciones_cie_10
          };
          try {
            data.conclusiones_cie_10 = Object.values(valoresCie10 ?? {})
              .filter(value => value != null && value !== '')
              .map(String)
              .sort((a, b) => a.localeCompare(b, 'es'))
              .join('\n');
          } catch {
            data.conclusiones_cie_10 = '';
          }
          data.antecedentesPersonales2 = "NINGUNO";

          // Antecedentes Familiares (solo al obtener/crear un nuevo registro, concatenados en un solo campo)
          const antecedentesFamiliaresPartes = [
            res.antecedentes_padre ? `Padre: ${res.antecedentes_padre}` : null,
            res.antecedentes_madre ? `Madre: ${res.antecedentes_madre}` : null,
            res.antecedentes_hermanos ? `Hermanos: ${res.antecedentes_hermanos}` : null,
            res.antecedentes_hijos ? `Hijos: ${res.antecedentes_hijos}` : null,
            res.antecedentes_esposa ? `Esposa(o): ${res.antecedentes_esposa}` : null,
            res.antecedentes_conadis ? `Conadis: ${res.antecedentes_conadis}` : null,
          ].filter(Boolean);
          if (antecedentesFamiliaresPartes.length > 0) {
            data.antecedentesFamiliares = antecedentesFamiliaresPartes.join(", ");
          }
          // Vaccinations
          data.tetano = res.tetanica ?? false;
          data.hepatitisB = res.hepatitisb ?? false;
          data.fiebreAmarilla =
            res.fiebreAmarilla ?? false;

          data.ruido = res.ruidoAnexo7c_chkruido ?? false;
          data.polvo = res.polvoAnexo7c_chkpolvo ?? false;
          data.vidSegmentario =
            res.vidSegmentarioAnexo7c_chkvidsegmentario ?? false;
          data.vidTotal = res.vidTotalAnexo7c_chkvidtotal ?? false;
          data.alturaEstruct =
            res.alturaEstructuraAnexo7c_altura_estructura ?? false;
          data.vibraciones = res.vibracionesAnexo7c_vibraciones ?? false;
          data.cancerigenos = res.cancerigenosAnexo7c_chkcancerigenos ?? false;
          data.mutagenicos = res.mutagenicosAnexo7c_chkmutagenicos ?? false;
          data.solventes = res.solventesAnexo7c_chksolventes ?? false;
          data.metales = res.metalesAnexo7c_chkmetales ?? false;
          data.alturaGeograf = res.alturaGeograficaAnexo7c_altura_geog ?? false;
          data.temperaturaAgente =
            res.temperaturaAnexo7c_chktemperatura ?? false;
          data.biologicos = res.biologicosAnexo7c_chkbiologicos ?? false;
          data.posturas = res.posturasAnexo7c_chkposturas ?? false;
          data.turnos = res.turnosAnexo7c_chkturnos ?? false;
          data.quimicos = res.quimicosAnexo7c_quimicos ?? false;
          data.cargas = res.cargasAnexo7c_chkcargas ?? false;
          data.movRepet = res.movRepetAnexo7c_chkmovrepet ?? false;
          data.pvd = res.pvdAnexo7c_chkpvd ?? false;
          data.electricos = res.electricosAnexo7c_electricos ?? false;
          data.otros = res.otrosAnexo7c_chkotros ?? false;

          ({ observaciones: data.observacionesGenerales } = validarInterpretacionEspirometriaAnexo16(
            res.interpretacionFuncionRespiratoria_interpretacion,
            valoresCie10.espirometriaInterpretacionCie10,
            data.observacionesGenerales
          ));

          const rayosXConclusion = res.conclusionesRadiograficasTorax_txtconclusionesradiograficas;
          const rayosXObservaciones = res.observacionesRadiografiaTorax_txtobservacionesrt;

          ({ observaciones: data.observacionesGenerales } = validarRayosXToraxAnexo16(
            rayosXConclusion,
            rayosXObservaciones,
            valoresCie10.rayosxConclusionesCie10,
            data.observacionesGenerales
          ));

          const rayosXColumnaConclusion = res.conclusionRayosColumna;

          ({ observaciones: data.observacionesGenerales } = validarRadiografiaColumna(
            rayosXColumnaConclusion,
            data.observacionesGenerales
          ));

          const musculoEsqueleticoAnexo = res.musculoEsqueleticoAnexo ?? {};
          const musculoDiagnostico = res.musculoesqueletico_diagnostico;
          const musculoConclusiones = res.musculoesqueletico_boroo_conclusiones;

          ({ observaciones: data.observacionesGenerales } = validarMusculoesqueleticoAnexo16(
            musculoDiagnostico,
            musculoConclusiones,
            valoresCie10.musculoEsqueleticoDiagnosticoCie10,
            data.observacionesGenerales,
            true
          ));

          const hallazgoEKG = res.hallazgosInformeElectroCardiograma_hallazgo;
          const conclusionesEkg = res.conclusionEkg;
          const recomendacionesEKG = res.recomendacionesInformeElectroCardiograma_recomendaciones ?? "";

          ({ observaciones: data.observacionesGenerales } = validarElectrocardiogramaAnexo16(
            hallazgoEKG,
            conclusionesEkg,
            recomendacionesEKG,
            valoresCie10.ekgHallazgosCie10,
            valoresCie10.ekgConclusionesCie10,
            data.observacionesGenerales,
            ""
          ));
          // if (res.observacionFichaConduccion != null) {
          //   data.observacionesGenerales += "FICHA CONDUCCION: " + res.observacionFichaConduccion + "\n";
          // }

          // Información radiográfica
          ({ observaciones: data.observacionesGenerales } = validarInformeRadiograficoAnexo16(
            res.infoGeneralRadiografia_info_general,
            valoresCie10.rayoscolumnaConclusionCie10,
            data.observacionesGenerales,
            ". "
          ));
          // if (res.conclusionRadiografia_conclu != null) {
          //   data.observacionesGenerales +=
          //     ". CONCLUSIONES : " + res.conclusionRadiografia_conclu + "\n";
          // }

          // Radiografía de tórax
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarHallazgosRadiograficosToraxAnexo16(
            {
              vertices: res.verticesRadiografiaTorax_txtvertices,
              hilos: res.hiliosRadiografiaTorax_txthilios,
              senos: res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos,
              campos: res.camposPulmonesRadiografiaTorax_txtcampospulm,
              mediastinos: res.mediastinosRadiografiaTorax_txtmediastinos,
              silueta: res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular,
              osteoMuscular: res.osteomuscularRadiografiaTorax_txtosteomuscular,
            },
            data.contador,
            data.observacionesGenerales
          ));

          // if (
          //   res.observacionesRadiografiaTorax_txtobservacionesrt != null &&
          //   res.observacionesRadiografiaTorax_txtobservacionesrt !== "NORMAL"
          // ) {
          //   data.observacionesGenerales +=
          //     data.contador +
          //     ". " +
          //     res.observacionesRadiografiaTorax_txtobservacionesrt +
          //     "\n";
          //   data.contador++;
          // }
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarLabClinicoAnexo16(
            res.observacionesLaboratorioClinico_txtobservacioneslb,
            valoresCie10.hematologiaObservacionesCie10,
            data.contador,
            data.observacionesGenerales
          ));

          if (res.observacionesAlturaCertificado_alturabarrick != null) {
            ({ observaciones: data.observacionesGenerales, contador: data.contador } = agregarObservacionNumerada(
              res.observacionesAlturaCertificado_alturabarrick,
              data.contador,
              data.observacionesGenerales
            ));
          } else if (res.observacionesAlturaCertificacion_certialtura != null) {
            ({ observaciones: data.observacionesGenerales, contador: data.contador } = agregarObservacionNumerada(
              res.observacionesAlturaCertificacion_certialtura,
              data.contador,
              data.observacionesGenerales
            ));
          }
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = agregarObservacionNumerada(
            res.observacionesConduccionCertificado_conduccion,
            data.contador,
            data.observacionesGenerales
          ));

          // Laboratorio - Drogas
          const coca = res.cocainaLaboratorioClinico_txtcocaina;
          const marig = res.marihuanaLaboratorioClinico_txtmarihuana;

          ({
            observaciones: data.observacionesGenerales,
            contador: data.contador,
            cocaina: data.cocaina,
            cocainaRed: data.cocainaRed,
          } = validarCocainaAnexo16(coca, data.contador, data.observacionesGenerales));

          ({
            observaciones: data.observacionesGenerales,
            contador: data.contador,
            marihuana: data.marihuana,
            marihuanaRed: data.marihuanaRed,
          } = validarMarihuanaAnexo16(marig, data.contador, data.observacionesGenerales));

          // Laboratorio - Valores básicos
          const vsg = res.vsgLaboratorioClinico_txtvsg;
          const gluc = res.glucosaLaboratorioClinico_txtglucosabio;
          const creat = res.creatininaLaboratorioClinico_txtcreatininabio;
          const hemo = res.hemoglobina_txthemoglobina ?? "";
          const examenOrina = res.examenFisicoColor_txtcoloref;
          data.vsg = vsg ?? "";
          data.glucosa = gluc ?? "";
          data.creatinina = creat ?? "";
          data.otrosExamenes = "";
          // data.otrosExamenes += `-HEMOGRAMA: NORMAL. \n`; //revisar
          data.otrosExamenes += "HEMOGRAMA: " + (
            res.examenQuimicoLeucocitos_txtleucocitoseq != null &&
              res.sedimientoUrinarioHematies_txthematiessu != null &&
              vsg != null && hemo != null ? "NORMAL" : "N/A") + "\n";
          data.otrosExamenes +=
            gluc == null ? "" : "-GLUCOSA: " + gluc + " mg/dl. \n";
          data.otrosExamenes +=
            creat == null ? "" : "-CREATININA: " + creat + " mg/dl. \n";
          data.otrosExamenes += vsg == null ? "" : "-VSG: " + vsg + ". \n";
          data.otrosExamenes +=
            examenOrina != null && examenOrina != "N/A" ? "-EX ORINA: NORMAL" + ". \n" : "";
          data.otrosExamenes += coca == null ? "" : "-COCAINA: " + coca + ". \n";
          data.otrosExamenes += marig == null ? "" : "-MARIHUANA: " + marig + ".";

          data.vsg = vsg;
          data.glucosa = gluc;
          data.creatinina = creat;

          ({ glucosaRed: data.glucosaRed } = validarGlucosa(gluc));
          ({ creatininaRed: data.creatininaRed } = validarCreatinina(creat));

          // Información personal
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = formatearFechaCorta(
            res.fechaNacimientoPaciente_fecha_nacimiento_pa
          );
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
            const fechaNac = new Date(
              res.fechaNacimientoPaciente_fecha_nacimiento_pa
            );
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mesActual = hoy.getMonth();
            const mesNacimiento = fechaNac.getMonth();

            if (
              mesActual < mesNacimiento ||
              (mesActual === mesNacimiento &&
                hoy.getDate() < fechaNac.getDate())
            ) {
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
            data.aptoParaTrabajar = "SI";
          }
          data.areaPuesto = res.area_area_o ?? "";
          data.grupoSanguineoPrevio =
            res.grupoFactorSanguineo_grupofactorsan ?? "";

          // Función respiratoria
          data.fvc = res.fvcFuncionRespiratoria_fvc ?? "";
          data.fev1 = res.fev1FuncionRespiratoria_fev1 ?? "";
          data.fev1Fvc = res.fev1FvcFuncionRespiratoria_fev1fvc ?? "";
          data.fef2575 = res.fef2575FuncionRespiratoria_fef25_75 ?? "";
          const interpretacionEspirometria =
            res.interpretacionFuncionRespiratoria_interpretacion ?? "";

          // Odontograma
          data.piezasMalEstado =
            res.piezasMalEstadoOdontograma_txtpiezasmalestado ?? "";
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarCariesDentalAnexo16(
            data.piezasMalEstado,
            data.contador,
            data.observacionesGenerales
          ));
          data.piezasFaltan = res.ausentesOdontograma_txtausentes ?? "";

          // Hijos según sexo
          if (data.sexo === "M") {
            data.hijosVivos = res.hijosVivosAntecedentes_txtvhijosvivos ?? "0";
            data.hijosMuertos =
              res.hijosFallecidosAntecedentes_txtvhijosfallecidos ?? "0";
          } else {
            data.hijosVivos =
              res.dHijosVivosAntecedentes_txtdhijosvivos ?? "0";
            data.hijosMuertos =
              res.dHijosFallecidosAntecedentes_txtdhijosfallecidos ?? "0";
          }

          // IMC
          data.imc = res.imcTriaje_imc ?? "";
          if (
            res.ordenAlturaCertificado_ordenaltura == null &&
            res.ordenConduccionCertificado_ordencond == null &&
            res.numeroAlturaCertificacion_numalt == null
          ) {
            ({
              observaciones: data.observacionesGenerales,
              contador: data.contador,
              imcRed: data.imcRed,
            } = validarImcAnexo16(data.imc, data.contador, data.observacionesGenerales));
          }

          // Antecedentes
          data.tabaco = res.antecedentes_rbfumarsi ? "POCO" : "NADA";
          data.alcohol = res.antecedentes_rblicorsi ? "POCO" : "NADA";

          // Medidas y signos vitales
          data.talla = res.tallaTriaje_talla ?? "";
          data.peso = res.pesoTriaje_peso ?? "";
          data.perimetro = res.perimetroCuelloTriaje_perimetro_cuello ?? "";
          data.temperatura = res.temperaturaTriaje_temperatura ?? "";
          data.cintura = res.cinturaTriaje_cintura ?? "";
          data.cadera = res.caderaTriaje_cadera ?? "";
          data.icc = res.iccTriaje_icc ?? "";
          data.frecuenciaRespiratoria =
            res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "";
          data.frecuenciaCardiaca =
            res.frecuenciaCardiacaTriaje_f_cardiaca ?? "";
          data.saturacionO2 = res.saturacionOxigenoTriaje_sat_02 ?? "";
          const sistolica = res.sistolicaTriaje_sistolica ?? "";
          const diastolica = res.diastolicaTriaje_diastolica ?? "";
          data.presionSistolica = sistolica;
          data.presionDiastolica = diastolica;
          data.grupoSanguineoGrupo =
            res.grupoFactorSanguineoLaboratorioClinico_Grupofactor ?? "";

          // Oftalmología
          data.enfermedadOtros =
            res.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "NINGUNA";
          data.enfermedadOculares =
            res.enfermedadesOcularesOftalmo_e_oculares ?? "NINGUNA";

          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarOftalmologiaAnexo16(
            data.enfermedadOculares,
            res.enfermedadesOcularesOtrosOftalmo_e_oculares1,
            valoresCie10.oftalmologiaEnfOcularesCie10,
            valoresCie10.oftalmologiaPresenciaPterigionCie10,
            data.contador,
            data.observacionesGenerales
          ));

          // if (data.enfermedadOtros === "PTERIGION BILATERAL") {
          //   data.observacionesGenerales +=
          //     data.contador +
          //     ". " +
          //     " PTERIGION BILATERAL:EVALUACION POR OFTALMOLOGIA.\n";
          //   data.contador++;
          // } else if (
          //   data.enfermedadOtros !== "NINGUNA" &&
          //   data.enfermedadOtros !== ""
          // ) {
          //   data.observacionesGenerales +=
          //     data.contador +
          //     ". " +
          //     data.enfermedadOtros +
          //     " :EVALUACION POR OFTALMOLOGIA.\n";
          //   data.contador++;
          //   console.log("aosdnoadsnaosi")
          // }

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
          //ESTO ESTA EN OTRO INPUT; NO EN OBSERVACIONES GENERALES
          const diagnosticoAudiometrico =
            res.diagnosticoAudiometricoCompleto_diagnostico ?? "";
          data.observacionesAudio = construirObservacionesAudioAnexo16({
            od500: data.od500,
            diagnosticoAudiometrico,
            cie10Diagnostico: valoresCie10.audiometriaDiagnosticoCie10,
            normal: res.normalAudiometria_chkdnormal,
            traumaLeveOd: res.traumaLeveOdAudiometria_chkdtaleveod,
            traumaLeveOi: res.traumaLeveOiAudiometria_chkdtaleveoi,
            traumaAvanzadoOd: res.traumaAvanzadoOdAudiometria_chkdtaavanzadood,
            traumaAvanzadoOi: res.traumaAvanzadoOiAudiometria_chkdtaavanzadooi,
            hipoacusiaLeveOd: res.hipoacusiaLeveOdAudiometria_chkdhrleveod,
            hipoacusiaLeveOi: res.hipoacusiaLeveOiAudiometria_chkdhrleveoi,
            hipoacusiaModeradaOd: res.hipoacusiaModeradaOdAudiometria_chkdhrmoderadood,
            hipoacusiaModeradaOi: res.hipoacusiaModeradaOiAudiometria_chkdhrmoderadooi,
            hipoacusiaAvanzadaOd: res.hipoacusiaAvanzadaOdAudiometria_chkdhravanzadaod,
            hipoacusiaAvanzadaOi: res.hipoacusiaAvanzadaOiAudiometria_chkdhravanzadaoi,
            otrasHipoacusias: res.otrasHipoacusiasAudiometria_chkotrashipoacusias,
            otrasHipoacusiasTexto: res.otrasHipoacusiasAudiometria_txtotrashipoacusias,
          });

          // Presbiacusia
          if (data.od8000 !== "" && data.od8000 !== "N/A") {
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

          //Riesgo cardiovascular
          data.riesgo_coronario_valor = res.riesgo_coronario_valor ?? "";

          // Validación grupo sanguíneo
          if (data.grupoSanguineoGrupo !== data.grupoSanguineoPrevio) {
            console.error("Grupo Sanguíneo incongruente por favor revisar");
          }

          // Odontograma observaciones
          ({
            observaciones: data.observacionesGenerales,
            contador: data.contador,
            dentaduraObservaciones: data.dentaduraObservaciones,
          } = validarOdontogramaAnexo16(
            res.observacionesOdontograma_txtobservaciones,
            valoresCie10.odontologiaObservacionesCie10,
            data.contador,
            data.observacionesGenerales
          ));

          // Espirometría
          ({
            observaciones: data.observacionesGenerales,
            contador: data.contador,
            conclusionRespiratoria: data.conclusionRespiratoria,
          } = validarEspirometriaAnexo16(data.fvc, data.fev1Fvc, interpretacionEspirometria, data.contador, data.observacionesGenerales));

          data.visionColores = res.vc_vc ?? "";
          // Visión de colores
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarVisionColoresAnexo16(
            data.visionColores,
            data.contador,
            data.observacionesGenerales
          ));

          // Presión arterial
          ({ observaciones: data.observacionesGenerales, contador: data.contador } = validarPresionArterialAnexo16(
            sistolica,
            diastolica,
            data.contador,
            data.observacionesGenerales
          ));
          data.resultadoGonadotropina = res.sexo_sexo_pa === "M" ? "N/A" : res.resultadoGonadotropina
          const sexo = res.sexo_sexo_pa; // "M" o "F"
          const esMujer = sexo === "F";

          ({ observaciones: data.observacionesGenerales } = validarCreatininaSericaAnexo16(
            res.creatininaPerfilRenal,
            data.observacionesGenerales
          ));
          ({ observaciones: data.observacionesGenerales } = validarUreaSericaAnexo16(
            res.ureaSericaPerfilRenal,
            data.observacionesGenerales
          ));
          ({ observaciones: data.observacionesGenerales } = validarAcidoUricoSericoAnexo16(
            res.acidoUricoSericoPerfilRenal,
            esMujer,
            data.observacionesGenerales
          ));

          if (res.chk1) data.clasificacion = "0/-";
          else if (res.chk5) data.clasificacion = "0/0";
          else if (res.chk9) data.clasificacion = "0/1";
          else if (res.chk2) data.clasificacion = "1/0";
          else if (res.chk6) data.clasificacion = "1/1";
          else if (res.chk10) data.clasificacion = "1/2";
          else if (res.chk3) data.clasificacion = "2/1";
          else if (res.chk7) data.clasificacion = "2/2";
          else if (res.chk11) data.clasificacion = "2/3";
          else if (res.chk4) data.clasificacion = "3/2";
          else if (res.chk8) data.clasificacion = "3/3";
          else if (res.chk12) data.clasificacion = "3/+";

          if (res.chka || res.chkb || res.chkc) data.clasificacionABC = "ABC";
          // else if (res.examenRadiograficoAbc_ex_abc) data.clasificacionABC = "ABC";
          // else if (res.examenRadiograficoSt_ex_st) data.clasificacionST = "ST";

          data.simbolosRx = construirSimbolosFormaTamano(res) || "";
          data.calidadRx = obtenerCalidadRadiografica(res) ?? "";


          ({ observaciones: data.observacionesGenerales } = validarGonadotropinaAnexo16(
            esMujer,
            res.resultadoGonadotropina,
            data.observacionesGenerales
          ));
          data.notasDoctor = res.notasDoctor ?? "";
          data.mercurioOrina = res.mercurioOrina ?? "N/A";
          data.plomoSangre = res.plomoSangre ?? "N/A";

          ({ observaciones: data.observacionesGenerales } = validarRiesgoCardiovascularFramingham(
            data.empresa,
            data.edad,
            data.nomExamen,
            data.riesgo_coronario_valor,
            data.observacionesGenerales
          ));
          data.conclusiones_cie_10 = limpiarObservaciones(data.conclusiones_cie_10);



          data = MapearDatosAdicionales(res, data, data.contador, false);
          console.log("DATAAA", data);
          set((prev) => ({
            ...prev,
            ...res,
            ...data,
            conclusionesCie10: data.conclusiones_cie_10,
            // antecedentesPersonales: `${res.antecedentesPersonalesAnexo7c_txtantecedentespersonales ?? ""}\n${res.alergia_medicamentos_an ?? ""}\n${prev.antecedentesPersonales ?? ""}`,
            antecedentesPersonales: [
              res.antecedentesPersonalesAnexo7c_txtantecedentespersonales,
              res.alergia_medicamentos_an,
              prev.antecedentesPersonales
            ]
              .filter(texto => texto?.trim())
              .join("\n"),
          }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};
export const ValidarExamenesRealizados = (
  nro,
  token,
  SinReestricciones,
  onComplete = () => { },
  onFail = () => { }
) => {
  getFetch(`${obtenerExamenesRealizadosUrl}?nOrden=${nro}`, token)
    .then((res) => {
      if (res) {
        console.log(res);

        const examenes = {
          "Antecedentes Patológicos": res.fichaAntecedentesPatologicos,
          Triaje: res.triaje,
          'Oftalmología': res.oftalmologia,
          Espirometría: res.espirometria,
          "Radiografía de Tórax": res.radiografiaTorax,
          "Laboratorio Clínico": res.laboratorioClinico,
          Odontograma: res.odontograma,
          Audiometría: res.audiometriaPo,
        };

        const examenesFaltantes = Object.keys(examenes).filter(examen => !examenes[examen]);

        if (examenesFaltantes.length === 0) {
          onComplete();
        } else {
          if (SinReestricciones) {
            onComplete();
          }
          const listaTexto = examenesFaltantes
            .map(examen => `• ${examen}`)
            .join('\n');
          console.log('faltan')
          onFail(listaTexto == null || listaTexto == "" ? "" : "El paciente no ha realizado los siguientes exámenes:\n" + listaTexto);
        }
      } else {
        console.log("No se encontraron datos de exámenes realizados");
      }
    })
    .catch((error) => {
      console.error("Error al obtener exámenes realizados:", error);
    });
};
export const GetExamenesRealizados = (nro, set, token, onFinish = () => { }) => {
  LoadingDefault("Obteniendo Exámenes Realizados");
  getFetch(`${obtenerExamenesRealizadosUrl}?nOrden=${nro}`, token)
    .then((res) => {
      if (res) {
        console.log(res);
        set((prev) => ({
          ...prev,
          // Estado del Paciente
          nordenEstadoPaciente: nro,
          nombresEstadoPaciente: res.nombresPaciente ?? "",
          tipoExamenEstadoPaciente: res.nombreExamen ?? "",

          // Exámenes Realizados - convertir booleanos a  "PASADO" : "POR PASAR",
          triaje: res.triaje ? "PASADO" : "POR PASAR",
          labClinico: res.laboratorioClinico ? "PASADO" : "POR PASAR",
          electrocardiograma: res.electroCardiograma ? "PASADO" : "POR PASAR",
          rxToraxPA: res.radiografiaTorax ? "PASADO" : "POR PASAR",
          fichaAudiologica: res.fichaAudiologica ? "PASADO" : "POR PASAR",
          espirometria: res.espirometria ? "PASADO" : "POR PASAR",
          odontograma: res.odontograma ? "PASADO" : "POR PASAR",
          psicologia: res.psicologia ? "PASADO" : "POR PASAR",
          anexo7D: res.anexo7D ? "PASADO" : "POR PASAR",
          histOcupacional: res.historiaOcupacional ? "PASADO" : "POR PASAR",
          fichaAntPatologicos: res.fichaAntecedentesPatologicos
            ? "PASADO"
            : "POR PASAR",
          cuestionarioNordico: res.cuestionarioNordico ? "PASADO" : "POR PASAR",
          certTrabajoAltura: res.certificadoTrabajoAltura
            ? "PASADO"
            : "POR PASAR",
          detencionSAS: res.detencionSAS ? "PASADO" : "POR PASAR",
          consentimientoDosaje: res.consentimientoDosaje
            ? "PASADO"
            : "POR PASAR",
          exRxSanguineos: res.examenRadiografiaSanguineos
            ? "PASADO"
            : "POR PASAR",
          perimetroToraxico: res.perimetroToraxico ? "PASADO" : "POR PASAR",
          oftalmologia: res.oftalmologia ? "PASADO" : "POR PASAR",
        }));
        onFinish();
      } else {
        console.log("No se encontraron datos de exámenes realizados");
        onFinish();
      }
    })
    .catch((error) => {
      console.error("Error al obtener exámenes realizados:", error);
      onFinish();
    });
};

// Convierte los checks de OIT "Forma y Tamaño" (chk_p_1..chk_p_6 primaria,
// chk_s_1..chk_s_6 secundaria) al símbolo que representan (p, q, r, s, t, u)
// y arma el texto "primario/secundario" (ej. "p/q") para el campo Símbolos
// de la sección Abdomen del Anexo 16.
const SIMBOLOS_FORMA_TAMANO = ["p", "q", "r", "s", "t", "u"];

const obtenerSimboloFormaTamano = (res, prefijo) => {
  for (let i = 1; i <= 6; i++) {
    if (res[`chk_${prefijo}_${i}`]) {
      return SIMBOLOS_FORMA_TAMANO[i - 1];
    }
  }
  return "";
};

const obtenerProfusion = (res) => {
  for (let i = 1; i <= 12; i++) {
    if (res[`chk_${i}`]) {
      return SIMBOLOS_FORMA_TAMANO[i - 1];
    }
  }
}

const obtenerCalidadRadiografica = (res) => {
  if (res.rb_buena) return "1";
  if (res.rb_aceptable) return "2";
  if (res.rb_bajacalidad) return "3";
  if (res.rb_inaceptable) return "4";
  return "";
}

const construirSimbolosFormaTamano = (res) => {
  const primaria = obtenerSimboloFormaTamano(res, "p");
  const secundaria = obtenerSimboloFormaTamano(res, "s");
  return primaria || secundaria ? `${primaria}/${secundaria}` : "";
};

// Función adaptada del código Java (líneas 915-1076) para mapear datos adicionales
export const MapearDatosAdicionales = (
  res,
  data,
  contador = 1,
  isEdit = false
) => {
  try {
    // =============================================================================================
    // SECCIÓN VISUAL - Examen Oftalmológico   muestraVisual
    // =============================================================================================

    // Visión cercana sin corregir
    data.visionCercaOd = res.visionCercaSinCorregirOd_v_cerca_s_od ?? "";
    data.visionCercaOi = res.visionCercaSinCorregirOi_v_cerca_s_oi ?? "";

    // Visión lejana sin corregir
    data.visionLejosOd = res.visionLejosSinCorregirOd_v_lejos_s_od ?? "";
    data.visionLejosOi = res.visionLejosSinCorregirOi_v_lejos_s_oi ?? "";

    // Visión corregida -
    data.visionCercaOdCorregida = res.visionCercaCorregidaOd_v_cerca_c_od ?? "";
    data.visionCercaOiCorregida = res.visionCercaCorregidaOi_v_cerca_c_oi ?? "";
    data.visionLejosOdCorregida = res.visionLejosCorregidaOd_v_lejos_c_od ?? "";
    data.visionLejosOiCorregida = res.visionLejosCorregidaOi_v_lejos_c_oi ?? "";

    // Otros exámenes visuales
    data.visionColores = res.vc_vc ?? "";
    data.visionBinocular = res.visionBinocular_v_binocular ?? "";
    data.reflejosPupilares =
      res.rp_rp ?? "";
    data.enfermedadOculares = res.enfermedadesOcularesOftalmo_e_oculares ?? "";
    data.enfermedadOtros =
      res.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "";

    if (isEdit) {
      //SOLO EN EDITAR
      // =============================================================================================
      // SECCIÓN RADIOGRAFÍA Y SANGRE    editarRadiogrSan
      // =============================================================================================

      // Información básica del paciente
      data.dni = res.dni_cod_pa;
      data.norden = res.norden_n_orden;

      // Radiografía de tórax
      data.vertices = res.verticesRadiografiaTorax_txtvertices ?? "";
      data.hilios = res.hiliosRadiografiaTorax_txthilios ?? "";
      data.senos =
        res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos ?? "";
      data.mediastinos = res.mediastinosRadiografiaTorax_txtmediastinos ?? "";
      data.siluetaCardiovascular =
        res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular ??
        "";
      data.conclusionesRadiograficas =
        res.conclusionesRadiograficasTorax_txtconclusionesradiograficas ?? "";

      // Hemoglobina y validación por sexo
      data.hemoglobinaHematocrito = res.hemoglobina_txthemoglobina ?? "";
      // Reacciones serológicas
      data.reaccionesSerologicas = res.positivoLaboratorioClinico_chkpositivo
        ? "POSITIVO"
        : res.negativoLaboratorioClinico_chknegativo
          ? "NEGATIVO"
          : "";
      data.nombres = res.nombres_nombres_pa ?? "";
      data.apellidos = res.apellidos_apellidos_pa ?? "";
      // Grupo sanguíneo
      data.grupoSanguineo = res.grupoSanguineoO_chko
        ? "O"
        : res.grupoSanguineoA_chka
          ? "A"
          : res.grupoSanguineoB_chkb
            ? "B"
            : res.grupoSanguineoAB_chkab
              ? "AB"
              : "";

      data.factorRh = res.grupoSanguineoRhPositivo_rbrhpositivo
        ? "RH(+)"
        : res.grupoSanguineoRhNegativo_rbrhnegativo
          ? "RH(-)"
          : "";

      // Fechas y calidad
      data.fechaRx = res.fechaExamenRadiografico_fecha_exra ?? "";
      data.calidadRx = res.calidadExamenRadiografico_txtcalidad ?? "";
      data.simbolosRx = res.simbolosExamenRadiografico_txtsimbolos ?? "";

      // Clasificación radiográfica
      if (res.examenRadiografico1_ex_1) data.clasificacion = "0/-";
      else if (res.examenRadiografico0_ex_0) data.clasificacion = "0/0";
      else if (res.examenRadiografico10_ex_10) data.clasificacion = "1/0";
      else if (res.examenRadiografico01_ex_01) data.clasificacion = "0/1";
      else if (res.examenRadiografico11_ex_11) data.clasificacion = "1/1";
      else if (res.examenRadiografico12_ex_12) data.clasificacion = "1/2";
      else if (res.examenRadiografico21_ex_21) data.clasificacion = "2/1";
      else if (res.examenRadiografico22_ex_22) data.clasificacion = "2/2";
      else if (res.examenRadiografico23_ex_23) data.clasificacion = "2/3";
      else if (res.examenRadiografico32_ex_32) data.clasificacion = "3/2";
      else if (res.examenRadiografico33_ex_33) data.clasificacion = "3/3";
      else if (res.examenRadiografico3mas_ex_3mas) data.clasificacion = "3/+";
      if (res.examenRadiograficoAbc_ex_abc) data.clasificacionABC = "ABC";
      if (res.examenRadiograficoSt_ex_st) data.clasificacionST = "ST";

      // Neumoconiosis
      // data.sinNeumoconiosis =
      //   res.examenRadiograficoSinNeumoconiosis_txtsinneumoconiosis ?? "";
      data.sinNeumoconiosis =
        res.txt_s_comentarios ?? "";
      data.conNeumoconiosis =
        res.examenRadiograficoConNeumoconiosis_txtconneumoconiosis ?? "";
      data.polvo = res.polvoAnexo7c_chkpolvo ?? "";

      // Aptitud para trabajar
      if (res.examenRadiograficoAptoSi_apto_si) data.aptoParaTrabajar = "SI";
      else if (res.examenRadiograficoAptoNo_apto_no)
        data.aptoParaTrabajar = "NO";
      else if (res.examenRadiograficoAptoRe_apto_re)
        data.aptoParaTrabajar = "REEVALUACION";
      else if (res.evaluado) {
        data.aptoParaTrabajar = "EVALUADO"
      }

      const sexo = res.sexo_sexo_pa ?? data.sexo;
      const resultadoHemoglobinaFlag = validarHemoglobinaFlagAnexo16(data.hemoglobinaHematocrito, sexo);
      if (resultadoHemoglobinaFlag.hemoglobinaRed !== undefined) {
        data.hemoglobinaRed = resultadoHemoglobinaFlag.hemoglobinaRed;
      }
    } else {
      // =============================================================================================
      // SECCIÓN EXAMENES SANGUINEOS cargarExamSanguineos   SOLO EN OBTENER
      // =============================================================================================
      data.dni = res.dni_cod_pa ?? "";
      data.vertices = res.verticesRadiografiaTorax_txtvertices ?? "";
      data.hilios = res.hiliosRadiografiaTorax_txthilios ?? "";
      data.senos =
        res.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos ?? "";
      data.mediastinos = res.mediastinosRadiografiaTorax_txtmediastinos ?? "";
      data.siluetaCardiovascular =
        res.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular ??
        "";
      data.conclusionesRadiograficas =
        res.conclusionesRadiograficasTorax_txtconclusionesradiograficas ?? "";

      const hemo = res.hemoglobina_txthemoglobina ?? "";
      data.hemoglobinaHematocrito = hemo;
      // Reacciones serológicas
      data.reaccionesSerologicas = res.positivoLaboratorioClinico_chkpositivo
        ? "POSITIVO"
        : res.negativoLaboratorioClinico_chknegativo
          ? "NEGATIVO"
          : "";
      data.nombres = res.nombres_nombres_pa ?? "";
      data.apellidos = res.apellidos_apellidos_pa ?? "";
      // Grupo sanguíneo
      data.grupoSanguineo = res.grupoSanguineoO_chko
        ? "O"
        : res.grupoSanguineoA_chka
          ? "A"
          : res.grupoSanguineoB_chkb
            ? "B"
            : res.grupoSanguineoAB_chkab
              ? "AB"
              : "";
      data.factorRh = res.grupoSanguineoRhPositivo_rbrhpositivo
        ? "RH(+)"
        : res.grupoSanguineoRhNegativo_rbrhnegativo
          ? "RH(-)"
          : "";



      data.fechaRx = getToday();
      // data.calidadRx = "2";
      data.simbolosRx = construirSimbolosFormaTamano(res) || "N/A";
      const sexo = res.sexo_sexo_pa ?? "";
      data.sexo = sexo;
      if (hemo && hemo !== "" && hemo !== "N/A") {
        const resultadoHemoglobina = validarHemoglobinaConTextoAnexo16(
          data.hemoglobinaHematocrito,
          sexo,
          contador,
          data.observacionesGenerales
        );
        data.observacionesGenerales = resultadoHemoglobina.observaciones;
        data.hemoglobinaRed = resultadoHemoglobina.hemoglobinaRed;
        contador = resultadoHemoglobina.contador;
      }
    }
    data.numeroRx = res.norden_n_orden ?? "";

    // =============================================================================================
    // SECCIÓN ELECTROCARDIOGRAMA electroCardiograma
    // =============================================================================================

    // const hallazgo = res.hallazgosInformeElectroCardiograma_hallazgo;
    // const recomendaciones =
    //   res.recomendacionesInformeElectroCardiograma_recomendaciones;

    // if (hallazgo && hallazgo !== "NORMAL." && !isEdit) {
    //   let electrocardiogramaText = `${contador}.ELECTROCARDIOGRAMA: ${hallazgo}`;
    //   if (recomendaciones) {
    //     electrocardiogramaText += `.${recomendaciones}`;
    //   }
    //   // Agregar a observaciones generales si existe
    //   if (data.observacionesGenerales) {
    //     data.observacionesGenerales += electrocardiogramaText + "\n";
    //   } else {
    //     data.observacionesGenerales = electrocardiogramaText + "\n";
    //   }
    //   contador++;
    // }

    // =============================================================================================
    // SECCIÓN EXAMEN DE ORINA
    // =============================================================================================

    // Examen físico de orina
    data.colorFisico = res.examenFisicoColor_txtcoloref ?? "";
    data.aspectoFisico = res.examenFisicoAspecto_txtaspectoef ?? "";
    data.densidadFisico = res.examenFisicoDensidad_txtdensidadef ?? "";
    data.phFisico = res.examenFisicoPh_txtphef ?? "";

    // Examen químico de orina
    data.nitritos = res.examenQuimicoNitritos_txtnitritoseq ?? "";
    data.proteinas = res.examenQuimicoProteinas_txtproteinaseq ?? "";
    data.leucocitos = res.examenQuimicoLeucocitos_txtleucocitoseq ?? "";
    data.cetonas = res.examenQuimicoCetonas_txtcetonaseq ?? "";
    data.urobilinogeno =
      res.examenQuimicoUrobilinogeno_txturobilinogenoeq ?? "";
    data.bilirrubina = res.examenQuimicoBilirubina_txtbilirubinaeq ?? "";
    data.glucosaQuimico = res.examenQuimicoGlucosa_txtglucosaeq ?? "";
    data.sangre = res.examenQuimicoSangre_txtsangreeq ?? "";

    // Sedimento urinario
    data.leucocitosSedimento =
      res.sedimientoUrinarioLeucocitos_txtleucocitossu ?? "";
    data.celulasEpiteliales =
      res.sedimientoUrinarioEpiteliales_txtcelepitelialessu ?? "";
    data.cilindios = res.sedimientoUrinarioCilindios_txtcilindiossu ?? "";
    data.bacterias = res.sedimientoUrinarioBacterias_txtbacteriassu ?? "";
    data.hematies = res.sedimientoUrinarioHematies_txthematiessu ?? "";
    data.cristales = res.sedimientoUrinarioCristales_txtcristalessu ?? "";
    data.pus = res.sedimientoUrinarioPus_txtpussu ?? "";
    data.otrosSedimento = res.sedimientoUrinarioOtros_txtotrossu ?? "";

    // =============================================================================================
    // SECCIÓN ANÁLISIS BIOQUÍMICO
    // =============================================================================================

    // Perfil lipídico
    data.colesterolTotal = res.colesterolAnalisisBioquimico_txtcolesterol ?? "";
    data.LDLColesterol =
      res.ldlcolesterolAnalisisBioquimico_txtldlcolesterol ?? "";
    data.HDLColesterol =
      res.hdlcolesterolAnalisisBioquimico_txthdlcolesterol ?? "";
    data.VLDLColesterol =
      res.vldlcolesterolAnalisisBioquimico_txtvldlcolesterol ?? "";
    data.trigliceridos =
      res.trigliseridosAnalisisBioquimico_txttrigliseridos ?? "";

    // Validaciones y observaciones para perfil lipídico
    {
      const resultadoLipidico = validarPerfilLipidicoAnexo16(
        data.colesterolTotal,
        data.LDLColesterol,
        data.HDLColesterol,
        data.VLDLColesterol,
        data.trigliceridos,
        contador,
        data.observacionesGenerales
      );
      data.observacionesGenerales = resultadoLipidico.observaciones;
      contador = resultadoLipidico.contador;
      data.colesterolRed = resultadoLipidico.colesterolRed;
      data.trigliceridosRed = resultadoLipidico.trigliceridosRed;
      data.ldlRed = resultadoLipidico.ldlRed;
      data.hdlRed = resultadoLipidico.hdlRed;
      data.vldlRed = resultadoLipidico.vldlRed;
    }



    // =============================================================================================
    // SECCIÓN ANTECEDENTES PATOLÓGICOS
    // =============================================================================================

    data.antecedentesPatologicos =
      res.antecedentesPatologicos_ante_patologicos ?? "";

    //LABORATORIO OBSERVACIONES GENERALES




    return data;
  } catch (error) {
    console.error("Error en MapearDatosAdicionales:", error);
    return data; // Retornar data original en caso de error
  }
};

export const GetInfoServicioEditar = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  Promise.all([
    getFetch(`${obtenerSimpleUrl}?nOrden=${nro}&nameService=${tabla}`, token),
    getFetch(`${obtenerParaEditarUrl}?nOrden=${nro}&nameService=${tabla}`, token)
  ])
    .then(([resSimple, res]) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            observacionesGenerales:
              res.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "",
            observacionesGenerales2: "",
            // otrosExamenes2: "",
            cerrado: res.cerrado ?? false,
            observacionesAudio: "",
            contador: 1,
            codigoAnexo: res.codigoAnexo7c_cod_anexo,
            codigoExamenRadiograficoSanguineo: res.codigoExamenRadiograficoSanguineo_cod_exra,
            imagenRadiograficaPolvo: res.examenRadiograficoIrep_txtirep ?? "",
            piel: res.pielAnexo7c_piel ? "NORMAL" : "ANORMAL",
            pielObservaciones: res.pielDescripcionAnexo7c_piel_descripcion,
            colesterolAnalisisBioquimico_txtcolesterol: res.colesterolAnalisisBioquimico_txtcolesterol,
            SubirDoc: true,
            otrosExamenes: "",
            conclusionesCie10: res.conclusiones_cie_10
          };

          data.conclusiones_cie_10 = res.conclusiones_cie_10 ?? "";
          data.observacionesGenerales2Cie10 = "";
          const valoresCie10 = {
            ekgConclusionesCie10: res.ekg_conclusiones_cie_10,
            ekgHallazgosCie10: res.ekg_hallazgos_cie_10,
            audiometriaDiagnosticoCie10: res.audiometriapo_diagnostico_cie_10,
            oftalmologiaVisionColoresCie10: res.oftalmologia_vision_colores_cie_10,
            oftalmologiaEnfOcularesCie10: res.oftalmologia_enf_oculares_cie_10,
            oftalmologiaPresenciaPterigionCie10: res.oftalmologia_presencia_pterigion_cie_10,
            espirometriaInterpretacionCie10: res.espirometria_interpretacion_cie_10,
            rayosxConclusionesCie10: res.rayosx_conclusiones_cie_10,
            musculoEsqueleticoDiagnosticoCie10: res.musculoesq_diagnostico_cie_10,
            rayoscolumnaConclusionCie10: res.rayoscolumna_conclusion_cie_10,
            odontologiaObservacionesCie10: res.odontologia_observaciones_cie_10,
            hematologiaObservacionesCie10: res.hematologia_observaciones_cie_10
          };
          try {
            data.observacionesGenerales2Cie10 = Object.values(valoresCie10 ?? {})
              .filter(value => value != null && value !== '')
              .map(String)
              .sort((a, b) => a.localeCompare(b, 'es'))
              .join('\n');
          } catch {
            data.observacionesGenerales2Cie10 = '';
          }

          data.dentaduraObservaciones =
            res.observacionesOdontograma_txtobservaciones ?? "";

          // Drug test results
          const coca = res.cocainaLaboratorioClinico_txtcocaina;
          const marig = res.marihuanaLaboratorioClinico_txtmarihuana;
          data.cocaina = coca;
          data.marihuana = marig;

          if (coca != null && marig != null) {
            if (coca === "REACTIVO" || coca === "POSITIVO") {
              data.cocainaRed = true;
            } else {
              data.cocainaRed = false;
            }

            if (marig === "REACTIVO" || marig === "POSITIVO") {
              data.marihuanaRed = true;
            } else {
              data.marihuanaRed = false;
            }
          }

          // Basic lab values
          const vsg = res.vsgLaboratorioClinico_txtvsg;
          const gluc = res.glucosaLaboratorioClinico_txtglucosabio;
          const creat = res.creatininaLaboratorioClinico_txtcreatininabio;
          const hemo = res.hemoglobina_txthemoglobina ?? "";
          const examenOrina = res.examenFisicoColor_txtcoloref;

          data.vsg = vsg ?? "";
          data.glucosa = gluc ?? "";
          data.creatinina = creat ?? "";

          // data.otrosExamenes2 += `-HEMOGRAMA: NORMAL. \n`; //revisar
          data.otrosExamenes += "HEMOGRAMA: " + (
            res.examenQuimicoLeucocitos_txtleucocitoseq != null &&
              res.sedimientoUrinarioHematies_txthematiessu != null &&
              vsg != null && hemo != null ? "NORMAL" : "N/A") + "\n";
          data.otrosExamenes +=
            gluc == null ? "" : "-GLUCOSA: " + gluc + " mg/dl. \n";
          data.otrosExamenes +=
            creat == null ? "" : "-CREATININA: " + creat + " mg/dl. \n";
          data.otrosExamenes += vsg == null ? "" : "-VSG: " + vsg + ". \n";
          data.otrosExamenes +=
            examenOrina != null && examenOrina != "N/A" ? "-EX ORINA: NORMAL" + ". \n" : "";
          data.otrosExamenes += coca == null ? "" : "-COCAINA: " + coca + ". \n";
          data.otrosExamenes += marig == null ? "" : "-MARIHUANA: " + marig + ".";


          data.vsg = vsg ?? "";
          data.glucosa = gluc ?? "";
          data.creatinina = creat ?? "";

          // Glucose validation
          if (data.glucosa !== "" && data.glucosa !== "N/A") {
            const glucosa = parseFloat(data.glucosa);
            if (glucosa >= 110 || glucosa < 70) {
              data.glucosaRed = true;
            } else {
              data.glucosaRed = false;
            }
          }

          // Creatinine validation
          if (data.creatinina !== "" && data.creatinina !== "N/A") {
            const cretinina = parseFloat(data.creatinina);
            if (cretinina >= 1.4 || cretinina < 0.8) {
              data.creatininaRed = true;
            } else {
              data.creatininaRed = false;
            }
          }

          // Build otrosExamenes field
          // data.otrosExamenes = res.examenRadiograficoOtros_txtotrosex;

          // Personal information
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = res.fechaNacimientoPaciente_fecha_nacimiento_pa ?? "";
          data.sexo = res.sexo_sexo_pa ?? "";
          data.lugarNac = res.lugarNacimientoPaciente_lugar_nac_pa ?? "";
          data.domicilio = res.direccionPaciente_direccion_pa ?? "";
          data.telefono = res.telefonoCasaPaciente_tel_casa_pa ?? "";
          data.estadoCivil = res.estadoCivilPaciente_estado_civil_pa ?? "";
          data.gradoInstruccion = res.nivelEstudioPaciente_nivel_est_pa ?? "";

          // Company information
          data.empresa = res.empresa_razon_empresa ?? "";
          data.contrata = res.contrata_razon_contrata ?? "";
          // Age calculation
          if (data.fechaNac) {
            const birthDate = new Date(data.fechaNac);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            data.edad = age.toString();
          } else {
            data.edad = "";
          }
          data.explotacion = res.explotacion_nom_ex ?? "";
          data.alturaLaboral = res.altura_altura_po ?? "";
          data.mineralExp = res.mineral_mineral_po ?? "";
          data.puestoPostula = res.cargo_cargo_de ?? "";
          // Exam type specific logic
          if (data.nomExamen === "ANUAL") {
            data.puestoActual = res.cargo_cargo_de ?? "";
          }
          data.areaPuesto = res.areaOcupacional_area_o ?? "";

          // Respiratory function
          data.fvc = res.fvcFuncionRespiratoria_fvc ?? "";
          data.fev1 = res.fev1FuncionRespiratoria_fev1 ?? "";
          data.fev1Fvc = res.fev1FvcFuncionRespiratoria_fev1fvc ?? "";
          data.fef2575 = res.fef2575FuncionRespiratoria_fef25_75 ?? "";

          // Dental information
          data.piezasMalEstado =
            res.piezasMalEstadoOdontograma_txtpiezasmalestado ?? "";
          data.piezasFaltan = res.ausentesOdontograma_txtausentes ?? "";

          // Children information based on gender
          if (data.sexo === "M") {
            data.hijosVivos = res.hijosVivosAntecedentes_txtvhijosvivos ?? "0";
            data.hijosMuertos =
              res.hijosFallecidosAntecedentes_txtvhijosfallecidos ?? "0";
          } else {
            data.hijosVivos =
              res.detalleHijosVivosAntecedentes_txtdhijosvivos ?? "0";
            data.hijosMuertos =
              res.detalleHijosFallecidosAntecedentes_txtdhijosfallecidos ?? "0";
          }

          // Physical measurements
          data.imc = res.imcTriaje_imc ?? "";
          data.talla = res.tallaTriaje_talla ?? "";
          data.peso = res.pesoTriaje_peso ?? "";
          // data.perimetro = res.perimetroCuelloTriaje_perimetro_cuello ?? "";
          data.temperatura = res.temperaturaTriaje_temperatura ?? "";
          data.cintura = res.cinturaTriaje_cintura ?? "";
          data.cadera = res.caderaTriaje_cadera ?? "";
          data.icc = res.iccTriaje_icc ?? "";
          data.frecuenciaRespiratoria =
            res.frecuenciaRespiratoriaTriaje_f_respiratoria ?? "";
          data.frecuenciaCardiaca =
            res.frecuenciaCardiacaTriaje_f_cardiaca ?? "";
          data.saturacionO2 = res.saturacionOxigenoTriaje_sat_02 ?? "";
          data.presionSistolica = res.sistolicaTriaje_sistolica ?? "";
          data.presionDiastolica = res.diastolicaTriaje_diastolica ?? "";

          // Vision tests
          data.visionCercaOd = res.visionCercaSinCorregirOd_v_cerca_s_od ?? "";
          data.visionCercaOi = res.visionCercaSinCorregirOi_v_cerca_s_oi ?? "";
          data.visionCercaOdCorregida =
            res.visionCercaCorregidaOd_v_cerca_c_od ?? "";
          data.visionCercaOiCorregida =
            res.visionCercaCorregidaOi_v_cerca_c_oi ?? "";
          data.visionLejosOd = res.visionLejosSinCorregirOd_v_lejos_s_od ?? "";
          data.visionLejosOi = res.visionLejosSinCorregirOi_v_lejos_s_oi ?? "";
          data.visionLejosOdCorregida =
            res.visionLejosCorregidaOd_v_lejos_c_od ?? "";
          data.visionLejosOiCorregida =
            res.visionLejosCorregidaOi_v_lejos_c_oi ?? "";
          data.visionBinocular = res.visionBinocular_v_binocular ?? "";

          // Audiometry tests
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

          // Anexo7c - Risk factors and work conditions
          data.fechaExam = res.fechaAnexo7c_fecha;
          data.ruido = res.ruidoAnexo7c_chkruido ?? false;
          data.polvo = res.polvoAnexo7c_chkpolvo ?? false;
          data.vidSegmentario =
            res.vidSegmentarioAnexo7c_chkvidsegmentario ?? false;
          data.vidTotal = res.vidTotalAnexo7c_chkvidtotal ?? false;
          data.cancerigenos = res.cancerigenosAnexo7c_chkcancerigenos ?? false;
          data.mutagenicos = res.mutagenicosAnexo7c_chkmutagenicos ?? false;
          data.solventes = res.solventesAnexo7c_chksolventes ?? false;
          data.metales = res.metalesAnexo7c_chkmetales ?? false;
          data.temperaturaAgente =
            res.temperaturaAnexo7c_chktemperatura ?? false;
          data.biologicos = res.biologicosAnexo7c_chkbiologicos ?? false;
          data.posturas = res.posturasAnexo7c_chkposturas ?? false;
          data.turnos = res.turnosAnexo7c_chkturnos ?? false;
          data.cargas = res.cargasAnexo7c_chkcargas ?? false;
          data.movRepet = res.movRepetAnexo7c_chkmovrepet ?? false;
          data.pvd = res.pvdAnexo7c_chkpvd ?? false;
          data.otros = res.otrosAnexo7c_chkotros ?? false;

          // Tobacco and alcohol consumption
          data.reubicacion = res.reubicacionSiAnexo7c_tbrsi ?? false;
          data.tabaco = res.tabacoNadaAexo7c_chktnada
            ? "NADA"
            : res.tabacoPocoAnexo7c_chktpoco
              ? "POCO"
              : res.tabacoHabitualAnexo7c_chkthabitual
                ? "HABITUAL"
                : res.tabacoExcesivoAnexo7c_chktexcesivo
                  ? "EXCESIVO"
                  : "";
          data.alcohol = res.alcoholNadaAnexo7c_chkanada
            ? "NADA"
            : res.alcoholPocoAnexo7c_chkapoco
              ? "POCO"
              : res.alcoholHabitualAnexo7c_chkahabitual
                ? "HABITUAL"
                : res.alcoholExcesivoAnexo7c_chkaexcesivo
                  ? "EXCESIVO"
                  : "";
          data.drogas = res.drogasNadaAnexo7c_chkdnada
            ? "NADA"
            : res.drogasPocoAnexo7c_chkdpoco
              ? "POCO"
              : res.drogasHabitualAnexo7c_chkdhabitual
                ? "HABITUAL"
                : res.drogasExcesivoAnexo7c_chkdexcesivo
                  ? "EXCESIVO"
                  : "";

          // Work history and medical history
          data.puestoActual = res.puestoActualAnexo7c_txtpuestoactual ?? "";
          data.tiempoPuesto = res.tiempoAnexo7c_txttiempo ?? "";
          data.antecedentesPersonales =
            res.antecedentesPersonalesAnexo7c_txtantecedentespersonales ?? "";
          data.antecedentesPersonales2 =
            res.antecedentesPersonales2Anexo7c_txtantecedentespersonales2 ?? "";
          data.antecedentesFamiliares =
            res.antecedentesFamiliaresAnexo7c_txtantecedentesfamiliares ?? "";

          // Physical examination details
          data.cabeza = res.cabezaAnexo7c_txtcabeza ?? "";
          data.nariz = res.narizAnexo7c_txtnariz ?? "";
          data.cuello = res.cuelloAnexo7c_txtcuello ?? "";
          data.perimetro = res.perimetroAnexo7c_txtperimetro ?? "";
          data.bocaAmigdalasFaringeLaringe = res.baflAnexo7c_txtb_a_f_l ?? "";
          data.visionColores = res.vc_vc ?? "";
          data.enfermedadOculares =
            res.enfermedadesOcularesAnexo7c_txtenfermedadesoculares ?? "";
          data.enfermedadOtros =
            res.enfermedadesOculares2Anexo7c_txtenfermedadesoculares2 ?? "";
          data.reflejosPupilares =
            res.reflejosPupilaresAnexo7c_txtreflejospupilares ?? "";
          data.visionBinocular = res.binocularAnexo7c_txtbinocular ?? "";
          data.otoscopiaOd = res.odAnexo7c_txtod ?? "";
          data.otoscopiaOi = res.oiAnexo7c_txtoi ?? "";
          data.torax = res.toraxAnexo7c_txttorax ?? "";
          data.corazon = res.corazonAnexo7c_txtcorazon ?? "";
          data.pulmones = res.pulmonesNormalAnexo7c_rbnormal ? "NORMAL" : "ANORMAL";
          data.pulmonesObservaciones =
            res.pulmonesDescripcionAnexo7c_txtpulmones ?? "";
          data.miembrosSuperiores =
            res.miembrosSuperioresAnexo7c_txtmiembrossuperiores ?? "";
          data.miembrosInferiores =
            res.miembrosInferioresAnexo7c_txtmiembrosinferiores ?? "";
          data.reflejosOsteotendinosos =
            res.reflejosOsteotendinososAnexo7c_txtreflejososteotendinosos ?? "";
          data.marcha = res.marchaAnexo7c_txtmarcha ?? "";

          data.columnaVertebral =
            res.columnaVertebralAnexo7c_txtcolumnavertebral ?? "";
          data.abdomen = res.abdomenAnexo7c_txtabdomen ?? "";
          data.anillosInguinales =
            res.anillosInguinalesAnexo7c_txtanillosinguinales ?? "";
          data.organosGenitales =
            res.organosGenitalesAnexo7c_txtorganosgenitales ?? "";

          data.user_medicoFirma = res.usuarioFirma;

          // Tacto rectal examination
          data.tactoRectal = res.tactoRectalNoHizoAnexo7c_rbtnohizo
            ? "NO_SE_HIZO"
            : res.tactoRectalNormalAnexo7c_rbtnormal
              ? "NORMAL"
              : res.tactoRectalAnormalAnexo7c_rbtanormal
                ? "ANORMAL"
                : "";
          // Additional physical findings
          data.hernias = res.herniasAnexo7c_txthernias ?? "";
          data.varices = res.varicesAnexo7c_txtvarices ?? "";
          data.ganglios = res.gangliosAnexo7c_txtganglios ?? "";
          data.evaluacionCognitiva = res.lenguageAnexo7c_txtlenguage ?? "";

          // Medical conclusions and observations
          //data.observacionesGenerales2 +=
          //res.observacionesFichaMedicaAnexo7c_txtobservacionesfm ?? "";
          data.conclusionRespiratoria =
            res.interpretacionFuncionRespiratoria_interpretacion ?? "";

          // Vaccinations
          data.tetano = res.tetanica ?? false;
          data.hepatitisB = res.hepatitisb ?? false;
          data.fiebreAmarilla =
            res.fiebreAmarilla ?? false;

          // Additional observations and conclusions
          data.observacionesAudio =
            res.diagnosticoAudioAnexo7c_txtdiagnosticoaudio ?? "";
          data.conclusionMedico =
            res.conclusionMedicoAnexo7c_txtconclusionmed ?? "";
          data.estadoMental = res.estadoMentalAnexo7c_txtestadomental ?? "";
          data.anamnesis = res.anamnesisAnexo7c_txtanamnesis ?? "";

          //Riesgo cardiovascular
          data.riesgo_coronario_valor = res.riesgo_coronario_valor ?? "";


          // Additional risk factors
          data.alturaEstruct =
            res.alturaEstructuraAnexo7c_altura_estructura ?? false;
          data.alturaGeograf = res.alturaGeograficaAnexo7c_altura_geog ?? false;
          data.quimicos = res.quimicosAnexo7c_quimicos ?? false;
          data.electricos = res.electricosAnexo7c_electricos ?? false;
          data.vibraciones = res.vibracionesAnexo7c_vibraciones ?? false;

          data.notasDoctor = res.notasDoctor ?? "";
          data.resultadoGonadotropina = res.resultadoGonadotropina;

          ({ observaciones: data.observacionesGenerales2 } = validarInterpretacionEspirometriaAnexo16(
            res.interpretacionFuncionRespiratoria_interpretacion,
            valoresCie10.espirometriaInterpretacionCie10,
            data.observacionesGenerales2
          ));

          const rayosXConclusion = res.conclusionesRadiograficasTorax_txtconclusionesradiograficas;
          const rayosXObservaciones = res.observacionesRadiografiaTorax_txtobservacionesrt;

          ({ observaciones: data.observacionesGenerales2 } = validarRayosXToraxAnexo16(
            rayosXConclusion,
            rayosXObservaciones,
            valoresCie10.rayosxConclusionesCie10,
            data.observacionesGenerales2
          ));

          const rayosXColumnaConclusion = res.conclusionRayosColumna;

          ({ observaciones: data.observacionesGenerales2 } = validarRadiografiaColumna(
            rayosXColumnaConclusion,
            data.observacionesGenerales2
          ));

          const musculoEsqueleticoAnexo2 = resSimple.musculoEsqueleticoAnexo ?? {};
          const musculoDiagnostico2 = musculoEsqueleticoAnexo2.musculoesqueleticoDiagnostico;
          const musculoConclusiones2 = musculoEsqueleticoAnexo2.musculoEsqueleticoBorooConclusiones;

          ({ observaciones: data.observacionesGenerales2 } = validarMusculoesqueleticoAnexo16(
            musculoDiagnostico2,
            musculoConclusiones2,
            valoresCie10.musculoEsqueleticoDiagnosticoCie10,
            data.observacionesGenerales2
          ));

          // if (res.observacionFichaConduccion != null) {
          //   data.observacionesGenerales += "FICHA CONDUCCION: " + res.observacionFichaConduccion + "\n";
          // }

          const hallazgoEKG = resSimple.hallazgosInformeElectroCardiograma_hallazgo;
          const conclusionesEkg = resSimple.conclusionEkg;
          const recomendacionesEKG = resSimple.recomendacionesInformeElectroCardiograma_recomendaciones ?? "";

          ({ observaciones: data.observacionesGenerales2 } = validarElectrocardiogramaAnexo16(
            hallazgoEKG,
            conclusionesEkg,
            recomendacionesEKG,
            valoresCie10.ekgHallazgosCie10,
            valoresCie10.ekgConclusionesCie10,
            data.observacionesGenerales2,
            "-"
          ));

          // Información radiográfica
          ({ observaciones: data.observacionesGenerales2 } = validarInformeRadiograficoAnexo16(
            resSimple.infoGeneralRadiografia_info_general,
            valoresCie10.rayoscolumnaConclusionCie10,
            data.observacionesGenerales2,
            "-"
          ));
          // if (resSimple.conclusionRadiografia_conclu != null) {
          //   data.observacionesGenerales2 +=
          //     "-CONCLUSIONES : " + resSimple.conclusionRadiografia_conclu + "\n";
          // }

          // Radiografía de tórax
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarHallazgosRadiograficosToraxAnexo16(
            {
              vertices: resSimple.verticesRadiografiaTorax_txtvertices,
              hilos: resSimple.hiliosRadiografiaTorax_txthilios,
              senos: resSimple.senosCostoFrenicosRadiografiaTorax_txtsenoscostofrenicos,
              campos: resSimple.camposPulmonesRadiografiaTorax_txtcampospulm,
              mediastinos: resSimple.mediastinosRadiografiaTorax_txtmediastinos,
              silueta: resSimple.siluetaCardioVascularRadiografiaTorax_txtsiluetacardiovascular,
              osteoMuscular: resSimple.osteomuscularRadiografiaTorax_txtosteomuscular,
            },
            data.contador,
            data.observacionesGenerales2
          ));

          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarObservacionesRadiografiaToraxAnexo16(
            resSimple.observacionesRadiografiaTorax_txtobservacionesrt,
            data.contador,
            data.observacionesGenerales2
          ));
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarLabClinicoAnexo16(
            resSimple.observacionesLaboratorioClinico_txtobservacioneslb,
            valoresCie10.hematologiaObservacionesCie10,
            data.contador,
            data.observacionesGenerales2
          ));

          if (resSimple.observacionesAlturaCertificado_alturabarrick != null) {
            ({ observaciones: data.observacionesGenerales2, contador: data.contador } = agregarObservacionNumerada(
              resSimple.observacionesAlturaCertificado_alturabarrick,
              data.contador,
              data.observacionesGenerales2
            ));
          } else if (resSimple.observacionesAlturaCertificacion_certialtura != null) {
            ({ observaciones: data.observacionesGenerales2, contador: data.contador } = agregarObservacionNumerada(
              resSimple.observacionesAlturaCertificacion_certialtura,
              data.contador,
              data.observacionesGenerales2
            ));
          }
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = agregarObservacionNumerada(
            resSimple.observacionesConduccionCertificado_conduccion,
            data.contador,
            data.observacionesGenerales2
          ));

          ({
            observaciones: data.observacionesGenerales2,
            contador: data.contador,
            cocaina: data.cocaina,
            cocainaRed: data.cocainaRed,
          } = validarCocainaAnexo16(coca, data.contador, data.observacionesGenerales2));

          ({
            observaciones: data.observacionesGenerales2,
            contador: data.contador,
            marihuana: data.marihuana,
            marihuanaRed: data.marihuanaRed,
          } = validarMarihuanaAnexo16(marig, data.contador, data.observacionesGenerales2));

          data.piezasMalEstado =
            resSimple.piezasMalEstadoOdontograma_txtpiezasmalestado ?? "";
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarCariesDentalAnexo16(
            data.piezasMalEstado,
            data.contador,
            data.observacionesGenerales2
          ));
          // IMC
          data.imc = resSimple.imcTriaje_imc ?? "";
          if (
            resSimple.ordenAlturaCertificado_ordenaltura == null &&
            resSimple.ordenConduccionCertificado_ordencond == null &&
            resSimple.numeroAlturaCertificacion_numalt == null
          ) {
            ({
              observaciones: data.observacionesGenerales2,
              contador: data.contador,
              imcRed: data.imcRed,
            } = validarImcAnexo16(data.imc, data.contador, data.observacionesGenerales2));
          }
          // if (
          //   data.enfermedadOculares !== "NINGUNA" &&
          //   data.enfermedadOculares !== ""
          // ) {
          //   data.observacionesGenerales2 +=
          //     data.contador + "." + data.enfermedadOculares + "\n";
          //   data.contador++;
          // }

          data.enfermedadOculares = res.enfermedadesOcularesOftalmo_e_oculares ?? "NINGUNA";
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarOftalmologiaAnexo16(
            data.enfermedadOculares,
            res.enfermedadesOcularesOtrosOftalmo_e_oculares1,
            valoresCie10.oftalmologiaEnfOcularesCie10,
            valoresCie10.oftalmologiaPresenciaPterigionCie10,
            data.contador,
            data.observacionesGenerales2
          ));

          // if (data.enfermedadOtros === "PTERIGION BILATERAL") {
          //   data.observacionesGenerales2 +=
          //     data.contador +
          //     "." +
          //     " PTERIGION BILATERAL:EVALUACION POR OFTALMOLOGIA.\n";
          //   data.contador++;
          // } else if (
          //   data.enfermedadOtros !== "NINGUNA" &&
          //   data.enfermedadOtros !== ""
          // ) {
          //   data.observacionesGenerales2 +=
          //     data.contador +
          //     "." +
          //     data.enfermedadOtros +
          //     ":EVALUACION POR OFTALMOLOGIA.\n";
          //   data.contador++;
          // }

          // Odontograma observaciones
          ({
            observaciones: data.observacionesGenerales2,
            contador: data.contador,
            dentaduraObservaciones: data.dentaduraObservaciones,
          } = validarOdontogramaAnexo16(
            resSimple.observacionesOdontograma_txtobservaciones,
            valoresCie10.odontologiaObservacionesCie10,
            data.contador,
            data.observacionesGenerales2
          ));
          const interpretacionEspirometria =
            resSimple.interpretacionFuncionRespiratoria_interpretacion ?? "";
          // Espirometría
          ({
            observaciones: data.observacionesGenerales2,
            contador: data.contador,
            conclusionRespiratoria: data.conclusionRespiratoria,
          } = validarEspirometriaAnexo16(data.fvc, data.fev1Fvc, interpretacionEspirometria, data.contador, data.observacionesGenerales2));
          // Visión de colores
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarVisionColoresAnexo16(
            data.visionColores,
            data.contador,
            data.observacionesGenerales2
          ));
          const sistolica = resSimple.sistolicaTriaje_sistolica ?? "";
          const diastolica = resSimple.diastolicaTriaje_diastolica ?? "";
          // Presión arterial
          ({ observaciones: data.observacionesGenerales2, contador: data.contador } = validarPresionArterialAnexo16(
            sistolica,
            diastolica,
            data.contador,
            data.observacionesGenerales2
          ));
          const sexo = resSimple.sexo_sexo_pa; // "M" o "F"
          const esMujer = sexo === "F";
          // Convertimos a número
          {
            const resultadoHemoglobina = validarHemoglobinaConTextoAnexo16(hemo, sexo, data.contador, data.observacionesGenerales2);
            data.observacionesGenerales2 = resultadoHemoglobina.observaciones;
            data.hemoglobinaRed = resultadoHemoglobina.hemoglobinaRed;
            data.contador = resultadoHemoglobina.contador;
          }

          ({ observaciones: data.observacionesGenerales2 } = validarCreatininaSericaAnexo16(
            resSimple.creatininaPerfilRenal,
            data.observacionesGenerales2
          ));
          ({ observaciones: data.observacionesGenerales2 } = validarUreaSericaAnexo16(
            resSimple.ureaSericaPerfilRenal,
            data.observacionesGenerales2
          ));
          ({ observaciones: data.observacionesGenerales2 } = validarAcidoUricoSericoAnexo16(
            resSimple.acidoUricoSericoPerfilRenal,
            esMujer,
            data.observacionesGenerales2
          ));

          ({ observaciones: data.observacionesGenerales2 } = validarGonadotropinaAnexo16(
            esMujer,
            resSimple.resultadoGonadotropina,
            data.observacionesGenerales2
          ));

          ({ observaciones: data.observacionesGenerales2 } = validarRiesgoCardiovascularFramingham(
            data.empresa,
            data.edad,
            data.nomExamen,
            data.riesgo_coronario_valor,
            data.observacionesGenerales2
          ));

          data = MapearDatosAdicionales(res, data, 1, true);
          data.observacionesGenerales2Cie10 = limpiarObservaciones(data.observacionesGenerales2Cie10);

          console.log("DATA EDITAR TEST", data);
          set((prev) => ({ ...prev, ...res, ...data, visionColores: resSimple.vc_vc ?? "", reflejosPupilares: resSimple.rp_rp ?? "", }));
        }
      } else {
        Swal.fire("Error", "Ocurrio un error al traer los datos", "error");
      }
    })
    .finally(() => {
      onFinish();
    });
};

export const handleSubirArchivo = async (form, selectedSede, userlogued, token) => {
  handleSubirArchivoDefaultSinSellos(form, selectedSede, registrarPDF, userlogued, token)
};
export const ReadArchivosForm = async (form, setVisualerOpen, token) => {
  ReadArchivosFormDefault(form, setVisualerOpen, token)
}

export const handleSubirArchivoMasivo = async (form, selectedSede, userlogued, token) => {
  handleSubidaMasiva(form, selectedSede, registrarPDF, userlogued, token)
}