import React, { useState } from 'react';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar el formato del correo electrónico
    const isValidFormat = /\S+@\S+\.\S+/.test(email);
    if (!isValidFormat) {
      setIsValidEmail(false);
      return;
    }

    try {
      // Enviar una solicitud POST a tu API para enviar el código de recuperación
      const response = await axios.post('URL_DE_TU_API', { email });
      
      // Verificar si la solicitud fue exitosa
      if (response.status === 200) {
        setCodeSent(true);
      } else {
        console.error('Error al enviar el código de recuperación.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <img src="https://horizontemedic.com/images/Logo.png" alt="Logo" className="w-32" />
          </div>
          <h2 className="text-center text-2xl font-bold mb-4">Recuperar Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Correo electrónico
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isValidEmail ? '' : 'border-red-500'}`}
                id="email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsValidEmail(/\S+@\S+\.\S+/.test(e.target.value)); // Validar el formato del correo electrónico
                }}
                required
              />
              {!isValidEmail && (
                <p className="text-red-500 text-xs italic mt-2">El formato del correo electrónico no es válido.</p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Continuar
              </button>
            </div>
          </form>
          {codeSent && (
            <div className="mt-6 bg-green-100 text-green-700 border-l-4 border-green-500 py-2 px-4 rounded-md">
              <p className="text-center font-semibold">
                Se le ha enviado un código para restablecer su contraseña a su correo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
