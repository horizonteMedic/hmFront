import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";
import { getHoraActual } from "../../../../../utils/helpers";

const obtenerReporteUrl =
  "/api/v01/ct/rayosX/obtenerReporteConsentimientoRayosX";
const registrarUrl =
  "/api/v01/ct/rayosX/registrarActualizarConsentimientoRayosX";

export const GetInfoServicio = async (
  nro,
  tabla,
  set,
  token,
  onFinish = () => { }
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
    }));
  }
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
          "Este paciente ya cuenta con registros de Consentimiento.",
          "warning"
        );
      });
    }
  );
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
    await Swal.fire("Error", "Datos incompletos", "error");
    return;
  }
  const body = {
    norden: form.norden,
    fecha: form.fecha,
    hora: getHoraActual(),
    userRegistro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../jaspers/RayosX/consentimientoMujer/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/RayosX/consentimientoMujer"
  );
};

export const GetInfoPac = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);

  if (res) {
    set((prev) => ({
      ...prev,
      ...res,
      nombres: res.nombresApellidos ?? "",
      ocupacion: res.cargo ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
