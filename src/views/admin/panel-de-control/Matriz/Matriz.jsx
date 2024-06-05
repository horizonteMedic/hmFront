import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ComboboxContrata, ComboboxSedes } from './model/Combobox';
import { GetMatrizAdmin } from './model/MatrizPOST';
import { Loading } from '../../../components/Loading';
import { useAuthStore } from '../../../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faMagnifyingGlass,faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const MatrizPostulante = () => {
  const token = useAuthStore(state => state.token);
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState({
    rucContrata: '',
    rucEmpresa: '',
    fechaInicio: '',
    fechaFinal: '',
    sede: ''
  });
  const [data, setData] = useState([]);
  const [head, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [recordsPerPage, setRecordsPerPage] = useState(15);

  const today = new Date().toISOString().split('T')[0];
  const Contratas = ComboboxContrata();
  const Sedes = ComboboxSedes();

  useEffect(() => {
    if (today) {
      setDatos(prevDatos => ({
        ...prevDatos,
        fechaInicio: today,
        fechaFinal: today,
      }));
    }
  }, [today]);

  useEffect(() => {
    const ContrataDefiner = Contratas.find(contrata => contrata.ruc === '20602703119');
    const SedeDefiner = Sedes.find(sedes => sedes.cod_sede === 'T-NP');

    if (ContrataDefiner) {
      setDatos(prevDatos => ({
        ...prevDatos,
        rucContrata: ContrataDefiner,
      }));
    }

    if (SedeDefiner) {
      setDatos(prevDatos => ({
        ...prevDatos,
        sede: SedeDefiner
      }));
    }
  }, [Contratas, Sedes]);

  const handleChange = (e) => {
    const { name } = e.target;
    const selectedOption = JSON.parse(e.target.value);
    setDatos({
      ...datos,
      [name]: selectedOption,
    });
  };

  const SubmitAPI = () => {
    setLoading(true);
    const datosapi = {
      rucContrata: datos.rucContrata.ruc,
      rucEmpresa: '',
      fechaInicio: datos.fechaInicio,
      fechaFinal: datos.fechaFinal,
      sede: datos.sede.cod_sede
    };
    GetMatrizAdmin(datosapi, token)
      .then(response => {
        setData(response);
        const headers = Object.keys(response[0]);
        setHeaders(headers);
        setTotalPages(Math.ceil(response.length / recordsPerPage)); 
      })
      .catch(error => {
        console.log('ocurrio un telible Error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataFile = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataFile, 'matriz_postulante.xlsx');
  };

  //Paginación
  const visiblePages = () => {
    const totalVisiblePages = 5; 
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    let startPage = currentPage - halfVisiblePages;
    startPage = Math.max(startPage, 1); 
    const endPage = startPage + totalVisiblePages - 1;
    return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
    setTotalPages(Math.ceil(data.length / parseInt(e.target.value)));
  };

  const startIdx = (currentPage - 1) * recordsPerPage;
  const endIdx = startIdx + recordsPerPage;
  const currentData = data.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
        <h1 className="text-start font-bold color-azul text-white">Matriz Postulante</h1>
        <div className="flex items-center gap-4">
        <button onClick={exportToExcel} className="verde-btn px-4 py-1 rounded-md">
            <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
            Exportar a Excel
          </button>
          <select
            className="border pointer border-gray-300 rounded-md px-1"
            value={recordsPerPage}
            onChange={handleChangeRecordsPerPage}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
         
        </div>
      </div>
        {/* filtros */}
    {/* filtros */}
    <div className="flex flex-col flex-grow p-6">
            <p className="font-semibold">R.U.C. Contrata</p>
            <input
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
              type="text"
              value={datos.rucContrata ? JSON.stringify(datos.rucContrata.razonSocial) : ''}
              onChange={handleChange}
              disabled
              name='rucContrata' />
          </div>
    <div className="flex flex-wrap gap-4 p-6">
       
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Sede</p>
            <select
              value={datos.sede ? JSON.stringify(datos.sede) : ''}
              onChange={handleChange}
              name='sede'
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Sede</option>
              {Sedes.map((option) => (
                <option key={option.cod_sede} value={JSON.stringify(option)}>{option.nombre_sede}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Fecha Inicio</p>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={datos.fechaInicio}
              onChange={(e) => setDatos({
                ...datos,
                fechaInicio: e.target.value,
              })}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Fecha Fin</p>
            <input
              type="date"
              id="fechaFin"
              name="fechaFinal"
              value={datos.fechaFinal}
              onChange={(e) => setDatos({
                ...datos,
                fechaFinal: e.target.value,
              })}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">Matrices</p>
            <select
              name='sede'
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar...</option>
              <option value="Matriz-1">Matriz Administrativa</option>
              <option value="">Matriz 2</option>
            </select>
          </div>
          <div className="flex flex-col flex-grow justify-end">
            <button onClick={SubmitAPI} className="bg-blue-900 mt-4 text-white px-4 py-2 rounded-md">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
              Buscar Matriz
            </button>
          </div>
        </div>


        
        {/* Tabla de datos */}
        <div className="overflow-x-auto p-3">
          <table className="w-full border border-gray-300">
          <thead>
            <tr>
              {head.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  {head.map((header) => (
                    <td key={header} className="border border-gray-300 px-4 py-2">{item[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center p-4">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mx-1 px-3 py-1 naranjabackgroud text-white rounded-md">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {/* Mostrar números de página */}
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
      {loading && <Loading />}
    </div>
  );
};

export default MatrizPostulante;

