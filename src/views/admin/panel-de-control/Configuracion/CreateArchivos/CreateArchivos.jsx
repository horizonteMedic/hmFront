import React, { useState } from 'react';
import NuevoArchivoModal from './NuevoArchivoModal';

const ListaArchivosPorServidores = () => {
  const [showModal, setShowModal] = useState(false);
  const [archivos, setArchivos] = useState([
    { codigo: '001', nombre: 'Archivo1', extension: 'PDF' },
    { codigo: '002', nombre: 'Archivo2', extension: 'Excel' },
    { codigo: '003', nombre: 'Archivo3', extension: 'Word' },
  ]);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <h1 className="text-center text-2xl font-bold mb-4">Lista de Archivos por Servidores</h1>
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        <table className="min-w-full divide-y divide-gray-200 mb-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Extensión
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {archivos.map((archivo, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{archivo.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{archivo.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{archivo.extension}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Crear Nuevo Archivo
          </button>
        </div>
      </div>
      <NuevoArchivoModal
        showModal={showModal}
        setShowModal={setShowModal}
        archivos={archivos}
        setArchivos={setArchivos}
      />
    </div>
  );
};

export default ListaArchivosPorServidores;
