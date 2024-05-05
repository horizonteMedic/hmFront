import React, { useState, useEffect } from 'react';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import AgregarContrataModal from '../AdministrarContratas/AgregarContrataModal/AgregarContrataModal';

const AdministrarContratas = () => {
  const [contratas, setContratas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  useEffect(() => {
    setLoading(true);
    getContratas()
      .then(response => {
        setContratas(response);
      })
      .catch(error => {
        console.error('Error al obtener las contratas:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getContratas = async () => {
    try {
      const response = await getFetch('URL_DE_TU_API_AQUI', token);
      return response;
    } catch (error) {
      throw new Error('Error al obtener las contratas:', error);
    }
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-start font-bold color-azul text-white">Administrar Contratas</h1>
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
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de creación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contratas.map((contrata, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{/* Insertar Orden */}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        {/* Insertar botones de acciones (eliminar, editar) */}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{contrata.nombre}</td>
                      <td className="border border-gray-300 px-2 py-1">{contrata.descripcion}</td>
                      <td className="border border-gray-300 px-2 py-1">{contrata.activo ? 'Activo' : 'Inactivo'}</td>
                      <td className="border border-gray-300 px-2 py-1">{contrata.creadoPor}</td>
                      <td className="border border-gray-300 px-2 py-1">{contrata.fechaCreacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Botón para abrir el modal */}
              <div className="text-right">
                <button onClick={() => setShowModal(true)} className="azul-btn text-white font-bold py-2 px-4 rounded">
                  Agregar Contrata
                </button>
              </div>
              {/* Renderizamos el modal si showModal es true */}
              {showModal && <AgregarContrataModal setShowModal={setShowModal} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdministrarContratas;
