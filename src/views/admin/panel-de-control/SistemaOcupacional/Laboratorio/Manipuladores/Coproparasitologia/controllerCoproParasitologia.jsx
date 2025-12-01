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
  "/api/v01/ct/manipuladores/obtenerReporteCoproparasitologico";
const registrarUrl =
  "/api/v01/ct/manipuladores/registrarActualizarManipuladoresCoproparasitologico";

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

      tipoCoproparasitologico: Boolean(res.tipoCoproparasitologico),
      heces1_color: res.txtcolor ?? "",
      heces1_aspecto: res.txtaspecto ?? "",
      heces1_moco: res.txtmocoFecal ?? "",
      heces1_sangre: res.txtsangrev ?? "",
      heces1_restos: res.txtrestosa ?? "",
      heces1_grasa: res.txtgrasa ?? "",
      heces2_color: res.txtcolor1 ?? "",
      heces2_aspecto: res.txtaspecto1 ?? "",
      heces2_moco: res.txtmocoFecal1 ?? "",
      heces2_sangre: res.txtsangrev1 ?? "",
      heces2_restos: res.txtrestosa1 ?? "",
      heces2_grasa: res.txtgrasa1 ?? "",
      heces3_color: res.txtcolor2 ?? "",
      heces3_aspecto: res.txtaspecto2 ?? "",
      heces3_moco: res.txtmocoFecal2 ?? "",
      heces3_sangre: res.txtsangrev2 ?? "",
      heces3_restos: res.txtrestosa2 ?? "",
      heces3_grasa: res.txtgrasa2 ?? "",
      micro1_leucocitos: res.txtleucocitos ?? "",
      micro1_hematies: res.txthematies ?? "",
      micro1_parasitos: res.txtlugol ?? "",
      micro2_leucocitos: res.txtleucocitos1 ?? "",
      micro2_hematies: res.txthematies1 ?? "",
      micro2_parasitos: res.txtlugol1 ?? "",
      micro3_leucocitos: res.txtleucocitos2 ?? "",
      micro3_hematies: res.txthematies2 ?? "",
      micro3_parasitos: res.txtlugol2 ?? "",

      user_medicoFirma: res.usuarioFirma,
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
    txtcolor: form.heces1_color,
    txtaspecto: form.heces1_aspecto,
    txtmocoFecal: form.heces1_moco,
    txtsangrev: form.heces1_sangre,
    txtrestosa: form.heces1_restos,
    txtgrasa: form.heces1_grasa,
    txtleucocitos: form.micro1_leucocitos,
    txthematies: form.micro1_hematies,
    txtlugol: form.micro1_parasitos,
    txtcolor1: form.heces2_color,
    txtaspecto1: form.heces2_aspecto,
    txtmocoFecal1: form.heces2_moco,
    txtsangrev1: form.heces2_sangre,
    txtrestosa1: form.heces2_restos,
    txtgrasa1: form.heces2_grasa,
    txtleucocitos1: form.micro2_leucocitos,
    txthematies1: form.micro2_hematies,
    txtlugol1: form.micro2_parasitos,
    txtcolor2: form.heces3_color,
    txtaspecto2: form.heces3_aspecto,
    txtmocoFecal2: form.heces3_moco,
    txtsangrev2: form.heces3_sangre,
    txtrestosa2: form.heces3_restos,
    txtgrasa2: form.heces3_grasa,
    txtleucocitos2: form.micro3_leucocitos,
    txthematies2: form.micro3_hematies,
    txtlugol2: form.micro3_parasitos,
    tipoCoproparasitologico: form.tipoCoproparasitologico,
    userRegistro: user,
    userMedicoOcup: "",

    usuarioFirma: form.user_medicoFirma,
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
          "Este paciente ya cuenta con registros de Parasitología.",
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