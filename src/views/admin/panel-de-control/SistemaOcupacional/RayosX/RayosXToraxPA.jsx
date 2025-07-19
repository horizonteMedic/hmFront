import React, { useState } from 'react';
import ModalImagenRayosX from './ModalImagenRayosX';

const initialForm = {
  nroOrden: '',
  nombres: '',
  apellidos: '',
  edad: '',
  fechaExamen: '',
  vertices: '',
  hilios: '',
  senosCostofrenicos: '',
  camposPulmonares: '',
  tramaBroncovascular: false,
  mediastinos: '',
  siluetaCardiovascular: '',
  osteomuscular: '',
  conclusiones: '',
  observaciones: '',
  evaluacionAnual: false,
};

export default function RayosXToraxPA() {
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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Columna izquierda: Formulario */}
      <div className="min-w-[320px] w-full md:w-1/2 text-black" style={{flexBasis: '50%'}}>
        <form className="space-y-3">
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold">N° Orden :</label>
            <input name="nroOrden" value={form.nroOrden} onChange={handleInputChange} className="border rounded px-2 py-1 w-32 bg-yellow-100" />
          </div>
          <div>
            <label className="font-semibold">Nombres :</label>
            <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Apellidos :</label>
            <input name="apellidos" value={form.apellidos} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold">Edad :</label>
            <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-2 py-1 w-20" />
            <span className="ml-1">años</span>
            <label className="font-semibold ml-4">Fecha Examen :</label>
            <input name="fechaExamen" type="date" value={form.fechaExamen} onChange={handleInputChange} className="border rounded px-2 py-1 w-40" />
          </div>
          <div>
            <label className="font-semibold">Vértices :</label>
            <input name="vertices" value={form.vertices} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Hilios :</label>
            <input name="hilios" value={form.hilios} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Senos Costofrénicos :</label>
            <input name="senosCostofrenicos" value={form.senosCostofrenicos} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Campos Pulmonares :</label>
            <input name="camposPulmonares" value={form.camposPulmonares} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
            <label className="ml-2 text-xs block"><input type="checkbox" name="tramaBroncovascular" checked={form.tramaBroncovascular} onChange={handleInputChange} className="mr-1" />TRAMA BRONCOVASCULAR ACENTUADA EN ACP</label>
          </div>
          <div>
            <label className="font-semibold">Mediastinos :</label>
            <input name="mediastinos" value={form.mediastinos} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Silueta Cardiovascular :</label>
            <input name="siluetaCardiovascular" value={form.siluetaCardiovascular} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Osteomuscular :</label>
            <input name="osteomuscular" value={form.osteomuscular} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Conclusiones Radiográficas:</label>
            <input name="conclusiones" value={form.conclusiones} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="font-semibold">Observaciones:</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleInputChange} className="border rounded px-2 py-1 w-full" rows={3} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="evaluacionAnual" checked={form.evaluacionAnual} onChange={handleInputChange} className="mr-1" /> Evaluación Anual
          </div>
          <div className="flex gap-4 justify-start mt-4">
            <button type="button" className="bg-gray-200 px-3 py-1 rounded" onClick={() => setShowModal(true)}>IMAGEN...</button>
            <button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm">Agregar/Actualizar</button>
            <button type="button" onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded inline-flex items-center gap-2 text-sm">Limpiar</button>
          </div>
        </form>
        {showModal && (
          <ModalImagenRayosX onClose={() => setShowModal(false)} datos={form} />
        )}
      </div>
      {/* Columna derecha: Panel de historial/búsqueda (placeholder) */}
      <div className="bg-gray-50 border rounded p-4 flex flex-col min-w-[320px] w-full md:w-1/2 text-black" style={{flexBasis: '50%', maxWidth: '100%'}}>
        <div className="mb-2 font-semibold">Buscar por Nombre</div>
        <div className="flex gap-2 mb-2">
          <input className="border rounded px-2 py-1 flex-1" placeholder="Nombre" />
          <label className="font-semibold ml-2">Codigo:</label>
          <input className="border rounded px-2 py-1 w-20" />
        </div>
        <div className="mb-2">
          <div className="font-semibold border-b">Informe de Examen</div>
          <div className="border rounded bg-white min-h-[120px] h-32 mt-1 mb-2"></div>
        </div>
        <div className="mb-2 font-semibold">Reportes por Fechas</div>
        <div className="flex gap-2 mb-2">
          <label className="font-semibold">Desde:</label>
          <input type="date" className="border rounded px-2 py-1" />
          <label className="font-semibold ml-2">Hasta:</label>
          <input type="date" className="border rounded px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="font-semibold">Filtrar por :</label>
          <label className="ml-2"><input type="checkbox" className="mr-1" />Externos</label>
          <label className="ml-2"><input type="checkbox" className="mr-1" />Ocupacionales</label>
          <button className="ml-4 bg-blue-500 text-white px-3 py-1 rounded">Ejecutar Consulta</button>
        </div>
        <div className="mb-2">
          <label className="block"><input type="checkbox" className="mr-1" />NO SE TOMO RX DE TORAX</label>
          <label className="block"><input type="checkbox" className="mr-1" />NO SE TOMO RADIOGRAFIA DE TORAX PORQUE COLABORADOR PASO EXAMEN….</label>
          <label className="block"><input type="checkbox" className="mr-1" />HACIENDOSE RESPONSABLE POR NO PASAR ESTE EXAMEN</label>
          <label className="block"><input type="checkbox" className="mr-1" />EVALUADO POR NEUMOLOGO</label>
        </div>
      </div>
    </div>
  );
} 