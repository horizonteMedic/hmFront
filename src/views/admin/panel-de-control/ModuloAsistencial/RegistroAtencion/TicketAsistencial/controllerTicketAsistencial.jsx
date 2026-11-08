import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const autocompletarUrl = "/api/pacientes-asistencial/autocompletar";
const serviciosGeneralesUrl = "/api/servicios-generales";
const buscarReniecUrl = "/api/pacientes-asistencial/reniec";
const buscarDocumentoUrl = "/api/pacientes-asistencial/documento";
const ticketsUrl = "/api/tickets";
const historialUrl = "/api/tickets/historial";
const pacientesUrl = "/api/pacientes-asistencial";


export const BuscarPacientes = async (texto, token) => {
  const query = (texto ?? "").trim();
  if (query.length < 2) return [];

  const res = await getFetch(
    `${autocompletarUrl}?texto=${encodeURIComponent(query)}`,
    token
  );

  if (!res || res.error) return [];

  const lista = res.resultado;
  return Array.isArray(lista) ? lista : [];
};

// Catálogo de servicios generales, usado para autocompletar Cod. Servicio/Precio/Unidad
// al agregar un ítem al ticket. Por defecto solo trae los activos.
export const ListarServicios = async (token, soloActivos = true) => {
  const res = await getFetch(
    `${serviciosGeneralesUrl}?soloActivos=${soloActivos}`,
    token
  );

  if (!res || res.error) return [];

  const lista = res.resultado;
  return Array.isArray(lista) ? lista : [];
};

// Registra un servicio nuevo en el catálogo. Devuelve el servicio creado o null si falló.
export const CrearServicio = async (body, token) => {
  const res = await SubmitData(body, serviciosGeneralesUrl, token);

  if (!res || res.error || !res.resultado) return null;

  return res.resultado;
};

// Vuelca en el form del ticket los datos de un paciente (schema "paciente" de
// pacientes-asistencial): junta apellidos+nombres para el campo único "nombres".
// fechaNacimiento se guarda para calcular la edad al imprimir el ticket.
const setFormFromPaciente = (setForm, data) => {
  setForm((prev) => ({
    ...prev,
    idDatos: data.id ?? null,
    dni: data.numeroDocumento ?? null,
    documentoIdentidad: data.numeroDocumento ? String(data.numeroDocumento) : prev.documentoIdentidad,
    nombres: `${data.apellidos ?? ""} ${data.nombres ?? ""}`.trim(),
    NHCL: data.numeroHistoriaClinica ? parseInt(data.numeroHistoriaClinica) : null,
    fechaNacimiento: data.fechaNacimiento ?? null,
  }));
};

// Historial de tickets del paciente: GET /api/tickets/historial?documento=... (DNI, pasaporte,
// carnet de extranjería, etc.) -> { resultado: [ticket, ...] }. Cada ticket trae numeroTicket,
// fechaTicket/horaTicket, empresa, cargo, area y los datos del paciente (pacienteTipoDocumento,
// pacienteNumeroDocumento...). Se devuelve del más reciente al más antiguo.
// Devuelve [] si no hay documento, si nunca tuvo tickets o si la consulta falla: es una ayuda
// opcional (alimenta la barra lateral de "Tickets anteriores") y nunca debe frenar la búsqueda
// del paciente.
export const ListarHistorialTickets = async (documento, token) => {
  const numero = String(documento ?? "").trim();
  if (!numero) return [];

  try {
    const res = await getFetch(`${historialUrl}?documento=${encodeURIComponent(numero)}`, token);
    if (!res || res.error) return [];

    // El backend puede devolver la lista directa o envuelta en { resultado }.
    const lista = res.resultado ?? res;
    if (!Array.isArray(lista)) return [];

    return [...lista].sort(
      (a, b) =>
        `${b.fechaTicket ?? ""} ${b.horaTicket ?? ""}`.localeCompare(`${a.fechaTicket ?? ""} ${a.horaTicket ?? ""}`) ||
        (b.id ?? 0) - (a.id ?? 0)
    );
  } catch {
    return [];
  }
};

