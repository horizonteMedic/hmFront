import Swal from "sweetalert2";
import { getFetch } from "./apiHelpers";
import {
  existeRegistro,
  LoadingDefault,
  SubmitDataServiceDefault,
} from "./functionUtils";

/**
 * registroOcupacionalUtils
 * ======================== 
 */

const existenciaExamenesUrl = "/api/v01/ct/consentDigit/existenciaExamenes";
const infoPacienteUrl = "/api/v01/ct/infoPersonalPaciente/busquedaPorFiltros";


export const perteneceASede = async (nro, sede, token) => {
  const pac = await getFetch(
    `${infoPacienteUrl}?nOrden=${nro}&nomSede=${sede}`,
    token
  );
  return Boolean(pac && !pac.error && pac.norden);
};

/**
 * GUARDAR: registra SOLO si aún no existe un registro para esa Orden.
 *
 * @param {object}   p
 * @param {object}   p.form           Estado del formulario.
 * @param {string}   p.token
 * @param {string}   p.user           Usuario en sesión.
 * @param {string}   p.tabla          nameService del examen.
 * @param {Function} p.limpiar        Limpia el formulario tras registrar.
 * @param {string}   p.registrarUrl   Endpoint de registrar/actualizar.
 * @param {Function} p.buildBody      (form, user, esActualizacion) => body.
 * @param {Function} [p.onPrint]      Callback de impresión tras guardar.
 */

export const guardarRegistro = async ({
  form,
  token,
  user,
  tabla,
  limpiar,
  registrarUrl,
  buildBody,
  onPrint = () => {},
}) => {
  if (!form.norden) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-clipboard-list"></i>Error',
      html: "Datos Incompletos",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const yaExiste = await existeRegistro(form.norden, tabla, token);
  if (yaExiste) {
    await Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-pen-to-square"></i>Alerta',
      html: "Ya existe un registro para esta Orden. Use el botón Editar para actualizarlo.",
    });
    return;
  }

  // Registro nuevo: se sella la creación (usuario en sesión + fecha-hora actual).
  const body = buildBody(form, user, false);
  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, onPrint);
};


export const actualizarRegistro = async ({
  form,
  token,
  user,
  tabla,
  limpiar,
  registrarUrl,
  buildBody,
  onPrint = () => {},
}) => {
  if (!form.norden) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-clipboard-list"></i>Error',
      html: "Datos Incompletos",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const yaExiste = await existeRegistro(form.norden, tabla, token);
  if (!yaExiste) {
    await Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-floppy-disk"></i>Alerta',
      html: "No existe un registro para esta Orden. Use el botón Guardar para registrarlo.",
    });
    return;
  }

  // Edición: se sella la actualización (usuario en sesión + fecha-hora actual).
  const body = buildBody(form, user, true);
  await SubmitDataServiceDefault(token, limpiar, body, registrarUrl, onPrint);
};

/**
 * VERIFICAR por N° Orden: decide si se trata de un registro NUEVO o EXISTENTE y delega la
 * carga de datos en los callbacks correspondientes.
 *
 *  - Sin registro previo (id === 0) -> onNuevo()      (cargar datos del paciente).
 *  - Con registro previo            -> valida sede -> onExistente()  (cargar para edición).
 *
 * @param {object}   p
 * @param {string}   p.nro
 * @param {string}   p.tabla
 * @param {string}   p.token
 * @param {string}   [p.sede]         Si se pasa, valida que la Orden pertenezca a la sede.
 * @param {Function} [p.onNuevo]
 * @param {Function} [p.onExistente]
 */
export const verificarRegistro = async ({
  nro,
  tabla,
  token,
  sede,
  onNuevo = () => {},
  onExistente = () => {},
}) => {
  if (!nro) {
    await Swal.fire({
      icon: "error",
      title: '<i class="fa-solid fa-keyboard"></i>Error',
      html: "Debe Introducir un N° Orden válido",
    });
    return;
  }

  LoadingDefault("Validando datos");
  const res = await getFetch(
    `${existenciaExamenesUrl}?nOrden=${nro}&nomService=${tabla}`,
    token
  );

  // Norden inexistente / inválido / error del backend (p. ej. 500 por overflow del N° Orden).
  if (!res || res.error) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
      html: `No se encontraron registros para el N° Orden ${nro}.`,
    });
    return;
  }

  if (res.id === 0) {
    // No tiene registro de este examen -> se cargan los datos del paciente.
    onNuevo();
    return;
  }

  // Ya tiene registro: validar que pertenezca a la sede actual antes de cargarlo.
  if (sede && !(await perteneceASede(nro, sede, token))) {
    Swal.fire({
      icon: "warning",
      title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
      html: `El N° Orden ${nro} pertenece a otra sede.`,
    });
    return;
  }

  onExistente();
};

/**
 * IMPRIMIR el reporte Jasper de un registro.
 *
 * El glob `import.meta.glob(...)` debe declararse en el controller (Vite exige un literal),
 * y aquí se recibe ya resuelto en `jasperModules`.
 *
 * @param {object}   p
 * @param {string}   p.nro
 * @param {string}   p.token
 * @param {string}   p.tabla
 * @param {object}   p.datosFooter
 * @param {string}   [p.sede]                 Si se pasa, valida sede antes de imprimir.
 * @param {string}   p.obtenerReporteUrl
 * @param {object}   p.jasperModules          Resultado de import.meta.glob (mapa ruta -> loader).
 * @param {string}   p.rutaModulo             Clave dentro de jasperModules del reporte a usar.
 */
export const imprimirReporteJasper = ({
  nro,
  token,
  tabla,
  datosFooter,
  sede,
  obtenerReporteUrl,
  jasperModules,
  rutaModulo,
}) => {
  LoadingDefault("Cargando Formato a Imprimir");
  getFetch(
    `${obtenerReporteUrl}?nOrden=${nro}&nameService=${tabla}&esJasper=true`,
    token
  )
    .then(async (res) => {
      // Sin datos / error del backend (500, 404) / N° Orden inexistente o inválido.
      if (!res || res.error || !(res.norden || res.norden_n_orden || res.n_orden)) {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-magnifying-glass"></i>Norden no encontrado',
          html: `No se encontraron registros para el N° Orden ${nro}.`,
        });
        return;
      }

      // El N° Orden existe: validar que pertenezca a la sede actual (solo en impresión manual).
      if (sede && !(await perteneceASede(nro, sede, token))) {
        Swal.fire({
          icon: "warning",
          title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
          html: `El N° Orden ${nro} pertenece a otra sede.`,
        });
        return;
      }

      const modulo = await jasperModules[rutaModulo]();
      if (typeof modulo.default === "function") {
        // Ejecuta la función exportada por default con los datos del reporte + footer.
        modulo.default({ ...res, ...datosFooter });
        Swal.close();
      } else {
        console.error(`El módulo ${rutaModulo} no exporta una función por defecto`);
        Swal.fire({
          icon: "error",
          title: '<i class="fa-solid fa-print"></i>Error',
          html: "No se pudo cargar el formato de impresión.",
        });
      }
    })
    .catch((error) => {
      console.error("Error al generar el reporte:", error);
      Swal.fire({
        icon: "error",
        title: '<i class="fa-solid fa-print"></i>Error',
        html: "Ocurrió un error al generar el reporte.",
      });
    });
};
