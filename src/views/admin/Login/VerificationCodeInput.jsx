import React, { useState } from 'react';

const VerificationCodeInput = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [selectedNumberIndex, setSelectedNumberIndex] = useState(0);

  const handleNumberClick = (number) => {
    if (selectedNumberIndex >= 0 && selectedNumberIndex <= 4) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[selectedNumberIndex] = number;
      setVerificationCode(newVerificationCode);
      setSelectedNumberIndex(selectedNumberIndex + 1);
    }
  };

  const handleBackspaceClick = () => {
    if (selectedNumberIndex > 0) {
      setSelectedNumberIndex(selectedNumberIndex - 1);
      const newVerificationCode = [...verificationCode];
      newVerificationCode[selectedNumberIndex - 1] = '';
      setVerificationCode(newVerificationCode);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.trim() === '') {
      alert('El código de verificación no puede estar vacío');
    } else {
      alert(`Código verificado: ${code}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mt-[-3em]">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-center text-2xl font-bold mb-4">Digite el Código de Verificación</h2>
          <div className="flex justify-center mb-6">
            {verificationCode.map((number, index) => (
              <div key={index} className="w-10 h-10 bg-gray-200 mx-1 flex items-center justify-center rounded-md">
                {number}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
              <button
                key={number}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </button>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
              onClick={handleBackspaceClick}
            >
              Borrar
            </button>
          </div>
          <div className="flex justify-center">
            <button
              className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit} style={{ backgroundColor: "#fc6b03", borderColor: "#fc6b03",  }}
            >
              Verificar Código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
