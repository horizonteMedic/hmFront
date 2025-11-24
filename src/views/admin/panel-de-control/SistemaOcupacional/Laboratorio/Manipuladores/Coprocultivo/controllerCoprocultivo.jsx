import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const obtenerReporteUrl =
  "/api/v01/ct/manipuladores/obtenerReporteCoprocultivo";
const registrarUrl =
  "/api/v01/ct/manipuladores/registrarActualizarManipuladores";

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
      norden: res.norden ?? "",
      fecha: res.fecha ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres,
      edad: res.edad ?? prev.edad,
      muestra: res.txtmuestra ?? "HECES",
      color: res.txtcolor ?? "",
      consistencia: res.txtconsistencia ?? "",
      moco_fecal: res.txtmoco_fecal ?? "",
      sangrev: res.txtsangrev ?? "",
      restosa: res.txtrestosa ?? "",
      leucocitos: res.txtleucocitos ?? "",
      leucocitos_count: res.leucocitos_count ?? "",
      hematies: res.txthematies ?? "",
      hematies_count: res.hematies_count ?? "",
      parasitos: res.txtparasitos ?? "",
      gotasg: res.txtgotasg ?? "",
      levaduras: res.txtlevaduras ?? "",
      identificacion: res.txtidentificacion ?? "Escherichia coli(*)",
      florac: res.txtflorac ?? "",
      resultado: res.txtresultado ?? "",
      observaciones: res.txtobservaciones ?? prev.observaciones,
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
    norden: form.norden,
    fecha: form.fecha,
    txtmuestra: form.muestra,
    txtcolor: form.color,
    txtconsistencia: form.consistencia,
    txtmoco_fecal: form.moco_fecal,
    txtsangrev: form.sangrev,
    txtrestosa: form.restosa,
    txtleucocitos: form.leucocitos,
    leucocitos_count: form.leucocitos_count,
    txthematies: form.hematies,
    hematies_count: form.hematies_count,
    txtparasitos: form.parasitos,
    txtgotasg: form.gotasg,
    txtlevaduras: form.levaduras,
    txtidentificacion: form.identificacion,
    txtflorac: form.florac,
    txtresultado: form.resultado,
    txtobservaciones: form.observaciones,
    user_registro: user,
    user_medico_ocup: "",
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Manipuladores/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Manipuladores"
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
      GetInfoPac(nro, set, token, sede);
    },
    () => {
      GetInfoServicio(nro, tabla, set, token, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Coprocultivo",
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
      nombres: res.nombresApellidos ?? "",
      edad: res.edad ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};