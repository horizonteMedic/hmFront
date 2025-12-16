import { faCandyCane, faCrown, faFlask, faGlassWater, faHandHoldingDroplet, faKiwiBird, faLungs } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import AcidoUrico from "./AcidoUrico/AcidoUrico";
import PerfilHepatico from "./PerfilHepatico/PerfilHepatico";
import PerfilRenal from "./PerfilRenal/PerfilRenal";
import RiesgoCoronario from "./RiesgoCoronario/RiesgoCoronario";
import ToleranciaGlucosa from "./ToleranciaGlucosa/ToleranciaGlucosa";
import GlucosaBasal from "./GlucosaBasal/GlucosaBasal";
import PerfilLipidico from "./PerfilLipidico/PerfilLipidico";

export default function AnalisisBioquimicosSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Perfil Lipídico",
      label: "Perfil Lipídico",
      icon: faFlask,
      component: PerfilLipidico
    },
    {
      id: 1,
      permission: "Perfil Renal",
      label: "Perfil Renal",
      icon: faLungs,
      component: PerfilRenal
    },
    {
      id: 2,
      permission: "Acido Urico",
      label: "Ácido Úrico",
      icon: faHandHoldingDroplet,
      component: AcidoUrico
    },
    {
      id: 3,
      permission: "Perfil Hepatico",
      label: "Perfil Hepático",
      icon: faKiwiBird,
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
    {
      id: 6,
      permission: "Glucosa Basal",
      label: "Glucosa Basal",
      icon: faGlassWater,
      component: GlucosaBasal
    },
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
