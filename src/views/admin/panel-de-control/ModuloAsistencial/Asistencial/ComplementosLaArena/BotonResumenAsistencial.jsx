import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical } from "@fortawesome/free-solid-svg-icons";

// Botón "Resumen Asistencial" de las Historias Clínicas: imprime la hoja de Historia Clínica del ticket
// buscado. Es un extra del cliente La Arena: el formulario solo lo monta con ese checkbox marcado.
export default function BotonResumenAsistencial({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        bg-violet-600 hover:bg-violet-700
        text-white text-base px-6 py-2 rounded
        flex items-center gap-2
        transition-all duration-150 ease-out
        hover:shadow-lg
        active:scale-95 active:shadow-inner"
    >
      <FontAwesomeIcon icon={faFileMedical} /> Resumen Asistencial
    </button>
  );
}
