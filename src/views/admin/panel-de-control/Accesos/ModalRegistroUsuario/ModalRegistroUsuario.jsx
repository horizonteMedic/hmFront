import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Importa los nuevos iconos
import NewUser from '../model/RegisterUser';
import { ListEmpleadoDNI } from '../model/ListUserID';
import Swal from 'sweetalert2';

const RegistroUsuarioModal = ({ closeModal, token, Refresgpag }) => {
  const [documento, setDocumento] = useState('');
  const [apellidosNombres, setApellidosNombres] = useState('');
  const [idEmpleado, SetIdEmpleado] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState(true);
  const [empresaContrata, setEmpresaContrata] = useState('');
  const [ruc, setRuc] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  };

  function AleertSucces() {
    Swal.fire({
      title: "¡Exito!",
      text: "Se ha creado a un Nuevo Usuario",
      icon: "success",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        closeModal();
        Refresgpag();
      }
    });
  }

  const SearchDNI = () => {
    ListEmpleadoDNI(documento, token)
      .then(empleadoData => {
        if (empleadoData.mensaje === 'No value present') {
          setApellidosNombres('Empleado no Encontrado');
        } else {
          const { idEmpleado, apellidos, nombres } = empleadoData;
          setApellidosNombres(`${apellidos} ${nombres}`);
          SetIdEmpleado(idEmpleado);
        }
      })
      .catch(error => {
        console.error('Error al buscar empleado:', error);
        setApellidosNombres('');
      });
  };


  const handleRegistrar = () => {
    NewUser(username, password, estado, ruc, idEmpleado)
      .then(data => {
        AleertSucces();
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const handleApellidosNombresChange = (e) => {
    const inputValue = e.target.value;
    setApellidosNombres(capitalizeWords(inputValue));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md  w-[400px] md:w-[880px] relative">

        <FontAwesomeIcon
            icon={faTimes}
            className="absolute top-0 right-0 m-3 cursor-pointer  color-blanco"
            onClick={closeModal}
        />
      <div className="p azuloscurobackground flex justify-between p-3.5">
        <h1 className="text-start font-bold color-azul text-white">Registro de Usuario</h1>
      </div>
      <div className='container p-4'>
        <div className="mb-4">
          <label className="block mb-1">N° de Documento:</label>
          <div className="flex">
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="border border-gray-300 px-2 py-1 mr-2 w-1/2"
            />
            <button onClick={SearchDNI} className="border border-gray-300 px-2 py-1">Buscar</button>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label className="block mb-1">Apellidos y Nombres:</label>
            <input
              type="text"
              value={apellidosNombres}
              onChange={handleApellidosNombresChange}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4 cursor-pointer color-naranja"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

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
        
        <button
          className="naranja-btn px-4 py-2 rounded-md"
          onClick={handleRegistrar}
        >
          Registrar Datos
        </button>
      </div>
    </div>
  </div>

  );
};

export default RegistroUsuarioModal;
