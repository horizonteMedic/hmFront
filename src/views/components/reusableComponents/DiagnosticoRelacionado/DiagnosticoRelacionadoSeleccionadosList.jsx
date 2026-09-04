import { useState } from "react";
import { TablaDx, FilaDx } from "./DiagnosticoRelacionadoTabla";
import { toggleSeleccion, actualizarDescripcion, moverSeleccion } from "./DiagnosticoRelacionadoLogic";

/**
 * Tabla de diagnósticos seleccionados (fondo azul, reordenable por arrastre,
 * con columna Descripción), reutilizada tanto dentro del modal de búsqueda
 * como embebida directamente en el formulario dueño. `seleccionados` es el
 * arreglo [{ id, formularioId, ordenFila, diagnosticoPersonalizado, detalle }]
 * que vive en el estado del formulario que la usa. Cada fila se pinta con
 * su propio `detalle` (snapshot guardado al seleccionar, o hidratado desde
 * el backend); `lista` (el catálogo) solo se usa como respaldo si por
 * alguna razón un seleccionado no trae `detalle`.
 */
export default function DiagnosticoRelacionadoSeleccionadosList({
  lista = [],
  seleccionados,
  setSeleccionados,
  maxH = "max-h-[35vh]",
  hint = true,
}) {
  const [filaArrastrada, setFilaArrastrada] = useState(null);
  const [filaSobre, setFilaSobre] = useState(null);

  const mapaSeleccion = new Map(seleccionados.map((s) => [s.id, s]));
  // En orden de seleccionados (ordenFila), no en orden de `lista`.
  const elegidos = seleccionados
    .map((s) => s.detalle ?? lista.find((dx) => dx.id === s.id))
    .filter(Boolean);

  // Toda la fila es arrastrable (salvo si se empieza sobre el textarea de
  // Descripción, para poder seleccionar texto ahí).
  const dragHandlersFila = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      if (e.target.closest("textarea, button")) { e.preventDefault(); return; }
      setFilaArrastrada(index);
      e.dataTransfer.effectAllowed = "move";
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (filaSobre !== index) setFilaSobre(index);
    },
    onDrop: (e) => {
      e.preventDefault();
      if (filaArrastrada !== null && filaArrastrada !== index) {
        moverSeleccion(setSeleccionados, filaArrastrada, index);
      }
      setFilaArrastrada(null);
      setFilaSobre(null);
    },
    onDragEnd: () => { setFilaArrastrada(null); setFilaSobre(null); },
  });

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-sky-700">
        Diagnósticos Relacionados Seleccionados ({elegidos.length})
        {hint && elegidos.length > 0 && (
          <span className="ml-2 font-normal text-gray-400">
            — arrastra una fila para ordenar
          </span>
        )}
      </span>
      {elegidos.length > 0 ? (
        <TablaDx modo="seleccionados" maxH={maxH}>
          {elegidos.map((dx, index) => (
            <FilaDx
              key={dx.id}
              dx={dx}
              modo="seleccionados"
              onToggle={(id) => toggleSeleccion(setSeleccionados, id)}
              descripcion={mapaSeleccion.get(dx.id)?.diagnosticoPersonalizado ?? ""}
              onDescripcionChange={(t) => actualizarDescripcion(setSeleccionados, dx.id, t)}
              arrastrando={filaArrastrada === index}
              overActivo={
                filaSobre === index &&
                filaArrastrada !== null &&
                filaArrastrada !== index
              }
              dragHandlers={dragHandlersFila(index)}
            />
          ))}
        </TablaDx>
      ) : (
        <p className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-3 py-4 text-center">
          Ninguno seleccionado
        </p>
      )}
    </div>
  );
}
