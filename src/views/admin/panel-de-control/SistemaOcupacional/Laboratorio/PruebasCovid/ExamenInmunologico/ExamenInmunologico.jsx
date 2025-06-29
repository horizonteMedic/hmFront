// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/ExamenInmunologico/ExamenInmunologico.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const sintomasList = [
  'Tos','Dolor de garganta','Congestión nasal','Dificultad respiratoria',
  'Fiebre/Escalofrío','Malestar general','Pérdida olfato o gusto',
  'Diarrea','Náuseas/vómitos','Cefalea','Irritabilidad/confusión',
  'Dolor','Expectoración'
];

export default function ExamenInmunologico({ apiBase, token, selectedSede }) {
  const [form, setForm] = useState({
    norden: '',
    fecha: '',
    nombres: '',
    dni: '',
    edad: '',
    marca: '',
    igmReactivo: false,
    igmNoReactivo: false,
    iggReactivo: false,
    iggNoReactivo: false,
    invalid: false,
    saturacion: '',
    fechaExamen: '',
    asintomatico: false,
    sintomatico: false,
    sintomas: [],
    otrosSintomas: ''
  });
  const [status, setStatus] = useState('');
  const nombreInputRef = useRef(null);

  useEffect(() => {
    setForm(f => ({ ...f, fecha: new Date().toISOString().split('T')[0] }));
  }, []);

  // Ajuste dinámico del ancho del input de nombres
  useEffect(() => {
    if (nombreInputRef.current) {
      const len = form.nombres?.length || 0;
      const min = 120, max = 400;
      nombreInputRef.current.style.width = `${Math.min(max, Math.max(min, len * 10))}px`;
    }
  }, [form.nombres]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => {
      if (type === 'checkbox' && name === 'sintomas') {
        const setS = new Set(f.sintomas);
        checked ? setS.add(value) : setS.delete(value);
        return { ...f, sintomas: [...setS] };
      }
      if (type === 'checkbox') {
        return { ...f, [name]: checked };
      }
      return { ...f, [name]: value };
    });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, sede: selectedSede };
      const res = await fetch(`${apiBase}/exameninmunologico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar');
      setStatus('Guardado exitoso');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleClear = () => {
    setForm(f => ({
      ...f,
      marca: '',
      igmReactivo: false,
      igmNoReactivo: false,
      iggReactivo: false,
      iggNoReactivo: false,
      invalid: false,
      saturacion: '',
      fechaExamen: '',
      asintomatico: false,
      sintomatico: false,
      sintomas: [],
      otrosSintomas: ''
    }));
    setStatus('Formulario limpiado');
  };

  const handlePrint = () => {
    window.open(`${apiBase}/exameninmunologico/print?norden=${form.norden}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded shadow p-8 text-base">
      <h2 className="text-2xl font-bold text-center mb-8">COVID-19 Prueba Rápida Inmunológico</h2>
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Encabezado sin hora */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base">N° Orden :</label>
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-40 text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base">Fecha :</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-44 text-base"
            />
          </div>
        </div>

        {/* Datos de paciente */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base">Nombres y Apellidos :</label>
            <input
              name="nombres"
              value={form.nombres}
              disabled
              ref={nombreInputRef}
              className="border rounded px-3 py-2 text-base bg-gray-100 cursor-not-allowed transition-all duration-200"
              style={{ minWidth: 120, maxWidth: 400 }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base">DNI :</label>
            <input name="dni" value={form.dni} disabled className="border rounded px-3 py-2 w-32 text-base bg-gray-100 cursor-not-allowed" />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base">Edad :</label>
            <input name="edad" value={form.edad} disabled className="border rounded px-3 py-2 w-20 text-base bg-gray-100 cursor-not-allowed" />
          </div>
        </div>

        {/* Selección de marca */}
        <div className="flex items-center gap-2 mb-4">
          <label className="min-w-[120px] font-semibold">Marca:</label>
          <select
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="border rounded px-2 py-1 flex-1"
          >
            <option value="">--Seleccione--</option>
            <option>INSE COVID-19 IGM/IGG TEST CASSETTE</option>
            <option>RAPID RESPONSE COVID-19 IGM/IGG TEST CASSETTE</option>
          </select>
        </div>

        {/* IgM / IgG */}
        <div className="flex flex-wrap gap-8 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">IgM:</span>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="igmReactivo"
                checked={form.igmReactivo}
                onChange={handleChange}
              /> Reactivo
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="igmNoReactivo"
                checked={form.igmNoReactivo}
                onChange={handleChange}
              /> No Reactivo
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">IgG:</span>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="iggReactivo"
                checked={form.iggReactivo}
                onChange={handleChange}
              /> Reactivo
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="iggNoReactivo"
                checked={form.iggNoReactivo}
                onChange={handleChange}
              /> No Reactivo
            </label>
          </div>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="invalid"
              checked={form.invalid}
              onChange={handleChange}
            /> Inválido
          </label>
        </div>

        {/* Paneles de técnica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border rounded p-4 text-sm">
            <p><strong>Técnica IgM</strong></p>
            <p>Sensibilidad: 95.00%</p>
            <p>Especificidad: 96.00%</p>
          </div>
          <div className="border rounded p-4 text-sm">
            <p><strong>Técnica IgG</strong></p>
            <p>Sensibilidad: 95.00%</p>
            <p>Especificidad: 96.00%</p>
          </div>
        </div>

        {/* SOLO PARA PC (HOTELES) */}
        <fieldset className="border rounded p-4 mb-4 max-w-5xl mx-auto">
          <legend className="font-bold text-blue-900 mb-4">SOLO PARA PC (HOTELES)</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
            <div className="flex flex-col gap-1">
              <label className="min-w-[120px] font-semibold">Saturación:</label>
              <input
                name="saturacion"
                value={form.saturacion}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="min-w-[120px] font-semibold">Fecha Examen:</label>
              <input
                type="date"
                name="fechaExamen"
                value={form.fechaExamen}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-8 mb-4">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="asintomatico"
                checked={form.asintomatico}
                onChange={handleChange}
              /> Asintomático
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="sintomatico"
                checked={form.sintomatico}
                onChange={handleChange}
              /> Sintomático
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-base">
            {sintomasList.map(s => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sintomas"
                  value={s}
                  checked={form.sintomas.includes(s)}
                  onChange={handleChange}
                />
                {s}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="min-w-[140px] font-semibold">Otros síntomas:</label>
            <input
              name="otrosSintomas"
              value={form.otrosSintomas}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </fieldset>

        {/* Botones generales */}
        <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"
            >
              <FontAwesomeIcon icon={faSave}/> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors"
            >
              <FontAwesomeIcon icon={faBroom}/> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-blue-900 text-xs italic">IMPRIMIR</span>
            <div className="flex gap-1 mt-1">
              <input className="border rounded px-2 py-1 w-24" value={form.norden} name="norden" onChange={handleChange}/>
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors" onClick={handlePrint}>
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
        {status && <p className="mt-4 text-center text-green-600 text-base">{status}</p>}
      </form>
    </div>
  );
}
