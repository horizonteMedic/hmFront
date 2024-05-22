import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditModal = ({ setShowEditModal, razon, direccion, telefono, responsable, email }) => {
  const [arazonSocial, setRazonSocial] = useState(razon);
  const [adireccion, setDireccion] = useState(direccion);
  const [atelefono, setTelefono] = useState(telefono);
  const [aresponsable, setResponsable] = useState(responsable);
  const [aemail, setEmail] = useState(email);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={() => setShowEditModal(false)}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Editar Nombre de Protocolo</h1>
        </div>
        <div className='container p-4'>
          <form >
            <div className="mb-4">
              <label htmlFor="razonSocial" className="block font-medium text-gray-700 mb-2">Nombre:</label>
              <input type="text" value={arazonSocial}
                onChange={(e) => setRazonSocial(e.target.value.toUpperCase())} id="razonSocial" name="razonSocial" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
       
            <div className="flex justify-end">
              <button type="button" className="azul-btn px-4 py-2 fw-bold rounded-md">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
