import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCalendarCheck,
  faUserPlus,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import SectionFieldset from "./SectionFieldset";

/**
 * Item individual de auditoría: ícono + etiqueta + valor (solo lectura).
 */
function AuditoriaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primario/10 text-primario shrink-0">
        <FontAwesomeIcon icon={icon} className="text-sm" />
      </span>
      <div className="flex flex-col min-w-0 leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <span
          className="text-sm font-medium text-gray-800 truncate"
          title={value || ""}
        >
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

/**
 * Sección compacta de auditoría / trazabilidad del registro.
 *
 * Muestra la fecha-hora de creación y edición, junto con los usuarios que
 * registraron y editaron el formulario. Es una sección de solo lectura,
 * independiente de las firmas del documento.
 *
 * Nota: por ahora los datos se reciben por props (estáticos). Cuando el
 * backend / base de datos los provea, basta con pasar los valores reales.
 *
 * @param {string}  fechaCreacion   Fecha-hora de creación del registro.
 * @param {string}  fechaEdicion    Fecha-hora de la última edición.
 * @param {string}  usuarioRegistro Usuario que creó el registro.
 * @param {string}  usuarioEdicion  Usuario que realizó la última edición.
 * @param {boolean} mostrarEdicion  Si es false, solo se muestran los datos de
 *                                  creación (para registros nuevos aún sin editar).
 * @param {string}  legend          Título de la sección.
 * @param {string}  className       Clases extra para el contenedor.
 */
export default function AuditoriaRegistro({
  fechaCreacion = "",
  fechaEdicion = "",
  usuarioRegistro = "",
  usuarioEdicion = "",
  mostrarEdicion = true,
  legend = "Auditoría del Registro",
  className = "",
}) {
  // Con edición se muestran 4 columnas; sin edición solo las 2 de creación.
  const colsClass = mostrarEdicion
    ? "sm:grid-cols-2 lg:grid-cols-4"
    : "sm:grid-cols-2";

  return (
    <SectionFieldset
      legend={legend}
      className={`grid grid-cols-1 ${colsClass} gap-x-4 gap-y-3 ${className}`}
    >
      <AuditoriaItem
        icon={faCalendarPlus}
        label="Fecha hora creación"
        value={fechaCreacion}
      />
      {mostrarEdicion && (
        <AuditoriaItem
          icon={faCalendarCheck}
          label="Fecha hora edición"
          value={fechaEdicion}
        />
      )}
      <AuditoriaItem
        icon={faUserPlus}
        label="Usuario registro"
        value={usuarioRegistro}
      />
      {mostrarEdicion && (
        <AuditoriaItem
          icon={faUserPen}
          label="Usuario edición"
          value={usuarioEdicion}
        />
      )}
    </SectionFieldset>
  );
}
