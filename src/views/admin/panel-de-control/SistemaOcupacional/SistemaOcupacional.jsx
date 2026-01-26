import { useState, useEffect, useRef } from "react";
import RegistroClientes from "./Admision/RegistroClientes.jsx";
import AperturaExamenesPreOcup from "./Admision/AperturaExamenes/AperturaExamenesPreOcup.jsx";
import ImportacionModal from "./Admision/ImportacionMasiva.jsx";
import ImportacionModalBasica from "./Admision/ImportacionModalBasica.jsx";
import ReservaPacientes from "./Admision/ReservaPacientes.jsx";
import ConsentimientoDigitalizacion from "./Admision/ConsentimientoDigitalizacion/ConsentimientoDigitalizacion.jsx";
import Triaje from "./Triaje/Triaje";
import ConsentimientosSubTabSelector from "./Laboratorio/Consentimientos/ConsentimientosSubTabSelector.jsx";
import ParasitologiaCoprologico from "./Parasitologia/ParasitologiaCoprologico";
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
  ComboboxDistritos,
} from "./Admision/model/Combobox.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faStethoscope,
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
  faFlask,
  faFilter,
  faVirus,
  faSyringe,
  faFileAlt,
  faMicroscope,
  faVialVirus,
  faFileWaveform,
  faAnchor,
  faSkiingNordic,
  faSkull,
  faGamepad,
  faBed,
  faMountain,
  fa2,
  faCheckToSlot,
  fa1,
  fa6,
  faA,
  faBacterium,
  faFileMedical,
  faMoon,
  faCarSide,
  faStairs,
  faSuitcaseMedical,
  faTruckMedical,
  faMaskVentilator,
  faPersonRifle,
  faFolderMinus,
  faBrain,
  faArrowUp,
  faFileContract,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./SistemaOcupacional.module.css";
