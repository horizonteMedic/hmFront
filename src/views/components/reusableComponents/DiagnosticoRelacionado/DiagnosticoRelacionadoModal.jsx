import { useEffect, useState } from "react";
import { getDiagnosticosRelacionados } from "./controllerDiagnosticoRelacionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import DiagnosticoRelacionadoFormModal from "./DiagnosticoRelacionadoFormModal";


export default function DiagnosticoRelacionadoModal({ visible, onClose, diagnosticosRelacionados, setDiagnosticosRelacionados, token }) {

  const [filtros, setFiltros] = useState({
    identificador: "",
    diagnostico: "",
  })
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

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

  const seleccionados = diagnosticosRelacionados?.seleccionados ?? [];

  const toggleSeleccion = (id) => {
    setDiagnosticosRelacionados((prev) => {
      const actuales = prev.seleccionados ?? [];
      return {
        ...prev,
        seleccionados: actuales.includes(id)
          ? actuales.filter((x) => x !== id)
          : [...actuales, id],
      };
    });
  };

  if (!visible) return null;

  return (
    <div className='fixed -top-2 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10'>
      <div className='bg-white p-4 rounded-md flex flex-col gap-y-3 w-[min(1400px,97vw)]'>
        <h2 className='text-2xl font-bold'>Diagnóstico Relacionado</h2>
        <div className="grid md:grid-cols-4 gap-x-4 gap-y-3">
          <input
            type='text'
            placeholder='Identificador'
            value={filtros.identificador}
            onChange={(e) => setFiltros({ ...filtros, identificador: e.target.value })}
            className="px-3 py-2 border rounded-lg "
          />
          <input
            type='text'
            placeholder='Diagnóstico'
            value={filtros.diagnostico}
            onChange={(e) => setFiltros({ ...filtros, diagnostico: e.target.value })}
            className="px-3 py-2 border rounded-lg md:col-span-3"
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-white"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Nuevo
          </button>
        </div>

        <DiagnosticoRelacionadoFormModal
          visible={formVisible}
          onClose={() => setFormVisible(false)}
          onCreated={() => obtenerDiagnósticosRelacionados()}
          token={token}
        />
        <div className="max-h-[65vh] overflow-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse text-[11px] table-fixed">
            <colgroup>
              <col className="w-[2%]" />
              <col className="w-[3%]" />
              <col />
              <col />
              <col className="w-[25%]" />
              <col />
              <col />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="text-gray-600 text-left [&>th]:bg-sky-50 [&>th]:shadow-[inset_0_-1px_0_#e5e7eb]">
                <th className="px-2 py-2 font-semibold"></th>
                <th className="px-2 py-2 font-semibold">Id</th>
                <th className="px-2 py-2 font-semibold">Título</th>
                <th className="px-2 py-2 font-semibold">Diagnóstico</th>
                <th className="px-2 py-2 font-semibold text-sky-700">CIE10</th>
                <th className="px-2 py-2 font-semibold text-green-700">Recomendaciones</th>
                <th className="px-2 py-2 font-semibold text-red-700">Restricciones</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticosRelacionados?.lista.length > 0 && diagnosticosRelacionados.lista.map((dx) => {
                const checked = seleccionados.includes(dx.id);
                return (!checked &&
                  <tr
                    key={dx.id}
                    className={`align-top border-b border-gray-200 last:border-b-0 transition-colors hover:bg-gray-50`}
                  >
                    <td className="px-2 py-2 ">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="text-sky-600 text-2xl cursor-pointer hover:text-sky-700"
                        onClick={(e) => {e.stopPropagation(); toggleSeleccion(dx.id)}}
                      />
                    </td>
                    <td className="px-2 py-2 font-bold text-sky-700">{dx.id}</td>
                    <td className="px-2 py-2 font-semibold text-gray-800 uppercase">{dx.titulo}</td>
                    <td className="px-2 py-2 text-gray-500">{dx.diagnostico}</td>
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-1">
                        {dx.cie10s.length > 0 && dx.cie10s.map((c, i) => (
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
                        {dx.recomendaciones.length > 0 && dx.recomendaciones.map((r, i) => (
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
                        {dx.restricciones.length > 0 && dx.restricciones.map((r, i) => (
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={cerrarModal}>Cerrar</button>
      </div>
    </div>
  )
}
