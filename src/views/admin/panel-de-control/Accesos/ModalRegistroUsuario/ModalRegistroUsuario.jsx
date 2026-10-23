import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faEyeSlash, faSearch } from '@fortawesome/free-solid-svg-icons';
import NewUser from '../model/RegisterUser';
import { ListEmpleadoDNI } from '../model/ListUserID';
import Swal from 'sweetalert2';

// Quita tildes y caracteres no alfanuméricos: "Ñañez" -> "nanez"
const normalizar = (str) =>
  (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

// Primera letra del nombre + primera palabra del apellido
const generarUsername = (nombres, apellidos) => {
  const inicial = normalizar((nombres || '').trim().charAt(0));
  const primerApellido = normalizar((apellidos || '').trim().split(/\s+/)[0]);
  return `${inicial}${primerApellido}`;
};

const RegistroUsuarioModal = ({ closeModal, token, Refresgpag }) => {
  const [documento, setDocumento] = useState('');
  const [apellidosNombres, setApellidosNombres] = useState('');
  const [idEmpleado, SetIdEmpleado] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState(true);
  const [ruc] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [creating, setCreating] = useState(false);

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

  const limpiarEmpleado = (mensaje = '') => {
    setApellidosNombres(mensaje);
    SetIdEmpleado('');
    setUsername('');
    setPassword('');
  };

  const SearchDNI = () => {
    const dni = documento.trim();
    if (!dni) return;
    setBuscando(true);
    ListEmpleadoDNI(dni, token)
      .then(empleadoData => {
        if (empleadoData.mensaje === 'No value present' || !empleadoData.idEmpleado) {
          limpiarEmpleado('Empleado no Encontrado');
        } else {
          const { idEmpleado, apellidos, nombres } = empleadoData;
          setApellidosNombres(`${apellidos} ${nombres}`);
          SetIdEmpleado(idEmpleado);
          setUsername(generarUsername(nombres, apellidos));
          setPassword(dni);
        }
      })
      .catch(error => {
        console.error('Error al buscar empleado:', error);
        limpiarEmpleado();
      })
      .finally(() => setBuscando(false));
  };

  const handleRegistrar = () => {
    if (!documento || !apellidosNombres || !username || !password || !idEmpleado) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    setCreating(true);
    NewUser(username, password, estado, ruc, idEmpleado)
      .then(() => {
        AleertSucces();
      })
      .catch(error => {
        console.error('Error', error);
        Swal.fire({
          title: "Error",
          text: "No se pudo registrar el usuario.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "Aceptar"
        });
      })
      .finally(() => setCreating(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      SearchDNI();
    }
  };

  const inputClass = "border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white";

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[400px] md:w-[600px] relative">
        <div className="azuloscurobackground flex justify-between items-center px-4 py-3">
          <h1 className="text-start font-bold text-white">Registro de Usuario</h1>
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer text-white"
            onClick={closeModal}
          />
        </div>
        <div className="container p-4">
          <div className="mb-4">
            <label className="block mb-1 font-medium">N° de Documento:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                onKeyDown={handleKeyDown}
                className={inputClass}
              />
              <button
                onClick={SearchDNI}
                disabled={buscando}
                className="azul-btn px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} />
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Apellidos y Nombres:</label>
            <input
              type="text"
              value={apellidosNombres}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Asignar Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Asignar Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4 cursor-pointer color-naranja"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2 font-medium">Estado:</label>
            <input
              type="checkbox"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              className="pointer form-checkbox text-blue-500 focus:ring-blue-500 h-5 w-5 bg-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="naranja-btn px-4 py-2 rounded-md font-bold"
              onClick={handleRegistrar}
              disabled={creating}
            >
              {creating ? 'Registrando...' : 'Registrar Datos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuarioModal;
