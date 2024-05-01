import React, { useEffect } from 'react';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../../../../store/auth';
import NewRol from '../model/NewRol';
import Swal from 'sweetalert2';

const Modal = ({ closeModal, Refresgpag }) => {
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha creado un Nuevo Rol!",
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
    NewRol(rol, descripcion,estado,token,userlogued.sub)
      .then(data => {
        AleertSucces()
      })
      .catch(error => {
        console.error('Error:', error)
      })
  };

  const handleRolChange = (e) => {
    const capitalized = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setRol(capitalized);
  };

  const handleDescripcionChange = (e) => {
    const capitalized = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setDescripcion(capitalized);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px]  relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
          onClick={closeModal}
        />
        <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Rol</h2>
        <form  autoComplete='off' >
          <div className="flex flex-col items-start justify-center w-auto">
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="tipoDocumento" className="text-left w-full block ">
                Nombre de Rol
              </label>
              <input
                type="text"
                required
                id="numeroDocumento"
                onChange={handleRolChange}
                value={rol}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="numeroDocumento" className="text-left w-full block ">
                Descripción
              </label>
              <input
                type="text"
                required
                id="numeroDocumento"
                onChange={handleDescripcionChange}
                value={descripcion}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div className="form-check py-4 form-switch pl-0 w-full flex justify-center items-center">
              <label className=" form-check-label mr-8"  htmlFor="flexSwitchCheckDefault"> Estado </label>
              <input 
                className="pointer form-check-input !w-10 !ml-0 " 
                type="checkbox" 
                role="switch"
                onChange={(e) => setEstado(e.target.checked)} 
                id="flexSwitchCheckDefault"/>
            </div>
          </div>
          <div className="flex justify-end">
            
            <button type="submit" onClick={handleSubmit} className="inline-flex justify-center items-center px-4 py-2 azul-btn rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
