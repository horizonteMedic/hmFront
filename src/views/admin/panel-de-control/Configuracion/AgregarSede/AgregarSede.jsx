import React, { useState } from 'react';
import RuterConfig from '../RuterConfig';

const AgregarSede = () => {
  const [estado, setEstado] = useState('activo'); // Estado por defecto

  const handleEstadoChange = (e) => {
    setEstado(e.target.checked ? 'activo' : 'inactivo');
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl  w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Agregar Sede</h1>
        </div>
        <div className='container p-6'>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre:
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el nombre de la sede"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
              Código:
            </label>
            <input
              id="codigo"
              name="codigo"
              type="number"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Ingrese el código de la sede"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
              Estado:
            </label>
            <div className="mt-1">
              <input
                type="checkbox"
                id="estado"
                name="estado"
                className="pointer focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={estado === 'activo'}
                onChange={handleEstadoChange}
              />
              <span className="ml-2 text-sm text-gray-600">Activo</span>
            </div>
          </div>
          <button className="azul-btn font-bold py-2 px-4 rounded">
            Registrar Sede
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarSede;
