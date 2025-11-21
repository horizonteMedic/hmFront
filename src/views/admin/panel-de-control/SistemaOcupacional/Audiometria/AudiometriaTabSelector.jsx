import Audiometria from "./Audiometria/Audiometria";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";
import AudiometriaOhlaTabSelector from "./AudiometriaOhla/AudiometriaOhlaTabSelector";

export default function AudiometriaTabSelector({
  token,
  selectedSede,
  listas,
  subTab,
}) {
  return (
    <>
      {subTab === 0 && <Audiometria />}
      {subTab === 1 && (
        <AudiometriaOhlaTabSelector
          token={token}
          selectedSede={selectedSede}
          listas={listas}
        />
      )}
      {subTab === 2 && <AudiometriaCuestionario />}
    </>
  );
}
