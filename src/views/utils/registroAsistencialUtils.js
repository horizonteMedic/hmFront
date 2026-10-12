import Swal from "sweetalert2";
import { getFetch } from "./apiHelpers";
import {
  GetInfoPacNroTicketDefault,
  LoadingDefault,
  RegistrarServicioAsistencialDefault,
} from "./functionUtils";
import { formatearFechaCorta } from "./formatDateUtils";
import { convertirGenero, getSign } from "./helpers";
import { useAuthStore } from "../../store/auth";

/**
 * registroAsistencialUtils
 * ========================
 * Equivalente de registroOcupacionalUtils para los exámenes del módulo asistencial: el registro se
 * identifica por N° de TICKET (no por N° Orden) y NO se sella la auditoría desde el front (el backend
 * la resuelve con `?usuario=`, igual que Triaje / Historia Clínica asistencial).
 *
 * CONTRATO ASUMIDO (todavía NO existe en el backend; confirmarlo y ajustar `LABORATORIO_ASISTENCIAL_URL`
 * y la `url` de cada controller):
 *
 *   GET  {url}/ticket/{numeroTicket}  ->  { codigo, estatus, resultado }
 *        `resultado` es el registro del examen, o null / 404 si el ticket aún no lo tiene.
 *   POST {url}?usuario={usuario}      ->  upsert por numeroTicket (el body lleva numeroTicket y pacienteId).
 *
 * Los datos del paciente salen de GET /api/tickets/busqueda-por-filtros?numeroTicket= (ya existe, el
 * mismo que usa el Triaje asistencial).
 *
 * Endpoints REALES: Laboratorio Clínico (/asistencial/laboratorio/clinico) ya existe en el backend con
 * otro contrato (GET .../obtenerReporte?numeroTicket=&nameService=&esJasper=; POST sin `?usuario=`, con
 * la auditoría en el body). Esos controllers pasan su propio `obtenerRegistro` y `usuarioEnQuery: false`
 * en lugar del contrato asumido.
 */

export const LABORATORIO_ASISTENCIAL_URL = "/asistencial/laboratorio";

const empleadoUrl = "/api/v01/st/empleado";
const archivoEmpleadoUrl = "/api/v01/st/registros/detalleUrlArchivosEmpleados";

export const unwrap = (res) => (res && typeof res === "object" && "resultado" in res ? res.resultado : res);

// Hay registro si `resultado` trae contenido y, cuando trae `id`, este no es null (estilo Historia
// Asistencial, que responde 200 con id null si todavía no hay registro).
export const hayRegistro = (data) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) return false;
  return !("id" in data) || (data.id !== null && data.id !== undefined && data.id !== "");
};

// InformacionPacienteDTO (GET tickets/busqueda-por-filtros) -> campos del formulario.
export const formFromTicket = (paciente) => ({
  pacienteId: paciente.pacienteId ?? null,
  nombres: paciente.nombres ?? "",
  apellidos: paciente.apellidos ?? "",
  edad: paciente.edad ?? "",
  sexo: convertirGenero(paciente.sexo) ?? "",
  numeroDocumento: paciente.numeroDocumento ?? "",
  fechaNacimiento: formatearFechaCorta(paciente.fechaNacimiento) ?? "",
  lugarNacimiento: paciente.lugarNacimiento ?? "",
  estadoCivil: paciente.estadoCivil ?? "",
  nivelEstudios: paciente.nivelEstudios ?? "",
  ocupacion: paciente.ocupacion ?? "",
  empresa: paciente.empresa ?? "",
});

// Auditoría REAL del registro guardado. Se guarda CRUDA (la vista la formatea: UTC -> local).
// Se leen ambos nombres de clave porque los endpoints asistenciales usan "usuarioRegistro" y los
// ocupacionales "userRegistro".
export const auditoriaFromRegistro = (registro) => ({
  userRegistro: registro.usuarioRegistro ?? registro.userRegistro ?? "",
  fechaRegistro: registro.fechaRegistro ?? "",
  usuarioActualizacion: registro.usuarioActualizacion ?? registro.userActualizacion ?? "",
  fechaActualizacion: registro.fechaActualizacion ?? "",
});

// Datos del paciente por N° de Ticket. null si el ticket no existe.
export const buscarPacientePorTicket = async (numeroTicket, token) => {
  try {
    const res = await GetInfoPacNroTicketDefault(numeroTicket, token);
    return res && !res.error ? res.resultado ?? null : null;
  } catch {
    return null;
  }
};

