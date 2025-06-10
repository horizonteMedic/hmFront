import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const pruebasList = [
  { label: 'COCAINA (COC)' },
  { label: 'MARIHUANA (THC)' },
  { label: 'ANFETAMINA (AMP)' },
  { label: 'METANFETAMINA (MET)' },
  { label: 'BENZODIAZEPINA (BZO)' },
  { label: 'OPIÁCEOS (OPI)' },
  { label: 'BARBITÚRICOS (BAR)' },
  { label: 'METADONA (MTD)' },
  { label: 'FENCICLIDINA (PCP)' },
  { label: 'ANTIDEPRESIVOS TRICÍCLICOS (TCA)' },
];

const Panel10D = () => {
  const [form, setForm] = useState({
    nroFicha: '',
    fecha: '',
    nombres: '',
    edad: '',
    resultados: Array(pruebasList.length).fill('NEGATIVO'),
  });

  const fechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      resultados: Array(pruebasList.length).fill('NEGATIVO'),
    });
  };

  const handleFechaFocus = (e) => {
    e.target.showPicker && e.target.showPicker();
  };

  return (
    <form className="w-full max-w-3xl mx-auto bg-white p-8 rounded shadow">
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

      <div className="mb-4">
        <div className="font-semibold text-base">PRUEBA RAPIDA CUALITATIVA</div>
        <input
          className="border rounded px-3 py-2 w-full text-base mt-1 mb-2"
          value="MÉTODO : INMUNOCROMATOGRÁFICO"
          readOnly
        />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
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

export default Panel10D; 