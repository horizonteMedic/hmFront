import React from 'react';
import RuterConfig from '../RuterConfig';

const AgregarCampana = () => {
  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 

      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-start font-bold color-azul text-white">Agregar Campaña</h1>
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
              placeholder="Ingrese el nombre de la campaña"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio:
            </label>
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
              Fecha de Fin:
            </label>
            <input
              id="fechaFin"
              name="fechaFin"
              type="date"
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
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
            Registrar Campaña
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarCampana;
