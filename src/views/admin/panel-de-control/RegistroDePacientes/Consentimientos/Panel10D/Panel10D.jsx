import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const antecedentesList = [
  { label: 'CONSUME MARIHUANA (THC)' },
  { label: 'CONSUME COCAINA (COC)' },
  { label: 'CONSUMO HOJA DE COCA EN LOS 14 DIAS PREVIOS' },
  { label: 'CONSUME ANFETAMINAS (AMP)' },
  { label: 'CONSUME METHANFETAMINAS (MET)' },
  { label: 'CONSUME BENZODIAZEPINAS (BZO)' },
  { label: 'CONSUME OPIÁCEOS (OPI)' },
  { label: 'CONSUME BARBITÚRICOS (BAR)' },
  { label: 'CONSUME METADONA (MTD)' },
  { label: 'CONSUME FENCICLIDINA (PCP)' },
  { label: 'CONSUME ANTIDEPRESIVOS TRICÍCLICOS (TCA)' },
];

const Panel10D = () => {
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

  // Forzar apertura del calendario al hacer focus
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
        CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS<br />
        PANEL 10 D (AMP-BAR-BZO-COC-MET-MTP-PCP-THC-OPI-TCA)
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-start text-base">
        <span>Yo</span>
        <input name="nombre" value={form.nombre} readOnly className="border-b border-gray-400 px-3 py-2 w-64 text-base bg-gray-100 cursor-not-allowed" />
        <span>, de</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed" />
        <span>años de edad, identificado con DNI N°</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 w-40 text-base bg-gray-100 cursor-not-allowed" />
      </div>

      <div className="text-justify text-base mb-4">
        , habiendo recibido consejería e información acerca de la prueba para el panel de 10D drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post -Test y mis resultados.
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        {antecedentesList.map((item, idx) => (
          <div key={item.label} className="flex items-center gap-6">
            <label className="text-base font-medium flex-1 whitespace-nowrap">{item.label}</label>
            <div className="flex items-center gap-4 ml-2">
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

export default Panel10D; 