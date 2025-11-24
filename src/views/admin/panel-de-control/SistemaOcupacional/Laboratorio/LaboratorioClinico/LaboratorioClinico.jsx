import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import HematologiaBioquimicaSIEO from "./Hematologia-bioquimicaSI-EO/Hematologia-bioquimicaSI-EO";
import Hematologia from "./Hematologia/Hematologia";

export default function LaboratorioClinico({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Acceso Hematologia - Bioquimica SI-EO",
      label: "Hematología - Bioquímica SI-EO",
      component: HematologiaBioquimicaSIEO
    },
    {
      id: 1,
      permission: "Acceso Hematograma",
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
