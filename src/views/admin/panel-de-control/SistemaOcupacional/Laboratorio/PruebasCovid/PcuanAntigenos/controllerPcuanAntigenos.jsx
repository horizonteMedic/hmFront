import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { URLAzure } from "../../../../../../config/config";

const obtenerReporteUrl = "/api/v01/ct/pruebasCovid/obtenerReporteExamenInmunologico";
const registrarUrl = "/api/v01/ct/pruebasCovid/registrarActualizarExamenInmunologico";

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
      dni: res.dni ?? prev.dni,
      edad: res.edad ?? prev.edad,
      marca: res.cboMarca ?? "",
      doctor: res.medico ?? "N/A",
      valor: res.valorIgm ?? "",
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
    cuantitativoAntigeno: true,
    cboMarca: form.marca,
    valorIgm: form.valor || "",
    chkIgmReactivo: false,
    chkIgmNoReactivo: false,
    chkIggReactivo: false,
    chkIggNoReactivo: false,
    chkInvalido: false,
    valorIgg: 0,
    medico: "",
    fechaSintomas: form.fecha,
    formatoMarsa: false,
    user_registro: user,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla, datosFooter);
  });
};

export const PrintHojaR = (nro, token, tabla, datosFooter) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Covid/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    datosFooter,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Covid"
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
          "Este paciente ya cuenta con registros de Prueba Cuantitativa de Antígenos.",
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
      dni: res.dni ?? "",
      edad: res.edad ?? "",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

