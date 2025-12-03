import TabSelector from "../../../../components/reusableComponents/TabSelector";
import LaboratorioClinicoSubTabSelector from "./LaboratorioClinico/LaboratorioClinicoSubTabSelector";
import AnalisisBioquimicosSubTabSelector from "./AnalisisBioquimicos/AnalisisBioquimicosSubTabSelector";
import InmunologiaSubTabSelector from "./Inmunologia/InmunologiaSubTabSelector";
import ToxicologiaSubTabSelector from "./Toxicologia/ToxicologiaSubTabSelector";
import ConsentimientosSubTabSelector from "./Consentimientos/ConsentimientosSubTabSelector";
import ManipuladoresSubTabSelector from "./Manipuladores/ManipuladoresSubTabSelector";
import PruebasCovidSubTabSelector from "./PruebasCovid/PruebasCovidSubTabSelector";

export default function LaboratorioTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Laboratorio Clinico Formulario",
            label: "Laboratorio Clínico",
            component: LaboratorioClinicoSubTabSelector
        },
        {
            id: 1,
            permission: "Laboratorio Clinico Formulario",
            label: "Análisis Bioquímicos",
            component: AnalisisBioquimicosSubTabSelector
        },
        {
            id: 2,
            permission: "Inmunologia",
            label: "Inmunología",
            component: InmunologiaSubTabSelector
        },
        {
            id: 3,
            permission: "Toxicologia",
            label: "Toxicología",
            component: ToxicologiaSubTabSelector
        },
        {
            id: 4,
            permission: "Consentimientos",
            label: "Consentimientos",
            component: ConsentimientosSubTabSelector
        },
        {
            id: 5,
            permission: "Manipuladores",
            label: "Manipuladores",
            component: ManipuladoresSubTabSelector
        },
        {
            id: 6,
            permission: "Pruebas Covid",
            label: "Pruebas Covid",
            component: PruebasCovidSubTabSelector
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
