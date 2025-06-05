import React, { useState } from 'react';

const initialSample = {
  color: '',
  aspecto: '',
  mocoFecal: '',
  grasa: '',
  sangreVisible: '',
  restosAlimenticios: '',
  leucocitos: '',
  hematies: '',
  invParasit: '',
  obsLeucocitos: false,
  obsHematies: false,
  invParasitAusente: false,
  invParasitPresente: false,
};

const ParasitologiaCoprologico = () => {
  const [form, setForm] = useState({
    nroficha: '',
    fecha: '',
    nombres: '',
    edad: '',
    muestras: [
      { ...initialSample },
      { ...initialSample },
      { ...initialSample },
    ],
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMuestraChange = (idx, field, value) => {
    const updated = [...form.muestras];
    updated[idx][field] = value;
    setForm({ ...form, muestras: updated });
  };

  const handleCheckChange = (idx, field) => {
    const updated = [...form.muestras];
    updated[idx][field] = !updated[idx][field];
    setForm({ ...form, muestras: updated });
  };

  const handleLimpiar = () => {
    setForm({
      nroficha: '',
      fecha: '',
      nombres: '',
      edad: '',
      muestras: [
        { ...initialSample },
        { ...initialSample },
        { ...initialSample },
      ],
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-700">COPROPARASITOLOGICO</h2>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nro Ficha:</label>
            <input name="nroficha" value={form.nroficha} onChange={handleInputChange} className="border rounded px-2 py-1 flex-1" />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Fecha:</label>
            <input name="fecha" type="date" value={form.fecha} onChange={handleInputChange} className="border rounded px-2 py-1 flex-1" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold min-w-[90px]">Nombres:</label>
            <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-2 py-1 flex-1" />
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <label className="font-semibold">Edad:</label>
            <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-2 py-1 w-24" />
          </div>
        </div>
        <div className="flex flex-wrap gap-8 mb-8 justify-center">
          {[0, 1, 2].map(idx => (
            <div key={idx} className="bg-gray-50 border rounded p-4 min-w-[260px] flex-1">
              <div className="font-bold text-base mb-2 text-center text-blue-900">MUESTRA: HECES {idx + 1}</div>
              <div className="mb-2">
                <label className="block text-base">Color:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].color === 'MARRON'} onChange={() => handleMuestraChange(idx, 'color', 'MARRON')} /> MARRON</label>
                  <label><input type="checkbox" checked={form.muestras[idx].color === 'MOSTAZA'} onChange={() => handleMuestraChange(idx, 'color', 'MOSTAZA')} /> MOSTAZA</label>
                  <label><input type="checkbox" checked={form.muestras[idx].color === 'VERDOSO'} onChange={() => handleMuestraChange(idx, 'color', 'VERDOSO')} /> VERDOSO</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Aspecto:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].aspecto === 'SOLIDO'} onChange={() => handleMuestraChange(idx, 'aspecto', 'SOLIDO')} /> SOLIDO</label>
                  <label><input type="checkbox" checked={form.muestras[idx].aspecto === 'SEMISOLIDO'} onChange={() => handleMuestraChange(idx, 'aspecto', 'SEMISOLIDO')} /> SEMISOLIDO</label>
                  <label><input type="checkbox" checked={form.muestras[idx].aspecto === 'DIARREICO'} onChange={() => handleMuestraChange(idx, 'aspecto', 'DIARREICO')} /> DIARREICO</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Moco Fecal:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].mocoFecal === 'AUSENTE'} onChange={() => handleMuestraChange(idx, 'mocoFecal', 'AUSENTE')} /> AUSENTE</label>
                  <label><input type="checkbox" checked={form.muestras[idx].mocoFecal === 'PRESENTE'} onChange={() => handleMuestraChange(idx, 'mocoFecal', 'PRESENTE')} /> PRESENTE</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Grasa:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].grasa === 'AUSENTE'} onChange={() => handleMuestraChange(idx, 'grasa', 'AUSENTE')} /> AUSENTE</label>
                  <label><input type="checkbox" checked={form.muestras[idx].grasa === 'PRESENTE'} onChange={() => handleMuestraChange(idx, 'grasa', 'PRESENTE')} /> PRESENTE</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Sangre Visible:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].sangreVisible === 'AUSENTE'} onChange={() => handleMuestraChange(idx, 'sangreVisible', 'AUSENTE')} /> AUSENTE</label>
                  <label><input type="checkbox" checked={form.muestras[idx].sangreVisible === 'PRESENTE'} onChange={() => handleMuestraChange(idx, 'sangreVisible', 'PRESENTE')} /> PRESENTE</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Restos Alimenticios:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].restosAlimenticios === 'AUSENTE'} onChange={() => handleMuestraChange(idx, 'restosAlimenticios', 'AUSENTE')} /> AUSENTE</label>
                  <label><input type="checkbox" checked={form.muestras[idx].restosAlimenticios === 'PRESENTE'} onChange={() => handleMuestraChange(idx, 'restosAlimenticios', 'PRESENTE')} /> PRESENTE</label>
                </div>
              </div>
              <div className="mt-4 font-bold text-blue-900">EXAMEN MICROSCOPICO {idx + 1}</div>
              <div className="mb-2">
                <label className="block text-base">Leucocitos:</label>
                <input className="border rounded px-2 py-1 w-full text-base" value={form.muestras[idx].leucocitos} onChange={e => handleMuestraChange(idx, 'leucocitos', e.target.value)} />
                <div className="flex gap-2 mt-1">
                  <label><input type="checkbox" checked={form.muestras[idx].obsLeucocitos} onChange={() => handleCheckChange(idx, 'obsLeucocitos')} /> No se observan</label>
                  <label><input type="checkbox" checked={form.muestras[idx].leucocitos !== ''} disabled /> ___x campo</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Hematíes:</label>
                <input className="border rounded px-2 py-1 w-full text-base" value={form.muestras[idx].hematies} onChange={e => handleMuestraChange(idx, 'hematies', e.target.value)} />
                <div className="flex gap-2 mt-1">
                  <label><input type="checkbox" checked={form.muestras[idx].obsHematies} onChange={() => handleCheckChange(idx, 'obsHematies')} /> No se observan</label>
                  <label><input type="checkbox" checked={form.muestras[idx].hematies !== ''} disabled /> ___x campo</label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-base">Inv. Parásitos:</label>
                <div className="flex gap-2">
                  <label><input type="checkbox" checked={form.muestras[idx].invParasitAusente} onChange={() => handleCheckChange(idx, 'invParasitAusente')} /> AUSENTE</label>
                  <label><input type="checkbox" checked={form.muestras[idx].invParasitPresente} onChange={() => handleCheckChange(idx, 'invParasitPresente')} /> PRESENTE</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center mt-6">
          <button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">Guardar/Actualizar</button>
          <button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold" onClick={handleLimpiar}>Limpiar</button>
        </div>
      </form>
    </div>
  );
};

export default ParasitologiaCoprologico; 