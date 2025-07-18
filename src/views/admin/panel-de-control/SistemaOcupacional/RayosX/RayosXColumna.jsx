import React, { useState } from 'react';
import ModalImagenRayosX from './ModalImagenRayosX';

const initialForm = {
  nroOrden: '',
  fechaExamen: '',
  paciente: '',
  dni: '',
  edad: '',
  lumbar: false,
  lumbosacro: false,
  dorsolumbar: false,
  informe: '',
  conclusion: '',
};

export default function RayosXColumna() {
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);

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
    // Aquí se integrará con la API en el futuro
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#fafbfc' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '2rem 0', background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', padding: '2.5rem 2rem' }}>
        <div className="flex flex-col gap-6">
          <div className="min-w-[420px] w-full text-black">
            {/* Sección Aptitud */}
            <div className="border rounded p-4 bg-gray-50 mb-4">
              <div className="flex gap-4 items-center mb-2">
                <label className="font-semibold">N° Orden :</label>
                <input name="nroOrden" value={form.nroOrden} onChange={handleInputChange} className="border rounded px-2 py-1 w-24 bg-yellow-100" />
                <button className="ml-2 px-2 py-1 bg-gray-200 rounded flex items-center text-sm">Editar/Mostrar</button>
                <label className="font-semibold ml-4">Fecha :</label>
                <input name="fechaExamen" type="date" value={form.fechaExamen} onChange={handleInputChange} className="border rounded px-2 py-1 w-36" />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Nombres y Apellidos :</label>
                <input name="paciente" value={form.paciente} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
              </div>
              <div className="flex gap-4 items-center mb-2">
                <label className="font-semibold">DNI :</label>
                <input name="dni" value={form.dni} onChange={handleInputChange} className="border rounded px-2 py-1 w-24" />
                <label className="font-semibold ml-4">Edad :</label>
                <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-2 py-1 w-20" />
              </div>
            </div>
            {/* Sección Radiografía de Columna */}
            <div className="border rounded p-4 bg-white mb-4">
              <div className="font-bold mb-2">RADIOGRAFÍA DE COLUMNA</div>
              <div className="flex gap-6 mb-2">
                <label className="flex items-center gap-1"><input type="checkbox" name="lumbar" checked={form.lumbar} onChange={handleInputChange} />LUMBAR</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="lumbosacro" checked={form.lumbosacro} onChange={handleInputChange} />LUMBOSACRO</label>
                <label className="flex items-center gap-1"><input type="checkbox" name="dorsolumbar" checked={form.dorsolumbar} onChange={handleInputChange} />DORSOLUMBAR</label>
              </div>
              <div className="mb-2">
                <label className="font-semibold">INFORME:</label>
                <textarea name="informe" value={form.informe} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" rows={5} />
              </div>
              <div className="mb-2">
                <label className="font-semibold">CONCLUSIÓN :</label>
                <textarea name="conclusion" value={form.conclusion} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" rows={2} />
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowModal(true)}>Cargar Imagen</button>
              <button type="button" className="bg-gray-200 px-4 py-2 rounded">Descargar</button>
            </div>
            <div className="flex gap-4 mb-4">
              <button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Guardar/Actualizar</button>
              <button type="button" onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">Limpiar</button>
              <button type="button" className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Eliminar</button>
            </div>
            {showModal && (
              <ModalImagenRayosX onClose={() => setShowModal(false)} datos={form} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
