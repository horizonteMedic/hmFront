import SubTabSelector from "../../../../components/reusableComponents/SubTabSelector";
import ExamenEspacioConfinado from "./ExamenEspacioConfinado/ExamenEspacioConfinado";
import InformePsicologicoADECO from "./InformePsicologicoADECO/InformePsicologicoADECO";

export default function ExamenesComplementariosSubSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Psicologico ADECO",
            label: "Informe Psicológico ADECO",
            component: InformePsicologicoADECO
        },
        {
            id: 1,
            permission: "Examen Espacio Confinado",
            label: "Examen Espacio Confinado",
            component: ExamenEspacioConfinado
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
