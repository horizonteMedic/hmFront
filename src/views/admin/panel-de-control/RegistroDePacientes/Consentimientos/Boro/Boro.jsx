import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const antecedentesList = [
  { label: 'CONSUME COCAINA' },
  { label: 'CONSUME MARIHUANA' },
];

const preguntasAdicionales = [
  { label: '¿Sufre alguna enfermedad?', field: 'enfermedad', tipo: 'text', especifica: '¿Cuál?' },
  { label: '¿Consume regularmente algún medicamento?', field: 'medicamento', tipo: 'text', especifica: '¿Cuál?' },
  { label: '¿Chaccha o mastica hoja de coca?', field: 'coca', tipo: 'date', especifica: 'Especifique la fecha:' },
  { label: '¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?', field: 'tratamiento', tipo: 'text', especifica: 'Especifique cuál:' },
  { label: '', field: 'tratamiento_cuando', tipo: 'text', especifica: 'Especifique cuándo:' },
  { label: '', field: 'tratamiento_donde', tipo: 'text', especifica: 'Especifique dónde:' },
];

const Boro = () => {
  const [form, setForm] = useState({
    nroOrden: '',
    fecha: '',
    nombre: '',
    edad: '',
    dni: '',
    antecedentes: Array(antecedentesList.length).fill('NO'),
    enfermedad: { si: 'NO', cual: '' },
    medicamento: { si: 'NO', cual: '' },
    coca: { si: 'NO', fecha: '' },
    tratamiento: { si: 'NO', cual: '', cuando: '', donde: '' },
  });

  const fechaRef = useRef(null);
  const cocaFechaRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAntecedenteChange = (idx, value) => {
    const updated = [...form.antecedentes];
    updated[idx] = value;
    setForm({ ...form, antecedentes: updated });
  };

  const handlePreguntaChange = (field, key, value) => {
    setForm({ ...form, [field]: { ...form[field], [key]: value } });
  };

  const handleLimpiar = () => {
    setForm({
      nroOrden: '',
      fecha: '',
      nombre: '',
      edad: '',
      dni: '',
      antecedentes: Array(antecedentesList.length).fill('NO'),
      enfermedad: { si: 'NO', cual: '' },
      medicamento: { si: 'NO', cual: '' },
      coca: { si: 'NO', fecha: '' },
      tratamiento: { si: 'NO', cual: '', cuando: '', donde: '' },
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
        CONSENTIMIENTO PARA REALIZAR LA PRUEBA DE DOSAJE DE MARIHUANA Y COCAINA
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 justify-center text-base">
        <span>Yo</span>
        <input name="nombre" value={form.nombre} readOnly className="border-b border-gray-400 px-3 py-2 w-64 text-base bg-gray-100 cursor-not-allowed" />
        <span>de</span>
        <input name="edad" value={form.edad} readOnly className="border-b border-gray-400 px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed" />
        <span>años de edad, con documento de identidad N°</span>
        <input name="dni" value={form.dni} readOnly className="border-b border-gray-400 px-3 py-2 w-40 text-base bg-gray-100 cursor-not-allowed" />
      </div>

      <div className="text-justify text-base mb-4">
        autorizo al POLICLINICO HORIZONTE MEDIC, para que se me realice el examen toxicológico de drogas en orina y/o saliva, según los protocolos establecidos y que los resultados se entreguen directamente a la empresa.
      </div>

      <div className="font-semibold mb-2 text-lg">ANTECEDENTES:</div>
      <div className="flex flex-wrap gap-8 mb-6">
        {antecedentesList.map((item, idx) => (
          <div key={item.label} className="flex items-center gap-4">
            <label className="text-base font-medium">- {item.label}</label>
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

      <div className="font-semibold mb-2 text-lg">Además, declaro que la información que brindaré a continuación es verdadera:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
        {/* Enfermedad */}
        <div className="flex items-center gap-4">
          <label className="text-base font-medium flex-1">¿Sufre alguna enfermedad?</label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="enfermedad_si"
                checked={form.enfermedad.si === 'NO'}
                onChange={() => handlePreguntaChange('enfermedad', 'si', 'NO')}
              />
              NO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="enfermedad_si"
                checked={form.enfermedad.si === 'SI'}
                onChange={() => handlePreguntaChange('enfermedad', 'si', 'SI')}
              />
              SI
            </label>
            <input
              type="text"
              placeholder="¿Cuál?"
              value={form.enfermedad.cual}
              onChange={e => handlePreguntaChange('enfermedad', 'cual', e.target.value)}
              className="border-b border-gray-400 px-3 py-2 w-48 text-base ml-2"
            />
          </div>
        </div>
        {/* Medicamento */}
        <div className="flex items-center gap-4">
          <label className="text-base font-medium flex-1">¿Consume regularmente algún medicamento?</label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="medicamento_si"
                checked={form.medicamento.si === 'NO'}
                onChange={() => handlePreguntaChange('medicamento', 'si', 'NO')}
              />
              NO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="medicamento_si"
                checked={form.medicamento.si === 'SI'}
                onChange={() => handlePreguntaChange('medicamento', 'si', 'SI')}
              />
              SI
            </label>
            <input
              type="text"
              placeholder="¿Cuál?"
              value={form.medicamento.cual}
              onChange={e => handlePreguntaChange('medicamento', 'cual', e.target.value)}
              className="border-b border-gray-400 px-3 py-2 w-48 text-base ml-2"
            />
          </div>
        </div>
        {/* Coca */}
        <div className="flex items-center gap-4">
          <label className="text-base font-medium flex-1">¿Chaccha o mastica hoja de coca?</label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="coca_si"
                checked={form.coca.si === 'NO'}
                onChange={() => handlePreguntaChange('coca', 'si', 'NO')}
              />
              NO
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name="coca_si"
                checked={form.coca.si === 'SI'}
                onChange={() => handlePreguntaChange('coca', 'si', 'SI')}
              />
              SI
            </label>
            <input
              type="date"
              value={form.coca.fecha}
              onChange={e => handlePreguntaChange('coca', 'fecha', e.target.value)}
              className="border-b border-gray-400 px-3 py-2 w-48 text-base ml-2"
              ref={cocaFechaRef}
              onFocus={handleFechaFocus}
            />
          </div>
        </div>
        {/* Tratamiento quirúrgico o dental */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <label className="text-base font-medium flex-1">¿En las últimas 48 horas, se realizó algún tratamiento quirúrgico o dental?</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name="tratamiento_si"
                  checked={form.tratamiento.si === 'NO'}
                  onChange={() => handlePreguntaChange('tratamiento', 'si', 'NO')}
                />
                NO
              </label>
              <label className="flex items-center gap-1 text-base">
                <input
                  type="radio"
                  name="tratamiento_si"
                  checked={form.tratamiento.si === 'SI'}
                  onChange={() => handlePreguntaChange('tratamiento', 'si', 'SI')}
                />
                SI
              </label>
              <input
                type="text"
                placeholder="Especifique cuál:"
                value={form.tratamiento.cual}
                onChange={e => handlePreguntaChange('tratamiento', 'cual', e.target.value)}
                className="border-b border-gray-400 px-3 py-2 w-48 text-base ml-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="text"
              placeholder="Especifique cuándo:"
              value={form.tratamiento.cuando}
              onChange={e => handlePreguntaChange('tratamiento', 'cuando', e.target.value)}
              className="border-b border-gray-400 px-3 py-2 w-48 text-base"
            />
            <input
              type="text"
              placeholder="Especifique dónde:"
              value={form.tratamiento.donde}
              onChange={e => handlePreguntaChange('tratamiento', 'donde', e.target.value)}
              className="border-b border-gray-400 px-3 py-2 w-48 text-base"
            />
          </div>
        </div>
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

export default Boro; 