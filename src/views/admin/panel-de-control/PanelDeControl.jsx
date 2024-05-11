import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faCodeBranch , faFileLines,faGears, faBusinessTime} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../../store/auth';

const Card = ({ to, id, title, description, icon }) => {

  return (
      <Link to={to} id={id}   className="flex justify-center items-center flex-col w-64 h-64 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
      {icon}
      <h2 className="text-lg font-bold my-2">{title}</h2>
      <p className='text-center'>{description}</p>
    </Link>
  );
};

const Dashboard = () => {
  const userLogued = useAuthStore(state => state.userlogued);
  const listView = useAuthStore(state => state.listView);
  const allowedRoutes = listView.map(item => `${item.id}`);
  
  const filteredCards = [
    { to: "/roles", id:"52",  icon: <FontAwesomeIcon icon={faCodeBranch} style={{color: "#fc6b03"}} size='2xl' />, title: "Roles", description: "" },
    { to: "/accesos", id:"53", icon: <FontAwesomeIcon icon={faUserLock} style={{color: "#fc6b03"}} size='2xl'/>, title: "Accesos", description: "" },
    { to: "/reporte-pacientes", id:"54", icon: <FontAwesomeIcon icon={faFileLines} style={{color: "#fc6b03"}} size='2xl'/>, title: "Reportes", description: "" },
    { to: "/matriz-postulante", id:"55", icon: <FontAwesomeIcon icon={faBusinessTime} style={{color: "#fc6b03"}} size='2xl' />, title: "Matriz Postulante", description: "" },
    { to: "/configuracion", id:"56", icon: <FontAwesomeIcon style={{color: "#fc6b03"}} icon={faGears} size='2xl' />, title: "Configuración", description: " " }
  ].filter(card => allowedRoutes.includes(card.id));
  return (
    <div className="dashboard-container">
      <div className="main-content flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Bienvenido {userLogued.sub}</h1>
        <div className="flex flex-wrap justify-center">
          {filteredCards.map((card, index) => (
            <Card key={index} to={card.to} id={card.id} icon={card.icon} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default Dashboard;