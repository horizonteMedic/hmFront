import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Inventarios from "./Inventarios/Inventarios";
import Medicamentos from "./Medicamentos/Medicamentos";

// Lo que se configura una vez y se consulta poco: qué medicamentos existen y qué inventarios hay. Cada uno conserva su permiso.
export const PERMISOS_CATALOGO = ["Medicamentos Asistencial", "Inventarios Asistencial"];

export default function CatalogoTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Medicamentos Asistencial",
            label: "Medicamentos",
            component: Medicamentos
        },
        {
            id: 1,
            permission: "Inventarios Asistencial",
            label: "Inventarios",
            component: Inventarios
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
