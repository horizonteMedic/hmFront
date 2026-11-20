import Audiometria from "./Audiometria/Audiometria";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";
import AudiometriaOhlaTabSelector from "./AudiometriaOhla/AudiometriaOhlaTabSelector";
import AudiometriaOhlaN from "./AudiometriaOhlaN/AudiometriaOhlaN";
import { useSessionData } from "../../../../hooks/useSessionData";

export default function AudiometriaTabSelector({
  token,
  selectedSede,
  listas,
  subTab,
}) {

  const { userlogued } = useSessionData();

  // Cada formulario guarda su propio borrador (useForm con storageKey), así que no hace falta
  // mantener su estado aquí para que sobreviva al cambiar de pestaña.
  return (
    <>
      {subTab === 0 && (
        <Audiometria />
      )}
      {subTab === 1 && (
        <AudiometriaOhlaTabSelector
          token={token}
          userlogued={userlogued}
          selectedSede={selectedSede}
          listas={listas}
        />
      )}
      {subTab === 2 && (
        <AudiometriaCuestionario />
      )}
      {subTab === 3 && (
        <AudiometriaOhlaN />
      )}
    </>
  );
}
