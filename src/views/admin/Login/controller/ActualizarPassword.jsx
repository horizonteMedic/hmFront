import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SubmitPasswordActualizado from '../model/SubmitPasswordActualizado';

const ActualizarPassword = () => {
    const location = useLocation();
    const email = location.state.email;
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const toggleMostrarPassword = () => {
        setMostrarPassword(!mostrarPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        SubmitPasswordActualizado(email,confirmarPassword)
        .then((data) => {
            console.log(data.id)
            NewPasswordNavigate(data.id)
        })
        .finally(()=> {setloading(false)})
        .catch((error) => {
            console.error("Error al enviar los datos:", error);
        });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mt-[-3em]">
        <div className="bg-white shadow-md rounded-lg p-8">
          <p className="text-2xl font-semibold text-center mb-6 color-azul"><strong>Actualizar Contraseña</strong></p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nuevaPassword"
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <FontAwesomeIcon
                    icon={mostrarPassword ? faEyeSlash : faEye}
                    className="m-4 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={toggleMostrarPassword}
                  />
                </div>
              </div>

            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmarPassword">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmarPassword"
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Confirmar Contraseña"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={mostrarPassword ? faEyeSlash : faEye}
                  className="absolute top-0 right-0 m-4 cursor-pointer"
                  onClick={toggleMostrarPassword}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActualizarPassword;
