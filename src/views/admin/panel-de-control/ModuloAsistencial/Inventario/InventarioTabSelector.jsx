import TabSelector from "../../../../components/reusableComponents/TabSelector";
import AlertasReposicion from "./Alertas/AlertasReposicion";
import EntregaTicket from "./EntregaTicket/EntregaTicket";
import EntregasArea from "./EntregasArea/EntregasArea";
import IngresoStock from "./IngresoStock/IngresoStock";
import Inventarios from "./Inventarios/Inventarios";
import Kardex from "./Kardex/Kardex";
import Medicamentos from "./Medicamentos/Medicamentos";
import Retiros from "./Retiros/Retiros";
import Stock from "./Stock/Stock";
import Transferencias from "./Transferencias/Transferencias";

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
        {
            id: 2,
            permission: "Ingreso Stock Asistencial",
            label: "Ingreso de Stock",
            component: IngresoStock
        },
        {
            id: 9,
            permission: "Entrega Ticket Asistencial",
            label: "Entrega por Ticket",
            component: EntregaTicket
        },
        {
            id: 6,
            permission: "Entregas Area Asistencial",
            label: "Entregas a Área",
            component: EntregasArea
        },
        {
            id: 7,
            permission: "Retiros Asistencial",
            label: "Retiros",
            component: Retiros
        },
        {
            id: 8,
            permission: "Transferencias Asistencial",
            label: "Transferencias",
            component: Transferencias
        },
        {
            id: 3,
            permission: "Stock Asistencial",
            label: "Stock",
            component: Stock
        },
        {
            id: 4,
            permission: "Alertas Reposicion Asistencial",
            label: "Alertas de Reposición",
            component: AlertasReposicion
        },
        {
            id: 5,
            permission: "Kardex Asistencial",
            label: "Kardex",
            component: Kardex
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
