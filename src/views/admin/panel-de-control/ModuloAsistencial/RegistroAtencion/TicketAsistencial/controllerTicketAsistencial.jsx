import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const autocompletarUrl = "/api/pacientes-asistencial/autocompletar";
const serviciosGeneralesUrl = "/api/servicios-generales";
const buscarReniecUrl = "/api/pacientes-asistencial/reniec";
const buscarDocumentoUrl = "/api/pacientes-asistencial/documento";
const ticketsUrl = "/api/tickets";
const ultimoContextoUrl = "/api/tickets/ultimo-contexto";
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

const escapeHtml = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Último contexto (empresa / cargo / área) con el que se registró un ticket del paciente:
// GET /api/tickets/ultimo-contexto?dni=... -> { tienePrevio, empresa, cargo, area }.
// Devuelve null si es su primera atención (tienePrevio=false), si no hay documento con qué
// consultar o si la consulta falla: es una ayuda opcional y nunca debe frenar la búsqueda
// del paciente.
export const ObtenerUltimoContexto = async (documento, token) => {
  const dni = String(documento ?? "").trim();
  if (!dni) return null;

  try {
    const res = await getFetch(`${ultimoContextoUrl}?dni=${encodeURIComponent(dni)}`, token);
    if (!res || res.error) return null;

    // El backend puede devolver el objeto directo o envuelto en { resultado }.
    const data = res.resultado ?? res;
    if (!data?.tienePrevio) return null;

    const contexto = {
      empresa: String(data.empresa ?? "").trim(),
      cargo: String(data.cargo ?? "").trim(),
      area: String(data.area ?? "").trim(),
    };
    return contexto.empresa || contexto.cargo || contexto.area ? contexto : null;
  } catch {
    return null;
  }
};

// Si el paciente ya tuvo tickets, abre un modal con su último contexto y, si el usuario acepta,
// completa Empresa / Cargo / Área del formulario (misma idea que OpenModalAntecedentesPrevios
// en AntecedentesPatologicos, pero aquí el backend entrega un único contexto: se confirma o no).
// Un dato que no vino (null/vacío) no pisa lo que ya hay en el formulario.
// Devuelve true si mostró el modal (haya aceptado o no) y false si no había contexto previo,
// para que quien llama decida si todavía debe avisar "Paciente encontrado".
export const OfrecerUltimoContexto = async (
  documento,
  token,
  setForm,
  { titulo = "Último ticket del paciente", mensaje = "" } = {}
) => {
  const contexto = await ObtenerUltimoContexto(documento, token);
  if (!contexto) return false;

  const filas = [
    ["Empresa", contexto.empresa],
    ["Cargo", contexto.cargo],
    ["Área", contexto.area],
  ]
    .map(
      ([etiqueta, valor]) => `
        <tr>
          <td style="padding:4px 10px 4px 0;font-weight:600;color:#475569;white-space:nowrap;">${etiqueta}:</td>
          <td style="padding:4px 0;color:#1f2937;">${valor ? escapeHtml(valor) : "—"}</td>
        </tr>`
    )
    .join("");

  const resultado = await Swal.fire({
    icon: "question",
    title: titulo,
    html: `
      ${mensaje ? `<p style="margin:0 0 8px;">${escapeHtml(mensaje)}</p>` : ""}
      <p style="margin:0 0 8px;color:#64748b;font-size:0.9em;">
        El paciente ya tuvo tickets. Con estos datos se registró el último; ¿desea usarlos para completar el formulario?
      </p>
      <table style="margin:0 auto;text-align:left;font-size:0.95em;">${filas}</table>
    `,
    showCancelButton: true,
    confirmButtonText: "Usar estos datos",
    cancelButtonText: "No usar",
    allowOutsideClick: false,
  });

  if (resultado.isConfirmed) {
    setForm((prev) => ({
      ...prev,
      empresa: contexto.empresa || prev.empresa,
      cargo: contexto.cargo || prev.cargo,
      area: contexto.area || prev.area,
    }));
  }

  return true;
};

// Paciente ya validado por alguno de los buscadores: llena el formulario y, si ya tuvo tickets,
// ofrece reutilizar su último contexto en el mismo modal del aviso; si no (primera atención),
// queda el aviso de siempre. El documento sale de la ficha del paciente (si no, del que se
// escribió) y la consulta corre con el cuadro "Espere por favor" todavía abierto.
const CompletarPacienteEncontrado = async (paciente, documentoBuscado, token, setForm) => {
  const mensaje = "Se completó el formulario con los datos registrados en el sistema.";

  setFormFromPaciente(setForm, paciente);

  const ofrecido = await OfrecerUltimoContexto(
    paciente.numeroDocumento || documentoBuscado,
    token,
    setForm,
    { titulo: "Paciente encontrado", mensaje }
  );
  if (!ofrecido) Swal.fire("Paciente encontrado", mensaje, "success");
};

export const BuscarPorDni = async (dni, token, setForm) => {
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

  await CompletarPacienteEncontrado(resultado.paciente ?? {}, dni, token, setForm);
};

// Búsqueda exacta por documento (PASAPORTE), mismo endpoint que RegistroAsistencial. 
export const BuscarPorPasaporte = async (numero, token, setForm) => {
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

  await CompletarPacienteEncontrado(data, numero, token, setForm);
};

// Búsqueda exacta por documento (CARNET_EXTRANJERIA), mismo endpoint que RegistroAsistencial.
export const BuscarPorCarnetExtranjeria = async (numero, token, setForm) => {
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

  await CompletarPacienteEncontrado(data, numero, token, setForm);
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
