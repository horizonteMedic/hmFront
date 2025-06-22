import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { VerifyTR } from './controller5D';

const pruebas5D = [
  'COCAINA',
  'MARIHUANA',
  'ANFETAMINA EN ORINA',
  'METHANFETAMINA',
  'BENZODIAZEPINA',
];

const Rseultado_Panel5D = ({ token, selectedSede, userlogued }) => {
  const tabla = 'panel5d'
  const [form, setForm] = useState({
    norden: '',
    fecha: '',
    nombres: '',
    edad: '',
    valueM: '',
    valueC: '',
    valueAn: '',
    valueMet: '',
    valueBen: '',
  });
  const fechaRef = useRef(null);

  

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleLimpiar = () => {
    setForm({
      norden: '',
      fecha: '',
      nombres: '',
      edad: '',
      valueM: '',
      valueC: '',
      valueAn: '',
      valueMet: '',
      valueBen: '',
    });
  };

  const handleFechaFocus = e => {
    e.target.showPicker?.();
  };

  const handleSave = async () => {
    
  };

  const handlePrint = () => {
  };

  const nameWidth = Math.min(400, Math.max(120, (form.nombres?.length || 0) * 10));

  return (
    <form className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">PANEL 5D</h2>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nro Ficha:</label>
          <input
            name="norden"
            value={form.norden}
            onKeyUp={(event) => {if(event.key === 'Enter') VerifyTR(form.norden, tabla, token, setForm, selectedSede)}}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-40"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Nombres:</label>
          <input
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            disabled
            style={{ width: nameWidth }}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold">Edad:</label>
          <input
            name="edad"
            value={form.edad}
            onChange={handleChange}
            disabled
            className="border rounded px-3 py-2 w-20"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
        <div className="font-bold">PRUEBAS</div>
        <div className="font-bold">RESULTADOS</div>
        <div className="flex items-center">COCAINA</div>
          <input
            name='valueC'
            className="border rounded px-3 py-2 w-40"
            value={form.valueC}
            onChange={handleChange}
          />
        <div className="flex items-center">MARIHUANA</div>
          <input
            name='valueM'
            className="border rounded px-3 py-2 w-40"
            value={form.valueM}
            onChange={handleChange}
          />
        <div className="flex items-center">ANFETAMINA EN ORINA</div>
          <input
            name='valueAn'
            className="border rounded px-3 py-2 w-40"
            value={form.valueAn}
            onChange={handleChange}
          />
        <div className="flex items-center">METHANFETAMINA</div>
          <input
            name='valueMet'
            className="border rounded px-3 py-2 w-40"
            value={form.valueMet}
            onChange={handleChange}
          />
        <div className="flex items-center">BENZODIAZEPINA</div>
          <input
            name='valueBen'
            className="border rounded px-3 py-2 w-40"
            value={form.valueBen}
            onChange={handleChange}
          />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 italic">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-28" />
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faSave} /> Guardar
        </button>
        <button
          type="button"
          onClick={handleLimpiar}
          className="bg-yellow-400 text-white px-6 py-2 rounded hover:bg-yellow-500"
        >
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      </div>
    </form>
  );
};

export default Rseultado_Panel5D;