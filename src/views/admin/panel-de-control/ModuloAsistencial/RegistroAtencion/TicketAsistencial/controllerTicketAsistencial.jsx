import Swal from "sweetalert2";
import { getFetch, SubmitData } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const autocompletarUrl = "/api/pacientes-asistencial/autocompletar";
const serviciosGeneralesUrl = "/api/servicios-generales";
const buscarReniecUrl = "/api/pacientes-asistencial/reniec";
const buscarDocumentoUrl = "/api/pacientes-asistencial/documento";
const ticketsUrl = "/api/tickets";

// Autocompletado liviano por nombres/apellidos concatenados (prefijo, mínimo 2 caracteres).
// Pensado para dispararse en cada tecla; ya trae la ficha completa del paciente, por lo
// que no hace falta una segunda llamada al elegir un resultado.
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
const setFormFromPaciente = (setForm, data) => {
  setForm((prev) => ({
    ...prev,
    idDatos: data.id ?? null,
    dni: data.numeroDocumento ?? null,
    documentoIdentidad: data.numeroDocumento ? String(data.numeroDocumento) : prev.documentoIdentidad,
    nombres: `${data.apellidos ?? ""} ${data.nombres ?? ""}`.trim(),
    NHCL: data.numeroHistoriaClinica ? parseInt(data.numeroHistoriaClinica) : null,
  }));
};

// Consulta por DNI, mismo endpoint que RegistroAsistencial. Para el ticket el paciente debe
// existir YA en el sistema (yaRegistrado=true): solo así tiene historia clínica y se le
// puede generar un ticket. Si el DNI solo se encuentra en RENIEC (yaRegistrado=false), no
// hay historia clínica -> se avisa y no se llena nada del formulario.
export const BuscarPorDni = async (dni, token, setForm) => {
  if (!dni) return;

  LoadingDefault("Buscando Paciente");

  const res = await getFetch(`${buscarReniecUrl}/${dni}`, token);

  Swal.close();

  const resultado = res?.resultado;

  if (!res || res.error || !resultado || !resultado.yaRegistrado) {
    Swal.fire(
      "DNI no registrado",
      "Este DNI no está registrado en el sistema (sin historia clínica). No se puede generar el ticket.",
      "warning"
    );
    return;
  }

  setFormFromPaciente(setForm, resultado.paciente ?? {});
  Swal.fire(
    "Paciente encontrado",
    "Se completó el formulario con los datos registrados en el sistema.",
    "success"
  );
};

// Búsqueda exacta por documento (PASAPORTE), mismo endpoint que RegistroAsistencial.
// No consulta RENIEC (solo tiene DNI peruano).
export const BuscarPorPasaporte = async (numero, token, setForm) => {
  if (!numero) return;

  LoadingDefault("Buscando Paciente");

  const query = new URLSearchParams({ tipoDocumento: "PASAPORTE", numeroDocumento: numero });
  const res = await getFetch(`${buscarDocumentoUrl}?${query.toString()}`, token);

  Swal.close();

  const data = res?.resultado;
  const encontrado = data && (data.numeroDocumento || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese número de pasaporte.",
      "info"
    );
    return;
  }

  setFormFromPaciente(setForm, data);

  Swal.fire(
    "Paciente encontrado",
    "Se completó el formulario con los datos registrados en el sistema.",
    "success"
  );
};

// Registra el ticket con todas sus líneas. El backend calcula precioTotal/total a partir
// de cantidad, precioUnitario y descuentoLinea de cada contenido (no se envían id,
// descripcion, unidad ni precioTotal por línea, ni id/serieTicket/numeroTicket/total del
// ticket). "descuento" es un descuento adicional a nivel de ticket que esta pantalla no
// gestiona, así que siempre se envía en 0.
export const RegistrarTicket = async (body, token, usuario) => {
  const query = new URLSearchParams({ usuario: usuario ?? "" });
  const res = await SubmitData(body, `${ticketsUrl}?${query.toString()}`, token);

  if (!res || res.error || !res.resultado) return null;

  return res.resultado;
};
