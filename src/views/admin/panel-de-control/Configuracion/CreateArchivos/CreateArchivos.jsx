import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faCheck, faTimes, faBan } from '@fortawesome/free-solid-svg-icons';
import NuevoArchivoModal from './NuevoArchivoModal';
import EditModal from '../CreateArchivos/EditModal/EditModal';
import { DeleteArchivo } from './model/DeleteArchivo';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import Swal from 'sweetalert2';
const ListaArchivosPorServidores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [archivoToEdit, setArchivoToEdit] = useState(null); // Estado para el archivo a editar

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

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
    getFetch('/api/v01/ct/tipoArchivo', token)
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

  const deleteArchivo = (id) => {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No puedes revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteArchivo(id,token)
          .then(() => {
            Swal.fire({
              title: "Eliminado!",
              text: "El tipo de Archivo ha sido eliminado.",
              icon: "success"
            }).then((result) => {
              if (result.isConfirmed) refrescarPagina()
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "El tipo de Archivo no se ha podido Eliminar!",
              icon: "error"
            });
          });
      }
    });
  }

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Lista de archivo por servidores</h1>
        </div>
        <div className="text-right mt-3 mr-3">
            <button onClick={abrirModal} className="azul-btn text-white font-bold py-2 px-4 rounded" >
              Crear Nuevo Archivo
            </button>
          </div>
        <div className="container p-6">

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-y-auto">
              <table className="table-auto min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomenclatura</th>
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
                      {/* <td className="border border-gray-300 px-2 py-1">{item.id}</td> */}
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => handleEdit(item)} />
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => {deleteArchivo(item.id)}} />
                      </td>

                      <td className="border border-gray-300 px-2 py-1">{toTitleCase(item.nombre)}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.nomenclatura}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.extension}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <div style={{ backgroundColor: item.codigo }} className="w-full h-6 mr-2 rounded-lg flex items-center justify-center shadow">
                          <span className="text-xs font-semibold text-white">{item.color}</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {item.estado ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                          <FontAwesomeIcon icon={faBan} className="text-red-500" />
                        )}
                      </td>
                 
                      <td className="border border-gray-300 px-2 py-1">{item.fechaRegistro}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.userRegistro}</td>
                   
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center bg-gray-100 rounded-lg p-4 md:px-6 md:py-4 md:mx-4 md:my-2">
                <div className="flex items-center ml-2 md:ml-4">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
                  <p className="text-sm ml-2 md:ml-4">Editar</p>
                </div>
                <div className="flex items-center ml-6 md:ml-8">
                  <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                  <p className="text-sm ml-2 md:ml-4">Eliminar</p>
                </div>
                <div className="flex items-center ml-2 md:ml-4">
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  <p className="text-sm ml-2 md:ml-4">Activo</p>
                </div>
                <div className="flex items-center ml-6 md:ml-8">
                  <FontAwesomeIcon icon={faBan} className="text-red-500" />
                  <p className="text-sm ml-2 md:ml-4">Inactivo</p>
                </div>
              </div>
            </div>
            
          )}
         
        </div>
        {showModal && <NuevoArchivoModal CerrarModal={cerrarModal} Refresgpag={refrescarPagina} token={token} userlogued={userlogued.sub} />}
        {showEditModal && <EditModal setShowEditModal={setShowEditModal} archivo={archivoToEdit} Refresgpag={refrescarPagina} token={token} userlogued={userlogued.sub} />}
      </div>
    </div>
  );
};

export default ListaArchivosPorServidores;
