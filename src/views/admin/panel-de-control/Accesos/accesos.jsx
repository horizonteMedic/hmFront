import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';

import Modal from './ModalRegistroEmpleado/Modal';
import EditModal from './ModalEditUsuario/EditModal';
import ConfigurarAccesosModal from './ModalConfigUsuario/Modalconfig'; 
import RegistroUsuarioModal from './ModalRegistroUsuario/ModalRegistroUsuario'; 

import { getFetch } from '../getFetch/getFetch';
const Accesos = () => {

  {/*fetch get
  const { data } = getFetch('URL API')
  */}
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfigurarAccesosModalOpen, setIsConfigurarAccesosModalOpen] = useState(false);
  const [isRegistroUsuarioModalOpen, setIsRegistroUsuarioModalOpen] = useState(false); // Nuevo estado para el modal de registro de usuario
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openConfigurarAccesosModal = () => { // Función para abrir el modal de configuración
    setIsConfigurarAccesosModalOpen(true);
  };

  const closeConfigurarAccesosModal = () => { // Función para cerrar el modal de configuración
    setIsConfigurarAccesosModalOpen(false);
  };
  
  const openRegistroUsuarioModal = () => {
    setIsRegistroUsuarioModalOpen(true);
  };
  
  const closeRegistroUsuarioModal = () => {
    setIsRegistroUsuarioModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        
        <h1 className="text-center text-2xl font-bold mb-4 color-azul">Usuarios</h1>
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Empleados Registrados</h2>
          <div className="flex">
            <button className="naranja-btn px-4 py-2 rounded-md mr-2" onClick={openModal}>+ Registrar Empleado</button>
            <button className="azul-btn px-4 py-2 rounded-md" onClick={openRegistroUsuarioModal}>+ Registrar Usuario</button>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Tipo Doc.</th>
                <th className="border border-gray-300 px-2 py-1">Número</th>
                <th className="border border-gray-300 px-2 py-1">Apellido Paterno</th>
                <th className="border border-gray-300 px-2 py-1">Apellido Materno</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
                <th className="border border-gray-300 px-2 py-1">Usuario</th>
                <th className="border border-gray-300 px-2 py-1">Rol</th>
                <th className="border border-gray-300 px-2 py-1">Vigente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">1</td>
                <td className="border border-gray-300 px-2 py-1">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-2 cursor-pointer" onClick={openEditModal} />
                  <FontAwesomeIcon icon={faCog} className="text-green-500 cursor-pointer" onClick={openConfigurarAccesosModal} />
                </td>
                <td className="border border-gray-300 px-2 py-1">DNI</td>
                <td className="border border-gray-300 px-2 py-1">12345678</td>
                <td className="border border-gray-300 px-2 py-1">Doe</td>
                <td className="border border-gray-300 px-2 py-1">Smith</td>
                <td className="border border-gray-300 px-2 py-1">John</td>
                <td className="border border-gray-300 px-2 py-1">johndoe</td>
                <td className="border border-gray-300 px-2 py-1">Admin</td>
                <td className=" justify-center flex  px-2 py-1 inline-block sombreado-verde"><strong>Sí</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
      {isEditModalOpen && <EditModal closeModal={closeEditModal} />}
      {isConfigurarAccesosModalOpen && <ConfigurarAccesosModal closeModal={closeConfigurarAccesosModal} />} {/* Renderiza el modal de configuración cuando el estado es true */}
      {isRegistroUsuarioModalOpen && <RegistroUsuarioModal closeModal={closeRegistroUsuarioModal} />}

    </div>
    
  );
};

export default Accesos;
