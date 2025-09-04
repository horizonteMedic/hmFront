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
  "/api/v01/ct/examenfisico/obtenerReporteInformeExamenFisico";
const registrarUrl =
  "/api/v01/ct/examenfisico/registrarActualizarInformeExamenFisico";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/examenfisico/obtenerExamenFisicoPorFiltros";

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
      codigoExamenFisico: res.codigoExamenFisico,
      nombre: res.nombres,
      edad: res.edad + " años",
      fechaNac: formatearFechaCorta(res.fechaNac),

      fechaExam: res.fechaInforme,
      contrata: res.contrata,
      empresa: res.empresa,

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
      apaCardiovascular: res.apaCardiovascular ?? "",
      aparatoDigestivo: res.aparatoDigestivo ?? "",
      aGenitourinario: res.aGenitourinario ?? "",
      aparatoLocomotor: res.aparatoLocomotor ?? "",
      miembrosSuperiores: res.miembrosSuperiores ?? "",
      miembrosInferiores: res.miembrosInferiores ?? "",
      sistemaLinfatico: res.sistemaLinfatico ?? "",
      sistemaNervioso: res.sistemaNervioso ?? "",
      columnaVertebral: res.columnaVertebral ?? "",

      // Otros Exámenes
      otrosExamenes: res.otrosExamenes ?? "",

      // Médico que Certifica
      medicoCertifica: res.medicoCertifica ?? "",
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
    codigoExamenFisico: form.codigoExamenFisico,
    norden: form.norden,
    fechaInforme: form.fechaExam,
    
    // Examen Físico por Sistemas
    cabeza: form.cabeza,
    cuello: form.cuello,
    boca: form.boca,
    faringe: form.faringe,
    nariz: form.nariz,
    oidos: form.oidos,
    marcha: form.marcha,
    piel: form.piel,
    aparatoRespiratorio: form.aparatoRespiratorio,
    apaCardiovascular: form.apaCardiovascular,
    aparatoDigestivo: form.aparatoDigestivo,
    aGenitourinario: form.aGenitourinario,
    aparatoLocomotor: form.aparatoLocomotor,
    miembrosSuperiores: form.miembrosSuperiores,
    miembrosInferiores: form.miembrosInferiores,
    sistemaLinfatico: form.sistemaLinfatico,
    sistemaNervioso: form.sistemaNervioso,
    columnaVertebral: form.columnaVertebral,

    // Otros Exámenes
    otrosExamenes: form.otrosExamenes,

    // Médico que Certifica
    medicoCertifica: form.medicoCertifica,

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
  const jasperModules = import.meta.glob("../../../../../jaspers/ExamenFisico/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/ExamenFisico"
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
          "Este paciente ya cuenta con registros de Examen Físico.",
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
