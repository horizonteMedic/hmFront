import { useState, useEffect } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faNotesMedical, faHome, faTrash, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { URLAzure } from '../config/config';
import { clearLocalStorageExceptAuth } from '../utils/helpers';
import Swal from 'sweetalert2';
import CelebrationAnimation from './CelebrationAnimation';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);

  const [diasParaPago, setDiasParaPago] = useState(0);
  const [diasParaFinMes, setDiasParaFinMes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Función para calcular días hasta el próximo pago (5 de cada mes)
  const calcularDiasParaPago = () => {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth(); // 0-11
    
    // Crear fecha del 5 del mes actual
    let fechaPago = new Date(añoActual, mesActual, 5);
    
    // Si ya pasó el 5 de este mes, calcular para el próximo mes
    if (hoy.getDate() > 5) {
      fechaPago = new Date(añoActual, mesActual + 1, 5);
    }
    
    // Si el 5 cae en domingo (0), mover al lunes (1)
    if (fechaPago.getDay() === 0) {
      fechaPago.setDate(fechaPago.getDate() + 1);
    }
    
    // Calcular diferencia en días
    const diferenciaTiempo = fechaPago.getTime() - hoy.getTime();
    const dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    
    setDiasParaPago(dias);
    
    // Si es día de pago (0 días), activar animación
    if (dias === 0) {
      setShowCelebration(true);
    }
  };

  // Función para calcular días hasta el fin de este mes
  const calcularDiasParaFinMes = () => {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth(); // 0-11
    
    // Obtener el último día del mes actual
    const ultimoDiaMes = new Date(añoActual, mesActual + 1, 0);
    
    // Calcular diferencia en días
    const diferenciaTiempo = ultimoDiaMes.getTime() - hoy.getTime();
    const dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    
    setDiasParaFinMes(dias);

    // Si es el último día del mes (0 días), activar animación para Viviana
    if (dias === 0) {
      setShowCelebration(true);
    }
  };

  const handleClickReload = () => {
    // Ejecuta tu función
    clearLocalStorageExceptAuth();
    
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Datos limpiados correctamente",
      showConfirmButton: false,
      timer: 2000, // desaparece en 2s
      timerProgressBar: true,
    });
  };

  // // Función para probar la animación de celebración
  // const handleTestCelebration = () => {
  //   setShowCelebration(true);
  //   Swal.fire({
  //     toast: true,
  //     position: "top-end",
  //     icon: "success",
  //     title: "¡Probando animación de celebración! 🎉",
  //     showConfirmButton: false,
  //     timer: 2000,
  //     timerProgressBar: true,
  //   });
  // };

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

  useEffect(() => {
    calcularDiasParaPago();
    calcularDiasParaFinMes();
  }, []);

  const handleNavLinkClick = (to) => {
    setActiveLink(to === "/panel-de-control" ? "" : to);
  };

  const handleLogoClick = () => {
    setActiveLink("");
  };

  const filteredNavLinks = [
    // { to: "/roles", name: "Menú de Roles", label: "Roles", icon: faUser },
    // { to: "/accesos", name: "Menú de Accesos", label: "Accesos", icon: faLock },
    // { to: "/reporte-pacientes", name: "Reportes", label: "Reportes", icon: faChartBar },
    // { to: "/matriz-postulante", name: "Matriz Postulante", label: "Matriz Postulante", icon: faList },
    { to: "/SistemaOcupacional", name: "Modulo Ocupacional", label: "Ocupacional", icon: faNotesMedical },
    // { to: "/permisos", name: "Permisos", label: "Permisos", icon: faKey },
    // { to: "/ekg", name: "Electrocardiograma", label: "EKG", icon: faHeartbeat },
    // { to: "/musculoesqueletico", name: "Evaluación Musculoesquelética", label: "Musculoesquelético", icon: faNotesMedical },
    // { to: "/odontologia", name: "Odontología", label: "Odontología", icon: faTooth },
    // { to: "/rayosx", name: "Rayos X", label: "Rayos X", icon: faXRay },
    //{ to: "/consentimiento-informado", name: "Consentimiento Informado", label: "Consentimiento", icon: faFileSignature },
    // { to: "/HistoriaOcupacional", name: "Historia Ocupacional", label: "Historia Ocupacional", icon: faNotesMedical },
    // { to: "/Espirometria", name: "Espirometría", label: "Espirometría", icon: faNotesMedical },
    // { to: "/Oftalmologia", name: "Oftalmología", label: "Oftalmología", icon: faNotesMedical }
  ];

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
        {URLAzure == "https://testbackendhm.azurewebsites.net" && (
          <>
            <p className='font-bold mr-5'>DEVELOPER</p>
            <div className={`text-white px-4 py-2 rounded-full flex items-center mr-5 ${
              diasParaPago === 0 ? 'bg-green-600' : 
              diasParaPago <= 3 ? 'bg-yellow-500' : 
              diasParaPago <= 7 ? 'bg-orange-500' : 
              'bg-red-500'
            }`}>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-lg" />
              <span className="font-bold text-lg">
                {diasParaPago === 0 ? "¡Hoy es pago! 🎉" : 
                 diasParaPago <= 3 ? `${diasParaPago} días para pago 🚀` : 
                 diasParaPago <= 7 ? `${diasParaPago} días para pago ⏰` : 
                 `${diasParaPago} días para pago 📅`}
              </span>
            </div>
            <div className="text-white px-4 py-2 rounded-full flex items-center mr-5 bg-blue-500">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-lg" />
              <span className="font-bold text-lg">
                Falta {diasParaFinMes} días para dormir a VIVIANA 🥳
              </span>
            </div>
          </>
        )}
        {/* <button className='bg-white text-[#233245] hover:scale-110 ease-in-out p-2 rounded-full flex items-center justify-center duration-300 mr-6'
          onClick={() => { window.location.reload(); }}
          title="Recargar página"
        >
          <FontAwesomeIcon icon={faRetweet} className="w-5 h-5 " />
        </button> */}
        <button
          className='bg-white text-[#233245] hover:scale-110 ease-in-out py-2 px-4 rounded-full flex items-center justify-center duration-300 mr-5 w-28'
          title="Limpiar datos"
          onClick={handleClickReload}
        >
          <FontAwesomeIcon icon={faTrash} className='w-5 h-5' /> <span className='font-bold ml-2'>Limpiar</span>
        </button>
        {/* <button
          className='bg-purple-500 text-white hover:scale-110 ease-in-out py-2 px-3 rounded-full flex items-center justify-center duration-300 mr-5'
          title="Probar animación de celebración"
          onClick={handleTestCelebration}
        >
          <span className='font-bold'>🎉 Probar</span>
        </button> */}
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
      
      {/* Animación de celebración */}
      {URLAzure == "https://testbackendhm.azurewebsites.net" && (
        <CelebrationAnimation show={showCelebration} />
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