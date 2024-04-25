import React, { useState } from 'react';
import SubmitForgot from '../model/SubmitForgot';
import { useNavigate } from "react-router-dom";
import { Error } from './Estados';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [estado, setEstado] = useState(false)


  //Si el correo es correcto, reenvia a la pestaña del pad
  function Loginnavigate(id,email) {
    if (id !== null) {

      navigate("/verificacion-codigo", { state: { email } });
    }
    return setEstado(true)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValidFormat = /\S+@\S+\.\S+/.test(email);
    if (!isValidFormat) {
      setIsValidEmail(false);
      setLoading(false);
      return;
    }
    //Envio del correo a la API
    SubmitForgot(email)
      .then((data) => {
        Loginnavigate(data.id,email)
      })
      .finally(()=> {setLoading(false)})
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mt-[-3em]">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <img src="img/logo-color.png" alt="Logo" className="w-[45%]" />

          </div>
          <p className="text-2xl font-semibold text-center mb-6 color-azul"><strong>Recuperar Contraseña</strong></p>
          {codeSent && (
            <div className="mt-6 bg-green-100 text-green-700 border-l-4 border-green-500 py-2 px-4 rounded-md">
              <p className="text-center font-semibold">
                Se le ha enviado un código para restablecer su contraseña a su correo.
              </p>
            </div>
          )}
          <form>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 pb-2" htmlFor="email">
                Correo electrónico
              </label>
              <input
                className={` appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isValidEmail ? '' : 'border-red-500'} bg-white`}
                id="email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsValidEmail(/\S+@\S+\.\S+/.test(e.target.value)); 
                }}
                required
              />
              {!isValidEmail && (
                <p className="text-red-500 text-xs italic mt-2"></p>
              )}
            </div>
            <div className="flex justify-center">
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading || !isValidEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading || !isValidEmail}
              onClick={handleSubmit}
            >
              {loading ? 'Enviando...' : 'Continuar'}
            </button>

            </div>
            <div className="flex justify-center mt-4">
              <button
                className=" color-naranja hover:text-red-700 text-sm"
                onClick={() => {
                  window.location.href = '/';
                }}
              ><strong>Cancelar Acción</strong>
              </button>
            </div>
          </form>
          {estado && <Error><p>Correo electronico Incorrecto</p></Error>}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
