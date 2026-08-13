import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RegistroPaciente from "./RegistroPaciente/RegistroPaciente";
import RegistroVisita from "./RegistroVisita/RegistroVisita";

export default function AdmisionTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Registro Paciente Salud",
            label: "Registro Paciente",
            component: RegistroPaciente
        },
        {
            id: 1,
            permission: "Registro Visita Salud",
            label: "Registro Visita",
            component: RegistroVisita
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
