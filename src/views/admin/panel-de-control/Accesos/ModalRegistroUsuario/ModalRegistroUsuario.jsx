import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const RegistroUsuarioModal = ({ closeModal }) => {
  const [documento, setDocumento] = useState('');
  const [apellidosNombres, setApellidosNombres] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState(false);
  const [empresaContrata, setEmpresaContrata] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [sede, setSede] = useState('');

  const handleRegistrar = () => {
    // Aquí puedes realizar la lógica para registrar los datos del usuario
    // Por ejemplo, enviar una solicitud al servidor
    // y luego cerrar el modal
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px] relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500"
          onClick={closeModal}
        />
        <h1 className="text-2xl font-bold mb-4">Registro de Usuario</h1>
        <div className="mb-4">
          <label className="block mb-1">N° de Documento:</label>
          <div className="flex">
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="border border-gray-300 px-2 py-1 mr-2 w-1/2"
            />
            <button className="border border-gray-300 px-2 py-1">Buscar</button>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label className="block mb-1">Apellidos y Nombres:</label>
            <input
              type="text"
              value={apellidosNombres}
              onChange={(e) => setApellidosNombres(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Asignar Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label className="block mb-1">Asignar Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Razon Social:</label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Estado:</label>
          <input
            type="checkbox"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
            className="pointer mr-2"
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label className="block mb-1">Seleccione la empresa/contrata:</label>
            <select
              value={empresaContrata}
              onChange={(e) => setEmpresaContrata(e.target.value)}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            >
              <option value="">Seleccione...</option>
              {/* Opciones de empresas/contratas */}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Seleccione la sede:</label>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
            >
              <option value="">Seleccione...</option>
              {/* Opciones de sedes */}
            </select>
          </div>
        </div>
        <button
          className="azul-btn px-4 py-2 rounded-md"
          onClick={handleRegistrar}
        >
          Registrar Datos
        </button>
      </div>
    </div>
  );
};

export default RegistroUsuarioModal;
