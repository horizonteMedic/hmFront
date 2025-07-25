import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const Psicosensometria = ({ token, selectedSede }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">PSICOSENSOMETRIA</h2>
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
        <div className="grid grid-cols-2 gap-8 mt-6">
          {/* Hematología */}
          <fieldset className="border rounded p-4">
            <legend className="font-bold text-blue-900 text-sm px-2">HEMATOLOGIA</legend>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="font-bold col-span-1">PRUEBAS</span>
              <span className="font-bold col-span-1">RESULTADOS</span>
              <label className="flex items-center">Grupo Sanguíneo :</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" /> 0
                <input type="checkbox" /> A
                <input type="checkbox" /> B
                <input type="checkbox" /> AB
              </div>
              <label className="flex items-center">Factor Rh :</label>
              <div className="flex items-center gap-2">
                <input type="radio" name="rh" /> Rh(-)
                <input type="radio" name="rh" /> Rh(+)
              </div>
              <label className="flex items-center">Hemoglobina :</label>
              <input className="border rounded px-2 py-1" />
              <label className="flex items-center">Hematocrito :</label>
              <input className="border rounded px-2 py-1" />
            </div>
          </fieldset>
          {/* Bioquímica */}
          <fieldset className="border rounded p-4">
            <legend className="font-bold text-blue-900 text-sm px-2">BIOQUIMICA</legend>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="font-bold col-span-1">PRUEBAS</span>
              <span className="font-bold col-span-1">RESULTADOS</span>
              <label className="flex items-center">Colesterol Total :</label>
              <input className="border rounded px-2 py-1" />
              <label className="flex items-center">Triglicéridos :</label>
              <input className="border rounded px-2 py-1" />
              <label className="flex items-center">L.D.L Colesterol :</label>
              <input className="border rounded px-2 py-1" />
              <label className="flex items-center">H.D.L Colesterol :</label>
              <input className="border rounded px-2 py-1" />
              <label className="flex items-center">V.L.D.L Colesterol :</label>
              <input className="border rounded px-2 py-1" />
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-8 items-center justify-between w-full">
          <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
          <div className="flex flex-col items-end w-full md:w-auto">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"><FontAwesomeIcon icon={faPrint} /></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Psicosensometria; 