
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Gonadotropina from "./Gonadotropina/Gonadotropina";
import Hepatitis from "./Hepatitis/Hepatitis";
import Inmunologia from "./Inmunologia/Inmunologia";
import Microbiologia from "./Microbiologia/Microbiologia";
import VDRL from "./VDRL/VDRL";

export default function InmunologiaSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      permission: "Gonadotropina",
      label: "Gonadotropina",
      component: Gonadotropina
    },
    {
      permission: "Microbiologia",
      label: "Microbiología",
      component: Microbiologia
    },
    {
      permission: "Inmunologia Subtab",
      label: "Inmunología",
      component: Inmunologia
    },
    {
      permission: "Hepatitis",
      label: "Hepatitis",
      component: Hepatitis
    },
    {
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
