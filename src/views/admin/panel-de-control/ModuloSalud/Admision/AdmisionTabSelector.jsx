import { useState } from "react";
import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RegistroPaciente from "./RegistroPaciente/RegistroPaciente";
import RegistroVisita from "./RegistroVisita/RegistroVisita";
import { useSessionData } from "../../../../hooks/useSessionData";

export default function AdmisionTabSelector({ tieneVista, onVisitaSeleccionada }) {
    const [activeTab, setActiveTab] = useState(null);
    const [pacienteActivo, setPacienteActivo] = useState(null);
    const { campaniaActiva } = useSessionData();

    const handleRegistrado = ({ pacienteId, dni, nombres }) => {
        setPacienteActivo({ pacienteId, dni, nombres });
        setActiveTab(1);
    };

    const tabsConfig = [
        {
            id: 0,
            permission: "Registro Paciente Salud",
            label: "Registro Paciente",
            component: RegistroPaciente,
            props: { onRegistrado: handleRegistrado },
        },
        {
            id: 1,
            permission: "Registro Visita Salud",
            label: "Registro Visita",
            component: RegistroVisita,
            props: { pacienteActivo, onAutoRegistrado: () => setPacienteActivo(null), onVisitaSeleccionada },
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            {/* Banner de campaña activa */}
            {campaniaActiva ? (
                <div className="flex items-center gap-3 mx-4 px-4 py-2 rounded-lg bg-green-50 border border-green-300 text-green-800">
                    {campaniaActiva.urlRuta && (
                        <img src={campaniaActiva.urlRuta} alt={campaniaActiva.nombre} className="h-8 object-contain rounded flex-shrink-0" />
                    )}
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs text-green-600 font-medium">Campaña activa</span>
                        <span className="text-sm font-bold">{campaniaActiva.nombre}</span>
                        {campaniaActiva.empresa && (
                            <span className="text-xs text-green-600">{campaniaActiva.empresa}</span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mx-4 px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
                    ⚠ No hay campaña activa. Ve a <strong>Configuración</strong> para activar una antes de registrar visitas.
                </div>
            )}

            <TabSelector
                tieneVista={tieneVista}
                tabsConfig={tabsConfig}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}
