import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Gonadotropina from "./Gonadotropina/Gonadotropina";
import Hepatitis from "./Hepatitis/Hepatitis";
import BKKOH from "./BKKOH/BKKOH";
import VDRL from "./VDRL/VDRL";
import Aglutinaciones from "./Aglutinaciones/Aglutinaciones";
import { faDisease, faFlask, faMicroscope, faVenus, faVirus, faViruses } from "@fortawesome/free-solid-svg-icons";

export default function InmunologiaSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Gonadotropina",
      label: "Gonadotropina",
      icon: faVenus,
      component: Gonadotropina
    },
    {
      id: 1,
      permission: "BK - KOH",
      label: "BK - KOH",
      icon: faMicroscope,
      component: BKKOH
    },
    {
      id: 2,
      permission: "Aglutinaciones",
      label: "Aglutinaciones",
      icon: faVirus,
      component: Aglutinaciones
    },
    {
      id: 3,
      permission: "Hepatitis",
      label: "Hepatitis",
      icon: faDisease,
      component: Hepatitis
    },
    {
      id: 4,
      permission: "VDRL",
      label: "VDRL",
      icon: faViruses,
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
