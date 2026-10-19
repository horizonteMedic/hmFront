import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import EntregaReceta from "./EntregaReceta/EntregaReceta";
import EntregasArea from "./EntregasArea/EntregasArea";
import IngresoStock from "./IngresoStock/IngresoStock";
import Retiros from "./Retiros/Retiros";
import Transferencias from "./Transferencias/Transferencias";

// Las operaciones que mueven stock: entra (ingreso), sale (entrega a área, retiro) o pasa a otro inventario (transferencia).
// Cada una conserva su permiso.
export const PERMISOS_OPERACIONES = [
    "Ingreso Stock Asistencial",
    "Entregas Area Asistencial",
    "Retiros Asistencial",
    "Transferencias Asistencial",
];

export default function OperacionesTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Transferencias Asistencial",
            label: "Entrega de Receta",
            component: EntregaReceta
        },
        {
            id: 1,
            permission: "Entregas Area Asistencial",
            label: "Entregas a Área",
            component: EntregasArea
        },
        {
            id: 2,
            permission: "Retiros Asistencial",
            label: "Retiros",
            component: Retiros
        },
        {
            id: 3,
            permission: "Transferencias Asistencial",
            label: "Transferencias",
            component: Transferencias
        },
        {
            id: 4,
            permission: "Ingreso Stock Asistencial",
            label: "Ingreso de Stock",
            component: IngresoStock
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
