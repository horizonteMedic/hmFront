import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faEye, faEyeSlash, faSearch, faSpinner, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import NewUser from '../model/RegisterUser';
import { ListEmpleadoDNI } from '../model/ListUserID';
import { generarUsername, validarRegistro, interpretarErrorRegistro } from './validacionesRegistro';

const inputBase = "border px-3 py-2 rounded-md w-full focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";
const inputClass = (conError) => `${inputBase} ${conError ? 'border-red-500' : 'border-gray-300'}`;

const MensajeError = ({ texto }) =>
  texto ? <p className="text-red-600 text-sm mt-1" role="alert">{texto}</p> : null;

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
  const [registrado, setRegistrado] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');

  // Evita doble envío aunque el usuario haga doble clic antes de que React re-renderice
  const enviandoRef = useRef(false);

  const bloqueado = creating || registrado;

  const limpiarError = (campo) =>
    setErrores((prev) => (prev[campo] ? { ...prev, [campo]: undefined } : prev));

  const limpiarEmpleado = () => {
    setApellidosNombres('');
    SetIdEmpleado('');
    setUsername('');
    setPassword('');
  };

  const handleDocumentoChange = (e) => {
    setDocumento(e.target.value);
    // Si cambia el documento, el empleado cargado ya no corresponde: evita registrar con un id viejo
    if (idEmpleado) limpiarEmpleado();
    setErrores({});
    setErrorServidor('');
  };

  const SearchDNI = () => {
    const dni = documento.trim();
    if (bloqueado || buscando) return;
    if (!dni) {
      setErrores({ documento: 'Ingresa el N° de documento del empleado.' });
      return;
    }

    setBuscando(true);
    setErrores({});
    setErrorServidor('');
    limpiarEmpleado();

    ListEmpleadoDNI(dni, token)
      .then(empleadoData => {
        if (empleadoData?.codigo >= 500) {
          setErrores({ documento: 'No se pudo consultar al empleado en este momento. Inténtalo nuevamente.' });
        } else if (!empleadoData || empleadoData.mensaje === 'No value present' || !empleadoData.idEmpleado) {
          setErrores({ documento: 'No se encontró ningún empleado con ese documento.' });
        } else {
          const { idEmpleado: id, apellidos, nombres } = empleadoData;
          setApellidosNombres(`${apellidos} ${nombres}`);
          SetIdEmpleado(id);
          setUsername(generarUsername(nombres, apellidos));
          setPassword(dni);
        }
      })
      .catch(() => {
        setErrores({ documento: 'No se pudo conectar con el servidor para buscar al empleado. Revisa tu conexión.' });
      })
      .finally(() => setBuscando(false));
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    if (enviandoRef.current || bloqueado) return;

    const nuevosErrores = validarRegistro({ idEmpleado, username, password });
    setErrorServidor('');
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});

    enviandoRef.current = true;
    setCreating(true);

    NewUser(username.trim(), password, estado, ruc, idEmpleado)
      .then(() => {
        setRegistrado(true);
        return Swal.fire({
          title: "¡Éxito!",
          text: `Se creó el usuario "${username.trim()}" correctamente.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false
        });
      })
      .then(() => {
        closeModal();
        Refresgpag();
      })
      .catch(error => {
        const { mensaje, campo } = interpretarErrorRegistro(error);
        if (campo) setErrores({ [campo]: mensaje });
        setErrorServidor(mensaje);
      })
      .finally(() => {
        enviandoRef.current = false;
        setCreating(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      SearchDNI();
    }
  };

  const handleClose = () => {
    if (!bloqueado) closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-md w-full max-w-[600px] max-h-full overflow-y-auto relative">
        <div className="azuloscurobackground flex justify-between items-center px-4 py-3">
          <h1 className="text-start font-bold text-white">Registro de Usuario</h1>
          <FontAwesomeIcon
            icon={faTimes}
            className={`text-white ${bloqueado ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleClose}
          />
        </div>

        <form className="container p-4" onSubmit={handleRegistrar} noValidate>
          <fieldset disabled={bloqueado} className="contents">
            {errorServidor && (
              <div
                className="flex items-start gap-2 mb-4 p-3 rounded-md border border-red-300 bg-red-50 text-red-700 text-sm"
                role="alert"
              >
                <FontAwesomeIcon icon={faExclamationCircle} className="mt-0.5" />
                <span>{errorServidor}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 font-medium">N° de Documento:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={documento}
                  onChange={handleDocumentoChange}
                  onKeyDown={handleKeyDown}
                  className={inputClass(errores.documento)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={SearchDNI}
                  disabled={buscando}
                  className="azul-btn px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={buscando ? faSpinner : faSearch} spin={buscando} />
                  {buscando ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              <MensajeError texto={errores.documento} />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Apellidos y Nombres:</label>
              <input
                type="text"
                value={apellidosNombres}
                readOnly
                placeholder="Se completa al buscar el documento"
                className={`${inputBase} border-gray-300 bg-gray-100`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Asignar Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); limpiarError('username'); setErrorServidor(''); }}
                  className={inputClass(errores.username)}
                  autoComplete="off"
                />
                <MensajeError texto={errores.username} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Asignar Password:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); limpiarError('password'); setErrorServidor(''); }}
                    className={`${inputClass(errores.password)} pr-10`}
                    autoComplete="new-password"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4 cursor-pointer color-naranja"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                <MensajeError texto={errores.password} />
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

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={buscando}
                className="naranja-btn px-4 py-2 rounded-md font-bold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating && <FontAwesomeIcon icon={faSpinner} spin />}
                {creating ? 'Registrando...' : 'Registrar Datos'}
              </button>
            </div>
          </fieldset>
        </form>

        {creating && (
          <div
            className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center gap-2 cursor-wait"
            aria-live="polite"
          >
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="color-naranja" />
            <span className="font-medium text-gray-700">Registrando usuario, espera un momento...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroUsuarioModal;
