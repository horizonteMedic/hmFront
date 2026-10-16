import TabSelector from "../../../../components/reusableComponents/TabSelector";
import CatalogoTabSelector, { PERMISOS_CATALOGO } from "./CatalogoTabSelector";
import EntregaTicket from "./EntregaTicket/EntregaTicket";
import Kardex from "./Kardex/Kardex";
import OperacionesTabSelector, { PERMISOS_OPERACIONES } from "./OperacionesTabSelector";
import Stock from "./Stock/Stock";

export default function InventarioTabSelector({ tieneVista }) {
    // Una pestaña que agrupa otras trae como `permission` la lista de los permisos de sus sub-pestañas, y se muestra si el
    // usuario tiene al menos uno. Las pestañas de adentro siguen revisando su propio permiso con esta misma función.
    const tieneAlgunaVista = (permiso) => (Array.isArray(permiso) ? permiso.some((nombre) => tieneVista(nombre)) : tieneVista(permiso));

    const tabsConfig = [
        {
            id: 0,
            permission: "Stock Asistencial",
            label: "Stock",
            component: Stock
        },
        {
            id: 1,
            permission: "Entrega Ticket Asistencial",
            label: "Entrega por Ticket",
            component: EntregaTicket
        },
        {
            id: 2,
            permission: PERMISOS_OPERACIONES,
            label: "Operaciones",
            component: OperacionesTabSelector
        },
        {
            id: 3,
            permission: "Kardex Asistencial",
            label: "Kardex",
            component: Kardex
        },
        {
            id: 4,
            permission: PERMISOS_CATALOGO,
            label: "Catálogo",
            component: CatalogoTabSelector
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneAlgunaVista}
            tabsConfig={tabsConfig}
        />
    );
}
