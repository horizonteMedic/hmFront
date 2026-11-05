import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Medidas en px (no rem) porque :root tiene font-size:10px !important y rompería la escala de Tailwind.
const MARGEN = 8; // distancia mínima al borde de la ventana
const SEPARACION = 4; // hueco entre el casillero y la lista
const ANCHO_MIN = 320; // ancho mínimo de la lista (como antes: min-w-[320px])
const ALTO_MAX = 480; // tope de alto; si hay más opciones se desplaza dentro de la lista
const ALTO_MIN = 80; // alto mínimo aunque casi no haya espacio

// ¿El casillero sigue a la vista? Se oculta la lista si el casillero salió de la ventana o quedó
// fuera de algún contenedor con scroll/overflow (p. ej. la tabla de experiencia al desplazarla).
const anclaVisible = (ancla) => {
  const r = ancla.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) {
    return false;
  }
  for (let el = ancla.parentElement; el && el !== document.body; el = el.parentElement) {
    const { overflowX, overflowY } = window.getComputedStyle(el);
    if (/(auto|scroll|hidden|clip)/.test(`${overflowX} ${overflowY}`)) {
      const c = el.getBoundingClientRect();
      if (r.bottom < c.top || r.top > c.bottom || r.right < c.left || r.left > c.right) {
        return false;
      }
    }
  }
  return true;
};

// Lista de opciones de un autocompletable que NO queda recortada por el contenedor de la fila.
// Se monta con `createPortal` en document.body y `position: fixed`, ubicada bajo `anchorRef`
// (o encima, si debajo no hay espacio) a partir de su getBoundingClientRect; se reubica al
// hacer scroll (de la página o de cualquier contenedor) y al redimensionar la ventana.
// Los hijos son los <li> de las opciones.
const ListaOpciones = ({ anchorRef, children }) => {
  const listaRef = useRef(null);

  const reubicar = () => {
    const ancla = anchorRef.current;
    const lista = listaRef.current;
    if (!ancla || !lista) return;

    if (!anclaVisible(ancla)) {
      lista.style.visibility = "hidden";
      return;
    }

    const r = ancla.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    const ancho = Math.min(Math.max(r.width, ANCHO_MIN), vw - 2 * MARGEN);
    const left = Math.max(MARGEN, Math.min(r.left, vw - ancho - MARGEN));

    // scrollHeight = alto de todas las opciones (sin importar el max-height); + bordes.
    const altoNatural = Math.min(lista.scrollHeight + (lista.offsetHeight - lista.clientHeight), ALTO_MAX);
    const espacioAbajo = vh - r.bottom - SEPARACION - MARGEN;
    const espacioArriba = r.top - SEPARACION - MARGEN;
    const abajo = altoNatural <= espacioAbajo || espacioAbajo >= espacioArriba;
    const maxHeight = Math.max(ALTO_MIN, Math.min(ALTO_MAX, abajo ? espacioAbajo : espacioArriba));
    const alto = Math.min(altoNatural, maxHeight);

    lista.style.left = `${left}px`;
    lista.style.width = `${ancho}px`;
    lista.style.maxHeight = `${maxHeight}px`;
    lista.style.top = `${abajo ? r.bottom + SEPARACION : r.top - SEPARACION - alto}px`;
    lista.style.visibility = "visible";
  };

  // En cada render (cambian las opciones al escribir) se recalcula antes de pintar.
  useLayoutEffect(reubicar);

  useEffect(() => {
    // capture: true => también atrapa el scroll de contenedores internos (no burbujea).
    window.addEventListener("scroll", reubicar, true);
    window.addEventListener("resize", reubicar);
    return () => {
      window.removeEventListener("scroll", reubicar, true);
      window.removeEventListener("resize", reubicar);
    };
    // reubicar solo lee refs: no depende del estado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <ul
      ref={listaRef}
      // Evita que pulsar la barra de scroll de la lista le quite el foco al casillero (cerraría la lista).
      onMouseDown={(e) => e.preventDefault()}
      className="bg-white border border-gray-300 rounded-md overflow-y-auto text-black shadow-lg m-0 p-0 list-none"
      style={{ position: "fixed", top: 0, left: 0, visibility: "hidden", zIndex: 1000 }}
    >
      {children}
    </ul>,
    document.body
  );
};

export default ListaOpciones;
