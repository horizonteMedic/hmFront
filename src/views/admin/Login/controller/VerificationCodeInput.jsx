import React, { useState } from 'react';
import { Error } from './Estados';
import { useLocation } from 'react-router-dom';
import SubmitCodePass from '../model/SubmitCodePass';
import { Loading } from "../../../components/Loading";
import { useNavigate } from "react-router-dom";

const VerificationCodeInput = (props) => {
  const location = useLocation();
  const email = location.state.email;
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [selectedNumberIndex, setSelectedNumberIndex] = useState(0);
  const [estado, setEstado] = useState(false)
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();


  const handleNumberClick = (number) => {
    if (selectedNumberIndex >= 0 && selectedNumberIndex <= 5) {
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

  function NewPasswordNavigate(data) {
    if (data === null || data === 0) {
      setEstado(true);
    } else {
      navigate("/actualizar-password", { state: { email } });

    }
  }

  const handleSubmit = (e) => {
    setEstado(false)
    e.preventDefault();
    const code = verificationCode.join('');
    if (code.trim() === '') {
      setEstado(true)
    } else {
      setloading(true)
      SubmitCodePass(email,code)
      .then((data) => {
        NewPasswordNavigate(data.id)
      })
      .finally(()=> {setloading(false)})
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mt-[-3em]">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-center text-start font-bold mb-4">Digite el Código de Verificación</h2>
          <p className="text-center  font-bold mb-4">Se le envio su codigo al correo ingresado</p>
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
          {estado && <Error>Codigo Erroneo, por favor complete todos los campos</Error>}
        </div>
      </div>
    </div>
   {loading && <Loading/>}
   </>
  );
};

export default VerificationCodeInput;
