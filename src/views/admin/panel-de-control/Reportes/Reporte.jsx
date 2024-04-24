import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal/Modal';

const HistorialPaciente = () => {
  const pacientes = [
    { ac: '001', dni: '12345678', apellidos: 'García', nombres: 'María', fechaExamen: '2024-04-01' },
    { ac: '002', dni: '23456789', apellidos: 'Rodríguez', nombres: 'Juan', fechaExamen: '2024-04-05' },
    { ac: '003', dni: '34567890', apellidos: 'Martínez', nombres: 'Ana', fechaExamen: '2024-04-10' }
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(5); // Estado para almacenar la cantidad de registros por página

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeRecordsPerPage = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl p-6 w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span>Mostrar</span>
            <select className="border border-gray-300 rounded-md ml-2 px-2 py-1" value={recordsPerPage} onChange={handleChangeRecordsPerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span>registros</span>
          </div>
          <div className="relative">
            <input type="text" id="search" className="border border-gray-300 px-3 py-1 rounded-md focus:outline-none" placeholder="Buscar" />
          </div>
        </div>
        <div className="overflow-x-auto">
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
              {pacientes.slice(0, recordsPerPage).map((paciente, index) => (
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
