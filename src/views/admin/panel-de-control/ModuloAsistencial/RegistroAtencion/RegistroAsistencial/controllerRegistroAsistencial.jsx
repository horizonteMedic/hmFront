import Swal from "sweetalert2";
import { SubmitData, getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const registrarActualizarUrl =
  "/api/v01/ct/datosPacienteAsistencial/registrarActualizar";
const buscarPorDniUrl =
  "/api/v01/ct/datosPacienteAsistencial/buscarPorDni";
const buscarPorPasaporteUrl =
  "/api/v01/ct/datosPacienteAsistencial/buscarPorPasaporte";

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


export const SubmitDataService = async (form, token, limpiar = () => { }, userlogued = "") => {
  if (!form.nombres || !form.apellidos) {
    await Swal.fire("Error", "Datos Incompletos", "error");
    return;
  }

  const esActualizacion = Boolean(form.idDatos);

  const body = {
    origenDatos: form.origenDatos ?? "",
    idDatos: form.idDatos,
    dni: form.tipoDocumento === "DNI" ? parseInt(form.documentoIdentidad) : null,
    nombres: form.nombres ?? "",
    apellidos: form.apellidos ?? "",
    sexo: form.sexo ?? "",
    estadoCivil: form.estadoCivil ?? "",
    direccion: form.domicilioActual ?? "",
    celular: form.telefono ?? "",
    fechaRegistro: new Date().toISOString(),
    userRegistro: userlogued ?? "",
    usuarioActualizacion: esActualizacion ? (userlogued ?? "") : null,
    historiaClinica: form.NHCL ?? null,
    edad: form.edad ?? "",
    fechaNacimiento: toIsoDate(form.fechaNacimiento),
    codigoSinDni: form.codigoSinDni,
    departamento: form.departamento ?? "",
    provincia: form.provincia ?? "",
    distrito: form.distrito ?? "",
    tipoDocumento: form.tipoDocumento,
    numDocumento: form.tipoDocumento === "PASAPORTE" ? (form.documentoIdentidad ?? "") : "",

    nivelEstudios: form.nivelEstudios ?? "",
    lugarNacimiento: form.lugarNacimiento ?? "",
    ocupacion: form.ocupacion ?? "",
  };

  LoadingDefault("Registrando Datos");

  SubmitData(body, registrarActualizarUrl, token).then((res) => {
    console.log(res);
    if (res?.id === 1 || res?.nOrden || res?.codigo == "201" || res?.idDatos) {
      Swal.fire("Éxito", res?.mensaje ?? "Datos registrados correctamente", "success");
      limpiar();
    } else {
      Swal.fire("Error", res?.mensaje ?? "Ocurrió un error al registrar", "error");
    }
  });
};

// "M" / "F" (o ya "MASCULINO" / "FEMENINO") -> valor usado por el <select> de Sexo
const toSexoOption = (sexo) => {
  if (!sexo) return "";
  const s = String(sexo).toUpperCase();
  if (s === "M" || s === "MASCULINO") return "MASCULINO";
  if (s === "F" || s === "FEMENINO") return "FEMENINO";
  return s;
};

export const BuscarPorDni = async (dni, token, setForm) => {
  if (!dni) return;

  LoadingDefault("Buscando Paciente");

  const res = await getFetch(`${buscarPorDniUrl}/${dni}`, token);

  Swal.close();

  console.log("buscarPorDni ->", res);

  // Acepta tanto la respuesta envuelta { codigo, resultado } como el objeto plano directo
  const data = res?.resultado ?? (res && !res.error ? res : null);

  const encontrado = data && (data.dni || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese DNI. Complete sus datos para registrarlo.",
      "info"
    );
    return;
  }

  setForm((prev) => ({
    ...prev,
    idDatos: data.idDatos,
    documentoIdentidad: data.dni ? String(data.dni) : prev.documentoIdentidad,
    nombres: data.nombres ?? "",
    apellidos: data.apellidos ?? "",
    sexo: toSexoOption(data.sexo),
    estadoCivil: data.estadoCivil ?? "",
    domicilioActual: data.direccion ?? "",
    telefono: data.celular ?? "",
    NHCL: data.historiaClinica ? parseInt(data.historiaClinica) : null,
    edad: data.edad ?? "",
    fechaNacimiento: toInputDate(data.fechaNacimiento),
    codigoSinDni: data.codigoSinDni,
    departamento: data.departamento ?? "",
    provincia: data.provincia ?? "",
    distrito: data.distrito ?? "",

    nivelEstudios: data.nivelEstudios ?? "",
    lugarNacimiento: data.lugarNacimiento ?? "",
    ocupacion: data.ocupacion ?? "",
  }));

  const origen = data.origenDatos ? String(data.origenDatos).toUpperCase() : "";
  if (origen === "RENIEC") {
    Swal.fire(
      "Consulta a RENIEC",
      "No se encontró en el sistema, pero se consultó a RENIEC y se completó el formulario con esos datos.",
      "success"
    );
  } else {
    Swal.fire(
      "Paciente encontrado",
      "Se completó el formulario con los datos registrados en el sistema.",
      "success"
    );
  }
};

// Busca en el sistema por tipoDocumento = PASAPORTE. No consulta RENIEC (solo tiene DNI peruano).
export const BuscarPorPasaporte = async (numero, token, setForm) => {
  if (!numero) return;

  LoadingDefault("Buscando Paciente");

  const res = await getFetch(`${buscarPorPasaporteUrl}/${numero}`, token);

  Swal.close();

  console.log("buscarPorPasaporte ->", res);

  // Acepta tanto la respuesta envuelta { codigo, resultado } como el objeto plano directo
  const data = res?.resultado ?? (res && !res.error ? res : null);

  const encontrado = data && (data.numDocumento || data.nombres || data.apellidos);

  if (!res || res.error || !encontrado) {
    Swal.fire(
      "Sin registro",
      "No se encontró un paciente con ese número de pasaporte. Complete sus datos para registrarlo.",
      "info"
    );
    return;
  }

  setForm((prev) => ({
    ...prev,
    idDatos: data.idDatos,
    documentoIdentidad: data.numDocumento ?? prev.documentoIdentidad,
    nombres: data.nombres ?? "",
    apellidos: data.apellidos ?? "",
    sexo: toSexoOption(data.sexo),
    estadoCivil: data.estadoCivil ?? "",
    domicilioActual: data.direccion ?? "",
    telefono: data.celular ?? "",
    NHCL: data.historiaClinica ? parseInt(data.historiaClinica) : null,
    edad: data.edad ?? "",
    fechaNacimiento: toInputDate(data.fechaNacimiento),
    codigoSinDni: data.codigoSinDni,
    departamento: data.departamento ?? "",
    provincia: data.provincia ?? "",
    distrito: data.distrito ?? "",

    nivelEstudios: data.nivelEstudios ?? "",
    lugarNacimiento: data.lugarNacimiento ?? "",
    ocupacion: data.ocupacion ?? "",
  }));

  Swal.fire(
    "Paciente encontrado",
    "Se completó el formulario con los datos registrados en el sistema.",
    "success"
  );
};
