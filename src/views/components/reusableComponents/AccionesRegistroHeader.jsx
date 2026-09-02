import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faBroom } from "@fortawesome/free-solid-svg-icons";
import RegistroEstadoPill from "./RegistroEstadoPill";

/**
 * Barra superior (sticky) reutilizable para los formularios ocupacionales.
 *
 * Muestra la pill de estado del registro y, a su lado, los botones de
 * "Habilitar edición" y "Limpiar". Ambos botones comparten el mismo tamaño de
 * letra y su contenido (icono + texto) queda centrado en X e Y.
 *
 * - "Habilitar edición" aparece solo cuando hay un registro cargado, es un
 *   registro existente y la edición todavía no está habilitada.
 * - "Limpiar" está siempre disponible (se puede ocultar con `mostrarLimpiar`).
 *
 * `children` se renderiza antes de la pill, por si el formulario necesita
 * un botón extra en la barra (p. ej. "Carga Masiva").
 */
export default function AccionesRegistroHeader({
  tieneRegistro = false,
  hayRegistroCargado = false,
  edicionHabilitada = false,
  onHabilitarEdicion = () => {},
  onLimpiar = () => {},
  newLabel,
  editLabel,
  children,
}) {
  const btnBase =
    "pointer-events-auto inline-flex items-center justify-center gap-2 text-white text-md font-semibold px-3 py-1.5 rounded transition-all duration-150 ease-out hover:shadow-lg active:scale-95 active:shadow-inner";

  const mostrarHabilitar =
    hayRegistroCargado && tieneRegistro && !edicionHabilitada;

  const mostrarLimpiar =
    hayRegistroCargado && tieneRegistro ;

  return (
    <div className="sticky top-2 z-20 my-4 flex justify-end items-center gap-3 pointer-events-none">
      {children}

      <RegistroEstadoPill
        tieneRegistro={tieneRegistro}
        className={hayRegistroCargado ? "" : "invisible"}
        {...(newLabel ? { newLabel } : {})}
        {...(editLabel ? { editLabel } : {})}
      />

      {mostrarHabilitar && (
        <button
          type="button"
          onClick={onHabilitarEdicion}
          className={`${btnBase} bg-blue-600 hover:bg-blue-700`}
        >
          <FontAwesomeIcon icon={faEdit} /> Habilitar edición
        </button>
      )}

      {mostrarLimpiar && (
        <button
          type="button"
          onClick={onLimpiar}
          className={`${btnBase} bg-amber-500 hover:bg-amber-600`}
        >
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      )}
    </div>
  );
}
