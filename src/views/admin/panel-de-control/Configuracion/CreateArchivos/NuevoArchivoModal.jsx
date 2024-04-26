import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const NuevoArchivoModal = ({ showModal, setShowModal }) => {
  const [nuevoArchivo, setNuevoArchivo] = useState({
    codigo: '',
    nombre: '',
    extension: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoArchivo({ ...nuevoArchivo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar alguna acción con el nuevo archivo
    setNuevoArchivo({ codigo: '', nombre: '', extension: '' });
    setShowModal(false);
  };

  // Array de opciones para el select de extensiones
  const extensiones = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'mp3',
    'mp4',
    'avi',
    'mov',
  ];

  return (
    <>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center w-[90%]">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
                onClick={() => setShowModal(false)}
              />
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                      Código:
                    </label>
                    <input
                      id="codigo"
                      name="codigo"
                      type="text"
                      value={nuevoArchivo.codigo}
                      onChange={handleInputChange}
                      className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre:
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={nuevoArchivo.nombre}
                      onChange={handleInputChange}
                      className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="extension" className="block text-sm font-medium text-gray-700">
                      Extensión:
                    </label>
                    <select
                      id="extension"
                      name="extension"
                      value={nuevoArchivo.extension}
                      onChange={handleInputChange}
                      className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {extensiones.map((ext) => (
                        <option key={ext} value={ext}>
                          {ext}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  azul-btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Crear Archivo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NuevoArchivoModal;
