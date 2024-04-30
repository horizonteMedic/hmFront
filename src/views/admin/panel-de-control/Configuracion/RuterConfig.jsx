import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faList, faMapMarkerAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const RuterConfig = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const decodedPathname = decodeURIComponent(location.pathname);
    if (decodedPathname === '/configuracion-vistas-por-rol') {
      setActiveButton('configuracion-vistas-por-rol');
    } else if (decodedPathname === '/lista-archivos') {
      setActiveButton('lista-archivos');
    } else if (decodedPathname === '/agregar-sede') {
      setActiveButton('agregar-sede');
    } else if (decodedPathname === '/agregar-campaña') {
      setActiveButton('agregar-campaña');
    } else {
      setActiveButton(null);
    }
  }, [location]);

  return (
    <div className="flex justify-center mt-4 mb-5">
      <div className="w-full md:w-[90%] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* <Link
            to="/configuracion-vistas-por-rol"
            className={`flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-[4em] focus:outline-none focus:shadow-outline block text-center ${
              activeButton === 'configuracion-vistas-por-rol' ? 'bg-yellow-300' : ''
            }`}
            onClick={() => setActiveButton('configuracion-vistas-por-rol')}
          >
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            Configuración de Vistas por Rol
          </Link> */}
          <Link
            to="/lista-archivos"
            className={`flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-[4em] focus:outline-none focus:shadow-outline block text-center ${
              activeButton === 'lista-archivos' ? 'bg-yellow-300' : ''
            }`}
            onClick={() => setActiveButton('lista-archivos')}
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            Lista de Archivos
          </Link>
          <Link
            to="/agregar-sede"
            className={`flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-[4em] focus:outline-none focus:shadow-outline block text-center ${
              activeButton === 'agregar-sede' ? 'bg-yellow-300' : ''
            }`}
            onClick={() => setActiveButton('agregar-sede')}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Agregar Sede
          </Link>
          <Link
            to="/agregar-campaña"
            className={`flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-[4em] focus:outline-none focus:shadow-outline block text-center ${
              activeButton === 'agregar-campaña' ? 'bg-yellow-300' : ''
            }`}
            onClick={() => setActiveButton('agregar-campaña')}
          >
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar Campaña
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RuterConfig;
