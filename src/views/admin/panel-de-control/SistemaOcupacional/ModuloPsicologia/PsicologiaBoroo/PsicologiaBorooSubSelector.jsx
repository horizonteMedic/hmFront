import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import InformeBurnout from "./InformeBurnout/InformeBurnout";
import InformePsicolaboral from "./InformePsicolaboral/InformePsicolaboral";
import InformeRiesgoPsicosocial from "./InformeRiesgoPsicosocial/InformeRiesgoPsicosocial";

export default function PsicologiaBorooSubSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Psicolaboral",
            label: "Informe Psicolaboral",
            component: InformePsicolaboral,
        },
        {
            id: 1,
            permission: "Informe Riesgo Psicosocial",
            label: "Informe Riesgo Psicosocial",
            component: InformeRiesgoPsicosocial,
        },
        {
            id: 2,
            permission: "Informe Burnout",
            label: "Informe Burnout",
            component: InformeBurnout,
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}