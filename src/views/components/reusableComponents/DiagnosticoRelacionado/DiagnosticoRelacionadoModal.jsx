import { useEffect, useState } from "react";
import { getDiagnosticosRelacionados } from "./controllerDiagnosticoRelacionado";


export default function DiagnosticoRelacionadoModal({ visible, onClose, diagnosticosRelacionados, setDiagnosticosRelacionados, token }) {

  const [filtros, setFiltros] = useState({
    identificador: "",
    diagnostico: "",
  })
  const [loading, setLoading] = useState(false);

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

  if (!visible) return null;

  return (
    <div className='fixed -top-2 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10'>
      <div className='bg-white p-4 rounded-md flex flex-col gap-y-3'>
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
        <div className=" max-h-[300px] overflow-auto flex flex-col gap-y-3">
          {diagnosticosRelacionados?.lista.length > 0 && diagnosticosRelacionados.lista.map((dx) => (
            <div key={dx.id}>
              <div className="flex flex-col">
                <p className="font-bold text-[11px] ">
                  <span className=" font-bold text-sky-600 px-1 " >{dx.id}</span>
                  {dx.titulo}
                </p>
                <p className="text-[11px] text-gray-500">{dx.diagnostico}</p>
                <div className="w-full grid md:grid-cols-3 gap-y-3 gap-x-4">
                  <div className=" flex flex-col gap-x-4 gap-y-1">
                    <p className="font-bold">CIE10</p>
                    {dx.cie10s.length > 0 && dx.cie10s.map((c, i) => (
                      <div
                        key={c.codigo}
                        className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-md px-1.5 py-1"
                      >
                        <span className="text-[10px] font-bold text-sky-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                          {i + 1})
                        </span>
                        <span className=" font-bold text-sky-700 bg-sky-100 px-1 py-0.5 rounded shrink-0">
                          {c.codigo}
                        </span>
                        <span className="uppercase text-sky-800">{c.descripcion}</span>
                      </div>
                    ))}
                  </div>

                  <div className=" flex flex-col gap-x-4 gap-y-1">
                    <p className="font-bold">Recomendaciones</p>
                    {dx.recomendaciones.length > 0 && dx.recomendaciones.map((r, i) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-md px-1.5 py-1"
                      >
                        <span className="text-[10px] font-bold text-green-500  rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                          {i + 1})
                        </span>
                        <span className="uppercase text-green-600">{r.descripcion}</span>
                      </div>
                    ))}
                  </div>

                  <div className=" flex flex-col gap-x-4 gap-y-1">
                    <p className="font-bold">Restricciones</p>
                    {dx.restricciones.length > 0 && dx.restricciones.map((r, i) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-md px-1.5 py-1"
                      >
                        <span className="text-[10px] font-bold text-red-600 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                          {i + 1})
                        </span>
                        <span className="text-sm text-red-800">{r.descripcion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={cerrarModal}>Cerrar</button>
      </div>
    </div>
  )
}
