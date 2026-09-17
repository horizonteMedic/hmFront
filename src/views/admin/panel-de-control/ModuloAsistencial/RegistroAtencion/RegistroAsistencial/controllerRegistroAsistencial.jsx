import Swal from "sweetalert2";
import { SubmitData, getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const guardarPacienteUrl =
  "/api/pacientes-asistencial";
const buscarReniecUrl =
  "/api/pacientes-asistencial/reniec";
const buscarDocumentoUrl =
  "/api/pacientes-asistencial/documento";

// dd-MM-yyyy -> yyyy-MM-dd ("" si la fecha es incompleta / inválida)
const toIsoDate = (fechaStr) => {
  if (!fechaStr) return null;
  const [dd, mm, yyyy] = fechaStr.split("-");
  if (!dd || !mm || !yyyy || yyyy.length < 4) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

// yyyy-MM-dd -> dd-MM-yyyy ("" si la fecha es incompleta / inválida)
const toInputDate = (fechaStr) => {
  if (!fechaStr) return "";
  const [yyyy, mm, dd] = fechaStr.split("-");
  if (!dd || !mm || !yyyy || yyyy.length < 4) return "";
  return `${dd}-${mm}-${yyyy}`;
};


// "MASCULINO" / "FEMENINO" (o ya "M" / "F") -> código esperado por el backend
const toSexoCode = (sexo) => {
  if (!sexo) return null;
  const s = String(sexo).toUpperCase();
  if (s === "MASCULINO" || s === "M") return "M";
  if (s === "FEMENINO" || s === "F") return "F";
  return s;
};

// Guardar paciente (alta o edición): POST /api/pacientes-asistencial?usuario=...
// Es un upsert en el backend (busca por id y luego por documento), así que siempre se
// envía el mismo payload. En edición, tipoDocumento/numeroDocumento/numeroHistoriaClinica
// se ignoran ahí -- para corregir el documento hay que usar PUT /{id}/documento.
export const SubmitDataService = async (form, token, limpiar = () => { }, userlogued = "") => {
  if (!form.nombres || !form.apellidos) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const body = {
    id: form.idDatos ?? null,
    numeroHistoriaClinica: form.NHCL ?? null,
    tipoDocumento: form.tipoDocumento,
    numeroDocumento: form.tipoDocumento === "SIN_DOCUMENTO" ? null : (form.documentoIdentidad ?? ""),
    nombres: form.nombres ?? "",
    apellidos: form.apellidos ?? "",
    sexo: toSexoCode(form.sexo),
    estadoCivil: form.estadoCivil ?? "",
    fechaNacimiento: toIsoDate(form.fechaNacimiento),
    direccion: form.domicilioActual ?? "",
    celular: form.telefono ?? "",
    departamento: form.departamento ?? "",
    provincia: form.provincia ?? "",
    distrito: form.distrito ?? "",
    nivelEstudios: form.nivelEstudios ?? "",
    lugarNacimiento: form.lugarNacimiento ?? "",
    ocupacion: form.ocupacion ?? "",
  };

  LoadingDefault("Registrando Datos");

  const query = new URLSearchParams({ usuario: userlogued ?? "" });
  const res = await SubmitData(body, `${guardarPacienteUrl}?${query.toString()}`, token);

  Swal.close();

  console.log("guardarPaciente ->", res);

  if (!res || res.error || !res.resultado) {
    Swal.fire("Error", res?.mensaje ?? "Ocurrió un error al registrar", "error");
    return;
  }

  Swal.fire("Éxito", "Datos registrados correctamente", "success");
  limpiar();
};

// "M" / "F" (o ya "MASCULINO" / "FEMENINO") -> valor usado por el <select> de Sexo
const toSexoOption = (sexo) => {
  if (!sexo) return "";
  const s = String(sexo).toUpperCase();
  if (s === "M" || s === "MASCULINO") return "MASCULINO";
  if (s === "F" || s === "FEMENINO") return "FEMENINO";
  return s;
};

// Vuelca en el form los datos de un paciente ya registrado localmente (schema "paciente").
const setFormFromPaciente = (setForm, data) => {
  setForm((prev) => ({
    ...prev,
    idDatos: data.id ?? null,
    documentoIdentidad: data.numeroDocumento ? String(data.numeroDocumento) : prev.documentoIdentidad,
    nombres: data.nombres ?? "",
    apellidos: data.apellidos ?? "",
    sexo: toSexoOption(data.sexo),
    estadoCivil: data.estadoCivil ?? "",
    domicilioActual: data.direccion ?? "",
    telefono: data.celular ?? "",
    NHCL: data.numeroHistoriaClinica ? parseInt(data.numeroHistoriaClinica) : null,
    fechaNacimiento: toInputDate(data.fechaNacimiento),
    departamento: data.departamento ?? "",
    provincia: data.provincia ?? "",
    distrito: data.distrito ?? "",

    nivelEstudios: data.nivelEstudios ?? "",
    lugarNacimiento: data.lugarNacimiento ?? "",
    ocupacion: data.ocupacion ?? "",
  }));
};

// Consulta por DNI (local o RENIEC) para autocompletar el alta.
// Si el DNI ya existe localmente (yaRegistrado=true) se usa tal cual, sin volver a
// consultar RENIEC. Si no existe, se autocompleta con RENIEC pero no se guarda nada
// hasta que el usuario confirme con SubmitDataService (POST /api/pacientes).
export const BuscarPorDni = async (dni, token, setForm) => {
  if (!dni) return;

  LoadingDefault("Buscando Paciente");

  const res = await getFetch(`${buscarReniecUrl}/${dni}`, token);

  Swal.close();

  console.log("buscarPorDni (reniec) ->", res);

  const resultado = res?.resultado;

  if (!res || res.error || !resultado) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese DNI. Complete sus datos para registrarlo.",
      "info"
    );
    return;
  }

  if (resultado.yaRegistrado) {
    setFormFromPaciente(setForm, resultado.paciente ?? {});
    Swal.fire(
      "Paciente encontrado",
      "Se completó el formulario con los datos registrados en el sistema.",
      "success"
    );
    return;
  }

  const reniec = resultado.datosReniec;

  if (!reniec) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese DNI. Complete sus datos para registrarlo.",
      "info"
    );
    return;
  }

  const apellidos = [reniec.apellidoPaterno, reniec.apellidoMaterno].filter(Boolean).join(" ");

  setForm((prev) => ({
    ...prev,
    idDatos: null,
    documentoIdentidad: reniec.dni ? String(reniec.dni) : prev.documentoIdentidad,
    nombres: reniec.nombres ?? "",
    apellidos,
    sexo: toSexoOption(reniec.sexo),
    estadoCivil: "",
    domicilioActual: reniec.direccion ?? "",
    telefono: "",
    NHCL: null,
    fechaNacimiento: toInputDate(reniec.fechaNacimiento),
    departamento: reniec.departamento ?? "",
    provincia: reniec.provincia ?? "",
    distrito: reniec.distrito ?? "",

    nivelEstudios: "",
    lugarNacimiento: "",
    ocupacion: "",
  }));

  Swal.fire(
    "Consulta a RENIEC",
    "No se encontró en el sistema, pero se consultó a RENIEC y se completó el formulario con esos datos. Confirme el registro para guardarlo.",
    "success"
  );
};

// Búsqueda exacta por documento (PASAPORTE). No consulta RENIEC (solo tiene DNI peruano).
export const BuscarPorPasaporte = async (numero, token, setForm) => {
  if (!numero) return;

  LoadingDefault("Buscando Paciente");

  const query = new URLSearchParams({ tipoDocumento: "PASAPORTE", numeroDocumento: numero });
  const res = await getFetch(`${buscarDocumentoUrl}?${query.toString()}`, token);

  Swal.close();

  console.log("buscarPorPasaporte (documento) ->", res);

  const data = res?.resultado;

  const encontrado = data && (data.numeroDocumento || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese número de pasaporte. Complete sus datos para registrarlo.",
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
