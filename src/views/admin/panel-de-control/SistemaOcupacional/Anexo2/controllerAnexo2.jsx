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

    cabeza: "string",
    nariz: "string",
    cuello: "string",
    perimetro: "string",
    boca: "string",
    oidos: "string",
    faringe: "string",
    visionColores: "string",
    enfermedadesOculares: "string",
    reflejosPupilares: "string",
    visionBinocular: "string",
    miembrosSuperiores: "string",
    miembrosInferiores: "string",
    ectoscopia: "string",
    estadoMental: "string",
    anamnesis: "string",
    marcha: "string",
    columnaVertebral: "string",
    aparatoRespiratorio: "string",
    aparatoCardiovascular: "string",
    aparatoDigestivo: "string",
    aparatoGeiotourinario: "string",
    aparatoLocomotor: "string",
    sistemaLinfatico: "string",
    piel: "string",
    observacionesFichaMedica: "string",
    conclusion: "string",
    edad: "string",
    enfermedadesOcularesOtros: "string",
    sistemaNervioso: "string",
    otrosExamenes: "string",
    restricciones: "string",
    esApto: true,
    noEsApto: true,
    aptoRestriccion: true,
    fechaDesde: "2025-09-06",
    fechaVence: "2025-09-06",
    medico: "string",
    userRegistro: "string",
    accidentes: [
      {
        codigoAnexo: 0,
        enfermedad: "string",
        asociadoTrabajo: "string",
        anio: "string",
        diasDescanso: "string",
        fecha: "string",
        userRegistro: "string",
      },
    ],
  };

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
