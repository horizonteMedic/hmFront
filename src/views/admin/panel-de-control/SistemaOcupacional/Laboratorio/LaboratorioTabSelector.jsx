import TabSelector from "../../../../components/reusableComponents/TabSelector";
import LaboratorioClinicoSubTabSelector from "./LaboratorioClinico/LaboratorioClinicoSubTabSelector";
import AnalisisBioquimicosSubTabSelector from "./AnalisisBioquimicos/AnalisisBioquimicosSubTabSelector";
import InmunologiaSubTabSelector from "./Inmunologia/InmunologiaSubTabSelector";
import ToxicologiaSubTabSelector from "./Toxicologia/ToxicologiaSubTabSelector";
import ConsentimientosSubTabSelector from "./Consentimientos/ConsentimientosSubTabSelector";
import ManipuladoresSubTabSelector from "./Manipuladores/ManipuladoresSubTabSelector";
import PruebasCovidSubTabSelector from "./PruebasCovid/PruebasCovidSubTabSelector";
import { faCannabis, faFileAlt, faFilter, faFlask, faMicroscope, faShieldVirus, faVirusCovid } from "@fortawesome/free-solid-svg-icons";

export default function LaboratorioTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Laboratorio Clinico Formulario",
            label: "Laboratorio Clínico",
            icon: faFlask,
            component: LaboratorioClinicoSubTabSelector
        },
        {
            id: 1,
            permission: "Laboratorio Clinico Formulario",
            label: "Análisis Bioquímicos",
            icon: faFilter,
            component: AnalisisBioquimicosSubTabSelector
        },
        {
            id: 2,
            permission: "Inmunologia",
            label: "Inmunología",
            icon: faShieldVirus,
            component: InmunologiaSubTabSelector
        },
        {
            id: 3,
            permission: "Toxicologia",
            label: "Toxicología",
            icon: faCannabis,
            component: ToxicologiaSubTabSelector
        },
        {
            id: 4,
            permission: "Consentimientos",
            label: "Consentimientos",
            icon: faFileAlt,
            component: ConsentimientosSubTabSelector
        },
        {
            id: 5,
            permission: "Manipuladores",
            label: "Manipuladores",
            icon: faMicroscope,
            component: ManipuladoresSubTabSelector
        },
        {
            id: 6,
            permission: "Pruebas Covid",
            label: "Pruebas Covid",
            icon: faVirusCovid,
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
