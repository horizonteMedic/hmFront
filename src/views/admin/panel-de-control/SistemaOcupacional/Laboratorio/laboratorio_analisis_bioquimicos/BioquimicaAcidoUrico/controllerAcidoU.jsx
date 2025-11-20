import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const obtenerReporteUrl = "/api/v01/ct/analisisBioquimico/obtenerReporteAcidoUrico";
const registrarUrl = "/api/v01/ct/analisisBioquimico/registrarActualizarAcidoUrico";
const tabla = 'ac_bioquimica2022';

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
      prueba: res.txtPrueba ?? "ÁCIDO ÚRICO SÉRICO",
      muestra: res.txtMuestra ?? "SUERO",
      resultado: res.txtResultado ?? "",
    }));
  }
};

export const SubmitDataService = async (form, token, user, limpiar) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    norden: form.norden,
    fecha: form.fecha,
    txtPrueba: form.prueba,
    txtMuestra: form.muestra,
    txtResultado: form.resultado,
    userRegistro: user,
    userMedicoOcup: "",
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token);
  });
};

export const PrintHojaR = (nro, token) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/AnalisisBioquimicos/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/AnalisisBioquimicos"
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
          "Este paciente ya cuenta con registros de Ácido Úrico",
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
