import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle, faGripVertical, faClone } from "@fortawesome/free-solid-svg-icons";

/**
 * Textarea de una sola línea al inicio que crece en vertical a medida que
 * se escribe. Sin barra de "resize" manual: la altura la maneja el scrollHeight.
 */
export function DescripcionInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value.toUpperCase())}
      onMouseDown={(e) => e.stopPropagation()}
      placeholder="Descripción..."
      className="block w-full min-w-[160px] resize-none overflow-hidden text-[11px] leading-snug border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-[#084788]"
    />
  );
}

/**
 * Cabecera compartida por las dos tablas. modo="seleccionados" agrega la
 * columna de arrastre (izquierda) y la de Descripción (derecha).
 * min-w fuerza el ancho mínimo para que el contenedor haga scroll en X
 * en pantallas angostas en lugar de aplastar las columnas.
 */
export function TablaDx({ modo = "disponibles", maxH = "max-h-[45vh]", children }) {
  const esSel = modo === "seleccionados";
  return (
    <div className={`${maxH} overflow-auto border border-gray-200 rounded-lg`}>
      <table
        className={`w-full ${
          esSel ? "min-w-[1170px]" : "min-w-[900px]"
        } border-collapse text-[11px] table-fixed`}
      >
        <colgroup>
          {esSel && <col className="w-[34px]" />}
          <col className="w-[36px]" />
          <col className="w-[42px]" />
          <col className={esSel ? "w-[12%]" : "w-[14%]"} />
          <col className={esSel ? "w-[13%]" : "w-[16%]"} />
          <col className={esSel ? "w-[20%]" : "w-[24%]"} />
          <col />
          <col />
          {esSel && <col className="w-[18%]" />}
        </colgroup>
        <thead className="sticky top-0 z-10">
          <tr className="text-gray-600 text-left [&>th]:bg-sky-50 [&>th]:shadow-[inset_0_-1px_0_#e5e7eb]">
            {esSel && <th className="px-1 py-2"></th>}
            <th className="px-2 py-2 font-semibold"></th>
            <th className="px-2 py-2 font-semibold">Id</th>
            <th className="px-2 py-2 font-semibold">Título</th>
            <th className="px-2 py-2 font-semibold">Diagnóstico</th>
            <th className="px-2 py-2 font-semibold text-sky-700">CIE10</th>
            <th className="px-2 py-2 font-semibold text-green-700">Recomendaciones</th>
            <th className="px-2 py-2 font-semibold text-red-700">Restricciones</th>
            {esSel && (
              <th className="px-2 py-2 font-semibold text-sky-700">Descripción</th>
            )}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/**
 * Fila de diagnóstico. Comparte las columnas base; en modo "seleccionados"
 * agrega el asa de arrastre, cambia el icono a - y muestra la Descripción.
 * El orden lo lleva `ordenFila` en el arreglo de seleccionados; aquí solo
 * se ve el Id, nunca el número de orden.
 * `onClonar` es opcional: si no se pasa, se oculta el botón de clonar (la
 * lista embebida en Triaje no tiene formulario propio para crear diagnósticos).
 */
export function FilaDx({
  dx,
  modo = "disponibles",
  onToggle,
  onClonar,
  descripcion = "",
  onDescripcionChange,
  arrastrando = false,
  overActivo = false,
  dragHandlers = {},
}) {
  const esSel = modo === "seleccionados";
  return (
    <tr
      {...dragHandlers}
      className={`align-top border-b border-gray-200 last:border-b-0 transition-colors ${
        esSel ? "bg-sky-50 hover:bg-sky-100" : "hover:bg-gray-50"
      } ${arrastrando ? "opacity-40" : ""} ${
        overActivo ? "[&>td]:border-t-2 [&>td]:border-sky-500" : ""
      }`}
    >
      {esSel && (
        <td className="px-1 py-2 text-center select-none">
          <span
            title="Arrastrar para reordenar"
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </span>
        </td>
      )}
      <td className="px-2 py-2">
        <FontAwesomeIcon
          icon={esSel ? faMinusCircle : faPlusCircle}
          title={esSel ? "Quitar de seleccionados" : "Agregar a seleccionados"}
          className={`text-2xl cursor-pointer ${
            esSel
              ? "text-red-500 hover:text-red-600"
              : "text-sky-600 hover:text-sky-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(dx.id);
          }}
        />
      </td>
      <td className="px-2 py-2 font-bold text-sky-700">
        <div className="flex items-center gap-1.5">
          <span>{dx.id}</span>
          {onClonar && (
            <button
              type="button"
              title="Clonar para crear uno nuevo"
              onClick={(e) => {
                e.stopPropagation();
                onClonar(dx);
              }}
              className="text-gray-400 hover:text-emerald-600 text-xs font-normal"
            >
              <FontAwesomeIcon icon={faClone} />
            </button>
          )}
        </div>
      </td>
      <td className="px-2 py-2 font-semibold text-gray-800 uppercase break-words">{dx.titulo}</td>
      <td className="px-2 py-2 text-gray-500 break-words">{dx.diagnostico}</td>
      <td className="px-2 py-2">
        <div className="flex flex-col gap-1">
          {dx.cie10s?.length > 0 && dx.cie10s.map((c, i) => (
            <div
              key={c.codigo}
              className="flex items-start gap-1.5 bg-sky-50 border border-sky-200 rounded-md px-1.5 py-0.5 leading-tight"
            >
              <span className="text-[10px] font-bold text-sky-500 shrink-0">{i + 1})</span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1 rounded shrink-0">
                {c.codigo}
              </span>
              <span className="text-[10px] uppercase text-sky-800">{c.descripcion}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-2 py-2">
        <div className="flex flex-col gap-1">
          {dx.recomendaciones?.length > 0 && dx.recomendaciones.map((r, i) => (
            <div
              key={r.id}
              className="flex items-start gap-1.5 bg-green-50 border border-green-200 rounded-md px-1.5 py-0.5 leading-tight"
            >
              <span className="text-[10px] font-bold text-green-500 shrink-0">{i + 1})</span>
              <span className="text-[10px] uppercase text-green-700">{r.descripcion}</span>
            </div>
          ))}
        </div>
      </td>
      <td className="px-2 py-2">
        <div className="flex flex-col gap-1">
          {dx.restricciones?.length > 0 && dx.restricciones.map((r, i) => (
            <div
              key={r.id}
              className="flex items-start gap-1.5 bg-red-50 border border-red-200 rounded-md px-1.5 py-0.5 leading-tight"
            >
              <span className="text-[10px] font-bold text-red-500 shrink-0">{i + 1})</span>
              <span className="text-[10px] text-red-800">{r.descripcion}</span>
            </div>
          ))}
        </div>
      </td>
      {esSel && (
        <td className="px-2 py-2">
          <DescripcionInput value={descripcion} onChange={onDescripcionChange} />
        </td>
      )}
    </tr>
  );
}
