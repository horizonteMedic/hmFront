import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import AcidoUrico from "./AcidoUrico/AcidoUrico";
import AnalisisBioquimicos from "./AnalisisBioquimicos/AnalisisBioquimicos";
import PerfilHepatico from "./PerfilHepatico/PerfilHepatico";
import PerfilRenal from "./PerfilRenal/PerfilRenal";

export default function AnalisisBioquimicosSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Perfil Lipídico",
      label: "Perfil Lipídico",
      component: AnalisisBioquimicos
    },
    {
      id: 1,
      permission: "Perfil Renal",
      label: "Perfil Renal",
      component: PerfilRenal
    },
    {
      id: 2,
      permission: "Acido Urico",
      label: "Ácido Úrico",
      component: AcidoUrico
    },
    {
      id: 3,
      permission: "Perfil Hepatico",
      label: "Perfil Hepático",
      component: PerfilHepatico
    },
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
