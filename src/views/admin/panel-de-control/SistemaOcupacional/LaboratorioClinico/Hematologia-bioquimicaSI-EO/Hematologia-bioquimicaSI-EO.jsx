import React from 'react';
import microscopio from './microscopio.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faFlask, faCalendarAlt, faEdit, faExclamationCircle, faTint, faVial, faSyringe, faNotesMedical, faFileMedical, faIdCard, faListOl } from '@fortawesome/free-solid-svg-icons';

const HematologiaBioquimicaSIEO = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full font-sans text-xs13">
      {/* Left: Form */}
      <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
        {/* Top Row: Checkboxes and Inputs */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <label className="flex items-center gap-1"><input type="checkbox" className="accent-[#233245]" /> Consultas</label>
          <label className="flex items-center gap-1"><input type="checkbox" className="accent-[#233245]" /> Particular</label>
          <label className="flex items-center gap-1"><input type="checkbox" className="accent-[#233245]" defaultChecked /> Ficha Médica Ocupacional</label>
          <span className="ml-2">N° Orden:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-20 focus:outline-[#233245] bg-white" type="text" />
          <span className="ml-2">N° Recibo:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-20 focus:outline-[#233245] bg-white" type="text" />
          <span className="ml-2">Dni:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-24 focus:outline-[#233245] bg-white" type="text" />
        </div>
        {/* Second Row: Responsable, Fecha, Editar, Estado */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span><FontAwesomeIcon icon={faUser} className="mr-1 text-[#233245]" /> Responsable Lab:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-40 focus:outline-[#233245] bg-white" type="text" />
          <span className="ml-2"><FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#233245]" /> Fecha:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-28 focus:outline-[#233245] bg-white" type="date" />
          <button className="ml-2 px-2 py-1 border rounded bg-yellow-200"><FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-700" /></button>
          <button className="ml-1 px-2 py-1 border rounded bg-blue-200"><FontAwesomeIcon icon={faEdit} className="mr-1 text-blue-700" />Editar</button>
          <span className="ml-2 text-red-600 font-semibold"><FontAwesomeIcon icon={faFileMedical} className="mr-1" />INCOMPLETO</span>
        </div>
        {/* Nombres, Empresa, Contratista */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span><FontAwesomeIcon icon={faIdCard} className="mr-1 text-[#233245]" />Nombres:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-48 focus:outline-[#233245] bg-white" type="text" />
          <span className="ml-2 font-bold">G.F. Sang. Pedido</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-32 focus:outline-[#233245] bg-white" type="text" />
        </div>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <span><FontAwesomeIcon icon={faBuilding} className="mr-1 text-[#233245]" />Emp. Contratista:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-48 focus:outline-[#233245] bg-white" type="text" />
          <span className="ml-2">Empresa:</span>
          <input className="border border-gray-400 rounded px-2 py-1 w-48 focus:outline-[#233245] bg-white" type="text" />
        </div>
        {/* Hematología Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm14"><FontAwesomeIcon icon={faTint} className="mr-1 text-[#233245]" />Hematología</legend>
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="mb-1">Grupo Sanguíneo:</div>
              <label className="mr-2"><input type="radio" name="grupo" className="accent-[#233245]" /> O</label>
              <label className="mr-2"><input type="radio" name="grupo" className="accent-[#233245]" /> A</label>
              <label className="mr-2"><input type="radio" name="grupo" className="accent-[#233245]" /> B</label>
              <label className="mr-2"><input type="radio" name="grupo" className="accent-[#233245]" /> AB</label>
              <div className="mt-1">Factor Rh:
                <label className="ml-2"><input type="radio" name="rh" className="accent-[#233245]" /> Rh(+)</label>
                <label className="ml-2"><input type="radio" name="rh" className="accent-[#233245]" /> Rh(-)</label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>Hemoglobina: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> g/dl</label>
              <label>Hematocrito: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>V.S.G.: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mm/Hora</label>
              <label>Leucocitos: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mm³</label>
              <label>Hematíes: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mm³</label>
              <label>Plaquetas: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mm³</label>
            </div>
            <div className="flex flex-col gap-1">
              <label>Neutrófilos: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Abastonados: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Segmentados: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Monocitos: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Eosinófilos: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Basófilos: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
              <label>Linfocitos: <input className="border border-gray-400 rounded px-2 py-1 w-12 ml-1 focus:outline-[#233245] bg-white" type="text" /> %</label>
            </div>
          </div>
        </fieldset>
        {/* Bioquímica Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm14"><FontAwesomeIcon icon={faVial} className="mr-1 text-[#233245]" />Bioquímica</legend>
          <div className="flex flex-wrap gap-4 items-center">
            <label>Glucosa: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mg/dl</label>
            <label className="flex items-center ml-2"><input type="checkbox" className="mr-1 accent-[#233245]" /> N/A</label>
            <span className="text-xs text-gray-500">Valores normales 70 - 110 mg/dl</span>
            <label className="ml-4">Creatinina: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" /> mg/dl</label>
            <label className="flex items-center ml-2"><input type="checkbox" className="mr-1 accent-[#233245]" /> N/A</label>
            <span className="text-xs text-gray-500">Valores normales 0.8 - 1.4 mg/dl</span>
          </div>
        </fieldset>
        {/* Reacciones Serológicas Section */}
        <fieldset className="border rounded p-2 mb-2">
          <legend className="font-semibold text-sm14"><FontAwesomeIcon icon={faSyringe} className="mr-1 text-[#233245]" />Reacciones Serológicas</legend>
          <div className="flex flex-wrap gap-4 items-center">
            <label>RPR: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" placeholder="N/A" /></label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" className="accent-[#233245]" /> +</label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" className="accent-[#233245]" /> -</label>
            <label className="flex items-center ml-2"><input type="radio" name="rpr" className="accent-[#233245]" defaultChecked /> N/A</label>
            <label className="ml-4">VIH: <input className="border border-gray-400 rounded px-2 py-1 w-16 ml-1 focus:outline-[#233245] bg-white" type="text" placeholder="N/A" /></label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" className="accent-[#233245]" /> +</label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" className="accent-[#233245]" /> -</label>
            <label className="flex items-center ml-2"><input type="radio" name="vih" className="accent-[#233245]" defaultChecked /> N/A</label>
          </div>
        </fieldset>
      </div>
      {/* Right: Image and Previous Records */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="w-full mb-2">
          <div className="border rounded p-2 bg-gray-50">
            <div className="font-semibold text-sm14 mb-1">Registros anteriores de grupo sanguíneo</div>
            <textarea className="w-full h-24 border rounded p-1 text-xs13" readOnly />
          </div>
        </div>
        <img src={microscopio} alt="Microscopio" className="w-48 h-auto mt-4" />
      </div>
    </div>
  );
};

export default HematologiaBioquimicaSIEO; 