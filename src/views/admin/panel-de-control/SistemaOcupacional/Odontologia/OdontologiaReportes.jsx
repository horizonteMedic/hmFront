import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom } from '@fortawesome/free-solid-svg-icons';

const OdontologiaReportes = () => {
  const [nombre, setNombre] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroOcupacional, setFiltroOcupacional] = useState(false);
  const [filtroClientesConsulta, setFiltroClientesConsulta] = useState(false);

  const handleLimpiar = () => {
    setNombre('');
    setFechaDesde('');
    setFechaHasta('');
    setFiltroOcupacional(false);
    setFiltroClientesConsulta(false);
  };

  const handleBuscar = () => {
    // Aquí puedes agregar la lógica para ejecutar la consulta
    console.log('Buscando reportes con los siguientes filtros:');
    console.log('Nombre:', nombre);
    console.log('Fecha Desde:', fechaDesde);
    console.log('Fecha Hasta:', fechaHasta);
    console.log('Filtro Ocupacional:', filtroOcupacional);
    console.log('Filtro Clientes Consulta:', filtroClientesConsulta);
  };

  return (
    <div className="container mx-auto mt-12 mb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl w-full sm:w-[50%] p-6">
        <h1 className="text-start font-bold text-black mb-4">Reportes</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <div className="flex items-center">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleLimpiar}
              className="ml-2 p-2 bg-red-500 text-white rounded"
            >
              <FontAwesomeIcon icon={faBroom} />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Buscar por fechas</label>
          <div className="flex">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full p-2 border rounded mr-2"
            />
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Filtro por</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filtroOcupacional}
              onChange={() => setFiltroOcupacional(!filtroOcupacional)}
              className="mr-2"
            />
            <label className="mr-4">Ocupacional</label>
            <input
              type="checkbox"
              checked={filtroClientesConsulta}
              onChange={() => setFiltroClientesConsulta(!filtroClientesConsulta)}
              className="mr-2"
            />
            <label className="mr-4">Clientes Consulta</label>
            <button
              onClick={handleBuscar}
              className="ml-auto p-2 bg-blue-500 text-white rounded"
            >
              Ejecutar Consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdontologiaReportes;
