import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { URLAzure } from "../../../../../../config/config";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/reporteAnalisisBioquimico";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarAnalisisBioquimico";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
  const res = await GetInfoPacDefault(nro, token, sede);
  if (res) {
    set((prev) => ({
      ...prev,
      norden: res.norden ?? "",
      nombres: res.nombresApellidos ?? "",
      fechaNacimiento: formatearFechaCorta(res.fechaNac ?? ""),
      lugarNacimiento: res.lugarNacimiento ?? "",
      estadoCivil: res.estadoCivil ?? "",
      nivelEstudios: res.nivelEstudios ?? "",
      dni: res.dni ?? "",
      edad: res.edad ?? "",
      sexo: res.genero === "M" ? "MASCULINO" : "FEMENINO",
      empresa: res.empresa ?? "",
      contrata: res.contrata ?? "",
      cargoDesempenar: res.cargo ?? "",
      ocupacion: res.areaO ?? "",
      nombreExamen: res.nomExam ?? "",
      tieneRegistro: false,
    }));
  }
};

// ===== Mapeo Edición (registro existente) =====
// Se llama tanto al buscar por N° Orden como al hacer click en una fila de la tabla de búsqueda.
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
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

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado,
      Editando: true,

      // Auditoría REAL (obtenerReporte). Se guarda CRUDA (la vista la formatea: UTC -> local).
      fechaRegistro: res.fechaRegistro ?? "",
      userRegistro: res.userRegistro ?? "",
      fechaActualizacion: res.fechaActualizacion ?? "",
      usuarioActualizacion: res.usuarioActualizacion ?? "",
      tieneRegistro: true,
    }));
  }
};

// ===== Mapeo: Body base =====
const construirBase = (form) => ({
  codAb: form.codAb ? form.codAb : null,
  fechaAb: form.fecha,
  txtReponsable: form.medico,
  txtCreatinina: form.creatinina,
  txtColesterol: form.colesterolTotal,
  txtLdlColesterol: form.ldl,
  txtHdlColesterol: form.hdl,
  txtVldlColesterol: form.vldl,
  txtTrigliseridos: form.trigliceridos,
  userMedicoOcup: "",
  nOrden: form.norden,

  usuarioFirma: form.user_medicoFirma,
  doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "userRegistro".
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro,
    fechaRegistro: form.fechaRegistro,
  });

// ===== Impresión =====
// La carpeta "AnalisisBioquimicos" agrupa varias plantillas Jasper compartidas entre todos los
// exámenes de este módulo; se resuelve dinámicamente según el nombre que devuelva el backend.
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

// ===== Guardar (registro nuevo) =====
// `refreshTable` refresca la tabla de búsqueda lateral tras registrar (solo se llama si el
// usuario confirma la impresión, igual que antes).
export const SubmitDataService = (form, token, user, limpiar, tabla, refreshTable) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => {
      if (refreshTable) refreshTable();
      PrintHojaR(form.norden, token, tabla);
    },
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla, refreshTable) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => {
      if (refreshTable) refreshTable();
      PrintHojaR(form.norden, token, tabla);
    },
  });

// ===== Búsqueda / verificación por N° Orden =====
export const VerifyTR = (nro, tabla, token, set, sede) =>
  verificarRegistro({
    nro,
    tabla,
    token,
    sede,
    onNuevo: () => GetInfoServicio(nro, set, token, sede),
    onExistente: () =>
      GetInfoServicioEditar(nro, tabla, set, token, () => {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros de Análisis Bioquímicos.",
        });
      }),
  });

// ===== Carga desde la tabla de búsqueda (click en una fila) =====
export const GetInfoPacAnalisisBio = async (nro, tabla, set, token) => {
  LoadingDefault('Importando Datos');
  await GetInfoServicioEditar(nro, tabla, set, token, () => {
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
