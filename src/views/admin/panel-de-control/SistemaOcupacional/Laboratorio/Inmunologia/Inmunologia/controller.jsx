import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const obtenerReporteUrl = "/api/v01/ct/inmunologia/obtenerReporteInmunologia";
const registrarUrl = "/api/v01/ct/inmunologia/registrarActualizarInmunologia";

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
      fecha: res.fecha ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres,
      edad: res.edad ?? prev.edad,
      tificoO: res.txtTificoO ?? "1/40",
      tificoH: res.txtTificoH ?? "1/40",
      paratificoA: res.txtParatificoA ?? "1/40",
      paratificoB: res.txtParatificoB ?? "1/40",
      brucella: res.txtBrucella ?? "1/40",
      hepatitis: res.txtHepatitis ? true : false,
      hepatitisA: res.txtHepatitis ?? "",
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
    fecha: form.fecha,
    txtTificoO: form.tificoO,
    txtTificoH: form.tificoH,
    txtParatificoA: form.paratificoA,
    txtParatificoB: form.paratificoB,
    txtBrucella: form.brucella,
    txtHepatitis: form.hepatitisA,
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
          "Este paciente ya cuenta con registros de Inmunología.",
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