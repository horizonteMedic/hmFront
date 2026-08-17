import { useState } from "react";
import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RegistroPaciente from "./RegistroPaciente/RegistroPaciente";
import RegistroVisita from "./RegistroVisita/RegistroVisita";

export default function AdmisionTabSelector({ tieneVista }) {
    const [activeTab, setActiveTab] = useState(null);
    const [pacienteActivo, setPacienteActivo] = useState(null);

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
            props: { pacienteActivo, onAutoRegistrado: () => setPacienteActivo(null) },
        },
    ];

    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
    );
}
