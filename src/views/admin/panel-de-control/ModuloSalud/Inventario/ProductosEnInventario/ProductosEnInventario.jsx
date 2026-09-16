import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../../../store/auth';
import Swal from 'sweetalert2';
import { getMedicamentos } from './model/ProductosEnInventario';
import CrearMedicamentoModal from './CrearMedicamentoModal/CrearMedicamentoModal';
import DetalleMedicamentoModal from './DetalleMedicamentoModal/DetalleMedicamentoModal';
import IngresoStockModal from './IngresoStockModal/IngresoStockModal';
import { FloatingInput, FloatingSelect } from './components/FloatingField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

const normalizeText = (text) => {
  return (text ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
};

const contains = (fieldValue, term) => {
  const words = normalizeText(term).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const normalizedField = normalizeText(fieldValue);
  return words.every(word => normalizedField.includes(word));
};

const UMBRAL_CERCANIA_PORCENTAJE = 20;

const getEstadoStock = (stockActual, stockMinimo) => {
  const actual = stockActual ?? 0;
  const minimo = stockMinimo ?? 0;
  if (minimo <= 0) return null;
  if (actual <= minimo) return 'critico';
  const porcentajeSobreMinimo = ((actual - minimo) / minimo) * 100;
  if (porcentajeSobreMinimo <= UMBRAL_CERCANIA_PORCENTAJE) return 'cercano';
  return null;
};

const FILTRO_STOCK_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'sin-stock', label: 'Sin stock' },
  { value: 'bajo-minimo', label: 'Stock menor al mínimo' },
];

const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);
  if (current <= 3) { start = 2; end = 4; }
  if (current >= total - 2) { start = total - 3; end = total - 1; }

  const pages = new Set([1, total]);
  for (let i = start; i <= end; i++) pages.add(i);
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const withDots = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) withDots.push('...');
    withDots.push(p);
    prev = p;
  }
  return withDots;
};

export default function ProductosEnInventario() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(0);
  const [searchNombre, setSearchNombre] = useState('');
  const [searchPresentacion, setSearchPresentacion] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  useEffect(() => {
    setLoading(true);
    getMedicamentos(token)
      .then(response => {
        setData(Array.isArray(response) ? response.sort((a, b) => a.nombre.localeCompare(b.nombre)) : []);
      })
      .catch(error => {
        console.error('Error', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la lista de medicamentos',
          icon: 'error',
          confirmButtonColor: '#084788',
          confirmButtonText: 'Aceptar'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refres]);

  const Refresgpag = () => {
    setRefresh(refres + 1);
  };

  const openDetalle = (id) => {
    setSelectedId(id);
    setShowDetalleModal(true);
  };

  const openIngreso = (item, e) => {
    e.stopPropagation();
    setSelectedMedicamento(item);
    setShowIngresoModal(true);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const nombreMatch = contains(item.nombre, searchNombre);
    const presentacionMatch = contains(item.presentacion, searchPresentacion);
    const stockActual = item.stockActual ?? 0;
    let stockMatch = true;
    if (filtroStock === 'sin-stock') stockMatch = stockActual === 0;
    if (filtroStock === 'bajo-minimo') stockMatch = stockActual < (item.stockMinimo ?? 0);
    return nombreMatch && presentacionMatch && stockMatch;
  });

  const totalPages = Math.max(Math.ceil(filteredData.length / recordsPerPage), 1);
  const pageStart = filteredData.length === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const pageEnd = Math.min(currentPage * recordsPerPage, filteredData.length);
  const visibleData = filteredData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleGoToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto mt-6 mb-12">
      <div className="mx-auto bg-white rounded-xl overflow-hidden shadow-xl w-[95%] border border-gray-100">
        <div className="p-5">
          <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
            <div>
              <h1 className="text-lg font-bold" style={{ color: '#233245' }}>Productos en Inventario</h1>
              <p className="text-sm text-gray-500">{filteredData.length} resultados</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Productos por hoja</span>
                <select
                  className="border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#084788]"
                  value={recordsPerPage}
                  onChange={handleChangeRecordsPerPage}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="azul-btn font-semibold py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
              >
                <FontAwesomeIcon icon={faPlus} />
                Agregar Medicamento
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <FloatingInput
              id="filtro-nombre"
              label="Buscar por nombre"
              value={searchNombre}
              onChange={handleFilterChange(setSearchNombre)}
            />
            <FloatingInput
              id="filtro-presentacion"
              label="Buscar por presentación"
              value={searchPresentacion}
              onChange={handleFilterChange(setSearchPresentacion)}
            />
            <FloatingSelect
              id="filtro-stock"
              label="Estado de stock"
              value={filtroStock}
              onChange={handleFilterChange(setFiltroStock)}
              options={FILTRO_STOCK_OPTIONS}
            />
          </div>

          {loading ? (
            <p className="text-center py-6">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N°</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Presentación</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Stock</th>
                    <th className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleData.map((item, index) => {
                    const estadoStock = getEstadoStock(item.stockActual, item.stockMinimo);
                    return (
                      <tr
                        key={item.id ?? index}
                        onClick={() => openDetalle(item.id)}
                        className="cursor-pointer hover:bg-blue-50 transition-colors"
                        title="Click para ver el detalle"
                      >
                        <td className="px-3 py-3 text-gray-500">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                        <td className="px-3 py-3 font-semibold text-gray-800">{item.nombre}</td>
                        <td className="px-3 py-3 text-gray-700">{item.presentacion}</td>
                        <td className="px-3 py-3 text-gray-700">{item.stockMinimo}</td>
                        <td className="px-3 py-3 font-semibold cursor-default" onClick={(e) => e.stopPropagation()}>
                          <span className="inline-flex items-center gap-2">
                            {estadoStock && (
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${estadoStock === 'critico' ? 'bg-red-400' : 'bg-orange-400'}`}
                                title={estadoStock === 'critico' ? 'Stock igual o menor al mínimo' : 'Stock cerca del mínimo'}
                              />
                            )}
                            <span className={estadoStock === 'critico' ? 'text-red-600' : estadoStock === 'cercano' ? 'text-orange-600' : 'text-gray-700'}>
                              {item.stockActual ?? 0}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center cursor-default" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => openIngreso(item, e)}
                            title="Agregar Stock"
                            className="w-7 h-7 rounded-full inline-flex items-center justify-center azul-btn"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center px-2 py-8 text-gray-500">No se encontraron medicamentos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center flex-wrap gap-3 mt-5">
            <p className="text-sm text-gray-500">
              {filteredData.length === 0
                ? 'Mostrando 0 de 0 productos'
                : `Mostrando ${pageStart} - ${pageEnd} de ${filteredData.length} productos`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleGoToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-300 text-gray-500 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>
              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                page === '...' ? (
                  <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handleGoToPage(page)}
                    className="w-8 h-8 rounded-lg text-sm font-medium"
                    style={page === currentPage
                      ? { backgroundColor: '#233245', color: '#ffffff' }
                      : { backgroundColor: '#e1e7f0', color: '#084788' }}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handleGoToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-300 text-gray-500 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && <CrearMedicamentoModal setShowModal={setShowCreateModal} Refresgpag={Refresgpag} token={token} />}
      {showDetalleModal && <DetalleMedicamentoModal closeModal={() => setShowDetalleModal(false)} id={selectedId} token={token} Refresgpag={Refresgpag} />}
      {showIngresoModal && <IngresoStockModal closeModal={() => setShowIngresoModal(false)} Refresgpag={Refresgpag} token={token} medicamento={selectedMedicamento} usuarioRegistro={userlogued?.sub} />}
    </div>
  );
}
