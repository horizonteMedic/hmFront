import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const pruebasList = [
  { label: 'TIFICO O' },
  { label: 'TIFICO H' },
  { label: 'PARATIFICO A' },
  { label: 'PARATIFICO B' },
  { label: 'Brucella abortus' },
];

const Inmunologia = () => {
  const [form, setForm] = useState({
    nroFicha: '',
    fecha: '',
    nombres: '',
    edad: '',
    resultados: Array(pruebasList.length).fill('1/40'),
    hepatitis: false,
    hepatitisA: '',
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleResultadoChange = (idx, value) => {
    const updated = [...form.resultados];
    updated[idx] = value;
    setForm({ ...form, resultados: updated });
  };

  const handleLimpiar = () => {
    setForm({
      nroFicha: '',
      fecha: '',
      nombres: '',
      edad: '',
      resultados: Array(pruebasList.length).fill('1/40'),
      hepatitis: false,
      hepatitisA: '',
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  return (
    <form className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-col md:flex-row flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <label className="font-semibold text-base">Nro Ficha:</label>
          <input name="nroFicha" value={form.nroFicha} onChange={handleInputChange} className="border rounded px-3 py-2 w-32 text-base" />
        </div>
        <button type="button" className="text-blue-700 hover:text-blue-900 flex items-center px-3 text-base">
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
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
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <label className="font-semibold text-base">Nombres:</label>
          <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-3 py-2 w-56 text-base" />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <label className="font-semibold text-base">Edad:</label>
          <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-3 py-2 w-20 text-base" />
        </div>
      </div>

      <div className="font-bold text-base text-center mb-2">MÉTODO EN LÁMINA PORTAOBJETO</div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
        <div className="font-bold text-base">PRUEBAS</div>
        <div className="font-bold text-base">RESULTADOS</div>
        {pruebasList.map((item, idx) => (
          <React.Fragment key={item.label}>
            <div className="flex items-center text-base">{item.label}</div>
            <input
              className="border rounded px-3 py-2 w-40 text-base"
              value={form.resultados[idx]}
              onChange={e => handleResultadoChange(idx, e.target.value)}
            />
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" name="hepatitis" checked={form.hepatitis} onChange={handleInputChange} />
        <label className="text-base font-semibold">PRUEBA HEPATITIS</label>
        {form.hepatitis && (
          <>
            <span className="ml-4 text-base">Prueba Rápida HEPATITIS A</span>
            <input
              className="border rounded px-3 py-2 w-56 text-base ml-2"
              name="hepatitisA"
              value={form.hepatitisA}
              onChange={handleInputChange}
            />
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
        <div className="flex gap-3">
          <button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold"><FontAwesomeIcon icon={faSave} /> Guardar/Actualizar</button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold" onClick={handleLimpiar}><FontAwesomeIcon icon={faBroom} /> Limpiar</button>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
          <div className="flex gap-1 mt-1">
            <input className="border rounded px-3 py-2 w-24 text-base" />
            <button type="button" className="bg-gray-200 px-2 py-1 rounded border border-gray-300"><FontAwesomeIcon icon={faPrint} /></button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Inmunologia; 