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
  "/api/v01/ct/toxicologia/obtenerReportePanel10D";
const registrarUrl =
  "/api/v01/ct/toxicologia/registrarActualizarPanel10D";

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

      valueM: res.txtMarihuana ?? "NEGATIVO",
      valueC: res.txtCocaina ?? "NEGATIVO",
      valueAn: res.txtAnfetamina ?? "NEGATIVO",
      valueMet: res.txtMetanfetamina ?? "NEGATIVO",
      valueBen: res.txtBenzodiacepina ?? "NEGATIVO",
      valueOpi: res.txtOpiaceos ?? "NEGATIVO",
      valueBar: res.txtBarbituricos ?? "NEGATIVO",
      valueMetadona: res.txtMetadona ?? "NEGATIVO",
      valueFenci: res.txtFenciclidina ?? "NEGATIVO",
      valueAnti: res.txtAntidepresivos ?? "NEGATIVO",
      metodo: res.txtMetodo ?? "INMUNOCROMATOGRAFICO",

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
    fechaExamen: form.fecha,
    txtMetodo: form.metodo,
    txtCocaina: form.valueC,
    txtMarihuana: form.valueM,
    txtAnfetamina: form.valueAn,
    txtMetanfetamina: form.valueMet,
    txtBenzodiacepina: form.valueBen,
    txtOpiaceos: form.valueOpi,
    txtBarbituricos: form.valueBar,
    txtMetadona: form.valueMetadona,
    txtFenciclidina: form.valueFenci,
    txtAntidepresivos: form.valueAnti,
    userMedicoOcup: "",
    userRegistro: user,

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla);
  });
};

export const GetInfoServicioTabla = (nro, tabla, set, token) => {
  GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const PrintHojaR = (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Toxicologia/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Toxicologia"
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
          "Este paciente ya cuenta con registros de Panel 10D.",
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