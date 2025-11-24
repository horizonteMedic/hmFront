import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const obtenerReporteUrl = "/api/v01/ct/inmunologia/obtenerReporteHepatitis";
const registrarUrl = "/api/v01/ct/inmunologia/registrarActualizarHepatitis";

export const GetInfoServicio = async (nro, tabla, set, token, onFinish = () => { }) => {
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
      fecha: res.fechaExamen ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres,
      edad: res.edad ?? prev.edad,
      hav: res.txtHepatitisa !== "" && res.txtHepatitisa !== null ? true : false,
      hbsag: res.txtHepatitisb !== "" && res.txtHepatitisb !== null ? true : false,
      marca: res.txtMarca ?? "RAPID TEST - MONTEST",
      resultadoHAV: res.txtHepatitisa ?? "",
      resultadoHAVRadio: res.txtHepatitisa ?? "",
      resultadoHBsAg: res.txtHepatitisb ?? "",
      resultadoHBsAgRadio: res.txtHepatitisb ?? "",
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, datosFooter) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    norden: form.norden,
    fechaExamen: form.fecha,
    txtMarca: form.marca,
    txtHepatitisa: form.resultadoHAV,
    txtHepatitisb: form.resultadoHBsAg,
    userRegistro: user,
    userMedicoOcup: "",
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Inmunologia/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Inmunologia"
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
          "Este paciente ya cuenta con registros de Hepatitis.",
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