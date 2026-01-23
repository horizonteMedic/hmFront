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
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
const obtenerReporteUrl = "/api/v01/ct/laboratorio/reporteAnalisisBioquimico";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarAnalisisBioquimico";

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
      fecha: res.fecha ?? "",
      codAb: res.codAb ?? null,

      nombreExamen: res.nombreExamen ?? "",
      dni: res.dniPaciente ?? "",

      nombres: res.nombres ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNacimientoPaciente ?? ""),
      lugarNacimiento: res.lugarNacimientoPaciente ?? "",
      edad: res.edadPaciente ?? "",
      sexo: res.sexoPaciente === "M" ? "MASCULINO" : "FEMENINO",
      estadoCivil: res.estadoCivilPaciente,
      nivelEstudios: res.nivelEstudioPaciente,
      // Datos Laborales
      empresa: res.empresa,
      contrata: res.contrata,
      ocupacion: res.ocupacionPaciente,
      cargoDesempenar: res.cargoPaciente,


      colesterolTotal: res.txtColesterol ?? "",
      ldl: res.txtLdlColesterol !== undefined && res.txtLdlColesterol !== null && res.txtLdlColesterol !== '' ? (parseFloat(res.txtLdlColesterol).toFixed(2)) : '',
      hdl: res.txtHdlColesterol !== undefined && res.txtHdlColesterol !== null && res.txtHdlColesterol !== '' ? (parseFloat(res.txtHdlColesterol).toFixed(2)) : '',
      vldl: res.txtVldlColesterol !== undefined && res.txtVldlColesterol !== null && res.txtVldlColesterol !== '' ? (parseFloat(res.txtVldlColesterol).toFixed(2)) : '',
      trigliceridos: res.txtTrigliseridos ?? "",

      user_medicoFirma: res.usuarioFirma,
      user_doctorAsignado: res.doctorAsignado,
    }));

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

    usuarioFirma: form.user_medicoFirma,
    doctorAsignado: form.user_doctorAsignado,
  };

  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, () => {
    if (RefreshTable) RefreshTable();
    PrintHojaR(form.norden, token, tabla);
  });
};

export const PrintHojaR = (nro, token, tabla) => {
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

export const GetInfoPacAnalisisBio = async (nro, tabla, set, token) => {
  LoadingDefault('Importando Datos');
  await GetInfoServicio(nro, tabla, set, token, () => {
    Swal.close();
  });
};

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};

export function GetTableAnalBio(data, sede, token) {
  const body = {
    opcion_id_p: data.opcion_id_p,
    norden_p: data.norden,
    nombres_apellidos_p: data.nombres_apellidos_p,
    cod_sede_p: sede
  };
  const url = `${URLAzure}/api/v01/ct/laboratorio/listadoHistoriasOcupacionalesAnalisisBioquimicos`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return fetch(url, options).then(res => {
    if (!res.ok) {
      return res
    } return res.json()
  }).then(response => response)
}
