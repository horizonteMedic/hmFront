import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import DiagnosticoRelacionadoFormModal from "./DiagnosticoRelacionadoFormModal";
import DiagnosticoRelacionadoSeleccionadosList from "./DiagnosticoRelacionadoSeleccionadosList";
import { TablaDx, FilaDx } from "./DiagnosticoRelacionadoTabla";
import { toggleSeleccion } from "./DiagnosticoRelacionadoLogic";
import { FloatingInput } from "../../../admin/panel-de-control/ModuloSalud/Inventario/ProductosEnInventario/components/FloatingField";

// Minúsculas y sin acentos, para comparar de forma flexible.
const normalizar = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * `lista`: catálogo completo de diagnósticos (normalmente owned por
 * DiagnosticoRelacionadoField, vía useDiagnosticoRelacionadoCatalogo).
 * `refrescarLista`: refresca `lista` tras registrar un diagnóstico nuevo.
 * `seleccionados` / `setSeleccionados`: arreglo [{ id, formularioId,
 * ordenFila, diagnosticoPersonalizado, detalle }] que vive en el estado del
 * formulario dueño (para que llegue hasta el submit).
 */
export default function DiagnosticoRelacionadoModal({
  visible,
  onClose,
  token,
  lista,
  refrescarLista,
  seleccionados,
  setSeleccionados,
}) {

  const [filtros, setFiltros] = useState({
    identificador: "",
    diagnostico: "",
  })
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

  const cerrarModal = () => {
    setFiltros({
      identificador: "",
      diagnostico: "",
    })
    onClose();
  }

  if (!visible) return null;

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

  const disponibles = lista.filter((dx) => !idsSeleccionados.has(dx.id) && pasaFiltros(dx));

  // Portal a document.body: si este modal se renderiza dentro de un
  // ancestro con overflow:hidden (común en layouts con tarjetas/tabs, como
  // el de Triaje), un `position: fixed` normal queda recortado por ese
  // ancestro y dejar de cubrir el resto de la pantalla. El portal lo saca
  // de ese árbol para que cubra siempre el viewport completo.
  return createPortal(
    <div className='fixed -top-2 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10'>
      <div className='bg-white p-4 rounded-md flex flex-col gap-y-3 w-[min(1400px,97vw)] max-h-[92vh] overflow-y-auto'>
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
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <FloatingInput
            id="dxrel-filtro-identificador"
            label="Identificador"
            inputMode="numeric"
            value={filtros.identificador}
            onChange={(e) =>
              setFiltros({ ...filtros, identificador: e.target.value.replace(/\D/g, "") })
            }
            className="md:w-52"
          />
          <FloatingInput
            id="dxrel-filtro-diagnostico"
            label="Diagnóstico"
            value={filtros.diagnostico}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                diagnostico: e.target.value.replace(/[^\p{L}\p{N}\s]/gu, ""),
              })
            }
            className="flex-1"
          />
          <button
            type="button"
            onClick={abrirNuevo}
            className="bg-green-600 hover:bg-green-700 px-3 py-2.5 rounded-md text-white shrink-0"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Nuevo
          </button>
        </div>

        <DiagnosticoRelacionadoFormModal
          visible={formVisible}
          onClose={cerrarForm}
          onCreated={() => refrescarLista()}
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
                  onToggle={() => toggleSeleccion(setSeleccionados, dx)}
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

        <DiagnosticoRelacionadoSeleccionadosList
          lista={lista}
          seleccionados={seleccionados}
          setSeleccionados={setSeleccionados}
          maxH="max-h-[35vh]"
        />

      </div>
    </div>,
    document.body
  )
}
