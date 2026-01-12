import TabSelector from "../../../../components/reusableComponents/TabSelector";
import RayosXToraxPA from "./rayosXToraxPA/RayosXToraxPA";
import RayosXColumna from "./rayosXColumna/RayosXColumna";
import ConsentimientoMujerRayosX from "./consentimientoMujer/ConsentimientoMujerRayosX";

export default function RayosXTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      permission: "Radiografía de Torax",
      label: "Radiografía de Tórax P.A.",
      component: RayosXToraxPA
    },
    {
      id: 1,
      permission: "Radiografía de Columna",
      label: "Radiografía Columna",
      component: RayosXColumna
    },
    {
      id: 2,
      permission: "Consentimiento Mujeres",
      label: "Consentimiento Mujeres",
      component: ConsentimientoMujerRayosX
    }
  ];

  return (
    <TabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
