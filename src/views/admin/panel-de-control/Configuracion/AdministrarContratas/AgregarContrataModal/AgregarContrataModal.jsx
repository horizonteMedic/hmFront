import React, { useState } from 'react';

const AgregarContrataModal = ({ setShowModal }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveContrata = () => {
    // Aquí puedes agregar la lógica para guardar la contrata en la base de datos
    console.log('Nombre:', nombre);
    console.log('Descripción:', descripcion);
    console.log('Activo:', activo);

    setShowModal(false);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-4 relative">
        <button onClick={handleCloseModal} className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Contrata</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="activo" className="block text-sm font-medium text-gray-700">Activo</label>
            <select
              id="activo"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={activo}
              onChange={(e) => setActivo(e.target.value === 'true')}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </form>
        <div className="flex justify-end mt-4">
          <button onClick={handleSaveContrata} className="azul-btn text-white font-bold py-2 px-4 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default AgregarContrataModal;