// Paciente ya validado por alguno de los buscadores: llena el formulario, avisa y entrega el
// documento a `onEncontrado` (en el formulario, carga su historial de tickets en la barra lateral).
// El documento sale de la ficha del paciente (si no, del que se escribió).
const CompletarPacienteEncontrado = (paciente, documentoBuscado, setForm, onEncontrado) => {
  setFormFromPaciente(setForm, paciente);

  Swal.fire(
    "Paciente encontrado",
    "Se completó el formulario con los datos registrados en el sistema.",
    "success"
  );

  onEncontrado?.(paciente.numeroDocumento || documentoBuscado);
};

export const BuscarPorDni = async (dni, token, setForm, onEncontrado) => {
  if (!dni) return;

  LoadingDefault("Buscando Paciente");

  const res = await getFetch(`${buscarReniecUrl}/${dni}`, token);

  const resultado = res?.resultado;

  if (!res || res.error || !resultado || !resultado.yaRegistrado) {
    Swal.close();
    Swal.fire(
      "DNI no registrado",
      "Este DNI no está registrado en el sistema (sin historia clínica). No se puede generar el ticket.",
      "warning"
    );
    return;
  }

  CompletarPacienteEncontrado(resultado.paciente ?? {}, dni, setForm, onEncontrado);
};

// Búsqueda exacta por documento (PASAPORTE), mismo endpoint que RegistroAsistencial. 
export const BuscarPorPasaporte = async (numero, token, setForm, onEncontrado) => {
  if (!numero) return;

  LoadingDefault("Buscando Paciente");

  const query = new URLSearchParams({ tipoDocumento: "PASAPORTE", numeroDocumento: numero });
  const res = await getFetch(`${buscarDocumentoUrl}?${query.toString()}`, token);

  const data = res?.resultado;
  const encontrado = data && (data.numeroDocumento || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.close();
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese número de pasaporte.",
      "info"
    );
    return;
  }

  CompletarPacienteEncontrado(data, numero, setForm, onEncontrado);
};

// Búsqueda exacta por documento (CARNET_EXTRANJERIA), mismo endpoint que RegistroAsistencial.
export const BuscarPorCarnetExtranjeria = async (numero, token, setForm, onEncontrado) => {
  if (!numero) return;

  LoadingDefault("Buscando Paciente");

  const query = new URLSearchParams({ tipoDocumento: "CARNET_EXTRANJERIA", numeroDocumento: numero });
  const res = await getFetch(`${buscarDocumentoUrl}?${query.toString()}`, token);

  const data = res?.resultado;
  const encontrado = data && (data.numeroDocumento || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.close();
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese número de carnet de extranjería.",
      "info"
    );
    return;
  }

  CompletarPacienteEncontrado(data, numero, setForm, onEncontrado);
};

// Registra el ticket con todas sus líneas. El backend calcula precioTotal/total a partir
// de cantidad, precioUnitario y descuentoLinea de cada contenido (no se envían id,
// descripcion, unidad ni precioTotal por línea, ni id/numeroTicket/total del ticket; sí se
// envían serieTicket -código de sede- y sede -nombre de la sede-). "descuento" es un descuento adicional a nivel de ticket que esta pantalla no
// gestiona, así que siempre se envía en 0.
export const RegistrarTicket = async (body, token, usuario) => {
  const query = new URLSearchParams({ usuario: usuario ?? "" });
  const res = await SubmitData(body, `${ticketsUrl}?${query.toString()}`, token);

  if (!res || res.error || !res.resultado) return null;

  return res.resultado;
};

// Obtiene el ticket ya persistido (con sus líneas y montos reales) por su número único.
// Es la fuente de verdad para imprimir: así el recibo siempre refleja lo guardado en el
// backend y no el estado del formulario en pantalla.
export const ObtenerTicketPorNumero = async (numeroTicket, token) => {
  if (!numeroTicket) return null;

  LoadingDefault("Cargando Ticket");

  const res = await getFetch(`${ticketsUrl}/numero/${numeroTicket}`, token);

  Swal.close();

  if (!res || res.error || !res.resultado) return null;

  return res.resultado;
};

// Ficha del paciente por id (GET /api/pacientes-asistencial/{id}). El ticket guardado no trae
// la historia clínica ni el tipo de documento, y el reporte A4 los necesita. Devuelve null si
// falla: el reporte se imprime igual, solo sin esos dos datos.
export const ObtenerPacientePorId = async (pacienteId, token) => {
  if (!pacienteId) return null;

  const res = await getFetch(`${pacientesUrl}/${pacienteId}`, token);

  if (!res || res.error || !res.resultado) return null;

  return res.resultado;
};
