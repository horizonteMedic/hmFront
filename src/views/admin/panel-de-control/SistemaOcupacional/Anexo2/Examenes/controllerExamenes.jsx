import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  getInfoTablaDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { getFetch } from "../../../../../utils/apiHelpers";

const obtenerReporteUrl =
  "/api/v01/ct/examenes/obtenerReporteInformeExamenes";
const registrarUrl =
  "/api/v01/ct/examenes/registrarActualizarInformeExamenes";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/examenes/obtenerExamenesPorFiltros";

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
      codigoExamenes: res.codigoExamenes,
      nombre: res.nombres,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res.fechaNac),

      fechaExam: res.fechaInforme,
      contrata: res.contrata,
      empresa: res.empresa,

      // Función Respiratoria
      fvc: res.fvc ?? "",
      fev1: res.fev1 ?? "",
      fev1Fvc: res.fev1Fvc ?? "",
      fef2575: res.fef2575 ?? "",
      conclusionRespiratoria: res.conclusionRespiratoria ?? "",
      normalRespiratoria: res.normalRespiratoria ?? false,
      pObstruccion: res.pObstruccion ?? false,

      // Medidas Generales
      temperatura: res.temperatura ?? "",
      cintura: res.cintura ?? "",
      cadera: res.cadera ?? "",
      icc: res.icc ?? "",

      // Signos Vitales
      frecuenciaRespiratoria: res.frecuenciaRespiratoria ?? "",
      frecuenciaCardiaca: res.frecuenciaCardiaca ?? "",
      saturacionO2: res.saturacionO2 ?? "",
      perimetro: res.perimetro ?? "",

      // Audiometría - Oído Derecho
      od500: res.od500 ?? "",
      od1000: res.od1000 ?? "",
      od2000: res.od2000 ?? "",
      od3000: res.od3000 ?? "",
      od4000: res.od4000 ?? "",
      od6000: res.od6000 ?? "",
      od8000: res.od8000 ?? "",

      // Audiometría - Oído Izquierdo
      oi500: res.oi500 ?? "",
      oi1000: res.oi1000 ?? "",
      oi2000: res.oi2000 ?? "",
      oi3000: res.oi3000 ?? "",
      oi4000: res.oi4000 ?? "",
      oi6000: res.oi6000 ?? "",
      oi8000: res.oi8000 ?? "",

      // Ojos
      visionCercaOd: res.visionCercaOd ?? "",
      visionCercaOi: res.visionCercaOi ?? "",
      visionCercaOdCorregida: res.visionCercaOdCorregida ?? "",
      visionCercaOiCorregida: res.visionCercaOiCorregida ?? "",
      visionLejosOd: res.visionLejosOd ?? "",
      visionLejosOi: res.visionLejosOi ?? "",
      visionLejosOdCorregida: res.visionLejosOdCorregida ?? "",
      visionLejosOiCorregida: res.visionLejosOiCorregida ?? "",
      visionColores: res.visionColores ?? "",
      enfermedadOculares: res.enfermedadOculares ?? "",
      enfermedadOtros: res.enfermedadOtros ?? "",
      reflejosPupilares: res.reflejosPupilares ?? "",
      visionBinocular: res.visionBinocular ?? "",

      // Dentadura
      piezasMalEstado: res.piezasMalEstado ?? "",
      piezasFaltan: res.piezasFaltan ?? "",

      // Presión Arterial
      presionSistolica: res.presionSistolica ?? "",
      presionDiastolica: res.presionDiastolica ?? "",

      // Grupo Sanguíneo
      grupoSanguineo: res.grupoSanguineo ?? "",
      rh: res.rh ?? "",

      // Observaciones Generales
      ectoscopia: res.ectoscopia ?? "",
      estadoMental: res.estadoMental ?? "",
      anamnesis: res.anamnesis ?? "",

      // Obesidad
      ect: res.ect ?? "",
      est: res.est ?? "",
      antecedentesObesidad: res.antecedentesObesidad ?? "",
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
    codigoExamenes: form.codigoExamenes,
    norden: form.norden,
    fechaInforme: form.fechaExam,
    
    // Función Respiratoria
    fvc: form.fvc,
    fev1: form.fev1,
    fev1Fvc: form.fev1Fvc,
    fef2575: form.fef2575,
    conclusionRespiratoria: form.conclusionRespiratoria,
    normalRespiratoria: form.normalRespiratoria,
    pObstruccion: form.pObstruccion,

    // Medidas Generales
    temperatura: form.temperatura,
    cintura: form.cintura,
    cadera: form.cadera,
    icc: form.icc,

    // Signos Vitales
    frecuenciaRespiratoria: form.frecuenciaRespiratoria,
    frecuenciaCardiaca: form.frecuenciaCardiaca,
    saturacionO2: form.saturacionO2,
    perimetro: form.perimetro,

    // Audiometría - Oído Derecho
    od500: form.od500,
    od1000: form.od1000,
    od2000: form.od2000,
    od3000: form.od3000,
    od4000: form.od4000,
    od6000: form.od6000,
    od8000: form.od8000,

    // Audiometría - Oído Izquierdo
    oi500: form.oi500,
    oi1000: form.oi1000,
    oi2000: form.oi2000,
    oi3000: form.oi3000,
    oi4000: form.oi4000,
    oi6000: form.oi6000,
    oi8000: form.oi8000,

    // Ojos
    visionCercaOd: form.visionCercaOd,
    visionCercaOi: form.visionCercaOi,
    visionCercaOdCorregida: form.visionCercaOdCorregida,
    visionCercaOiCorregida: form.visionCercaOiCorregida,
    visionLejosOd: form.visionLejosOd,
    visionLejosOi: form.visionLejosOi,
    visionLejosOdCorregida: form.visionLejosOdCorregida,
    visionLejosOiCorregida: form.visionLejosOiCorregida,
    visionColores: form.visionColores,
    enfermedadOculares: form.enfermedadOculares,
    enfermedadOtros: form.enfermedadOtros,
    reflejosPupilares: form.reflejosPupilares,
    visionBinocular: form.visionBinocular,

    // Dentadura
    piezasMalEstado: form.piezasMalEstado,
    piezasFaltan: form.piezasFaltan,

    // Presión Arterial
    presionSistolica: form.presionSistolica,
    presionDiastolica: form.presionDiastolica,

    // Grupo Sanguíneo
    grupoSanguineo: form.grupoSanguineo,
    rh: form.rh,

    // Observaciones Generales
    ectoscopia: form.ectoscopia,
    estadoMental: form.estadoMental,
    anamnesis: form.anamnesis,

    // Obesidad
    ect: form.ect,
    est: form.est,
    antecedentesObesidad: form.antecedentesObesidad,

    edadPaciente: form.edad?.replace(" años", ""),
    userRegistro: user,
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
  const jasperModules = import.meta.glob("../../../../../jaspers/Examenes/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/Examenes"
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
      GetInfoPac(nro, set, token, sede);
    },
    () => {
      //Tiene registro
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Exámenes.",
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

export const getInfoTabla = (
  nombreSearch,
  codigoSearch,
  usuario,
  setData,
  token
) => {
  try {
    getFetch(
      `${obtenerReporteInfoTablaUrl}?${codigoSearch == "" ? "" : `&nOrden=${codigoSearch}`
      }
    ${nombreSearch == "" ? "" : `&nombres=${nombreSearch}`}&usuario=${usuario}`,
      token
    ).then((res) => {
      console.log("pros", res);
      setData(res);
    });
  } catch (error) {
    console.error("Error en getInfoTabla:", error);
    Swal.fire(
      "Error",
      "Ocurrió un error al obtener los datos de la tabla",
      "error"
    );
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
