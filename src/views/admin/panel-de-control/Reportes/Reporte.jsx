import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faSyncAlt, faChevronLeft, faChevronRight, faExpand, faCompress, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ComboboxSedes, ComboboxEmpresas, ComboboxContratas } from './Modal/Combobox';
import { GetListREport } from './model/getlistreport';
import { useAuthStore } from '../../../../store/auth';
import Modal from './Modal/Modal';
import DataUploadModal from './DataUploadModal/DataUploadModal'; 
import DataUploadModal2 from './Dataupload2/DataUploadModal2'; 

const HistorialPaciente = () => {
  const [showDataUploadModal, setShowDataUploadModal] = useState(false);
  const [showDataUploadModal2, setShowDataUploadModal2] = useState(false);

  const ListSedes = ComboboxSedes();
  const ListEmpresa = ComboboxEmpresas();
  const ListContrata = ComboboxContratas();
  const [sede, setSede] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (ListSedes.length > 0) {
      setSede(ListSedes[0].cod_sede);
    }
    if (ListEmpresa.length > 0) {
      if (!(ListEmpresa[0].ruc === '0')) {
        setEmpresa(ListEmpresa[0].ruc)
        return
      }
    }
    if (ListContrata.length > 0) {
      if (!(ListContrata[0].ruc === '0')) {
        setContrata(ListContrata[0].ruc)
        return
      }
    }
  }, [ListSedes,ListEmpresa,ListContrata]);

  const [data, setData] = useState([]);
  
  const [refres, setRefresh] = useState(1);
  const hasFetchedData = useRef(false)
  const abortController = useRef(null);
  const secondPlaneAbortController = useRef(null);

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date();
  const specificDate = new Date(2023, 0, 1); // Año 2023, mes 0 (enero), día 1
  const options = { timeZone: 'America/Lima' };
  const formattedToday1 = today.toLocaleDateString('en-CA', options); 
  const formattedToday2 = specificDate.toLocaleDateString('en-CA', options);

  today.setDate(today.getDate() - 1); 
  const [startDate, setStartDate] = useState(formattedToday2);
  const [endDate, setEndDate] = useState(formattedToday1);
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
  //para el loading
  const [porsentaje, setPorsentaje] = useState('')
  //NUEVA API FECHA DE EXAMEN
  const [fecha_examen, Setfecha_examnen] = useState('')
  const [cod_suc, SetCod_suc] = useState('')

  //Actualiza Tabla
  const [reload, Setreload] = useState(0)

  const totalSedes = ListSedes.length;

  //ACCESOS
  const Acceso = useAuthStore(state => state.listAccesos);
  const tienePermisoEnVista = (nombreVista, permiso) => {
    const vista = Acceso.find(item => item.nombre === nombreVista);
    return vista?.listaPermisos.includes(permiso) ?? false;
  };

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
  
