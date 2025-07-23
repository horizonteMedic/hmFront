import React, { useState } from 'react';
import OdontogramaAdultos from './OdontogramaAdultos';
import OdontologiaReportes from './OdontologiaReportes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardList, faExpand, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[80%] relative mt-6">
      <div className="azuloscurobackground flex justify-between p-3.5">
        <h1 className="text-start font-bold color-azul text-white">Odontología</h1>
        <div className="flex items-center">
          <button className="naranja-btn px-4 rounded flex items-center" onClick={toggleFullScreen}>
            <FontAwesomeIcon icon={faExpand} className="mr-2" />
            Expandir
          </button>
        </div>
      </div>
      <div className="container mx-auto mt-1 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg overflow-hidden w-full mx-auto p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full mx-auto border border-gray-300 p-7 mb-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
              <div className="flex flex-col">
                <label htmlFor="nroOrden" className="block">Nro Orden:</label>
                <input type="text" id="nroOrden" className="border border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full" />
              </div>
              <div className="flex items-end">
                <button className="naranja-btn text-white font-bold py-2 px-4 rounded flex items-center w-30">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> <span>Editar</span>
                </button>
              </div>
              <div className="flex flex-col">
                <label htmlFor="calendario" className="block">Fecha:</label>
                <input type="date" id="calendario" className="pointer border border-gray-300 rounded-md px-1 py-1 focus:outline-none bg-white w-full" />
              </div>
              <div className="flex items-end">
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded flex items-center w-30">
                  <FontAwesomeIcon icon={faCheck} className="mr-2 " /> <span>Levantar Observación</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
              <div className="flex flex-col">
                <label htmlFor="nombres" className="block">Nombres:</label>
                <input type="text" id="nombres" className="border border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="sexo" className="block">Sexo:</label>
                <select id="sexo" name="sexo" className="border pointer border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full">
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="edad" className="block">Edad:</label>
                <div className="flex">
                  <input type="number" id="edad" className="border border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full" />
                  <span className="ml-2 flex items-center">años</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col">
                <label htmlFor="empresa" className="block">Empresa:</label>
                <select id="empresa" name="empresa" className="border pointer border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="contrata" className="block">Contrata:</label>
                <select id="contrata" name="contrata" className="border pointer border-gray-300 px-1 py-1 rounded-md focus:outline-none bg-white w-full">
                  <option value="">Seleccionar</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className={`cursor-pointer flex items-center py-2 px-4 ${activeTab === 1 ? 'azul-btn' : ''} rounded-tl-lg rounded-tr-lg`} onClick={() => changeTab(1)}>
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Odontograma Adultos
            </div>
            <div className={`cursor-pointer flex items-center py-2 px-4 ${activeTab === 2 ? 'azul-btn' : ''} rounded-tl-lg rounded-tr-lg`} onClick={() => changeTab(2)}>
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              Reportes
            </div>
          </div>
          {activeTab === 1 && <OdontogramaAdultos />}
          {activeTab === 2 && <OdontologiaReportes />}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
