import React, { useState, useEffect } from 'react';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import AgregarSedeModal from '../AgregarSede/ModalAgregarSede/ModalAgregarSede';
import { faBan, faCheck, faChevronLeft, faChevronRight, faEdit, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteSede } from '../model/AdministrarSedes';
import EditSedeModal from '../AgregarSede/EditSedeModal/EditSedeModal';

import Swal from 'sweetalert2';

const AdministrarSedes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit
  const [item, setItem] = useState({})
  const userlogued = useAuthStore(state => state.userlogued);
  const token = useAuthStore(state => state.token);

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
    getFetch('https://servicios-web-hm.azurewebsites.net/api/v01/ct/sede', token)
      .then(response => {
        setData(response);
        setTotalPages(Math.ceil(response.length / recordsPerPage));
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refres, recordsPerPage]);

  const Refresgpag = () => {
    setRefresh(refres + 1);
  };

  const Edit = (item) => {
    setItem(item)
    setShowEditModal(true);
  };
  

  const deleteSede = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No puedes revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteSede(id,token)
        .then(() => {
          Swal.fire({
            title: "Eliminado!",
            text: "La Sede ha sido eliminado.",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) Refresgpag()
          });
        })
        .catch(() => {
          Swal.fire({
            title: "Error!",
            text: "La Sede no se ha podido Eliminar!",
            icon: "error"
          });
        });
      }
    });
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <RuterConfig />
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between items-center">
          <h1 className="text-start font-bold color-azul text-white">Administrar Sedes</h1>
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
              Agregar Sede
            </button>
          </div>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="overflow-y-auto">
              <table className="table-auto min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((item, index) => (
                    <tr key={index}>
                      {/* <td className="border border-gray-300 px-2 py-1">{item.id}</td> */}
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => {Edit(item)}} />
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => {deleteSede(item.id)}} />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{item.nombreSede}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.codigoSede}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {item.estado ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                          <FontAwesomeIcon icon={faBan} className="text-red-500" />
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{item.fechaRegistro}</td>
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
      {/* Mostrar el modal para agregar una sede */}
      {showModal && <AgregarSedeModal setShowModal={setShowModal} Refresgpag={Refresgpag} token={token} userlogued={userlogued.sub} />}
      {/* Mostrar el modal de edición */}
      {showEditModal && (
        <EditSedeModal
          setShowEditModal={setShowEditModal}
          Refresgpag={Refresgpag}
          token={token}
          item={item}
          userlogued={userlogued.sub}
        />
      )}    </div>
  );
};

export default AdministrarSedes;
