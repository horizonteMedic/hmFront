import TabSelector from "../../../../components/reusableComponents/TabSelector";
import Medicamentos from "./Medicamentos/Medicamentos";
import Ticket from "./Ticket/Ticket";

export default function ReportesTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Ticket Reportes",
            label: "Ticket",
            component: Ticket
        },
        {
            id: 1,
            permission: "Medicamentos Reportes",
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
