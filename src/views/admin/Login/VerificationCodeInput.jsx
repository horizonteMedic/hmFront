import React, { useState } from 'react';

const VerificationCodeInput = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Lógica de verificación del código en el backend
    try {
      // Aquí puedes hacer una solicitud al backend para verificar el código
      // Por ejemplo:
      // const response = await axios.post('URL_DE_TU_API_VERIFICACION', { verificationCode });
      
      // Simulando una respuesta exitosa para este ejemplo
      // const { data } = response;
      // if (data.codeValid) {
      //   // El código es válido, puedes redirigir o mostrar un mensaje de éxito
      // } else {
      //   setVerificationError('El código de verificación es incorrecto.');
      // }

      // Simulación de la respuesta del backend
      setLoading(false);
      setVerificationError('');
      alert('Código verificado con éxito.'); // Simplemente alerta para este ejemplo
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setVerificationError('Error al verificar el código. Inténtelo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mt-[-3em]">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-center text-2xl font-bold mb-4">Digite el Código de Verificación</h2>
          {verificationError && (
            <div className="mt-6 bg-red-100 text-red-700 border-l-4 border-red-500 py-2 px-4 rounded-md">
              <p className="text-center font-semibold">{verificationError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationCode">
                Código de Verificación
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="verificationCode"
                type="text"
                placeholder="Código de Verificación"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
