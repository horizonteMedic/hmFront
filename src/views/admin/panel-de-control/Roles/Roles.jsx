// views/admin/panel-de-control/Roles.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalNuevoRol/Modal'; 
import {getFetch} from '../getFetch/getFetch'

const Roles = () => {

  {/*fetch get
  const { data } = getFetch('URL API')
  */}
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
      
        <h1 className="text-center text-2xl font-bold mb-4 color-azul sombreado-gris-oscuro">Roles</h1>
        <div className="flex justify-between items-center mb-4">
        <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input type="text" id="search" className="border border-gray-300 px-10 py-2 rounded-md w-48 focus:outline-none" placeholder="Buscar" />
          </div>
          <button onClick={openModal} className="flex items-center px-4 py-2 azul-btn rounded-md">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar
          </button>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
                <th className="border border-gray-300 px-2 py-1">Descripción</th>
                <th className="border border-gray-300 px-2 py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">1</td>
                <td className="border border-gray-300 px-2 py-1">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-2 cursor-pointer" />
                  <FontAwesomeIcon icon={faCog} className="text-green-500 cursor-pointer" />
                </td>
                <td className="border border-gray-300 px-2 py-1">DNI</td>
                <td className="border border-gray-300 px-2 py-1">12345678</td>
                <td className="border border-gray-300 px-2 py-1 bg-green-300">Activo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
    
  );
};

export default Roles;
