import TabSelector from "../../../../components/reusableComponents/TabSelector";
import Inventarios from "./Inventarios/Inventarios";
import Medicamentos from "./Medicamentos/Medicamentos";

export default function InventarioTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Inventarios Asistencial",
            label: "Inventarios",
            component: Inventarios
        },
        {
            id: 1,
            permission: "Medicamentos Asistencial",
            label: "Medicamentos",
            component: Medicamentos
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
