import TabSelector from "../../../../components/reusableComponents/TabSelector";
import ProductosEnInventario from "./ProductosEnInventario/ProductosEnInventario";
import ReportesInventario from "./ReportesInventario/ReportesInventario";

export default function InventarioTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Productos en Inventario Salud",
            label: "Productos en Inventario",
            component: ProductosEnInventario
        },
        {
            id: 1,
            permission: "Reportes Inventario Salud",
            label: "Reportes Inventario",
            component: ReportesInventario
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
