import { memo } from 'react';

const COLUMNAS = ['N° Orden', 'Nombres', 'Fecha', 'Empresa', 'Contrata', 'T. Examen', 'Protocolo', 'Laboratorio', 'Ficha Apt. 16', 'Ficha Apt. 02'];

// Color de estado de cada historia (lo calcula el backend en `color`)
const COLOR_FILA = {
  VERDE: 'bg-green-200 hover:bg-green-300',
  AMARILLO: 'bg-yellow-200 hover:bg-yellow-300',
};
const COLOR_FILA_DEFECTO = 'bg-red-200 hover:bg-red-300';

const CELDA = 'px-2 py-[6px] text-slate-800';

// Click izquierdo carga la historia en el formulario; click derecho imprime su hoja de ruta.
// Está memorizada: escribir en el formulario no la vuelve a dibujar.
const TablaHistorias = memo(function TablaHistorias({ registros, cargando, seleccionado, onEditar, onImprimir }) {
  return (
    <div className="max-h-[calc(100vh-360px)] min-h-[240px] overflow-y-auto rounded-md border-[1px] border-slate-200">
      <table className="w-full text-center text-base">
        <thead>
          <tr>
            {COLUMNAS.map((columna) => (
              <th
                key={columna}
                className="sticky top-0 z-10 bg-slate-100 px-2 py-[6px] font-bold text-slate-700 shadow-[inset_0_-1px_0_#cbd5e1]"
              >
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 && (
            <tr>
              <td colSpan={COLUMNAS.length} className="px-2 py-[28px] text-slate-500">
                {cargando ? 'Cargando...' : 'Sin registros'}
              </td>
            </tr>
          )}
          {registros.map((r) => (
            <tr
              key={r.n_orden}
              tabIndex={0}
              onClick={() => onEditar(r)}
              onKeyDown={(e) => e.key === 'Enter' && onEditar(r)}
              onContextMenu={(e) => {
                e.preventDefault();
                onImprimir(r);
              }}
              className={`cursor-pointer transition-colors ${COLOR_FILA[r.color] ?? COLOR_FILA_DEFECTO} ${
                String(r.n_orden) === String(seleccionado) ? 'outline outline-2 outline-offset-[-2px] outline-blue-700' : ''
              }`}
            >
              <td className={CELDA}>{r.n_orden}</td>
              <td className={`${CELDA} text-left`}>{r.nombres}</td>
              <td className={CELDA}>{r.fecha_apertura_po}</td>
              <td className={CELDA}>{r.razon_empresa}</td>
              <td className={CELDA}>{r.razon_contrata}</td>
              <td className={CELDA}>{r.nom_examen}</td>
              <td className={CELDA}>{r.nombreProtocolo}</td>
              <td className={CELDA}>{r.laboratorio ?? ''}</td>
              <td className={CELDA}>{r.aptitudAnexo16 ?? ''}</td>
              <td className={CELDA}>{r.aptitudAnexo2 ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default TablaHistorias;
