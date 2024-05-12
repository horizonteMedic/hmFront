import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCalendarPlus , faFileCirclePlus, faBuilding,faTentArrowDownToLine, faHandshake, faNotesMedical, faList} from '@fortawesome/free-solid-svg-icons';

const Card = ({ to, id,title, description, icon }) => {
  return (
    <Link to={to} id={id}  className="flex justify-center items-center flex-col w-64 h-64 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
      {icon}
      <h2 className="text-lg font-bold my-2">{title}</h2>
      <p className='text-center'>{description}</p>
    </Link>
  );
};

const Configuracion = () => {
  const listView = useAuthStore(state => state.listView);
  const allowedRoutes = listView.map(item => `${item.id}`);

  const filteredCards = [
    { to: "/lista-archivos", id:"57",  icon: <FontAwesomeIcon icon={faList}  className="color-naranja" size='2xl' />, title: "Administrar Archivos"},
    { to: "/agregar-sede", id:"58", icon: <FontAwesomeIcon icon={faTentArrowDownToLine}  className="color-naranja" size='2xl'/>, title: "Administrar Sedes"},
    { to: "/agregar-campaña", id:"59", icon: <FontAwesomeIcon icon={faNotesMedical}  className="color-naranja" size='2xl'/>, title: "Campañas"},
    { to: "/administrar-empresas", id:"60", icon: <FontAwesomeIcon icon={faBuilding}  className="color-naranja" size='2xl' />, title: "Administrar Empresas"},
    { to: "/administrar-contratas", id:"61", icon: <FontAwesomeIcon  className="color-naranja" size='2xl' icon={faHandshake} />, title: "Administrar Contratas" }
  ].filter(card => allowedRoutes.includes(card.id));

  return (
    <div className="dashboard-container">
      <div className="main-content flex flex-col items-center justify-center p-5">
        <div className="flex flex-wrap justify-center text-center">
        {filteredCards.map((card, index) => (
            <Card key={index} to={card.to} id={card.id} icon={card.icon} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
