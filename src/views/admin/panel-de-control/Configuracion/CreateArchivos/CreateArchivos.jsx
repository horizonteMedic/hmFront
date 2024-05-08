import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import NuevoArchivoModal from './NuevoArchivoModal';
import EditModal from '../CreateArchivos/EditModal/EditModal';

import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';

const ListaArchivosPorServidores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [archivoToEdit, setArchivoToEdit] = useState(null); // Estado para el archivo a editar

  const abrirModal = () => {
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const refrescarPagina = () => {
    setRefresh(refres + 1);
  };

  useEffect(() => {
    setLoading(true);
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/tipoArchivo', token)
      .then(response => {
        setData(response);
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refres]);

  const handleEdit = archivo => {
    setArchivoToEdit(archivo);
    setShowEditModal(true);
  };

  const handleDelete = id => {
    // Lógica para eliminar el archivo con el ID dado
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Lista de archivo por servidores</h1>
        </div>
        <div className="container p-6">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-y-auto">
              <table className="table-auto min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extensión</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.map(item => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 py-1">{item.id}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => handleEdit(item)} />
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" />
                      </td>

                      <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.extension}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <div style={{ backgroundColor: item.codigo }} className="w-full h-6 mr-2 rounded-lg flex items-center justify-center shadow">
                          <span className="text-xs font-semibold text-white">{item.color}</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{item.estado ? 'Activo' : 'Inactivo'}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.fechaRegistro}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.userRegistro}</td>
                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-right">
            <button
              onClick={abrirModal}
              className="azul-btn font-bold py-2 px-4 rounded"
            >
              Crear Nuevo Archivo
            </button>
          </div>
        </div>
        {showModal && <NuevoArchivoModal CerrarModal={cerrarModal} Refresgpag={refrescarPagina} token={token} userlogued={userlogued.sub} />}
        {showEditModal && <EditModal setShowEditModal={setShowEditModal} archivo={archivoToEdit} />}
      </div>
    </div>
  );
};

export default ListaArchivosPorServidores;
