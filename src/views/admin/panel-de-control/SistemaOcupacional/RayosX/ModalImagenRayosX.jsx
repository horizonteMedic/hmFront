import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUpload, 
  faDownload, 
  faSave, 
  faEraser, 
  faTrash, 
  faEdit
} from '@fortawesome/free-solid-svg-icons';

export default function ModalImagenRayosX({ onClose, datos }) {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 min-w-[700px] relative max-w-lg w-full border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Aptitud</h2>
        
        <div className="mb-4 border rounded-lg p-4 bg-gray-50 shadow-sm">
          <div className="flex gap-4 items-center mb-3">
            <label className="font-semibold text-gray-700">N° Orden :</label>
            <input 
              value={datos.nroOrden || ''} 
              readOnly 
              className="border rounded px-3 py-2 w-24 bg-yellow-100 text-gray-800 font-medium" 
            />
            <label className="font-semibold ml-4 text-gray-700">Fecha :</label>
            <input 
              value={datos.fechaExamen || ''} 
              readOnly 
              className="border rounded px-3 py-2 w-36 bg-gray-100 text-gray-600" 
            />
            <button className="ml-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200">
              <FontAwesomeIcon icon={faEdit} />
              Editar/Mostrar
            </button>
          </div>
          
          <div className="mb-3">
            <label className="font-semibold text-gray-700">Nombres y Apellidos :</label>
            <input 
              value={datos.nombres || ''} 
              readOnly 
              className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600 mt-1" 
            />
          </div>
          
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold text-gray-700">DNI :</label>
            <input 
              value={datos.dni || ''} 
              readOnly 
              className="border rounded px-3 py-2 w-24 bg-gray-100 text-gray-600" 
            />
            <label className="font-semibold ml-4 text-gray-700">Edad :</label>
            <input 
              value={datos.edad || ''} 
              readOnly 
              className="border rounded px-3 py-2 w-20 bg-gray-100 text-gray-600" 
            />
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faUpload} />
            Cargar Imagen
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faDownload} />
            Descargar
          </button>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faSave} />
            Grabar/Actualizar
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faEraser} />
            Limpiar
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200">
            <FontAwesomeIcon icon={faTrash} />
            Eliminar
          </button>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

ModalImagenRayosX.propTypes = {
  onClose: PropTypes.func.isRequired,
  datos: PropTypes.shape({
    nroOrden: PropTypes.string,
    fechaExamen: PropTypes.string,
    nombres: PropTypes.string,
    dni: PropTypes.string,
    edad: PropTypes.string
  }).isRequired
}; 