import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faChartBar, faList,faLock, faCog, faSignOutAlt, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeLink, setActiveLink] = useState(""); 
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);
  const listView = useAuthStore(state => state.listView);
  const allowedRoutes = listView.map(item => `${item.id}`);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const closeMenu = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.getElementById('root').addEventListener('click', closeMenu);
    return () => {
      document.getElementById('root').removeEventListener('click', closeMenu);
    };
  }, [showMenu]);

  const handleNavLinkClick = (to) => {
    setActiveLink(to === "/panel-de-control" ? "" : to);
  };
  
  const handleLogoClick = () => {
    setActiveLink(""); 
  };
  
  const filteredNavLinks = [
    { to: "/roles", id:"52", label: "Roles", icon: faUser },
    { to: "/accesos", id:"53", label: "Accesos", icon: faLock },
    { to: "/reporte-pacientes", id:"54", label: "Reportes", icon: faChartBar },
    { to: "/matriz-postulante", id:"55", label: "Matriz Postulante", icon: faList },
    { to: "/Registro-de-pacientes", id:"202", label: "Registro de Pacientes", icon: faPersonCirclePlus },
    { to: "/configuracion", id:"56", label: "Configuración", icon: faCog }


  ].filter(navLink => allowedRoutes.includes(navLink.id));
  
  const Logoutbutton = () => {
    return (
      <button
      onClick={() => { setToken(null); setuserlogued(null); }}
      className="ml-4 flex items-center justify-start w-20 h-8 rounded-full cursor-pointer relative overflow-hidden naranja-btn text-white"
    >
      <div className="w-full flex items-center justify-center">
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span className="ml-1 fw-bold">Salir</span>
      </div>
    </button>
    
    )
  }

  return (
    <nav className="azuloscurobackground px-4 py-1 flex justify-between items-center">
      <div className="flex items-center">
      <Link to="/panel-de-control" onClick={handleLogoClick}>
        <img src="img/logo-blanco.png" alt="Logo" className="w-full h-[60px] p-3 mr-4" />
      </Link>

      </div>
      <div className="hidden md:flex items-center">
      {filteredNavLinks.map((navLink, index) => (
          <CustomNavLink
            key={index}
            to={navLink.to}
            id={navLink.id}
            label={navLink.label}
            icon={navLink.icon}
            activeLink={activeLink} 
            onClick={handleNavLinkClick}
          />
        ))}
        {/* No tocar porfavor en mantenimiento */}
        {/* <CustomNavLink to="/laboratorio-clinico-minera" id="57" label="Laboratorio Clinico" icon={faFlaskVial} activeLink={activeLink}   onClick={handleNavLinkClick}/>
        <CustomNavLink to="/Registro-de-pacientes" id="58" label="Registro Clientes" icon={faUser} activeLink={activeLink}   onClick={handleNavLinkClick}/>
        <CustomNavLink to="/triaje-minera" id="59" label="Triaje" icon={faUserNurse} activeLink={activeLink}   onClick={handleNavLinkClick}/>
           */}
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
       <div className="md:hidden absolute right-0 top-[80px] bg-gray-800 w-[50%] py-9" style={{ zIndex: 999, borderBottomLeftRadius: '10px', overflow: 'hidden' }}>
       {filteredNavLinks.map((navLink, index) => (
         <CustomNavLink
           key={index}
           to={navLink.to}
           id={navLink.id}
           label={navLink.label}
           icon={navLink.icon}
           activeLink={activeLink} 
           onClick={handleNavLinkClick}
         />
       ))}
       <div className='ml-3 mt-3'>
         <Logoutbutton />
       </div>
     </div>
     
      )}
    </nav>
  );
};

const CustomNavLink = ({ to, id,label, icon, activeLink, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      id={id}
      onClick={() => onClick(to)} // Actualiza el estado de la ruta activa al hacer clic en el enlace
      className={`hvr-sweep-to-top before:bg-[#fc6b03] text-white px-4 py-2 ml-2 rounded block md:inline-block relative ${activeLink === to ? 'activeLink' : ''}`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" /> {label}
    </RouterNavLink>
  );
};

export default Navbar;
