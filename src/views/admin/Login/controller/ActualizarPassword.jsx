import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SubmitPasswordActualizado from '../model/SubmitPasswordActualizado';
import { Loading } from '../../../components/Loading';
import { useNavigate } from "react-router-dom";


const ModalCheck = ({ navigateLogin })  => {

  return(
    <>
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px]  relative">
        <h2 className="text-2xl font-bold mb-4 text-center">¡Excelente!</h2>
        <div className='flex flex-col justify-center items-center'>
          <p className='p-3'>Su Contraseña ha sido cambiada con exito</p>
          <button
                className="naranja-btn  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit" onClick={() => {
                  navigateLogin()
                }}
              >
                Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>
    </>
  )
}


const ActualizarPassword = () => {
    const location = useLocation();
    const email = location.state.email;
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [estado, setEstado] = useState(false)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();


    const toggleMostrarPassword = () => {
        setMostrarPassword(!mostrarPassword);
    };

    function NavigateLogin() {
        navigate("/");
    }

    function NewPasswordNavigate(data) {
      if (data === null || data === 0) {
        setEstado(true);
      } else {
        setIsModalOpen(true)
      }
    }

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        SubmitPasswordActualizado(email,confirmarPassword)
        .then((data) => {
            NewPasswordNavigate(data.id)
        })
        .finally(()=> {setLoading(false)})
        .catch((error) => {
            console.error("Error al enviar los datos:", error);
        });
  };

  return (
    <>
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
                <FontAwesomeIcon
                  icon={mostrarPassword ? faEyeSlash : faEye}
                  className="absolute top-0 right-0 m-4 cursor-pointer"
                  onClick={toggleMostrarPassword}
                />
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
  {loading && <Loading/>}
  {isModalOpen && <ModalCheck navigateLogin={NavigateLogin}/>}
  </>
  );
};

export default ActualizarPassword;
