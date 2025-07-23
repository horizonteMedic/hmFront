import React, { useState } from 'react';

const OdontogramaAdultos = () => {
  const dientesSuperioresArray = [
    18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  ];

  const dientesInferioresArray = [
    48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
  ];

  const initialDientesOptions = Object.fromEntries(
    [...dientesSuperioresArray, ...dientesInferioresArray].map((diente) => [diente, "Normal"])
  );

  const [selectedDientes, setSelectedDientes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [dienteOptions, setDienteOptions] = useState(initialDientesOptions);
  const [contadorOptions, setContadorOptions] = useState({
    'Ausente': 0,
    'Cariada por opturar': 0,
    'Por extraer': 0,
    'Fracturada': 0,
    'Corona': 0,
    'ObturacionEfectuada': 0,
    'Puente': 0,
    'P.P.R Metalica': 0,
    'P.P.R Acrilica': 0,
    'P.Total': 0,
    'Normal': 32,
    'Dientes en mal estado': 0,
  });

  const handleSelect = (numero) => {
    setSelectedDientes((prevSelectedDientes) =>
      prevSelectedDientes.includes(numero)
        ? prevSelectedDientes.filter((d) => d !== numero)
        : [...prevSelectedDientes, numero]
    );
  };

  const handleContextMenu = (event, diente) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      diente,
    });
  };

  const handleOptionClick = (option) => {
    const diente = contextMenu.diente;
    const prevOption = dienteOptions[diente];

    if (prevOption === option) {
      setContextMenu(null);
      return;
    }

    if (prevOption) {
      setContadorOptions((prevContadores) => ({
        ...prevContadores,
        [prevOption]: prevContadores[prevOption] - 1,
      }));
    }

    if (prevOption === "Normal" && option !== "Normal") {
      setContadorOptions((prevContadores) => ({
        ...prevContadores,
        Normal: prevContadores.Normal - 1,
      }));
    }

    if (option === "Normal" && prevOption !== "Normal") {
      setContadorOptions((prevContadores) => ({
        ...prevContadores,
        Normal: prevContadores.Normal + 1,
      }));
    }

    setContadorOptions((prevContadores) => ({
      ...prevContadores,
      [option]: prevContadores[option] + 1,
    }));

    setDienteOptions((prevOptions) => ({
      ...prevOptions,
      [diente]: option,
    }));

    setContextMenu(null);
  };

  const renderInput = (label) => (
    <div className="flex justify-between items-center w-full sm:w-1/5 ml-4 mb-2">
      <label htmlFor={label}>{label}:</label>
      <input
        type="text"
        id={label}
        value={contadorOptions[label]}
        readOnly
        className="border text-center border-gray-300 rounded-md focus:outline-none bg-white w-10"
      />
    </div>
  );

  const renderDiente = (diente, imgUrl, rotate = false) => (
    <div
      key={diente}
      className={`relative flex flex-col items-center p-2 border ${
        selectedDientes.includes(diente) ? 'border-blue-500' : 'border-gray-300'
      } rounded-md cursor-pointer`}
      onClick={() => handleSelect(diente)}
      onContextMenu={(e) => handleContextMenu(e, diente)}
    >
      <img
        src={imgUrl}
        alt={`Diente ${diente}`}
        className={`w-[30px] h-[30px] mt-1 ${rotate ? 'rotate-180' : ''}`}
      />
      <span className="text-xs">{diente}</span>
      {dienteOptions[diente] && (
        <div className="absolute inset-0 flex justify-center items-center">
          {renderIndicator(dienteOptions[diente])}
        </div>
      )}
    </div>
  );

  const renderIndicator = (option) => {
    switch (option) {
      case 'Ausente':
        return <span className="text-blue-500 text-6xl">✕</span>;
      case 'Cariada por opturar':
        return <span className="text-red-500 text-7xl">●</span>;
      case 'Por extraer':
        return <span className="text-red-500 text-6xl">⊗</span>;
      case 'Fracturada':
        return <span className="text-black text-6xl">╱</span>;
      case 'Corona':
        return <span className="text-blue-500 text-6xl">▲</span>;
      case 'ObturacionEfectuada':
        return <span className="text-blue-500 text-7xl">●</span>;
      case 'Puente':
        return <span className="text-black text-6xl">▭</span>;
      case 'P.P.R Metalica':
        return <span className="text-black text-6xl">―</span>;
      case 'P.P.R Acrilica':
        return <span className="text-black text-6xl">=</span>;
      case 'P.Total':
        return <span className="text-black text-6xl">≈</span>;
      case 'Normal':
        return <span className="text-green-500 text-6xl">☑</span>;
      case 'Dientes en mal estado':
        return <span className="text-yellow-500 text-3xl">🟡</span>;
      default:
        return null;
    }
  };

  const menuOptions = [
    { label: 'Ausente', icon: '✕', color: 'text-blue-500' },
    { label: 'Cariada por opturar', icon: '●', color: 'text-red-500' },
    { label: 'Por extraer', icon: '⊗', color: 'text-red-500' },
    { label: 'Fracturada', icon: '╱', color: 'text-black' },
    { label: 'Corona', icon: '▲', color: 'text-blue-500' },
    { label: 'ObturacionEfectuada', icon: '●', color: 'text-blue-500' },
    { label: 'Puente', icon: '▭', color: 'text-black' },
    { label: 'P.P.R Metalica', icon: '―', color: 'text-black' },
    { label: 'P.P.R Acrilica', icon: '=', color: 'text-black' },
    { label: 'P.Total', icon: '≈', color: 'text-black' },
    { label: 'Normal', icon: '☑', color: 'text-green-500' },
    { label: 'Dientes en mal estado', icon: '●', color: 'text-yellow-500' },
  ];

  return (
    <div className="p-4 mt-4">
      <form className="flex flex-col gap-4">
        <div className="border border-gray-300 p-4">
          <div className="flex justify-center items-center gap-1">
            <div className="flex flex-full justify-center gap-2">
              {dientesSuperioresArray.map((diente) =>
                renderDiente(
                  diente,
                  diente === 13 || diente === 23 || diente === 33 || diente === 43
                    ? 'https://cdn-icons-png.flaticon.com/512/91/91154.png'
                    : diente === 18 || diente === 17 || diente === 16 || diente === 26 || diente === 27 || diente === 28
                    ? 'https://cdn-icons-png.flaticon.com/512/91/91159.png'
                    : 'https://cdn-icons-png.flaticon.com/512/91/91162.png',
                  true
                )
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-1 mt-4">
            <div className="flex flex-full justify-center gap-2">
              {dientesInferioresArray.map((diente) =>
                renderDiente(
                  diente,
                  diente === 13 || diente === 23 || diente === 33 || diente === 43
                    ? 'https://cdn-icons-png.flaticon.com/512/91/91154.png'
                    : diente === 48 || diente === 47 || diente === 46 || diente === 36 || diente === 37 || diente === 38
                    ? 'https://cdn-icons-png.flaticon.com/512/91/91159.png'
                    : 'https://cdn-icons-png.flaticon.com/512/91/91162.png',
                  true
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {menuOptions.map((option) => (
            <div key={option.label} className="flex items-center gap-2">
              <span className={`${option.color} text-xl`}>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>

        <div className="border border-gray-300 p-4 mt-4 flex flex-wrap">
          {Object.keys(contadorOptions).map((key) => renderInput(key))}
        </div>
      </form>
      {contextMenu && (
        <div
          className="fixed z-10 bg-white shadow-md rounded-md"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          {menuOptions.map((option) => (
            <div
              key={option.label}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option.label)}
            >
              <span className={`${option.color} text-xl`}>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OdontogramaAdultos;
