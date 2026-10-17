import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * Complemento de La Arena que solo se despliega cuando el usuario lo pide.
 *
 * Cerrado es una tarjeta con su explicación y el botón «Generar…»; abierto muestra la sección de siempre
 * (`children`) con, en la barra de su título, el botón «Quitar» o, si ya está registrado en el ticket, el sello
 * «Registrado». `children` es una función que recibe esos `acciones` y los pasa a la sección.
 *
 * Al generarlo la sección se pone a la vista y el foco va a su primer dato (`selectorFoco`). Si el formulario ya
 * trae contenido el padre lo entrega abierto: eso no mueve la pantalla.
 */
export default function ComplementoDesplegable({
  icono,
  titulo,
  descripcion,
  textoBoton,
  selectorFoco,
  abierto,
  registrado = false,
  disabled = false,
  onGenerar,
  onQuitar,
  children,
}) {
  const seccionRef = useRef(null);
  const recienGenerado = useRef(false);

  useEffect(() => {
    if (!abierto || !recienGenerado.current) return;
    recienGenerado.current = false;
    const seccion = seccionRef.current;
    seccion?.scrollIntoView({ behavior: "smooth", block: "center" });
    seccion?.querySelector(selectorFoco)?.focus({ preventScroll: true });
  }, [abierto, selectorFoco]);

  const handleGenerar = () => {
    recienGenerado.current = true;
    onGenerar();
  };

  if (abierto) {
    const acciones = registrado ? (
      <span className="flex items-center gap-1 rounded bg-emerald-500 px-2 py-[2px] text-[10px] font-semibold text-white">
        <FontAwesomeIcon icon={faCircleCheck} /> Registrado
      </span>
    ) : !disabled ? (
      <button
        type="button"
        onClick={onQuitar}
        title={`Quitar ${titulo}`}
        className="
          flex items-center gap-1 rounded px-2 py-[2px]
          bg-white/15 hover:bg-white/30 ring-1 ring-inset ring-white/40
          text-[10px] font-semibold text-white
          transition-colors duration-150 active:scale-95"
      >
        <FontAwesomeIcon icon={faXmark} /> Quitar
      </button>
    ) : null;

    return <div ref={seccionRef}>{children(acciones)}</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-[12px] rounded border-[1px] border-dashed border-primario/40 bg-white px-[16px] py-[12px]">
      <div className="flex min-w-0 flex-1 items-center gap-[12px]">
        <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primario text-white">
          <FontAwesomeIcon icon={icono} />
        </span>

        <div className="min-w-0">
          <p className="font-semibold text-primario">{titulo}</p>
          <p className="text-gray-600">{descripcion}</p>
          {disabled && <p className="text-amber-700">Presione «Habilitar edición» para poder generarlo.</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerar}
        disabled={disabled}
        title={disabled ? "Presione «Habilitar edición» para poder generarlo" : undefined}
        className="
          bg-blue-600 hover:bg-blue-700
          text-white text-base px-6 py-2 rounded
          flex items-center justify-center gap-2 whitespace-nowrap
          transition-all duration-150 ease-out
          hover:shadow-lg
          active:scale-95 active:shadow-inner
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:bg-blue-600 disabled:hover:shadow-none disabled:active:scale-100"
      >
        <FontAwesomeIcon icon={faPlus} /> {textoBoton}
      </button>
    </div>
  );
}
