import TabSelector from "../../../../components/reusableComponents/TabSelector";
import AnexosPsicologiaSubSelector from "./AnexosPsicologia/AnexosPsicologiaSubSelector";
import ExamenesComplementariosSubSelector from "./ExamenesComplementarios/ExamenesComplementariosSubSelector";
import ExamenesComplementarios2SubSelector from "./ExamenesComplementarios2/ExamenesComplementarios2SubSelector";
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
        {
            id: 3,
            permission: "Examenes Complementarios 2 Psicologia",
            label: "Examenes Complementarios 2",
            component: ExamenesComplementarios2SubSelector
        },
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
