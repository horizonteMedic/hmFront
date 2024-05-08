import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditModal = ({ setShowEditModal, archivo }) => {
  const [datosEditados, setDatosEditados] = useState({
    codigo: archivo.codigo,
    nombre: archivo.nombre,
    extension: archivo.extension,
    color: archivo.color,
    estado: archivo.estado,
    fechaRegistro: archivo.fechaRegistro,
    userRegistro: archivo.userRegistro
  });

  const handleChange = e => {
    setDatosEditados({
      ...datosEditados,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí debes enviar los datos editados al servidor
    // Por ejemplo, podrías hacer una llamada a una API para guardar los cambios
    console.log('Datos editados:', datosEditados);
    // setShowEditModal(false); // Cerrar el modal después de editar
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-3 cursor-pointer text-gray-500"
          onClick={() => setShowEditModal(false)}
        />
        <div className="p-3 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Editar Archivo</h1>
        </div>
        <div className='container p-4'>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código:</label>
              <input type="text" id="codigo" name="codigo" value={datosEditados.codigo} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value={datosEditados.nombre} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="extension" className="block text-sm font-medium text-gray-700">Extensión:</label>
              <input type="text" id="extension" name="extension" value={datosEditados.extension} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color:</label>
              <input type="text" id="color" name="color" value={datosEditados.color} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado:</label>
              <select id="estado" name="estado" value={datosEditados.estado} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="fechaRegistro" className="block text-sm font-medium text-gray-700">Fecha de Registro:</label>
              <input type="text" id="fechaRegistro" name="fechaRegistro" value={datosEditados.fechaRegistro} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="userRegistro" className="block text-sm font-medium text-gray-700">Responsable:</label>
              <input type="text" id="userRegistro" name="userRegistro" value={datosEditados.userRegistro} onChange={handleChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
