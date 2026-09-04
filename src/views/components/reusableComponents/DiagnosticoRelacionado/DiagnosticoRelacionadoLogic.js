// Lógica pura de selección de diagnósticos relacionados, compartida entre el
// modal, la lista embebida y cualquier formulario que integre
// DiagnosticoRelacionadoField. Todas las funciones que mutan estado reciben
// `setSeleccionados`, el setState (o updater) de un arreglo:
//
//   [{ id, formularioId, ordenFila, diagnosticoPersonalizado, detalle }]
//
// - id: id del diagnóstico (catálogo /api/v01/ct/diagnostico).
// - formularioId: id de la fila persistida "formularioDiagnostico" (la
//   relación triaje/formulario <-> diagnóstico). null mientras no se haya
//   guardado; se preserva al editar para que el backend actualice en vez
//   de duplicar.
// - detalle: snapshot del diagnóstico (titulo, diagnostico, cie10s,
//   recomendaciones, restricciones) para poder pintar la fila sin depender
//   de que el catálogo siga teniendo ese id cargado.

// Reasigna ordenFila (1..n) según la posición actual del arreglo.
export const renumerar = (arr) => arr.map((s, i) => ({ ...s, ordenFila: i + 1 }));

// `dxOrId`: el diagnóstico completo (al agregar desde "disponibles", para
// guardar su `detalle`) o solo su id (al quitar desde "seleccionados").
export const toggleSeleccion = (setSeleccionados, dxOrId) => {
  const esObjeto = dxOrId !== null && typeof dxOrId === "object";
  const id = esObjeto ? dxOrId.id : dxOrId;

  setSeleccionados((actuales) => {
    const existe = actuales.some((s) => s.id === id);
    if (existe) {
      return renumerar(actuales.filter((s) => s.id !== id));
    }
    const nuevo = {
      id,
      formularioId: null,
      ordenFila: actuales.length + 1,
      diagnosticoPersonalizado: "",
      detalle: esObjeto ? dxOrId : null,
    };
    return renumerar([...actuales, nuevo]);
  });
};

export const actualizarDescripcion = (setSeleccionados, id, texto) => {
  setSeleccionados((actuales) =>
    actuales.map((s) => (s.id === id ? { ...s, diagnosticoPersonalizado: texto } : s))
  );
};

export const moverSeleccion = (setSeleccionados, from, to) => {
  setSeleccionados((actuales) => {
    const arr = [...actuales];
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return actuales;
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    return renumerar(arr);
  });
};

// --- Adaptadores hacia/desde el backend ---------------------------------

// Los endpoints que devuelven un registro ya guardado (p.ej.
// listarFormatoTriaje) traen `formulariosDiagnostico` con esta forma:
//   { id, diagnostico, diagnosticoDetalleDTO: { id, codigo, titulo,
//     diagnostico, cie10s, recomendaciones, restricciones }, ordenFila? }
// donde el `id` de más afuera es el de la fila persistida y `diagnostico`
// (también de más afuera) es en realidad el comentario personalizado, no
// el nombre del diagnóstico. Esta función lo convierte al shape interno
// que usan el modal y la lista.
export const hidratarFormulariosDiagnostico = (formulariosDiagnostico) =>
  renumerar(
    (formulariosDiagnostico || []).map((f, i) => ({
      id: f.diagnosticoDetalleDTO?.id ?? f.idDiagnostico,
      formularioId: f.id ?? null,
      ordenFila: f.ordenFila ?? i + 1,
      diagnosticoPersonalizado: f.diagnostico ?? f.diagnosticoPersonalizado ?? "",
      detalle: f.diagnosticoDetalleDTO ?? null,
    }))
  );

// Inverso de `hidratarFormulariosDiagnostico`: arma el arreglo que espera
// el body de registrar/actualizar. `id: null` en una fila nueva le dice al
// backend que la cree; si venía de `hidratarFormulariosDiagnostico` con un
// `formularioId`, se preserva para que la actualice en vez de duplicarla.
export const serializarFormulariosDiagnostico = (seleccionados) =>
  (seleccionados || []).map((s) => ({
    id: s.formularioId ?? null,
    idDiagnostico: s.id,
    diagnosticoPersonalizado: s.diagnosticoPersonalizado || "",
    ordenFila: s.ordenFila,
  }));
