import { useState } from "react";
import DiagnosticoRelacionadoModal from "./DiagnosticoRelacionadoModal";
import DiagnosticoRelacionadoSeleccionadosList from "./DiagnosticoRelacionadoSeleccionadosList";
import { useDiagnosticoRelacionadoCatalogo } from "./useDiagnosticoRelacionadoCatalogo";

/**
 * Campo "todo en uno" de Diagnóstico Relacionado: botón que abre el
 * buscador/alta + lista embebida de seleccionados (quitar, reordenar por
 * arrastre, agregar comentario). Es la forma más simple de integrar esta
 * funcionalidad en cualquier formulario nuevo.
 *
 * El único estado que el formulario dueño necesita mantener es
 * `seleccionados`: un arreglo de
 *   { id, formularioId, ordenFila, diagnosticoPersonalizado, detalle }
 * que normalmente se guarda como una key más de su `form`
 * (p.ej. `form.formulariosDiagnostico`) para que llegue hasta el submit.
 *
 * Uso mínimo:
 *   <DiagnosticoRelacionadoField
 *     token={token}
 *     seleccionados={form.formulariosDiagnostico}
 *     setSeleccionados={setFormulariosDiagnostico}
 *   />
 *
 * Para cargar un registro ya guardado (editar) e incluirlo de nuevo en el
 * submit, usar los adaptadores de DiagnosticoRelacionadoLogic:
 *   hidratarFormulariosDiagnostico(res.formulariosDiagnostico)  // al cargar
 *   serializarFormulariosDiagnostico(form.formulariosDiagnostico) // al enviar
 */
export default function DiagnosticoRelacionadoField({
  token,
  seleccionados,
  setSeleccionados,
  label = "Diagnóstico Relacionado",
  buttonClassName = "py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md w-full",
  listMaxH = "max-h-[260px]",
  showList = true,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const { catalogo, loadingCatalogo, refrescarCatalogo } = useDiagnosticoRelacionadoCatalogo(token);

  return (
    <div className="flex flex-col gap-2">
      <button type="button" className={buttonClassName} onClick={() => setModalVisible(true)}>
        {label}
      </button>

      <DiagnosticoRelacionadoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        token={token}
        lista={catalogo}
        refrescarLista={refrescarCatalogo}
        seleccionados={seleccionados}
        setSeleccionados={setSeleccionados}
      />

      {showList && (
        <>
          <DiagnosticoRelacionadoSeleccionadosList
            lista={catalogo}
            seleccionados={seleccionados}
            setSeleccionados={setSeleccionados}
            maxH={listMaxH}
          />
          {loadingCatalogo && (
            <p className="text-xs text-gray-400">Cargando catálogo de diagnósticos...</p>
          )}
        </>
      )}
    </div>
  );
}
