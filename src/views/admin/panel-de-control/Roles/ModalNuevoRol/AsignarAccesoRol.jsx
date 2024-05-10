import React, { useState } from 'react';

const ArrowIcon = ({ isOpen, toggle }) => {
  return (
    <svg
      className="w-4 h-4 ml-1 cursor-pointer"
      onClick={toggle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isOpen ? (
        <polyline points="6 9 12 15 18 9" />
      ) : (
        <polyline points="18 15 12 9 6 15" />
      )}
    </svg>
  );
};

const ModalAsignarAccesoRol = ({ closeModal, token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
        <div className="px-4 py-2 flex justify-between bg-gray-200">
          <h2 className="text-lg font-semibold">Asignar Acceso</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            Cerrar
          </button>
        </div>
        <div className="p-4">
          <div className="modal-body relative">
            <div className="tree smart-form">
              <ul role="tree">
                <li className="parent_li" role="treeitem">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                    <span className="ml-1">SISTEMA</span>
                    <ArrowIcon isOpen={isOpen} toggle={toggleContent} />
                  </label>
                  {isOpen && (
                    <ul role="group" className="ml-4 mt-2">
                      <li className="parent_li" role="treeitem">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                          <span className="ml-1">Roles</span>
                        </label>
                      </li>
                      <li className="parent_li" role="treeitem">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                          <span className="ml-1">Accesos</span>
                        </label>
                      </li>
                      <li className="parent_li" role="treeitem">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                          <span className="ml-1">Reportes</span>
                        </label>
                      </li>
                      <li className="parent_li" role="treeitem">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                          <span className="ml-1">M. Postulante</span>
                        </label>
                      </li>
                      <li className="parent_li" role="treeitem">
                        <label className="flex items-center">
                          <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                          <span className="ml-1">Configuración</span>
                          <ArrowIcon isOpen={false} toggle={() => {}} /> {/* Flecha sin funcionalidad */}
                        </label>
                        {/* Contenido que se muestra al abrir Configuración */}
                        <ul role="group" className="ml-4 mt-2">
                          <li className="parent_li" role="treeitem">
                            <label className="flex items-center">
                              <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                              <span className="ml-1">Archivos</span>
                            </label>
                          </li>
                          <li className="parent_li" role="treeitem">
                            <label className="flex items-center">
                              <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                              <span className="ml-1">Agregar Sede</span>
                            </label>
                          </li>
                          <li className="parent_li" role="treeitem">
                            <label className="flex items-center">
                              <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                              <span className="ml-1">Agregar Campaña</span>
                            </label>
                          </li>
                        </ul>
                        {/* Fin del contenido */}
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 flex justify-end bg-gray-200">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Asignar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarAccesoRol;
