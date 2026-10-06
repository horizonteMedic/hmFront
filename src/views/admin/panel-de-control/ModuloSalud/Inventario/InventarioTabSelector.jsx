import TabSelector from "../../../../components/reusableComponents/TabSelector";
import SeccionDeCampania from "../components/SeccionDeCampania";
import ProductosEnInventario from "./ProductosEnInventario/ProductosEnInventario";
import ReportesInventario from "./ReportesInventario/ReportesInventario";

// El inventario es de la campaña activa: sin campaña se pide activar una; con ella, las dos pestañas
// reciben `campania` y trabajan solo con sus medicamentos.
export default function InventarioTabSelector({ tieneVista, onIrACampanias }) {
    return (
        <SeccionDeCampania
            mensaje="El inventario es propio de cada campaña: cada una tiene sus medicamentos y su stock."
            onIrACampanias={onIrACampanias}
        >
            {(campania) => (
                <TabSelector
                    tieneVista={tieneVista}
                    tabsConfig={[
                        {
                            id: 0,
                            permission: "Productos en Inventario Salud",
                            label: "Productos en Inventario",
                            component: ProductosEnInventario,
                            props: { campania },
                        },
                        {
                            id: 1,
                            permission: "Reportes Inventario Salud",
                            label: "Reportes Inventario",
                            component: ReportesInventario,
                            props: { campania },
                        },
                    ]}
                />
            )}
        </SeccionDeCampania>
    );
}
