import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';

const Anexo16A = ({ token, selectedSede }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <div className="flex items-center mb-4">
        <span className="bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-t">ANEXO 16 A</span>
      </div>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input className="border rounded px-2 py-1 flex-1" />
            <button type="button" className="ml-2 bg-gray-200 px-3 py-1 rounded border border-gray-300 flex items-center gap-1"><FontAwesomeIcon icon={faEdit} /> Editar</button>
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input type="date" className="border rounded px-2 py-1 flex-1" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input className="border rounded px-2 py-1 flex-1" />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input className="border rounded px-2 py-1 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">PRUEBAS</legend>
            <div className="mb-4 flex items-center gap-4">
              <label className="font-semibold">Grupo Sanguíneo:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> O</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> A</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> B</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> AB</label>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <label className="font-semibold">Factor Rh:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Rh(-)</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Rh(+)</label>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <label className="font-semibold">Hemoglobina:</label>
              <input className="border rounded px-2 py-1 w-32" />
            </div>
            <div className="mb-4 flex items-center gap-4">
              <label className="font-semibold">Hematocrito:</label>
              <input className="border rounded px-2 py-1 w-32" />
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold"><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-gray-200 px-2 py-1 rounded border border-gray-300"><FontAwesomeIcon icon={faPrint} /></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Anexo16A; 