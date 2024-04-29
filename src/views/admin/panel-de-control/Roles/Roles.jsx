// views/admin/panel-de-control/Roles.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalNuevoRol/Modal'; 
import {getFetch} from '../getFetch/getFetch'
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import EditModal from './ModalNuevoRol/EditRol';
import Swal from 'sweetalert2'
import DeleteRol from './model/DeleteRol';

const Roles = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false)


  //Para Editar
  const [id, setId] = useState('');
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const [fechainicio, setFechainicio] = useState('');
  const [userRegistro, setUserRegistro] = useState('');

  const URLApiGet = 'https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol'
  const {data, loading} = getFetch(URLApiGet,token)

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (id,nombre,descripcion,estado,fechainicio,userRegistro) => {
    setId(id)
    setRol(nombre)
    setDescripcion(descripcion)
    setEstado(estado)
    setFechainicio(fechainicio)
    setUserRegistro(userRegistro)
    setIsModalEditOpen(true)
  }

  const closeEditModal = () => {
    setIsModalEditOpen(false)
  }

  const deleteRol = (id,token) => {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No puedes revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteRol(id,token)
          .then(()=>{
            Swal.fire({
              title: "Eliminado!",
              text: "El Rol ha sido Eliminado.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) window.location.reload();
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El Rol no se ha podido Eliminar!",
              icon: "error"
            });
          }
          )
        
      }
    });
  }
  
  //Obtener datos de todos los roles
  

  if (loading) {
    return <Loading/>
  }
  

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Roles</h1>
        </div>
        <div className=" flex justify-between items-center  p-6">
        <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input type="text" id="search" className="border border-gray-300 px-10 py-2 rounded-md w-48 focus:outline-none" placeholder="Buscar" />
          </div>
          <button onClick={openModal} className="flex items-center px-4 py-2 azul-btn rounded-md">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar
          </button>
        </div>
        <div className="overflow-x-auto mb-4 p-3">
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
              {data?.map((item, index) => (
                <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1">
                  <FontAwesomeIcon icon={faEdit} onClick={() => {openEditModal(item.idRol,item.nombre,item.descripcion,item.estado,item.fechaRegistro,item.userRegistro)}} className="text-blue-500 mr-2 cursor-pointer" />
                  <FontAwesomeIcon icon={faTrash} onClick={() => {deleteRol(item.idRol,token)}} className="text-red-500 mr-2 cursor-pointer" />
                  <FontAwesomeIcon icon={faPlus} size='xl' onClick={() => {{/*MODAL PARA ASIGNAR VISTAS*/}}} className="text-green-500 mr-2 cursor-pointer" />

                </td>
                <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                <td className="border border-gray-300 px-2 py-1">{item.descripcion}</td>
                <td className={`border border-gray-300 px-2 py-1 ${item.estado ? 'bg-green-300' : 'bg-red-300'}`}>{item.estado ? 'Activo' : 'Inactivo'}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
      {isModalEditOpen && <EditModal closeModal={closeEditModal} Id={id} Rol={rol} Descripcion={descripcion} 
      Estado={estado} fechaRegistro={fechainicio} userRegistro={userRegistro} token={token}  userlogued={userlogued.sub}/>}
    </div>
    
  );
};

export default Roles;
