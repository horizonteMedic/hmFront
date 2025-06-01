import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload,faUserLock, faCodeBranch, faFileLines, faGears, faBusinessTime, faNotesMedical, faList, faTentArrowDownToLine, faBuilding, faHandshake, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../../store/auth';
import Swal from 'sweetalert2';
import "./Dashboard.css";

const Card = ({ to, id, icon, color, hoverColor, iconColor, hoverIconColor }) => {
  return (
    <Link
      to={to}
      id={id}
      className={`flex justify-center items-center w-[60px] h-[60px]  flex-shrink-0 m-4 p-6 ${color} rounded-xl transition duration-500 transform hover:shadow-lg ${hoverColor} hover:scale-110`}
    >
      <FontAwesomeIcon icon={icon} style={{ color: iconColor }} size="2xl" className={`transition duration-500 ${hoverIconColor}`} />
    </Link>
  );
};
/* DINAMISMO xd
const iconMap = {
    faList,
    faFileLines,
    faGears,
    faUserLock,
    faCodeBranch,
    faBusinessTime,
    faNotesMedical,
    faTentArrowDownToLine,
    faBuilding,
    faHandshake,
    faNetworkWired
  };


const mapBackendToCard = (view) => ({
  id: String(view.id),               // siempre string
  to: view.rutaVista,                // rutaVista → to
  title: view.nombre,                // nombre    → title
  icon: iconMap[view.descripcion] || faFileLines, // default si no existe
});

const allowedRoutesStatic = [
  "/roles",
  "/accesos",
  "/reporte-pacientes",
  "/matriz-postulante",
  "/configuracion",
  "/Registro-de-pacientes",
];*/

