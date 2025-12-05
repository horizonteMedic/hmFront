import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import CalidadDeSueno from "./CalidadDeSueno/CalidadDeSueno";
import ExamenEspacioConfinado from "./ExamenEspacioConfinado/ExamenEspacioConfinado";
import InformePsicologicoADECO from "./InformePsicologicoADECO/InformePsicologicoADECO";
import AlturaPsicologica from "./AlturaPsicologica/AlturaPsicologica";
import InformeDeFobias from "./InformeDeFobias/InformeDeFobias";
import AversionRiesgo from "./AversionRiesgo/AversionRiesgo";
import TrastornoDePersonalidad from "./TrastornoDePersonalidad/TrastornoDePersonalidad";
import InformeConductores from "./InformeConductores/InformeConductores";
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
        {
            id: 2,
            permission: "Calidad de Sueño",
            label: "Calidad De Sueño",
            component: CalidadDeSueno
        },
        {
            id: 3,
            permission: "Informe De Fobias",
            label: "Informe De Fobias",
            component: InformeDeFobias
        },
        {
            id: 4,
            permission: "Aversion al Riesgo",
            label: "Aversion al Riesgo",
            component: AversionRiesgo
        },
        {
            id: 5,
            permission: "Altura Psicologica",
            label: "Formato Altura Psicologica",
            component: AlturaPsicologica
        },
        {
            id: 6,
            permission: "Trastorno de Personalidad",
            label: "Trastorno de Personalidad",
            component: TrastornoDePersonalidad
        },
        {
            id: 7,
            permission: "Informe Conductores",
            label: "Informe Conductores",
            component: InformeConductores
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
