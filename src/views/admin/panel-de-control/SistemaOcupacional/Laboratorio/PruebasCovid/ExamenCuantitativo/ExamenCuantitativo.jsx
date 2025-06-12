// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PcuanAntigenos/PcuanAntigenos.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PcuanAntigenos({ apiBase, token, selectedSede }) {
  const [form, setForm] = useState({
    norden: '',
    fecha: '',
    nombres: '',
    dni: '',
    edad: '',
    marca: '',
    doctor: 'N/A',
    valorIgm: '',
    valorIgg: '',
    reactivoIgm: false,
    reactivoIgg: false,
    invalido: false
  });
  const [status, setStatus] = useState('');

  // Inicializar la fecha
  useEffect(() => {
    setForm(f => ({ ...f, fecha: new Date().toISOString().split('T')[0] }));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, sede: selectedSede };
      const res = await fetch(`${apiBase}/pcuanantigenos`, {
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
      valorIgm: '',
      valorIgg: '',
      reactivoIgm: false,
      reactivoIgg: false,
      invalido: false
    }));
    setStatus('Formulario limpiado');
  };

  const handlePrint = () => {
    window.open(`${apiBase}/pcuanantigenos/print?norden=${form.norden}`, '_blank');
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">COVID-19 Prueba Cuantitativa (Antígenos)</h2>
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6 text-base">
        {/* Encabezado paciente */}
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
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {['nombres','dni','edad'].map(field => (
            <div key={field} className="flex-1 flex items-center gap-2">
              <label className="min-w-[90px] font-semibold">
                {field === 'dni' ? 'DNI:' : field === 'edad' ? 'Edad:' : 'Nombres y Apellidos:'}
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

        {/* COVID-19 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="min-w-[120px] font-semibold">Marca:</label>
            <select
              name="marca"
              value={form.marca}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            >
              <option value="">--Seleccione--</option>
              <option>INS E COVID-19 IGM/IGG TEST CASSETTE</option>
              <option>ID-19 IGM/IGG TEST CASSETTE</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'valorIgm', label: 'Valor IGM' },
              { name: 'valorIgg', label: 'Valor IGG' }
            ].map(({name,label}) => (
              <div key={name} className="flex items-center gap-2">
                <label className="min-w-[120px] font-semibold">{label}:</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 flex-1"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'reactivoIgm', label: 'IgM Reactivo' },
              { name: 'reactivoIgg', label: 'IgG Reactivo' }
            ].map(({name,label}) => (
              <label key={name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={handleChange}
                />
                <span className="font-semibold">{label}</span>
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="invalido"
              checked={form.invalido}
              onChange={handleChange}
            />
            <span className="font-semibold">Inválido</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              type="submit"
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
              <FontAwesomeIcon icon={faPrint}/>
            </button>
          </div>
        </div>

        {status && <p className="mt-4 text-center text-green-600 text-base">{status}</p>}
      </form>
    </div>
  );
}
