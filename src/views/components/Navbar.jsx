import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const Logoutbutton = () => {
    return (
      <button onClick={() => {setToken(null)}} className="group ml-4 min-w-8 flex items-center justify-start w-8 h-8  rounded-full cursor-pointer relative overflow-hidden transition-all duration-700 shadow-md bg-[#fc6b03] hover:w-28    hover:rounded-xl">
        <div className="w-full flex items-center justify-center transition duration-300 group-hover:pl-0 group-hover:w-[40%]">
          <svg viewBox="0 0 512 512" className="w-4 ">
            <path fill='white' d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
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
        <Link to="/panel-de-control">
          <img src="img/logo-blanco.png" alt="Logo" className="w-[150px] p-6 mr-4" />
        </Link>
      </div>
      <div className="hidden md:flex items-center">
        <NavLink to="/roles" label="Roles" />
        <NavLink to="/accesos" label="Accesos" />
        <NavLink to="/reporte-pacientes" label="Reportes" />
        <NavLink to="/matriz-postulante" label="Matriz Postulante" />
        <NavLink to="/configuracion" label="Configuración" />
        <Logoutbutton/>

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
          <Logoutbutton/>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }) => {



  return (
    <Link
      to={to}
      className="hvr-sweep-to-top before:bg-[#fc6b03] text-white px-4 py-2 ml-2 rounded block md:inline-block relative"

    >
      {label}
      
    </Link>
  );
};

export default Navbar;
