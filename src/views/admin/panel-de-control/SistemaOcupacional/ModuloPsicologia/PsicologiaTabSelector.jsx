import TabSelector from "../../../../components/reusableComponents/TabSelector";
import AnexosPsicologiaSubSelector from "./AnexosPsicologia/AnexosPsicologiaSubSelector";
import ExamenesComplementariosSubSelector from "./ExamenesComplementarios/ExamenesComplementariosSubSelector";
import PsicologiaBorooSubSelector from "./PsicologiaBoroo/PsicologiaBorooSubSelector";

export default function PsicologiaTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Anexos Psicologia",
            label: "Anexos",
            component: AnexosPsicologiaSubSelector
        },
        {
            id: 1,
            permission: "Psicologia Boroo",
            label: "Boroo",
            component: PsicologiaBorooSubSelector
        },
        {
            id: 2,
            permission: "Examenes Complementarios Psicologia",
            label: "Examenes Complementarios",
            component: ExamenesComplementariosSubSelector
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
