import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCalendarPlus , faFileCirclePlus, faBuilding,faTentArrowDownToLine, faHandshake, faNotesMedical, faList, faNetworkWired} from '@fortawesome/free-solid-svg-icons';

const Card = ({ to, id, icon }) => {
  return (
    <Link to={to} id={id} className="flex justify-center items-center w-24 h-24 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-[10px] transition duration-300 transform hover:shadow-lg hover:bg-[#233245] hover:scale-110">
      {icon}
    </Link>
  );
};

const Configuracion = () => {
  const listView = useAuthStore(state => state.listView);

  const filteredCards = [
    { to: "/lista-archivos", id:"Administrar Archivos",  icon: <FontAwesomeIcon icon={faList}  className="color-naranja" size='2xl' />, title: "Administrar Archivos"},
    { to: "/agregar-sede", id:"Administrar Sedes", icon: <FontAwesomeIcon icon={faTentArrowDownToLine}  className="color-naranja" size='2xl'/>, title: "Administrar Sedes"},
    // { to: "/agregar-campaña", id:"59", icon: <FontAwesomeIcon icon={faNotesMedical}  className="color-naranja" size='2xl'/>, title: "Campañas"},
    { to: "/administrar-empresas", id:"Administrar Empresas", icon: <FontAwesomeIcon icon={faBuilding}  className="color-naranja" size='2xl' />, title: "Administrar Empresas"},
    { to: "/administrar-contratas", id:"Administrar Contratas", icon: <FontAwesomeIcon  className="color-naranja" size='2xl' icon={faHandshake} />, title: "Administrar Contratas" },
    { to: "/protocolos", id:"Servicios", icon: <FontAwesomeIcon  className="color-naranja" size='2xl' icon={faNetworkWired} />, title: "Protocolos" }

  ].filter(card => listView.includes(card.id));
  
  return (
    
    <div className="dashboard-container">
      <div className="main-content flex flex-col items-center justify-center p-5">
        <div className="flex flex-wrap justify-center">
          {filteredCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center w-[120px] mb-4"> {/* Agrega mb-4 para espacio entre tarjetas */}
              <Card to={card.to} id={card.id} icon={card.icon} />
              <h2 className="text-lg font-bold my-2 text-center">{card.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
