import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faSyncAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ComboboxSedes, ComboboxEmpresas, ComboboxContratas } from './Modal/Combobox';
import { GetListREport } from './model/getlistreport';
import { useAuthStore } from '../../../../store/auth';
import Modal from './Modal/Modal';

const HistorialPaciente = () => {
  const ListSedes = ComboboxSedes();
  const ListEmpresa = ComboboxEmpresas();
  const ListContrata = ComboboxContratas();
  const [sede, setSede] = useState('');
  const [empresauser, setEmpresauser] = useState([])
  const [contrataauser, setContratauser] = useState([])
  useEffect(() => {
    if (ListSedes.length > 0) {
      setSede(ListSedes[0].cod_sede);
    }
    if (ListEmpresa.length > 0) {
      if (!(ListEmpresa[0].ruc === '0')) {
        setEmpresauser(ListEmpresa[0].razonSocial)
        setEmpresa(ListEmpresa[0].ruc)
        return
      }
    }
    if (ListContrata.length > 0) {
      if (!(ListContrata[0].ruc === '0')) {
        setContratauser(ListContrata[0].razonSocial)
        setContrata(ListContrata[0].ruc)
        return
      }
    }
  }, [ListSedes,ListEmpresa]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(1);
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const views = useAuthStore(state => state.listView);

  const AccessUpload= views.some(view => view.id === 102);
  const AccesDownload = views.some(view => view.id === 103);
  const AccesDelete = views.some(view => view.id === 104);
  const Acces = {
    Upload: AccessUpload,
    Download: AccesDownload,
    Delete: AccesDelete
  }
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date();
  const options = { timeZone: 'America/Lima' };
  const formattedToday = today.toLocaleDateString('en-CA', options); 
  today.setDate(today.getDate() - 1); 
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);
  const [isReloading, setIsReloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [dnipicker, setDnipicker] = useState('')
  const [nombrespicker, setNombrespicker] = useState('')
  const [empresa, setEmpresa] = useState('');
  const [contrata, setContrata] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [name, setName] = useState('')
  const [apell, setApell] = useState('')
  //NUEVA API FECHA DE EXAMEN
  const [fecha_examen, Setfecha_examnen] = useState('')
  const [cod_suc, SetCod_suc] = useState('')

  useEffect(() => {
    
    let results = []
    if (data === null) {
      return
    }
    if (searchTerm.length > 4) {
      const isNumber = !isNaN(searchTerm[0]);

      if (isNumber) {
          // Filtrar por dni si searchTerm comienza con un número
          results = data.filter(item => item.dni.toString().includes(searchTerm));
          setFilteredData(results)
      } else {
          if (data && data.length > 0) {

            results = data.filter(item =>  (typeof item.apellidos === 'string' && item.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof item.nombres === 'string' && item.nombres.toLowerCase().includes(searchTerm.toLowerCase())))
            setFilteredData(results)
            return
          }
        return
      }
      
      return
    }
    setFilteredData([])
    
    
  }, [searchTerm]);
  

  useEffect(() => {
    setLoading(true);
    if (startDate && endDate && sede) {
      GetListREport(userlogued.sub, startDate, endDate, sede, empresa, contrata, token)
        .then(response => {
          if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
            setData([])
          } else {
            setData(response);
            setTotalPages(Math.ceil(response.length / recordsPerPage)); 
          }
        })
        .catch(error => {
          throw new Error('Network response was not ok.', error);
        })
        .finally(() => {
          setLoading(false);
          SecondPlane()
        });
    }
  }, [startDate, endDate, sede, empresa, contrata]);
  
  const SecondPlane = async () => {
    if (startDate && endDate && sede) {
        const otrasSedes = ListSedes.filter(s => s.cod_sede !== sede);
        const fetchPromises = otrasSedes.map(s => GetListREport(userlogued.sub, startDate, endDate, s.cod_sede, empresa, contrata, token));
        const otrasSedesData = await Promise.all(fetchPromises);
        const nonEmptyData = otrasSedesData.filter(data => data.length > 0);
        const allData = nonEmptyData.reduce((acc, data) => acc.concat(data), []);
        
        setData(prevData => [...prevData, ...allData]);
        
      }
    }
  

    
  const openModal = (dni,nombres,apellidos, fecha_examen, cod_suc) => {
    setDnipicker(dni)
    //cambian por ser primero apellido
    setName(apellidos)
    setApell(nombres)
    setNombrespicker(`${nombres} ${apellidos}`)
    Setfecha_examnen(fecha_examen)
    SetCod_suc(cod_suc)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
    setTotalPages(Math.ceil(data.length / parseInt(e.target.value)));
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {

    setEndDate(e.target.value);
  };



  const reloadTable = () => {
    setIsReloading(true);

    setLoading(true);
    GetListREport(userlogued.sub, startDate, endDate, sede, token)
      .then(response => {
        if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
          setData([])
        } else {
          setData(response);
          setTotalPages(Math.ceil(response.length / recordsPerPage)); 
        }
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
        setIsReloading(false); 
      });
  };
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  
  const visiblePages = () => {
    const totalVisiblePages = 5; 
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    let startPage = currentPage - halfVisiblePages;
    startPage = Math.max(startPage, 1); 
    const endPage = startPage + totalVisiblePages - 1;
    return Array.from({ length: totalVisiblePages }, (_, i) => startPage + i).filter(page => page <= totalPages);
  };

  const startIdx = (currentPage - 1) * recordsPerPage;
  const endIdx = startIdx + recordsPerPage;
  const currentData = data.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        
        <div className="px-4 py-2 azuloscurobackground flex justify-between items-center"> 

          <h1 className="text-start font-bold color-azul text-white">Reporte de Pacientes</h1>
          <button onClick={reloadTable} className="focus:outline-none ml-3 relative">
            {loading && <div className="absolute inset-0 opacity-50 rounded-md"></div>}
            <FontAwesomeIcon icon={faSyncAlt} className={`text-white cursor-pointer tamañouno ${loading ? 'opacity-50' : ''}`} />
          </button>
        </div>
   
        {/* filtros */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center md:space-x-4 flex-wrap">
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2 fw-bold">Mostrar</span>
            <select className="border pointer border-gray-300 rounded-md px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                      <option value={-1}>Todos</option>
                    </select>
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Fecha inicio:</strong></span>
            <input
              type="date"
              className="pointer border border-gray-300 rounded-md px-2 py-1 mb-2 md:mb-0 md:mr-4"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Fecha fin:</strong></span>
            <input
              type="date"
              className="pointer border border-gray-300 rounded-md px-2 py-1 mb-2 md:mb-0 md:mr-4"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Sedes:</strong></span>
            <select
              className="pointer border border-gray-300 px-3 py-2 rounded-md mb-2 md:mb-0 md:mr-4"
              onChange={(e) => setSede(e.target.value)}
              required
              value={sede}
            >
              <option value="">Seleccionar</option>
              {ListSedes?.map((option) => (
                <option key={option.cod_sede} value={option.cod_sede}>{option.nombre_sede}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Empresa:</strong></span>
            <select
              className={`pointer border border-gray-300 px-3 py-2 rounded-md mb-2 md:mb-0 md:mr-4 ${ListEmpresa.some(option => option.ruc === '0') ? '!opacity-60' : ''}`}
              onChange={(e) => {
                setEmpresa(e.target.value);
                setContrata('');
              }}
              disabled={ListEmpresa.some(option => option.ruc === '0')}
              value={empresa}
            >
              <option value="">Seleccionar</option>
              {ListEmpresa?.map((option,index) => (
                <option key={index} value={option.ruc}>{option.razonSocial}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Contrata:</strong></span>
            <select
              className={`pointer border border-gray-300 px-3 py-2 rounded-md mb-2 md:mb-0 ${ListContrata.some(option => option.ruc === '0') ? '!opacity-60' : ''}`}
              onChange={(e) => {
                setContrata(e.target.value);
                setEmpresa('');
              }}
              disabled={ListContrata.some(option => option.ruc === '0')}
              value={contrata}
            >
              <option value="">Seleccionar</option>
              {ListContrata?.map((option,index) => (
                <option key={index} value={option.ruc}>{option.razonSocial}</option>
              ))}
            </select>
          </div>
        <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
          <span className="mr-2"><strong>Buscar:</strong></span>
            <input
              type="text"
              className="border rounded-md px-2 py-1 mb-2 md:mb-0 md:mr-4"
              placeholder="Buscar por DNI o nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      


        </div>
        <div className="overflow-x-auto p-3">
        {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-3 py-2">Acción</th>
                  <th className="border border-gray-300 px-3 py-2">DNI</th>
                  <th className="border border-gray-300 px-3 py-2">Apellidos</th>
                  <th className="border border-gray-300 px-3 py-2">Nombres</th>
                  <th className="border border-gray-300 px-3 py-2">Fecha Examen</th>
                  <th className="border border-gray-300 px-3 py-2">Sucursal</th>
                </tr>
              </thead>
              <tbody>
              {searchTerm ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2">
                      <button onClick={() => { openModal(item.dni, item.apellidos, item.nombres, item.fecha_examen, item.codigo_sucursal) }} className="focus:outline-none">
                        <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{item.dni}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.apellidos}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.nombres}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.fecha_examen}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.codigo_sucursal}</td>
                  </tr>
                ))
              ) : (
                currentData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-2">
                      <button onClick={() => { openModal(item.dni, item.apellidos, item.nombres, item.fecha_examen, item.codigo_sucursal) }} className="focus:outline-none">
                        <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{item.dni}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.apellidos}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.nombres}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.fecha_examen}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.codigo_sucursal}</td>
                  </tr>
                ))
              )}

              </tbody>

            </table>
          )}
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
      
      {isModalOpen && <Modal closeModal={closeModal} user={userlogued.sub} iduser={userlogued.id_user} start={fecha_examen} end={endDate} sede={cod_suc} dni={dnipicker} nombre={nombrespicker} empresa={empresa} contrata={contrata} token={token} name={name} apell={apell}  Acces={Acces} />}
    </div>
  );
};

export default HistorialPaciente;