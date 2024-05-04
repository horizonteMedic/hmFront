import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus, faLock } from '@fortawesome/free-solid-svg-icons';
import Modal from './ModalNuevoRol/Modal'; 
import { getFetch } from '../getFetch/getFetch';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import EditModal from './ModalNuevoRol/EditRol';
import Swal from 'sweetalert2';
import DeleteRol from './model/DeleteRol';
import ModalAsignarAccesoRol from './ModalNuevoRol/AsignarAccesoRol'; // Importa el componente ModalAsignarAccesoRol

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAccessOpen, setIsModalAccessOpen] = useState(false); // Estado para controlar el modal de asignación de acceso
  
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
    setIsModalAccessOpen(true); // Función para abrir el modal de asignación de acceso
  };

  const closeAccessModal = () => {
    setIsModalAccessOpen(false); // Función para cerrar el modal de asignación de acceso
  };

  const deleteRol = (id, token) => {
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
        DeleteRol(id, token)
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
          <div className="relative ml-auto"> {/* Utilizamos ml-auto para alinear a la derecha */}
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
                <th className="border border-gray-300 px-2 py-1">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    <FontAwesomeIcon icon={faEdit} onClick={() => {openEditModal(item.idRol, item.nombre, item.descripcion, item.estado)}} className="text-blue-500 mr-2 cursor-pointer" />
                    <FontAwesomeIcon icon={faTrash} onClick={() => {deleteRol(item.idRol, token)}} className="text-red-500 mr-2 cursor-pointer" />
                    <FontAwesomeIcon icon={faLock} onClick={openAccessModal} className="text-gray-500 mr-2 cursor-pointer" />
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
      {isModalOpen && <Modal closeModal={closeModal} Refresgpag={Refresgpag} />}
      {isModalEditOpen && <EditModal closeModal={closeEditModal} Refresgpag={Refresgpag} Id={id} Rol={rol} Descripcion={descripcion} Estado={estado} token={token} userlogued={userlogued.sub} />}
      {isModalAccessOpen && <ModalAsignarAccesoRol closeModal={closeAccessModal} />} {/* Modal de asignación de acceso */}
    </div>
  );
};

export default Roles;
