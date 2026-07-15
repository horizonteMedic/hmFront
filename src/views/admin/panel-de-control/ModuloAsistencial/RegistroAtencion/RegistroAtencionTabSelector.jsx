import { useEffect, useState } from "react";
import RegistroAsistencial from "./RegistroAsistencial/RegistroAsistencial";
import TicketAsistencial from "./TicketAsistencial/TicketAsistencial";

export default function RegistroAtencionTabSelector({ tieneVista }) { 

    const [activeTab, setActiveTab] = useState(0);

    useEffect(
        () => {
            // Encontrar el primer tab permitido
            if (tieneVista("RegistroAsistencial")) {
                setActiveTab(0);
            } else if (tieneVista("TicketAsistencial")) {
                setActiveTab(1);
            }
            //  else {
            //     setActiveTab(-1); // -1 significa que no tiene permisos
            // }
        },
        [
            /* aquí puedes poner dependencias si cambian los permisos */
        ]
    );


    return (
        <div className="space-y-4">
            <div className=" bg-white border border-gray-200 rounded-lg p-3">
                {/* Tab Navigation */}
                <nav className="flex bg-white border-b border-gray-200 mb-4">
                    {tieneVista("Registro Asistencial") && (
                        <button
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === 0
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(0)}
                        >
                            Registro
                        </button>
                    )}
                    {tieneVista("Ticket Asistencial") && (
                        <button
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === 1
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Ticket
                        </button>
                    )}
                </nav>

                {/* Tab Content */}
                <div className="max-w-full">
                    {/* {activeTab === 0 && <FichaAptitudAnexo2 MedicosMulti={MedicosMulti} />}
                    {activeTab === 1 && <FichaAptitudAnexo16 MedicosMulti={MedicosMulti} />} */}
                    {activeTab === 0 && <RegistroAsistencial/>}
                    {activeTab === 1 && <TicketAsistencial/>} 
                    {activeTab === -1 && (
                        <div className="text-center text-gray-500">
                            No tiene permisos para ver ningún examen.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}