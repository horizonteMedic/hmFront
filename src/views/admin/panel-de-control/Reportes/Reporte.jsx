import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ComboboxSedes } from './Modal/Combobox';
import { GetListREport } from './model/getlistreport';
import { useAuthStore } from '../../../../store/auth';
import Modal from './Modal/Modal';

const HistorialPaciente = () => {
  const pacientes = [
    { ac: '001', dni: '12345678', apellidos: 'García', nombres: 'María', fechaExamen: '2024-04-01' },
    { ac: '002', dni: '23456789', apellidos: 'Rodríguez', nombres: 'Juan', fechaExamen: '2024-04-05' },
    { ac: '003', dni: '34567890', apellidos: 'Martínez', nombres: 'Ana', fechaExamen: '2024-04-10' }
  ];

  const ListSedes = ComboboxSedes();
  const [sede, setSede] = useState('')
  console.log(ListSedes)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refres, setRefresh] = useState(1)

  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const today = new Date();
  const options = { timeZone: 'America/Lima' };
  const formattedToday = today.toLocaleDateString('en-CA', options); 
  today.setDate(today.getDate() - 1); 
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);

  useEffect(() => {
    setLoading(true)
    GetListREport(userlogued.sub,startDate,endDate,sede,token)
    .then(response => {
      console.log(response)
      if (response.mensaje === 'No value present' || response.mensaje === 'Cannot invoke "java.util.List.stream()" because "listadoHP" is null') {
        console.log('no hay na')
      }
      else{
        console.log('a')
        setData(response)
      }
    })
    .catch(error => {
      throw new Error('Network response was not ok.',error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[startDate])


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
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

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Reporte de Pacientes</h1>
        </div>
        <div className="flex justify-between items-center ml-4 pt-3">
          <div className="flex items-center">
            <span>Mostrar</span>
            <select className="border pointer border-gray-300 rounded-md ml-2 px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className='ml-2'> registros </span>
            <span className="ml-12"><strong>Fecha inicio: </strong></span>
            <input
              type="date"
              className="pointer border border-gray-300 rounded-md ml-2 px-2 py-1"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span className="ml-12"><strong>Fecha fin:</strong></span>
            <input
              type="date"
              className=" pointer border border-gray-300 rounded-md ml-2 px-2 py-1"
              value={endDate}
              onChange={handleEndDateChange}
            />
            <span className="ml-12"><strong>Buscar por DNI: </strong></span>
            <input
              type="text"
              className="pointer border border-gray-300 rounded-md ml-2 px-2 py-1"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="focus:outline-none ml-2">
              <FontAwesomeIcon icon={faSearch} className="text-blue-500 cursor-pointer" />
            </button>
            <span className="ml-12"><strong>Sedes </strong></span>
              <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                id="tipoDocumento"
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                onChange={(e) => setSede(e.target.value)}
                required
              >
                <option value="">Seleccionar</option>
                {ListSedes?.map((option) => (
                  <option key={option.cod_sede} value={option.cod_sede}>{option.nombre_sede}</option>
                ))}
              </select>
            
          </div>
        </div>
        <div className="overflow-x-auto p-3">
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
              {data?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-3 py-2">
                    <button onClick={openModal} className="focus:outline-none">
                      <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" />
                    </button>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">{item.dni}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.apellidos}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.nombres}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.fecha_examen}</td>
                </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default HistorialPaciente;
