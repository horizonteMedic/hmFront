import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const muestraLabels = [
  { key: 'heces1', label: 'MUESTRA: HECES I' },
  { key: 'heces2', label: 'MUESTRA: HECES II' },
  { key: 'heces3', label: 'MUESTRA: HECES III' },
];

const microsLabels = [
  { key: 'micro1', label: 'EXAMEN MICROSCOPICO I' },
  { key: 'micro2', label: 'EXAMEN MICROSCOPICO II' },
  { key: 'micro3', label: 'EXAMEN MICROSCOPICO III' },
];

const Coproparasitologia = ({ token, selectedSede }) => {
  return (
    <div className="max-w-[1300px] mx-auto bg-white rounded shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
        <div className="flex-1 flex gap-2 items-center">
          <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
          <input className="border rounded px-2 py-1 flex-1" disabled />
        </div>
        <div className="flex-1 flex gap-2 items-center">
          <label className="font-semibold">Fecha:</label>
          <input type="date" className="border rounded px-2 py-1 flex-1" disabled />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
        <div className="flex-1 flex gap-2 items-center">
          <label className="font-semibold min-w-[90px]">Nombres:</label>
          <input className="border rounded px-2 py-1 bg-gray-100" style={{ minWidth: '120px', maxWidth: '400px', width: `${Math.min(400, Math.max(120, (''?.length || 0) * 10))}px` }} disabled />
        </div>
        <div className="flex-1 flex gap-2 items-center">
          <label className="font-semibold">Edad:</label>
          <input className="border rounded px-2 py-1 w-24 bg-gray-100" disabled />
        </div>
        <span className="text-lg font-bold text-red-600 ml-2">COPROPARASITOLOGICO</span>
      </div>
      <form className="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {muestraLabels.map((muestra, idx) => (
            <fieldset key={muestra.key} className="bg-gray-100 border border-gray-300 rounded-md p-3 min-w-0">
              <legend className="font-bold text-blue-900 text-sm px-2">{muestra.label}</legend>
              <div className="flex flex-col gap-2 mt-2">
                {/* Color */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Color :</label>
                  <input className="border rounded px-2 py-1 max-w-[120px] w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />MARRON</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />MOSTAZA</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />VERDOSO</label>
                  </div>
                </div>
                {/* Aspecto */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Aspecto :</label>
                  <input className="border rounded px-2 py-1 max-w-[120px] w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />SOLIDO</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />SEMISOLIDO</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />DIARREICO</label>
                  </div>
                </div>
                {/* Moco Fecal */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Moco Fecal :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />AUSENTE</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />PRESENTE</label>
                  </div>
                </div>
                {/* Grasa */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Grasa :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />AUSENTE</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />PRESENTE</label>
                  </div>
                </div>
                {/* Sangre Visible */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Sangre Visible :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />AUSENTE</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />PRESENTE</label>
                  </div>
                </div>
                {/* Restos Alimenticios */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Restos Alimenticios :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />AUSENTE</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />PRESENTE</label>
                  </div>
                </div>
              </div>
            </fieldset>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {microsLabels.map((micro, idx) => (
            <fieldset key={micro.key} className="bg-gray-100 border border-gray-300 rounded-md p-3 min-w-0">
              <legend className="font-bold text-blue-900 text-sm px-2">{micro.label}</legend>
              <div className="flex flex-col gap-2 mt-2">
                {/* Leucocitos */}
                <div className="grid grid-cols-[110px_1fr_120px_70px] items-center gap-1 text-sm">
                  <label className="font-semibold">Leucocitos :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />No se observan</label>
                  <input className="border rounded px-2 py-1 w-full max-w-[60px]" placeholder="___x CC" />
                </div>
                {/* Hematíes */}
                <div className="grid grid-cols-[110px_1fr_120px_70px] items-center gap-1 text-sm">
                  <label className="font-semibold">Hematíes :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />No se observan</label>
                  <input className="border rounded px-2 py-1 w-full max-w-[60px]" placeholder="___x CC" />
                </div>
                {/* Inv. Parásitos */}
                <div className="grid grid-cols-[110px_1fr_170px] items-center gap-1 text-sm">
                  <label className="font-semibold">Inv. Parásitos :</label>
                  <input className="border rounded px-2 py-1 w-full" />
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />AUSENTE</label>
                    <label className="flex items-center gap-1 whitespace-nowrap"><input type="checkbox" className="scale-90" />PRESENTE</label>
                  </div>
                </div>
              </div>
            </fieldset>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between w-full">
          <div className="flex gap-3 w-full md:w-auto justify-center md:justify-start">
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
            <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
          </div>
          <div className="flex flex-col items-end w-full md:w-auto">
            <span className="font-bold text-blue-900 text-xs italic text-center w-full block">IMPRIMIR</span>
            <div className="flex gap-1 mt-1 justify-center w-full">
              <input className="border rounded px-2 py-1 w-24" />
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"><FontAwesomeIcon icon={faPrint} /></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Coproparasitologia; 