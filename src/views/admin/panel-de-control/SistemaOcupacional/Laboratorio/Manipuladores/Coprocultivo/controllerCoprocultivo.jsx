import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";

const obtenerReporteUrl =
  "/api/v01/ct/manipuladores/obtenerReporteCoprocultivo";
const registrarUrl =
  "/api/v01/ct/manipuladores/registrarActualizarManipuladores";

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
      norden: res.norden ?? "",
      fecha: res.fecha,

      nombreExamen: res.nombreExamen ?? "",
      dni: res.dni ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edad ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente,
      nivelEstudios: res.nivelEstudioPaciente,
      // Datos Laborales
      empresa: res.empresa,
      contrata: res.contrata,
      ocupacion: res.ocupacionPaciente,
      cargoDesempenar: res.cargoPaciente,

      muestra: res.txtmuestra ?? "HECES",
      color: res.txtcolor ?? "",
      consistencia: res.txtconsistencia ?? "",
      moco_fecal: res.txtmoco_fecal ?? "",
      sangrev: res.txtsangrev ?? "",
      restosa: res.txtrestosa ?? "",
      leucocitos: res.txtleucocitos ?? "",
      hematies: res.txthematies ?? "",
      parasitos: res.txtparasitos ?? "",
      gotasg: res.txtgotasg ?? "",
      levaduras: res.txtlevaduras ?? "",
      identificacion: res.txtidentificacion ?? "Escherichia coli(*)",
      florac: res.txtflorac ?? "",
      resultado: res.txtresultado ?? "",
      observaciones: res.txtobservaciones ?? prev.observaciones,

      user_medicoFirma: res.usuarioFirma,
      user_doctorAsignado: res.doctorAsignado,
    }));
  }
};

export const SubmitDataService = async (
  form,
  token,
  user,
  limpiar,
  tabla
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
    txthematies: form.hematies,
    txtparasitos: form.parasitos,
    txtgotasg: form.gotasg,
    txtlevaduras: form.levaduras,
    txtidentificacion: form.identificacion,
    txtflorac: form.florac,
    txtresultado: form.resultado,
    txtobservaciones: form.observaciones,
    user_registro: user,
    user_medico_ocup: "",

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla);
  });
};

export const PrintHojaR = (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Manipuladores/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
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
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      edad: res.edad,
      ocupacion: res.areaO ?? "",
      nombreExamen: res.nomExam ?? "",
      cargoDesempenar: res.cargo ?? "",
      lugarNacimiento: res.lugarNacimiento ?? "",
      sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
    }));
  }
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};