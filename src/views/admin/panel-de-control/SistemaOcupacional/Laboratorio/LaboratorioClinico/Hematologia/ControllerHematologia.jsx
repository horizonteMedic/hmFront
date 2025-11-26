import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  PrintHojaRDefault,
  SubmitDataServiceDefault,
  VerifyTRDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteLabHematograma";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLabHematograma"

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
      fecha: res.fechaExamen ?? prev.fecha,

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

      // Pruebas
      hemoglobina: res.txtHemoglobina ?? "",
      hematocrito: res.txtHematocrito ?? "",
      hematies: res.txtHematies ?? "",
      volumen_corpuscular_medio: res.txtVolumen ?? "",
      hemoglobina_corpuscular_media: res.txtHemocorpuscular ?? "",
      concentracion_hemoglobina_corpuscular: res.txtConcentracion ?? "",
      leucocitos: res.txtLeucocitos ?? "",
      plaquetas: res.txtPlaquetas ?? "",
      // Diferencial
      neutrofilos: res.txtNeutrofilos ?? "",
      abastonados: res.txtAbastonados ?? "",
      segmentados: res.txtSegmentados ?? "",
      monocitos: res.txtMonocitos ?? "",
      eosinofilos: res.txtEosinofios ?? "",
      basofilos: res.txtBasofilos ?? "",
      linfocitos: res.txtLinfocitos ?? "",
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
    fechaExamen: form.fecha,
    txtHemoglobina: form.hemoglobina,
    txtHematocrito: form.hematocrito,
    txtHematies: form.hematies,
    txtVolumen: form.volumen_corpuscular_medio,
    txtHemocorpuscular: form.hemoglobina_corpuscular_media,
    txtConcentracion: form.concentracion_hemoglobina_corpuscular,
    txtLeucocitos: form.leucocitos,
    txtNeutrofilos: form.neutrofilos,
    txtAbastonados: form.abastonados,
    txtSegmentados: form.segmentados,
    txtMonocitos: form.monocitos,
    txtEosinofios: form.eosinofilos,
    txtBasofilos: form.basofilos,
    txtLinfocitos: form.linfocitos,
    txtPlaquetas: form.plaquetas,
    userRegistro: user,
    userMedicoOcup: "",
    norden: form.norden
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    PrintHojaR(form.norden, token, tabla);
  });
};

export const PrintHojaR = async (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/LaboratorioClinico/*.jsx"
  );
  await PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/LaboratorioClinico"
  );
};
export const VerifyTR = async (nro, tabla, token, set, sede) => {
  await VerifyTRDefault(
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
          "Este paciente ya cuenta con registros de Hematología",
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