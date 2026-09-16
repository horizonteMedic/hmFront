import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  LoadingDefault,
  PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/pruebasCovid/obtenerReporteExamenInmunologico";
const registrarUrl = "/api/v01/ct/pruebasCovid/registrarActualizarExamenInmunologico";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = async (nro, set, token, sede) => {
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
      tieneRegistro: false,
    }));
  }
};

// ===== Mapeo Edición (registro existente) =====
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

      marca: res.cboMarca ?? "",
      doctor: res.medico ?? "N/A",
      valor: res.valorIgm ?? "",

      user_medicoFirma: res.usuarioFirma ? res.usuarioFirma : prev.user_medicoFirma,
      user_doctorAsignado: res.doctorAsignado,

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

  usuarioFirma: form.user_medicoFirma,
  doctorAsignado: form.user_doctorAsignado,
});

// Body completo (creación / actualización). Este módulo espera la clave "user_registro".
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro,
    fechaRegistro: form.fechaRegistro,
    campoUserRegistro: "user_registro",
  });

// ===== Impresión =====
export const PrintHojaR = (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Covid/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    obtenerReporteUrl,
    jasperModules,
    "../../../../../../jaspers/Covid"
  );
};

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar, tabla) =>
  guardarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
  });

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar, tabla) =>
  actualizarRegistro({
    form,
    token,
    user,
    tabla,
    limpiar,
    registrarUrl,
    buildBody: construirBody,
    onPrint: () => PrintHojaR(form.norden, token, tabla),
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
        Swal.fire(
          "Alerta",
          "Este paciente ya cuenta con registros de Prueba Cuantitativa de Antígenos.",
          "warning"
        );
      }),
  });

export const Loading = (mensaje) => {
  LoadingDefault(mensaje);
};
