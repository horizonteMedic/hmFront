import { faDroplet, faHandHoldingDroplet, faHandHoldingHand, faHeartbeat, faVial } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Hematologia from "./Hematologia/Hematologia";
import HematologiaBioquimicaECO from "./HematologiaBioquimicaECO/HematologiaBioquimicaECO";
import Hemoglobina from "./Hemoglobina/Hemoglobina";
import Cuagulacion from "./Cuagulacion/Cuagulacion";

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
      permission: "Cuagulacion",
      label: "Cuagulacion",
      icon: faHandHoldingDroplet,
      component: Cuagulacion
    },

  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
