import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint, faEdit } from '@fortawesome/free-solid-svg-icons';

const Coprocultivo = ({ token, selectedSede }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Coprocultivo</h2>
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
          {/* Muestra */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">MUESTRA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Muestra:</label><input className="border rounded px-2 py-1 flex-1" value="HECES" readOnly /></div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Color:</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" /> Marrón</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Mostaza</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Verdoso</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Consistencia:</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" /> Sólido</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Semisólido</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Diarreico</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Moco Fecal:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Sangre Visible:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
              </div>
            </div>
            <div className="mb-2"><label className="font-semibold w-28 inline-block">Restos Alim.:</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
                <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
              </div>
            </div>
          </fieldset>
          {/* Examen Microscópico */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">EXAMEN MICROSCÓPICO</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Leucocitos:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> No se observan</label>
              <input className="border rounded px-2 py-1 w-24 ml-2" placeholder="__x campo" />
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Hematíes:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> No se observan</label>
              <input className="border rounded px-2 py-1 w-24 ml-2" placeholder="__x campo" />
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Parásitos:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Gotas de grasa:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
            </div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Levaduras:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Ausente</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
            </div>
          </fieldset>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identificación y antibiograma */}
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">IDENTIFICACIÓN Y ANTIBIOGRAMA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Identificación:</label><input className="border rounded px-2 py-1 flex-1" value="Escherichia coli (*)" readOnly /></div>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Flora Coliforme:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Presente</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Regular cantidad</label>
            </div>
          </fieldset>
          <fieldset className="border rounded p-3">
            <legend className="font-bold text-blue-900 text-sm px-2">IDENTIFICACIÓN Y ANTIBIOGRAMA</legend>
            <div className="mb-2 flex items-center gap-2"><label className="font-semibold w-28">Resultado:</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Negativo</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> Positivo</label>
            </div>
          </fieldset>
        </div>
        <div className="mb-2">
          <label className="font-semibold text-blue-900 text-sm">Observaciones:</label>
          <textarea className="border rounded px-2 py-1 w-full bg-blue-50 text-gray-700" rows={3} defaultValue={"No se aisló Escherichia Coli Enteroinvasiva - Enteropatógena - Enterohemorrágica.\nNo se aisló bacteria patógenas."} />
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

export default Coprocultivo; 