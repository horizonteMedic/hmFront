import { useState } from "react";
import Audiometria from "./Audiometria/Audiometria";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";
import { getAudiometriaCuestionarioInitialFormState } from "./AudiometriaCuestionario/audiometriaCuestionarioFormDefaults";
import AudiometriaOhlaTabSelector from "./AudiometriaOhla/AudiometriaOhlaTabSelector";
import AudiometriaOhlaN from "./AudiometriaOhlaN/AudiometriaOhlaN";
import { useSessionData } from "../../../../hooks/useSessionData";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;



export default function AudiometriaTabSelector({
  token,
  userlogued2,
  selectedSede,
  listas,
  subTab,
}) {

  const { userName, userlogued } = useSessionData();
  const initialFormStateCuestionarioAudio = getAudiometriaCuestionarioInitialFormState({
    today,
    userName,
    userlogued,
  });

  const [formCuestionarioAudio, setFormCuestionarioAudio] = useState(
    initialFormStateCuestionarioAudio
  );
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
        <AudiometriaCuestionario
          token={token}
          userlogued={userlogued}
          selectedSede={selectedSede}
          initialFormState={initialFormStateCuestionarioAudio}
          form={formCuestionarioAudio}
          setForm={setFormCuestionarioAudio}
        />
      )}
      {subTab === 3 && (
        <AudiometriaOhlaN />
      )}
    </>
  );
}