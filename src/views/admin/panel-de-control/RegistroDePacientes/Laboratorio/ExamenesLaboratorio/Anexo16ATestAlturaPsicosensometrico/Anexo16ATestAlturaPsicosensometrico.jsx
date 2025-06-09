import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const Anexo16ATestAlturaPsicosensometrico = ({ token, selectedSede }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">ANEXO 16A - TEST DE ALTURA - PSICOSENSOMETRICO</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input className="border rounded px-2 py-1 flex-1" disabled />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input type="date" className="border rounded px-2 py-1 flex-1" disabled />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input className="border rounded px-2 py-1 bg-gray-100" style={{ minWidth: '120px', maxWidth: '400px', width: `${Math.min(400, Math.max(120, (''?.length || 0) * 10))}px` }} disabled />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input className="border rounded px-2 py-1 w-24 bg-gray-100" disabled />
          </div>
        </div>
        <div className="mt-6">
          <span className="font-bold text-blue-900 text-base italic">IMPRIMIR</span>
          <div className="bg-gray-100 border rounded p-4 mt-2">
            <p className="italic text-sm mb-4 text-gray-700"><b>Recuerda:</b> Antes de imprimir fichas debes haber llenado laboratorio, para Psicosensometría también llenar análisis bioquímicos.</p>
            <div className="flex flex-col gap-3 items-center">
              <button type="button" className="bg-gray-200 px-6 py-2 rounded border border-gray-300 flex items-center gap-2 w-full md:w-1/2 justify-center"><FontAwesomeIcon icon={faPrint} /> IMPRIMIR ANEXO 16 A</button>
              <button type="button" className="bg-gray-200 px-6 py-2 rounded border border-gray-300 flex items-center gap-2 w-full md:w-1/2 justify-center"><FontAwesomeIcon icon={faPrint} /> IMPRIMIR TEST DE ALTURA</button>
              <button type="button" className="bg-gray-200 px-6 py-2 rounded border border-gray-300 flex items-center gap-2 w-full md:w-1/2 justify-center"><FontAwesomeIcon icon={faPrint} /> IMPRIMIR PSICOSENSOMETRIA</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-8 items-center justify-center w-full">
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
        </div>
      </form>
    </div>
  );
};

export default Anexo16ATestAlturaPsicosensometrico; 