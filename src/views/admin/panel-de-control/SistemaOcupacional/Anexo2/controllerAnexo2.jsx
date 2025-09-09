import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const obtenerReporteUrl =
  "/api/v01/ct/anexos/anexo2/obtenerReporteAnexo2Completo";
const registrarUrl =
  "/api/v01/ct/anexos/anexo2/registrarActualizarAnexoAgroindustrial";

function validacionSistolica(sistolica1, diastolica1) {
  //txtObservacionesFichaMedica append
  if (sistolica1 >= 140 || diastolica1 >= 90) return "HTA NO CONTROLADA.\n";
  else return "";
}
function validacionAudiometria(txtOD500, diagnostico) {
  //txtObservacionesFichaMedica append
  if (txtOD500 != "" && txtOD500 != "N/A" && diagnostico != "NORMAL")
    return `${diagnostico}. USO DE EPP AUDITIVO. EVALUACION ANUAL.\n`;
  else if (txtOD500 == "N/A") return "NO PASO EXAMEN AUDIOMETRIA.\n";
  return "";
}
function validacionIMC(txtIMC) {
  //txtObservacionesFichaMedica append
  if (!txtIMC) return [false, ""];

  const imc = parseFloat(txtIMC);
  if (isNaN(imc)) return [false, ""];

  let mensaje = "";
  let colorRojo = false;

  if (imc >= 25 && imc < 30) {
    colorRojo = true;
    mensaje = "SOBREPESO: DIETA HIPOCALÓRICA Y EJERCICIOS.";
  } else if (imc >= 30 && imc < 35) {
    colorRojo = true;
    mensaje =
      "OBESIDAD I: NO HACER TRABAJO >1.8 M N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.";
  } else if (imc >= 35 && imc < 40) {
    colorRojo = true;
    mensaje =
      "OBESIDAD II: NO HACER TRABAJO >1.8 M N PISO. DIETA HIPOCALÓRICA Y EJERCICIOS.";
  }

  return [colorRojo, mensaje];
}

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
    userRegistro: form.user,
    accidentes: form.dataEnfermedades.map((item) => ({
      ...item,
      codigoAnexo: null,
      fecha: null,
      userRegistro: form.user,
    })),
  };
  console.log(body);

  await SubmitDataServiceDefault(
    token,
    limpiar,
    body,
    registrarUrl,
    () => {
      Swal.close();
    },
    false
  );
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla, numPage, datosFooter) => {
  Loading("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token
  ).then(async (res) => {
    if (res.norden) {
      const nombre = res.nameJasper;
      console.log(nombre);
      const jasperModules = import.meta.glob(
        "../../../../../jaspers/Cuestionario_Nordico/*.jsx"
      );
      let modulo;
      if (numPage == 2) {
        modulo = await jasperModules[
          `../../../../../jaspers/Cuestionario_Nordico/${nombre}.jsx`
        ]();
      } else {
        modulo = await jasperModules[
          `../../../../../jaspers/Cuestionario_Nordico/${nombre}.jsx`
        ]();
      }

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
      // GetInfoPac(nro, set, token, sede);
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.close();
      });
    },
    () => {
      //Tiene registro
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Anexo 2.",
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
      fechaNac: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad + " años",
      nombres: res.nombresApellidos,
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => {}
) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    obtenerReporteUrl,
    onFinish
  );
  if (res) {
    // set((prev) => ({
    //   ...prev,
    //   ...res,
    //   norden: res.norden,
    //   nomExamen: res.nombreExamen ?? "",
    //   fechaExam: res.fechaAnexo,
    //   codigoAnexo: res.codigoAnexo,
    //   //Info personal
    //   dni: res.dni ?? "",
    //   nombres: res.nombres ?? "",
    //   apellidos: res.apellidos ?? "", //revisar
    //   fechaNac: formatearFechaCorta(res.fechaNacimientoPaciente),
    //   sexo: res.sexo ?? "",
    //   edad: (res.edad ?? "") + " años",
    //   //Contacto y Estado Civil
    //   lugarNac: res.lugarNacPaciente ?? "",
    //   domicilio: res.direccionPaciente ?? "",
    //   telefono: res.celularPaciente ?? "",
    //   estadoCivil: res.estadoCivilPaciente ?? "",
    //   gradoInstruccion: res.nivelEstudiosPaciente ?? "",
    //   //Información Laboral
    //   empresa: res.empresa ?? "",
    //   contrata: res.contrata ?? "",
    //   mineralExp: res.mineral ?? "",
    //   explotacion: res.explotacion ?? "",
    //   alturaLaboral: res.alturaLaboral ?? "",
    //   //Detalles del Puesto
    //   puestoPostula: res.cargo ?? "",
    //   areaPuesto: res.areaPuesto ?? "", //revisar
    //   puestoActual: res.puestoactual ?? "",
    //   tiempoPuesto: res.tiempo ?? "",

    //   //Ant. Personales
    //   neoplasia: res.neoplasia,
    //   neoplasiaDescripcion: res.neoplasiaDescripcion ?? "",
    //   quemaduras: res.quemaduras,
    //   quemadurasDescripcion: res.quemadurasDescripcion ?? "",
    //   otrosAntecedentes: res.antecedentesPersonalesOtros,
    //   otrosAntecedentesDescripcion:
    //     res.antecedentesPersonalesOtrosDescripcion ?? "",
    //   its: res.its,
    //   itsDescripcion: res.itsDescripcion ?? "",
    //   cirugias: res.cirugias,
    //   cirugiasDescripcion: res.cirugiasDescripcion ?? "",

    //   //Residencia en el lugar de trabajo
    //   reside: res.residenciaSi,
    //   tiempoReside: res.residenciaTiempo ?? "",
    //   essalud: res.essalud,
    //   sctr: res.sctr,
    //   eps: res.eps,
    //   otrosResidencia: res.residenciaTrabajoOtros,
    //   otrosResidencia1: res.sctrOtros,

    //   //Número de Hijos
    //   hijosVivos: res.hijosvivosAntecedentesPatologicos ?? "",
    //   hijosMuertos: res.hijosfallecidosAntecedentesPatologicos ?? "",
    //   hijosDependientes: res.numeroDependientes ?? "",
    //   totalHijos: res.totalhijos ?? "",

    //   //Antecedentes Familiares
    //   antecendentesPadre: res.padreAntecedentesPatologicos ?? "",
    //   antecendentesMadre: res.madreAntecedentesPatologicos ?? "",
    //   antecendentesHermano: res.hermanosAntecedentesPatologicos ?? "",
    //   antecendentesEsposao: res.esposaAntecedentesPatologicos ?? "",

    //   //Medicamentos
    //   tomaMedicamento: res.medicamentosSi,
    //   tipoMedicamentos: res.tipoMedicamento ?? "",
    //   frecuenciaMedicamentos: res.frecuenciaMedicamentos ?? "",

    //   //Absentismo: Enfermedades y accidentes
    //   // dataEnfermedades: [],      //VIENE DE OTRO ENDPOINT

    //   //=============================================================================================
    //   //TAB LATERAL
    //   //=============================================================================================
    //   observacionesGenerales: res.observacionesFichaMedica??"",
    //   colesterolTotal: res.colesterol ?? "",
    //   LDLColesterol: res.ldlColesterol ?? "",
    //   HDLColesterol: res.hdlColesterol ?? "",
    //   VLDLColesterol: res.vldlColesterol ?? "",
    //   trigliceridos: res.trigliseridos ?? "",
    //   //Comparacion Grupo Sanguineo
    //   grupoSanguineoPrevio: "", //revisar
    //   grupoSanguineoGrupo: "", //revisar
    //   //Grupo Sanguineo
    //   grupoSanguineo: "", //revisar
    //   factorRh: "", //revisar
    //   //Resultados de Laboratorio
    //   vsg: "", //revisar
    //   glucosa: "", //revisar
    //   creatinina: "", //revisar
    //   marihuana: "", //revisar
    //   cocaina: "", //revisar
    //   hemoglobinaHematocrito: "", //revisar

    //   //=============================================================================================
    //   //SEGUNDA TAB EXAMENES
    //   //=============================================================================================
    //   // Función Respiratoria
    //   fvc: res.fvc ?? "",
    //   fev1: res.fev1 ?? "",
    //   fev1Fvc: res.fev1Fvc ?? "",
    //   fef2575: res.fef2575 ?? "",
    //   conclusionRespiratoria: "", //revisar

    //   // Información Triaje
    //   //Medidas Generales
    //   temperatura: res.temperatura ?? "",
    //   cintura: res.cintura ?? "",
    //   cadera: res.cadera ?? "",
    //   icc: res.icc ?? "",

    //   //Medidas Generales
    //   talla: res.talla ?? "",
    //   peso: res.peso ?? "",
    //   imc: res.imc ?? "",
    //   imcRojo: false, //REVISAR

    //   // Signos Vitales
    //   frecuenciaRespiratoria: res.frespiratoria ?? "",
    //   frecuenciaCardiaca: res.fcardiaca ?? "",
    //   saturacionO2: res.sat02 ?? "",
    //   perimetro: "", //revisar? es perimetroCuello??

    //   // Presión Arterial
    //   presionSistolica: res.sistolica ?? "",
    //   presionDiastolica: res.diastolica ?? "",

    //   // Audiometría - Oído Derecho
    //   od500: res.oidoDerecho500 ?? "",
    //   od1000: res.oidoDerecho1000 ?? "",
    //   od2000: res.oidoDerecho2000 ?? "",
    //   od3000: res.oidoDerecho3000 ?? "",
    //   od4000: res.oidoDerecho4000 ?? "",
    //   od6000: res.oidoDerecho6000 ?? "",
    //   od8000: res.oidoDerecho8000 ?? "",

    //   // Audiometría - Oído Izquierdo
    //   oi500: res.oidoIzquierdo500 ?? "",
    //   oi1000: res.oidoIzquierdo1000 ?? "",
    //   oi2000: res.oidoIzquierdo2000 ?? "",
    //   oi3000: res.oidoIzquierdo3000 ?? "",
    //   oi4000: res.oidoIzquierdo4000 ?? "",
    //   oi6000: res.oidoIzquierdo6000 ?? "",
    //   oi8000: res.oidoIzquierdo8000 ?? "",

    //   // Ojos
    //   visionCercaOd: res.visionCercaSinCorregirOd ?? "",
    //   visionCercaOi: res.visionCercaSinCorregirOi ?? "",
    //   visionCercaOdCorregida: res.visionCercaCorregidaOd ?? "",
    //   visionCercaOiCorregida: res.visionCercaCorregidaOi ?? "",

    //   visionLejosOd: res.visionLejosSinCorregirOd ?? "",
    //   visionLejosOi: res.visionLejosSinCorregirOi ?? "",
    //   visionLejosOdCorregida: res.visionLejosCorregidaOd ?? "",
    //   visionLejosOiCorregida: res.visionLejosCorregidaOi ?? "",

    //   visionColores: res.visionColores ?? "",
    //   enfermedadOculares: res.enfermedadesOcularesOftalmo ?? "",
    //   enfermedadOtros: res.enfermedadesOcularesOtrosOftalmo ?? "",
    //   reflejosPupilares: res.reflejosPupilares ?? "",
    //   visionBinocular: res.visionBinocular ?? "",

    //   // Observaciones Generales
    //   ectoscopia: res.ectoscopia ?? "",
    //   estadoMental: res.estadomental ?? "",
    //   anamnesis: res.anamnesis ?? "",

    //   // Dentadura
    //   piezasMalEstado: res.piezasMalEstado ?? "",
    //   piezasFaltan: "", //revisar

    //   //=============================================================================================
    //   //TERCERA TAB EXAMEN FISICO
    //   //=============================================================================================

    //   // Examen Físico por Sistemas
    //   cabeza: res.cabeza ?? "",
    //   cuello: res.cuello ?? "",
    //   boca: res.boca ?? "",
    //   faringe: res.faringe ?? "",
    //   nariz: res.nariz ?? "",
    //   oidos: res.oidos ?? "",
    //   marcha: res.marcha ?? "",
    //   piel: res.piel ?? "",
    //   aparatoRespiratorio: res.aparatoRespiratorio ?? "",
    //   apaCardiovascular: res.aparatoCardiovascular ?? "",
    //   aparatoDigestivo: res.aparatoDigestivo ?? "",
    //   aGenitourinario: res.aparatoGeiotourinario ?? "",
    //   aparatoLocomotor: res.aparatoLocomotor ?? "",
    //   miembrosSuperiores: res.miembrosSuperiores ?? "",
    //   miembrosInferiores: res.miembrosInferiores ?? "",
    //   sistemaLinfatico: res.sistemaLinfatico ?? "",
    //   sistemaNervioso: res.sistemaNervioso ?? "",
    //   columnaVertebral: res.columnaVertebral ?? "",

    //   // Otros Exámenes
    //   otrosExamenes: res.otrosExamenes ?? "",

    //   //=============================================================================================
    //   //CUARTA TAB RESULTADOS
    //   //=============================================================================================
    //   // Aptitud del Paciente
    //   aptitud: res.esApto
    //     ? "APTO"
    //     : res.noEsApto
    //     ? "NO APTO"
    //     : res.aptoRestriccion
    //     ? "RESTRICCION"
    //     : "",
    //   fechaAptitud: new Date(), //revisar
    //   fechaVencimiento: new Date(), //revisar
    //   restricciones: res.restricciones ?? "",

    //   // Recomendaciones y Restricciones
    //   corregirAgudezaVisualTotal: false, //revisar validar del texto
    //   corregirAgudezaVisual: false, //revisar validar del texto
    //   dietaHipocalorica: false, //revisar validar del texto
    //   evitarMovimientosDisergonomicos: false, //revisar validar del texto
    //   noTrabajoAltoRiesgo: false, //revisar validar del texto
    //   noTrabajoSobre18m: false, //revisar validar del texto
    //   usoEppAuditivo: false, //revisar validar del texto
    //   usoLentesCorrectorConducir: false, //revisar validar del texto
    //   usoLentesCorrectorTrabajo: false, //revisar validar del texto
    //   usoLentesCorrectorTrabajo18m: false, //revisar validar del texto
    //   ninguno: true, //revisar validar del texto
    //   noConducirVehiculos: false, //revisar validar del texto
    //   usoEppAuditivoGeneral: false, //revisar validar del texto

    //   // Médico que Certifica //BUSCADOR
    //   nombre_medico: "", //revisar
    // }));
    //================================================================================================================================================
    //================================================================================================================================================
    const data = {
      norden: res.norden,
      observacionesGenerales: "", //txtObservacionesFichaMedica
    };
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
        data.observacionesGenerales += res.verticesRadiografiaTorax_txtvertices;
      }
      if (
        res.hilosRadiografiaTorax_txthilios != null &&
        res.hilosRadiografiaTorax_txthilios != "NORMALES"
      ) {
        data.observacionesGenerales += res.hilosRadiografiaTorax_txthilios;
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
        res.conclusionesRadiograficas_txtconclusionesradiograficas != null &&
        res.conclusionesRadiograficas_txtconclusionesradiograficas != "NORMAL"
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
      // txtCoca.setForeground(Color.red);      // REVISAR
      data.cocaina = "REACTIVO";
    } else {
      data.cocaina = coca;
    }
    if (marig == "REACTIVO") {
      data.observacionesGenerales += `MARIHUANA: COLABORADOR DE LA COMUNIDAD, CONSUME HOJA DE COCA.\n`;
      //txtMarig.setForeground(Color.red);    // REVISAR
      data.marihuana = "REACTIVO";
    } else {
      data.marihuana = marig;
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
      ? "+"
      : res.grupoSanguineoRhNegativo_rbrhnegativo
      ? "-"
      : "";


    // txtVSG.setText(vsg);
    // txtGlucosaBio.setText(gluc);
    // txtCreatininaBio.setText(creat);
    // txtOtrosEx.append("-HEMOGRAMA: NORMAL. \n");
    // txtOtrosEx.append(gluc == null ? "" : "-GLUCOSA: " + gluc + " mg/dl. \n");
    // txtOtrosEx.append(
    //   creat == null ? "" : "-CREATININA: " + creat + " mg/dl. \n"
    // );
    // txtOtrosEx.append(vsg == null ? "" : "-VSG: " + vsg + ". \n");
    // txtOtrosEx.append("-EX ORINA: NORMAL. \n");
    // txtOtrosEx.append(
    //   oConn.setResult.getString("txtcocaina") == null
    //     ? ""
    //     : "-COCAINA: " + oConn.setResult.getString("txtcocaina") + ". \n"
    // );
    // txtOtrosEx.append(
    //   oConn.setResult.getString("txtmarihuana") == null
    //     ? ""
    //     : "-MARIHUANA: " + oConn.setResult.getString("txtmarihuana") + "."
    // );
    // sexo = oConn.setResult.getString("sexo_pa");
    //===============================
    // if (!"N/A".equals(hemo) && !txtHemoHema.getText().isEmpty()) {
    //   // float hemoglobina=Float.parseFloat(hemo);
    //   if ("M".equals(sexo)) {
    //     if (hemoglobina < 14 || hemoglobina > 20) {
    //       txtHemoHema.setForeground(Color.red);
    //     } else {
    //       txtHemoHema.setForeground(Color.BLACK);
    //     }
    //   }
    //   if ("F".equals(sexo)) {
    //     if (hemoglobina < 13.5 || hemoglobina > 20) {
    //       txtHemoHema.setForeground(Color.red);
    //     } else {
    //       txtHemoHema.setForeground(Color.BLACK);
    //     }
    //   }
    // }

    // txtVSG.setText(vsg);
    // txtGlucosaBio.setText(gluc);
    // txtCreatininaBio.setText(creat);
    // if (
    //   !txtGlucosaBio.getText().isEmpty() &&
    //   !"N/A".equals(txtGlucosaBio.getText())
    // ) {
    //   // float glucosa = Float.parseFloat(txtGlucosaBio.getText().toString());
    //   if (glucosa >= 110 || glucosa < 70) {
    //     txtGlucosaBio.setForeground(Color.red);
    //   } else {
    //     txtGlucosaBio.setForeground(Color.black);
    //   }
    // }
    // if (
    //   !txtCreatininaBio.getText().isEmpty() &&
    //   !"N/A".equals(txtCreatininaBio.getText())
    // ) {
    //   // float cretinina = Float.parseFloat(txtCreatininaBio.getText().toString());
    //   if (cretinina >= 1.4 || cretinina < 0.8) {
    //     txtCreatininaBio.setForeground(Color.red);
    //   } else {
    //     txtCreatininaBio.setForeground(Color.black);
    //   }
    // }
    //==========================
    // txtTipoExamen.setText(oConn.setResult.getString("nom_examen"));
    // txtDni.setText(oConn.setResult.getString("cod_pa"));
    // txtNombre.setText(oConn.setResult.getString("nombres_pa"));
    // txtApellido.setText(oConn.setResult.getString("apellidos_pa"));
    // FechaNacimiento.setDate(oConn.setResult.getDate("fecha_nacimiento_pa"));
    // txtSexo.setText(oConn.setResult.getString("sexo_pa"));

    // txtLugarNacimiento.setText(oConn.setResult.getString("lugar_nac_pa"));
    // txtDomicilio.setText(oConn.setResult.getString("direccion_pa"));
    // txtTelefono.setText(oConn.setResult.getString("tel_casa_pa"));
    // txtEstadoCivil.setText(oConn.setResult.getString("estado_civil_pa"));
    // txtGradoInstruccion.setText(oConn.setResult.getString("nivel_est_pa"));
    // txtEmpresa.setText(oConn.setResult.getString("razon_empresa"));
    // txtContrata.setText(oConn.setResult.getString("razon_contrata"));
    // txtEdad.setText(
    //   String.valueOf(oFunc.calcularEdad(FechaNacimiento.getCalendar()))
    // );
    // txtExplotacionEn.setText(oConn.setResult.getString("nom_ex"));

    // txtAlturaLabor.setText(oConn.setResult.getString("altura_po"));

    // txtMineralesExplotados.setText(oConn.setResult.getString("mineral_po"));

    // txtPuestoPostula.setText(oConn.setResult.getString("cargo_de"));
    // if ("ANUAL".equals(txtTipoExamen.getText().toString())) {
    //   txtPuestoActual.setText(oConn.setResult.getString("cargo_de"));
    // }
    // txtArea.setText(oConn.setResult.getString("area_o"));
    // txtGFSPrevio.setText(oConn.setResult.getString("grupofactorsan"));
    // txtFVC.setText(oConn.setResult.getString("fvc"));
    // if (
    //   !txtFVC.getText().isEmpty() &&
    //   !"N/A".equals(txtFVC.getText().toString())
    // ) {
    //   // float fvc=Float.parseFloat(txtFVC.getText().toString());
    //   if (fvc >= 80) {
    //     txtConclusion.append("-NORMAL");
    //   } else {
    //     txtConclusion.append("-PATRON RESTRICTIVO" + "\n");
    //     txtObservacionesFichaMedica.append(
    //       "-PATRON RESTRICTIVO LEVE.EVALUACION EN 6 MESES." + "\n"
    //     );
    //   }
    // }
    //==========================================
    // txtFEV1.setText(oConn.setResult.getString("fev1"));
    // txtFEV1FVC.setText(oConn.setResult.getString("fev1fvc"));
    // if (
    //   "N/A".equals(txtFVC.getText().toString()) &&
    //   !txtFVC.getText().isEmpty()
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     "-NO PASO EXAMEN DE ESPIROMETRIA." + "\n"
    //   );
    // } else {
    //   if (
    //     !txtFEV1FVC.getText().isEmpty() &&
    //     !"N/A".equals(txtFVC.getText().toString())
    //   ) {
    //     //  float fev1fvc=Float.parseFloat(txtFEV1FVC.getText().toString());
    //     if (fev1fvc >= 70.0) {
    //       if (!"-NORMAL".equals(txtConclusion.getText().toString())) {
    //         txtConclusion.append("-NORMAL" + "\n");
    //       }
    //     } else {
    //       txtConclusion.append("-PATRON OBSTRUCTIVO" + "\n");
    //       txtObservacionesFichaMedica.append(
    //         "-PATRON OBSTRUCTIVO LEVE. EVALUACION EN 6 MESES." + "\n"
    //       );
    //     }
    //   }
    // }
    // txtFEF2575.setText(oConn.setResult.getString("fef25_75"));
    // //                        txtConclusion.setText(oConn.setResult.getString("interpretacion"));
    // txtMalEstado.setText(oConn.setResult.getString("txtpiezasmalestado"));
    // if (!txtMalEstado.getText().isEmpty()) {
    //   // float malEstado = Float.parseFloat(txtMalEstado.getText());
    //   if (malEstado >= 1) {
    //     txtObservacionesFichaMedica.append(
    //       "-CARIES DENTAL.TTO.EVALUACION EN 6 MESES." + "\n"
    //     );
    //   }
    // }
    // txtFaltan.setText(oConn.setResult.getString("txtausentes"));
    // // String hvivos=oConn.setResult.getString("txtvhijosvivos");
    // // String hfallecidos=oConn.setResult.getString("txtvhijosfallecidos");
    // if (txtSexo.getText().equals("M")) {
    //   txtHijosvivos.setText(hvivos == null ? "0" : hvivos);
    //   txtHijosMuertos.setText(hfallecidos == null ? "0" : hfallecidos);
    // } else {
    //   txtHijosvivos.setText(hvivos == null ? "0" : hvivos);
    //   txtHijosMuertos.setText(hfallecidos == null ? "0" : hfallecidos);
    // }
    // if (
    //   !txtHijosvivos.getText().isEmpty() &&
    //   !txtHijosMuertos.getText().isEmpty()
    // ) {
    //   // Integer hv=Integer.parseInt(txtHijosvivos.getText());
    //   // Integer hm=Integer.parseInt(txtHijosMuertos.getText());
    //   txtTotalhijos.setText(String.valueOf(hv + hm));
    // }
    // txtIMC.setText(oConn.setResult.getString("imc"));
    // if (!txtIMC.getText().isEmpty()) {
    //   //  float imc = Float.parseFloat(txtIMC.getText().toString());
    //   txtIMC.setForeground(Color.black);
    //   if (imc >= 25 && imc < 30) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS." + "\n"
    //     );
    //   } else if (imc >= 30 && imc < 35) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-OBESIDAD I.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS" +
    //         "\n"
    //     );
    //   } else if (imc >= 35 && imc < 40) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-OBESIDAD II.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS" +
    //         "\n"
    //     );
    //   }
    // }
    // txtFEF2575.setText(oConn.setResult.getString("fef25_75"));
    // txtMalEstado.setText(oConn.setResult.getString("txtpiezasmalestado"));
    // if (!txtMalEstado.getText().isEmpty()) {
    //   // float malEstado = Float.parseFloat(txtMalEstado.getText());
    //   if (malEstado >= 1) {
    //     txtObservacionesFichaMedica.append(
    //       "-CARIES DENTAL.TTO.EVALUACION EN 6 MESES." + "\n"
    //     );
    //   }
    // }
    // txtFaltan.setText(oConn.setResult.getString("txtausentes"));
    // // String hvivos=oConn.setResult.getString("txtvhijosvivos");
    // // String hfallecidos=oConn.setResult.getString("txtvhijosfallecidos");
    // if (txtSexo.getText().equals("M")) {
    //   txtHijosvivos.setText(hvivos == null ? "0" : hvivos);
    //   txtHijosMuertos.setText(hfallecidos == null ? "0" : hfallecidos);
    // } else {
    //   txtHijosvivos.setText(hvivos == null ? "0" : hvivos);
    //   txtHijosMuertos.setText(hfallecidos == null ? "0" : hfallecidos);
    // }
    // if (
    //   !txtHijosvivos.getText().isEmpty() &&
    //   !txtHijosMuertos.getText().isEmpty()
    // ) {
    //   // Integer hv=Integer.parseInt(txtHijosvivos.getText());
    //   // Integer hm=Integer.parseInt(txtHijosMuertos.getText());
    //   txtTotalhijos.setText(String.valueOf(hv + hm));
    // }
    // txtIMC.setText(oConn.setResult.getString("imc"));
    // if (!txtIMC.getText().isEmpty()) {
    //   //  float imc = Float.parseFloat(txtIMC.getText().toString());
    //   txtIMC.setForeground(Color.black);
    //   if (imc >= 25 && imc < 30) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-SOBREPESO:DIETA HIPOCALORICA Y EJERCICIOS." + "\n"
    //     );
    //   } else if (imc >= 30 && imc < 35) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-OBESIDAD I.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS" +
    //         "\n"
    //     );
    //   } else if (imc >= 35 && imc < 40) {
    //     txtIMC.setForeground(Color.red);
    //     txtObservacionesFichaMedica.append(
    //       "-OBESIDAD II.NO HACER TRABAJO 1.8 M.N PISO.DIETA HIPOCALORICA Y EJERCICIOS" +
    //         "\n"
    //     );
    //   }
    // }

    // txtTalla.setText(oConn.setResult.getString("talla"));
    // txtPeso.setText(oConn.setResult.getString("peso"));
    // txtPerimetro.setText(oConn.setResult.getString("perimetro_cuello"));
    // txtTemperatura.setText(oConn.setResult.getString("temperatura"));
    // txtCintura.setText(oConn.setResult.getString("cintura"));
    // txtCadera.setText(oConn.setResult.getString("cadera"));
    // txticc.setText(oConn.setResult.getString("icc"));
    // txtFrespiratoria.setText(oConn.setResult.getString("f_respiratoria"));
    // txtFcardiaca.setText(oConn.setResult.getString("f_cardiaca"));
    // txtSatO2.setText(oConn.setResult.getString("sat_02"));
    // // String sistolica=oConn.setResult.getString("sistolica");
    // // String diastolica=oConn.setResult.getString("diastolica");
    // txtSistolica.setText(sistolica);
    // txtDiastolica.setText(diastolica);
    // txtGrupoFacLab.setText(oConn.setResult.getString("Grupofactor"));
    // txtCercaSinCorregirOD.setText(oConn.setResult.getString("v_cerca_s_od"));
    // txtCercaSinCorregirOI.setText(oConn.setResult.getString("v_cerca_s_oi"));
    // txtCercaCorregidaOD.setText(oConn.setResult.getString("v_cerca_c_od"));
    // txtCercaCorregidaOI.setText(oConn.setResult.getString("v_cerca_c_oi"));
    // txtLejosSinCorregirOD.setText(oConn.setResult.getString("v_lejos_s_od"));
    // txtLejosSinCorregirOI.setText(oConn.setResult.getString("v_lejos_s_oi"));
    // txtLejosCorregidaOD.setText(oConn.setResult.getString("v_lejos_c_od"));
    // txtLejosCorregidaOI.setText(oConn.setResult.getString("v_lejos_c_oi"));
    // txtVisionColores.setText(oConn.setResult.getString("v_colores"));
    // txtBinocular.setText(oConn.setResult.getString("v_binocular"));
    // if (oConn.setResult.getString("e_oculares") != null) {
    //   txtEnfermedadesOculares.setText(oConn.setResult.getString("e_oculares"));
    // } else {
    //   txtEnfermedadesOculares.setText("NINGUNA");
    // }
    // if (oConn.setResult.getString("e_oculares1") != null) {
    //   txtEnfermedadesOculares1.setText(
    //     oConn.setResult.getString("e_oculares1")
    //   );
    // } else {
    //   txtEnfermedadesOculares1.setText("NINGUNA");
    // }
    // if (!txtCercaSinCorregirOD.getText().isEmpty()) {
    //   if (
    //     !"NINGUNA".equals(txtEnfermedadesOculares.getText().toString()) &&
    //     !txtEnfermedadesOculares.getText().isEmpty()
    //   ) {
    //     txtObservacionesFichaMedica.append(
    //       "- " + txtEnfermedadesOculares.getText().toString() + "\n"
    //     );
    //   }
    // }
    // if (
    //   "PTERIGION BILATERAL".equals(
    //     txtEnfermedadesOculares1.getText().toString()
    //   )
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     "- PTERIGION BILATERAL:EVALUACION X OFTALMOLOGIA." + "\n"
    //   );
    // } else if (
    //   !"NINGUNA".equals(txtEnfermedadesOculares1.getText().toString()) &&
    //   !txtEnfermedadesOculares1.getText().isEmpty()
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     txtEnfermedadesOculares1
    //       .getText()
    //       .toString()
    //       .concat(":EVALUACION X OFTALMOLOGIA.") + "\n"
    //   );
    // }
    // if (
    //   !"NINGUNA".equals(txtVisionColores.getText().toString()) &&
    //   !"NORMAL".equals(txtVisionColores.getText().toString())
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     "- " + txtVisionColores.getText().toString() + "\n"
    //   );
    // }
    // //************************************************************
    // txtOD500.setText(oConn.setResult.getString("o_d_500"));
    // txtOD1000.setText(oConn.setResult.getString("o_d_1000"));
    // txtOD2000.setText(oConn.setResult.getString("o_d_2000"));
    // txtOD3000.setText(oConn.setResult.getString("o_d_3000"));
    // txtOD4000.setText(oConn.setResult.getString("o_d_4000"));
    // txtOD6000.setText(oConn.setResult.getString("o_d_6000"));
    // txtOD8000.setText(oConn.setResult.getString("o_d_8000"));
    // txtOI500.setText(oConn.setResult.getString("o_i_500"));
    // txtOI1000.setText(oConn.setResult.getString("o_i_1000"));
    // txtOI2000.setText(oConn.setResult.getString("o_i_2000"));
    // txtOI3000.setText(oConn.setResult.getString("o_i_3000"));
    // txtOI4000.setText(oConn.setResult.getString("o_i_4000"));
    // txtOI6000.setText(oConn.setResult.getString("o_i_6000"));
    // txtOI8000.setText(oConn.setResult.getString("o_i_8000"));
    // // String s=oConn.setResult.getString("diagnostico");
    // //************************************************************
    // if (
    //   !txtOD500.getText().isEmpty() &&
    //   !"N/A".equals(txtOD500.getText()) &&
    //   !"NORMAL".equals(s)
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     s.concat(".USO DE EPP AUDITIVO.EVALUACION ANUAL ")
    //   );
    // } else if ("N/A".equals(txtOD500.getText())) {
    //   txtObservacionesFichaMedica.append("NO PASO EXAMEN AUDIOMETRIA." + "\n");
    // }
    // //************************************************************
    // oPu.fecha(FechaFicha); // cuadrar la fecha de hoy de datos personales
    // oPu.fecha(Fecha);      // cuadrar la fecha de hoy de resultados
    // fechaHasta();          // generar fecha vencimiento de 1 año
    // if (chkApto.isSelected()) {
    //   atxtRestricciones.setText("-NINGUNO");
    // }
    // electroCardiograma();
    //eletrocardiograma))))=======================
    // if (
    //   oConn.setResult.getString("hallazgo") != null &&
    //   !"NORMAL.".equals(oConn.setResult.getString("hallazgo"))
    // ) {
    //   if (oConn.setResult.getString("recomendaciones") != null) {
    //     txtObservacionesFichaMedica.append(
    //       "\n -ELECTROCARDIOGRAMA: " +
    //         oConn.setResult.getString("hallazgo") +
    //         "." +
    //         oConn.setResult.getString("recomendaciones") +
    //         "\n"
    //     );
    //   } else {
    //     txtObservacionesFichaMedica.append(
    //       "\n -ELECTROCARDIOGRAMA: " +
    //         oConn.setResult.getString("hallazgo") +
    //         "\n"
    //     );
    //   }
    // }
    //fin eletrocardiograma))))=======================
    // cargarAnalisisB();

    //cargarAnalisisB))))=======================
    // txtColesterol.setText(oConn.setResult.getString("txtcolesterol"));
    // txtLDLColesterol.setText(oConn.setResult.getString("txtldlcolesterol"));
    // txtHDLColesterol.setText(oConn.setResult.getString("txthdlcolesterol"));
    // txtVLDLColesterol.setText(oConn.setResult.getString("txtvldlcolesterol"));
    // txtTrigliseridos.setText(oConn.setResult.getString("txttrigliseridos"));
    // // float ct=Float.parseFloat(txtColesterol.getText().toString());
    // // float ldl=Float.parseFloat(txtLDLColesterol.getText().toString());
    // // float hdl=Float.parseFloat(txtHDLColesterol.getText().toString());
    // // float vldl=Float.parseFloat(txtVLDLColesterol.getText().toString());
    // // float trigli=Float.parseFloat(txtTrigliseridos.getText().toString());
    // if (ct > 200) {
    //   txtObservacionesFichaMedica.append("- HIPERCOLESTEROLEMIA.");
    //   txtColesterol.setForeground(Color.red);
    // }
    // if (trigli > 150) {
    //   txtObservacionesFichaMedica.append("- HIPERTRIGLICERIDEMIA.");
    //   txtTrigliseridos.setForeground(Color.red);
    // }
    // if (ldl > 129) {
    //   txtLDLColesterol.setForeground(Color.red);
    // }
    // if (hdl < 40 || hdl > 60) {
    //   txtHDLColesterol.setForeground(Color.red);
    // }
    // if (vldl > 30) {
    //   txtVLDLColesterol.setForeground(Color.red);
    // }
    // if (
    //   ct > 200 ||
    //   trigli > 150 ||
    //   ldl > 129 ||
    //   hdl < 40 ||
    //   hdl > 60 ||
    //   vldl > 30
    // ) {
    //   txtObservacionesFichaMedica.append(
    //     "DIETA HIPOCALORICA Y EJERCICIOS. \n "
    //   );
    // }
    //fin cargarAnalisisB))))=======================
    // if (
    //   txtGrupoFacLab.getText() == null
    //     ? txtGFSPrevio.getText() == null
    //     : !txtGrupoFacLab.getText().equals(txtGFSPrevio.getText())
    // ) {
    //   oFunc.SubSistemaMensajeError(
    //     "Grupo Sanguinio incongruente por favotr revisar"
    //   );
    // }
    // if (!"".equals(sistolica) && !"".equals(diastolica)) {
    //   // float sistolica1 = Float.parseFloat(sistolica);
    //   // float diastolica1 = Float.parseFloat(diastolica);

    //   if (sistolica1 >= 140 || diastolica1 >= 90) {
    //     txtObservacionesFichaMedica.append("- HTA NO CONTROLADA." + "\n");
    //   }
    // }
  }
};
