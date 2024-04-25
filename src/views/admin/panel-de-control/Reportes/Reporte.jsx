import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de FontAwesome

import Modal from './Modal/Modal'; // Importa el componente del modal aquí

const HistorialPaciente = () => {
  // Datos de pacientes
  const pacientes = [
    { ac: '001', dni: '12345678', apellidos: 'García', nombres: 'María', fechaExamen: '2024-04-01' },
    { ac: '002', dni: '23456789', apellidos: 'Rodríguez', nombres: 'Juan', fechaExamen: '2024-04-05' },
    { ac: '003', dni: '34567890', apellidos: 'Martínez', nombres: 'Ana', fechaExamen: '2024-04-10' }
    // Puedes agregar más pacientes aquí si lo deseas
  ];

  // Estado para controlar la apertura y cierre del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-4 mb-12">
      
      <div className="overflow-hidden shadow-xl p-6 card border border-gray-300  rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span>Mostrar 10 registros</span>
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
              {pacientes.map((paciente, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-3 py-2">
                    <button onClick={openModal}>
                      <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer" /> {/* Usa FontAwesomeIcon para el icono */}
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
      {isModalOpen && <Modal closeModal={closeModal} />} {/* Renderiza el modal cuando el estado es true */}
    </div>
  );
};

export default HistorialPaciente;
