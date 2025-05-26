import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';

const BioquimicaAcidoUrico = ({ token, selectedSede }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Bioquímica - Ácido Úrico</h2>
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
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">PRUEBA:</label>
          <input className="border rounded px-2 py-1 flex-1 bg-gray-100" value="ÁCIDO ÚRICO SÉRICO" readOnly />
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">MUESTRA:</label>
          <input className="border rounded px-2 py-1 flex-1 bg-gray-100" value="SUERO" readOnly />
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-semibold min-w-[120px]">RESULTADO:</label>
          <input className="border rounded px-2 py-1 flex-1" />
        </div>
        <div className="flex gap-2 items-start">
          <label className="font-semibold min-w-[140px]">VALORES NORMALES:</label>
          <textarea className="border rounded px-2 py-1 flex-1 bg-gray-100" rows={2} readOnly value={"Mujeres : 2.5 - 6.8 mg/dl\nHombres : 3.6 - 7.7 mg/dl"} />
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

export default BioquimicaAcidoUrico; 