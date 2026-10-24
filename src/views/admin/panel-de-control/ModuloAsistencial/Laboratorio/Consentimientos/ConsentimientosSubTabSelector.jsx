import { faFlask } from "@fortawesome/free-solid-svg-icons";
import SubTabSelector from "../../../../../components/reusableComponents/SubTabSelector";
import Boro from "./Boro/Boro";
import ConsentimientoLaboratorio from "./ConsentimientoLaboratorio";
import { CONSENTIMIENTOS } from "./config/consentimientos";

// Un componente por consentimiento, creado una sola vez: SubTabSelector monta `component` como tipo, y uno nuevo
// en cada render reiniciaría el formulario. Boro tiene su propio formulario y endpoint.
const tabsConfig = [
  ...CONSENTIMIENTOS.map((config) => ({
    permission: config.permission,
    label: config.label,
    icon: config.icon,
    component: () => <ConsentimientoLaboratorio config={config} />,
  })),
  { permission: "Consentimiento BORO", label: "BORO", icon: faFlask, component: Boro },
].map((tab, id) => ({ ...tab, id }));

export default function ConsentimientosSubTabSelector({ tieneVista }) {
  return <SubTabSelector tieneVista={tieneVista} tabsConfig={tabsConfig} />;
}
