import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faCodeBranch, faFileLines, faGears, faBusinessTime, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../../store/auth';

const Card = ({ to, id, icon }) => {
  return (
    <Link to={to} id={id} className="flex justify-center items-center w-24 h-24 flex-shrink-0 m-4 p-6 bg-gray-200 rounded-[10px] transition duration-300 transform hover:shadow-lg hover:bg-[#233245] hover:scale-110">
      {icon}
    </Link>
  );
};

const Dashboard = () => {
  const userLogued = useAuthStore(state => state.userlogued);
  const listView = useAuthStore(state => state.listView);
  const allowedRoutes = listView.map(item => `${item.id}`);

  const filteredCards = [
    { to: "/roles", id: "52", icon: <FontAwesomeIcon icon={faCodeBranch} style={{ color: "#fc6b03" }} size='2xl' />, title: "Roles", description: "" },
    { to: "/accesos", id: "53", icon: <FontAwesomeIcon icon={faUserLock} style={{ color: "#fc6b03" }} size='2xl' />, title: "Accesos", description: "" },
    { to: "/reporte-pacientes", id: "54", icon: <FontAwesomeIcon icon={faFileLines} style={{ color: "#fc6b03" }} size='2xl' />, title: "Reportes", description: "" },
    { to: "/matriz-postulante", id: "55", icon: <FontAwesomeIcon icon={faBusinessTime} style={{ color: "#fc6b03" }} size='2xl' />, title: "Matriz Postulante", description: "" },
    { to: "/configuracion", id: "56", icon: <FontAwesomeIcon style={{ color: "#fc6b03" }} icon={faGears} size='2xl' />, title: "Configuración", description: " " },
    { to: "/Registro-de-pacientes", id: "202", icon: <FontAwesomeIcon style={{ color: "#fc6b03" }} icon={faPersonCirclePlus} size='2xl' />, title: "Registro de Pacientes", description: " " }
  ].filter(card => allowedRoutes.includes(card.id));

  return (
    <div className="dashboard-container">
      <div className="main-content flex flex-col items-center justify-center p-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Bienvenido {userLogued.sub}</h1>
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

export default Dashboard;
