import React, { useState } from 'react';
import './pagina_manteniminento.css';

const MatrizPostulante = () => {
  // Estado para las fechas, iniciadas con la fecha de hoy
  const today = new Date().toISOString().split('T')[0];
  const [fechaInicio, setFechaInicio] = useState(today);
  const [fechaFin, setFechaFin] = useState(today);

  // Estado para los selectores de empresa y sede
  const [empresa, setEmpresa] = useState('');
  const [sede, setSede] = useState('');

  // Funciones de manejo de eventos para actualizar el estado cuando se selecciona una opción
  const handleEmpresaChange = (e) => {
    setEmpresa(e.target.value);
  };

  const handleSedeChange = (e) => {
    setSede(e.target.value);
  };

  return (
    <div className="container mx-auto mt-12 mb-12">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-[90%]">
        <div className="px-4 py-2 azuloscurobackground flex justify-between">
          <h1 className="text-center text-start font-bold color-azul text-white">Matriz Postulante</h1>
        </div>
        <div className="grid grid-cols-4 gap-4 p-6">
          <div>
            <p className="font-semibold">R.U.C. Empresa</p>
            <select
              value={empresa}
              onChange={handleEmpresaChange}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Empresa</option>
              <option value="20539739060">Empresa 1</option>
              <option value="12345678901">Empresa 2</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
          <div>
            <p className="font-semibold">Sede</p>
            <select
              value={sede}
              onChange={handleSedeChange}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
              <option value="">Seleccionar Sede</option>
              <option value="sede1">Sede 1</option>
              <option value="sede2">Sede 2</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
          <div>
            <p className="font-semibold">Fecha Inicio</p>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <p className="font-semibold">Fecha Fin</p>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end p-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md azul-btn">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default MatrizPostulante;
