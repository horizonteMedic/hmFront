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
  "/api/v01/ct/resultados/obtenerReporteInformeResultados";
const registrarUrl =
  "/api/v01/ct/resultados/registrarActualizarInformeResultados";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/resultados/obtenerResultadosPorFiltros";

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
      codigoResultados: res.codigoResultados,
      nombre: res.nombres,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res.fechaNac),

      fechaExam: res.fechaInforme,
      contrata: res.contrata,
      empresa: res.empresa,

      // Aptitud del Paciente
      aptitud: res.aptitud ?? "apto",
      fecha: res.fecha ?? "",
      fechaVencimiento: res.fechaVencimiento ?? "",
      restricciones: res.restricciones ?? "",

      // Recomendaciones y Restricciones
      corregirAgudezaVisualTotal: res.corregirAgudezaVisualTotal ?? false,
      corregirAgudezaVisual: res.corregirAgudezaVisual ?? false,
      dietaHipocalorica: res.dietaHipocalorica ?? false,
      evitarMovimientosDisergonomicos: res.evitarMovimientosDisergonomicos ?? false,
      noTrabajoAltoRiesgo: res.noTrabajoAltoRiesgo ?? false,
      noTrabajoSobre18m: res.noTrabajoSobre18m ?? false,
      usoEppAuditivo: res.usoEppAuditivo ?? false,
      usoLentesCorrectorConducir: res.usoLentesCorrectorConducir ?? false,
      usoLentesCorrectorTrabajo: res.usoLentesCorrectorTrabajo ?? false,
      usoLentesCorrectorTrabajo18m: res.usoLentesCorrectorTrabajo18m ?? false,
      ninguno: res.ninguno ?? false,
      noConducirVehiculos: res.noConducirVehiculos ?? false,
      usoEppAuditivoGeneral: res.usoEppAuditivoGeneral ?? false,

      // Resultados de Laboratorio
      vsg: res.vsg ?? "",
      glucosa: res.glucosa ?? "",
      creatinina: res.creatinina ?? "",
      marihuana: res.marihuana ?? "",
      cocaina: res.cocaina ?? "",
      hemoglobina: res.hemoglobina ?? "",

      // Estado del Paciente
      nroOrden: res.nroOrden ?? "",
      nombres: res.nombres ?? "",
      tipoExamen: res.tipoExamen ?? "",

      // Exámenes Realizados
      triaje: res.triaje ?? "",
      labClinico: res.labClinico ?? "",
      electrocardiograma: res.electrocardiograma ?? "",
      rxToraxPA: res.rxToraxPA ?? "",
      fichaAudiologica: res.fichaAudiologica ?? "",
      espirometria: res.espirometria ?? "",
      odontograma: res.odontograma ?? "",
      psicologia: res.psicologia ?? "",
      anexo7D: res.anexo7D ?? "",
      histOcupacional: res.histOcupacional ?? "",
      fichaAntPatologicos: res.fichaAntPatologicos ?? "",
      cuestionarioNordico: res.cuestionarioNordico ?? "",
      certTrabajoAltura: res.certTrabajoAltura ?? "",
      detencionSAS: res.detencionSAS ?? "",
      consentimientoDosaje: res.consentimientoDosaje ?? "",
      exRxSanguineos: res.exRxSanguineos ?? "",
      perimetroToraxico: res.perimetroToraxico ?? "",
      oftalmologia: res.oftalmologia ?? "",
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
    codigoResultados: form.codigoResultados,
    norden: form.norden,
    fechaInforme: form.fechaExam,
    
    // Aptitud del Paciente
    aptitud: form.aptitud,
    fecha: form.fecha,
    fechaVencimiento: form.fechaVencimiento,
    restricciones: form.restricciones,

    // Recomendaciones y Restricciones
    corregirAgudezaVisualTotal: form.corregirAgudezaVisualTotal,
    corregirAgudezaVisual: form.corregirAgudezaVisual,
    dietaHipocalorica: form.dietaHipocalorica,
    evitarMovimientosDisergonomicos: form.evitarMovimientosDisergonomicos,
    noTrabajoAltoRiesgo: form.noTrabajoAltoRiesgo,
    noTrabajoSobre18m: form.noTrabajoSobre18m,
    usoEppAuditivo: form.usoEppAuditivo,
    usoLentesCorrectorConducir: form.usoLentesCorrectorConducir,
    usoLentesCorrectorTrabajo: form.usoLentesCorrectorTrabajo,
    usoLentesCorrectorTrabajo18m: form.usoLentesCorrectorTrabajo18m,
    ninguno: form.ninguno,
    noConducirVehiculos: form.noConducirVehiculos,
    usoEppAuditivoGeneral: form.usoEppAuditivoGeneral,

    // Resultados de Laboratorio
    vsg: form.vsg,
    glucosa: form.glucosa,
    creatinina: form.creatinina,
    marihuana: form.marihuana,
    cocaina: form.cocaina,
    hemoglobina: form.hemoglobina,

    // Estado del Paciente
    nroOrden: form.nroOrden,
    nombres: form.nombres,
    tipoExamen: form.tipoExamen,

    // Exámenes Realizados
    triaje: form.triaje,
    labClinico: form.labClinico,
    electrocardiograma: form.electrocardiograma,
    rxToraxPA: form.rxToraxPA,
    fichaAudiologica: form.fichaAudiologica,
    espirometria: form.espirometria,
    odontograma: form.odontograma,
    psicologia: form.psicologia,
    anexo7D: form.anexo7D,
    histOcupacional: form.histOcupacional,
    fichaAntPatologicos: form.fichaAntPatologicos,
    cuestionarioNordico: form.cuestionarioNordico,
    certTrabajoAltura: form.certTrabajoAltura,
    detencionSAS: form.detencionSAS,
    consentimientoDosaje: form.consentimientoDosaje,
    exRxSanguineos: form.exRxSanguineos,
    perimetroToraxico: form.perimetroToraxico,
    oftalmologia: form.oftalmologia,

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
  const jasperModules = import.meta.glob("../../../../../jaspers/Resultados/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/Resultados"
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
          "Este paciente ya cuenta con registros de Resultados.",
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
