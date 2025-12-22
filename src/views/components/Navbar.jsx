import { useEffect, useRef, useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faHome, faNotesMedical, faSignOutAlt, faTrash, faWifi } from '@fortawesome/free-solid-svg-icons';
import { URLAzure } from '../config/config';
import { clearLocalStorageExceptAuth } from '../utils/helpers';
import Swal from 'sweetalert2';
import CelebrationAnimation from './CelebrationAnimation';

const getNavigatorConnection = () =>
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;

const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return sorted[mid];
};

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);

  const [diasParaPago, setDiasParaPago] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [networkLevel, setNetworkLevel] = useState("good");
  const [networkTitle, setNetworkTitle] = useState("");
  const pingSamplesRef = useRef([]);
  const flapsRef = useRef([]);

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
  }, []);

  useEffect(() => {
    let cancelled = false;

    const computeLevel = () => {
      const online = navigator.onLine;
      if (!online) {
        return { level: "offline", title: "Sin conexión a internet" };
      }

      const now = Date.now();
      flapsRef.current = flapsRef.current.filter((t) => now - t <= 60_000);
      const recentFlaps = flapsRef.current.length;

      const connection = getNavigatorConnection();
      const effectiveType = connection?.effectiveType;
      const downlink = typeof connection?.downlink === "number" ? connection.downlink : null;
      const rtt = typeof connection?.rtt === "number" ? connection.rtt : null;
      const saveData = connection?.saveData === true;

      let severity = 0;
      const reasons = [];

      if (effectiveType === "slow-2g" || effectiveType === "2g") {
        severity = Math.max(severity, 2);
        reasons.push(`Tipo de red: ${effectiveType}`);
      } else if (effectiveType === "3g") {
        severity = Math.max(severity, 1);
        reasons.push(`Tipo de red: ${effectiveType}`);
      }

      if (downlink !== null) {
        if (downlink < 1) {
          severity = Math.max(severity, 2);
          reasons.push("Baja velocidad");
        } else if (downlink < 2) {
          severity = Math.max(severity, 1);
          reasons.push("Velocidad limitada");
        }
      }

      if (rtt !== null) {
        if (rtt > 600) {
          severity = Math.max(severity, 2);
          reasons.push("Alta latencia");
        } else if (rtt > 300) {
          severity = Math.max(severity, 1);
          reasons.push("Latencia elevada");
        }
      }

      if (saveData) {
        severity = Math.max(severity, 1);
        reasons.push("Ahorro de datos activo");
      }

      if (recentFlaps >= 2) {
        severity = Math.max(severity, 1);
        reasons.push("Cambios recientes de red");
      }

      const samples = pingSamplesRef.current.slice(-5);
      const failures = samples.filter((s) => !s.ok).length;
      const okLatencies = samples.filter((s) => s.ok).map((s) => s.ms);

      if (failures >= 3) {
        severity = Math.max(severity, 2);
        reasons.push("Conexión intermitente");
      } else if (failures >= 1) {
        severity = Math.max(severity, 1);
        reasons.push("Conexión inestable");
      }

      const med = median(okLatencies);
      if (med !== null) {
        if (med > 1500) {
          severity = Math.max(severity, 2);
          reasons.push(`Latencia ~${med}ms`);
        } else if (med > 900) {
          severity = Math.max(severity, 1);
          reasons.push(`Latencia ~${med}ms`);
        }
      }

      if (okLatencies.length >= 3) {
        const min = Math.min(...okLatencies);
        const max = Math.max(...okLatencies);
        if (max - min > 1200) {
          severity = Math.max(severity, 1);
          reasons.push("Latencia variable");
        }
      }

      const level = severity >= 2 ? "low" : severity === 1 ? "unstable" : "good";
      const baseTitle =
        level === "low" ? "Conexión baja" : level === "unstable" ? "Conexión inestable" : "";
      const title = baseTitle && reasons.length ? `${baseTitle}: ${reasons.join(" · ")}` : baseTitle;
      return { level, title };
    };

    const syncState = () => {
      if (cancelled) return;
      const { level, title } = computeLevel();
      setNetworkLevel(level);
      setNetworkTitle(title);
    };

    const recordFlapAndSync = () => {
      flapsRef.current = [...flapsRef.current, Date.now()];
      syncState();
    };

    const pingOnce = async () => {
      if (cancelled) return;
      if (!navigator.onLine) {
        syncState();
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const started = performance.now();

      try {
        await fetch(`${window.location.origin}/`, {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
        const ms = Math.max(0, Math.round(performance.now() - started));
        pingSamplesRef.current = [...pingSamplesRef.current, { ok: true, ms }].slice(-10);
      } catch {
        pingSamplesRef.current = [...pingSamplesRef.current, { ok: false, ms: 0 }].slice(-10);
      } finally {
        clearTimeout(timeoutId);
      }

      syncState();
    };

    const connection = getNavigatorConnection();

    syncState();
    const initialPingTimeout = setTimeout(pingOnce, 1200);
    const pingIntervalId = setInterval(pingOnce, 15_000);

    window.addEventListener("online", recordFlapAndSync);
    window.addEventListener("offline", recordFlapAndSync);
    connection?.addEventListener?.("change", syncState);

    return () => {
      cancelled = true;
      clearTimeout(initialPingTimeout);
      clearInterval(pingIntervalId);
      window.removeEventListener("online", recordFlapAndSync);
      window.removeEventListener("offline", recordFlapAndSync);
      connection?.removeEventListener?.("change", syncState);
    };
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

  const NetworkIndicator = ({ className = "" }) => {
    if (networkLevel === "good") return null;

    const config =
      networkLevel === "offline"
        ? { iconClass: "text-red-400", title: "Sin conexión a internet" }
        : networkLevel === "low"
          ? { iconClass: "text-orange-300", title: networkTitle || "Conexión baja" }
          : { iconClass: "text-yellow-300 animate-pulse", title: networkTitle || "Conexión inestable" };

    return (
      <div className={`flex items-center ${className}`} title={config.title} aria-label={config.title}>
        {networkLevel == "offline" && <p className='text-red-400 font-semibold mr-4'>Sin conexión a Internet</p>}
        <FontAwesomeIcon icon={faWifi} className={`text-xl ${config.iconClass}`} />
      </div>
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
            <p className='font-bold mr-5'>HOST DESARROLLO</p>
            <div className={`text-white px-4 py-2 rounded-full flex items-center mr-5 ${diasParaPago === 0 ? 'bg-green-600' :
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
          </>
        )}
        {/* <button className='bg-white text-[#233245] hover:scale-110 ease-in-out p-2 rounded-full flex items-center justify-center duration-300 mr-6'
          onClick={() => { window.location.reload(); }}
          title="Recargar página"
        >
          <FontAwesomeIcon icon={faRetweet} className="w-5 h-5 " />
        </button> */}
        <NetworkIndicator className="mr-5" />
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

      <div className="md:hidden flex items-center">
        <NetworkIndicator className="mr-4" />
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
