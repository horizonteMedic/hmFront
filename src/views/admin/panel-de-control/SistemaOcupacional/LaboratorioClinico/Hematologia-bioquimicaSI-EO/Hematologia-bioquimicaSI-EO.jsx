import React from 'react';
import microscopio from './microscopio.webp';

const HematologiaBioquimicaSIEO = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Left: Form */}
      <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
        {/* Top Row: Checkboxes and Inputs */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <label className="flex items-center gap-1"><input type="checkbox" /> Consultas</label>
          <label className="flex items-center gap-1"><input type="checkbox" /> Particular</label>
          <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> Ficha Médica Ocupacional</label>
          <span className="ml-2">N° Orden:</span>
          <input className="input input-xs w-20" type="text" />
          <span className="ml-2">N° Recibo:</span>
          <input className="input input-xs w-20" type="text" />
          <span className="ml-2">Dni:</span>
          <input className="input input-xs w-24" type="text" />
        </div>
        {/* Second Row: Responsable, Fecha, Editar, Estado */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span>Responsable Lab:</span>
          <input className="input input-xs w-40" type="text" />
          <span className="ml-2">Fecha:</span>
          <input className="input input-xs w-28" type="date" />
          <button className="ml-2 px-2 py-1 border rounded bg-yellow-200">🟡</button>
          <button className="ml-1 px-2 py-1 border rounded bg-blue-200">✏️ Editar</button>
          <span className="ml-2 text-red-600 font-semibold">INCOMPLETO</span>
        </div>
        {/* Nombres, Empresa, Contratista */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span>Nombres:</span>
          <input className="input input-xs w-48" type="text" />
          <span className="ml-2 font-bold">G.F. Sang. Pedido</span>
          <input className="input input-xs w-32" type="text" />
        </div>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span>Emp. Contratista:</span>
          <input className="input input-xs w-48" type="text" />
          <span className="ml-2">Empresa:</span>
          <input className="input input-xs w-48" type="text" />
        </div>
        {/* Hematología Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm">Hematología</legend>
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="mb-1">Grupo Sanguíneo:</div>
              <label className="mr-2"><input type="radio" name="grupo" /> O</label>
              <label className="mr-2"><input type="radio" name="grupo" /> A</label>
              <label className="mr-2"><input type="radio" name="grupo" /> B</label>
              <label className="mr-2"><input type="radio" name="grupo" /> AB</label>
              <div className="mt-1">Factor Rh:
                <label className="ml-2"><input type="radio" name="rh" /> Rh(+)</label>
                <label className="ml-2"><input type="radio" name="rh" /> Rh(-)</label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>Hemoglobina: <input className="input input-xs w-16 ml-1" type="text" /> g/dl</label>
              <label>Hematocrito: <input className="input input-xs w-16 ml-1" type="text" /> %</label>
              <label>V.S.G.: <input className="input input-xs w-16 ml-1" type="text" /> mm/Hora</label>
              <label>Leucocitos: <input className="input input-xs w-16 ml-1" type="text" /> mm³</label>
              <label>Hematíes: <input className="input input-xs w-16 ml-1" type="text" /> mm³</label>
              <label>Plaquetas: <input className="input input-xs w-16 ml-1" type="text" /> mm³</label>
            </div>
            <div className="flex flex-col gap-1">
              <label>Neutrófilos: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Abastonados: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Segmentados: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Monocitos: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Eosinófilos: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Basófilos: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
              <label>Linfocitos: <input className="input input-xs w-12 ml-1" type="text" /> %</label>
            </div>
          </div>
        </fieldset>
        {/* Bioquímica Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm">Bioquímica</legend>
          <div className="flex flex-wrap gap-4 items-center">
            <label>Glucosa: <input className="input input-xs w-16 ml-1" type="text" /> mg/dl</label>
            <label className="flex items-center ml-2"><input type="checkbox" className="mr-1" /> N/A</label>
            <span className="text-xs text-gray-500">Valores normales 70 - 110 mg/dl</span>
            <label className="ml-4">Creatinina: <input className="input input-xs w-16 ml-1" type="text" /> mg/dl</label>
            <label className="flex items-center ml-2"><input type="checkbox" className="mr-1" /> N/A</label>
            <span className="text-xs text-gray-500">Valores normales 0.8 - 1.4 mg/dl</span>
          </div>
        </fieldset>
        {/* Reacciones Serológicas Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm">Reacciones Serológicas</legend>
          <div className="flex flex-wrap gap-4 items-center">
            <label>RPR: <input className="input input-xs w-16 ml-1" type="text" placeholder="N/A" /></label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" /> +</label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" /> -</label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" defaultChecked /> N/A</label>
            <label className="ml-4">VIH: <input className="input input-xs w-16 ml-1" type="text" placeholder="N/A" /></label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" /> +</label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" /> -</label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" defaultChecked /> N/A</label>
          </div>
        </fieldset>
      </div>
      {/* Right: Image and Previous Records */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="w-full mb-2">
          <div className="border rounded p-2 bg-gray-50">
            <div className="font-semibold text-sm mb-1">Registros anteriores de grupo sanguíneo</div>
            <textarea className="w-full h-24 border rounded p-1 text-sm" readOnly />
          </div>
        </div>
        <img src={microscopio} alt="Microscopio" className="w-48 h-auto mt-4" />
      </div>
    </div>
  );
};

export default HematologiaBioquimicaSIEO; 