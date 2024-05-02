import React, { useState } from 'react';
import NuevoArchivoModal from './NuevoArchivoModal';
import RuterConfig from '../RuterConfig';

const ListaArchivosPorServidores = () => {
  const [showModal, setShowModal] = useState(false);
  const [archivos, setArchivos] = useState([
    { codigo: '001', nombre: 'Archivo1', extension: 'PDF' },
    { codigo: '002', nombre: 'Archivo2', extension: 'Excel' },
    { codigo: '003', nombre: 'Archivo3', extension: 'Word' },
  ]);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-start font-bold color-azul text-white">Lista de archivo por servidores</h1>
        </div>
        <div className='container p-6'>
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
              className="azul-btn font-bold py-2 px-4 rounded"
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
    </div>
  );
};

export default ListaArchivosPorServidores;
