import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSave, faEraser } from '@fortawesome/free-solid-svg-icons';
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

  // Referencias para los campos
  const hiliosRef = useRef(null);
  const senosCostofrenicosRef = useRef(null);
  const camposPulmonaresRef = useRef(null);
  const mediastinosRef = useRef(null);
  const siluetaCardiovascularRef = useRef(null);
  const osteomuscularRef = useRef(null);
  const conclusionesRef = useRef(null);
  const observacionesRef = useRef(null);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === 'checkbox' ? checked : value);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  const handleSave = () => {
    // Integración futura con la API
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Columna izquierda: Formulario */}
      <div className="min-w-[320px] w-full md:w-1/2 text-black flex-1">
        <form className="space-y-3">

          <div className="flex flex-col mb-2">
            <label className="font-semibold">N° Orden :</label>
            <input name="nroOrden" value={form.nroOrden} onChange={handleInputChange} className="border rounded px-2 py-1 w-32 bg-yellow-100" />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Nombres :</label>
            <input name="nombres" value={form.nombres} onChange={handleInputChange} className="border rounded px-2 py-1 bg-white" />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Apellidos :</label>
            <input name="apellidos" value={form.apellidos} onChange={handleInputChange} className="border rounded px-2 py-1 bg-white" />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Edad :</label>
            <div className="flex items-center gap-2">
              <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-2 py-1 w-20 bg-white" />
              <span className="ml-1">años</span>
            </div>
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Fecha Examen :</label>
            <input name="fechaExamen" type="date" value={form.fechaExamen} onChange={handleInputChange} className="border rounded px-2 py-1 w-40 bg-white" />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Vértices :</label>
            <input 
              name="vertices" 
              value={form.vertices} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, hiliosRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Hilios :</label>
            <input 
              ref={hiliosRef}
              name="hilios" 
              value={form.hilios} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, senosCostofrenicosRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Senos Costofrénicos :</label>
            <input 
              ref={senosCostofrenicosRef}
              name="senosCostofrenicos" 
              value={form.senosCostofrenicos} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, camposPulmonaresRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Campos Pulmonares :</label>
            <input 
              ref={camposPulmonaresRef}
              name="camposPulmonares" 
              value={form.camposPulmonares} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, mediastinosRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="ml-2 mb-2">
            <label className="text-md block ">
              <input type="checkbox" name="tramaBroncovascular" checked={form.tramaBroncovascular} onChange={handleInputChange} className="mr-1" />
              TRAMA BRONCOVASCULAR ACENTUADA EN ACP
            </label>
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Mediastinos :</label>
            <input 
              ref={mediastinosRef}
              name="mediastinos" 
              value={form.mediastinos} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, siluetaCardiovascularRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Silueta Cardiovascular :</label>
            <input 
              ref={siluetaCardiovascularRef}
              name="siluetaCardiovascular" 
              value={form.siluetaCardiovascular} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, osteomuscularRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Osteomuscular :</label>
            <input 
              ref={osteomuscularRef}
              name="osteomuscular" 
              value={form.osteomuscular} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, conclusionesRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Conclusiones Radiográficas:</label>
            <input 
              ref={conclusionesRef}
              name="conclusiones" 
              value={form.conclusiones} 
              onChange={handleInputChange} 
              onKeyDown={(e) => handleKeyDown(e, observacionesRef)}
              className="border rounded px-2 py-1 bg-blue-50" 
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="font-semibold">Observaciones:</label>
            <textarea 
              ref={observacionesRef}
              name="observaciones" 
              value={form.observaciones} 
              onChange={handleInputChange} 
              className="border rounded px-2 py-1 resize-none bg-blue-50" 
              rows={3} 
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="evaluacionAnual" checked={form.evaluacionAnual} onChange={handleInputChange} className="mr-1" />
            Evaluación Anual
          </div>

          <div className="flex gap-4 justify-start mt-4">
            <button type="button" className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors duration-200 flex items-center gap-2" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faImage} />
              IMAGEN...
            </button>
            <button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 font-semibold rounded inline-flex items-center gap-2 text-md transition-colors duration-200">
              <FontAwesomeIcon icon={faSave} />
              Agregar/Actualizar
            </button>
            <button type="button" onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 font-semibold rounded inline-flex items-center gap-2 text-md transition-colors duration-200">
              <FontAwesomeIcon icon={faEraser} />
              Limpiar
            </button>
          </div>
        </form>

        {showModal && (
          <ModalImagenRayosX onClose={() => setShowModal(false)} datos={form} />
        )}
      </div>
      {/* Columna derecha: Panel de historial/búsqueda */}
      <div className="bg-gray-50 border rounded p-4 flex flex-col flex-1 text-black">
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
          <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200">Ejecutar Consulta</button>
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