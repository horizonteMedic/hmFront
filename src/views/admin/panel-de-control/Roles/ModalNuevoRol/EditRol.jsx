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
        title: "¡Exito!",
        text: "Se ha Editaro el Rol!",
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
        // Aquí puedes enviar los datos por fetch o realizar cualquier otra acción
      };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px]  relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
          onClick={closeModal}
        />
        <h2 className="text-start font-bold mb-4 text-center">Editar Rol</h2>
        <form autoComplete='off' >
          <div className="flex flex-col items-start justify-center w-auto">
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="tipoDocumento" className="text-left w-full block text-sm font-medium text-gray-700">
                Nombre de Rol
              </label>
              <input
                type="text"
                value={newrol}
                required
                id="numeroDocumento"
                onChange={(e) => setNewRol(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="numeroDocumento" className="text-left w-full block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                required
                value={newdescripcion}
                id="numeroDocumento"
                onChange={(e) => setNewDescripcion(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div className="form-check py-4 form-switch pl-0 w-full flex justify-center items-center">
              <label className="form-check-label mr-8"  htmlFor="flexSwitchCheckDefault"> Estado </label>
              <input 
                className="form-check-input !w-10 !ml-0 " 
                type="checkbox" 
                checked={newestado}
                role="switch"
                onChange={(e) => setNewEstado(e.target.checked)} 
                id="flexSwitchCheckDefault"/>
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
  );
};

export default EditModal;
