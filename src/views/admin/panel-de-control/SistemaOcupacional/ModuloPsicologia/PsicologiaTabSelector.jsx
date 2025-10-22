import TabSelector from "../../../../components/reusableComponents/TabSelector";
import InformePsicologico from "./InformePsicologico/InformePsicologico";
import FichaPsicologica2 from "./FichaPsicologica2/FichaPsicologica2";
import FichaPsicologica3 from "./FichaPsicologica3/FichaPsicologica3";
import InformePsicolaboral from "./InformePsicolaboral/InformePsicolaboral";
import InformePsicologicoADECO from "./InformePsicologicoADECO/InformePsicologicoADECO";
import ExamenEspacioConfinado from "./ExamenEspacioConfinado/ExamenEspacioConfinado";
import EvaluacionPsicologicaPoderosa from "./EvaluacionPsicologicaPoderosa/EvaluacionPsicologicaPoderosa";

export default function PsicologiaTabSelector({ tieneVista }) {
    const tabsConfig = [
        {
            id: 0,
            permission: "Informe Psicologico",
            label: "Informe Psicologico",
            component: InformePsicologico
        },
        {
            id: 1,
            permission: "Ficha Psicologica 2",
            label: "Ficha Psicológica 2",
            component: FichaPsicologica2
        },
        {
            id: 2,
            permission: "Ficha Psicologica 3",
            label: "Ficha Psicológica 3",
            component: FichaPsicologica3
        },
        {
            id: 3,
            permission: "Informe Psicolaboral",
            label: "Informe Psicolaboral",
            component: InformePsicolaboral
        },
        {
            id: 4,
            permission: "Informe Psicologico ADECO",
            label: "Informe Psicológico ADECO",
            component: InformePsicologicoADECO
        },
        {
            id: 5,
            permission: "Examen Espacio Confinado",
            label: "Examen Espacio Confinado",
            component: ExamenEspacioConfinado
        },
        {
            id: 6,
            permission: "Examen Espacio Confinado",
            label: "Evaluacion Psicologica Poderosa",
            component: EvaluacionPsicologicaPoderosa
        }
    ];
    return (
        <TabSelector
            tieneVista={tieneVista}
            tabsConfig={tabsConfig}
        />
    );
}
