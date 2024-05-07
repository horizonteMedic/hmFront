import React, { useState, useEffect } from 'react';
import NuevoArchivoModal from './NuevoArchivoModal';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';

const ListaArchivosPorServidores = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(0)

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);


  const [showModal, setShowModal] = useState(false);
  const [archivos, setArchivos] = useState([]);

  const AbrirModal =() =>{
    setShowModal(true)
  }

  const CerrarModal=() =>{
    setShowModal(false)
  }

  const Refresgpag = () => {
    setRefresh(refres + +1)
  }
  useEffect(() => {
    setLoading(true)
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/tipoArchivo', token)
    .then(response => {
      setData(response)
    })
    .catch(error => {
      throw new Error('Network response was not ok.',error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[refres])

  console.log(data)

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig /> 
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-start font-bold color-azul text-white">Lista de archivo por servidores</h1>
        </div>
        <div className='container p-6'>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="overflow-y-auto">
          <table  className="table-auto min-w-full divide-y divide-gray-200 mb-4"> 
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extensión</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1">{item.id}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.extension}</td>
                    <td className="border border-gray-300 px-2 py-1 flex items-center">
                      <div style={{ backgroundColor: `${item.codigo}` }} className="w-full h-6 mr-2 rounded-lg flex items-center justify-center shadow">
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
              onClick={AbrirModal}
              className="azul-btn font-bold py-2 px-4 rounded"
            >
              Crear Nuevo Archivo
            </button>
          </div>
        </div>
        {showModal && <NuevoArchivoModal
          CerrarModal={CerrarModal}
          Refresgpag={Refresgpag}
          token={token}
          userlogued={userlogued.sub}
        />}
      </div>
    </div>
  );
};

export default ListaArchivosPorServidores;
