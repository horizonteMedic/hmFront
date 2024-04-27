import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal/Modal';

const HistorialPaciente = () => {
  const pacientes = [
    { ac: '001', dni: '12345678', apellidos: 'García', nombres: 'María', fechaExamen: '2024-04-01' },
    { ac: '002', dni: '23456789', apellidos: 'Rodríguez', nombres: 'Juan', fechaExamen: '2024-04-05' },
    { ac: '003', dni: '34567890', apellidos: 'Martínez', nombres: 'Ana', fechaExamen: '2024-04-10' }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5); // Estado para almacenar la cantidad de registros por página
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.dni.includes(searchTerm)
  );

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between ">
          <h1 className="text-center text-2xl font-bold color-azul text-white">Reporte de Pacientes</h1>
        </div>
        <div className="flex justify-between items-center ml-4 pt-3">
          <div>
            <span>Mostrar</span>
            <select className="border border-gray-300 rounded-md ml-2 px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span> registros</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI"
              className="border border-gray-300 rounded-md ml-2 px-2 py-1"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="ml-2 focus:outline-none">
              <FontAwesomeIcon icon={faSearch} className="text-blue-500 cursor-pointer" />
            </button>
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
              {filteredPacientes.slice(0, recordsPerPage).map((paciente, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-3 py-2">
                    <button onClick={openModal} className="focus:outline-none">
                      <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" />
                    </button>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">{paciente.dni}</td>
                  <td className="border border-gray-300 px-3 py-2">{paciente.apellidos}</td>
                  <td className="border border-gray-300 px-3 py-2">{paciente.nombres}</td>
                  <td className="border border-gray-300 px-3 py-2">{paciente.fechaExamen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default HistorialPaciente;
