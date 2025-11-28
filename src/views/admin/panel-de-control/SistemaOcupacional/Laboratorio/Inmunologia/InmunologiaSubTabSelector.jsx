
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
      label: "L. Gonadotropina",
      component: Gonadotropina
    },
    {
      id: 1,
      permission: "Microbiologia",
      label: "Microbiología",
      component: Microbiologia
    },
    {
      id: 2,
      permission: "Inmunologia Subtab",
      label: "Inmunología",
      component: Inmunologia
    },
    {
      id: 3,
      permission: "Hepatitis",
      label: "L. Hepatitis",
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
