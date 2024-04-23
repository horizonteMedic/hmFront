import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditModal = ({ closeModal }) => {
  const [startDate, setStartDate] = useState(null);
  const [sexo, setSexo] = useState('');
  const [activo, setActivo] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState('');

  const handleSexoChange = (event) => {
    setSexo(event.target.value);
  };

  const handleActivoChange = (event) => {
    setActivo(event.target.checked);
  };

  const handleTipoDocumentoChange = (event) => {
    setTipoDocumento(event.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-[400px] md:w-[880px]">
        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                id="tipoDocumento"
                value={tipoDocumento}
                onChange={handleTipoDocumentoChange}
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div>
              <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">
                Número de Documento
              </label>
              <input
                type="text"
                id="numeroDocumento"
                className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none bg-white"
              />
            </div>
            {/* Aquí van los demás campos de edición */}
          </div>
          <div className="text-right">
            <button type="submit" className="inline-flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md mr-2">
              Guardar
            </button>
            <button type="button" onClick={closeModal} className="inline-flex justify-center items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
