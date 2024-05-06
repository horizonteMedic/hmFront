import React, { useState, useEffect } from 'react';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import AgregarEmpresaModal from '../AdministrarEmpresas/AgregarEmpresaModal/AgregarEmpresaModal'

const AdministrarEmpresa = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0)

  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  useEffect(() => {
    setLoading(true)
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/empresa', token)
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


  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Administrar Empresas</h1>
        </div>
        <div className="container p-6">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RUC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razon Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direccion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{index+1}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        {/* Insertar botones de acciones (eliminar, editar) */}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{item.rucEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.razonEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.direccionEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.telefonoEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.responsableEmpresa}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.emailEmpresa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right">
                <button onClick={() => setShowModal(true)} className="azul-btn text-white font-bold py-2 px-4 rounded">
                  Agregar Empresa
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && <AgregarEmpresaModal setShowModal={setShowModal} />} {/* Mostrar el modal si showModal es true */}
    </div>
  );
};

export default AdministrarEmpresa;
