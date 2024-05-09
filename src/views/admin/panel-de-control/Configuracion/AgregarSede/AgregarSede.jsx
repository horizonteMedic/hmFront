import React, { useState, useEffect } from 'react';
import RuterConfig from '../RuterConfig';
import { getFetch } from '../../getFetch/getFetch';
import { useAuthStore } from '../../../../../store/auth';
import AgregarSedeModal from '../AgregarSede/ModalAgregarSede/ModalAgregarSede';
import { faChevronLeft, faChevronRight, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [fecha, setFecha] = useState('');
  const [responsable, setResponsable] = useState('');
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

  const Edit = (nombre, codigo, estado, fecha, responsable) => {
    setNombre(nombre);
    setCodigo(codigo);
    setEstado(estado);
    setFecha(fecha);
    setResponsable(responsable);
    setShowEditModal(true); // Mostrar modal de edición
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
        // Aquí debes llamar a tu función para eliminar la sede
        // Ejemplo:
        // deleteSedeFunction(id, token)
        //   .then(() => {
        //     Swal.fire({
        //       title: "Eliminado",
        //       text: "La Sede ha sido eliminada.",
        //       icon: "success"
        //     }).then((result) => {
        //       if (result.isConfirmed) Refresgpag();
        //     });
        //   })
        //   .catch(() => {
        //     Swal.fire({
        //       title: "Error",
        //       text: "La Sede no se ha podido eliminar.",
        //       icon: "error"
        //     });
        //   });
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
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-4 cursor-pointer" onClick={() => Edit(item.nombre, item.codigo, item.estado, item.fecha, item.responsable)} />
                        <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => { deleteSede(item.id) }} />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{item.nombre}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.codigo}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.estado}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.fecha}</td>
                      <td className="border border-gray-300 px-2 py-1">{item.responsable}</td>
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
      {/* Mostrar el modal para agregar una sede */}
      {showModal && <AgregarSedeModal setShowModal={setShowModal} Refresgpag={Refresgpag} token={token} />}
      {/* Mostrar el modal de edición */}
      {showEditModal && (
        <EditSedeModal
          setShowEditModal={setShowEditModal}
          Refresgpag={Refresgpag}
          token={token}
          nombre={nombre}
          codigo={codigo}
          estado={estado}
          fecha={fecha}
          responsable={responsable}
        />
      )}
    </div>
  );
};

export default AdministrarSedes;
