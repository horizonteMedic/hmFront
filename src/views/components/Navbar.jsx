import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/panel-de-control">
          <img src="img/Logo.png" alt="Logo" className="w-[150px] mr-4" />
        </Link>
      </div>
      <div className="hidden md:flex items-center">
        <NavLink to="/roles" label="Roles" />
        <NavLink to="/accesos" label="Accesos" />
        <NavLink to="/reporte-pacientes" label="Reportes" />
        <NavLink to="/matriz-postulante" label="Matriz Postulante" />
        <NavLink to="/configuracion" label="Configuración" />
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
        <div className="md:hidden absolute right-0 top-16 bg-gray-800 w-48 py-2">
          <NavLink to="/roles" label="Roles" />
          <NavLink to="/accesos" label="Accesos" />
          <NavLink to="/reporte-pacientes" label="Reportes" />
          <NavLink to="/matriz-postulante" label="Matriz Postulante" />
          <NavLink to="/configuracion" label="Configuración" />
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      to={to}
      className="text-white px-4 py-2 ml-2 rounded block md:inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      {(isHovered || location.pathname === to) && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform duration-500 transform scale-x-100"></div>
      )}
    </Link>
  );
};

export default Navbar;
