import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Botón de búsqueda reutilizable.
 *
 * @param {() => void} onClick   Acción a ejecutar al hacer click (p. ej. executeSearch).
 * @param {string}     label     Texto del botón. Si es vacío, solo se muestra el ícono.
 * @param {object}     icon      Ícono de FontAwesome (por defecto la lupa faSearch).
 * @param {string}     className Clases extra que se agregan a las base (p. ej. "md:hidden", "w-full").
 * @param {string}     type      Tipo del botón ("button" por defecto para no enviar formularios).
 * @param {boolean}    disabled  Deshabilita el botón.
 * @param {string}     title     Tooltip nativo del botón.
 */
export default function SearchButton({
  onClick,
  label = "Buscar",
  icon = faSearch,
  className = "",
  type = "button",
  disabled = false,
  title = "Buscar",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-4 py-2 rounded-lg azuloscurobackground text-white flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {label && <span>{label}</span>}
      {icon && <FontAwesomeIcon icon={icon} />}
    </button>
  );
}
