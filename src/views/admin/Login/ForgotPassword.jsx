import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValidFormat = /\S+@\S+\.\S+/.test(email);
    if (!isValidFormat) {
      setIsValidEmail(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('URL_DE_TU_API', { email });
      
      if (response.status === 200) {
        setCodeSent(true);
      } else {
        console.error('Error al enviar el código de recuperación.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
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
          <form onSubmit={handleSubmit}>
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
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/verificacion-codigo';
              }}
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
