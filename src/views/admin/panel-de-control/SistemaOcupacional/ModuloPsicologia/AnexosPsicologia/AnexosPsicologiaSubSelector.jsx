import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import InformePsicologico from "./InformePsicologico/InformePsicologico";
import EvaluacionPsicologicaPoderosa from "./EvaluacionPsicologicaPoderosa/EvaluacionPsicologicaPoderosa";
import FichaPsicologica2 from "./FichaPsicologica2/FichaPsicologica2";
import FichaPsicologica3 from "./FichaPsicologica3/FichaPsicologica3";

export default function AnexosPsicologiaSubSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Psicologico",
            label: "Informe Psicologico",
            component: InformePsicologico
        },
        {
            id: 1,
            permission: "Evaluacion Psicologica Poderosa",
            label: "Evaluacion Psicologica Poderosa",
            component: EvaluacionPsicologicaPoderosa
        },
        {
            id: 2,
            permission: "Ficha Psicologica 2",
            label: "Ficha Psicológica 2",
            component: FichaPsicologica2
        },
        {
            id: 3,
            permission: "Ficha Psicologica 3",
            label: "Ficha Psicológica 3",
            component: FichaPsicologica3
        },
    ];
    return (
        <SubTabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
