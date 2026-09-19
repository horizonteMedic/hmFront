import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBacterium, faNotesMedical, faSearch, faStethoscope, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import SectionWithBack from "./SectionWithBack";
import RegistroAtencionTabSelector from "./RegistroAtencion/RegistroAtencionTabSelector";
import TriajeAsistencial from "./Triaje/Triaje";
import AsistencialTabSelector from "./Asistencial/AsistencialTabSelector";
import AntecedentesPatologicos from "./AntecedentesPatologicos/AntecedentesPatologicos";

const sections = [
    { tab: 1, vista: "Registro de Atencion", label: "Registro de Atención", icon: faUserCheck, component: RegistroAtencionTabSelector },
    { tab: 2, vista: "Triaje Asistencial", label: "Triaje", icon: faStethoscope, component: TriajeAsistencial },
    { tab: 3, vista: "Antecedentes Patologicos", label: "Antecedentes Patológicos", icon: faBacterium, component: AntecedentesPatologicos },
    { tab: 4, vista: "Historia Asistencial", label: "Historia Asistencial", icon: faNotesMedical, component: AsistencialTabSelector },
];

const ModuloAsistencial = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const Vista = useAuthStore((state) => state.listView);

    const tieneVista = (nombreVista) => {
        return Vista.some((item) => item === nombreVista);
    };

    const activeSection = sections.find((section) => section.tab === activeTab);

    return (
        <div className="mx-auto overflow-hidden w-full relative">
            <div className="bg-white rounded-lg overflow-hidden shadow-md relative py-8">
                {activeTab === null && (
                    <>
                        <div className="w-full flex items-center justify-start gap-4 mb-4 max-w-[95%] mx-auto">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded shadow border border-gray-300"
                                onClick={() => navigate("/panel-de-control")}
                            >
                                ← Atrás
                            </button>
                        </div>

                        <div className="w-full flex items-center justify-center gap-4 mb-4 flex-wrap">
                            <div className="relative w-[250px]">
                                <input
                                    type="text"
                                    placeholder="Buscar módulo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="text-xl w-full py-3 pl-[15px] pr-[35px] rounded-lg border border-[#e2e8f0] outline-none  bg-white shadow-sm"
                                />
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="w-4/5 flex justify-center gap-12 mt-10 flex-wrap mx-auto">
                            {sections
                                .filter((section) => tieneVista(section.vista))
                                .filter((section) => section.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((section) => (
                                    <div
                                        key={section.vista}
                                        className={`flex flex-col items-center justify-center bg-[#edeff2] rounded-xl w-[120px] h-[120px] transition-all delay-100 duration-200 ease-out cursor-pointer border-2 border-transparent hover:scale-105 hover:-translate-y-2 ${activeTab === section.tab ? "border-[#fc6b03] shadow-[0_2px_8px_rgba(255,128,0,0.10)]" : ""}`}
                                        onClick={() => setActiveTab(section.tab)}
                                    >
                                        <span className="text-[#fc6b03] text-4xl mb-2 flex items-center justify-center">
                                            <FontAwesomeIcon icon={section.icon} />
                                        </span>
                                        <span className="font-bold text-base text-[#1a2536] text-center mt-2">{section.label}</span>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {activeSection && (
                    <SectionWithBack title={activeSection.label} onBack={() => setActiveTab(null)}>
                        <activeSection.component tieneVista={tieneVista} />
                    </SectionWithBack>
                )}
            </div>
        </div>
    );
};

export default ModuloAsistencial;
