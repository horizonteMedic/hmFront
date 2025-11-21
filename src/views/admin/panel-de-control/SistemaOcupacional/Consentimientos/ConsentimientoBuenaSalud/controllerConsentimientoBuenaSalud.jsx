import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../utils/functionUtils";

const obtenerReporteUrl =
  "/api/v01/ct/anexos/anexo16/obtenerReporteConsentimientoBuenaSalud";
const registrarUrl =
  "/api/v01/ct/anexos/anexo16/registrarActualizarConsentimientoBuenaSalud";

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
      norden: res.norden ?? prev.norden ?? "",
      fecha: res.fecha ?? prev.fecha,
      nombres: res.nombres ?? prev.nombres ?? "",
      edad: res.edad ?? prev.edad ?? "",
      dni: res.dni ?? prev.dni ?? "",
      // Preservar el texto estático si no viene del backend
      textoFinalConsentimiento: res.textoFinalConsentimiento ?? prev.textoFinalConsentimiento ?? "",
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
    hora: new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    userRegistro: user
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
  const jasperModules = import.meta.glob("../../../../../jaspers/ModuloConsentimientos/ConsentimientoBuenaSalud/*.jsx");
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../jaspers/ModuloConsentimientos/ConsentimientoBuenaSalud"
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
          "Este paciente ya cuenta con registros de Consentimiento de Buena Salud.",
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
      nombres: res.nombresApellidos ?? prev.nombres ?? "",
      dni: res.dni ?? prev.dni ?? "",
      edad: res.edad ? `${res.edad} años` : prev.edad ?? "",
      // Preservar el texto estático
      textoFinalConsentimiento: prev.textoFinalConsentimiento ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
