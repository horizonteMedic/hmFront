import { faDroplet, faPrescriptionBottle, faSpider } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Coprocultivo from "./Coprocultivo/Coprocultivo";
import Coproparasitologia from "./Coproparasitologia/Coproparasitologia";
import ExamenOrina from "./ExamenOrina/ExamenOrina";

// Mismas pestañas (y mismos permisos) que SistemaOcupacional/Laboratorio/Manipuladores.
export default function ManipuladoresSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Coprocultivo Asistencial",
      label: "Coprocultivo",
      icon: faPrescriptionBottle,
      component: Coprocultivo
    },
    {
      id: 1,
      permission: "Parasitología Asistencial",
      label: "Parasitología",
      icon: faSpider,
      component: Coproparasitologia
    },
    {
      id: 2,
      permission: "Examen Orina Asistencial",
      label: "Examen de Orina",
      icon: faDroplet,
      component: ExamenOrina
    },
  ];

  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
