import { useEffect, useState } from "react";

/**
 * useRegistroEditable
 * -------------------
 * Encapsula el patrón de "registro editable" de los formularios ocupacionales.
 * Es una pieza reutilizable: cualquier formulario que distinga entre un registro
 * NUEVO y uno EXISTENTE puede usarlo pasando su `form`, su `setForm` y la lista de
 * campos que el usuario puede editar.
 *
 * Resuelve dos comportamientos que antes vivían inline en cada formulario:
 *
 *  1. Bloqueo de edición
 *     Un registro EXISTENTE se carga en modo lectura y solo se desbloquea al pulsar
 *     "Habilitar edición". Un registro NUEVO siempre es editable.
 *
 *  2. Snapshot + revert por campo
 *     Al cargar un registro existente se guarda una copia de los campos editables
 *     ("valores originales"), para poder resaltar los campos modificados y revertirlos
 *     uno a uno (o en grupo, p. ej. un dato compuesto id + nombre).
 *
 * @param {object}   form                     Estado del formulario (de useForm).
 * @param {Function} setForm                  Setter del formulario (de useForm).
 * @param {object}   options
 * @param {boolean}  options.tieneRegistro    true si el form corresponde a un registro ya existente.
 * @param {string[]} options.camposEditables  Campos que el usuario puede editar (para snapshot/revert).
 *
 * @returns {{
 *   edicionHabilitada: boolean,
 *   habilitarEdicion: () => void,
 *   camposDeshabilitados: boolean,
 *   valoresOriginales: (object|null),
 *   isFieldEdited: (campo: string) => boolean,
 *   revertField: (campo: string) => void,
 *   revertFields: (campos: string[]) => void,
 * }}
 */
export const useRegistroEditable = (form, setForm, options) => {
  const { tieneRegistro, camposEditables } = options;

  // Edición bloqueada hasta pulsar "Habilitar edición" (solo aplica a registros existentes).
  const [edicionHabilitada, setEdicionHabilitada] = useState(false);

  // Snapshot de los valores originales, tomado al cargar un registro existente.
  const [valoresOriginales, setValoresOriginales] = useState(null);

  useEffect(() => {
    // Cada vez que cambia el registro cargado, la edición vuelve a bloquearse.
    setEdicionHabilitada(false);
    if (tieneRegistro) {
      // Al entrar en modo edición guardamos los valores cargados como "originales".
      setValoresOriginales(
        camposEditables.reduce((acc, campo) => {
          acc[campo] = form[campo];
          return acc;
        }, {})
      );
    } else {
      setValoresOriginales(null);
    }
    // Solo queremos capturar el snapshot al pasar a (o salir de) modo edición.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tieneRegistro]);

  // ¿El campo difiere de su valor original? (solo aplica en modo edición).
  const isFieldEdited = (campo) =>
    Boolean(valoresOriginales) && valoresOriginales[campo] !== form[campo];

  // Revierte un único campo a su valor original.
  const revertField = (campo) => {
    if (!valoresOriginales) return;
    setForm((f) => ({ ...f, [campo]: valoresOriginales[campo] }));
  };

  // Revierte varios campos a la vez (p. ej. un dato compuesto: id de firma + nombre).
  const revertFields = (campos) => {
    if (!valoresOriginales) return;
    setForm((f) => {
      const next = { ...f };
      campos.forEach((campo) => {
        next[campo] = valoresOriginales[campo];
      });
      return next;
    });
  };

  // Habilita la edición de los campos (solo tiene efecto en registros existentes).
  const habilitarEdicion = () => setEdicionHabilitada(true);

  // Campos bloqueados si es un registro existente y aún no se pulsó "Habilitar edición".
  // En un registro nuevo siempre están habilitados.
  const camposDeshabilitados = tieneRegistro && !edicionHabilitada;

  return {
    edicionHabilitada,
    habilitarEdicion,
    camposDeshabilitados,
    valoresOriginales,
    isFieldEdited,
    revertField,
    revertFields,
  };
};

export default useRegistroEditable;
