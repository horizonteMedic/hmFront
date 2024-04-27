import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faChartBar, faList,faLock, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeLink, setActiveLink] = useState(""); // Nuevo estado para la ruta activa
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const closeMenu = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    // Añadir el event listener para cerrar el menú al hacer clic fuera
    document.getElementById('root').addEventListener('click', closeMenu);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.getElementById('root').removeEventListener('click', closeMenu);
    };
  }, [showMenu]);

  const handleNavLinkClick = (to) => {
    setActiveLink(to === "/panel-de-control" ? "" : to); // Desactiva cualquier enlace activo si se hace clic en el logo
  };
  
  const handleLogoClick = () => {
    setActiveLink(""); // Desactiva cualquier enlace activo al hacer clic en el logo
  };
  
  const Logoutbutton = () => {
    return (
      <button onClick={() => { setToken(null); setuserlogued(null); }} className="group ml-4 min-w-8 flex items-center justify-start w-8 h-8  rounded-full cursor-pointer relative overflow-hidden transition-all duration-700 shadow-md bg-[#fc6b03] hover:w-28    hover:rounded-xl">
        <div className="w-full flex items-center justify-center transition text-white duration-300 group-hover:pl-0 group-hover:w-[40%]">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>

        <div className="absolute right-0 w-0 opacity-0 text-white font-semibold text-lg transition duration-300 group-hover:!w-[70%] group-hover:!opacity-100 group-hover:pr-2 group-hover:duration-300">
          Salir
        </div>
      </button>
    )
  }

  return (
    <nav className="bg-gray-800 px-4 py-1 flex justify-between items-center">
      <div className="flex items-center">
      <Link to="/panel-de-control" onClick={handleLogoClick}>
        <img src="img/logoblanco.png" alt="Logo" className="w-[180px] p-4 mr-4" />
      </Link>

      </div>
      <div className="hidden md:flex items-center">
        <CustomNavLink to="/roles" label="Roles" icon={faUser} activeLink={activeLink} onClick={handleNavLinkClick} />
        <CustomNavLink to="/accesos" label="Accesos" icon={faLock} activeLink={activeLink} onClick={handleNavLinkClick} />
        <CustomNavLink to="/reporte-pacientes" label="Reportes" icon={faChartBar} activeLink={activeLink} onClick={handleNavLinkClick} />
        <CustomNavLink to="/matriz-postulante" label="Matriz Postulante" icon={faList} activeLink={activeLink} onClick={handleNavLinkClick} />
        <CustomNavLink to="/configuracion" label="Configuración" icon={faCog} activeLink={activeLink} onClick={handleNavLinkClick} />
        <Logoutbutton />
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {showMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
          </svg>
        </button>
      </div>
      {showMenu && (
        <div className="md:hidden absolute right-0 top-16 bg-gray-800 w-[50%]  py-2">
          <CustomNavLink to="/roles" label="Roles" icon={faUser} activeLink={activeLink} onClick={handleNavLinkClick} />
          <CustomNavLink to="/accesos" label="Accesos" icon={faLock} activeLink={activeLink} onClick={handleNavLinkClick} />
          <CustomNavLink to="/reporte-pacientes" label="Reportes" icon={faChartBar} activeLink={activeLink} onClick={handleNavLinkClick} />
          <CustomNavLink to="/matriz-postulante" label="Matriz Postulante" icon={faList} activeLink={activeLink} onClick={handleNavLinkClick} />
          <CustomNavLink to="/configuracion" label="Configuración" icon={faCog} activeLink={activeLink} onClick={handleNavLinkClick} />
          <Logoutbutton />
        </div>
      )}
    </nav>
  );
};

const CustomNavLink = ({ to, label, icon, activeLink, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={() => onClick(to)} // Actualiza el estado de la ruta activa al hacer clic en el enlace
      className={`hvr-sweep-to-top before:bg-[#fc6b03] text-white px-4 py-2 ml-2 rounded block md:inline-block relative ${activeLink === to ? 'activeLink' : ''}`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" /> {label}
    </RouterNavLink>
  );
};

export default Navbar;
