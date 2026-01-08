import Swal from "sweetalert2";
import { LoadingDefault, VerifyTRDefault } from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { getToday, getTodayPlusOneYear } from "../../../../utils/helpers";
import { getFetch, SubmitData } from "../../../../utils/apiHelpers";

const obtenerReporteUrl =
  "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo";
const registrarUrl =
  "/api/v01/ct/anexos/anexo2/registrarActualizarAnexoAgroindustrial";
const obtenerExamenesRealizadosUrl =
  "/api/v01/ct/anexos/anexo2/obtenerExamenesRealizados";

export const SubmitDataService = async (
  form,
  setForm,
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
  Loading("Registrando Datos");
  const body = {
    codigoAnexo: form.codigoAnexo,
    norden: form.norden,
    fecha: form.fechaExam,
    //Ant. Personales
    neoplasia: form.neoplasia,
    neoplasiaDescripcion: form.neoplasiaDescripcion,
    its: form.its,
    itsDescripcion: form.itsDescripcion,
    quemaduras: form.quemaduras,
    quemadurasDescripcion: form.quemadurasDescripcion,
    cirugias: form.cirugias,
    cirugiasDescripcion: form.cirugiasDescripcion,
    antecedentesPersonalesOtros: form.otrosAntecedentes,
    antecedentesPersonalesOtrosDescripcion: form.otrosAntecedentesDescripcion,

    //Residencia en el lugar de trabajo
    residenciaSi: form.reside,
    residenciaNo: !form.reside,
    residenciaTiempo: form.tiempoReside,
    essalud: form.essalud,
    eps: form.eps,
    residenciaTrabajoOtros: form.otrosResidencia,
    sctr: form.sctr,
    sctrOtros: form.otrosResidencia1,

    //Antecedentes Familiares
    padre: form.antecendentesPadre,
    madre: form.antecendentesMadre,
    hermanos: form.antecendentesHermano,
    esposa: form.antecendentesEsposao,

    //Detalles del Puesto
    puestoActual: form.puestoActual,
    tiempo: form.tiempoPuesto,

    //Medicamentos
    medicamentosSi: form.tomaMedicamento,
    medicamentosNo: !form.tomaMedicamento,
    tipoMedicamento: form.tipoMedicamentos,
    frecuenciaMedicamentos: form.frecuenciaMedicamentos,

    //Número de Hijos
    hijosVivos: form.hijosVivos,
    hijosMuertos: form.hijosMuertos,
    totalHijos: form.totalHijos,
    numeroDependientes: form.hijosDependientes,

    cabeza: form.cabeza,
    nariz: form.nariz,
    cuello: form.cuello,
    perimetro: form.perimetro,
    boca: form.boca,
    oidos: form.oidos,
    faringe: form.faringe,
    visionColores: form.visionColores,
    enfermedadesOculares: form.enfermedadOculares,
    reflejosPupilares: form.reflejosPupilares,
    visionBinocular: form.visionBinocular,
    miembrosSuperiores: form.miembrosSuperiores,
    miembrosInferiores: form.miembrosInferiores,
    ectoscopia: form.ectoscopia,
    estadoMental: form.estadoMental,
    anamnesis: form.anamnesis,
    marcha: form.marcha,
    columnaVertebral: form.columnaVertebral,
    aparatoRespiratorio: form.aparatoRespiratorio,
    aparatoCardiovascular: form.apaCardiovascular,
    aparatoDigestivo: form.aparatoDigestivo,
    aparatoGeiotourinario: form.aGenitourinario,
    aparatoLocomotor: form.aparatoLocomotor,
    sistemaLinfatico: form.sistemaLinfatico,
    piel: form.piel,
    observacionesFichaMedica: form.observacionesGenerales,
    conclusion: form.conclusionRespiratoria,
    edad: form.edad + " años",
    enfermedadesOcularesOtros: form.enfermedadOtros,
    sistemaNervioso: form.sistemaNervioso,
    otrosExamenes: form.otrosExamenes,
    restricciones: form.restricciones,

    esApto: form.aptitud == "APTO",
    noEsApto: form.aptitud == "NO APTO",
    aptoRestriccion: form.aptitud == "RESTRICCION",
    fechaDesde: form.fechaAptitud,
    fechaVence: form.fechaVencimiento,
    medico: form.nombre_medico,
    usuarioFirma: form.user_medicoFirma,
    userRegistro: user,
    accidentes: form.dataEnfermedades.map((item) => ({
      ...item,
      codigoAnexo: null,
      fecha: null,
      userRegistro: user,
    })),
  };
  console.log(body);

  SubmitData(body, registrarUrl, token).then((res) => {
    console.log(res);
    if (res.id === 1 || res.id === 0) {
      Swal.fire({
        title: "Exito",
        text: `${res.mensaje},\n¿Desea imprimir?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        const nordenNuevo = form.norden;
        limpiar();
        GetExamenesRealizados(nordenNuevo, setForm, token, () => { Swal.close() });
        if (result.isConfirmed) {
          PrintHojaR(form.norden, token, tabla, datosFooter);
        }
      });
    } else {
      Swal.fire("Error", "Ocurrio un error al Registrar", "error");
    }
  });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token
  ).then(async (res) => {
    if (res.norden_n_orden) {
      // const nombre = res.nameJasper;
      const nombre = "Anexo2";
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../jaspers/Anexo2/*.jsx"
      );
      const modulo = await jasperModules[
        `../../../../jaspers/Anexo2/${nombre}.jsx`
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


export const VerifyTR = async (nro, tabla, token, set, sede) => {
  VerifyTRDefault(
    nro,
    tabla,
    token,
    set,
    sede,
    () => {
      //NO Tiene registro
      ValidarExamenesRealizados(nro, token, () => { //en caso pase se ejectua esto 
        GetInfoServicio(nro, tabla, set, token, () => {
          Swal.close();
        });
      });
    },
    () => {
      //Tiene registro
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Anexo 2.",
          "warning"
        );
      });
    }
  );
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const GetExamenesRealizados = (
  nro,
  set,
  token,
  onFinish = () => { }
) => {
  LoadingDefault("Obteniendo Exámenes Realizados");
  getFetch(
    `${obtenerExamenesRealizadosUrl}?nOrden=${nro}`,
    token
  )
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
          fichaAntPatologicos: res.fichaAntecedentesPatologicos ? "PASADO" : "POR PASAR",
          cuestionarioNordico: res.cuestionarioNordico ? "PASADO" : "POR PASAR",
          certTrabajoAltura: res.certificadoTrabajoAltura ? "PASADO" : "POR PASAR",
          detencionSAS: res.detencionSAS ? "PASADO" : "POR PASAR",
          consentimientoDosaje: res.consentimientoDosaje ? "PASADO" : "POR PASAR",
          exRxSanguineos: res.examenRadiografiaSanguineos ? "PASADO" : "POR PASAR",
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


export const ValidarExamenesRealizados = (
  nro,
  token,
  onComplete = () => { }
) => {
  getFetch(
    `${obtenerExamenesRealizadosUrl}?nOrden=${nro}`,
    token
  )
    .then((res) => {
      if (res) {
        console.log(res);

        const examenes = {
          'Ficha Antecedentes Patológicos': res.fichaAntecedentesPatologicos,
          'Triaje': res.triaje,
          'Oftalmología': res.oftalmologia,
          'Espirometría': res.espirometria,
          'Radiografía de Tórax': res.radiografiaTorax,
          'Laboratorio Clínico': res.laboratorioClinico,
          'Odontograma': res.odontograma,
          'Ficha Audiológica': res.audiometriaPo
        };

        const examenesFaltantes = Object.keys(examenes).filter(examen => !examenes[examen]);

        if (examenesFaltantes.length === 0) {
          onComplete();
        } else {
          const listaFaltantes = examenesFaltantes.map(examen => `• ${examen}`).join('<br>');
          Swal.fire({
            title: "Alerta",
            html: `<div style="text-align: center;">El paciente no ha realizado los siguientes exámenes:<br><br></div><div style="text-align: left;margin-left:5px">${listaFaltantes}</div>`,
            icon: "warning"
          });
        }
      } else {
        console.log("No se encontraron datos de exámenes realizados");
      }
    })
    .catch((error) => {
      console.error("Error al obtener exámenes realizados:", error);
    });
};

export const GetInfoServicio = (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
) => {
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=false`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            puestoActual: res.puestoActual_txtpuestoactual ?? "N/A",
            tiempoPuesto: res.tiempo_txttiempo ?? "N/A",
            observacionesGenerales: "", //txtObservacionesFichaMedica
            otrosExamenes: "", //txtOtrosEx
            conclusionRespiratoria: "", //txtconclusion
          };

          if (res.interpretacion_interpretacion != null) {
            data.observacionesGenerales += "ESPIROMETRIA: " + res.interpretacion_interpretacion + "\n";
          }

          if (res.conclusionRadiografia_conclu != null) {
            data.observacionesGenerales += "RAYOS X: " + res.conclusionRadiografia_conclu + "\n";
          }

          if (res.conclusionMusculoesqueletica != null) {
            data.observacionesGenerales += "MUSCULOESQUELETICA: " + res.conclusionMusculoesqueletica + "\n";
          }

          if (res.observacionesConduccionCertificado_conduccion != null) {
            data.observacionesGenerales += "FICHA CONDUCCION: " + res.observacionesConduccionCertificado_conduccion + "\n";
          }

          if (res.informacionesGeneralRadiografia_info_general != null) {
            data.observacionesGenerales += `INFORME RADIOGRAFICO : ${res.informacionesGeneralRadiografia_info_general}\n`;
          }
          if (res.conclusionesRadiografia_conclu != null) {
            data.observacionesGenerales += `CONCLUCIONES : ${res.conclusionesRadiografia_conclu}\n`;
          }
          if (
            res.observacionesOdonto_txtobservaciones != null &&
            res.observacionesOdonto_txtobservaciones != "NINGUNA"
          )
            data.observacionesGenerales += `ODONTOGRAMA : ${res.observacionesOdonto_txtobservaciones}\n`;

          //------radio
          if (
            res.verticesRadiografiaTorax_txtvertices != null &&
            res.verticesRadiografiaTorax_txtvertices != "NO SE TOMÓ RX DE TORAX"
          ) {
            if (
              res.verticesRadiografiaTorax_txtvertices != null &&
              res.verticesRadiografiaTorax_txtvertices != "LIBRES"
            ) {
              data.observacionesGenerales +=
                res.verticesRadiografiaTorax_txtvertices;
            }
            if (
              res.hilosRadiografiaTorax_txthilios != null &&
              res.hilosRadiografiaTorax_txthilios != "NORMALES"
            ) {
              data.observacionesGenerales +=
                res.hilosRadiografiaTorax_txthilios;
            }
            if (
              res.senosCostoFrenicos_txtsenoscostofrenicos != null &&
              res.senosCostoFrenicos_txtsenoscostofrenicos != "LIBRES"
            ) {
              data.observacionesGenerales +=
                res.senosCostoFrenicos_txtsenoscostofrenicos;
            }
            if (
              res.camposPulmones_txtcampospulm != null &&
              res.camposPulmones_txtcampospulm != "NORMALES"
            ) {
              data.observacionesGenerales += res.camposPulmones_txtcampospulm;
            }
            if (
              res.meadiastinos_txtmediastinos != null &&
              res.meadiastinos_txtmediastinos != "NORMALES"
            ) {
              data.observacionesGenerales += res.meadiastinos_txtmediastinos;
            }
            if (
              res.siluetaCardioVascular_txtsiluetacardiovascular != null &&
              res.siluetaCardioVascular_txtsiluetacardiovascular != "NORMAL"
            ) {
              data.observacionesGenerales +=
                res.siluetaCardioVascular_txtsiluetacardiovascular;
            }
            if (
              res.osteoMuscular_txtosteomuscular != null &&
              res.osteoMuscular_txtosteomuscular != "NORMAL"
            ) {
              data.observacionesGenerales += res.osteoMuscular_txtosteomuscular;
            }
            if (
              res.conclusionesRadiograficas_txtconclusionesradiograficas !=
              null &&
              res.conclusionesRadiograficas_txtconclusionesradiograficas !=
              "NORMAL"
            ) {
              data.observacionesGenerales +=
                res.conclusionesRadiograficas_txtconclusionesradiograficas;
            }
          }
          if (
            res.observacionesRadiografiaTorax_txtobservacionesrt != null &&
            res.observacionesRadiografiaTorax_txtobservacionesrt != "NORMAL"
          ) {
            data.observacionesGenerales += `RADIOGRAFIA: ${res.observacionesRadiografiaTorax_txtobservacionesrt}\n`;
          }
          if (res.observacionesLabClinico_txtobservacioneslb != null) {
            data.observacionesGenerales += `LAB CLINICO: ${res.observacionesLabClinico_txtobservacioneslb}\n`;
          }
          const coca = res.cocaina_txtcocaina;
          const marig = res.marihuana_txtmarihuana;
          //==============================
          if (coca == "REACTIVO") {
            data.observacionesGenerales += `TEST DE COCAINA: COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n`;
            data.cocainaRed = true;
            data.cocaina = "REACTIVO";
          } else {
            data.cocaina = coca;
          }
          if (marig == "REACTIVO") {
            data.observacionesGenerales += `MARIHUANA: COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n`;
            data.marihuanaRed = true;
            data.marihuana = "REACTIVO";
          } else {
            data.marihuana = marig;
            data.marihuanaRed = false;
          }
          //===============================
          const vsg = res.vsg_txtvsg;
          const gluc = res.glucosa_txtglucosabio;
          const creat = res.creatina_txtcreatininabio;
          const hemo = res.hemoglobina_txthemoglobina;

          data.hemoglobinaHematocrito = hemo;
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

          data.otrosExamenes += "HEMOGRAMA: " + (vsg != null && hemo != null ? "NORMAL" : "N/A") + "\n";

          const rh =
            res.grupoSanguineoRhPositivo_rbrhpositivo
              ? "+"
              : res.grupoSanguineoRhNegativo_rbrhnegativo
                ? "-"
                : "";
          const textoGrupo =
            data.grupoSanguineo || rh
              ? `${data.grupoSanguineo || ""}${rh}`
              : "N/A";
          data.otrosExamenes += `GRUPO SANGUINEO: ${textoGrupo}\n`;

          data.otrosExamenes +=
            gluc == null ? "" : "GLUCOSA: " + gluc + " mg/dl.\n";
          data.otrosExamenes +=
            creat == null ? "" : "CREATININA: " + creat + " mg/dl.\n";
          data.otrosExamenes += vsg == null ? "" : "VSG: " + vsg + ". \n";
          data.otrosExamenes += "EX ORINA: NORMAL. \n";
          data.otrosExamenes += coca == null ? "" : "COCAINA: " + coca + ". \n";
          data.otrosExamenes +=
            marig == null ? "" : "MARIHUANA: " + marig + ". \n";
          const sexo = res.sexo_sexo_pa;
          //===============================
          if (hemo != "N/A" && hemo != "") {
            const hemoglobina = parseFloat(hemo);
            if (sexo == "M") {
              if (hemoglobina < 14 || hemoglobina > 20) {
                data.hemoglobinaRed = true;
              } else {
                data.hemoglobinaRed = false;
              }
            }
            if (sexo == "F") {
              if (hemoglobina < 13.5 || hemoglobina > 20) {
                data.hemoglobinaRed = true;
              } else {
                data.hemoglobinaRed = false;
              }
            }
          }

          data.vsg = vsg;
          data.glucosa = gluc;
          data.creatinina = creat;
          if (gluc != "" && gluc != "N/A") {
            const glucosa = parseFloat(gluc);
            if (glucosa >= 110 || glucosa < 70) {
              data.glucosaRed = true;
            } else {
              data.glucosaRed = false;
            }
          }
          if (creat != "" && creat != "N/A") {
            const cretinina = parseFloat(creat);
            if (cretinina >= 1.4 || cretinina < 0.8) {
              data.creatininaRed = true;
            } else {
              data.creatininaRed = false;
            }
          }
          //==========================
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = formatearFechaCorta(
            res.fechaNacimientoPaciente_fecha_nacimiento_pa
          );
          data.sexo = res.sexo_sexo_pa ?? "";
          data.lugarNac = res.lugarNacPaciente_lugar_nac_pa ?? "";
          data.domicilio = res.direccionPaciente_direccion_pa ?? "";
          data.telefono = res.telefonoCasaPaciente_tel_casa_pa ?? "";
          data.estadoCivil = res.estadoCivilPaciente_estado_civil_pa ?? "";
          data.gradoInstruccion = res.nivelEstudiosPaciente_nivel_est_pa ?? "";
          data.empresa = res.empresa_razon_empresa ?? "";
          data.contrata = res.contrata_razon_contrata ?? "";
          data.edad = (res.edad_fecha_nacimiento_pa ?? "") + " años";
          data.explotacion = res.explotacion_nom_ex ?? "";
          data.alturaLaboral = res.altura_altura_po ?? "";
          data.mineralExp = res.mineral_mineral_po ?? "";
          data.puestoPostula = res.cargo_cargo_de ?? "";
          if (res.nombreExamen_nom_examen == "ANUAL") {
            data.puestoActual = res.cargo_cargo_de ?? "";
          }
          data.areaPuesto = res.area_area_o ?? "";
          data.grupoSanguineoPrevio =
            res.grupoSanguineoPrevio_grupofactorsan ?? "";

          data.fvc = res.fvc_fvc ?? "";
          if (data.fvc != "" && data.fvc != "N/A") {
            const fvc = parseFloat(data.fvc);
            if (fvc >= 80) {
              data.conclusionRespiratoria += "NORMAL";
            } else {
              data.conclusionRespiratoria += "PATRON RESTRICTIVO" + "\n";
              data.observacionesGenerales +=
                "PATRON RESTRICTIVO LEVE.EVALUACION EN 6 MESES." + "\n";
            }
          }
          //==========================================
          data.fev1 = res.fev1_fev1 ?? "";
          data.fev1Fvc = res.fev1fvc_fev1fvc ?? "";
          if (data.fvc != "" && data.fvc == "N/A") {
            data.observacionesGenerales +=
              "NO PASO EXAMEN DE ESPIROMETRIA" + "\n";
          } else {
            if (data.fev1Fvc != "" && data.fvc != "N/A") {
              const fev1fvc = parseFloat(data.fev1Fvc);
              if (fev1fvc >= 70.0) {
                if (
                  data.conclusionRespiratoria != "NORMAL" &&
                  data.conclusionRespiratoria != "-NORMAL"
                )
                  data.conclusionRespiratoria += "NORMAL" + "\n";
              } else {
                data.conclusionRespiratoria += "PATRON OBSTRUCTIVO" + "\n";
                data.observacionesGenerales +=
                  "PATRON OBSTRUCTIVO LEVE.EVALUACION EN 6 MESES." + "\n";
              }
            }
          }
          data.fef2575 = res.fef2575_fef25_75 ?? "";
          data.piezasMalEstado = res.piezasMalEstado_txtpiezasmalestado ?? "";
          if (data.piezasMalEstado !== "") {
            const malEstado = parseFloat(data.piezasMalEstado);
            if (malEstado >= 1) {
              data.observacionesGenerales +=
                "CARIES DENTAL.TTO.EVALUACION EN 6 MESES.\n";
            }
          }
          data.piezasFaltan = res.ausentes_txtausentes ?? "";
          // Hijos
          data.hijosVivos =
            res.hijosVivosAnexo2_txthijosvivos || "0";
          data.hijosMuertos =
            res.hijosMuertosAnexo2_txthijosmuertos ||
            "0";

          if (data.hijosVivos && data.hijosMuertos) {
            const hv = parseInt(data.hijosVivos) || 0;
            const hm = parseInt(data.hijosMuertos) || 0;
            data.totalHijos = (hv + hm).toString();
          }

          // IMC
          data.imc = res.imc_imc ?? "";
          if (data.imc && data.imc !== "") {
            const imc = parseFloat(data.imc);
            data.imcRed = false;
            if (imc >= 25 && imc < 30) {
              data.imcRed = true;
              data.observacionesGenerales +=
                "SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS.\n";
            } else if (imc >= 30 && imc < 35) {
              data.imcRed = true;
              data.observacionesGenerales +=
                "OBESIDAD I.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS\n";
            } else if (imc >= 35 && imc < 40) {
              data.imcRed = true;
              data.observacionesGenerales +=
                "OBESIDAD II.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS\n";
            }
            else if (imc >= 40) {
              data.imcRed = true;
              data.observacionesGenerales +=
                "OBESIDAD III.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS\n";
            }
          }

          // Medidas Generales
          data.talla = res.talla_talla ?? "";
          data.peso = res.peso_peso ?? "";
          data.perimetro = res.perimetroCuello_perimetro_cuello ?? "";
          data.temperatura = res.temperatura_temperatura ?? "";
          data.cintura = res.cintura_cintura ?? "";
          data.cadera = res.cadera_cadera ?? "";
          data.icc = res.icc_icc ?? "";
          data.frecuenciaRespiratoria = res.frespiratoria_f_respiratoria ?? "";
          data.frecuenciaCardiaca = res.fcardiaca_f_cardiaca ?? "";
          data.saturacionO2 = res.sat02_sat_02 ?? "";
          data.presionSistolica = res.sistolica_sistolica ?? "";
          data.presionDiastolica = res.diastolica_diastolica ?? "";

          // Grupo Sanguíneo Laboratorio
          data.grupoSanguineoGrupo =
            res.grupoFactorNuevo_grupo_factor_nuevo ?? "";
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
          data.visionColores = res.visionColores_v_colores ?? "";
          data.visionBinocular = res.visionBinocular_v_binocular ?? "";
          data.enfermedadOculares =
            res.enfermedadesOcularesOftalmo_e_oculares ?? "NINGUNA";
          data.reflejosPupilares = res.reflejosPupilares_r_pupilares ?? "";
          data.enfermedadOtros =
            res.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "NINGUNA";

          if (data.visionCercaOd !== "") {
            if (
              data.enfermedadOculares != "" &&
              data.enfermedadOculares !== "NINGUNA"
            ) {
              data.observacionesGenerales += `${data.enfermedadOculares}\n`;
            }
          }
          if (data.enfermedadOtros === "PTERIGION BILATERAL") {
            data.observacionesGenerales +=
              "PTERIGION BILATERAL:EVALUACION X OFTALMOLOGIA.\n";
          } else if (
            data.enfermedadOtros &&
            data.enfermedadOtros !== "NINGUNA"
          ) {
            data.observacionesGenerales += `${data.enfermedadOtros}:EVALUACION X OFTALMOLOGIA.\n`;
          }

          if (
            data.visionColores !== "NINGUNA" &&
            data.visionColores !== "NORMAL"
          ) {
            data.observacionesGenerales += `${data.visionColores}\n`;
          }
          // //************************************************************
          data.od500 = res.oidoDerecho500_o_d_500 ?? "";
          data.od1000 = res.oidoDerecho1000_o_d_1000 ?? "";
          data.od2000 = res.oidoDerecho2000_o_d_2000 ?? "";
          data.od3000 = res.oidoDerecho3000_o_d_3000 ?? "";
          data.od4000 = res.oidoDerecho4000_o_d_4000 ?? "";
          data.od6000 = res.oidoDerecho6000_o_d_6000 ?? "";
          data.od8000 = res.oidoDerecho8000_o_d_8000 ?? "";
          data.oi500 = res.oidoIzquierdo500_o_i_500 ?? "";
          data.oi1000 = res.oidoIzquierdo1000_o_i_1000 ?? "";
          data.oi2000 = res.oidoIzquierdo2000_o_i_2000 ?? "";
          data.oi3000 = res.oidoIzquierdo3000_o_i_3000 ?? "";
          data.oi4000 = res.oidoIzquierdo4000_o_i_4000 ?? "";
          data.oi6000 = res.oidoIzquierdo6000_o_i_6000 ?? "";
          data.oi8000 = res.oidoIzquierdo8000_o_i_8000 ?? "";
          const diagnosticoAudiometria =
            res.diagnosticoAudiometria_diagnostico ?? "";

          // //************************************************************
          if (
            data.od500 !== "" &&
            data.od500 !== "N/A" &&
            diagnosticoAudiometria !== "NORMAL"
          ) {
            data.observacionesGenerales += `${diagnosticoAudiometria}.USO DE EPP AUDITIVO.EVALUACION ANUAL\n`;
          } else if (data.od500 === "N/A") {
            data.observacionesGenerales += "NO PASO EXAMEN AUDIOMETRIA.\n";
          }
          const today = getToday();
          const todayPlusOneYear = getTodayPlusOneYear();
          // //************************************************************

          data.fechaExam = today;
          data.fechaAptitud = today;
          data.fechaVencimiento = todayPlusOneYear;

          // electroCardiograma();=======================
          const hallazgoECG =
            res.hallazgosInformeElectroCardiograma_hallazgo ?? "";
          const recomendacionesECG =
            res.recomendacionesInformeElectroCardiograma_recomendaciones ?? "";

          if (hallazgoECG && hallazgoECG !== "NORMAL.") {
            if (recomendacionesECG) {
              data.observacionesGenerales += `\n -ELECTROCARDIOGRAMA: ${hallazgoECG}.${recomendacionesECG}\n`;
            } else {
              data.observacionesGenerales += `\n -ELECTROCARDIOGRAMA: ${hallazgoECG}\n`;
            }
          }

          // cargarAnalisisB();=======================
          data.colesterolTotal = res.colesterol_txtcolesterol ?? "";
          data.LDLColesterol = res.ldlColesterol_txtldlcolesterol ?? "";
          data.HDLColesterol = res.hdlColesterol_txthdlcolesterol ?? "";
          data.VLDLColesterol = res.vldlColesterol_txtvldlcolesterol ?? "";
          data.trigliceridos = res.trigliseridos_txttrigliseridos ?? "";
          const ct = parseFloat(data.colesterolTotal);
          const ldl = parseFloat(data.LDLColesterol) || 0;
          const hdl = parseFloat(data.HDLColesterol) || 0;
          const vldl = parseFloat(data.VLDLColesterol) || 0;
          const trigli = parseFloat(data.trigliceridos) || 0;

          if (ct > 200) {
            data.observacionesGenerales += "HIPERCOLESTEROLEMIA.";
            data.colesterolRed = true;
          }
          if (trigli > 150) {
            data.observacionesGenerales += "- HIPERTRIGLICERIDEMIA.";
            data.trigliceridosRed = true;
          }
          if (ldl > 129) {
            data.LDLColesterolRed = true;
          }
          if (hdl < 40 || hdl > 60) {
            data.HDLColesterolRed = true;
          }
          if (vldl > 30) {
            data.VLDLColesterolRed = true;
          }
          if (
            ct > 200 ||
            trigli > 150 ||
            ldl > 129 ||
            hdl < 40 ||
            hdl > 60 ||
            vldl > 30
          ) {
            data.observacionesGenerales +=
              "DIETA HIPOCALORICA Y EJERCICIOS. \n";
          }
          //==============================

          // Validación grupo sanguíneo
          if (data.presionSistolica !== "" && data.presionDiastolica !== "") {
            const sistolica1 = parseFloat(data.presionSistolica);
            const diastolica1 = parseFloat(data.presionDiastolica);

            if (sistolica1 >= 140 || diastolica1 >= 90) {
              data.observacionesGenerales += "HTA NO CONTROLADA.\n";
            }
          }
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
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=false`,
    token
  )
    .then((res) => {
      if (res.norden_n_orden) {
        console.log(res);
        if (res) {
          let data = {
            norden: res.norden_n_orden,
            codigoAnexo: res.codigoAnexo_cod_anexo,
            observacionesGenerales: "", //txtObservacionesFichaMedica
            otrosExamenes: "", //txtOtrosEx
            conclusionRespiratoria: "", //txtconclusion

            //nuevos
            fechaExam: res.fechaAnexo_fecha,

            //Ant. Personales
            neoplasia: res.neoplasia_chkneoplasia,
            neoplasiaDescripcion: res.neoplasiaDescripcion_txtneoplasia ?? "",
            quemaduras: res.quemaduras_chkquemaduras,
            quemadurasDescripcion:
              res.quemadurasDescripcion_txtquemaduras ?? "",
            otrosAntecedentes: res.antecedentesPersonalesOtros_chkapotros,
            otrosAntecedentesDescripcion:
              res.antecedentesPersonalesOtrosDescripcion_txtotrosantecendetes ??
              "",
            its: res.its_chkits,
            itsDescripcion: res.itsDescripcion_txtits ?? "",
            cirugias: res.cirugias_chkcirugias,
            cirugiasDescripcion: res.cirugiasDescripcion_txtcirugias ?? "",

            //Residencia en el lugar de trabajo
            reside: res.residenciaSi_chkresidenciasi,
            tiempoReside: res.residenciaTiempo_txttiemporesidencia ?? "",
            essalud: res.essalud_chkessalud,
            sctr: res.sctr_chksctr,
            eps: res.eps_chkeps,
            otrosResidencia: res.residenciaTrabajoOtros_chkotros,
            otrosResidencia1: res.sctrOtros_chkotros1,

            //Antecedentes Familiares
            antecendentesPadre:
              res.padre_txtpadre ?? "",
            antecendentesMadre:
              res.madre_txtmadre ?? "",
            antecendentesHermano:
              res.hermanos_txthermanos ?? "",
            antecendentesEsposao:
              res.esposa_txtesposa ?? "",

            //Detalles del Puesto
            puestoActual: res.puestoActual_txtpuestoactual ?? "N/A",
            tiempoPuesto: res.tiempo_txttiempo ?? "N/A",

            //Medicamentos
            tomaMedicamento: res.medicamentosSi_rbsimed,
            tipoMedicamentos: res.tipoMedicamento_txttipomedicamento ?? "",
            frecuenciaMedicamentos:
              res.frecuenciaMedicamentos_txtfrecuenciamed ?? "",

            //Número de Hijos
            hijosDependientes: res.numeroDependientes_txtndependientes ?? "",
            totalHijos: res.totalHijos_txttotalhijos ?? "",

            // Examen Físico por Sistemas
            cabeza: res.cabeza_txtpelo ?? "",
            nariz: res.nariz_txtnariz ?? "",
            cuello: res.cuello_txtcuello ?? "",
            perimetro: res.perimetro_txtperimetro ?? "",
            boca: res.boca_txtboca ?? "",
            oidos: res.oidos_txtoidos ?? "",
            faringe: res.faringe_txtfaringe ?? "",

            visionColores: res.visionColores_v_colores ?? "",
            enfermedadOculares:
              res.enfermedadesOcularesOftalmo_e_oculares ?? "",
            enfermedadOtros:
              res.enfermedadesOcularesOtrosOftalmo_e_oculares1 ?? "",
            reflejosPupilares: res.reflejosPupilares_r_pupilares ?? "",
            visionBinocular: res.visionBinocular_v_binocular ?? "",

            miembrosSuperiores:
              res.miembrosSuperiores_txtmiembrossuperiores ?? "",
            miembrosInferiores:
              res.miembrosInferiores_txtmiembrosinferiores ?? "",

            // Observaciones Generales
            ectoscopia: res.ectoscopia_txtectoscopia ?? "",
            estadoMental: res.estadoMental_txtestadomental ?? "",
            anamnesis: res.anamnesis_txtanamnesis ?? "",
            marcha: res.marcha_txtmarcha ?? "",
            columnaVertebral: res.columnaVertebral_txtcolumnavertebral ?? "",
            aparatoRespiratorio:
              res.aparatoRespiratorio_txtaparatorespiratorio ?? "",
            apaCardiovascular:
              res.aparatoCardiovascular_txtaparatocardiovascular ?? "",
            aparatoDigestivo: res.aparatoDigestivo_txtaparatodigestivo ?? "",
            aGenitourinario:
              res.aparatoGeiotourinario_txtaparatogeiotourinario ?? "",
            aparatoLocomotor: res.aparatoLocomotor_txtaparatolocomotor ?? "",
            sistemaLinfatico: res.sistemaLinfatico_txtsistemalinfatico ?? "",
            sistemaNervioso: res.sistemaNervioso_sistemanervioso ?? "",
            piel: res.piel_txtpiel ?? "",
            observacionesGenerales:
              res.observacionesFichaMedica_txtobservacionesfm ?? "",
            conclusionRespiratoria: res.conclusion_txtconclusion ?? "",
            restricciones: res.restricciones_txtrestricciones ?? "",
            edad: (res.edad_fecha_nacimiento_pa ?? "") + " años",
            aptitud: res.esApto_apto_si
              ? "APTO"
              : res.noEsApto_apto_no
                ? "NO APTO"
                : res.aptoRestriccion_apto_re
                  ? "RESTRICCION"
                  : "",
            fechaAptitud: res.fechaDesde_fechadesde ?? "",
            fechaVencimiento: res.fechaHasta_fechahasta ?? "",
            // nombre_medico: res.medico_medico ?? "",
            user_medicoFirma: res.usuarioFirma,
            dataEnfermedades: res.accidentes ?? [],
          };

          if (res.interpretacion_interpretacion != null) {
            data.observacionesGenerales += "ESPIROMETRIA: " + res.interpretacion_interpretacion + "\n";
          }

          if (res.observacionesOdonto_txtobservaciones != null)
            data.observacionesGenerales += `ODONTOGRAMA : ${res.observacionesOdonto_txtobservaciones}\n`;

          if (res.observacionesRadiografiaTorax_txtobservacionesrt != null)
            data.observacionesGenerales += `RADIOGRAFIA: ${res.observacionesRadiografiaTorax_txtobservacionesrt}\n`;

          if (res.observacionesLabClinico_txtobservacioneslb != null)
            data.observacionesGenerales += `LAB CLINICO: ${res.observacionesLabClinico_txtobservacioneslb}\n`;

          const coca = res.cocaina_txtcocaina;
          const marig = res.marihuana_txtmarihuana;
          //==============================
          if (coca == "REACTIVO" || coca == "POSITIVO") {
            data.observacionesGenerales += "COCAINA:" + coca + "\n";
            data.cocainaRed = true;
            data.cocaina = coca;
          } else {
            data.cocainaRed = false;
            data.cocaina = coca;
          }
          if (marig == "REACTIVO" || marig == "POSITIVO") {
            data.observacionesGenerales += `MARIHUANA: ${marig}\n`;
            data.marihuana = marig;
            data.marihuanaRed = true;
          } else {
            data.marihuana = marig;
            data.marihuanaRed = false;
          }
          const vsg = res.vsg_txtvsg;
          const gluc = res.glucosa_txtglucosabio;
          const creat = res.creatina_txtcreatininabio;
          const hemo = res.hemoglobina_txthemoglobina;

          data.hemoglobinaHematocrito = hemo;
          data.grupoSanguineoGrupo =
            res.grupoFactorNuevo_grupo_factor_nuevo ?? "";
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
          data.vsg = vsg;
          data.glucosa = gluc;
          data.creatinina = creat;
          data.otrosExamenes += "HEMOGRAMA: " + (vsg != null && hemo != null ? "NORMAL" : "N/A") + "\n";
          const rh =
            res.grupoSanguineoRhPositivo_rbrhpositivo
              ? "+"
              : res.grupoSanguineoRhNegativo_rbrhnegativo
                ? "-"
                : "";
          const textoGrupo =
            data.grupoSanguineo || rh
              ? `${data.grupoSanguineo || ""}${rh}`
              : "N/A";
          data.otrosExamenes += `GRUPO SANGUINEO: ${textoGrupo}\n`;

          data.otrosExamenes +=
            gluc == null ? "" : "GLUCOSA: " + gluc + " mg/dl.\n";
          data.otrosExamenes +=
            creat == null ? "" : "CREATININA: " + creat + " mg/dl.\n";
          data.otrosExamenes += vsg == null ? "" : "VSG: " + vsg + ". \n";
          data.otrosExamenes += "EX ORINA: NORMAL. \n";
          data.otrosExamenes += coca == null ? "" : "COCAINA: " + coca + ". \n";
          data.otrosExamenes +=
            marig == null ? "" : "MARIHUANA: " + marig + ". \n";

          const sexo = res.sexo_sexo_pa;
          if (hemo != "N/A" && hemo != "") {
            const hemoglobina = parseFloat(hemo);
            if (sexo == "M") {
              if (hemoglobina < 14 || hemoglobina > 20) {
                data.hemoglobinaRed = true;
              } else {
                data.hemoglobinaRed = false;
              }
            }
            if (sexo == "F") {
              if (hemoglobina < 13.5 || hemoglobina > 20) {
                data.hemoglobinaRed = true;
              } else {
                data.hemoglobinaRed = false;
              }
            }
          }

          if (gluc != "" && gluc != "N/A") {
            const glucosa = parseFloat(gluc);
            if (glucosa >= 110 || glucosa < 70) {
              data.glucosaRed = true;
            } else {
              data.glucosaRed = false;
            }
          }

          if (creat != "" && creat != "N/A") {
            const cretinina = parseFloat(creat);
            if (cretinina >= 1.4 || cretinina < 0.8) {
              data.creatininaRed = true;
            } else {
              data.creatininaRed = false;
            }
          }
          if (res.examenRadiograficosSanguineos_txtobservacionesrs != null) {
            data.observacionesGenerales += `EX. RX SANGUINEOS : ${res.examenRadiograficosSanguineos_txtobservacionesrs}\n`;
          }
          data.nomExamen = res.nombreExamen_nom_examen ?? "";
          data.dni = res.dni_cod_pa ?? "";
          data.nombres = res.nombres_nombres_pa ?? "";
          data.apellidos = res.apellidos_apellidos_pa ?? "";
          data.fechaNac = formatearFechaCorta(
            res.fechaNacimientoPaciente_fecha_nacimiento_pa
          );
          data.sexo = res.sexo_sexo_pa ?? "";
          data.lugarNac = res.lugarNacPaciente_lugar_nac_pa ?? "";
          data.domicilio = res.direccionPaciente_direccion_pa ?? "";
          data.telefono = res.telefonoCasaPaciente_tel_casa_pa ?? "";
          data.estadoCivil = res.estadoCivilPaciente_estado_civil_pa ?? "";
          data.gradoInstruccion = res.nivelEstudiosPaciente_nivel_est_pa ?? "";
          data.empresa = res.empresa_razon_empresa ?? "";
          data.contrata = res.contrata_razon_contrata ?? "";
          data.edad = (res.edad_fecha_nacimiento_pa ?? "") + " años";
          data.explotacion = res.explotacion_nom_ex ?? "";
          data.alturaLaboral = res.altura_altura_po ?? "";
          data.mineralExp = res.mineral_mineral_po ?? "";
          data.puestoPostula = res.cargo_cargo_de ?? "";
          if (res.nombreExamen_nom_examen == "ANUAL") {
            data.puestoActual = res.cargo_cargo_de ?? "";
          }
          data.areaPuesto = res.area_area_o ?? "";

          data.fvc = res.fvc_fvc ?? "";
          data.fev1 = res.fev1_fev1 ?? "";
          data.fev1Fvc = res.fev1fvc_fev1fvc ?? "";
          data.fef2575 = res.fef2575_fef25_75 ?? "";

          data.conclusionRespiratoria = res.interpretacion_interpretacion ?? "";
          data.piezasMalEstado = res.piezasMalEstado_txtpiezasmalestado ?? "";
          data.piezasFaltan = res.ausentes_txtausentes ?? "";

          // Hijos
          data.hijosVivos =
            res.hijosVivosAnexo2_txthijosvivos ?? "0";
          data.hijosMuertos =
            res.hijosMuertosAnexo2_txthijosmuertos ??
            "0";

          data.imc = res.imc_imc ?? "";
          // Medidas Generales
          data.talla = res.talla_talla ?? "";
          data.peso = res.peso_peso ?? "";
          data.perimetro = res.perimetroCuello_perimetro_cuello ?? "";
          data.temperatura = res.temperatura_temperatura ?? "";
          data.cintura = res.cintura_cintura ?? "";
          data.cadera = res.cadera_cadera ?? "";
          data.icc = res.icc_icc ?? "";
          data.frecuenciaRespiratoria = res.frespiratoria_f_respiratoria ?? "";
          data.frecuenciaCardiaca = res.fcardiaca_f_cardiaca ?? "";
          data.saturacionO2 = res.sat02_sat_02 ?? "";
          data.presionSistolica = res.sistolica_sistolica ?? "";
          data.presionDiastolica = res.diastolica_diastolica ?? "";

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

          // //************************************************************
          data.od500 = res.oidoDerecho500_o_d_500 ?? "";
          data.od1000 = res.oidoDerecho1000_o_d_1000 ?? "";
          data.od2000 = res.oidoDerecho2000_o_d_2000 ?? "";
          data.od3000 = res.oidoDerecho3000_o_d_3000 ?? "";
          data.od4000 = res.oidoDerecho4000_o_d_4000 ?? "";
          data.od6000 = res.oidoDerecho6000_o_d_6000 ?? "";
          data.od8000 = res.oidoDerecho8000_o_d_8000 ?? "";
          data.oi500 = res.oidoIzquierdo500_o_i_500 ?? "";
          data.oi1000 = res.oidoIzquierdo1000_o_i_1000 ?? "";
          data.oi2000 = res.oidoIzquierdo2000_o_i_2000 ?? "";
          data.oi3000 = res.oidoIzquierdo3000_o_i_3000 ?? "";
          data.oi4000 = res.oidoIzquierdo4000_o_i_4000 ?? "";
          data.oi6000 = res.oidoIzquierdo6000_o_i_6000 ?? "";
          data.oi8000 = res.oidoIzquierdo8000_o_i_8000 ?? "";

          if (data.hijosVivos && data.hijosMuertos) {
            const hv = parseInt(data.hijosVivos) || 0;
            const hm = parseInt(data.hijosMuertos) || 0;
            data.totalHijos = (hv + hm).toString();
          }

          // electroCardiograma();=======================
          const hallazgoECG =
            res.hallazgosInformeElectroCardiograma_hallazgo ?? "";
          const recomendacionesECG =
            res.recomendacionesInformeElectroCardiograma_recomendaciones ?? "";

          if (hallazgoECG && hallazgoECG !== "NORMAL.") {
            if (recomendacionesECG) {
              data.observacionesGenerales += `\n -ELECTROCARDIOGRAMA: ${hallazgoECG}.${recomendacionesECG}\n`;
            } else {
              data.observacionesGenerales += `\n -ELECTROCARDIOGRAMA: ${hallazgoECG}\n`;
            }
          }

          //FIN==============

          // cargarAnalisisB();=======================
          data.colesterolTotal = res.colesterol_txtcolesterol ?? "";
          data.LDLColesterol = res.ldlColesterol_txtldlcolesterol ?? "";
          data.HDLColesterol = res.hdlColesterol_txthdlcolesterol ?? "";
          data.VLDLColesterol = res.vldlColesterol_txtvldlcolesterol ?? "";
          data.trigliceridos = res.trigliseridos_txttrigliseridos ?? "";
          const ct = parseFloat(data.colesterolTotal);
          const ldl = parseFloat(data.LDLColesterol) || 0;
          const hdl = parseFloat(data.HDLColesterol) || 0;
          const vldl = parseFloat(data.VLDLColesterol) || 0;
          const trigli = parseFloat(data.trigliceridos) || 0;

          if (ct > 200) {
            data.observacionesGenerales += "HIPERCOLESTEROLEMIA.";
            data.colesterolRed = true;
          }
          if (trigli > 150) {
            data.observacionesGenerales += "- HIPERTRIGLICERIDEMIA.";
            data.trigliceridosRed = true;
          }
          if (ldl > 129) {
            data.LDLColesterolRed = true;
          }
          if (hdl < 40 || hdl > 60) {
            data.HDLColesterolRed = true;
          }
          if (vldl > 30) {
            data.VLDLColesterolRed = true;
          }
          if (
            ct > 200 ||
            trigli > 150 ||
            ldl > 129 ||
            hdl < 40 ||
            hdl > 60 ||
            vldl > 30
          ) {
            data.observacionesGenerales +=
              "DIETA HIPOCALORICA Y EJERCICIOS. \n";
          }
          //==============================

          // Mapear restricciones a checkboxes
          const restriccionesTexto = data.restricciones || "";

          // Definir mapeo de textos a nombres de campos
          const restriccionesMap = {
            "CORREGIR AGUDEZA VISUAL TOTAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO": "corregirAgudezaVisualTotal",
            "CORREGIR AGUDEZA VISUAL PARA TRABAJO SOBRE 1.8 M.S.N.PISO": "corregirAgudezaVisual",
            "DIETA HIPOCALORICA Y EJERCICIOS": "dietaHipocalorica",
            "EVITAR MOVIMIENTOS Y POSICIONES DISERGONOMICAS": "evitarMovimientosDisergonomicos",
            "NO HACER TRABAJO DE ALTO RIESGO": "noTrabajoAltoRiesgo",
            "NO HACER TRABAJO SOBRE 1.8 M.S.N.PISO": "noTrabajoSobre18m",
            "USO DE EPP AUDITIVO ANTE EXPOSICION A RUIDO ≥80 DB": "usoEppAuditivo",
            "USO DE LENTES CORRECTORES PARA CONDUCIR Y/O OPERAR VEHICULOS MOTORIZADOS": "usoLentesCorrectorConducir",
            "USO DE LENTES CORRECTORES PARA TRABAJO": "usoLentesCorrectorTrabajo",
            "USO DE LENTES CORRECTORES PARA TRABAJO SOBRE 1.8 M.S.N.PISO": "usoLentesCorrectorTrabajo18m"
          };

          // Marcar checkboxes basándose en el texto de restricciones
          Object.entries(restriccionesMap).forEach(([texto, campo]) => {
            if (restriccionesTexto.includes(texto)) {
              data[campo] = true;
            } else {
              data[campo] = false;
            }
          });
          // Marcar "ninguno" si restricciones es "NINGUNO" o está vacío
          data.ninguno = restriccionesTexto === "NINGUNO" || restriccionesTexto === "";

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