//Esto trae todos los datos cuando se entra a la vista de reportes
  useEffect(() => {
    setDisabled(true)
    if (abortController.current) {
      abortController.current.abort(); // Cancela la solicitud anterior si existe
    }

    abortController.current = new AbortController(); // Crea un nuevo controlador de abortos
    const { signal } = abortController.current;
    setPorsentaje(`0%`)
    setLoading(true);
    if (startDate && endDate && sede) {
      GetListREport(userlogued.sub, startDate, endDate, sede, empresa, contrata, token, { signal })
        .then(response => {
          if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
            setData([])
          } else {
            const porcentajePorSede = 100 / totalSedes;
            setPorsentaje(`${porcentajePorSede}%`)
            setData(response);
            setTotalPages(Math.ceil(response.length / recordsPerPage)); 
          }
        })
        .catch(error => {
          
        })
        .finally(() => {
          if (abortController.current.signal.aborted) return;
          setLoading(false);
          SecondPlane()
        });
    }
  }, [startDate, endDate, sede, empresa, contrata, reload]);
  
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const SecondPlane = async () => {
    
    if (secondPlaneAbortController.current) {
      secondPlaneAbortController.current.abort(); // Cancela la solicitud anterior si existe
    }
    secondPlaneAbortController.current = new AbortController(); // Crea un nuevo controlador de abortos
    const { signal } = secondPlaneAbortController.current;

    if (startDate && endDate && sede) {
      
        const otrasSedes = ListSedes.filter(s => s.cod_sede !== sede);
        const fetchPromises = otrasSedes.map(s => GetListREport(userlogued.sub, startDate, endDate, s.cod_sede, empresa, contrata, token, {signal}));
        try{
          const otrasSedesData = await Promise.all(fetchPromises);
          const nonEmptyData = otrasSedesData.filter(data => data.length > 0);
          const allData = nonEmptyData.reduce((acc, data) => acc.concat(data), []);
          setData(prevData => {
            const updatedData = [...prevData, ...allData];
            setTotalPages(Math.ceil(updatedData.length / recordsPerPage)); // Recalcular totalPages
            return updatedData;
          });
          setDisabled(false)
          setPorsentaje(`100%`)


        }catch (error){
          if (error.name !== 'AbortError') {
            
          }
        }
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
    setData([])
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setData([])
    setEndDate(e.target.value);
  };



  const reloadTable = () => {
    Setreload(reload+1)
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => {
          console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false));
    }
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
  const mensajePorcentaje = `Datos cargados: ${porsentaje}`;
  
  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
      <div className="px-4 py-2 azuloscurobackground flex justify-between items-center"> 
      <h1 className="text-start font-bold color-azul text-white">Reporte de Pacientes</h1>
      
      <div className="flex items-center">
        <button className="naranja-btn  px-4 py-1 rounded flex items-center mr-3" onClick={toggleFullScreen}>
          <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} className="mr-2" />
          {isFullScreen ? 'Reducir' : 'Expandir'}
        </button>


        {tienePermisoEnVista("Reportes","Carga Masiva 1") && <button
          onClick={() => setShowDataUploadModal(true)}
          className="verde-btn px-4 py-1 rounded flex items-center mr-3"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Subir Carpeta
        </button>}

        {tienePermisoEnVista("Reportes","Carga Masiva 2") && <button
          onClick={() => setShowDataUploadModal2(true)}
          className="verde-btn px-4 py-1 rounded flex items-center mr-3"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Subir Carpeta 2
        </button>}
        
        <button onClick={reloadTable} className="focus:outline-none relative">
          {loading && <div className="absolute inset-0 opacity-50 rounded-md"></div>}
          <FontAwesomeIcon icon={faSyncAlt} className={`text-white cursor-pointer tamañouno ${loading ? 'opacity-50' : ''}`} />
        </button> 
      </div>
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
              onChange={(e) => {
                
                setSede(e.target.value)}}
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
                setData([])
                setEmpresa(e.target.value);
                setContrata('');
                setSearchTerm('')
              }}
              disabled={ListEmpresa.some(option => option.ruc === '0')}
              value={empresa}
            >
              <option value="">Seleccionar</option>
              {ListEmpresa?.map((option,index) => (
                <option key={index} value={option.ruc}>{toTitleCase(option.razonSocial)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4 md:mb-0 w-full md:w-auto">
            <span className="mr-2"><strong>Contrata:</strong></span>
            <select
              className={`pointer border border-gray-300 px-3 py-2 rounded-md mb-2 md:mb-0 ${ListContrata.some(option => option.ruc === '0') ? '!opacity-60' : ''}`}
              onChange={(e) => {
                setData([])
                setContrata(e.target.value);
                setEmpresa('');
                setSearchTerm('')
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
              className={`border rounded-md px-2 py-1 mb-2 md:mb-0 md:mr-4 ${disabled ? "bg-slate-300" : "bg-white"}`}
              placeholder="Buscar por DNI o nombre"
              disabled={disabled}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      
      </div>
      <div className='flex items-center justify-center h-full'>
        <div className='bg-green-200 rounded-lg p-2 max-w-[300px] w-full fw-bold'>
          <p className="text-black text-center">{mensajePorcentaje}</p>
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
      
      {isModalOpen && <Modal closeModal={closeModal} user={userlogued.sub} iduser={userlogued.id_user} start={fecha_examen} end={endDate} sede={cod_suc} dni={dnipicker} nombre={nombrespicker} empresa={empresa} contrata={contrata} token={token} name={name} apell={apell}  Acces={tienePermisoEnVista} />}
      {/* Modal de carga de datos */}
      {showDataUploadModal && <DataUploadModal closeModal={() => setShowDataUploadModal(false)} Sedes={ListSedes} user={userlogued.sub} token={token} />}
      {showDataUploadModal2 && <DataUploadModal2 closeModal={() => setShowDataUploadModal2(false)} Sedes={ListSedes} user={userlogued.sub} token={token} />}

    </div>
  );
};

export default HistorialPaciente;