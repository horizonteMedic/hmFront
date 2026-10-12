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
const registrarUrl = `${LABORATORIO_ASISTENCIAL_URL}/clinico`;

// Reporte Jasper asistencial (cabecera del módulo, sin datos de empresa). El glob debe ser un literal
// para que Vite pueda resolverlo en build; por eso se declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/*.jsx");
const rutaJasper = "../../../../../../jaspers/ModuloAsistencial/Laboratorio/LaboratorioClinico/LaboratorioClinico_Digitalizado.jsx";

// El OpenAPI no dice qué responde el backend cuando el ticket aún no tiene registro: se toma como
// "sin registro" un error (404...), un `resultado` vacío o un `codLabclinico` nulo/0.
const leerRegistro = crearLectorReporte({
  url: registrarUrl,
  nameService: "lab_clinico_asistencial",
  tieneRegistro: (data) => Boolean(data.codLabclinico),
});
const obtenerRegistroFormulario = leerRegistro(false);
const obtenerRegistroReporte = leerRegistro(true);

// ===== Mapeo Registro nuevo (datos del paciente) =====
export const GetInfoServicio = (paciente, set) => {
  set((prev) => ({
    ...prev,
    ...formFromTicket(paciente),
    nombres: (paciente.nombres + " " + paciente.apellidos) ?? "",
    dni: paciente.numeroDocumento ?? "",
    tieneRegistro: false,
  }));
};

