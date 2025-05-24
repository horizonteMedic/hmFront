import React from 'react';

const ModalAsignacionesSub = ({ open, onClose, nombre, acciones = [], seleccionadas = [], onChangeSeleccion }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md w-[350px] relative p-6">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Asignar acciones a: <span className="text-blue-700">{nombre}</span></h2>
        <div className="flex flex-col gap-2">
          {acciones.map((accion) => (
            <label key={accion} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={seleccionadas.includes(accion)}
                onChange={() => onChangeSeleccion(accion)}
              />
              {accion}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalAsignacionesSub; 