import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { ComboboxSedes } from './Modal/Combobox';
import { GetListREport } from './model/getlistreport';
import { useAuthStore } from '../../../../store/auth';
import Modal from './Modal/Modal';

const HistorialPaciente = () => {
  const ListSedes = ComboboxSedes();
  const [sede, setSede] = useState('');

  useEffect(() => {
    if (ListSedes.length > 0) {
      setSede(ListSedes[0].cod_sede);
    }
  }, [ListSedes]);

  const pacientes = [
    { ac: '001', dni: '12345678', apellidos: 'García', nombres: 'María', fechaExamen: '2024-04-01' },
    { ac: '002', dni: '23456789', apellidos: 'Rodríguez', nombres: 'Juan', fechaExamen: '2024-04-05' },
    { ac: '003', dni: '34567890', apellidos: 'Martínez', nombres: 'Ana', fechaExamen: '2024-04-10' }
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refres, setRefresh] = useState(1);

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const today = new Date();
  const options = { timeZone: 'America/Lima' };
  const formattedToday = today.toLocaleDateString('en-CA', options); 
  today.setDate(today.getDate() - 1); 
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);
  const [isReloading, setIsReloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Estado para el número de página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas

  const [dnipicker, setDnipicker] = useState('')
  const [nombrespicker, setNombrespicker] = useState('')

  useEffect(() => {
    setLoading(true);
    if (startDate && endDate && sede) {
      GetListREport(userlogued.sub, startDate, endDate, sede, token)
        .then(response => {
          if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
            setData([])
          } else {
            setData(response);
            setTotalPages(Math.ceil(response.length / recordsPerPage)); // Calcula el número total de páginas
          }
        })
        .catch(error => {
          throw new Error('Network response was not ok.', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [startDate, endDate, sede]);

  const openModal = (dni,nombres,apellidos) => {
    setDnipicker(dni)
    setNombrespicker(`${nombres} ${apellidos}`)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Restablece la página actual cuando se cambia la cantidad de registros por página
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const filteredByDate = pacientes.filter(paciente => {
      const examDate = new Date(paciente.fechaExamen).toISOString().split('T')[0];
      return examDate >= startDate && examDate <= endDate;
    });

    const filteredByDNI = filteredByDate.filter(paciente => {
      return paciente.dni.includes(searchTerm);
    });

    setFilteredPacientes(filteredByDNI);
  }, [startDate, endDate, searchTerm]);

  const reloadTable = () => {
    setIsReloading(true); // Establece isReloading en true al iniciar la recarga

    setLoading(true);
    GetListREport(userlogued.sub, startDate, endDate, sede, token)
      .then(response => {
        if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
          console.log('no hay na');
          setData([])
        } else {
          setData(response);
          setTotalPages(Math.ceil(response.length / recordsPerPage)); // Calcula el número total de páginas
        }
      })
      .catch(error => {
        throw new Error('Network response was not ok.', error);
      })
      .finally(() => {
        setLoading(false);
        setIsReloading(false); // Establece isReloading en false cuando la recarga ha finalizado
      });
  };
  

  const startIdx = (currentPage - 1) * recordsPerPage;
  const endIdx = startIdx + recordsPerPage;
  const currentData = data.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between items-center"> {/* Agrega items-center para centrar verticalmente el icono */}
          <h1 className="text-start font-bold color-azul text-white">Reporte de Pacientes</h1>
          <button onClick={reloadTable} className="focus:outline-none ml-3 relative"> {/* Agrega el botón de recarga */}
            {loading && <div className="absolute inset-0 opacity-50 rounded-md"></div>}
            <FontAwesomeIcon icon={faSyncAlt} className={`text-white cursor-pointer tamañouno ${loading ? 'opacity-50' : ''}`} />
          </button>

        </div>
        <div className="flex justify-between items-center ml-4 pt-3">
          <div className="flex items-center">
            <span>Mostrar</span>
            <select className="border pointer border-gray-300 rounded-md ml-2 px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className='ml-2'> registros </span>
            <span className="ml-6"><strong>Fecha inicio: </strong></span>
            <input
              type="date"
              className="pointer border border-gray-300 rounded-md ml-2 px-2 py-1 w-36"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span className="ml-6"><strong>Fecha fin:</strong></span>
            <input
              type="date"
              className=" pointer border border-gray-300 rounded-md ml-2 px-2 py-1 w-36"
              value={endDate}
              onChange={handleEndDateChange}
            />
            <span className="ml-6 mr-3"><strong> Sedes:  </strong> </span>
            <select
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-90 focus:outline-none bg-white"
              onChange={(e) => setSede(e.target.value)}
              required
              value={sede}
            >
              <option value=""> Seleccionar</option>
              {ListSedes?.map((option) => (
                <option key={option.cod_sede} value={option.cod_sede}>{option.nombre_sede}</option>
              ))}
            </select>
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
        </tr>
      </thead>
      <tbody>
        {currentData.map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-3 py-2">
              <button onClick={() => {openModal(item.dni,item.apellidos,item.nombres)}} className="focus:outline-none">
                <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" />
              </button>
            </td>
            <td className="border border-gray-300 px-3 py-2">{item.dni}</td>
            <td className="border border-gray-300 px-3 py-2">{item.apellidos}</td>
            <td className="border border-gray-300 px-3 py-2">{item.nombres}</td>
            <td className="border border-gray-300 px-3 py-2">{item.fecha_examen}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

        {/* Renderiza los botones de paginación */}
        <div className="flex justify-center p-4">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="mx-1 px-3 py-1 bg-blue-500 text-white rounded-md">Anterior</button>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="mx-1 px-3 py-1 bg-blue-500 text-white rounded-md">Siguiente</button>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} user={userlogued.sub} start={startDate} end={endDate} sede={sede} dni={dnipicker} nombre={nombrespicker} token={token} />}
    </div>
  );
};

export default HistorialPaciente;