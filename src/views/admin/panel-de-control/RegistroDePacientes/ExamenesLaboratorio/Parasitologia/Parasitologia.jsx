import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const Parasitologia = () => {
  const [form, setForm] = useState({
    nroFicha: '',
    fecha: '',
    nombres: '',
    edad: '',
    muestras: [
      { color: '', aspecto: '', lugol: '' },
      { color: '', aspecto: '', lugol: '' },
      { color: '', aspecto: '', lugol: '' },
    ],
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMuestraChange = (idx, field, value) => {
    const updated = [...form.muestras];
    updated[idx][field] = value;
    setForm({ ...form, muestras: updated });
  };

  const handleLimpiar = () => {
    setForm({
      nroFicha: '',
      fecha: '',
      nombres: '',
      edad: '',
      muestras: [
        { color: '', aspecto: '', lugol: '' },
        { color: '', aspecto: '', lugol: '' },
        { color: '', aspecto: '', lugol: '' },
      ],
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  return (
    <form className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Nro Ficha:</label>
          <input name="nroFicha" value={form.nroFicha} onChange={handleInputChange} className="border rounded px-3 py-2 w-32 text-base" />
        </div>
        <button type="button" className="text-blue-700 hover:text-blue-900 flex items-center px-3 text-base">
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
        </button>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Fecha:</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-40 text-base"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Nombres:</label>
          <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-3 py-2 w-56 text-base" />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Edad:</label>
          <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-3 py-2 w-20 text-base" />
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mb-8 justify-center">
        {[0, 1, 2].map(idx => (
          <div key={idx} className="bg-gray-50 border rounded p-4 min-w-[220px] flex-1">
            <div className="font-bold text-base mb-2 text-center">MUESTRA {idx + 1}</div>
            <div className="mb-2">
              <label className="block text-base">COLOR</label>
              <input
                className="border rounded px-3 py-2 w-full text-base"
                value={form.muestras[idx].color}
                onChange={e => handleMuestraChange(idx, 'color', e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-base">ASPECTO</label>
              <input
                className="border rounded px-3 py-2 w-full text-base"
                value={form.muestras[idx].aspecto}
                onChange={e => handleMuestraChange(idx, 'aspecto', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base">LUGOL</label>
              <input
                className="border rounded px-3 py-2 w-full text-base"
                value={form.muestras[idx].lugol}
                onChange={e => handleMuestraChange(idx, 'lugol', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 justify-end">
        <div className="flex items-center gap-2 mr-8">
          <span className="font-semibold text-blue-900 text-base italic">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-28 text-base" />
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-base">
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
        <button type="button" className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 text-base hover:bg-green-700">
          <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
        </button>
        <button type="button" className="bg-yellow-400 text-white px-6 py-2 rounded flex items-center gap-2 text-base hover:bg-yellow-500" onClick={handleLimpiar}>
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
      </div>
    </form>
  );
};

export default Parasitologia; 