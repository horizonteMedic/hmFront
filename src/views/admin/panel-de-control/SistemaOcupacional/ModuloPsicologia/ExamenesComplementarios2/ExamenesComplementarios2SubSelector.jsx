import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import AltoRiesgo from "./AltoRiesgo/AltoRiesgo";
import BombaElectrica from "./BombaElectrica/BombaElectrica";
import Brigadista from "./Brigadista/Brigadista";
import CuestionarioBerlin from "./CuestionarioBerlin/CuestionarioBerlin";
import ExamenesComplementariosForm from "./ExamenesComplementariosForm/ExamenesComplementariosForm";
import InformeConductores from "./InformeConductores/InformeConductores";
import TrabajosEspecificos from "./TrabajosEspecificos/TrabajosEspecificos";
import Vigia from "./Vigia/Vigia";

export default function ExamenesComplementarios2SubSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Conductores",
            label: "Informe Conductores",
            component: InformeConductores
        },
        {
            id: 1,
            permission: "Alto Riesgo",
            label: "Alto Riesgo",
            component: AltoRiesgo
        },
        {
            id: 2,
            permission: "Trabajos Especificos",
            label: "Trabajos Especificos",
            component: TrabajosEspecificos
        },
        {
            id: 3,
            permission: "Cuestionario Berlin",
            label: "Cuestionario Berlin",
            component: CuestionarioBerlin
        },
        {
            id: 4,
            permission: "Examenes Complementarios Form",
            label: "Examenes Complementarios",
            component: ExamenesComplementariosForm
        },
        {
            id: 5,
            permission: "Brigadista",
            label: "Brigadista",
            component: Brigadista
        },
        {
            id: 6,
            permission: "Bomba Electrica",
            label: "Bomba Eléctrica",
            component: BombaElectrica
        },
        {
            id: 7,
            permission: "Vigia",
            label: "Vigia",
            component: Vigia
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
