import React from 'react';

const AgregarSede = () => {
  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        <h1 className="text-center text-2xl font-bold mb-4">Agregar Sede</h1>
        
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
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Selecciona Región:
          </label>
          <select
            id="region"
            name="region"
            className="border pointer mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Selecciona una región</option>
            <option value="region1">Región 1</option>
            <option value="region2">Región 2</option>
            <option value="region3">Región 3</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            placeholder="Ingrese la descripción de la campaña"
          ></textarea>
        </div>
        <button className="azul-btn font-bold py-2 px-4 rounded">
          Registrar Sede
        </button>
      </div>
    </div>
  );
};

export default AgregarSede;
