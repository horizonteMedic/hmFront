import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faCodeBranch , faFileLines,faBoxesStacked, faBusinessTime} from '@fortawesome/free-solid-svg-icons';

const Card = ({ to, title, description, icon }) => {
  return (
    <Link to={to} className="flex justify-center items-center flex-col w-64 h-64 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
      {icon}
      <h2 className="text-lg font-bold my-2">{title}</h2>
      <p className='text-center'>{description}</p>
    </Link>
  );
};

const Configuracion = () => {
  return (
    <div className="dashboard-container">
      <div className="main-content flex flex-col items-center justify-center p-5">
        <div className="flex flex-wrap justify-center text-center">
          <Card to="/roles" icon={<FontAwesomeIcon icon={faBoxesStacked} size='2xl' />} title="Configuración de vistas por Rol" />
          <Card to="/accesos" icon={<FontAwesomeIcon icon={faUserLock} size='2xl'/>} title="Accesos"  />
          <Card to="/reporte-pacientes" icon={<FontAwesomeIcon icon={faFileLines} size='2xl'/>} title="Reportes" />
        </div>
      </div>
    </div>
  );
};

export default Configuracion;