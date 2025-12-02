import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Hematologia from "./Hematologia/Hematologia";
import HematologiaBioquimicaECO from "./HematologiaBioquimicaECO/HematologiaBioquimicaECO";

export default function LaboratorioClinicoSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Hematología - Bioquímica - ECO",
      label: "Hematología - Bioquímica - ECO",
      component: HematologiaBioquimicaECO
    },
    {
      id: 1,
      permission: "Hematograma",
      label: "Hemograma",
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
