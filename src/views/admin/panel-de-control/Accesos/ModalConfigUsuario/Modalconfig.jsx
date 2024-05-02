import React, { useState } from 'react';

const ConfigurarAccesosModal = ({ closeModal }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px]">
        <h2 className="text-start font-bold mb-4">Configurar Accesos</h2>
        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            id="usuario"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white mb-4"
            value="20502980216"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Nro.</th>
                <th className="border border-gray-300 px-2 py-1">Acción</th>
                <th className="border border-gray-300 px-2 py-1">Rol</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">1</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-700 bg-white focus:ring-blue-500" />
                </td>
                <td className="border border-gray-300 px-2 py-1">Administrador</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">2</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-700 bg-white focus:ring-blue-500" />
                </td>
                <td className="border border-gray-300 px-2 py-1">Medico Contratas</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">3</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-700 bg-white focus:ring-blue-500" />
                </td>
                <td className="border border-gray-300 px-2 py-1">MEDICO</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">4</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-700 bg-white focus:ring-blue-500" />
                </td>
                <td className="border border-gray-300 px-2 py-1">Administrativo Contratas</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">5</td>
                <td className="border border-gray-300 px-2 py-1">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-700 bg-white focus:ring-blue-500" />
                </td>
                <td className="border border-gray-300 px-2 py-1">Colaborador Horizonte</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Cancelar</button>
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurarAccesosModal;
