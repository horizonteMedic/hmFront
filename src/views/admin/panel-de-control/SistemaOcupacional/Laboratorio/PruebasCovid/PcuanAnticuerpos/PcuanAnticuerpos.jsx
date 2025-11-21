// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PcuanAnticuerpos/PcuanAnticuerpos.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const MARCAS = [
  {
    value: 'ID-19 IGM/IGG TEST CASSETTE',
    tecnica: 'Inmunofluorescencia',
    sensibilidad: '90.00%',
    especificidad: '95.00%'
  },
  // Puedes agregar más marcas aquí si es necesario
];

const DEFAULT_TECNICA = {
  tecnica: 'Inmunofluorescencia',
  sensibilidad: '90.00%',
  especificidad: '95.00%'
};

export default function PcuanAnticuerpos({ apiBase, token, selectedSede }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    dni: '',
    edad: '',
    marca: '',
    doctor: 'N/A',
    valorIgM: '',
    valorIgG: ''
  });
  const [status, setStatus] = useState('');
  const nombreInputRef = useRef(null);

  useEffect(() => {
    setForm(f => ({ ...f, fecha: today }));
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
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, sede: selectedSede };
      const res = await fetch(`${apiBase}/pcuananticuerpos`, {
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
      valorIgM: '',
      valorIgG: ''
    }));
    setStatus('Formulario limpiado');
  };

  const handlePrint = () => {
    window.open(`${apiBase}/pcuananticuerpos/print?norden=${form.norden}`, '_blank');
  };

  const selectedMarca = MARCAS.find(m => m.value === form.marca) || DEFAULT_TECNICA;

  return (
    <form className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      {/* Título principal */}
      <div className="text-2xl font-bold text-center mb-8">COVID-19 Prueba Cuantitativa (Anticuerpos)</div>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">N° Orden :</label>
          <input name="norden" value={form.norden} onChange={handleChange} className="border rounded px-3 py-2 w-40 text-base" />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Fecha :</label>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className="border rounded px-3 py-2 w-44 text-base" />
        </div>
      </div>

      {/* Datos personales */}
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

      {/* Sección COVID-19 Prueba Rápida */}
      <div className="border rounded p-4 mb-8">
        <div className="font-bold text-base mb-2">COVID - 19 Prueba Rápida</div>
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex flex-col gap-4 flex-1 min-w-[260px]">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[70px]">MARCA:</label>
              <select name="marca" value={form.marca} onChange={handleChange} className="border rounded px-2 py-1 flex-1">
                <option value="">--Seleccione--</option>
                {MARCAS.map(m => <option key={m.value} value={m.value}>{m.value}</option>)}
              </select>
              <button type="button" className="ml-2 bg-gray-200 border border-gray-400 px-2 py-1 rounded text-base">📄</button>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[70px]">Doctor:</label>
              <input name="doctor" value={form.doctor} disabled className="border rounded px-2 py-1 flex-1 bg-gray-100 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[90px]">VALOR IGM:</label>
              <input name="valorIgM" value={form.valorIgM} onChange={handleChange} className="border rounded px-2 py-1 flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-base min-w-[90px]">VALOR IGG:</label>
              <input name="valorIgG" value={form.valorIgG} onChange={handleChange} className="border rounded px-2 py-1 flex-1" />
            </div>
          </div>
          {/* Cuadros de técnica IGM e IGG */}
          <div className="flex flex-col gap-4 flex-1 min-w-[260px]">
            <div className="border rounded bg-gray-50 p-4 text-base min-h-[80px]" style={{ minWidth: 220 }}>
              <div className="font-bold mb-1">IGM:</div>
              <div><span className="font-semibold">Tecnica:</span> {selectedMarca.tecnica}</div>
              <div><span className="font-semibold">SENSIBILIDAD:</span> {selectedMarca.sensibilidad}</div>
              <div><span className="font-semibold">ESPECIFICIDAD:</span> {selectedMarca.especificidad}</div>
            </div>
            <div className="border rounded bg-gray-50 p-4 text-base min-h-[80px]" style={{ minWidth: 220 }}>
              <div className="font-bold mb-1">IGG:</div>
              <div><span className="font-semibold">Tecnica:</span> {selectedMarca.tecnica}</div>
              <div><span className="font-semibold">SENSIBILIDAD:</span> {selectedMarca.sensibilidad}</div>
              <div><span className="font-semibold">ESPECIFICIDAD:</span> {selectedMarca.especificidad}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones al final */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 items-center justify-between">
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors">
            <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
          </button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold shadow-md transition-colors" onClick={handleClear}>
            <FontAwesomeIcon icon={faBroom} /> Limpiar
          </button>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-blue-900 text-xs italic">Imprimir</span>
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
  );
}
