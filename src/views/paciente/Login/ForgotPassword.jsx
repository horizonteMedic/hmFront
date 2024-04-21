import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar el formato del correo electrónico
    const isValidFormat = /\S+@\S+\.\S+/.test(email);
    if (!isValidFormat) {
      setIsValidEmail(false);
      return;
    }

    // Aquí puedes enviar la solicitud para recuperar la contraseña al backend
    // y manejar la lógica para enviar el código de recuperación por correo electrónico
    setCodeSent(true); // Simulación de código enviado
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-30 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <img src="https://horizontemedic.com/images/Logo.png" alt="Logo" className="w-50 h-30" />
          </div>
          <p className="text-center text-1xl font-bold mb-4">Olvide mi contraseña <br />Solicitud para recuperar contraseña</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Correo electrónico
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white ${isValidEmail ? '' : 'border-red-500'}`}
                id="email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onInput={(e) => {
                  setEmail(e.target.value);
                  setIsValidEmail(/\S+@\S+\.\S+/.test(e.target.value)); // Validar el formato del correo electrónico
                }}
                required
              />
              {!isValidEmail && (
                <p className="text-red-500 text-xs italic">El formato del correo electrónico no es válido.</p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
        {codeSent && (
          <div className="mt-4 bg-green-200 text-black shadow-md rounded-lg p-4 w-100 h-13">
            <p className="text-center font-semibold">
              Se le ha enviado un código para restablecer su contraseña a su correo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
