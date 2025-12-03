import { faDroplet, faVial } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Hematologia from "./Hematologia/Hematologia";
import HematologiaBioquimicaECO from "./HematologiaBioquimicaECO/HematologiaBioquimicaECO";

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

  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
