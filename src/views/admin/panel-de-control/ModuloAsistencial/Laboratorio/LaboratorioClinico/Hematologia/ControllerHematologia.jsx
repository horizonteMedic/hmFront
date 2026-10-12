import Swal from "sweetalert2";
import { sellarAuditoria } from "../../../../../../utils/auditoriaUtils.js";
import {
  LABORATORIO_ASISTENCIAL_URL,
  actualizarRegistroTicket,
  ajustarDatosReporte,
  auditoriaFromRegistro,
  confirmarImpresionTicket,
  crearLectorReporte,
  formFromTicket,
  guardarRegistroTicket,
  imprimirReporteTicket,
  verificarRegistroTicket,
} from "../../../../../../utils/registroAsistencialUtils.js";

// Endpoints REALES del backend (OpenAPI):
//   POST {registrarUrl}                                                         registra / actualiza
//   GET  {registrarUrl}/obtenerReporte?numeroTicket=&nameService=&esJasper=     registro del ticket
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/hemograma`;

// El reporte de hemograma no trae un id propio del registro (el clínico trae codLabclinico), así que
// se considera que el ticket "tiene registro" cuando el reporte trae su auditoría de creación
// (fechaRegistro / userRegistro). El OpenAPI no dice qué responde el backend cuando no hay registro:
// un error (404...), un `resultado` vacío o sin auditoría cuentan como "sin registro".
const leerRegistro = crearLectorReporte({
  url: registrarUrl,
  nameService: "hemograma_asistencial",
  tieneRegistro: (data) => Boolean(data.fechaRegistro || data.userRegistro),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// Reporte Jasper asistencial (cabecera del módulo, sin datos de empresa). El glob debe ser un literal
// para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/Hematologia_Digitalizado.jsx";

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set) => {
  set((prev) => ({
    ...prev,
    ...formFromTicket(paciente),
    tieneRegistro: false,
  }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
  set((prev) => ({
    ...prev,
    ...formFromTicket(paciente),
    fecha: registro.fechaExamen ?? prev.fecha,

    // Pruebas
    hemoglobina: registro.txtHemoglobina ?? "",
    hematocrito: registro.txtHematocrito ?? "",
    hematies: registro.txtHematies ?? "",
    volumen_corpuscular_medio: registro.txtVolumen ?? "",
    hemoglobina_corpuscular_media: registro.txtHemocorpuscular ?? "",
    concentracion_hemoglobina_corpuscular: registro.txtConcentracion ?? "",
    leucocitos: registro.txtLeucocitos ?? "",
    plaquetas: registro.txtPlaquetas ?? "",
    // Diferencial
    neutrofilos: registro.txtNeutrofilos ?? "",
    abastonados: registro.txtAbastonados ?? "",
    segmentados: registro.txtSegmentados ?? "",
    monocitos: registro.txtMonocitos ?? "",
    eosinofilos: registro.txtEosinofios ?? "",
    basofilos: registro.txtBasofilos ?? "",
    linfocitos: registro.txtLinfocitos ?? "",

    user_medicoFirma: registro.usuarioFirma ? registro.usuarioFirma : prev.user_medicoFirma,
    user_doctorAsignado: registro.doctorAsignado ?? "",

    // El bloque IMPRIMIR queda apuntando a este ticket.
    ticketImprimir: String(numeroTicket),

    ...auditoriaFromRegistro(registro),
    tieneRegistro: true,
  }));
};

// ===== Mapeo: Body base =====
// El DTO del POST es el del ocupacional con `numeroTicket` en lugar de `norden`; el backend resuelve
// al paciente por el ticket (no lleva `pacienteId`).
const construirBase = (form) => ({
  numeroTicket: Number(form.numeroTicket),
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

// Body completo. El POST no recibe `?usuario=`: la auditoría viaja en el body (userRegistro /
// usuarioActualizacion), igual que en el ocupacional.
const construirBody = (form, user, esActualizacion) =>
  sellarAuditoria(construirBase(form), {
    user,
    esActualizacion,
    userRegistro: form.userRegistro,
    fechaRegistro: form.fechaRegistro,
  });

// ===== Impresión =====
// `ajustarDatosReporte` completa numeroTicket, nombre, sede, historia clínica y sellos de firma; la
// plantilla rotula "Nombres y Apellidos" (por eso `apellidosPrimero: false`).
export const PrintHojaR = (numeroTicket, token) =>
  imprimirReporteTicket({
    numeroTicket,
    token,
    url: registrarUrl,
    obtenerRegistro: obtenerRegistroReporte,
    jasperModules,
    rutaJasper,
    ajustarDatos: ajustarDatosReporte(numeroTicket, token, { apellidosPrimero: false }),
  });

// Botón IMPRIMIR: pide confirmación y luego imprime.
export const ConfirmarImpresion = (numeroTicket, token) =>
  confirmarImpresionTicket(numeroTicket, () => PrintHojaR(numeroTicket, token));

// ===== Guardar (registro nuevo) =====
export const SubmitDataService = (form, token, user, limpiar) => {
  // Se captura antes de limpiar: el formulario se vacía al terminar de guardar.
  const numeroTicket = form.numeroTicket;
  return guardarRegistroTicket({
    form,
    token,
    user,
    url: registrarUrl,
    obtenerRegistro: obtenerRegistroFormulario,
    usuarioEnQuery: false,
    limpiar,
    buildBody: construirBody,
    mensajeExito: "Hemograma registrado correctamente.",
    onPrint: () => PrintHojaR(numeroTicket, token),
  });
};

// ===== Editar (registro existente) =====
export const UpdateDataService = (form, token, user, limpiar) => {
  const numeroTicket = form.numeroTicket;
  return actualizarRegistroTicket({
    form,
    token,
    user,
    url: registrarUrl,
    obtenerRegistro: obtenerRegistroFormulario,
    usuarioEnQuery: false,
    limpiar,
    buildBody: construirBody,
    mensajeExito: "Hemograma actualizado correctamente.",
    onPrint: () => PrintHojaR(numeroTicket, token),
  });
};

// ===== Búsqueda / verificación por N° Ticket =====
export const VerifyTR = (numeroTicket, token, set) =>
  verificarRegistroTicket({
    numeroTicket,
    token,
    url: registrarUrl,
    obtenerRegistro: obtenerRegistroFormulario,
    onNuevo: (paciente) => GetInfoServicio(paciente, set),
    onExistente: (paciente, registro) => {
      GetInfoServicioEditar(paciente, registro, set, numeroTicket);
      Swal.fire({
        icon: "warning",
        title: '<i class="fa-solid fa-clipboard-check"></i>Alerta',
        html: "Este paciente ya cuenta con registros de Hematología (Hemograma).",
      });
    },
  });
