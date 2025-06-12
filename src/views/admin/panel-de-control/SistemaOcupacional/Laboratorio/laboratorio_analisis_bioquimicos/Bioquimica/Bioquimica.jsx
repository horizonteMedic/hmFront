import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';

const Bioquimica = ({ token, selectedSede }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">PERFIL RENAL</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input className="border rounded px-2 py-1 flex-1" />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input type="date" className="border rounded px-2 py-1 flex-1" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input className="border rounded px-2 py-1 bg-gray-100" style={{ minWidth: '120px', maxWidth: '400px', width: `${Math.min(400, Math.max(120, (''?.length || 0) * 10))}px` }} />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input className="border rounded px-2 py-1 w-24 bg-gray-100" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[90px]">Muestra</label>
          <input className="border rounded px-2 py-1 flex-1 bg-gray-100" value="SUERO" readOnly />
        </div>
        <div className="flex gap-8 mt-6">
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-bold">PRUEBAS</span>
            <label className="flex items-center gap-2">CREATININA SÉRICA</label>
            <label className="flex items-center gap-2">UREA SÉRICA</label>
            <label className="flex items-center gap-2">ACIDO URICO SÉRICO</label>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-bold">RESULTADOS</span>
            <input className="border rounded px-2 py-1" />
            <input className="border rounded px-2 py-1" />
            <input className="border rounded px-2 py-1" />
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
        </div>
        <div className="flex flex-col items-end mt-6">
          <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
          <div className="flex gap-1 mt-1">
            <input className="border rounded px-2 py-1 w-24" />
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"><FontAwesomeIcon icon={faPrint} /></button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Bioquimica; 