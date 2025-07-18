import React from 'react';

export default function ModalImagenRayosX({ onClose, datos }) {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[700px] relative max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2">Aptitud</h2>
        <div className="mb-2 border rounded p-4 bg-gray-50">
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold">N° Orden :</label>
            <input value={datos.nroOrden || ''} readOnly className="border rounded px-2 py-1 w-24 bg-yellow-100" />
            <label className="font-semibold ml-4">Fecha :</label>
            <input value={datos.fechaExamen || ''} readOnly className="border rounded px-2 py-1 w-36" />
            <button className="ml-2 px-2 py-1 bg-gray-200 rounded flex items-center text-sm">Editar/Mostrar</button>
          </div>
          <div className="mb-2">
            <label className="font-semibold">Nombres y Apellidos :</label>
            <input value={datos.nombres || ''} readOnly className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex gap-4 items-center mb-2">
            <label className="font-semibold">DNI :</label>
            <input value={datos.dni || ''} readOnly className="border rounded px-2 py-1 w-24" />
            <label className="font-semibold ml-4">Edad :</label>
            <input value={datos.edad || ''} readOnly className="border rounded px-2 py-1 w-20" />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <button className="bg-gray-200 px-4 py-2 rounded">Cargar Imagen</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Descargar</button>
        </div>
        <div className="flex gap-4 mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Grabar/Actualizar</button>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">Limpiar</button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Eliminar</button>
        </div>
        <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    </div>
  );
} 