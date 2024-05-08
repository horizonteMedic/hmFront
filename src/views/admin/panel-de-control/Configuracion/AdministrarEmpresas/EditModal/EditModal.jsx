import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditModal = ({ setShowEditModal }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={() => setShowEditModal(false)}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Editar Empresa</h1>
        </div>
        <div className='container p-4'>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">RUC</label>
              <input type="text" id="ruc" name="ruc" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">Razón Social</label>
              <input type="text" id="razonSocial" name="razonSocial" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
              <input type="text" id="direccion" name="direccion" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="text" id="telefono" name="telefono" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">Responsable</label>
              <input type="text" id="responsable" name="responsable" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" className="border border-gray-300 rounded-md px-3 py-2 w-full" />
            </div>
            <div className="flex justify-end">
              <button type="button" className="azul-btn px-4 py-2 rounded-md" onClick={() => setShowEditModal(false)}>Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
