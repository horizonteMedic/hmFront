import { useState } from "react";
import { useAuthStore } from "../../../../store/auth";
import styles from "./ModuloAsistencial.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa1, fa6, faSearch, faStethoscope, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import SectionWithBack from "./SectionWithBack";
import RegistroAtencionTabSelector from "./RegistroAtencion/RegistroAtencionTabSelector";
import TriajeAsistencial from "./Triaje/Triaje";

const ModuloAsistencial = () => {
    const [activeTab, setActiveTab] = useState(null); // null: dashboard, 0: Admisión, 1: Triaje, 2: Laboratorio
    const userlogued = useAuthStore((state) => state.userlogued);
    const token = useAuthStore((state) => state.token);

    //Sede
    const selectedSede = useAuthStore((state) => state.selectedSede);
    const setSelectedSede = useAuthStore((state) => state.setSelectedSede);
    //Sede
    const [selectSede, setSelectSede] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const Vista = useAuthStore((state) => state.listView);

    const tieneVista = (nombreVista) => {
        return Vista.some((item) => item === nombreVista);
    };

    return (

        <div className={styles.container} >
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
                                    { vista: "Registro de Atencion", tab: 1, icons: [{ icon: faUserCheck }], label: "Registro de Atención" },
                                    { vista: "Triaje Asistencial", tab: 2, icons: [{ icon: faStethoscope }], label: "Triaje" },
                                ];
                                return items
                                    .filter((item) => tieneVista(item.vista))
                                    .filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((item) => (
                                        <div
                                            key={item.vista}
                                            className={`flex flex-col items-center justify-center bg-[#edeff2] rounded-xl w-[120px] h-[120px] transition-all delay-100 duration-200 ease-out cursor-pointer border-2 border-transparent hover:scale-105 hover:-translate-y-2 ${activeTab === item.tab ? "border-[#fc6b03] shadow-[0_2px_8px_rgba(255,128,0,0.10)]" : ""}`}
                                            onClick={() => { setActiveTab(item.tab) }}
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
                <div className={styles.tabContainer}>
                    {(() => {
                        const displayedInterfaces = {
                            1: { title: "Registro de Atención", child: <RegistroAtencionTabSelector tieneVista={tieneVista} /> },
                            2: { title: "Triaje", child: <TriajeAsistencial /> },

                        };
                        console.log(activeTab);
                        const section = displayedInterfaces[activeTab];
                        console.log(section);
                        return section ? (
                            <SectionWithBack title={section.title} onBack={() => setActiveTab(null)}>
                                {section.child}
                            </SectionWithBack>
                        ) : null;
                    })()}
                </div>

                {/* <DrawerQuickAccess
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                            onNavigate={(idx) => {
                                console.log("Navigating to tab:", idx);
                                setDrawerOpen(false);

                                // Optimized navigation handling using a configuration map
                                const navConfig = {
                                    Inicio: { activeTab: null },
                                    "Registro de Atencion": { activeTab: 3 },
                                    Admision: { activeTab: 0, subTab: 0 },
                                    Triaje: { activeTab: 1, subTab: 0 },
                                    "Laboratorio Clinico": { activeTab: 2 },
                                };

                                const config = navConfig[idx];
                                if (config) {
                                    setActiveTab(config.activeTab);
                                    if (config.subTab !== undefined) setSubTab(config.subTab);
                                }
                            }}
                            activeIndex={activeTab}
                            tieneVista={tieneVista}
                        /> */}
            </div>
        </div >
    );
};

export default ModuloAsistencial;
