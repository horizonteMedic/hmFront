import TabSelector from "../../../../components/reusableComponents/TabSelector";
import LaboratorioClinicoSubTabSelector from "./LaboratorioClinico/LaboratorioClinicoSubTabSelector";
import AnalisisBioquimicosSubTabSelector from "./AnalisisBioquimicos/AnalisisBioquimicosSubTabSelector";
import ConsentimientosSubTabSelector from "./Consentimientos/ConsentimientosSubTabSelector";
import ManipuladoresSubTabSelector from "./Manipuladores/ManipuladoresSubTabSelector";
//import InmunologiaSubTabSelector from "./Inmunologia/InmunologiaSubTabSelector";
// import ToxicologiaSubTabSelector from "./Toxicologia/ToxicologiaSubTabSelector";
// import TabEnConstruccion from "./TabEnConstruccion";
import { faCannabis, faFileAlt, faFilter, faFlask, faMicroscope, faShieldVirus, faVirusCovid } from "@fortawesome/free-solid-svg-icons";

// Mismas pestañas (y mismos permisos) que SistemaOcupacional/Laboratorio. Por ahora solo
// "Laboratorio Clínico", "Análisis Bioquímicos", "Inmunología" y "Toxicología" tienen formularios; el resto se habilita a medida que se migre.
export default function LaboratorioTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Laboratorio Clinico",
            label: "Laboratorio Clínico",
            icon: faFlask,
            component: LaboratorioClinicoSubTabSelector
        },
        {
            id: 1,
            permission: "Analisis Bioquimicos",
            label: "Análisis Bioquímicos",
            icon: faFilter,
            component: AnalisisBioquimicosSubTabSelector
        },
        /*{
            id: 2,
            permission: "Inmunologia",
            label: "Inmunología",
            icon: faShieldVirus,
            component: InmunologiaSubTabSelector
        },*/
        // {
        //     id: 3,
        //     permission: "Toxicologia",
        //     label: "Toxicología",
        //     icon: faCannabis,
        //     component: ToxicologiaSubTabSelector
        // },
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
        // {
        //     id: 6,
        //     permission: "Pruebas Covid",
        //     label: "Pruebas Covid",
        //     icon: faVirusCovid,
        //     component: TabEnConstruccion
        // },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