const Dashboard = ({TotalView}) => {
  const userLogued = useAuthStore(state => state.userlogued);
  const listView = useAuthStore(state => state.listView);

  // Cards principales (sin cambios)
 const filteredCards = [
    { to: "/roles", name: "", icon: faCodeBranch, title: "Roles" },
    { to: "/accesos", name: "52", icon: faUserLock, title: "Accesos" },
    { to: "/reporte-pacientes", name: "2", icon: faFileLines, title: "Reportes" },
    { to: "/matriz-postulante", name: "55", icon: faBusinessTime, title: "Matriz Postulante" },
    { to: "/configuracion", name: "53", icon: faGears, title: "Configuración" },
    { to: "/Registro-de-pacientes", name: "Registro de Pacientes", icon: faNotesMedical, title: "Registro de Pacientes" }
  ].filter(card => listView.includes(card.name));

  // Cards adicionales en la tarjeta elevada con nuevo estilo
  const additionalCards = [
    { to: "/lista-archivos", id: "Administrar Archivos", icon: faList, title: "Administrar Archivos" },
    { to: "/agregar-sede", id: "Administrar Sedes", icon: faTentArrowDownToLine, title: "Administrar Sedes" },
    { to: "/administrar-empresas", id: "56", icon: faBuilding, title: "Administrar Empresas" },
    { to: "/administrar-contratas", id: "57", icon: faHandshake, title: "Administrar Contratas" },
    { to: "/protocolos", id: "61", icon: faNetworkWired, title: "Protocolos" }
  ].filter(card => listView.includes(card.id));
 /* MAIN const filteredCards = [
    { to: "/roles", id: "52", icon: faCodeBranch, title: "Roles" },
    { to: "/accesos", id: "53", icon: faUserLock, title: "Accesos" },
    { to: "/reporte-pacientes", id: "54", icon: faFileLines, title: "Reportes" },
    { to: "/matriz-postulante", id: "55", icon: faBusinessTime, title: "Matriz Postulante" },
    { to: "/configuracion", id: "56", icon: faGears, title: "Configuración" },
    { to: "/Registro-de-pacientes", id: "202", icon: faNotesMedical, title: "Registro de Pacientes" }
  ].filter(card => allowedRoutes.includes(card.id));

  // Cards adicionales en la tarjeta elevada con nuevo estilo
  const additionalCards = [
    { to: "/lista-archivos", id: "57", icon: faList, title: "Administrar Archivos" },
    { to: "/agregar-sede", id: "58", icon: faTentArrowDownToLine, title: "Administrar Sedes" },
    { to: "/administrar-empresas", id: "60", icon: faBuilding, title: "Administrar Empresas" },
    { to: "/administrar-contratas", id: "61", icon: faHandshake, title: "Administrar Contratas" },
    { to: "/protocolos", id: "153", icon: faNetworkWired, title: "Protocolos" }
  ].filter(card => allowedRoutes.includes(card.id));*/

  return (
    <div className="dashboard-container">
        
        <div className="main-content flex flex-col items-center justify-center p-5" style={{ marginTop: '5em' }}>
          <div className="relative w-full mb-12">
            <h1 className="text-4xl font-extrabold text-center">
              Bienvenido, <span style={{ color: '#fc6b03' }}>{userLogued.sub}!</span>
            </h1>
            <a
              href="/Manual-de-usuario.pdf"
              download="Manual-de-usuario.pdf"
              className="download-button"
            >
              <FontAwesomeIcon
                icon={faDownload}
                className="download-button-icon"
              />
              <span className="download-button-text">Descargar Manual de Usuario</span>
            </a>

          </div>

        {/* Cards principales (sin cambios) */}
        <div className="flex flex-wrap justify-center space-x-6 mb-8">
          {filteredCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center w-[120px] mb-4">
              <Card
                to={card.to}
                id={card.id}
                icon={card.icon}
                color="bg-gray-200"
                hoverColor="hover:bg-[#233245]"
                iconColor="#fc6b03"
                hoverIconColor="hover:text-white"
              />
              <h2 className="text-lg font-bold my-2 text-center">{card.title}</h2>
            </div>
          ))}
        </div>

        {/* Tarjeta elevada para las nuevas rutas con nuevo color y hover */}
        <div className="bg-white shadow-xl p-6 w-auto " style={{ borderRadius: '40px', marginTop:'5em'}}>
          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: 'black' }}>Configuraciones Avanzadas</h2>
          <div className="flex flex-wrap justify-center space-x-6">
            {additionalCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center w-auto mb-4">
                <Card
                  to={card.to}
                  id={card.id}
                  icon={card.icon}
                  color="bg-[#1c4d77]"
                  hoverColor="hover:bg-[#fc6b03]"
                  iconColor="white"
                  hoverIconColor="hover:text-white"
                />
                <h2 className="text-lg font-bold my-2 text-center text-[#1c4d77]">{card.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


/*DESARROLLO const filteredCards = [
    { to: "/roles", id: "2", icon: faCodeBranch, title: "Roles" },
    { to: "/accesos", id: "52", icon: faUserLock, title: "Accesos" },
    { to: "/reporte-pacientes", id: "54", icon: faFileLines, title: "Reportes" },
    { to: "/matriz-postulante", id: "55", icon: faBusinessTime, title: "Matriz Postulante" },
    { to: "/configuracion", id: "53", icon: faGears, title: "Configuración" },
    { to: "/Registro-de-pacientes", id: "3", icon: faNotesMedical, title: "Registro de Pacientes" }
  ].filter(card => allowedRoutes.includes(card.id));

  // Cards adicionales en la tarjeta elevada con nuevo estilo
  const additionalCards = [
    { to: "/lista-archivos", id: "59", icon: faList, title: "Administrar Archivos" },
    { to: "/agregar-sede", id: "58", icon: faTentArrowDownToLine, title: "Administrar Sedes" },
    { to: "/administrar-empresas", id: "56", icon: faBuilding, title: "Administrar Empresas" },
    { to: "/administrar-contratas", id: "57", icon: faHandshake, title: "Administrar Contratas" },
    { to: "/protocolos", id: "61", icon: faNetworkWired, title: "Protocolos" }
  ].filter(card => allowedRoutes.includes(card.id)); */

  /*CARD MAIN
  // Cards principales (sin cambios)
  const filteredCards = [
    { to: "/roles", id: "52", icon: faCodeBranch, title: "Roles" },
    { to: "/accesos", id: "53", icon: faUserLock, title: "Accesos" },
    { to: "/reporte-pacientes", id: "54", icon: faFileLines, title: "Reportes" },
    { to: "/matriz-postulante", id: "55", icon: faBusinessTime, title: "Matriz Postulante" },
    { to: "/configuracion", id: "56", icon: faGears, title: "Configuración" },
    { to: "/Registro-de-pacientes", id: "202", icon: faNotesMedical, title: "Registro de Pacientes" }
  ].filter(card => allowedRoutes.includes(card.id));

  // Cards adicionales en la tarjeta elevada con nuevo estilo
  const additionalCards = [
    { to: "/lista-archivos", id: "57", icon: faList, title: "Administrar Archivos" },
    { to: "/agregar-sede", id: "58", icon: faTentArrowDownToLine, title: "Administrar Sedes" },
    { to: "/administrar-empresas", id: "60", icon: faBuilding, title: "Administrar Empresas" },
    { to: "/administrar-contratas", id: "61", icon: faHandshake, title: "Administrar Contratas" },
    { to: "/protocolos", id: "153", icon: faNetworkWired, title: "Protocolos" }
  ].filter(card => allowedRoutes.includes(card.id)); */