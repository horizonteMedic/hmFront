import SubTabSelector from "../../../../components/reusableComponents/SubTabSelector";
import InformePsicolaboral from "./InformePsicolaboral/InformePsicolaboral";

export default function PsicologiaBorooSubSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Psicolaboral",
            label: "Informe Psicolaboral",
            component: InformePsicolaboral
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}