import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus, faLock,} from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalNuevoRol/Modal'; 
import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import EditModal from './ModalNuevoRol/EditRol';
import Swal from 'sweetalert2';
import DeleteRol from './model/DeleteRol';
import ModalAsignarAccesoRol from './ModalNuevoRol/AsignarAccesoRol'; 

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAccessOpen, setIsModalAccessOpen] = useState(false); 
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(0)

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [id, setId] = useState('');
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(true);
  useEffect(() => {
    setLoading(true)
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/rol', token)
    .then(response => {
      setData(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.',error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[refres])

  const Refresgpag = () => {
    setRefresh(refres + +1)
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (id, nombre, descripcion, estado) => {
    setId(id)
    setRol(nombre)
    setDescripcion(descripcion)
    setEstado(estado)
    setIsModalEditOpen(true)
  }

  const closeEditModal = () => {
    setIsModalEditOpen(false)
  }

  const openAccessModal = () => {
    setIsModalAccessOpen(true);
  };

  const closeAccessModal = () => {
    setIsModalAccessOpen(false); 
  };

  const deleteRol = (id) => {
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
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "El Rol ha sido Eliminado.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) Refresgpag()
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El Rol no se ha podido Eliminar!",
              icon: "error"
            });
          });
      }
    });
  }


  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white  rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-start font-bold color-azul text-white">Roles</h1>
        </div>
          
        <div className="flex items-center mt-2 mr-4">
          <div className="relative ml-auto"> 
            <button onClick={openModal} className="flex items-center px-4 py-2 azul-btn rounded-md">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar
            </button>
          </div>
        </div>
          
        <div className="overflow-x-auto mb-4 p-3">
          <table className="w-full border border-gray-300 px-3 py-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Acciones</th>
                <th className="border border-gray-300 px-2 py-1">Nombres</th>
                <th className="border border-gray-300 px-2 py-1">Descripción</th>
                <th className="border border-gray-300 px-2 py-1 text-center w-[5%]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    <FontAwesomeIcon icon={faEdit} onClick={() => {openEditModal(item.idRol, item.nombre, item.descripcion, item.estado)}} className="text-blue-500 mr-2 cursor-pointer" />
                    <FontAwesomeIcon icon={faTrash} onClick={() => {deleteRol(item.idRol)}} className="text-red-500 mr-2 cursor-pointer" />
                    <FontAwesomeIcon icon={faLock} onClick={openAccessModal} className="text-gray-500 mr-2 cursor-pointer" />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                  <td className="border border-gray-300 px-2 py-1">{item.descripcion}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    <div style={{ borderRadius: '1rem' }} className={`py-1 px-2 ${item.estado ? 'bg-green-500' : 'bg-red-500'} text-white fw-bold`}>
                      {item.estado ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className="flex justify-center bg-gray-100 rounded-lg p-4 md:px-6 md:py-4 md:mx-4 md:my-2">
          <div className="flex items-center ml-2 md:ml-4">
            <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
            <p className="text-sm ml-2 md:ml-4">Editar</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faTrash} className="text-red-500" />
            <p className="text-sm ml-2 md:ml-4">Eliminar</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faLock} className="text-gray-500" />
            <p className="text-sm ml-2 md:ml-4">Asignar Acceso</p>
          </div>
          {/* <div className="flex items-center ml-2 md:ml-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            <p className="text-sm ml-2 md:ml-4">Activo</p>
          </div>
          <div className="flex items-center ml-6 md:ml-8">
            <FontAwesomeIcon icon={faBan} className="text-red-500" />
            <p className="text-sm ml-2 md:ml-4">Inactivo</p>
          </div> */}
        </div>

      </div>
      {isModalOpen && <Modal closeModal={closeModal} Refresgpag={Refresgpag} />}
      {isModalEditOpen && <EditModal closeModal={closeEditModal} Refresgpag={Refresgpag} Id={id} Rol={rol} Descripcion={descripcion} Estado={estado} token={token} userlogued={userlogued.sub} />}
      {isModalAccessOpen && <ModalAsignarAccesoRol closeModal={closeAccessModal} token={token} />} 
    </div>
  );
};

export default Roles;
