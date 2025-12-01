
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Gonadotropina from "./Gonadotropina/Gonadotropina";
import Hepatitis from "./Hepatitis/Hepatitis";
import Inmunologia from "./Inmunologia/Inmunologia";
import Microbiologia from "./Microbiologia/Microbiologia";
import VDRL from "./VDRL/VDRL";

export default function InmunologiaSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Gonadotropina",
      label: "Gonadotropina",
      component: Gonadotropina
    },
    {
      id: 1,
      permission: "BK - KOH",
      label: "BK - KOH",
      component: Microbiologia
    },
    {
      id: 2,
      permission: "Aglutinaciones",
      label: "Aglutinaciones",
      component: Inmunologia
    },
    {
      id: 3,
      permission: "Hepatitis",
      label: "Hepatitis",
      component: Hepatitis
    },
    {
      id: 4,
      permission: "VDRL",
      label: "VDRL",
      component: VDRL
    },
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
