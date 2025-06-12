// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/LaboratorioClinico/Hematologia/Hematologia.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';

const PRUEBAS = [
  'HEMOGLOBINA',
  'HEMATOCRITO',
  'HEMATÍES',
  'Volumen Corpuscular medio',
  'Hemoglobina Corpuscular media',
  'Concentración de la Hemoglobina Corpuscular',
  'LEUCOCITOS',
  'PLAQUETAS'
];

const DIFERENCIAL = [
  'NEUTRÓFILOS (%)',
  'ABASTONADOS (%)',
  'SEGMENTADOS (%)',
  'MONOCITOS (%)',
  'EOSINÓFILOS (%)',
  'BASÓFILOS (%)',
  'LINFOCITOS (%)'
];

export default function Hematologia({ apiBase, token, selectedSede }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    norden: '',
    fecha: today,
    nombres: '',
    edad: '',
    resultados: Array(PRUEBAS.length).fill(''),
    recuentos: Array(DIFERENCIAL.length).fill(''),
    medico: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    setForm(f => ({ ...f, fecha: today }));
  }, [today]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleArrayChange = (key, idx, value) => {
    setForm(f => {
      const arr = f[key].slice();
      arr[idx] = value;
      return { ...f, [key]: arr };
    });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, sede: selectedSede };
      const res = await fetch(`${apiBase}/hematologia`, {
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
    setForm({
      norden: '',
      fecha: today,
      nombres: '',
      edad: '',
      resultados: Array(PRUEBAS.length).fill(''),
      recuentos: Array(DIFERENCIAL.length).fill(''),
      medico: ''
    });
    setStatus('Formulario limpiado');
  };

  const handlePrint = () => {
    window.open(`${apiBase}/hematologia/print?norden=${form.norden}`, '_blank');
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">HEMATOLOGÍA</h2>
      <form className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Nro Ficha:</label>
            <input
              name="norden"
              value={form.norden}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Fecha:</label>
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </div>
        {/* Paciente */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Nombres:</label>
            <input
              name="nombres"
              value={form.nombres}
              disabled
              className="border rounded px-2 py-1 flex-1 bg-gray-100"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="font-semibold min-w-[100px]">Edad:</label>
            <input
              name="edad"
              value={form.edad}
              disabled
              className="border rounded px-2 py-1 w-32 bg-gray-100"
            />
          </div>
        </div>
        {/* Muestra */}
        <div className="font-bold mb-2">MUESTRA: SANGRE TOTAL C/ EDTA</div>
        {/* Resultados y Recuento */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Pruebas */}
          <div>
            <div className="font-bold mb-2">PRUEBAS</div>
            {PRUEBAS.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <span className="flex-1">{label}</span>
                <input
                  value={form.resultados[idx]}
                  onChange={e => handleArrayChange('resultados', idx, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                />
              </div>
            ))}
          </div>
          {/* Recuento Diferencial */}
          <div>
            <div className="font-bold mb-2">RECUENTO DIFERENCIAL</div>
            {DIFERENCIAL.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <span className="flex-1">{label}</span>
                <input
                  value={form.recuentos[idx]}
                  onChange={e => handleArrayChange('recuentos', idx, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Médico */}
        <div className="flex items-center gap-2">
          <label className="font-semibold min-w-[100px]">ASIGNAR MÉDICO:</label>
          <select name="medico" value={form.medico} disabled className="border rounded px-2 py-1 flex-1 bg-gray-100">
            <option value="">-- N/A --</option>
          </select>
        </div>
        {/* Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} /> Guardar/Actualizar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBroom} /> Limpiar
            </button>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold italic">IMPRIMIR</span>
            <div className="flex items-center gap-2 mt-2">
              <input name="printCount" className="border rounded px-2 py-1 w-24" placeholder="Veces" />
              <button
                type="button"
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>
        </div>
      </form>
      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
    </div>
  );
}