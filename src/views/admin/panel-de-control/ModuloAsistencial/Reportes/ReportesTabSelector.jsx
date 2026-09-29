import TabSelector from "../../../../components/reusableComponents/TabSelector";
import Ticket from "./Ticket/Ticket";

export default function ReportesTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Ticket Reportes",
            label: "Ticket",
            component: Ticket
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
