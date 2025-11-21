import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";

const obtenerReporteUrl = "/api/v01/ct/analisisBioquimico/obtenerReportePerfilHepatico";
const registrarUrl = "/api/v01/ct/analisisBioquimico/registrarActualizarPerfilHepatico";
const tabla = 'perfil_hepatico';

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
      tgo: res.txtrTgo ?? "",
      tgp: res.txtrTgp ?? "",
      ggt: res.txtrGgt ?? "",
      fosfAlc: res.txtrFosfalcalina ?? "",
      biliTotal: res.txtrBilirrTotal ?? "",
      biliInd: res.txtrBilirrIndirecta ?? "",
      biliDir: res.txtrBilirrDirecta ?? "",
      protTot: res.txtrProteTotales ?? "",
      albumina: res.txtrAlbumina ?? "",
      globSer: res.txtrGlobulina ?? "",
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
    fechaExamen: form.fecha,
    txtrTgo: form.tgo,
    txtrTgp: form.tgp,
    txtrGgt: form.ggt,
    txtrFosfalcalina: form.fosfAlc,
    txtrBilirrTotal: form.biliTotal,
    txtrBilirrDirecta: form.biliDir,
    txtrBilirrIndirecta: form.biliInd,
    txtrProteTotales: form.protTot,
    txtrAlbumina: form.albumina,
    txtrGlobulina: form.globSer,
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
          "Este paciente ya cuenta con registros de Perfil Hepático",
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
