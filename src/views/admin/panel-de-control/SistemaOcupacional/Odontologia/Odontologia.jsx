import React, { useState } from 'react';
import OdontogramaAdultos from './OdontogramaAdultos';
import OdontologiaReportes from './OdontologiaReportes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faClipboardList, 
  faExpand, 
  faCheck, 
  faTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observacionText, setObservacionText] = useState('');

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setObservacionText('');
  };

  const handleLevantarObservacion = () => {
    if (observacionText.trim()) {
      console.log('Levantando observación:', observacionText);
      // Aquí puedes agregar la lógica para guardar la observación
      closeModal();
    }
  };

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="mx-auto bg-white rounded-lg overflow-hidden relative mt-6">
      <div className="container mx-auto mt-1 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg overflow-hidden w-full mx-auto p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full mx-auto border border-gray-300 p-7 mb-7">
            {/* Primera fila: Nro Orden, Fecha, Botón Levantar Observación */}
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex items-center gap-2" style={{ minWidth: '200px' }}>
                <label className="text-black font-semibold" style={{ fontSize: '12px' }}>
                  Nro Orden:
                </label>
                <input 
                  type="text" 
                  value="96639"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
              
              <div className="flex items-center gap-2 flex-1">
                <label className="text-black font-semibold" style={{ fontSize: '12px' }}>
                  Fecha:
                </label>
                <input 
                  type="text" 
                  value="HUAMACHUCO - lunes 04 noviembre 2024"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
              
              <button 
                onClick={openModal}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition-colors" 
                style={{ fontSize: '12px', minWidth: '200px' }}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2 text-white" /> 
                LEVANTAR OBSERVACION
              </button>
            </div>

            {/* Segunda fila: Nombres */}
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex items-center gap-2 w-full">
                <label className="text-black font-semibold" style={{ fontSize: '12px', minWidth: '80px' }}>
                  Nombres:
                </label>
                <input 
                  type="text" 
                  value="HADY KATHERINE CASTILLO PLASENCIA"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
            </div>

            {/* Tercera fila: Sexo, Edad */}
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex items-center gap-2" style={{ minWidth: '200px' }}>
                <label className="text-black font-semibold" style={{ fontSize: '12px' }}>
                  Sexo:
                </label>
                <input 
                  type="text" 
                  value="FEMENINO"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
              
              <div className="flex items-center gap-2" style={{ minWidth: '150px' }}>
                <label className="text-black font-semibold" style={{ fontSize: '12px' }}>
                  Edad:
                </label>
                <input 
                  type="number" 
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white" 
                  style={{ fontSize: '12px', width: '80px' }}
                />
                <span className="text-black" style={{ fontSize: '12px' }}>años</span>
              </div>
            </div>

            {/* Cuarta fila: Empresa */}
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex items-center gap-2 w-full">
                <label className="text-black font-semibold" style={{ fontSize: '12px', minWidth: '80px' }}>
                  Empresa:
                </label>
                <input 
                  type="text" 
                  value="MINERA BOROO MISQUICHILCA S.A."
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
            </div>

            {/* Quinta fila: Contrata */}
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="flex items-center gap-2 w-full">
                <label className="text-black font-semibold" style={{ fontSize: '12px', minWidth: '80px' }}>
                  Contrata:
                </label>
                <input 
                  type="text" 
                  value="N/A"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-white flex-1" 
                  style={{ fontSize: '12px' }}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex">
            <div 
              className={`cursor-pointer flex items-center py-2 px-4 rounded-tl-lg rounded-tr-lg transition-colors ${
                activeTab === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`} 
              onClick={() => changeTab(1)}
              style={{ fontSize: '13px', fontWeight: 'bold' }}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Odontograma Adultos
            </div>
            <div 
              className={`cursor-pointer flex items-center py-2 px-4 rounded-tl-lg rounded-tr-lg transition-colors ${
                activeTab === 2 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`} 
              onClick={() => changeTab(2)}
              style={{ fontSize: '13px', fontWeight: 'bold' }}
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              Reportes
            </div>
          </div>

          {/* Contenido de los tabs */}
          {activeTab === 1 && <OdontogramaAdultos />}
          {activeTab === 2 && <OdontologiaReportes />}
        </div>
      </div>

      {/* Modal Levantar Observación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-yellow-500" />
                Levantar Observación
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: '13px' }}>
                Observación:
              </label>
              <textarea
                value={observacionText}
                onChange={(e) => setObservacionText(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                rows="4"
                placeholder="Ingrese la observación..."
                style={{ fontSize: '13px' }}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded transition-colors"
                style={{ fontSize: '13px' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLevantarObservacion}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center transition-colors"
                style={{ fontSize: '13px' }}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabComponent;
