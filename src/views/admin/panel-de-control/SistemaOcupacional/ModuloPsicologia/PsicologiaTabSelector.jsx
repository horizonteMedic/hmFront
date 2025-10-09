import { useEffect, useState } from "react";
import InformePsicologico from "./InformePsicologico/InformePsicologico";
import FichaPsicologica2 from "./FichaPsicologica2/FichaPsicologica2";
import FichaPsicologica3 from "./FichaPsicologica3/FichaPsicologica3";

export default function PsicologiaTabSelector({ tieneVista }) {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (tieneVista("Informe Psicologico")) {
            setActiveTab(0);
        }
        else if (tieneVista("Ficha Psicologica 2")) {
            setActiveTab(1);
        }
        else if (tieneVista("Ficha Psicologica 3")) {
            setActiveTab(2);
        }
        else {
            // Temporalmente mostrar FichaPsicologica3 por defecto si no tiene otros permisos
            setActiveTab(-1);
        }
    }, []);


    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                {/* Tab Navigation */}
                <nav className="flex bg-white border-b border-gray-200 mb-4">
                    {tieneVista("Informe Psicologico") && (
                        <button
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === 0
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(0)}
                        >
                            Informe Psicologico
                        </button>
                    )}
                    {tieneVista("Ficha Psicologica 2") && (
                        <button
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === 1
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Ficha Psicológica 2
                        </button>
                    )}
                    {tieneVista("Ficha Psicologica 3") && (
                        <button
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === 2
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(2)}
                        >
                            Ficha Psicológica 3
                        </button>
                    )}
                </nav>

                {/* Tab Content */}
                <div className="max-w-full">
                    {activeTab === 0 && <InformePsicologico />}
                    {activeTab === 1 && <FichaPsicologica2 />}
                    {activeTab === 2 && <FichaPsicologica3 />}
                    {activeTab === -1 && (
                        <div className="text-center text-gray-500">
                            No tiene permisos para ver ningún examen.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
