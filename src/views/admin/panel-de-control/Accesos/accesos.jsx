import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faCog, faUsers } from '@fortawesome/free-solid-svg-icons';

import Modal from './ModalRegistroEmpleado/Modal';
import EditModal from './ModalEditUsuario/EditModal';
import ConfigurarAccesosModal from './ModalConfigUsuario/Modalconfig'; 
import RegistroUsuarioModal from './ModalRegistroUsuario/ModalRegistroUsuario'; 
import UsersModal from './ModalViewUser/ModalViewUser';

import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import deleteEmpleado from '../Accesos/model/DeleteEmpleado'; // Importa la función deleteEmpleado

const Accesos = () => {
  const token = useAuthStore(state => state.token);
  //Consulta de la API
  const {data, loading} = getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/st/empleado',token)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfigurarAccesosModalOpen, setIsConfigurarAccesosModalOpen] = useState(false);
  const [isRegistroUsuarioModalOpen, setIsRegistroUsuarioModalOpen] = useState(false); // Nuevo estado para el modal de registro de usuario
  const [isViewUsersModalOpen, SetIsViewUsersModalOpen] = useState(false)

  const [idEmpleado, SetIdEmpleado] = useState('')
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

  const OpenViewUsersModal = (id) => {
    
    SetIdEmpleado(id)
    isViewUsersModalOpen ? SetIsViewUsersModalOpen(false) : SetIsViewUsersModalOpen(true)
  }

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Usuarios con Accesos</h1>
        </div>
        <div className="flex justify-between p-6">
          <h2 className="text-lg font-semibold">Empleados Registrados</h2>
          <div className="flex">
            <button className="naranja-btn px-4 py-2 rounded-md mr-2" onClick={openModal}>+ Registrar Empleado</button>
            <button className="azul-btn px-4 py-2 rounded-md" onClick={openRegistroUsuarioModal}>+ Registrar Usuario</button>
          </div>
        </div>

        <div className="overflow-x-auto mb-4 p-3">
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Tipo Doc.</th>
                <th className="border border-gray-300 px-2 py-1">Número</th>
                <th className="border border-gray-300 px-2 py-1">Apellidos</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
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
                  <FontAwesomeIcon icon={faCog} className="text-green-500 mr-2 cursor-pointer" onClick={openConfigurarAccesosModal} />
                  <FontAwesomeIcon icon={faUsers} className="text-orange-500 cursor-pointer" onClick={() => OpenViewUsersModal(item.id_empleado)} />
                </td>
                <td className="border border-gray-300 px-2 py-1">{item.tipoDoc}</td>
                <td className="border border-gray-300 px-2 py-1">{item.numDocumento}</td>
                <td className="border border-gray-300 px-2 py-1">{item.apellidos}</td>
                <td className="border border-gray-300 px-2 py-1">{item.nombres}</td>
                <td className="border border-gray-300 px-2 py-1">{item.cargo}</td>
                <td className={`justify-center flex  px-2 py-1  ${item.estado ? 'bg-green-300' : 'bg-red-300'}`}><strong>{item.estado ? 'Activo' : 'Inactivo'}</strong></td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Asegúrate de que los modales estén configurados correctamente */}
      {isModalOpen && <Modal closeModal={closeModal} />}
      {isEditModalOpen && <EditModal closeModal={closeEditModal} />}
      {isConfigurarAccesosModalOpen && <ConfigurarAccesosModal closeModal={closeConfigurarAccesosModal} />}
      {isRegistroUsuarioModalOpen && <RegistroUsuarioModal closeModal={closeRegistroUsuarioModal} />}
      {isViewUsersModalOpen && <UsersModal closeModal={OpenViewUsersModal} idEmpleado={idEmpleado} token={token}/>}

    </div>
  );
};

export default Accesos;
