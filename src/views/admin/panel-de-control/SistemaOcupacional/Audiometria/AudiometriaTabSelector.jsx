import TabSelector from "../../../../components/reusableComponents/TabSelector";
import Audiometria from "./Audiometria/Audiometria";
import AudiometriaOhlaN from "./AudiometriaOhlaN/AudiometriaOhlaN";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";

// El acceso al módulo lo da la vista "Audiometria" (tarjeta en SistemaOcupacional); cada examen
// tiene además su propio permiso. Los nombres deben coincidir exactamente con las vistas del backend.
export default function AudiometriaTabSelector({ tieneVista }) {
  // Cada formulario guarda su propio borrador (useForm con storageKey), así que no hace falta
  // mantener su estado aquí para que sobreviva al cambiar de pestaña.
  const tabsConfig = [
    {
      id: 0,
      permission: "Audiometria Normal",
      label: "Audiometria",
      component: Audiometria,
    },
    {
      id: 1,
      permission: "Audiometria-Ohla",
      label: "Audiometria OHLA",
      component: AudiometriaOhlaN,
    },
    {
      id: 2,
      permission: "Cuestionario Audiometria",
      label: "Cuestionario de Audiometria",
      component: AudiometriaCuestionario,
    },
  ];


  return <TabSelector tieneVista={tieneVista} tabsConfig={tabsConfig} />;
}
