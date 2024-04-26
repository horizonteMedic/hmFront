import React, { useState } from 'react';
import RuterConfig from '../RuterConfig';

const ConfiguracionVistasPorRol = () => {
  const [selectedRol, setSelectedRol] = useState('');
  const [selectedViews, setSelectedViews] = useState([]);
  const vistas = ['Medico', 'Enfermero', 'Administrativo', 'Otro'];
  const roles = [
    'Vista1', 'Vista2', 'Vista3', 'Vista4', 'Vista5', 'Vista6',
    'Vista7', 'Vista8', 'Vista9', 'Vista10', 'Vista11', 'Vista12',
    'Vista13', 'Vista14', 'Vista15'
  ];

  const handleRolChange = (event) => {
    setSelectedRol(event.target.value);
    setSelectedViews([]);
  };

  const toggleView = (view) => {
    if (selectedViews.includes(view)) {
      setSelectedViews(selectedViews.filter((v) => v !== view));
    } else {
      setSelectedViews([...selectedViews, view]);
    }
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />

      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        <h1 className="text-center text-2xl font-bold mb-4 color-azul">Configuración de Vistas por Rol</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Rol:</h2>

          <select id="rol" name="rol"
            className="mt-1 pointer border block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedRol}
            onChange={handleRolChange}
          >
            <option value="">Selecciona un rol</option>
            {vistas.map((rol) => (
              <option key={rol} value={rol}>{rol}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Lista de interfaces</h2>
          <div className="bg-gray-100 p-2 rounded-lg h-[25vh] overflow-y-auto">
            {roles.map((rol) => (
              <div key={rol} className="flex items-center justify-between py-1">
                <span>{rol}</span>
                <button
                  className={`px-2 py-1 ${
                    selectedViews.includes(rol) ? 'naranja-btn ' : 'azul-btn '
                  } rounded-md`}
                  onClick={() => toggleView(rol)}
                >
                  {selectedViews.includes(rol) ? 'Quitar' : 'Agregar'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Configuración de Vistas</h2>
          <table className="w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-2 py-1">Rol</th>
                <th className="border border-gray-300 px-2 py-1">Vistas</th>
              </tr>
            </thead>
            <tbody>
              {selectedRol && (
                <tr>
                  <td className="border border-gray-300 px-2 py-1">{selectedRol}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {selectedViews.map((view) => (
                      <span key={view} className="mr-2">
                        {view}
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => toggleView(view)}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionVistasPorRol;
