import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import HematologiaBioquimicaSIEO from "./Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO";
import Hematologia from "./Hematologia/Hematologia";

export default function LaboratorioClinicoSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Hematología - Bioquímica - ECO",
      label: "Hematología - Bioquímica - ECO",
      component: HematologiaBioquimicaSIEO
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
