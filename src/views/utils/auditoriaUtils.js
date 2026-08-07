import { formatearFechaHora } from "./formatDateUtils";
import { getTimestampActual } from "./helpers";

/**
 * buildAuditoria
 * --------------  
 *
 * @param {object} form
 * @param {object} ctx
 * @param {string} ctx.usuarioActual    Usuario en sesión (para la creación en vivo).
 * @param {string} ctx.fechaHoraActual  Fecha-hora actual ya formateada (creación en vivo).
 * @returns {{
 *   fechaCreacion: string,
 *   usuarioRegistro: string,
 *   fechaActualizacion: string,
 *   usuarioActualizacion: string,
 * }}
 */

export const buildAuditoria = (form, { usuarioActual, fechaHoraActual }) =>
  form.tieneRegistro
    ? {
        // Registro existente: creación y actualización REALES (obtenerReporte).
        fechaCreacion: formatearFechaHora(form.fechaRegistro),
        usuarioRegistro: form.userRegistro,
        fechaActualizacion: formatearFechaHora(form.fechaActualizacion),
        usuarioActualizacion: form.usuarioActualizacion,
      }
    : {
        // Registro nuevo: solo datos de creación en vivo (aún no existe en BD).
        fechaCreacion: fechaHoraActual,
        usuarioRegistro: usuarioActual,
        fechaActualizacion: "",
        usuarioActualizacion: "",
      };

/**
 * sellarAuditoria
 * --------------- 
 *
 * @param {object}  base                       Campos propios del formulario (body sin auditoría).
 * @param {object}  ctx
 * @param {string}  ctx.user                   Usuario en sesión que registra/actualiza.
 * @param {boolean} ctx.esActualizacion        true = edición, false = registro nuevo.
 * @param {string=} ctx.userRegistro           Creación original (solo se reenvía en edición).
 * @param {string=} ctx.fechaRegistro          Fecha de creación original (solo edición).
 * @param {string=} ctx.campoUserRegistro      Nombre de la clave esperada por el backend en el
 *                                              REQUEST (algunos endpoints, ej. HojaConsultaExterna,
 *                                              usan "usuarioRegistro" en vez de "userRegistro").
 * @returns {object} body completo con auditoría.
 */
export const sellarAuditoria = (
  base,
  { user, esActualizacion, userRegistro, fechaRegistro, campoUserRegistro = "userRegistro" }
) => {
  const ahora = getTimestampActual();

  return esActualizacion
    ? {
        ...base,
        usuarioActualizacion: user,
        fechaActualizacion: ahora,
        // Reenvía la creación original: en el UPDATE el backend pone userRegistro en null
        // si no se incluye (fechaRegistro la conserva, pero la mandamos igual).
        [campoUserRegistro]: userRegistro || null,
        fechaRegistro: fechaRegistro || null,
      }
    : {
        ...base,
        [campoUserRegistro]: user,
        fechaRegistro: ahora,
        usuarioActualizacion: null,
        fechaActualizacion: null,
      };
};

export default buildAuditoria;
