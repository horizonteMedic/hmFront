import Swal from "sweetalert2";
import {
  GetInfoPacDefault,
  GetInfoServicioDefault,
  PrintHojaRDefault,
} from "../../../../../../utils/functionUtils.js";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils.js";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils.js";
import {
  guardarRegistro,
  actualizarRegistro,
  verificarRegistro,
} from "../../../../../../utils/registroOcupacionalUtils.js";

const obtenerReporteUrl = "/api/v01/ct/laboratorio/obtenerReporteLabHematograma";
const registrarUrl = "/api/v01/ct/laboratorio/registrarActualizarLabHematograma";

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
// La carpeta "LaboratorioClinico" tiene varias plantillas Jasper; se resuelve dinámicamente
// según el nombre que devuelva el backend (no hay una única plantilla fija para esta tabla).
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
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
          html: "Este paciente ya cuenta con registros de Hematología (Hemograma).",
        });
      }),
  });
