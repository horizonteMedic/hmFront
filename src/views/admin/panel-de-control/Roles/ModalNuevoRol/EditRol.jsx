import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '../../../../components/Loading';
import EditRol from '../model/EditRol';
import Swal from 'sweetalert2';

const EditModal = ({ closeModal, Refresgpag, Id, Rol, Descripcion, Estado, fechaRegistro, userRegistro, token, userlogued }) => {
    
    const [newrol, setNewRol] = useState(Rol);
    const [newdescripcion, setNewDescripcion] = useState(Descripcion);
    const [newestado, setNewEstado] = useState(Estado);
    const [newfechainicio, setFechainicio] = useState(fechaRegistro);
    const [newuserRegistro, setUserRegistro] = useState(userRegistro);

    function AleertSucces() {
      Swal.fire({
        title: "¡Éxito!",
        text: "¡Se ha editado el Rol!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          closeModal()
          Refresgpag()
        }
      });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        EditRol(Id,newrol,newdescripcion,newestado,newfechainicio,newuserRegistro,token,userlogued)
            .then(data => {
              AleertSucces();
            })
            .catch(error => {
                console.error('Error:', error)
            })
      };

    const capitalizeFirstLetter = (value) => {
        return value.replace(/\b\w/g, (char) => char.toUpperCase());
    };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
  <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">

    <FontAwesomeIcon
      icon={faTimes}
      className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
      onClick={closeModal}
    />
    <div className="p azuloscurobackground flex justify-between p-3.5">
      <h1 className="text-start font-bold color-azul text-white">Editar acciones de Usuario</h1>
    </div>
    <div className='container p-4'>
      <form autoComplete='off' className="w-full">
        <div className="flex flex-col items-start justify-center w-auto">
          <div className='flex py-3 justify-center items-center w-full'>
            <label htmlFor="tipoDocumento" className="text-left w-1/3  ">
              Nombre de Rol
            </label>
            <input
              type="text"
              value={capitalizeFirstLetter(newrol)}
              required
              id="numeroDocumento"
              onChange={(e) => setNewRol(capitalizeFirstLetter(e.target.value))}
              className="border border-gray-300 px-3 py-2 rounded-md w-2/3 focus:outline-none bg-white"
            />
          </div>
          <div className='flex py-3 justify-center items-center w-full'>
            <label htmlFor="numeroDocumento" className="text-left w-1/3 ">
              Descripción
            </label>
            <input
              type="text"
              required
              value={capitalizeFirstLetter(newdescripcion)}
              id="numeroDocumento"
              onChange={(e) => setNewDescripcion(capitalizeFirstLetter(e.target.value))}
              className="border border-gray-300 px-3 py-2 rounded-md w-2/3 focus:outline-none bg-white"
            />
          </div>
          <div className="form-check py-4 form-switch pl-0 w-full flex justify-start items-center">
            <label className="form-check-label mr-8" htmlFor="flexSwitchCheckDefault">Estado</label>
            <input
              className="pointer  !w-10 !ml-0"
              type="checkbox"
              checked={newestado}
              role="switch"
              onChange={(e) => setNewEstado(e.target.checked)}
              id="flexSwitchCheckDefault"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" onClick={handleSubmit} className="inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default EditModal;
