import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';

import Modal from './ModalRegistroEmpleado/Modal';
import EditModal from './ModalEditUsuario/EditModal';
import ConfigurarAccesosModal from './ModalConfigUsuario/Modalconfig'; 
import RegistroUsuarioModal from './ModalRegistroUsuario/ModalRegistroUsuario'; 

import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
const Accesos = () => {

  const token = useAuthStore(state => state.token);

  //Consulta de la API
  const {data, loading} = getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/st/empleado',token)
  
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

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        
        <h1 className="text-center text-2xl font-bold mb-4 color-azul sombreado-gris-oscuro">Usuarios</h1>
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
                <th className="border border-gray-300 px-2 py-1">Apellidos</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
                <th className="border border-gray-300 px-2 py-1">Usuario</th>
                <th className="border border-gray-300 px-2 py-1">Rol</th>
                <th className="border border-gray-300 px-2 py-1">Vigente</th>
              </tr>
            </thead>
            <tbody>
            {data?.map((item, index) => (
                <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-2 cursor-pointer" onClick={openEditModal} />
                  <FontAwesomeIcon icon={faCog} className="text-green-500 cursor-pointer" onClick={openConfigurarAccesosModal} />
                </td>
                <td className="border border-gray-300 px-2 py-1">{item.tipoDoc}</td>
                <td className="border border-gray-300 px-2 py-1">{item.numDocumento}</td>
                <td className="border border-gray-300 px-2 py-1">{item.apellidos}</td>
                <td className="border border-gray-300 px-2 py-1">{item.nombres}</td>
                <td className="border border-gray-300 px-2 py-1">johndoe</td>
                <td className="border border-gray-300 px-2 py-1">{item.cargo}</td>
                <td className={`justify-center flex  px-2 py-1  ${item.estado ? 'bg-green-300' : 'bg-red-300'}`}><strong>{item.estado ? 'Activo' : 'Inactivo'}</strong></td>
              </tr>
              ))}
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