// ===== Mapeo Edición (registro existente) =====
export const GetInfoServicioEditar = (paciente, registro, set, numeroTicket) => {
  set((prev) => ({
    ...prev,
    ...formFromTicket(paciente),
    nombres: (paciente.nombres + " " + paciente.apellidos) ?? "",
    dni: paciente.numeroDocumento ?? "",
    

    codLabclinico: registro.codLabclinico ?? null,
    fechaExamen: registro.fechaLab ?? prev.fechaExamen,
    responsable: registro.resLab ?? "",

    grupoSanguineo: registro.chka ? 'A' : registro.chkab ? 'AB' : registro.chkb ? 'B' : registro.chko ? 'O' : '',
    factorRh: registro.rbrhpositivo === true ? 'RH(+)' : registro.rbrhnegativo === true ? 'RH(-)' : '',
    //HEMATOLOGIA
    hemoglobina: registro.txtHemoglobina ?? "",
    hematocrito: registro.txtHematocrito ?? "",
    vsg: registro.txtVsg ?? "",
    leucocitos: registro.txtLeucocitosHematologia ?? "",
    hematies: registro.txtHematiesHematologia ?? "",
    plaquetas: registro.txtPlaquetas ?? "",
    neutrofilos: registro.txtNeutrofilos ?? "",
    abastonados: registro.txtAbastonados ?? "",
    segmentados: registro.txtSegmentadosHematologia ?? "",
    monocitos: registro.txtMonocitosHematologia ?? "",
    eosinofilos: registro.txtEosinofilosHematologia ?? "",
    basofilos: registro.txtBasofilosHematologia ?? "",
    linfocitos: registro.txtLinfocitosHematologia ?? "",
    //BIO
    rpr: registro.chkPositivo === true ? 'POSITIVO' : registro.chkNegativo === true ? 'NEGATIVO' : 'N/A',
    vih: registro.txtVih ?? "",
    glucosa: registro.txtGlucosaBio ?? "",
    creatinina: registro.txtCreatininaBio ?? "",

    color: registro.txtColorEf ?? 'AMARILLO CLARO',
    aspecto: registro.txtAspectoEf ?? 'TRANSPARENTE',
    densidad: registro.txtDensidadEf ?? "",
    ph: registro.txtPhEf ?? "",
    // Examen Químico
    nitritos: registro.txtNitritosEq ?? 'NEGATIVO',
    proteinas: registro.txtProteinasEq ?? 'NEGATIVO',
    cetonas: registro.txtCetonasEq ?? 'NEGATIVO',
    leucocitosExamenQuimico: registro.txtLeucocitosEq ?? 'NEGATIVO',
    acAscorbico: registro.txtAcAscorbico ?? 'NEGATIVO',
    urobilinogeno: registro.txtUrobilinogenoEq ?? 'NEGATIVO',
    bilirrubina: registro.txtBilirrubinaEq ?? 'NEGATIVO',
    glucosaExamenQuimico: registro.txtGlucosaEq ?? 'NEGATIVO',
    sangre: registro.txtSangreEq ?? 'NEGATIVO',
    // Sedimento
    leucocitosSedimentoUnitario: registro.txtLeucocitosSu ?? '0-0',
    hematiesSedimentoUnitario: registro.txtHematiesSu ?? '0-1',
    celEpiteliales: registro.txtCelEpitelialesSu ?? 'ESCASAS',
    cristales: registro.txtCristalesSu ?? 'NO SE OBSERVAN',
    cilindros: registro.txtCilindrosSu ?? 'NO SE OBSERVAN',
    bacterias: registro.txtBacteriasSu ?? 'NO SE OBSERVAN',
    gramSc: registro.txtPusSu ?? 'NO SE OBSERVAN',
    otros: registro.txtOtrosSu ?? 'NO SE OBSERVAN',
    // Drogas
    cocaina: registro.txtCocaina ?? "",
    marihuana: registro.txtMarihuana ?? "",
    // Observaciones
    observaciones: registro.txtObservacionesLb ?? "",
    observacionesCie10: registro.observacionesCie10 ?? "",
    notasDoctor: registro.notasDoctor ?? "",

    SubirDoc: true,
    digitalizacion: registro.digitalizacion,

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
  codLabclinico: form.codLabclinico ? form.codLabclinico : null,
  fechaLab: form.fechaExamen,
  resLab: form.responsable,
  chko: form.grupoSanguineo === "O" ? true : false,
  chka: form.grupoSanguineo === "A" ? true : false,
  chkb: form.grupoSanguineo === "B" ? true : false,
  chkab: form.grupoSanguineo === "AB" ? true : false,
  rbrhpositivo: form.factorRh === "RH(+)" ? true : false,
  rbrhnegativo: form.factorRh === "RH(-)" ? true : false,
  txtHemoglobina: form.hemoglobina,
  txtHematocrito: form.hematocrito,
  txtVsg: form.vsg,
  txtPlaquetas: form.plaquetas,
  txtLeucocitosHematologia: form.leucocitos,
  txtHematiesHematologia: form.hematies,
  txtNeutrofilos: form.neutrofilos,
  txtAbastonados: form.abastonados,
  txtSegmentadosHematologia: form.segmentados,
  txtMonocitosHematologia: form.monocitos,
  txtEosinofilosHematologia: form.eosinofilos,
  txtBasofilosHematologia: form.basofilos,
  txtLinfocitosHematologia: form.linfocitos,
  txtGlucosaBio: form.glucosa,
  txtCreatininaBio: form.creatinina,
  chkPositivo: form.rpr === 'POSITIVO' ? true : false,
  chkNegativo: form.rpr === 'NEGATIVO' ? true : false,
  txtVih: form.vih,
  //ORINA
  txtColorEf: form.color,
  txtDensidadEf: form.densidad,
  txtAspectoEf: form.aspecto,
  txtPhEf: form.ph,
  //EXAMEN QUIMICO
  txtNitritosEq: form.nitritos,
  txtProteinasEq: form.proteinas,
  txtCetonasEq: form.cetonas,
  txtLeucocitosEq: form.leucocitosExamenQuimico,
  txtAcAscorbico: form.acAscorbico,
  txtUrobilinogenoEq: form.urobilinogeno,
  txtBilirrubinaEq: form.bilirrubina,
  txtGlucosaEq: form.glucosaExamenQuimico,
  txtSangreEq: form.sangre,
  //SEDIMIETNO
  txtLeucocitosSu: form.leucocitosSedimentoUnitario,
  txtCelEpitelialesSu: form.celEpiteliales,
  txtCilindrosSu: form.cilindros,
  txtBacteriasSu: form.bacterias,
  txtHematiesSu: form.hematiesSedimentoUnitario,
  txtCristalesSu: form.cristales,
  txtPusSu: form.gramSc,
  txtOtrosSu: form.otros,
  //DROGAS
  txtCocaina: form.cocaina,
  txtMarihuana: form.marihuana,
  txtObservacionesLb: form.observaciones,
  observacionesCie10: form.observacionesCie10,

  notasDoctor: form.notasDoctor,

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
// La plantilla asistencial lee los campos del reporte tal cual; `ajustarDatosReporte` completa
// numeroTicket, nombre (apellidos primero), sede, historia clínica y sellos de firma.
export const PrintHojaR = (numeroTicket, token) =>
  imprimirReporteTicket({
    numeroTicket,
    token,
    url: registrarUrl,
    obtenerRegistro: obtenerRegistroReporte,
    jasperModules,
    rutaJasper,
    ajustarDatos: ajustarDatosReporte(numeroTicket, token),
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
    mensajeExito: "Laboratorio Clínico registrado correctamente.",
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
    mensajeExito: "Laboratorio Clínico actualizado correctamente.",
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
      Swal.fire(
        "Alerta",
        "Este paciente ya cuenta con registros en Laboratorio Clinico",
        "warning"
      );
    },
  });

// ===== Archivos PDF =====
// Subir / ver / carga masiva de PDF se guardan por N° ORDEN en el servidor de archivos
// (archivoInterconsulta, detalleUrlArchivos). Usarlos con un N° Ticket asociaría el archivo a la
// orden ocupacional de otro paciente, así que quedan deshabilitados hasta que backend exponga el
// equivalente por ticket.
const avisoArchivosPorTicket = () =>
  Swal.fire(
    "Aún no disponible",
    "La carga y consulta de archivos PDF por N° Ticket todavía no está habilitada.",
    "info"
  );

export const handleSubirArchivo = async () => {
  avisoArchivosPorTicket();
};

export const ReadArchivosForm = async () => {
  avisoArchivosPorTicket();
};

export const handleSubirArchivoMasivo = async () => {
  avisoArchivosPorTicket();
};
