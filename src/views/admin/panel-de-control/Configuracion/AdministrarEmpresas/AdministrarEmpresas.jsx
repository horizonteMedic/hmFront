import React, { useState, useEffect } from 'react';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import AgregarEmpresaModal from '../AdministrarEmpresas/AgregarEmpresaModal/AgregarEmpresaModal';
import EditModal from '../AdministrarEmpresas/EditModal/EditModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const AdministrarEmpresa = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10); // Nuevo estado para el número de registros por página
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas
  const [showEditModal, setShowEditModal] = useState(false); // Estado para el modal de edición

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  const visiblePages = () => {
    const totalVisiblePages = 5; 
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    let startPage = currentPage - halfVisiblePages;
    startPage = Math.max(startPage, 1); 
    const endPage = startPage + totalVisiblePages - 1;
    return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages);
  };

  useEffect(() => {
    setLoading(true);
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/empresa', token)
      .then(response => {
        setData(response);
        setTotalPages(Math.ceil(response.length / recordsPerPage)); // Calcular el número total de páginas
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refres, recordsPerPage]); // Actualiza la carga de datos cuando cambia refres o recordsPerPage

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value)); // Actualiza el estado con el nuevo número de registros por página
    setCurrentPage(1); // Restablece la página actual al cambiar el número de registros por página
  };

  const handlePageClick = (page) => {
    setCurrentPage(page); // Actualiza la página actual al hacer clic en un número de página
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between items-center">
          <h1 className="text-start font-bold color-azul text-white">Administrar Empresas</h1>
        </div>
        <div className="container p-6">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <span className="mr-2">Mostrar</span>
              <select className="border pointer border-gray-300 rounded-md px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={-1}>Todos</option> 
              </select>

              <span className="mx-2">registros</span>
            </div>
            <button onClick={() => setShowModal(true)} className="azul-btn text-white font-bold py-2 px-4 rounded">
              Agregar Empresa
            </button>
          </div>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-y-auto">
              <table className="table-auto min-w-full divide-y divide-gray-200 mb-4"> 
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
                  {data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((item, index) => ( // Solo mapea los primeros registros hasta el número seleccionado por página
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                          <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => setShowEditModal(true)} />
                          <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" />
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
            </div>
          )}
        </div>
        <div className="flex justify-center p-4">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {visiblePages().map((page) => (
            <button key={page} onClick={() => handlePageClick(page)} className={`mx-1 px-3 py-1 rounded-md ${currentPage === page ? 'azuloscurobackground text-white' : 'bg-gray-200'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      {showModal && <AgregarEmpresaModal setShowModal={setShowModal} />} {/* Mostrar el modal si showModal es true */}
      {showEditModal && <EditModal setShowEditModal={setShowEditModal} />}

    </div>
  );
};

export default AdministrarEmpresa;