import { useAuthStore } from "../../../../store/auth";
import { Loading } from "../../../components/Loading";
import DrawerQuickAccess from "./Drawer/DrawerQuickAccess";
import Espirometria from "./Espirometria/Espirometria.jsx";
import HistoriaOcupacional from "./HistoriaOcupacional/HistoriaOcupacional.jsx";
import OftalmologiaTabSelector from "./Oftalmologia/OftalmologiaTabSelector.jsx";
import AudiometriaTabSelector from "./Audiometria/AudiometriaTabSelector.jsx";
import OIT from "./OIT/OIT.jsx";
import Odontologia from "./Odontologia/Odontologia.jsx";
import RayosXTabSelector from "./RayosX/RayosXTabSelector.jsx";
import Cuestionario_Nordico from "./Cuestionario_Nordico/Cuestionario_Nordico.jsx";
import MusculoEsqueleticoTabSelector from "./Musculoesqueletico/MusculoEsqueleticoTabSelector.jsx";
import Test_fatiga from "./TestFatiga/TestFatiga_Somn.jsx";
import Anexo16 from "./Anexo16/Anexo16.jsx";
import EKG from "./EKG/ekg.jsx";
import AntecedentesDeAltura from "./AntecedentesDeAltura/AntecedentesDeAltura.jsx";
import Anexo2 from "./Anexo2/Anexo2.jsx";
import ConsentimientosTabSelector from "./Consentimientos/ConsentimientosTabSelector.jsx";
import PsicologiaTabSelector from "./ModuloPsicologia/PsicologiaTabSelector.jsx";
import Anexo16A from "./Anexo16A/Anexo16A.jsx";
import AntecedentesPatologicos from "./AntecedentesPatologicos/AntecedentesPatologicos.jsx";
import FichasAptitudTabSelector from "./FichasAptitud/FichasAptitudTabSelector.jsx";
import FichaSas from "./FichaSAS/FichaSas.jsx";
import FichaConduccionVehiculos from "./FichaConduccionVehiculos/FichaConduccionVehiculos.jsx";
import FichaCertificadoAltura from "./FichaCertificadoAltura/FichaCertificadoAltura.jsx";
import CertificadoMedicoOcupacional from "./CertificadoMedicoOcupacional/CertificadoMedicoOcupacional.jsx";
import FichaInterconsulta from "./FichaInterconsulta/FichaInterconsulta.jsx";
import SectionWithBack from "./SectionWithBack.jsx";
import UsoRespiradores from "./UsoRespiradores/UsoRespiradores.jsx";
import PoderosaTabSelector from "./Poderosa/PoderosaTabSelector.jsx";
import GestionOpciones from "./Playground/GestionOpciones/GestionOpciones.jsx";
import EliminarExamenes from "./EliminarExamenes/EliminarExamenes.jsx";
import LaboratorioTabSelector from "./Laboratorio/LaboratorioTabSelector.jsx";
import Folio from "./Folio/Folio.jsx";
import Altura18 from "./Altura18/Altura18.jsx";
const hiddenExamTabs = [
  { key: 6, label: "Anexo 16 A" },
  { key: 7, label: "Test Altura" },
  { key: 8, label: "Bioquímica" },
  { key: 9, label: "Gonadotropina" },
  { key: 10, label: "Perfil Hepático" },
  { key: 11, label: "Hepatitis" },
  { key: 12, label: "ANEXO 16A - TEST DE ALTURA - PSICOSENSOMETRICO" },
  { key: 13, label: "Hemograma Automatizado" },
  { key: 14, label: "Psicosensometría" },
  { key: 15, label: "Coproparasitología" },
];

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState(null); // null: dashboard, 0: Admisión, 1: Triaje, 2: Laboratorio
  const [subTab, setSubTab] = useState(0); // Para tabs internos de Admisión
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [DNIG, setDNIG] = useState("");
  const token = useAuthStore((state) => state.token);
  const userlogued = useAuthStore((state) => state.userlogued);
  //Sede
  const selectedSede = useAuthStore((state) => state.selectedSede);
  const setSelectedSede = useAuthStore((state) => state.setSelectedSede);
  const Vista = useAuthStore((state) => state.listView);
  const Acceso = useAuthStore((state) => state.listAccesos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTabExamenes, setActiveTabExamenes] = useState(1); // Para ExamenesLaboratorio
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef(null);

  //Sede
  const [selectSede, setSelectSede] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (userlogued?.sedes?.length > 0) {
      const sedeTNP = userlogued.sedes.find((sede) => sede.cod_sede === "T-NP");
      setSelectSede(sedeTNP?.cod_sede || userlogued.sedes[0].cod_sede);
      setSelectedSede(sedeTNP?.cod_sede || userlogued.sedes[0].cod_sede);
    }
  }, [userlogued.sedes]);
  //AVVESO A LAS TARJETAS VIEWS

  const tieneVista = (nombreVista) => {
    return Vista.some((item) => item === nombreVista);
  };

  //COMBOBOX REGISTRO
  const Profesiones = ComboboxProfesión();
  const Departamentos = ComboboxDepartamentos();
  const Provincias = ComboboxProvincias();
  const Distritos = ComboboxDistritos();
  const listasCombosR = {
    Profesiones,
    Departamentos,
    Provincias,
    Distritos,
  };
  //COMBOBOX HC

  const EmpresasMulti = ComboboxEmpresasMulti("T-NP");
  const ContrataMulti = ComboboxContratasMulti("T-NP");
  const MedicosMulti = ComboboxMedicosMulti("T-NP");
  const PruebaMulti = ComboboxPruebaMulti("T-NP");
  const CargosMulti = ComboboxCargoMulti("T-NP");
  const AreaMulti = ComboboxAreaMulti("T-NP");
  const ExamenMulti = ComboboxExamenMMulti("T-NP");
  const ExplotacionMulti = ComboboxExplotacionMulti("T-NP");
  const MineralMulti = ComboboxMineralMulti("T-NP");
  const AlturaMulti = ComboboxAlturaMulti("T-NP");
  const FormaPago = ComboboxFormaPago("T-NP");
  const ListAuth = ComboboxListAuth("T-NP");

  const [datos, setDatos] = useState({
    codPa: "",
    nombresPa: "",
    apellidosPa: "",
    fechaNaciminetoPa: "",
    sexoPa: "",
    emailPa: "",
    lugarNacPa: "",
    nivelEstPa: "",
    ocupacionPa: "",
    estadoCivilPa: "",
    direccionPa: "",
    departamentoPa: "",
    provinciaPa: "",
    distritoPa: "",
    caserioPA: "",
    telCasaPa: "",
    celPa: "",
  });

  const listasCombos = {
    EmpresasMulti,
    ContrataMulti,
    MedicosMulti,
    PruebaMulti,
    CargosMulti,
    AreaMulti,
    ExamenMulti,
    ExplotacionMulti,
    MineralMulti,
    AlturaMulti,
    FormaPago,
    ListAuth,
  };

  const tienePermisoEnVista = (nombreVista, permiso) => {
    const vista = Acceso.find((item) => item.nombre === nombreVista);
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
      elem.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {activeTab === null && (
          <>
            <div className={styles.sedeSelector} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <select
                className={styles.sedeSelect}
                onChange={(e) => { setSelectSede(e.target.value), setSelectedSede(e.target.value) }}
                value={selectSede}
              >
                {userlogued.sedes.map((option, index) => (
                  <option key={index} value={option.cod_sede}>
                    {option.nombre_sede}
                  </option>
                ))}
              </select>
              <div style={{ position: 'relative', width: '250px' }}>
                <input
                  type="text"
                  placeholder="Buscar módulo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 35px 8px 15px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
              </div>
            </div>
            <div className={styles.gridContainer}>
              {(() => {
                const items = [
                  { vista: "Admision", tab: 0, icons: [{ icon: faUserCheck }], label: "Admisión" },
                  { vista: "Anexo 16", tab: 27, icons: [{ icon: fa1 }, { icon: fa6 }], label: "Anexo 16" },
                  { vista: "Anexo 16 A", tab: 28, icons: [{ icon: fa1 }, { icon: fa6 }, { icon: faA, className: "ml-2" }], label: "Anexo 16 A" },
                  { vista: "Anexo 2", tab: 26, icons: [{ icon: fa2 }], label: "Anexo 2" },
                  { vista: "Antecedentes de Altura", tab: 25, icons: [{ icon: faMountain }], label: "Antecedentes de Altura" },
                  { vista: "Antecedentes Patologicos", tab: 29, icons: [{ icon: faBacterium }], label: "Antecedentes Patológicos" },
                  { vista: "Audiometria", tab: 15, icons: [{ icon: faDeaf }], label: "Audiometría" },
                  { vista: "Constancia Certificado Medico Ocupacional", tab: 34, icons: [{ icon: faSuitcaseMedical }], label: "Certificado Medico Ocupacional" },
                  // { vista: "Coproparasitologico", tab: 3, icons: [{ icon: faClipboardList }], label: "Coproparasitológico" },
                  { vista: "Cuestionario Nordico", tab: 21, icons: [{ icon: faSkiingNordic }], label: "Cuestionario Nordico" },
                  { vista: "EKG", tab: 13, icons: [{ icon: faHeartbeat }], label: "EKG" },
                  { vista: "Espirometria", tab: 14, icons: [{ icon: faLungs }], label: "Espirometría" },
                  { vista: "Evaluación Musculoesquelética", tab: 22, icons: [{ icon: faSkull }], label: "Evaluación Musculoesquelética" },
                  { vista: "Ficha Certificado de Altura", tab: 33, icons: [{ icon: faStairs }], label: "Ficha Certificado de Trabajos en Altura" },
                  { vista: "Ficha Conduccion de Vehiculos", tab: 32, icons: [{ icon: faCarSide }], label: "Ficha de Conducción de Vehiculos" },
                  { vista: "Ficha Interconsulta", tab: 35, icons: [{ icon: faTruckMedical }], label: "Ficha Interconsulta" },
                  { vista: "Ficha SAS", tab: 31, icons: [{ icon: faMoon }], label: "Ficha S.A.S." },
                  { vista: "Fichas Aptitud", tab: 30, icons: [{ icon: faFileMedical }], label: "Fichas Aptitud" },
                  { vista: "Historia Ocupacional", tab: 16, icons: [{ icon: faFileWaveform }], label: "Historia Ocupacional" },
                  { vista: "Laboratorio Clinico", tab: 2, icons: [{ icon: faVial }], label: "Laboratorio" },
                  // { vista: "Medicina General", tab: 11, icons: [{ icon: faUserMd }], label: "Medicina General" },
                  { vista: "Modulo de Consentimientos", tab: 20, icons: [{ icon: faCheckToSlot }], label: "Modulo de Consentimientos" },
                  { vista: "Odontologia", tab: 18, icons: [{ icon: faTooth }], label: "Odontología" },
                  { vista: "Oftalmologia", tab: 17, icons: [{ icon: faEye }], label: "Oftalmología" },
                  { vista: "OIT", tab: 19, icons: [{ icon: faAnchor }], label: "OIT" },
                  { vista: "Playground", tab: 24, icons: [{ icon: faGamepad }], label: "Playground" },
                  { vista: "Poderosa", tab: 37, icons: [{ icon: faPersonRifle }], label: "Poderosa" },
                  { vista: "Psicologia", tab: 10, icons: [{ icon: faBrain }], label: "Psicología" },
                  { vista: "Rayos X", tab: 12, icons: [{ icon: faXRay }], label: "Rayos X" },
                  { vista: "Test Fatiga", tab: 23, icons: [{ icon: faBed }], label: "Test Fatiga y Somnolencia" },
                  { vista: "Triaje", tab: 1, icons: [{ icon: faStethoscope }], label: "Triaje" },
                  { vista: "Uso de Respiradores", tab: 36, icons: [{ icon: faMaskVentilator }], label: "Uso de Respiradores" },
                  { vista: "Eliminar Examenes", tab: 38, icons: [{ icon: faFolderMinus }], label: "Eliminar Examenes" },
                  { vista: "Altura 1.8", tab: 39, icons: [{ icon: faArrowUp }], label: "Altura 1.8" },
                  { vista: "Folio", tab: 40, icons: [{ icon: faFileContract }], label: "Folio" },
                ];
                return items
                  .filter((item) => tieneVista(item.vista))
                  .filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <div
                      key={item.vista}
                      className={`flex flex-col items-center justify-center bg-[#edeff2] rounded-xl w-[120px] h-[120px] transition-all delay-100 duration-200 ease-out cursor-pointer border-2 border-transparent hover:scale-105 hover:-translate-y-2 ${activeTab === item.tab ? "border-[#fc6b03] shadow-[0_2px_8px_rgba(255,128,0,0.10)]" : ""}`}
                      onClick={() => setActiveTab(item.tab)}
                    >
                      <span className={styles.icon}>
                        {item.icons.map((ic, idx) => (
                          <FontAwesomeIcon key={idx} icon={ic.icon} className={ic.className} />
                        ))}
                      </span>
                      <span className={`${styles.title} font-bold`}>{item.label}</span>
                    </div>
                  ));
              })()}
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
                  {/*Esto se va a mostrar por defecto */}
                  <button
                    className={`${styles.tabButton} ${subTab === 0 ? styles.active : ""
                      }`}
                    onClick={() => setSubTab(0)}
                  >
                    Registro de Pacientes
                  </button>

                  {tienePermisoEnVista("Admision", "Acceso a Examenes Pre") && (
                    <button
                      className={`${styles.tabButton} ${subTab === 2 ? styles.active : ""
                        }`}
                      onClick={() => setSubTab(2)}
                    >
                      Apertura Exámenes PreOcup
                    </button>
                  )}
                  {tienePermisoEnVista(
                    "Admision",
                    "Acceso Consentimiento de Digitalizacion"
                  ) && (
                      <button
                        className={`${styles.tabButton} ${subTab === 1 ? styles.active : ""
                          }`}
                        onClick={() => setSubTab(1)}
                      >
                        Consentimiento Digitalización
                      </button>
                    )}
                  {tienePermisoEnVista(
                    "Admision",
                    "Acceso Reserva de Pacientes"
                  ) && (
                      <button
                        className={`${styles.tabButton} ${subTab === 3 ? styles.active : ""
                          }`}
                        onClick={() => setSubTab(3)}
                      >
                        Reserva de Pacientes
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
                      tabHC={() => {
                        setSubTab(2);
                      }}
                      ChangeDNI={(nuevoDNI) => {
                        setDNIG(nuevoDNI);
                      }}
                    />
                  )}
                  {subTab === 1 && (
                    <ConsentimientoDigitalizacion
                      token={token}
                      userlogued={userlogued.sub}
                      selectedSede={selectSede}
                    />
                  )}
                  {subTab === 2 && (
                    <AperturaExamenesPreOcup
                      listas={listasCombos}
                      DNIG={DNIG}
                      selectedSede={selectSede}
                      token={token}
                      userlogued={userlogued.sub}
                      PrecioC={ComboboxPrecioExamenMulti}
                      ChangeDNI={(nuevoDNI) => {
                        setDNIG(nuevoDNI);
                      }}
                    />
                  )}
                  {subTab === 3 && (
                    <ReservaPacientes
                      selectedSede="T-NP"
                      token={token}
                      Loading={Loading}
                      userlogued={userlogued.sub}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 15 && (
            <div>
              <div className="w-full flex items-center justify-end gap-4 mb-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                  onClick={() => {
                    setActiveTab(null), setSubTab(0);
                  }}
                >
                  ← Atrás
                </button>
              </div>
              <div className="w-full flex justify-center items-center mb-4">
                <h2 className="text-2xl font-bold text-[#233245]">
                  Audiometria
                </h2>
              </div>
              <div>
                <div className={styles.tabHeader}>
                  {/*Esto se va a mostrar por defecto */}
                  <button
                    className={`${styles.tabButton} ${subTab === 0 ? styles.active : ""
                      }`}
                    onClick={() => setSubTab(0)}
                  >
                    Audiometria
                  </button>

                  <button
                    className={`${styles.tabButton} ${subTab === 1 ? styles.active : ""
                      }`}
                    onClick={() => setSubTab(1)}
                  >
                    Audiometria Ohla
                  </button>
                  <button
                    className={`${styles.tabButton} ${subTab === 2 ? styles.active : ""
                      }`}
                    onClick={() => setSubTab(2)}
                  >
                    Cuestionario de Audiometria
                  </button>
                </div>
                <div>
                  <AudiometriaTabSelector
                    token={token}
                    userlogued={userlogued}
                    selectedSede={selectSede}
                    listas={listasCombos}
                    subTab={subTab}
                  />
                </div>
              </div>
            </div>
          )}
          {(() => {
            const displayedInterfaces = {
              1: { title: "Triaje", child: <Triaje token={token} selectedSede={selectSede} /> },
              2: { title: "Laboratorio", child: <LaboratorioTabSelector tieneVista={tieneVista} /> },
              // 3: { title: "Coproparasitológico", child: <ParasitologiaCoprologico /> },
              6: {
                title: "Consentimientos", child: (
                  <ConsentimientosSubTabSelector
                    tieneVista={tieneVista}
                  />
                )
              },
              10: { title: "Modulo Psicología", child: <PsicologiaTabSelector listas={listasCombos} tieneVista={tieneVista} /> },
              12: { title: "Rayos X", child: <RayosXTabSelector tieneVista={tieneVista} /> },
              13: { title: "Electrocardiograma", child: <EKG /> },
              14: { title: "Espirometría", child: <Espirometria /> },
              16: {
                title: undefined, child: (
                  <HistoriaOcupacional
                    token={token}
                    userlogued={userlogued.sub}
                    selectedSede={selectSede}
                    listas={listasCombos}
                    userDatos={userlogued}
                  />
                )
              },
              17: {
                title: undefined, child: (
                  <OftalmologiaTabSelector
                    token={token}
                    userlogued={userlogued.sub}
                    selectedSede={selectSede}
                  />
                )
              },
              18: { title: undefined, child: <Odontologia /> },
              19: {
                title: undefined, child: (
                  <OIT
                    token={token}
                    userlogued={userlogued.sub}
                    selectedSede={selectSede}
                    userDatos={userlogued}
                  />
                )
              },
              20: { title: "Módulo de Consentimientos", child: <ConsentimientosTabSelector tieneVista={tieneVista} /> },
              21: {
                title: undefined, child: (
                  <Cuestionario_Nordico
                    token={token}
                    userlogued={userlogued.sub}
                    selectedSede={selectSede}
                    userDatos={userlogued}
                  />
                )
              },
              22: { title: "Evaluación Musculoesquelética", child: <MusculoEsqueleticoTabSelector tieneVista={tieneVista} /> },
              23: { title: undefined, child: <Test_fatiga /> },
              24: { title: "Gestion Opciones", child: <GestionOpciones /> },
              25: { title: undefined, child: <AntecedentesDeAltura /> },
              26: { title: "Anexo 2", child: <Anexo2 listas={listasCombos} /> },
              27: { title: "Anexo 16", child: <Anexo16 listas={listasCombos} /> },
              28: { title: "Anexo 16 A", child: <Anexo16A /> },
              29: { title: "Antecedentes Patológicos", child: <AntecedentesPatologicos listas={listasCombos} /> },
              30: { title: "Fichas Aptitud", child: <FichasAptitudTabSelector listas={listasCombos} tieneVista={tieneVista} /> },
              31: { title: "Ficha S.A.S.", child: <FichaSas listas={listasCombos} /> },
              32: { title: "Ficha Conduccion de Vehiculos", child: <FichaConduccionVehiculos /> },
              33: { title: "Ficha Certificado de Altura", child: <FichaCertificadoAltura /> },
              34: { title: "Constancia Certificado Medico Ocupacional", child: <CertificadoMedicoOcupacional /> },
              35: { title: "Ficha Interconsulta", child: <FichaInterconsulta /> },
              36: { title: "Uso de Respiradores", child: <UsoRespiradores /> },
              37: { title: "Poderosa", child: <PoderosaTabSelector tieneVista={tieneVista} /> },
              38: { title: "Eliminar Examenes", child: <EliminarExamenes /> },
              39: { title: "Altura 1.8", child: <Altura18 /> },
              40: { title: "Folio", child: <Folio /> },
            };
            const section = displayedInterfaces[activeTab];
            return section ? (
              <SectionWithBack title={section.title} onBack={() => setActiveTab(null)}>
                {section.child}
              </SectionWithBack>
            ) : null;
          })()}

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
        onNavigate={(idx) => {
          console.log("Navigating to tab:", idx);
          setDrawerOpen(false);

          // Optimized navigation handling using a configuration map
          const navConfig = {
            Inicio: { activeTab: null },
            Admision: { activeTab: 0, subTab: 0 },
            Triaje: { activeTab: 1, subTab: 0 },
            "Laboratorio Clinico": { activeTab: 2 },
            "Rayos X": { activeTab: 12, subTab: 0 },
            EKG: { activeTab: 13, subTab: 0 },
            Espirometria: { activeTab: 14, subTab: 0 },
            Audiometria: { activeTab: 15, subTab: 0 },
            "Historia Ocupacional": { activeTab: 16, subTab: 0 },
            Oftalmologia: { activeTab: 17, subTab: 0 },
            Odontologia: { activeTab: 18, subTab: 0 },
            "Evaluación Musculoesquelética": { activeTab: 22, subTab: 0 },
            "Cuestionario Nordico": { activeTab: 21, subTab: 0 },
            "Test Fatiga": { activeTab: 23, subTab: 0 },
            "Antecedentes de Altura": { activeTab: 25, subTab: 0 },
            "Anexo 2": { activeTab: 26, subTab: 0 },
            "Anexo 16": { activeTab: 27, subTab: 0 },
            "Anexo 16 A": { activeTab: 28, subTab: 0 },
            "Antecedentes Patologicos": { activeTab: 29, subTab: 0 },
            "Fichas Aptitud": { activeTab: 30, subTab: 0 },
            "Ficha SAS": { activeTab: 31, subTab: 0 },
            "Ficha Conduccion de Vehiculos": { activeTab: 32, subTab: 0 },
            "Ficha Certificado de Altura": { activeTab: 33, subTab: 0 },
            "Constancia Certificado Medico Ocupacional": { activeTab: 34, subTab: 0 },
            "Ficha Interconsulta": { activeTab: 35, subTab: 0 },
            "Uso de Respiradores": { activeTab: 36, subTab: 0 },
            "Poderosa": { activeTab: 37, subTab: 0 },
            "Eliminar Examenes": { activeTab: 38, subTab: 0 },
            "Altura 1.8": { activeTab: 39, subTab: 0 },
            "Folio": { activeTab: 40, subTab: 0 },
          };

          const config = navConfig[idx];
          if (config) {
            setActiveTab(config.activeTab);
            if (config.subTab !== undefined) setSubTab(config.subTab);
          }
        }}
        activeIndex={activeTab}
        tieneVista={tieneVista}
      />

      {/* Context Menu for hidden exam tabs */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 0,
            margin: 0,
            minWidth: 220,
          }}
        >
          {hiddenExamTabs.map((tab) => (
            <li
              key={tab.key}
              style={{
                listStyle: "none",
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: 15,
                color: "#233245",
                borderBottom: "1px solid #eee",
              }}
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
