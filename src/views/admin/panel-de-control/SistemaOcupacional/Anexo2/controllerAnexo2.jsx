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
  "/api/v01/ct/anexos/anexo2/obtenerReporteAnexoAgroindustrial";
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
      codigoElectroCardiograma: res.codigoElectroCardiograma,
      nombre: res.nombres,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res.fechaNac), //necesito

      fechaExam: res.fechaInforme,
      contrata: res.contrata,
      empresa: res.empresa,

      ritmo: res.mensajeRitmo ?? "",
      fc: res.mensajeFC ?? "",
      eje: res.mensajeEje ?? "",
      pr: res.mensajePr ?? "",
      qrs: res.mensajeQrs ?? "",
      ondaP: res.mensajeOndaP ?? "",
      st: res.mensajeSt ?? "",
      ondaT: res.mensajeOndaT ?? "",
      qtc: res.mensajeQtC ?? "",

      informeCompleto: res.informeCompleto ?? "", //necesito
      conclusiones: res.conclusion ?? "",
      hallazgos: res.hallazgo ?? "",
      recomendaciones: res.recomendaciones ?? "",
    }));
  }
};
function validacionSistolica(sistolica1, diastolica1) {//txtObservacionesFichaMedica append
  if (sistolica1 >= 140 || diastolica1 >= 90) return "HTA NO CONTROLADA.\n";
  else return "";
}
function validacionAudiometria(txtOD500, diagnostico) { //txtObservacionesFichaMedica append
  if (txtOD500 != "" && txtOD500 != "N/A" && diagnostico != "NORMAL")
    return `${diagnostico}. USO DE EPP AUDITIVO. EVALUACION ANUAL.\n`;
  else if (txtOD500 == "N/A") return "NO PASO EXAMEN AUDIOMETRIA.\n";
  return "";
}
function validacionIMC(txtIMC) {//txtObservacionesFichaMedica append
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
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}`,
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
