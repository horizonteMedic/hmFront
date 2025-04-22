import React, { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faList, faLock, faSignOutAlt, faPersonCirclePlus, faHome } from '@fortawesome/free-solid-svg-icons';

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
    { to: "/roles", id: "2", label: "Roles", icon: faUser },
    { to: "/accesos", id: "52", label: "Accesos", icon: faLock },
    { to: "/reporte-pacientes", id: "54", label: "Reportes", icon: faChartBar },
    { to: "/matriz-postulante", id: "55", label: "Matriz Postulante", icon: faList },
    { to: "/Registro-de-pacientes", id: "3", label: "Registro de Pacientes", icon: faPersonCirclePlus },
  ].filter(navLink => allowedRoutes.includes(navLink.id));

  const Logoutbutton = () => {
    return (
      <button
        onClick={() => { setToken(null); setuserlogued(null); }}
        className="ml-4 flex items-center justify-center w-24 h-10 bg-red-600 rounded-full text-white font-bold hover:bg-red-700 transition duration-300 ease-in-out"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Salir
      </button>
    );
  };

  return (
    <nav className="bg-[#233245] px-4 py-3 flex justify-between items-center text-white shadow-md">
      <div className="flex items-center">
        <Link to="/panel-de-control" onClick={handleLogoClick}>
        <img src="img/logo-blanco.png" alt="Logo" className="w-full h-[40px]  mr-4" />
        </Link>
      </div>

      <div className="hidden md:flex items-center">
        <CustomNavLink
          to="/panel-de-control"
          label="Inicio"
          icon={faHome}
          activeLink={activeLink}
          onClick={handleNavLinkClick}
        />
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
        <div className="md:hidden absolute right-0 top-[80px] bg-gray-800 w-[60%] py-9 shadow-lg" style={{ zIndex: 999, borderBottomLeftRadius: '10px', overflow: 'hidden' }}>
          <CustomNavLink
            to="/panel-de-control"
            label="Inicio"
            icon={faHome}
            activeLink={activeLink}
            onClick={handleNavLinkClick}
          />
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

const CustomNavLink = ({ to, id, label, icon, activeLink, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      id={id}
      onClick={() => onClick(to)}
      className={`hvr-sweep-to-top before:bg-[#fc6b03] text-white px-4 py-2 ml-2 rounded block md:inline-block relative font-bold ${activeLink === to ? 'bg-[#fc6b03] text-white' : 'hover:bg-[#fc6b03]'}`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {label}
    </RouterNavLink>
  );
};

export default Navbar;
