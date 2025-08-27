import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  getInfoTablaDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const obtenerReporteUrl =
  "/api/v01/ct/electroCardiograma/obtenerReporteInformeElectroCardiograma";
const registrarUrl =
  "/api/v01/ct/electroCardiograma/registrarActualizarInformeElectroCardiograma";
const obtenerReporteInfoTablaUrl =
  "/api/v01/ct/electroCardiograma/obtenerElectroCardiogramaPorFiltros";

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
    codigoElectroCardiograma: form.codigoElectroCardiograma,
    norden: form.norden,
    fechaInforme: form.fechaExam,
    informeCompleto: form.informeCompleto,
    mensajeRitmo: form.ritmo,
    mensajePr: form.pr,
    mensajeFC: form.fc,
    mensajeQtC: form.qtc,
    mensajeQrs: form.qrs,
    mensajeOndaP: form.ondaP,
    mensajeSt: form.st,
    mensajeOndaT: form.ondaT,
    mensajeEje: form.eje,
    hallazgo: form.hallazgos,
    conclusion: form.conclusiones,
    recomendaciones: form.recomendaciones,
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
  const jasperModules = import.meta.glob("../../../../jaspers/EKG/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../jaspers/EKG"
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
          "Este paciente ya cuenta con registros de EKG.",
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

export const getInfoTabla = (nombreSearch, codigoSearch, setData, token) => {
  getInfoTablaDefault(
    nombreSearch,
    codigoSearch,
    setData,
    token,
    obtenerReporteInfoTablaUrl
  );
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
