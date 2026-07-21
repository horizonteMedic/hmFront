import { faCirclePlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Pill reutilizable que informa el modo del formulario:
 * - tieneRegistro = false  -> "Nuevo registro" (verde)
 * - tieneRegistro = true   -> "Editando registro" (naranja)
 *
 * Los textos son configurables para reutilizarla en otros formularios.
 */
export default function RegistroEstadoPill({
  tieneRegistro = false,
  newLabel = "Nuevo registro",
  editLabel = "Editando registro",
  className = "",
}) {
  const isEdit = Boolean(tieneRegistro);

  const styles = isEdit
    ? {
        wrapper: "bg-orange-100 text-orange-800 border-orange-300",
        dot: "bg-orange-500",
        icon: faPenToSquare,
        text: editLabel,
      }
    : {
        wrapper: "bg-emerald-100 text-emerald-800 border-emerald-300",
        dot: "bg-emerald-500",
        icon: faCirclePlus,
        text: newLabel,
      };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-md font-semibold shadow-sm select-none ${styles.wrapper} ${className}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${styles.dot}`} />
      <FontAwesomeIcon icon={styles.icon} />
      {styles.text}
    </span>
  );
}
