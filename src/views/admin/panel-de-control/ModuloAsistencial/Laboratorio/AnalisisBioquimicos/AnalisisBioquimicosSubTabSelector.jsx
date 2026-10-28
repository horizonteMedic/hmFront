import { faCandyCane, faCrown, faDroplet, faFlask, faGlassWater, faHandHoldingDroplet, faHeart, faKiwiBird, faLungs } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import AcidoUrico from "./AcidoUrico/AcidoUrico";
import PerfilHepatico from "./PerfilHepatico/PerfilHepatico";
import PerfilRenal from "./PerfilRenal/PerfilRenal";
import RiesgoCoronario from "./RiesgoCoronario/RiesgoCoronario";
import ToleranciaGlucosa from "./ToleranciaGlucosa/ToleranciaGlucosa";
import GlucosaBasal from "./GlucosaBasal/GlucosaBasal";
import PerfilLipidico from "./PerfilLipidico/PerfilLipidico";
import PCRUltrasensible from "./PCRUltrasensible/PCRUltrasensible";
import Colinesterasa from "./Colinesterasa/Colinesterasa";

export default function AnalisisBioquimicosSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Perfil Lipidico Asistencial",
      label: "Perfil Lipídico",
      icon: faFlask,
      component: PerfilLipidico
    },
    {
      id: 1,
      permission: "Perfil Renal Asistencial",
      label: "Perfil Renal",
      icon: faLungs,
      component: PerfilRenal
    },
    {
      id: 2,
      permission: "Acido Urico Asistencial",
      label: "Ácido Úrico",
      icon: faHandHoldingDroplet,
      component: AcidoUrico
    },
    {
      id: 3,
      permission: "Perfil Hepatico Asistencial",
      label: "Perfil Hepático",
      icon: faKiwiBird,
      component: PerfilHepatico
    },
    {
      id: 4,
      permission: "Riesgo Coronario Asistencial",
      label: "Riesgo Coronario",
      icon: faCrown,
      component: RiesgoCoronario
    },
    {
      id: 5,
      permission: "Tolerancia Glucosa Asistencial",
      label: "Tolerancia a la Glucosa",
      icon: faCandyCane,
      component: ToleranciaGlucosa
    },
    {
      id: 6,
      permission: "Glucosa Basal Asistencial",
      label: "Glucosa Basal",
      icon: faGlassWater,
      component: GlucosaBasal
    },
    {
      id: 7,
      permission: "PCR Ultrasensible Asistencial",
      label: "PCR ultrasensible",
      icon: faHeart,
      component: PCRUltrasensible
    },
    {
      id: 8,
      permission: "Colinesterasa Asistencial",
      label: "Colinesterasa",
      icon: faDroplet,
      component: Colinesterasa
    },
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
