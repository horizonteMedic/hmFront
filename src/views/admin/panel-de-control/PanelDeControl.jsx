import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

const Card = ({ to, title, description, icon }) => {
  return (
    <Link to={to} className="flex justify-center items-center flex-col w-64 h-64 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
      {icon}
      <h2 className="text-lg font-bold my-2">{title}</h2>
      <p className='text-center'>{description}</p>
    </Link>
  );
};

const Dashboard = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-5">
      <h1 className="text-3xl font-bold mb-8">Bienvenido Administrador</h1>
      <div className="flex flex-wrap justify-center">
        <Card to="/ruta1" title="Ruta 1" description="Descripción de la Ruta 1" />
        <Card to="/ruta2" title="Ruta 2" description="Descripción de la Ruta 2" />
        <Card to="/registrar-usuario" icon={<FontAwesomeIcon icon={faUser} size='2xl'/>} title="Usuarios" description="Gestiona los Usuarios" />
        <Card to="/ruta4" icon={<FontAwesomeIcon icon={faCodeBranch} size='2xl' />} title="Roles" description="Asigna los roles correspondientes a tus usuarios" />
      </div>
    </div>
    </>
  );
};

export default Dashboard;