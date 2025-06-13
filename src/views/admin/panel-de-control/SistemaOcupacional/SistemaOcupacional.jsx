import React, { useState, useEffect, useRef } from 'react';
import RegistroClientes from './Admision/RegistroClientes.jsx';
import AperturaExamenesPreOcup from './Admision/AperturaExamenes/AperturaExamenesPreOcup.jsx';
import ImportacionModal from './Admision/ImportacionMasiva.jsx';
import ImportacionModalBasica from './Admision/ImportacionModalBasica.jsx';
import ReservaPacientes from './Admision/ReservaPacientes.jsx';
import ConsentimientoDigitalizacion from './Admision/ConsentimientoDigitalizacion/ConsentimientoDigitalizacion.jsx';
import Triaje from './Triaje/Triaje';
import Consentimientos from './Laboratorio/Consentimientos/Consentimientos.jsx';
import ExamenesLaboratorio from './Laboratorio/ExamenesLaboratorio/ExamenesLaboratorio';
import ParasitologiaCoprologico from './Parasitologia/ParasitologiaCoprologico';
import LaboratorioClinico from './Laboratorio/LaboratorioClinico/LaboratorioClinico';
import LaboratorioAnalisisBioquimicos from './Laboratorio/laboratorio_analisis_bioquimicos/LaboratorioAnalisisBioquimicos';
import InmunologiaTab from './Laboratorio/Inmunologia/Inmunologia_tab.jsx';
import Toxicologia from './Laboratorio/Toxicologia/Toxicologia';
import Manipuladores from './Laboratorio/Manipuladores/Manipuladores';
import PruebasCovid from './Laboratorio/PruebasCovid/PruebasCovid';
import {
  ComboboxEmpresasMulti,
  ComboboxContratasMulti,
  ComboboxMedicosMulti,
  ComboboxPruebaMulti,
  ComboboxCargoMulti,
  ComboboxAreaMulti,
  ComboboxExamenMMulti,
  ComboboxExplotacionMulti,
  ComboboxMineralMulti,
  ComboboxAlturaMulti,
  ComboboxPrecioExamenMulti,
  ComboboxFormaPago,
  ComboboxListAuth,
  ComboboxProfesión,
  ComboboxDepartamentos,
  ComboboxProvincias,
  ComboboxDistritos
} from './Admision/model/Combobox.jsx';
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
  faTimes,
  faFlask,
  faFilter,
  faVirus,
  faSyringe,
  faFileAlt,
  faMicroscope,
  faVialVirus,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import styles from './SistemaOcupacional.module.css';
import { useAuthStore } from '../../../../store/auth';
import { Loading } from '../../../components/Loading';
import DrawerQuickAccess from './Drawer/DrawerQuickAccess';

