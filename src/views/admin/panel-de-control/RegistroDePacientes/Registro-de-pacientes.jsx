import React, { useState, useEffect } from 'react';
import RegistroClientes from './RegistroClientes';
import AperturaExamenesPreOcup from './AperturaExamenes/AperturaExamenesPreOcup';
import ImportacionModal from './ImportacionMasiva';
import ImportacionModalBasica from './ImportacionModalBasica';
import ReservaPacientes from './ReservaPacientes';
import ConsentimientoDigitalizacion from './ConsentimientoDigitalizacion/ConsentimientoDigitalizacion';
import Triaje from './Triaje/Triaje';
import Consentimientos from './Laboratorio/Consentimientos/Consentimientos';
import Resultados from './Resultados/Resultados';
import ExamenesLaboratorio from './Laboratorio/ExamenesLaboratorio/ExamenesLaboratorio';
import ParasitologiaCoprologico from './Parasitologia/ParasitologiaCoprologico';
import { ComboboxEmpresasMulti, ComboboxContratasMulti, ComboboxMedicosMulti, ComboboxPruebaMulti, ComboboxCargoMulti, ComboboxAreaMulti,
  ComboboxExamenMMulti, ComboboxExplotacionMulti, ComboboxMineralMulti, ComboboxAlturaMulti, ComboboxPrecioExamenMulti, ComboboxFormaPago, ComboboxListAuth, ComboboxProfesión,
  ComboboxDepartamentos,
  ComboboxProvincias,
  ComboboxDistritos
 } from './model/Combobox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faClipboardList,
  faFileExcel,
  faExpand,
  faTicket,
  faFileSignature,
  faStethoscope,
  faFileContract,
  faChartLine,
  faVial,
  faUserCheck,
  faUserMd,
  faXRay,
  faHeartbeat,
  faLungs,
  faDeaf,
  faTooth,
  faEye,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import './TabComponent.css';
