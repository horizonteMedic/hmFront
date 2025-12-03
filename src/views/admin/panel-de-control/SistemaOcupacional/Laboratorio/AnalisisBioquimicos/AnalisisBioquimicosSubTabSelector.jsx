import { faCandyCane, faCrown, faFilter, faFlask, faLungs } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import AcidoUrico from "./AcidoUrico/AcidoUrico";
import AnalisisBioquimicos from "./AnalisisBioquimicos/AnalisisBioquimicos";
import PerfilHepatico from "./PerfilHepatico/PerfilHepatico";
import PerfilRenal from "./PerfilRenal/PerfilRenal";
import RiesgoCoronario from "./RiesgoCoronario/RiesgoCoronario";
import ToleranciaGlucosa from "./ToleranciaGlucosa/ToleranciaGlucosa";

export default function AnalisisBioquimicosSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Perfil Lipídico",
      label: "Perfil Lipídico",
      icon: faFlask,
      component: AnalisisBioquimicos
    },
    {
      id: 1,
      permission: "Perfil Renal",
      label: "Perfil Renal",
      icon: faFlask,
      component: PerfilRenal
    },
    {
      id: 2,
      permission: "Acido Urico",
      label: "Ácido Úrico",
      icon: faFilter,
      component: AcidoUrico
    },
    {
      id: 3,
      permission: "Perfil Hepatico",
      label: "Perfil Hepático",
      icon: faLungs,
      component: PerfilHepatico
    },
    {
      id: 4,
      permission: "Riesgo Coronario",
      label: "Riesgo Coronario",
      icon: faCrown,
      component: RiesgoCoronario
    },
    {
      id: 5,
      permission: "Tolerancia Glucosa",
      label: "Tolerancia a la Glucosa",
      icon: faCandyCane,
      component: ToleranciaGlucosa
    },
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
