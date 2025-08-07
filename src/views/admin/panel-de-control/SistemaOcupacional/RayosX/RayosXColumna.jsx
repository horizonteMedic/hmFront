import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faEraser, 
  faTrash, 
  faEdit,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
import ModalImagenRayosX from './ModalImagenRayosX';
import Swal from "sweetalert2";

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

  const handlePrint = () => {
    if (!form.nroOrden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Reporte?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.nroOrden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí se llamará a la función de impresión
        console.log("Imprimiendo orden:", form.nroOrden);
      }
    });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#fafbfc' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '2rem 0', background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', padding: '2.5rem 2rem' }}>
                 <div className="flex flex-col gap-6">
           <div className="min-w-[420px] w-full text-black">
                           {/* Header con título y botón imprimir */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Radiografia Columna</h1>
                <div className="flex flex-col items-end">
                  <span className="font-bold italic text-base mb-1">IMPRIMIR</span>
                  <div className="flex items-center gap-2">
                    <input
                      name="nroOrden"
                      value={form.nroOrden}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 text-base w-24"
                    />
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-base px-4 py-2 rounded flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                  </div>
                </div>
              </div>
             {/* Sección Aptitud */}
            <div className="border rounded p-4 bg-gray-50 mb-4">
              <div className="flex gap-4 items-center mb-2">
                <label className="font-semibold text-gray-700">N° Orden :</label>
                <input name="nroOrden" value={form.nroOrden} onChange={handleInputChange} className="border rounded px-3 py-2 w-24 bg-yellow-100 text-gray-800 font-medium" />
                <button className="ml-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200">
                  <FontAwesomeIcon icon={faEdit} />
                  Editar/Mostrar
                </button>
                <label className="font-semibold ml-4 text-gray-700">Fecha :</label>
                <input name="fechaExamen" type="date" value={form.fechaExamen} onChange={handleInputChange} className="border rounded px-3 py-2 w-36 bg-gray-100 text-gray-600" />
              </div>
              <div className="mb-3">
                <label className="font-semibold text-gray-700">Nombres y Apellidos :</label>
                <input name="paciente" value={form.paciente} onChange={handleInputChange} className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600 mt-1" />
              </div>
              <div className="flex gap-4 items-center mb-2">
                <label className="font-semibold text-gray-700">DNI :</label>
                <input name="dni" value={form.dni} onChange={handleInputChange} className="border rounded px-3 py-2 w-24 bg-gray-100 text-gray-600" />
                <label className="font-semibold ml-4 text-gray-700">Edad :</label>
                <input name="edad" value={form.edad} onChange={handleInputChange} className="border rounded px-3 py-2 w-20 bg-gray-100 text-gray-600" />
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
             <div className="flex justify-center gap-3 mb-6">
              <button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
                <FontAwesomeIcon icon={faSave} />
                Grabar/Actualizar
              </button>
              <button type="button" onClick={handleClear} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
                <FontAwesomeIcon icon={faEraser} />
                Limpiar
              </button>
              <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
                <FontAwesomeIcon icon={faTrash} />
                Eliminar
              </button>
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
