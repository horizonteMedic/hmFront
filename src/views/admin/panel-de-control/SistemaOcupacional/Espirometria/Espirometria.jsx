import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom } from '@fortawesome/free-solid-svg-icons';

const initialForm = {
  norden: '',
  fecha: '',
  codExam: '',
  nombres: '',
  edad: '',
  pasoExamen: false,
  fvc: '',
  fev1: '',
  fev1_fvc: '',
  fef: '',
  peso: '',
  talla: '',
  fvcTeorico: '',
  fev1Teorico: '',
  interpretacion: '',
};

export default function Espirometria() {
  const [form, setForm] = useState(initialForm);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === 'checkbox' ? checked : value);
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  const handleSave = () => {

  };

  return (
    <div className="mx-auto bg-white rounded shadow p-6 space-y-6" style={{ width: '30%' }}>
      <h2 className="text-2xl font-bold text-center">ESPIROMETRÍA</h2>
      {/* Encabezado */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <Field
          label="Nro Orden"
          name="norden"
          value={form.norden}
          onChange={handleInputChange}
        />
        <Field label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleInputChange} />
        <Field label="Cod Exam." name="codExam" value={form.codExam} onChange={handleInputChange} />
        <Field
          label="Nombres"
          name="nombres"
          value={form.nombres}
          onChange={handleInputChange}
          className="col-span-2"
          disabled
        />
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-1">
            <label className="font-semibold">Edad</label>
            <span>años</span>
            <label className="flex items-center font-semibold ml-4">
              <input
                type="checkbox"
                name="pasoExamen"
                checked={form.pasoExamen}
                onChange={handleInputChange}
                className="mr-1 accent-blue-600 w-5 h-5"
              />
              No Paso Examen
            </label>
          </div>
          <input
            type="text"
            name="edad"
            value={form.edad}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-32 bg-gray-50"
            disabled
          />
        </div>
      </div>
      <hr />
      {/* Resultados */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <Field label="FVC %" name="fvc" value={form.fvc} onChange={handleInputChange} />
        <Field label="Peso" name="peso" value={form.peso} onChange={handleInputChange} inputClass="bg-blue-200" />
        <Field label="FVC Teórico" name="fvcTeorico" value={form.fvcTeorico} onChange={handleInputChange} />
        <Field label="FEV1 %" name="fev1" value={form.fev1} onChange={handleInputChange} />
        <Field label="Talla" name="talla" value={form.talla} onChange={handleInputChange} inputClass="bg-blue-200" />
        <Field label="FEV1 Teórico" name="fev1Teorico" value={form.fev1Teorico} onChange={handleInputChange} />
        <Field label="FEV1/FVC %" name="fev1_fvc" value={form.fev1_fvc} onChange={handleInputChange} />
        <div></div>
        <div></div>
        <Field label="FEF 25-75 %" name="fef" value={form.fef} onChange={handleInputChange} />
      </div>
      {/* Interpretación */}
      <div>
        <label className="font-semibold block mb-1">Interpretación</label>
        <textarea
          name="interpretacion"
          value={form.interpretacion}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 w-full min-h-[60px]"
        />
      </div>
      {/* Acciones */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleSave} color="green" icon={faSave}>
          Guardar
        </Button>
        <Button onClick={handleClear} color="yellow" icon={faBroom}>
          Limpiar
        </Button>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, onKeyDown, className = '', inputClass = '', style, disabled = false }) {
  return (
    <div className={`flex flex-col ${className}`} style={style}>
      <label className="font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`border rounded px-2 py-1 ${disabled ? '' : 'cursor-text'} ${inputClass}`}
      />
    </div>
  );
}

function Button({ onClick, color, icon, children }) {
  const bg = color === 'green'
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-yellow-400 hover:bg-yellow-500';
  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm`}
    >
      <FontAwesomeIcon icon={icon} />
      {children}
    </button>
  );
}
