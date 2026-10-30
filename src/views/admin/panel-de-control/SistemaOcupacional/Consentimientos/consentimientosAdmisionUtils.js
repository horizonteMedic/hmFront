import { sellarAuditoria } from "../../../../utils/auditoriaUtils";

/**
 * Auditoría de los consentimientos que usan el endpoint compartido de "consentimientos de admisión"
 * (ConsentimientosAdmisionDTO / ConsentimientosReporteDTO).
 *
 * Particularidades de ese contrato:
 *  - `fechaRegistro` es una FECHA (LocalDate) con la fecha del examen, no el sello de creación. El front la
 *    envía y la lee como la fecha del examen (`form.fecha`), así que no sirve como "fecha hora creación".
 *  - El usuario que registra se llama `usuarioRegistro` (request y reporte) y el que actualiza,
 *    `usuarioActualiza` (solo request).
 *  - El reporte aún no devuelve sello de creación ni datos de edición: quedan vacíos hasta que el backend los
 *    agregue.
 */

// Campos de auditoría que se cargan al abrir un registro existente (a partir del reporte).
export const auditoriaDesdeReporte = (res) => ({
  // No se usa `res.fechaRegistro`: es la fecha del examen (ya se muestra en `fecha`), no la de creación.
  fechaRegistro: "",
  userRegistro: res.usuarioRegistro ?? "",
  fechaActualizacion: res.fechaActualizacion ?? "",
  usuarioActualizacion: res.usuarioActualizacion ?? res.usuarioActualiza ?? "",
  tieneRegistro: true,
});

// Body completo (creación / actualización) a partir de los campos propios del consentimiento.
// Tras sellar la auditoría se vuelve a forzar `fechaRegistro` a la fecha del examen para no mandarle un
// datetime a un LocalDate. Al editar, si no se conoce el creador, se manda el usuario en sesión (como
// siempre) en vez de null para no borrarlo.
export const sellarConsentimientoAdmision = (base, form, user, esActualizacion) => ({
  ...sellarAuditoria(base, {
    user,
    esActualizacion,
    userRegistro: form.userRegistro || user,
    fechaRegistro: form.fechaRegistro,
    campoUserRegistro: "usuarioRegistro",
  }),
  fechaRegistro: form.fecha,
  usuarioActualiza: user,
});
