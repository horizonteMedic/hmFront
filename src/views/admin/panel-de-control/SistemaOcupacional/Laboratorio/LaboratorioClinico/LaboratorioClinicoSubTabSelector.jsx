import { faDroplet, faHandHoldingDroplet, faHandHoldingHand, faHeartbeat, faVial } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Hematologia from "./Hematologia/Hematologia";
import HematologiaBioquimicaECO from "./HematologiaBioquimicaECO/HematologiaBioquimicaECO";
import Hemoglobina from "./Hemoglobina/Hemoglobina";
import Coagulacion from "./Coagulacion/Coagulacion";



export default function LaboratorioClinicoSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Hematología - Bioquímica - ECO",
      label: "Hematología - Bioquímica - ECO",
      icon: faDroplet,
      component: HematologiaBioquimicaECO
    },
    {
      id: 1,
      permission: "Hematograma",
      label: "Hemograma",
      icon: faVial,
      component: Hematologia
    },
    {
      id: 2,
      permission: "Hemoglobina",
      label: "Hemoglobina",
      icon: faHeartbeat,
      component: Hemoglobina
    },
    {
      id: 3,
      permission: "Coagulacion",
      label: "Coagulacion",
      icon: faHandHoldingDroplet,
      component: Coagulacion
    },

  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
