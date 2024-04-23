import React, { useEffect } from 'react';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const Modal = ({ closeModal }) => {
  const [rol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Aquí puedes enviar los datos por fetch o realizar cualquier otra acción
    
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] ">
        <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Rol</h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className="flex flex-col items-start justify-center w-auto">
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="tipoDocumento" className="text-left w-full block text-sm font-medium text-gray-700">
                Nombre de Rol
              </label>
              <input
                type="text"
                id="numeroDocumento"
                onChange={(e) => setRol(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div className='flex py-3 justify-center items-center w-full'>
              <label htmlFor="numeroDocumento" className="text-left w-full block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                id="numeroDocumento"
                onChange={(e) => setDescripcion(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            <div class="form-check py-4 form-switch pl-0 w-full flex justify-center items-center">
              <label class="form-check-label mr-8" for="flexSwitchCheckDefault">Estado </label>
              <input 
                class="form-check-input !w-10 !ml-0 " 
                type="checkbox" 
                role="switch"
                onChange={(e) => setEstado(e.target.checked)} 
                id="flexSwitchCheckDefault"/>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 bg-red-500 text-white rounded-md mr-2"
              onClick={closeModal}
            >
              Cerrar
            </button>
            <button type="submit" className="inline-flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
