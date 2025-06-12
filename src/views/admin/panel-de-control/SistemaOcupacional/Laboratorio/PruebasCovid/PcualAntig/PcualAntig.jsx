// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PcualAntig/PcualAntig.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const sintomasList = [
  'Tos','Dolor de garganta','Congestión nasal','Dificultad respiratoria',
  'Fiebre/Escalofrío','Malestar general','Pérdida olfato o gusto',
  'Diarrea','Náuseas/vómitos','Cefalea','Irritabilidad/confusión',
  'Dolor','Expectoración'
];

export default function PcualAntig({ apiBase, token, selectedSede }) {
  const [form, setForm] = useState({
    norden: '',
    fecha: '',
    nombres: '',
    dni: '',
    edad: '',
    marca: '',
    doctor: 'N/A',
    positivo: false,
    negativo: false,
    fechaSintomas: '',
    sintomas: [],
    marsa: false
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    setForm(f => ({ ...f, fecha: new Date().toISOString().split('T')[0] }));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => {
      if (type === 'checkbox' && name === 'sintomas') {
        const list = new Set(f.sintomas);
        checked ? list.add(value) : list.delete(value);
        return { ...f, sintomas: [...list] };
      }
      if (type === 'checkbox') return { ...f, [name]: checked };
      return { ...f, [name]: value };
    });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, sede: selectedSede };
      const res = await fetch(`${apiBase}/pcualantig`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      positivo: false,
      negativo: false,
      fechaSintomas: '',
      sintomas: [],
      marsa: false
    }));
    setStatus('Formulario limpiado');
  };

  const handlePrint = () => {
    window.open(`${apiBase}/pcualantig/print?norden=${form.norden}`, '_blank');
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6 text-base">
      <h2 className="text-2xl font-bold text-center mb-6">COVID-19 Prueba Cualitativa (Antígenos)</h2>
      <form onSubmit={e=>{e.preventDefault();handleSave();}} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="marsa"
              checked={form.marsa}
              onChange={handleChange}
              className="scale-110"
            />
            <span className="font-semibold text-red-600">MARSA</span>
          </label>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-base"
          >
            Imprimir
          </button>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="min-w-[90px] font-semibold">N° Orden:</label>
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="min-w-[90px] font-semibold">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {['nombres','dni','edad'].map(field=>(
            <div key={field} className="flex-1 flex items-center gap-2">
              <label className="min-w-[90px] font-semibold">
                {field==='dni'?'DNI:':field==='edad'?'Edad:':'Nombres y Apellidos:'}
              </label>
              <input
                name={field}
                value={form[field]}
                disabled
                className="border rounded px-2 py-1 bg-gray-100 flex-1"
              />
            </div>
          ))}
        </div>

        {/* Marca y Doctor */}
        <div className="flex items-center gap-2">
          <label className="min-w-[120px] font-semibold">Marca:</label>
          <select
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="border rounded px-2 py-1 flex-1"
          >
            <option value="">--Seleccione--</option>
            <option>RAPID RESPONSE COVID-19 IGM/IGG TEST CASSETTE</option>
            <option>OTRA MARCA</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="min-w-[120px] font-semibold">Doctor:</label>
          <input
            name="doctor"
            value={form.doctor}
            disabled
            className="border rounded px-2 py-1 bg-gray-100 flex-1"
          />
        </div>

        {/* Panel de método */}
        <div className="border rounded p-4 text-sm">
          <p><strong>Método:</strong> Inmunocromatografía</p>
          <p><strong>Sensibilidad:</strong> 94.55%</p>
          <p><strong>Especificidad:</strong> 100.00%</p>
        </div>

        {/* Positivo / Negativo */}
        <div className="flex gap-8">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="positivo"
              checked={form.positivo}
              onChange={handleChange}
            />
            <span className="font-semibold">Positivo</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="negativo"
              checked={form.negativo}
              onChange={handleChange}
            />
            <span className="font-semibold">Negativo</span>
          </label>
        </div>

        {/* Fecha de síntomas */}
        <div className="flex items-center gap-2">
          <label className="min-w-[140px] font-semibold">Fecha Síntomas:</label>
          <input
            type="date"
            name="fechaSintomas"
            value={form.fechaSintomas}
            onChange={handleChange}
            className="border rounded px-2 py-1 flex-1"
          />
        </div>

        {/* Síntomas */}
        <fieldset className="border rounded p-4">
          <legend className="font-bold mb-2">Síntomas</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-base">
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
        </fieldset>

        {/* Botones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 text-base"
            >
              <FontAwesomeIcon icon={faSave}/> Guardar cambios
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 text-base"
            >
              <FontAwesomeIcon icon={faBroom}/> Limpiar
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              placeholder="Veces"
              className="border rounded px-2 py-1 w-24 text-base"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-base"
            >
              <FontAwesomeIcon icon={faPrint}/> Imprimir
            </button>
          </div>
        </div>

        {status && <p className="mt-4 text-center text-green-600">{status}</p>}
      </form>
    </div>
);
}