import { useAuthStore } from '../../../../store/auth';
import { Loading } from '../../../components/Loading';
import styles from './Drawer/DrawerOverlay.module.css';
import DrawerQuickAccess from './Drawer/DrawerQuickAccess';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(null); // null: dashboard, 0: Admisión, 1: Triaje, 2: Laboratorio
  const [subTab, setSubTab] = useState(0); // Para tabs internos de Admisión
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [DNIG, setDNIG] = useState("")
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const Acceso = useAuthStore(state => state.listAccesos);
  const [vista, setVista] = useState('default'); // 'default', 'admision', 'triaje', etc.
  const [tabLab, setTabLab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTabAdmi, setActiveTabAdmi] = useState(0);
  const [showTabsAdmi, setShowTabsAdmi] = useState(false);
  const [labTab, setLabTab] = useState(0); // Para tabs internos de Laboratorio

  // permisos
  const AccessRegistroC = Acceso.includes("AccesoRP");
  const AccessHistoriaC = Acceso.includes("AccesoHC");
  const AccessCitas = Acceso.includes("AccesoReservaP");
  const AccesExcelBasico = Acceso.includes(656);
  const AccesExcelCompleto = Acceso.includes(657);
  const AccesTriaje = Acceso.includes("AccesoTriaje");
  //COMBOBOX REGISTRO
  const Profesiones   = ComboboxProfesión();
  const Departamentos = ComboboxDepartamentos();
  const Provincias    = ComboboxProvincias();
  const Distritos     = ComboboxDistritos();
  const listasCombosR = {
    Profesiones,Departamentos,Provincias,Distritos
  }
  //COMBOBOX HC
  
  const EmpresasMulti = ComboboxEmpresasMulti("T-NP")
  const ContrataMulti = ComboboxContratasMulti("T-NP")
  const MedicosMulti = ComboboxMedicosMulti("T-NP")
  const PruebaMulti = ComboboxPruebaMulti("T-NP")
  const CargosMulti = ComboboxCargoMulti("T-NP")
  const AreaMulti = ComboboxAreaMulti("T-NP")
  const ExamenMulti = ComboboxExamenMMulti("T-NP")
  const ExplotacionMulti = ComboboxExplotacionMulti("T-NP")
  const MineralMulti = ComboboxMineralMulti("T-NP")
  const AlturaMulti = ComboboxAlturaMulti("T-NP")
  const FormaPago = ComboboxFormaPago("T-NP")
  const ListAuth = ComboboxListAuth("T-NP")

  const [datos, setDatos] = useState({
    codPa: '',
    nombresPa: '',
    apellidosPa: '',
    fechaNaciminetoPa: '',
    sexoPa: '',
    emailPa: '',
    lugarNacPa: '',
    nivelEstPa: '',
    ocupacionPa: '',
    estadoCivilPa: '',
    direccionPa: '',
    departamentoPa: '',
    provinciaPa: '',
    distritoPa: '',
    caserioPA: '',
    telCasaPa: '',
    celPa: '',
  });

  const listasCombos = {
    EmpresasMulti,ContrataMulti,MedicosMulti,PruebaMulti,CargosMulti,AreaMulti,ExamenMulti,ExplotacionMulti,MineralMulti,AlturaMulti,
    FormaPago,
    ListAuth
  };

  const Acces = {
    Registro: AccessRegistroC,
    Historia: AccessHistoriaC,
    Citas: AccessCitas,
    ExcelB: AccesExcelBasico,
    ExcelC: AccesExcelCompleto,
    Triaje: AccesTriaje
  };

  const accesos = [
    { icon: faUserCheck, label: 'Admisión' },
    { icon: faStethoscope, label: 'Triaje' },
    { icon: faVial, label: 'Laboratorio' },
    { icon: faUserMd, label: 'Psicología' },
    { icon: faUserMd, label: 'Medicina General' },
    { icon: faXRay, label: 'Rayos X' },
    { icon: faHeartbeat, label: 'EKG' },
    { icon: faLungs, label: 'Espirometría' },
    { icon: faDeaf, label: 'Audiometría' },
    { icon: faTooth, label: 'Odontología' },
    { icon: faEye, label: 'Oftalmología' },
  ];

  /*useEffect(() => {
    // inicializa la primera pestaña a la que el usuario tiene acceso
    const keys = Object.keys(Acces);
    for (let i = 0; i < keys.length; i++) {
      if (Acces[keys[i]]) {
        setActiveTab(i);
        break;
      }
    }
  }, []);*/

  const changeTab = (tabIndex) => setActiveTab(tabIndex);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCompleteModal = () => setIsCompleteModalOpen(true);
  const closeCompleteModal = () => setIsCompleteModalOpen(false);
  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="mx-auto  overflow-hidden w-[100%] relative ">
   
        
        {/* <div className="flex items-center">
          {Acces.ExcelB && (
            <button className="verde-btn px-4 rounded flex items-center mr-4 sm:mr-2" onClick={openCompleteModal}>
              <FontAwesomeIcon icon={faFileExcel} className="mr-2 px-1 py-2" />
              Excel Básico
            </button>
          )}
          {Acces.ExcelC && (
            <button className="verde-btn px-4 rounded flex items-center mr-4 sm:mr-2" onClick={openModal}>
              <FontAwesomeIcon icon={faFileExcel} className="mr-2 px-1 py-2" />
              Excel Completo
            </button>
          )}
          <button
            className="naranja-btn px-4 rounded flex items-center hidden sm:flex"
            onClick={toggleFullScreen}
          >
            <FontAwesomeIcon icon={faExpand} className="mr-2 px-1 py-2" />
            Expandir
          </button>
        </div> */}

      <div className="bg-white rounded-lg overflow-hidden shadow-md relative p-8">
           {/* Select de Sedes y accesos tipo dashboard */}
      {activeTab === null && (
        <>
          <div className="mb-4 w-full flex justify-center">
            <select className="border border-gray-300 rounded px-6 py-3 text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[220px] text-center">
              <option value="">Sedes</option>
              <option value="sede1">Sede 1</option>
              <option value="sede2">Sede 2</option>
              <option value="sede3">Sede 3</option>
            </select>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 mt-10">
            <div
              className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveTab(0)}
            >
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faUserCheck} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Admisión</span>
            </div>
            {Acces.Triaje && ( 
            <div
              className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveTab(1)}
            >
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faStethoscope} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Triaje</span>
            </div>
            )}
            <div
              className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveTab(2)}
            >
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faVial} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Laboratorio</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faUserMd} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Psicología</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faUserMd} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Medicina General</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faXRay} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Rayos X</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faHeartbeat} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">EKG</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faLungs} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Espirometría</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faDeaf} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Audiometría</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faTooth} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Odontología</span>
            </div>
            <div className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group">
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faEye} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Oftalmología</span>
            </div>
            <div
              className="flex items-center bg-gray-100 hover:bg-[#1a2536] shadow-md rounded-xl px-4 py-7 min-w-[180px] transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveTab(3)}
            >
              <span className="text-orange-500 text-3xl mr-4 group-hover:text-white transition-all duration-200">
                <FontAwesomeIcon icon={faClipboardList} />
              </span>
              <span className="font-bold text-xl text-gray-900 group-hover:text-white transition-all duration-200">Coproparasitológico</span>
            </div>
          </div>
        </>
      )}

        <ImportacionModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          selectedSede="T-NP"
          token={token}
          userlogued={userlogued}
        />
        <ImportacionModalBasica
          isOpen={isCompleteModalOpen}
          onRequestClose={closeCompleteModal}
          selectedSede="T-NP"
          token={token}
          userlogued={userlogued}
        />

        <div className="bg-white rounded-lg overflow-hidden w-full mx-auto">
          {vista === 'default' && (
            <>
              {/* No renderices el bloque de tabs cuando vista sea 'default' */}
            </>
          )}

          {/* Tabs dinámicos */}
          {activeTab === 0 && (
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 border-b-4 border-[#1a2536] text-[#1a2536]`}
                >
                  Admisión
                </button>
                <button
                  className="ml-auto text-gray-400 hover:text-red-500 px-2"
                  onClick={() => setActiveTab(null)}
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
              <div>
                <div className="flex border-b mb-6">
                  {Acces.Registro && ( 
                    <button
                    className={`px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 border-b-4 border-[#1a2536] text-[#1a2536]`}
                    onClick={() => setSubTab(0)}
                  >
                    Registro de Pacientes
                  </button>
                  )}
                  <button
                    className={`ml-4 px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 ${subTab === 1 ? 'border-b-4 border-[#1a2536] text-[#1a2536]' : 'text-gray-500'}`}
                    onClick={() => setSubTab(1)}
                  >
                    Consentimiento Digitalización
                  </button>
                  {Acces.Historia && ( 
                  <button
                    className={`ml-4 px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 ${subTab === 2 ? 'border-b-4 border-[#1a2536] text-[#1a2536]' : 'text-gray-500'}`}
                    onClick={() => setSubTab(2)}
                  >
                    Apertura Exámenes PreOcup
                  </button>
                  )}
                </div>
                <div>
                  {subTab === 0 && (
                    <RegistroClientes
                      listas={listasCombosR}
                      datos={datos}
                      setDatos={setDatos}
                      selectedSede={"T-NP"}
                      token={token}
                      tabHC={() => {}}
                      ChangeDNI={() => {}}
                    />
                  )}
                  {subTab === 1 && (
                    <ConsentimientoDigitalizacion token={token} userlogued={userlogued} />
                  )}
                  {subTab === 2 && (
                    <AperturaExamenesPreOcup
                      listas={listasCombos}
                      DNIG={DNIG}
                      selectedSede={"T-NP"}
                      token={token}
                      PrecioC={() => {}}
                      ChangeDNI={() => {}}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 border-b-4 border-[#1a2536] text-[#1a2536]`}
                >
                  Triaje
                </button>
                <button
                  className="ml-auto text-gray-400 hover:text-red-500 px-2"
                  onClick={() => setActiveTab(null)}
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
              <Triaje token={token} selectedSede={"T-NP"} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 ${labTab === 0 ? 'border-b-4 border-[#1a2536] text-[#1a2536]' : 'text-gray-500'}`}
                  onClick={() => setLabTab(0)}
                >
                  Exámenes
                </button>
                <button
                  className={`ml-4 px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 ${labTab === 1 ? 'border-b-4 border-[#1a2536] text-[#1a2536]' : 'text-gray-500'}`}
                  onClick={() => setLabTab(1)}
                >
                  Consentimientos
                </button>
                <button
                  className="ml-auto text-gray-400 hover:text-red-500 px-2"
                  onClick={() => setActiveTab(null)}
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
              <div>
                {labTab === 0 && <ExamenesLaboratorio token={token} selectedSede={"T-NP"} />}
                {labTab === 1 && <Consentimientos token={token} selectedSede={"T-NP"} />}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-6 py-2 font-bold text-lg focus:outline-none transition-colors duration-200 border-b-4 border-[#1a2536] text-[#1a2536]`}
                >
                  Coproparasitológico
                </button>
                <button
                  className="ml-auto text-gray-400 hover:text-red-500 px-2"
                  onClick={() => setActiveTab(null)}
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
              <ParasitologiaCoprologico />
            </div>
          )}
        </div>
      </div>

      {/* FAB flotante */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-[#1a2536] hover:bg-[#273656] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir menú rápido"
      >
        <FontAwesomeIcon icon={faBars} className="text-3xl" />
      </button>

      <DrawerQuickAccess
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={idx => {
          setDrawerOpen(false);
          if (idx === 7) {
            setActiveTab(null); // Ir a inicio/dashboard
          } else if (idx === 0) {
            setActiveTab(0);
          } else if (idx === 1) {
            setActiveTab(1);
          } else if (idx === 2) {
            setActiveTab(2);
          } else if (idx === 3) {
            setActiveTab(3);
          }
        }}
        activeIndex={activeTab}
      />
    </div>
  );
};

export default TabComponent;
