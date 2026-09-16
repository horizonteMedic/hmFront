import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Botón para revertir el cambio de un campo a su valor original.
 * Pensado para mostrarse únicamente cuando el campo fue modificado
 * (ver props `edited`/`onRevert` en los inputs reutilizables).
 */
export default function RevertButton({
  onClick,
  title = "Revertir cambio",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`
        inline-flex items-center justify-center shrink-0
        w-6 h-6 rounded-full
        bg-orange-100 text-orange-700
        border border-orange-300
        hover:bg-orange-200 hover:text-orange-800
        shadow-sm
        transition-all duration-150 ease-out
        active:scale-90
        ${className}`}
    >
      <FontAwesomeIcon icon={faRotateLeft} className="text-[11px]" />
    </button>
  );
}
