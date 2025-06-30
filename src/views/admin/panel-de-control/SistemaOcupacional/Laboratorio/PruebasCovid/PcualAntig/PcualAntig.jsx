// src/views/admin/panel-de-control/SistemaOcupacional/Laboratorio/PruebasCovid/PcualAntig/PcualAntig.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBroom, faPrint } from '@fortawesome/free-solid-svg-icons';
import { VerifyTR } from '../PcuanAntigenos/controllerPCuantAntigenos';

const sintomasList = [
  'Tos','Dolor de garganta','Congestión nasal','Dificultad respiratoria',
  'Fiebre/Escalofrío','Malestar general','Pérdida olfato o gusto',
  'Diarrea','Náuseas/vómitos','Cefalea','Irritabilidad/confusión',
  'Dolor','Expectoración'
];

const DEFAULT_METODO = {
  metodo: 'Inmunocromatografía',
  sensibilidad: '94.55%',
  especificidad: '100.00%'
};

  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  const tabla = 'examen_inmunologico'

export default function PcualAntig({ token, selectedSede }) {

  const [form, setForm] = useState({
    norden: '',
    fecha: today,
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
  const nombreInputRef = useRef(null);

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

  const handleClear = (boolean) => {
    if (boolean = true) {
      setForm(({
      norden: '',
        fecha: today,
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
      }));
      setStatus('Formulario limpiado');
    } else {
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
    }
    
  };

  const handlePrint = () => {
    window.open(`${apiBase}/pcualantig/print?norden=${form.norden}`, '_blank');
  };
  console.log(form)
  return (
    <form className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow text-base" onSubmit={e=>{e.preventDefault();handleSave();}}>
      <div className="text-2xl font-bold text-center mb-8">COVID-19 Prueba Cualitativa (Antígenos)</div>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">N° Orden :</label>
          <input name="norden" value={form.norden} onChange={handleChange} className="border rounded px-3 py-2 w-40 text-base" 
          onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleClear(false);
            VerifyTR(form.norden, tabla, token, setForm, selectedSede);
          }
        }}/>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-base">Fecha :</label>
          <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className="border rounded px-3 py-2 w-44 text-base" />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <input type="checkbox" name="marsa" checked={form.marsa} onChange={handleChange} className="scale-110" />
          <span className="font-semibold text-red-600">MARSA</span>
        </div>
      </div>
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

      {/* Marca y Doctor + Panel método */}
      <div className="flex flex-wrap gap-6 items-start mb-6">
        <div className="flex flex-col gap-4 flex-1 min-w-[260px]">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base min-w-[70px]">MARCA:</label>
            <select name="marca" value={form.marca} onChange={handleChange} className="border rounded px-2 py-1 flex-1">
              <option value="">--Seleccione--</option>
              <option>RAPID RESPONSE COVID-19 IGM/IGG TEST CASSETTE</option>
              <option>OTRA MARCA</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-base min-w-[70px]">Doctor:</label>
            <input name="doctor" value={form.doctor} disabled className="border rounded px-2 py-1 flex-1 bg-gray-100 cursor-not-allowed" />
          </div>
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="border rounded bg-gray-50 p-4 text-base min-h-[80px]" style={{ minWidth: 220 }}>
            <div><span className="font-semibold">Método:</span> {DEFAULT_METODO.metodo}</div>
            <div><span className="font-semibold">Sensibilidad:</span> {DEFAULT_METODO.sensibilidad}</div>
            <div><span className="font-semibold">Especificidad:</span> {DEFAULT_METODO.especificidad}</div>
          </div>
        </div>
      </div>

      {/* Positivo / Negativo */}
      <div className="flex gap-8 mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="positivo" checked={form.positivo} onChange={handleChange} />
          <span className="font-semibold">Positivo</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="negativo" checked={form.negativo} onChange={handleChange} />
          <span className="font-semibold">Negativo</span>
        </label>
      </div>

      {/* Fecha de síntomas */}
      <div className="flex items-center gap-2 mb-4">
        <label className="min-w-[140px] font-semibold">Fecha Síntomas:</label>
        <input type="date" name="fechaSintomas" value={form.fechaSintomas} onChange={handleChange} className="border rounded px-2 py-1 flex-1" />
      </div>

      {/* Síntomas */}
      <fieldset className="border rounded p-4 mb-4 flex flex-col">
        <legend className="font-bold mb-2">Síntomas</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-base">
          {sintomasList.map(s => (
            <label key={s} className="flex items-center gap-2">
              <input type="checkbox" name="sintomas" value={s} checked={form.sintomas.includes(s)} onChange={handleChange} />
              {s}
            </label>
          ))}
        </div>
        <label className="mt-4 block font-semibold text-base mb-1">
          Observaciones:
        </label>
        <textarea type="text" className="border rounded px-2 py-1 text-base w-full" rows={4} />
      </fieldset>

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
  );
}
