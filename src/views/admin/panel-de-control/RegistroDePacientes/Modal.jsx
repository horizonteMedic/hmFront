import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SubmitDetalleCita } from './model/AdminCitas';

const Modal = (props) => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false); // Estado para mostrar mensaje de no resultados

  useEffect(() => {
    SubmitDetalleCita(props.user, props.token)
      .then((res) => {
        console.log(res);
        setData(res);
        setFilteredData(res); // Inicialmente mostrar todos los datos
      })
      .catch(() => {
        console.log('Ocurrió un terrible error');
      });
  }, []);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    // Validación para permitir solo números y máximo 8 dígitos
    inputValue = inputValue.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (inputValue.length > 8) {
      inputValue = inputValue.slice(0, 8); // Limita a 8 dígitos
    }

    setSearchInput(inputValue); // Actualiza el estado del input

    // Filtra los datos en tiempo real basándose en el DNI ingresado
    const filtered = data.filter((item) => {
      // Convertir el número de DNI a cadena para comparar
      const dniString = item.dni.toString();
      return dniString.includes(inputValue);
    });

    setFilteredData(filtered); // Actualiza los datos filtrados

    // Mostrar mensaje de no resultados si no hay datos filtrados
    if (filtered.length === 0) {
      setShowNoResultsMessage(true);
    } else {
      setShowNoResultsMessage(false);
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      props.onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 " onClick={handleClose}>
      <div className="bg-white p-4 rounded shadow-lg max-w-[50%] w-full mx-auto" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="flex justify-end">
          <FontAwesomeIcon icon={faTimes} className="cursor-pointer mb-2" style={{ fontSize: '12px' }} onClick={handleClose} />
        </div>
        
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Buscar DNI..."
            value={searchInput}
            onChange={handleInputChange} 
            className="mr-2 px-2 py-1 border border-gray-300 rounded w-full"
            maxLength={8} 
          />
      
        </div>
        {showNoResultsMessage && (
          <p className="text-red-500 text-center mb-2">No se encontraron datos</p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Sede</th>
                <th className="px-4 py-2 border border-gray-300">DNI</th>
                <th className="px-4 py-2 border border-gray-300">Empresa</th>
                <th className="px-4 py-2 border border-gray-300">Contrata</th>
                <th className="px-4 py-2 border border-gray-300">Programador</th>
                <th className="px-4 py-2 border border-gray-300">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((option, index) => (
                <tr key={index} className="bg-white">
                  <td className="px-4 py-2 border border-gray-300">{option.sede}</td>
                  <td className="px-4 py-2 border border-gray-300">{option.dni}</td>
                  <td className="px-4 py-2 border border-gray-300">{option.empresa}</td>
                  <td className="px-4 py-2 border border-gray-300">{option.contrata}</td>
                  <td className="px-4 py-2 border border-gray-300">{option.programador}</td>
                  <td className="px-4 py-2 border border-gray-300">{option.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;
