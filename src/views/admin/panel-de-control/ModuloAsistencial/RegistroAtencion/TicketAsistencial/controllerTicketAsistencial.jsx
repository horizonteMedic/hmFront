import Swal from "sweetalert2";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const buscarPacientesUrl = "/api/v01/ct/datosPacienteAsistencial/buscarPacientes";
const obtenerPorIdUrl = "/api/v01/ct/datosPacienteAsistencial/obtenerPorId";

// Autocompletado unificado por nombres/apellidos (prefijo, mínimo 2 caracteres).
// Pensado para pacientes sin DNI o ya registrados. No consulta RENIEC.
export const BuscarPacientes = async (texto, token) => {
  const query = (texto ?? "").trim();
  if (query.length < 2) return [];

  const res = await getFetch(
    `${buscarPacientesUrl}?texto=${encodeURIComponent(query)}`,
    token
  );

  if (!res || res.error) return [];

  // Acepta tanto un arreglo plano como una respuesta envuelta { resultado: [...] }
  const lista = Array.isArray(res) ? res : res.resultado;
  return Array.isArray(lista) ? lista : [];
};

// Trae la ficha completa del paciente a partir del idDatos elegido en el autocompletado
// y llena el formulario (incluye historiaClinica para el campo N° HCL).
export const ObtenerPorId = async (idDatos, token, setForm) => {
  if (!idDatos) return;

  LoadingDefault("Cargando Paciente");

  const res = await getFetch(`${obtenerPorIdUrl}/${idDatos}`, token);

  Swal.close();

  // Acepta tanto la respuesta envuelta { codigo, resultado } como el objeto plano directo
  const data = res?.resultado ?? (res && !res.error ? res : null);

  if (!res || res.error || !data) {
    Swal.fire("Error", "No se pudo obtener la ficha del paciente.", "error");
    return null;
  }

  setForm((prev) => ({
    ...prev,
    idDatos: data.idDatos ?? idDatos,
    dni: data.dni ?? prev.dni,
    documentoIdentidad: data.numDocumento || (data.dni ? String(data.dni) : prev.documentoIdentidad),
    nombres: `${data.apellidos ?? ""} ${data.nombres ?? ""}`.trim(),
    NHCL: data.historiaClinica ? parseInt(data.historiaClinica) : null,
  }));

  return data;
};
