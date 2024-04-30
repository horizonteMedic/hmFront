import React from 'react';

const ModalAsignarAccesoRol = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
        <div className="px-4 py-2 flex justify-between bg-gray-200">
          <h2 className="text-lg font-semibold">Asignar Acceso</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">Cerrar</button>
        </div>
        <div className="p-4">
          <div className="modal-body relative">
            <div className="tree smart-form">
              <ul role="tree">
                <li className="parent_li" role="treeitem">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox text-green-500 mr-2" />
                    <span className="ml-1">SISTEMA</span>
                  </label>
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
                      </label>
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
                    </li>
                  </ul>
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
