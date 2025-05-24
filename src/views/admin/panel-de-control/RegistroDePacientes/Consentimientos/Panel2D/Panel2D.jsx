import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const antecedentesList = [
  { label: 'CONSUME MARIHUANA' },
  { label: 'CONSUMO HOJA DE COCA EN LOS 7 DIAS PREVIOS' },
  { label: 'CONSUME COCAINA' },
];

const Panel2D = () => {
  const [form, setForm] = useState({
    nroOrden: '',
    fecha: '',
    nombre: '',
    edad: '',
    dni: '',
    antecedentes: Array(antecedentesList.length).fill('NO'),
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAntecedenteChange = (idx, value) => {
    const updated = [...form.antecedentes];
    updated[idx] = value;
    setForm({ ...form, antecedentes: updated });
  };

  const handleLimpiar = () => {
    setForm({
      nroOrden: '',
      fecha: '',
      nombre: '',
      edad: '',
      dni: '',
      antecedentes: Array(antecedentesList.length).fill('NO'),
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  return (
    <form className="w-full max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Nro Orden :</label>
          <input name="nroOrden" value={form.nroOrden} onChange={handleInputChange} className="border rounded px-3 py-2 w-48 text-base" />
        </div>
        <button type="button" className="text-blue-700 hover:text-blue-900 flex items-center px-3 text-base">
          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
        </button>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-lg">Fecha :</label>
          <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-56 text-base"
            ref={fechaRef}
            onFocus={handleFechaFocus}
          />
        </div>
      </div>

      <div className="text-center font-bold text-xl mb-4">
        CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA Y COCAINA
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-center text-base">
        <span>YO,</span>
        <input name="nombre" value={form.nombre} readOnly className="border-b border-gray-400 px-3 py-2 w-64 text-base bg-gray-100 cursor-not-allowed" />
        <span>de,</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed" />
        <span>años de edad, identificado con DNI nº</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 w-40 text-base bg-gray-100 cursor-not-allowed" />
      </div>

      <div className="text-justify text-base mb-4">
        ; habiendo recibido consejería e información acerca de la prueba para Marihuana y cocaína en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post – Test y mis resultados.
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES :</div>
      <div className="flex flex-wrap gap-8 mb-8">
        {antecedentesList.map((item, idx) => (
          <div key={item.label} className="flex items-center gap-4">
            <label className="text-base font-medium">{item.label}</label>
            <div className="flex items-center gap-3 ml-2">
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${idx}`}
                  checked={form.antecedentes[idx] === 'NO'}
                  onChange={() => handleAntecedenteChange(idx, 'NO')}
                />
                NO
              </label>
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name={`antecedente_${idx}`}
                  checked={form.antecedentes[idx] === 'SI'}
                  onChange={() => handleAntecedenteChange(idx, 'SI')}
                />
                SI
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button type="button" className="bg-green-600 text-white px-6 py-3 rounded flex items-center gap-2 text-lg hover:bg-green-700">
          <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
        </button>
        <button type="button" className="bg-yellow-400 text-white px-6 py-3 rounded flex items-center gap-2 text-lg hover:bg-yellow-500" onClick={handleLimpiar}>
          <FontAwesomeIcon icon={faBroom} /> Limpiar
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-semibold text-blue-900 text-lg">IMPRIMIR</span>
          <input className="border rounded px-3 py-2 w-32 text-base" />
          <button type="button" className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 text-lg">
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Panel2D; 