const hiddenExamTabs = [
  { key: 6, label: 'Anexo 16 A' },
  { key: 7, label: 'Test Altura' },
  { key: 8, label: 'Bioquímica' },
  { key: 9, label: 'Gonadotropina' },
  { key: 10, label: 'Perfil Hepático' },
  { key: 11, label: 'Hepatitis' },
  { key: 12, label: 'ANEXO 16A - TEST DE ALTURA - PSICOSENSOMETRICO' },
  { key: 13, label: 'Hemograma Automatizado' },
  { key: 14, label: 'Psicosensometría' },
  { key: 15, label: 'Coproparasitología' },
];

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(null); // null: dashboard, 0: Admisión, 1: Triaje, 2: Laboratorio
  const [subTab, setSubTab] = useState(0); // Para tabs internos de Admisión
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [DNIG, setDNIG] = useState("")
  const token = useAuthStore(state => state.token);
  const userlogued = useAuthStore(state => state.userlogued);
  const Vista = useAuthStore(state => state.listView)
  const Acceso = useAuthStore(state => state.listAccesos);
  const [vista, setVista] = useState('default'); // 'default', 'admision', 'triaje', etc.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labTab, setLabTab] = useState(0); // Para tabs internos de Laboratorio
  const [activeTabExamenes, setActiveTabExamenes] = useState(1); // Para ExamenesLaboratorio
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const contextMenuRef = useRef(null);

  //Sede
  const [selectSede, setSelectSede] = useState("")

  useEffect(() => {
    if (userlogued?.sedes?.length > 0) {
      const sedeTNP = userlogued.sedes.find(sede => sede.cod_sede === "T-NP");
      setSelectSede(sedeTNP?.cod_sede || userlogued.sedes[0].cod_sede);
    }
  }, [userlogued.sedes]);
  // permisos
  const ViewAdminision = Vista.includes("Admision")
  const ViewTriaje = Vista.includes("Triaje")
  const ViewLaboratorio = Vista.includes("Laboratorio")
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

  const AccesViews = {
    ViewAdminision: ViewAdminision,
    ViewTriaje: ViewTriaje,
    ViewLaboratorio: ViewLaboratorio,
    ATriaje: AccesTriaje
  }
  
  const AccesAdmision = {
    Registro: AccessRegistroC,
    Historia: AccessHistoriaC,
    Citas: AccessCitas,
    ExcelB: AccesExcelBasico,
    ExcelC: AccesExcelCompleto,
  };

  const tienePermisoEnVista = (nombreVista, permiso) => {
    const vista = Acceso.find(item => item.nombre === nombreVista);
    return vista?.listaPermisos.includes(permiso) ?? false;
  };

 

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
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {activeTab === null && (
          <>
            <div className={styles.sedeSelector}>
              <select 
                className={styles.sedeSelect}
                onChange={(e) => setSelectSede(e.target.value)}
                value={selectSede}
              >
                {userlogued.sedes.map((option, index) => (
                  <option key={index} value={option.cod_sede}>{option.nombre_sede}</option>
                ))}
              </select>
            </div>
            <div className={styles.gridContainer}>
              {AccesViews.ViewAdminision && (
                <div
                  className={`${styles.gridItem} ${activeTab === 0 ? styles.active : ''}`}
                  onClick={() => setActiveTab(0)}
                >
                  <span className={styles.icon}>
                    <FontAwesomeIcon icon={faUserCheck} />
                  </span>
                  <span className={styles.title}>Admisión</span>
                </div>
              )}
              {AccesViews.ViewTriaje && (
                <div
                  className={`${styles.gridItem} ${activeTab === 1 ? styles.active : ''}`}
                  onClick={() => setActiveTab(1)}
                >
                  <span className={styles.icon}>
                    <FontAwesomeIcon icon={faStethoscope} />
                  </span>
                  <span className={styles.title}>Triaje</span>
                </div>
              )}
              {AccesViews.ViewLaboratorio && (
                <div
                  className={`${styles.gridItem} ${activeTab === 2 ? styles.active : ''}`}
                  onClick={() => setActiveTab(2)}
                >
                  <span className={styles.icon}>
                    <FontAwesomeIcon icon={faVial} />
                  </span>
                  <span className={styles.title}>Laboratorio</span>
                </div>
              )}
              <div
                className={`${styles.gridItem} ${activeTab === 3 ? styles.active : ''}`}
                onClick={() => setActiveTab(3)}
              >
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faClipboardList} />
                </span>
                <span className={styles.title}>Coproparasitológico</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 10 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUserMd} />
                </span>
                <span className={styles.title}>Psicología</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 11 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faUserMd} />
                </span>
                <span className={styles.title}>Medicina General</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 12 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faXRay} />
                </span>
                <span className={styles.title}>Rayos X</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 13 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faHeartbeat} />
                </span>
                <span className={styles.title}>EKG</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 14 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faLungs} />
                </span>
                <span className={styles.title}>Espirometría</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 15 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faDeaf} />
                </span>
                <span className={styles.title}>Audiometría</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 16 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faTooth} />
                </span>
                <span className={styles.title}>Odontología</span>
              </div>
              <div className={`${styles.gridItem} ${activeTab === 17 ? styles.active : ''}`}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faEye} />
                </span>
                <span className={styles.title}>Oftalmología</span>
              </div>
            </div>
          </>
        )}

        <ImportacionModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          selectedSede={selectSede}
          token={token}
          userlogued={userlogued}
        />
        <ImportacionModalBasica
          isOpen={isCompleteModalOpen}
          onRequestClose={closeCompleteModal}
          selectedSede={selectSede}
          token={token}
          userlogued={userlogued}
        />

        <div className={styles.tabContainer}>
          {activeTab === 0 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(null)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Admisión</h2>
              </div>
              <div>
                <div className={styles.tabHeader}>
                  {tienePermisoEnVista("Admision","AccesoRP") && (
                    <button
                      className={`${styles.tabButton} ${subTab === 0 ? styles.active : ''}`}
                      onClick={() => setSubTab(0)}
                    >
                      Registro de Pacientes
                    </button>
                  )}
                  {tienePermisoEnVista("Admision","AccesoHC") && (
                    <button
                      className={`${styles.tabButton} ${subTab === 2 ? styles.active : ''}`}
                      onClick={() => setSubTab(2)}
                    >
                      Apertura Exámenes PreOcup
                    </button>
                  )}
                  {tienePermisoEnVista("Admision","AccesoReservaP") && (
                    <button
                      className={`${styles.tabButton} ${subTab === 1 ? styles.active : ''}`}
                      onClick={() => setSubTab(1)}
                    >
                      Consentimiento Digitalización
                    </button>
                  )}
                </div>
                <div>
                  {subTab === 0 && (
                    <RegistroClientes
                      listas={listasCombosR}
                      datos={datos}
                      setDatos={setDatos}
                      selectedSede={selectSede}
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
                      selectedSede={selectSede}
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
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(null)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Triaje</h2>
              </div>
              <Triaje token={token} selectedSede={selectSede} />
            </div>
          )}
         {activeTab === 2 && (
            <div>
              {/* ——— Header con botón "Atrás" y título ——— */}
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(null)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Laboratorio</h2>
              </div>

              {/* ——— Sub-menú fijo ——— */}
              <nav className={styles.labNav}>
                <button
                  className={`${styles.labNavButton} ${labTab === 0 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(0)}
                >
                  <FontAwesomeIcon icon={faFlask} className="mr-2" />
                  LABORATORIO CLÍNICO
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 1 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(1)}
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  ANÁLISIS BIOQUÍMICOS
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 2 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(2)}
                >
                  <FontAwesomeIcon icon={faVirus} className="mr-2" />
                  INMUNOLOGÍA
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 3 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(3)}
                >
                  <FontAwesomeIcon icon={faSyringe} className="mr-2" />
                  TOXICOLOGÍA
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 4 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(4)}
                >
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  CONSENTIMIENTOS
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 5 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(5)}
                >
                  <FontAwesomeIcon icon={faMicroscope} className="mr-2" />
                  MANIPULADORES
                </button>
                <button
                  className={`${styles.labNavButton} ${labTab === 6 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(6)}
                >
                  <FontAwesomeIcon icon={faVialVirus} className="mr-2" />
                  PRUEBAS COVID
                </button>
                {/* <button
                  className={`${styles.labNavButton} ${labTab === 7 ? styles.labNavButtonActive : ''}`}
                  onClick={() => setLabTab(7)}
                >
                  <FontAwesomeIcon icon={faNotesMedical} className="mr-2" />
                  EXÁMENES
                </button> */}
              </nav>

              {/* ——— Contenido según pestaña ——— */}
              <div className={styles.labContent}>
                {labTab === 0 && <LaboratorioClinico token={token} selectedSede={selectSede} userlogued={userlogued.sub}/>}
                {labTab === 1 && <LaboratorioAnalisisBioquimicos token={token} selectedSede={selectSede} userlogued={userlogued.sub}/>}
                {labTab === 2 && <InmunologiaTab token={token} selectedSede={selectSede} userlogued={userlogued.sub} />}
                {labTab === 3 && <Toxicologia token={token} selectedSede={selectSede} userlogued={userlogued.sub} />}
                {labTab === 4 && (
                  <Consentimientos token={token} selectedSede={selectSede} userlogued={userlogued.sub} />
                )}
                {labTab === 5 && <Manipuladores token={token} selectedSede={selectSede} userlogued={userlogued.sub} />}
                {labTab === 6 && <PruebasCovid token={token} selectedSede={selectSede} userlogued={userlogued.sub} />}
                {/* {labTab === 7 && (
                  <ExamenesLaboratorio
                    token={token}
                    selectedSede={selectSede}
                    userlogued={userlogued.sub}
                    activeTabExamenes={activeTabExamenes}
                    setActiveTabExamenes={setActiveTabExamenes}
                  />
                )} */}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(null)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Coproparasitológico</h2>
              </div>
              <ParasitologiaCoprologico />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(2)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Laboratorio Clínico</h2>
              </div>
              <LaboratorioClinico />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(2)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Análisis Bioquímicos</h2>
              </div>
              <LaboratorioAnalisisBioquimicos />
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(2)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Consentimientos</h2>
              </div>
              <Consentimientos token={token} selectedSede={selectSede} userlogued={userlogued.sub}/>
            </div>
          )}
          {/* {activeTab === 7 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => setActiveTab(2)}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">Exámenes</h2>
              </div>
              <ExamenesLaboratorio token={token} selectedSede={selectSede} userlogued={userlogued.sub} activeTabExamenes={activeTabExamenes} setActiveTabExamenes={setActiveTabExamenes} />
            </div>
          )} */}
        </div>
      </div>

      <button
        className={styles.fabButton}
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir menú rápido"
      >
        <FontAwesomeIcon icon={faBars} className={styles.fabIcon} />
      </button>

      <DrawerQuickAccess
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={idx => {
          setDrawerOpen(false);
          if (idx === 7) {
            setActiveTab(null);
          } else if (idx === 0) {
            setActiveTab(0);
          } else if (idx === 1) {
            setActiveTab(1);
          } else if (idx === 2) {
            setActiveTab(2);
          } else if (idx === 3) {
            setActiveTab(3);
          } else if (idx === 4) {
            setActiveTab(4);
          } else if (idx === 5) {
            setActiveTab(5);
          } else if (idx === 6) {
            setActiveTab(6);
          }
        }}
        activeIndex={activeTab}
      />

      {/* Context Menu for hidden exam tabs */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, background: 'white', border: '1px solid #ccc', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 0, margin: 0, minWidth: 220 }}
        >
          {hiddenExamTabs.map(tab => (
            <li
              key={tab.key}
              style={{ listStyle: 'none', padding: '10px 18px', cursor: 'pointer', fontSize: 15, color: '#233245', borderBottom: '1px solid #eee' }}
              onClick={() => {
                setActiveTab(2);
                setActiveTabExamenes(tab.key);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TabComponent;
