import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { GetTableAnalBio } from "../model/model";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/reporteAnalisisBioquimico";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarAnalisisBioquimico";
const tabla = 'analisis_bioquimicos';

export const GetInfoServicio = async (nro, tabla, set, token, setMed, onFinish = () => { }) => {
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
      paciente: res.nombres ?? "",
      medico: res.txtReponsable ?? "",
      creatinina: res.txtCreatinina ?? "",
      colesterolTotal: res.txtColesterol ?? "",
      ldl: res.txtLdlColesterol !== undefined && res.txtLdlColesterol !== null && res.txtLdlColesterol !== '' ? (parseFloat(res.txtLdlColesterol).toFixed(2)) : '',
      hdl: res.txtHdlColesterol !== undefined && res.txtHdlColesterol !== null && res.txtHdlColesterol !== '' ? (parseFloat(res.txtHdlColesterol).toFixed(2)) : '',
      vldl: res.txtVldlColesterol !== undefined && res.txtVldlColesterol !== null && res.txtVldlColesterol !== '' ? (parseFloat(res.txtVldlColesterol).toFixed(2)) : '',
      trigliceridos: res.txtTrigliseridos ?? "",
    }));
    if (setMed && res.txtReponsable) {
      setMed(res.txtReponsable);
    }
  }
};

export const SubmitDataService = async (form, token, user, limpiar, tabla, RefreshTable) => {
  if (!form.norden) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    codAb: form.codAb ? form.codAb : null,
    fechaAb: form.fecha,
    txtReponsable: form.medico,
    txtCreatinina: form.creatinina,
    txtColesterol: form.colesterolTotal,
    txtLdlColesterol: form.ldl,
    txtHdlColesterol: form.hdl,
    txtVldlColesterol: form.vldl,
    txtTrigliseridos: form.trigliceridos,
    userRegistro: user,
    userMedicoOcup: "",
    nOrden: form.norden,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    if (RefreshTable) RefreshTable();
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

export const VerifyTR = async (nro, tabla, token, set, sede, setMed) => {
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
      GetInfoServicio(nro, tabla, set, token, setMed, () => {
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Análisis Bioquímicos",
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
      paciente: res.nombresApellidos ?? "",
    }));
  }
};

export const GetInfoPacAnalisisBio = async (nro, tabla, set, token, setMed) => {
  LoadingDefault('Importando Datos');
  await GetInfoServicio(nro, tabla, set, token, setMed, () => {
    Swal.close();
  });
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export { GetTableAnalBio };
