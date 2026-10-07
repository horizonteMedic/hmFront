import { useState } from "react";
import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RegistroPaciente from "./RegistroPaciente/RegistroPaciente";
import RegistroVisita from "./RegistroVisita/RegistroVisita";
import useCampaniaActiva from "../utils/useCampaniaActiva";
import CampaniaActivaBanner from "../components/CampaniaActivaBanner";

export default function AdmisionTabSelector({ tieneVista, onVisitaSeleccionada, onIrACampanias }) {
    const [activeTab, setActiveTab] = useState(null);
    const [pacienteActivo, setPacienteActivo] = useState(null);
    const { campania } = useCampaniaActiva();

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
            props: { pacienteActivo, onAutoRegistrado: () => setPacienteActivo(null), onVisitaSeleccionada, onIrACampanias },
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <CampaniaActivaBanner
                campania={campania}
                hint="No hay campaña activa. Ve a «Campañas» para activar una antes de registrar visitas."
                className="mx-4"
            />

            <TabSelector
                tieneVista={tieneVista}
                tabsConfig={tabsConfig}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}
