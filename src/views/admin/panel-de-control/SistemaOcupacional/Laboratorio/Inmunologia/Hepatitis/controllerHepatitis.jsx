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
      fecha: res.fechaExamen,

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

      tipoHepatitis: res.txtHepatitisa !== null && res.txtHepatitisa !== "" ? "A" :
        res.txtHepatitisb !== null && res.txtHepatitisb !== "" ? "B" :
          res.hepatitisc !== null && res.hepatitisc !== "" ? "C" : "A",

      marca: res.txtMarca ?? "RAPID TEST - MONTEST",
      resultadoHAV: res.txtHepatitisa ?? "",
      resultadoHBsAg: res.txtHepatitisb ?? "",
      resultadoVHC: res.hepatitisc ?? "",

      user_medicoFirma: res.usuarioFirma,
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
    hepatitisc: form.resultadoVHC,
    userRegistro: user,
    userMedicoOcup: "",

    usuarioFirma: form.user_medicoFirma,
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