// Registro del examen guardado para un ticket. null si no existe (404, resultado vacío o id null).
export const obtenerRegistroPorTicket = async (url, numeroTicket, token) => {
  try {
    const res = await getFetch(`${url}/ticket/${numeroTicket}`, token);
    if (!res || res.error) return null;
    const data = unwrap(res);
    return hayRegistro(data) ? data : null;
  } catch (error) {
    console.error(`Error al consultar ${url} del ticket ${numeroTicket}:`, error);
    return null;
  }
};

// Lector del registro por defecto (contrato asumido); los endpoints reales pasan el suyo.
const lectorPorDefecto = (url) => (numeroTicket, token) => obtenerRegistroPorTicket(url, numeroTicket, token);

/**
 * Listado para la tabla de búsqueda lateral (Perfil Lipídico). Contrato asumido:
 *   GET {url}/buscar?numeroTicket=&nombreApellido=&desde=&hasta=  ->  { resultado: [...] }
 * Cada fila: { numeroTicket, nombres, fecha, estado, color }. Mismo criterio del Triaje: por ticket,
 * por nombre (sin restringir fecha) o, sin filtros, solo la fecha indicada (por defecto, hoy).
 */
export const listarRegistrosTicket = async (url, { numeroTicket, nombres, fecha }, token) => {
  try {
    const query = new URLSearchParams();
    if (numeroTicket) {
      query.set("numeroTicket", numeroTicket);
    } else if (nombres) {
      query.set("nombreApellido", nombres);
    } else if (fecha) {
      query.set("desde", fecha);
      query.set("hasta", fecha);
    }
    const res = await getFetch(`${url}/buscar?${query.toString()}`, token);
    if (!res || res.error) return [];
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error al listar ${url}:`, error);
    return [];
  }
};

/**
 * VERIFICAR por N° Ticket: decide si el examen es NUEVO o EXISTENTE y delega la carga de datos.
 *
 *  - El ticket debe existir (si no, "Ticket no encontrado").
 *  - `obtenerRegistro` (numeroTicket, token) => registro | null; por defecto lee `{url}/ticket/{n}`.
 *  - Sin registro del examen -> onNuevo(paciente).
 *  - Con registro            -> onExistente(paciente, registro).
 */
export const verificarRegistroTicket = async ({
  numeroTicket,
  token,
  url,
  obtenerRegistro = lectorPorDefecto(url),
  onNuevo = () => {},
  onExistente = () => {},
}) => {
  if (!numeroTicket) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-keyboard"></i>Error',
      html: "Debe Introducir un N° Ticket válido",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const paciente = await buscarPacientePorTicket(numeroTicket, token);
  if (!paciente) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-magnifying-glass"></i>Ticket no encontrado',
      html: `No existe un ticket registrado con el N° ${numeroTicket}.`,
    });
    return;
  }

  const registro = await obtenerRegistro(numeroTicket, token);
  if (registro) {
    onExistente(paciente, registro);
    return;
  }
  onNuevo(paciente);
};

const registrar = ({
  form,
  token,
  user,
  url,
  limpiar,
  buildBody,
  esActualizacion,
  usuarioEnQuery,
  onPrint,
  mensajeExito,
}) => {
  const urlRegistro = usuarioEnQuery
    ? `${url}?${new URLSearchParams({ usuario: user ?? "" }).toString()}`
    : url;
  return RegistrarServicioAsistencialDefault(
    token,
    buildBody(form, user, esActualizacion),
    urlRegistro,
    limpiar,
    mensajeExito,
    onPrint
  );
};

/**
 * GUARDAR: registra SOLO si aún no existe un registro para ese Ticket.
 *
 * @param {object}   p
 * @param {object}   p.form          Estado del formulario.
 * @param {string}   p.token
 * @param {string}   p.user          Usuario en sesión.
 * @param {string}   p.url           Endpoint base del examen.
 * @param {Function} p.limpiar       Limpia el formulario tras registrar.
 * @param {Function} p.buildBody     (form, user, esActualizacion) => body. `user` lo usan los endpoints
 *                                   que piden el responsable del examen (txtReponsable) o la auditoría
 *                                   en el body; `esActualizacion` distingue Guardar de Editar.
 * @param {Function} [p.obtenerRegistro]  (numeroTicket, token) => registro | null. Por defecto lee
 *                                   `{url}/ticket/{n}` (contrato asumido); los endpoints reales pasan el suyo.
 * @param {boolean}  [p.usuarioEnQuery]   true (default) envía `?usuario=`; false si el endpoint no lo
 *                                   tiene y la auditoría viaja en el body.
 * @param {Function} [p.onPrint]     Callback de impresión tras guardar.
 * @param {string}   [p.mensajeExito]
 */
export const guardarRegistroTicket = async ({
  form,
  token,
  user,
  url,
  limpiar,
  buildBody,
  obtenerRegistro = lectorPorDefecto(url),
  usuarioEnQuery = true,
  onPrint = () => {},
  mensajeExito = "Datos registrados correctamente.",
}) => {
  if (!form.numeroTicket) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-clipboard-list"></i>Error',
      html: "Datos Incompletos",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const yaExiste = await obtenerRegistro(form.numeroTicket, token);
  if (yaExiste) {
    await Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-pen-to-square"></i>Alerta',
      html: "Ya existe un registro para este Ticket. Use el botón Editar para actualizarlo.",
    });
    return;
  }

  await registrar({
    form,
    token,
    user,
    url,
    limpiar,
    buildBody,
    esActualizacion: false,
    usuarioEnQuery,
    onPrint,
    mensajeExito,
  });
};

// EDITAR: actualiza SOLO si ya existe un registro para ese Ticket.
export const actualizarRegistroTicket = async ({
  form,
  token,
  user,
  url,
  limpiar,
  buildBody,
  obtenerRegistro = lectorPorDefecto(url),
  usuarioEnQuery = true,
  onPrint = () => {},
  mensajeExito = "Datos actualizados correctamente.",
}) => {
  if (!form.numeroTicket) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-clipboard-list"></i>Error',
      html: "Datos Incompletos",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const yaExiste = await obtenerRegistro(form.numeroTicket, token);
  if (!yaExiste) {
    await Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-floppy-disk"></i>Alerta',
      html: "No existe un registro para este Ticket. Use el botón Guardar para registrarlo.",
    });
    return;
  }

  await registrar({
    form,
    token,
    user,
    url,
    limpiar,
    buildBody,
    esActualizacion: true,
    usuarioEnQuery,
    onPrint,
    mensajeExito,
  });
};

// Botón IMPRIMIR: pide confirmación (como handlePrintDefault, pero por N° de Ticket) y luego imprime.
export const confirmarImpresionTicket = async (numeroTicket, imprimir) => {
  if (!numeroTicket) {
    await Swal.fire("Error", "Debe colocar un N° de Ticket", "error");
    return;
  }

  const { isConfirmed } = await Swal.fire({
    title: "¿Desea Imprimir Reporte?",
    html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Ticket: ${numeroTicket}</b></div>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, Imprimir",
    cancelButtonText: "Cancelar",
  });

  if (isConfirmed) imprimir();
};

// URL del SELLOFIRMA de un empleado a partir de su username: username -> idEmpleado (listaEmpleados de
// la sesión) -> DNI (GET empleado/{id}) -> sello (GET detalleUrlArchivosEmpleados/{dni}/SELLOFIRMA).
// "" si no tiene sello (o algo falla): el reporte se imprime sin ese sello.
const obtenerSelloEmpleado = async (username, token) => {
  if (!username) return "";
  try {
    const { listaEmpleados } = useAuthStore.getState();
    const empleado = (listaEmpleados || []).find((emp) => emp.username === username);
    if (!empleado?.idEmpleado) return "";

    const datosEmpleado = await getFetch(`${empleadoUrl}/${empleado.idEmpleado}`, token);
    const dni = datosEmpleado?.numDocumento;
    if (!dni) return "";

    const sello = await getFetch(`${archivoEmpleadoUrl}/${dni}/SELLOFIRMA`, token);
    return sello?.id === 1 && sello.mensaje ? sello.mensaje : "";
  } catch (error) {
    console.error(`No se pudo obtener el sello de ${username}:`, error);
    return "";
  }
};

/**
 * `digitalizacion` del reporte completada con los sellos que el backend no trae: SELLOFIRMA del
 * especialista (usuarioFirma) y SELLOFIRMADOCASIG del doctor asignado (doctorAsignado), los mismos que
 * dibujan las plantillas de laboratorio. Los que el reporte ya trae no se tocan (ni se consultan).
 */
export const completarSellosFirma = async (registro, token) => {
  const digitalizacion = Array.isArray(registro.digitalizacion) ? [...registro.digitalizacion] : [];
  const pendientes = [
    ["SELLOFIRMA", registro.usuarioFirma],
    ["SELLOFIRMADOCASIG", registro.doctorAsignado],
  ].filter(([nombre, username]) => username && !getSign({ digitalizacion }, nombre));

  const urls = await Promise.all(pendientes.map(([, username]) => obtenerSelloEmpleado(username, token)));
  pendientes.forEach(([nombre], i) => {
    if (urls[i]) digitalizacion.push({ nombreDigitalizacion: nombre, url: urls[i] });
  });
  return digitalizacion;
};

// Nombre de la sede de la sesión actual (misma fuente que el selector de sede del Navbar).
const nombreSedeActual = () => {
  const { userlogued, selectedSede } = useAuthStore.getState();
  return userlogued?.sedes?.find((sede) => sede.cod_sede === selectedSede)?.nombre_sede ?? "";
};

// Los Jasper de laboratorio ocupacional leen los datos del paciente con nombres distintos según la
// plantilla (dni / dniPaciente, sexo / sexoPaciente, ...): se entregan todos. "norden" es la
// numeración que esas plantillas imprimen como "Nro de ficha"; en asistencial es el N° de Ticket.
const datosParaJasperOcupacional = (paciente, numeroTicket) => {
  const nombreCompleto = `${paciente.nombres ?? ""} ${paciente.apellidos ?? ""}`.trim();
  const sexo = String(paciente.sexo ?? "").toUpperCase().trim();
  return {
    norden: String(numeroTicket),
    sede: nombreSedeActual(),
    nombreSede: nombreSedeActual(),
    nombres: nombreCompleto,
    nombresPaciente: nombreCompleto,
    nombreCompleto,
    dni: paciente.numeroDocumento ?? "",
    dniPaciente: paciente.numeroDocumento ?? "",
    edad: paciente.edad ?? "",
    edadPaciente: paciente.edad ?? "",
    sexo,
    sexoPaciente: sexo,
    fechaNacimiento: paciente.fechaNacimiento ?? "",
    fechaNacimientoPaciente: paciente.fechaNacimiento ?? "",
    lugarNacimiento: paciente.lugarNacimiento ?? "",
    lugarNacimientoPaciente: paciente.lugarNacimiento ?? "",
    estadoCivil: paciente.estadoCivil ?? "",
    estadoCivilPaciente: paciente.estadoCivil ?? "",
    nivelEstudios: paciente.nivelEstudios ?? "",
    nivelEstudioPaciente: paciente.nivelEstudios ?? "",
    ocupacion: paciente.ocupacion ?? "",
    ocupacionPaciente: paciente.ocupacion ?? "",
    empresa: paciente.empresa ?? "",
  };
};

/**
 * IMPRIMIR el reporte de un examen guardado por Ticket, reutilizando la plantilla Jasper del examen
 * ocupacional equivalente (todavía no hay plantillas asistenciales de laboratorio).
 *
 * El glob `import.meta.glob(...)` debe declararse en el controller (Vite exige un literal); aquí se
 * recibe ya resuelto en `jasperModules`.
 *
 * @param {object}   p
 * @param {string}   p.numeroTicket
 * @param {string}   p.token
 * @param {string}   p.url             Endpoint base del examen.
 * @param {Function} [p.obtenerRegistro]  (numeroTicket, token) => registro | null; por defecto lee
 *                                     `{url}/ticket/{n}`. Debe traer los datos que pinta la plantilla.
 * @param {object}   p.jasperModules   Resultado de import.meta.glob (mapa ruta -> loader).
 * @param {string}   p.rutaJasper      Clave dentro de jasperModules de la plantilla a usar.
 * @param {Function} [p.ajustarDatos]  (paciente, registro) => campos extra/override (puede ser async) para plantillas que
 *                                     leen el nombre del paciente con otra convención (apellidos aparte)
 *                                     o que deben priorizar un dato del reporte (sede, historia clínica).
 */
export const imprimirReporteTicket = async ({
  numeroTicket,
  token,
  url,
  obtenerRegistro = lectorPorDefecto(url),
  jasperModules,
  rutaJasper,
  ajustarDatos = () => ({}),
}) => {
  const paciente = await buscarPacientePorTicket(numeroTicket, token);
  if (!paciente) {
    Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
    return;
  }

  LoadingDefault("Cargando Formato a Imprimir");

  try {
    const registro = await obtenerRegistro(numeroTicket, token);
    if (!registro) {
      Swal.fire(
        "Sin registro",
        `El ticket N° ${numeroTicket} todavía no tiene este examen registrado.`,
        "warning"
      );
      return;
    }

    const modulo = await jasperModules[rutaJasper]();
    if (typeof modulo.default !== "function") {
      console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
      Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
      return;
    }

    await modulo.default(
      { ...registro, ...datosParaJasperOcupacional(paciente, numeroTicket), ...(await ajustarDatos(paciente, registro)) },
      null
    );
    Swal.close();
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
  }
};
