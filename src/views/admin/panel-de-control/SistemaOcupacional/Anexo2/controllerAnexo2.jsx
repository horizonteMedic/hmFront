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
    set((prev) => ({
      ...prev,
      ...res,
      norden: res.norden,
      nomExamen: res.nombreExamen ?? "",
      fechaExam: res.fechaAnexo,
      codigoAnexo: res.codigoAnexo,
      //Info personal
      dni: res.dni ?? "",
      nombres: res.nombres ?? "",
      apellidos: res.apellidos ?? "", //revisar
      fechaNac: formatearFechaCorta(res.fechaNacimientoPaciente),
      sexo: res.sexo ?? "",
      edad: (res.edad ?? "") + " años",
      //Contacto y Estado Civil
      lugarNac: res.lugarNacPaciente ?? "",
      domicilio: res.direccionPaciente ?? "",
      telefono: res.celularPaciente ?? "",
      estadoCivil: res.estadoCivilPaciente ?? "",
      gradoInstruccion: res.nivelEstudiosPaciente ?? "",
      //Información Laboral
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      mineralExp: res.mineral ?? "",
      explotacion: res.explotacion ?? "",
      alturaLaboral: res.alturaLaboral ?? "",
      //Detalles del Puesto
      puestoPostula: res.cargo ?? "", //revisar
      areaPuesto: res.areaPuesto ?? "", //revisar
      puestoActual: res.puestoactual ?? "",
      tiempoPuesto: res.tiempo ?? "",

      //Ant. Personales
      neoplasia: res.neoplasia,
      neoplasiaDescripcion: res.neoplasiaDescripcion ?? "",
      quemaduras: res.quemaduras,
      quemadurasDescripcion: res.quemadurasDescripcion ?? "",
      otrosAntecedentes: res.antecedentesPersonalesOtros,
      otrosAntecedentesDescripcion:
        res.antecedentesPersonalesOtrosDescripcion ?? "",
      its: res.its,
      itsDescripcion: res.itsDescripcion ?? "",
      cirugias: res.cirugias,
      cirugiasDescripcion: res.cirugiasDescripcion ?? "",

      //Residencia en el lugar de trabajo
      reside: res.residenciaSi,
      tiempoReside: res.residenciaTiempo ?? "",
      essalud: res.essalud,
      sctr: res.sctr,
      eps: res.eps,
      otrosResidencia: res.residenciaTrabajoOtros,
      otrosResidencia1: res.sctrOtros,

      //Número de Hijos
      hijosVivos: res.hijosvivosAntecedentesPatologicos ?? "",
      hijosMuertos: res.hijosfallecidosAntecedentesPatologicos ?? "",
      hijosDependientes: res.numeroDependientes ?? "",
      totalHijos: res.totalhijos ?? "",

      //Antecedentes Familiares
      antecendentesPadre: res.padreAntecedentesPatologicos ?? "",
      antecendentesMadre: res.madreAntecedentesPatologicos ?? "",
      antecendentesHermano: res.hermanosAntecedentesPatologicos ?? "",
      antecendentesEsposao: res.esposaAntecedentesPatologicos ?? "",

      //Medicamentos
      tomaMedicamento: res.medicamentosSi,
      tipoMedicamentos: res.tipoMedicamento ?? "",
      frecuenciaMedicamentos: res.frecuenciaMedicamentos ?? "",

      //Absentismo: Enfermedades y accidentes
      // dataEnfermedades: [],      //VIENE DE OTRO ENDPOINT

      //=============================================================================================
      //TAB LATERAL
      //=============================================================================================
      observacionesGenerales: "", //revisar
      colesterolTotal: res.colesterol ?? "",
      LDLColesterol: res.ldlColesterol ?? "",
      HDLColesterol: res.hdlColesterol ?? "",
      VLDLColesterol: res.vldlColesterol ?? "",
      trigliceridos: res.trigliseridos ?? "",
      //Comparacion Grupo Sanguineo
      grupoSanguineoPrevio: "", //revisar
      grupoSanguineoGrupo: "", //revisar
      //Grupo Sanguineo
      grupoSanguineo: "", //revisar
      factorRh: "", //revisar
      //Resultados de Laboratorio
      vsg: "", //revisar
      glucosa: "", //revisar
      creatinina: "", //revisar
      marihuana: "", //revisar
      cocaina: "", //revisar
      hemoglobinaHematocrito: "", //revisar

      //=============================================================================================
      //SEGUNDA TAB EXAMENES
      //=============================================================================================
      // Función Respiratoria
      fvc: res.fvc ?? "",
      fev1: res.fev1 ?? "",
      fev1Fvc: res.fev1Fvc ?? "",
      fef2575: res.fef2575 ?? "",
      conclusionRespiratoria: "", //revisar

      // Información Triaje
      //Medidas Generales
      temperatura: res.temperatura ?? "",
      cintura: res.cintura ?? "",
      cadera: res.cadera ?? "",
      icc: res.icc ?? "",

      //Medidas Generales
      talla: res.talla ?? "",
      peso: res.peso ?? "",
      imc: res.imc ?? "",
      imcRojo: false, //REVISAR

      // Signos Vitales
      frecuenciaRespiratoria: res.frespiratoria ?? "",
      frecuenciaCardiaca: res.fcardiaca ?? "",
      saturacionO2: res.sat02 ?? "",
      perimetro: "", //revisar? es perimetroCuello??

      // Presión Arterial
      presionSistolica: res.sistolica ?? "",
      presionDiastolica: res.diastolica ?? "",

      // Audiometría - Oído Derecho
      od500: res.oidoDerecho500 ?? "",
      od1000: res.oidoDerecho1000 ?? "",
      od2000: res.oidoDerecho2000 ?? "",
      od3000: res.oidoDerecho3000 ?? "",
      od4000: res.oidoDerecho4000 ?? "",
      od6000: res.oidoDerecho6000 ?? "",
      od8000: res.oidoDerecho8000 ?? "",

      // Audiometría - Oído Izquierdo
      oi500: res.oidoIzquierdo500 ?? "",
      oi1000: res.oidoIzquierdo1000 ?? "",
      oi2000: res.oidoIzquierdo2000 ?? "",
      oi3000: res.oidoIzquierdo3000 ?? "",
      oi4000: res.oidoIzquierdo4000 ?? "",
      oi6000: res.oidoIzquierdo6000 ?? "",
      oi8000: res.oidoIzquierdo8000 ?? "",

      // Ojos
      visionCercaOd: res.visionCercaSinCorregirOd ?? "",
      visionCercaOi: res.visionCercaSinCorregirOi ?? "",
      visionCercaOdCorregida: res.visionCercaCorregidaOd ?? "",
      visionCercaOiCorregida: res.visionCercaCorregidaOi ?? "",

      visionLejosOd: res.visionLejosSinCorregirOd ?? "",
      visionLejosOi: res.visionLejosSinCorregirOi ?? "",
      visionLejosOdCorregida: res.visionLejosCorregidaOd ?? "",
      visionLejosOiCorregida: res.visionLejosCorregidaOi ?? "",

      visionColores: res.visionColores ?? "",
      enfermedadOculares: res.enfermedadesOcularesOftalmo ?? "",
      enfermedadOtros: res.enfermedadesOcularesOtrosOftalmo ?? "",
      reflejosPupilares: res.reflejosPupilares ?? "",
      visionBinocular: res.visionBinocular ?? "",

      // Observaciones Generales
      ectoscopia: res.ectoscopia ?? "",
      estadoMental: res.estadomental ?? "",
      anamnesis: res.anamnesis ?? "",

      // Dentadura
      piezasMalEstado: res.piezasMalEstado ?? "",
      piezasFaltan: "", //revisar

      //=============================================================================================
      //TERCERA TAB EXAMEN FISICO
      //=============================================================================================

      // Examen Físico por Sistemas
      cabeza: res.cabeza ?? "",
      cuello: res.cuello ?? "",
      boca: res.boca ?? "",
      faringe: res.faringe ?? "",
      nariz: res.nariz ?? "",
      oidos: res.oidos ?? "",
      marcha: res.marcha ?? "",
      piel: res.piel ?? "",
      aparatoRespiratorio: res.aparatoRespiratorio ?? "",
      apaCardiovascular: res.aparatoCardiovascular ?? "",
      aparatoDigestivo: res.aparatoDigestivo ?? "",
      aGenitourinario: res.aparatoGeiotourinario ?? "",
      aparatoLocomotor: res.aparatoLocomotor ?? "",
      miembrosSuperiores: res.miembrosSuperiores ?? "",
      miembrosInferiores: res.miembrosInferiores ?? "",
      sistemaLinfatico: res.sistemaLinfatico ?? "",
      sistemaNervioso: res.sistemaNervioso ?? "",
      columnaVertebral: res.columnaVertebral ?? "",

      // Otros Exámenes
      otrosExamenes: res.otrosExamenes ?? "",

      //=============================================================================================
      //CUARTA TAB RESULTADOS
      //=============================================================================================
      // Aptitud del Paciente
      aptitud: res.esApto
        ? "APTO"
        : noEsApto
        ? "NO APTO"
        : aptoRestriccion
        ? "RESTRICCION"
        : "",
      fechaAptitud: today, //revisar
      fechaVencimiento: today, //revisar
      restricciones: res.restricciones ?? "",

      // Recomendaciones y Restricciones
      corregirAgudezaVisualTotal: false, //revisar validar del texto
      corregirAgudezaVisual: false, //revisar validar del texto
      dietaHipocalorica: false, //revisar validar del texto
      evitarMovimientosDisergonomicos: false, //revisar validar del texto
      noTrabajoAltoRiesgo: false, //revisar validar del texto
      noTrabajoSobre18m: false, //revisar validar del texto
      usoEppAuditivo: false, //revisar validar del texto
      usoLentesCorrectorConducir: false, //revisar validar del texto
      usoLentesCorrectorTrabajo: false, //revisar validar del texto
      usoLentesCorrectorTrabajo18m: false, //revisar validar del texto
      ninguno: true, //revisar validar del texto
      noConducirVehiculos: false, //revisar validar del texto
      usoEppAuditivoGeneral: false, //revisar validar del texto

      // Médico que Certifica //BUSCADOR
      nombre_medico: userCompleto?.datos?.nombres_user?.toUpperCase(), //revisar
    }));
  }
};
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
      GetInfoPac(nro, set, token, sede);
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
