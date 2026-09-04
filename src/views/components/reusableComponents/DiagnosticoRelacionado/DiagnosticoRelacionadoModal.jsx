import { useEffect, useRef, useState } from "react";
import { getDiagnosticosRelacionados } from "./controllerDiagnosticoRelacionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPlusCircle,
  faMinusCircle,
  faTimes,
  faGripVertical,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import DiagnosticoRelacionadoFormModal from "./DiagnosticoRelacionadoFormModal";


// Minúsculas y sin acentos, para comparar de forma flexible.
const normalizar = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Reasigna ordenFila (1..n) según la posición actual del arreglo.
const renumerar = (arr) => arr.map((s, i) => ({ ...s, ordenFila: i + 1 }));

/**
 * Textarea de una sola línea al inicio que crece en vertical a medida que
 * se escribe. Sin barra de "resize" manual: la altura la maneja el scrollHeight.
 */
function DescripcionInput({ value, onChange }) {
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
      onChange={(e) => onChange(e.target.value)}
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
function TablaDx({ modo = "disponibles", maxH = "max-h-[45vh]", children }) {
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
 */
function FilaDx({
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


export default function DiagnosticoRelacionadoModal({ visible, onClose, diagnosticosRelacionados, setDiagnosticosRelacionados, token }) {

  const [filtros, setFiltros] = useState({
    identificador: "",
    diagnostico: "",
  })
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  // Diagnóstico de la lista que se está clonando (null = form en blanco).
  const [plantillaClonar, setPlantillaClonar] = useState(null);

  const abrirNuevo = () => {
    setPlantillaClonar(null);
    setFormVisible(true);
  };

  const abrirClon = (dx) => {
    setPlantillaClonar(dx);
    setFormVisible(true);
  };

  const cerrarForm = () => {
    setFormVisible(false);
    setPlantillaClonar(null);
  };

  // Reordenamiento de la tabla de seleccionados (arrastre + flechas ▲▼).
  const [filaArrastrada, setFilaArrastrada] = useState(null);
  const [filaSobre, setFilaSobre] = useState(null);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = 'hidden';

    // Con el formulario "Agregar Nuevo" abierto, Esc lo cierra a él (su
    // propio modal), no a este.
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !formVisible) cerrarModal();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [visible, formVisible]);

  useEffect(() => { obtenerDiagnósticosRelacionados() }, [])



  const obtenerDiagnósticosRelacionados = () => {
    getDiagnosticosRelacionados(setLoading, setDiagnosticosRelacionados, token)
  };

  const cerrarModal = () => {
    setFiltros({
      identificador: "",
      diagnostico: "",
    })
    onClose();
  }

  // seleccionados: [{ id, ordenFila, diagnosticoPersonalizado }] — el orden
  // del arreglo ES el orden de las filas y se refleja en ordenFila.
  const seleccionados = diagnosticosRelacionados?.seleccionados ?? [];

  const toggleSeleccion = (id) => {
    setDiagnosticosRelacionados((prev) => {
      const actuales = prev.seleccionados ?? [];
      const existe = actuales.some((s) => s.id === id);
      const next = existe
        ? actuales.filter((s) => s.id !== id)
        : [...actuales, { id, ordenFila: actuales.length + 1, diagnosticoPersonalizado: "" }];
      return { ...prev, seleccionados: renumerar(next) };
    });
  };

  const actualizarDescripcion = (id, texto) => {
    setDiagnosticosRelacionados((prev) => ({
      ...prev,
      seleccionados: (prev.seleccionados ?? []).map((s) =>
        s.id === id ? { ...s, diagnosticoPersonalizado: texto } : s
      ),
    }));
  };

  const moverSeleccion = (from, to) => {
    setDiagnosticosRelacionados((prev) => {
      const arr = [...(prev.seleccionados ?? [])];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return prev;
      const [it] = arr.splice(from, 1);
      arr.splice(to, 0, it);
      return { ...prev, seleccionados: renumerar(arr) };
    });
  };

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
        moverSeleccion(filaArrastrada, index);
      }
      setFilaArrastrada(null);
      setFilaSobre(null);
    },
    onDragEnd: () => { setFilaArrastrada(null); setFilaSobre(null); },
  });

  if (!visible) return null;

  const lista = diagnosticosRelacionados?.lista ?? [];

  // Id: coincide desde el primer dígito (prefijo). "12" -> 12, 120, 125...
  const idFiltro = filtros.identificador.trim();
  const coincideId = (dx) => idFiltro === "" || String(dx.id).startsWith(idFiltro);

  // Diagnóstico: flexible. Cada palabra escrita debe aparecer (en cualquier
  // orden, sin acentos ni mayúsculas) en título + diagnóstico + CIE10.
  const tokensDx = normalizar(filtros.diagnostico).trim().split(/\s+/).filter(Boolean);
  const coincideDiagnostico = (dx) => {
    if (tokensDx.length === 0) return true;
    const heno = normalizar(
      [
        dx.titulo,
        dx.diagnostico,
        ...(dx.cie10s?.map((c) => `${c.codigo} ${c.descripcion}`) ?? []),
      ].join(" ")
    );
    return tokensDx.every((t) => heno.includes(t));
  };

  const pasaFiltros = (dx) => coincideId(dx) && coincideDiagnostico(dx);

  const idsSeleccionados = new Set(seleccionados.map((s) => s.id));
  const mapaSeleccion = new Map(seleccionados.map((s) => [s.id, s]));

  const disponibles = lista.filter((dx) => !idsSeleccionados.has(dx.id) && pasaFiltros(dx));
  // En orden de seleccionados (ordenFila), no en orden de `lista`.
  const elegidos = seleccionados
    .map((s) => lista.find((dx) => dx.id === s.id))
    .filter(Boolean);

  return (
    <div className='fixed -top-2 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10'>
      <div className='bg-white p-4 rounded-md flex flex-col gap-y-3 w-[min(1400px,97vw)]'>
        <div className="flex items-start justify-between gap-4">
          <h2 className='text-2xl font-bold'>Diagnóstico Relacionado</h2>
          <button
            type="button"
            onClick={cerrarModal}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-700 text-xl leading-none p-1 -m-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-x-4 gap-y-3">
          <input
            type='text'
            inputMode='numeric'
            placeholder='Identificador'
            value={filtros.identificador}
            onChange={(e) =>
              setFiltros({ ...filtros, identificador: e.target.value.replace(/\D/g, "") })
            }
            className="px-3 py-2 border rounded-lg "
          />
          <input
            type='text'
            placeholder='Diagnóstico'
            value={filtros.diagnostico}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                diagnostico: e.target.value.replace(/[^\p{L}\p{N}\s]/gu, ""),
              })
            }
            className="px-3 py-2 border rounded-lg md:col-span-3"
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={abrirNuevo}
            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-white"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Nuevo
          </button>
        </div>

        <DiagnosticoRelacionadoFormModal
          visible={formVisible}
          onClose={cerrarForm}
          onCreated={() => obtenerDiagnósticosRelacionados()}
          token={token}
          plantilla={plantillaClonar}
        />

        {/* Disponibles */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-600">
            Disponibles ({disponibles.length})
          </span>
          <TablaDx modo="disponibles" maxH="max-h-[45vh]">
            {disponibles.length > 0 ? (
              disponibles.map((dx) => (
                <FilaDx
                  key={dx.id}
                  dx={dx}
                  modo="disponibles"
                  onToggle={toggleSeleccion}
                  onClonar={abrirClon}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-2 py-4 text-center text-gray-400">
                  Sin resultados
                </td>
              </tr>
            )}
          </TablaDx>
        </div>

        {/* Seleccionados: fondo azul claro, reordenables por arrastre, con
            columna Descripción (diagnosticoPersonalizado) al final. */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-sky-700">
            Seleccionados ({elegidos.length})
            <span className="ml-2 font-normal text-gray-400">
              — arrastra una fila para ordenar
            </span>
          </span>
          {elegidos.length > 0 ? (
            <TablaDx modo="seleccionados" maxH="max-h-[35vh]">
              {elegidos.map((dx, index) => (
                <FilaDx
                  key={dx.id}
                  dx={dx}
                  modo="seleccionados"
                  onToggle={toggleSeleccion}
                  onClonar={abrirClon}
                  descripcion={mapaSeleccion.get(dx.id)?.diagnosticoPersonalizado ?? ""}
                  onDescripcionChange={(t) => actualizarDescripcion(dx.id, t)}
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

      </div>
    </div>
  )
}
