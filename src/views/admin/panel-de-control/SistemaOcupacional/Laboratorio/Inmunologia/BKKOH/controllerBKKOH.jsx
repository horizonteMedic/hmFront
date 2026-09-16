import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  PrintHojaRDefault,
} from "../../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils";

const obtenerReporteUrl = "/api/v01/ct/inmunologia/obtenerReporteMicrobiologia";
const registrarUrl = "/api/v01/ct/inmunologia/registrarActualizarMicrobiologia";

const obtenerReporteUrlKoh = "/api/v01/ct/inmunologia/obtenerReporteKoh";
const registrarUrlKoh = "/api/v01/ct/inmunologia/registrarActualizarKoh";

// Este formulario trabaja sobre dos tablas distintas ("microbiologia" o "koh") según el modo
// "Examen Directo" seleccionado en la vista. Cada función resuelve la URL correcta según `tabla`.
const urlObtenerPor = (tabla) => (tabla === "koh" ? obtenerReporteUrlKoh : obtenerReporteUrl);
const urlRegistrarPor = (tabla) => (tabla === "koh" ? registrarUrlKoh : registrarUrl);

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
export const GetInfoServicioEditar = async (nro, tabla, set, token, onFinish = () => { }) => {
  const res = await GetInfoServicioDefault(
    nro,
    tabla,
    token,
    urlObtenerPor(tabla),
    onFinish
  );
  if (res) {
    set((prev) => ({
      ...prev,
      norden: res.norden ?? "",
      fecha: res.fecha,
      id: res.id ?? null,

      nombreExamen: res.nombreExamen ?? "",
      dni: res.dniPaciente ?? "",

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

      bk1: res.txtMuestra1 ?? "",
      bk2: res.txtMuestra2 ?? "",
      koh: res.txtKoh ?? "",

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
  id: form.id,
  fecha: form.fecha,
  txtMuestra1: form.bk1,
  txtMuestra2: form.bk2,
  txtKoh: form.koh,
  userMedicoOcup: "",

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
// La carpeta "Inmunologia" agrupa varias plantillas Jasper compartidas entre todos los
// exámenes de este módulo; se resuelve dinámicamente según el nombre que devuelva el backend.
export const PrintHojaR = (nro, token, tabla) => {
  const jasperModules = import.meta.glob(
    "../../../../../../jaspers/Inmunologia/*.jsx"
  );
  PrintHojaRDefault(
    nro,
    token,
    tabla,
    null,
    urlObtenerPor(tabla),
    jasperModules,
    "../../../../../../jaspers/Inmunologia"
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
    registrarUrl: urlRegistrarPor(tabla),
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
    registrarUrl: urlRegistrarPor(tabla),
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
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros de Microbiología.",
        });
      }),
  });
