import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ModalRolesAsignados = ({ closeModal, data }) => {
  
  const [listRol, setListRol] = useState(data)
  const [estado, setEstadp] = useState(true)

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer color-blanco"
          onClick={closeModal}
        />
        <div className="p azuloscurobackground flex justify-between p-3.5">
          <h1 className="text-start font-bold color-azul text-white">Asignar Roles</h1>
        </div>
        <div className='container p-4'>
          <div className="mb-4">
            <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">Mostrar todos los roles:</label>
            <select id="roles" name="roles" className="pointer border border-gray-300 rounded-md px-3 py-1 w-full">
              <option value="todos">Todos los roles</option>
              {listRol?.map((item) => (
                <option key={item.idRol} value={item.idRol}>{item.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
            <div className="flex items-center">
              <input id="estado" name="estado" type="checkbox" checked={estado} className="pointer form-checkbox h-5 w-5 text-purple-500" />
              <label htmlFor="estado" className="ml-2 text-sm text-gray-700">Activo</label>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="azul-btn font-bold py-2 px-4 rounded">
              Guardar datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRolesAsignados;
