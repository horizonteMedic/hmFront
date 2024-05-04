import React, { useState, useEffect } from 'react';
import NuevoArchivoModal from './NuevoArchivoModal';
import RuterConfig from '../RuterConfig';
import { getListArchivos } from '../CreateArchivos/model/listarArchivos'; // Importa la función getListArchivos

const ListaArchivosPorServidores = () => {
  const [showModal, setShowModal] = useState(false);
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token y el usuario logueado
        const token = 'tu_token_aqui'; // Reemplaza 'tu_token_aqui' con tu lógica para obtener el token
        const userlogued = 'tu_usuario_aqui'; // Reemplaza 'tu_usuario_aqui' con tu lógica para obtener el usuario logueado

        // Llamar a la función para obtener los archivos
        const archivosData = await getListArchivos(token);

        // Filtrar los archivos del usuario logueado
        const archivosUsuario = archivosData.filter(archivo => archivo.userRegistro === userlogued);

        // Actualizar el estado de archivos con los datos obtenidos
        setArchivos(archivosUsuario);
      } catch (error) {
        console.error('Error al obtener los archivos:', error);
      }
    };

    // Llamar a la función para obtener los archivos cuando el componente se monta
    fetchData();
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez al montar el componente

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
