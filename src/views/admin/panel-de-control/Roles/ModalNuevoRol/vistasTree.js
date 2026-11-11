// Utilidades puras del árbol de vistas (opcionesInterfaz) del modal de accesos.

export const normalizar = (texto = '') =>
  String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Arma el árbol desde la lista plana (`idPadre`). Primero los nodos con hijos, luego las hojas.
export const construirArbol = (opciones, idPadre = null) =>
  opciones
    .filter((o) => (o.idPadre ?? null) === idPadre)
    .map((o) => ({
      id: o.id,
      label: o.nombre,
      descripcion: o.descripcion,
      children: construirArbol(opciones, o.id),
    }))
    .sort((a, b) => Number(b.children.length > 0) - Number(a.children.length > 0));

// Por cada nodo: cuántos descendientes tiene y cuántos están asignados. -> Map(id -> { total, asignados })
export const contarDescendientes = (arbol, asignadasSet) => {
  const conteos = new Map();
  const recorrer = (nodo) => {
    const acum = nodo.children.reduce(
      (a, hijo) => {
        const c = recorrer(hijo);
        return { total: a.total + c.total + 1, asignados: a.asignados + c.asignados + Number(asignadasSet.has(hijo.id)) };
      },
      { total: 0, asignados: 0 }
    );
    conteos.set(nodo.id, acum);
    return acum;
  };
  arbol.forEach(recorrer);
  return conteos;
};

// Conserva los nodos que cumplen `predicado` o que tienen algún descendiente que lo cumple.
export const filtrarArbol = (nodos, predicado) =>
  nodos.reduce((acc, nodo) => {
    const hijos = filtrarArbol(nodo.children, predicado);
    if (predicado(nodo) || hijos.length) acc.push({ ...nodo, children: hijos });
    return acc;
  }, []);
