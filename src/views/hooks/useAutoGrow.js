import { useLayoutEffect, useRef } from "react";

/**
 * Hace que un <textarea> crezca (y encoja) según su contenido, sin barra de scroll.
 * `rows` del textarea actúa como altura mínima. Se reajusta al cambiar el valor y
 * cuando cambia el ancho disponible (el texto se reacomoda en más/menos líneas).
 *
 * Uso: const ref = useAutoGrow(value, autoGrow); <textarea ref={ref} className="overflow-hidden" />
 */
export function useAutoGrow(value, enabled = true) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return undefined;

    const ajustar = () => {
      el.style.height = "auto";
      // scrollHeight no incluye el borde: se suma para que el textarea (border-box) no quede corto.
      el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
    };
    ajustar();

    if (typeof ResizeObserver === "undefined") return undefined;
    let anchoPrevio = el.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === anchoPrevio) return;
      anchoPrevio = el.offsetWidth;
      ajustar();
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.height = "";
    };
  }, [value, enabled]);

  return ref;
}
