import { useState } from "react";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { getToday } from "../../../../../utils/helpers";
import AudiometriaCuestionario from "./AudiometriaCuestionario";
import { getAudiometriaCuestionarioInitialFormState } from "./audiometriaCuestionarioFormDefaults";

// AudiometriaCuestionario recibe su estado desde AudiometriaTabSelector; este envoltorio se lo da cuando se
// usa solo. Con `nOrdenInicial` va incrustado (p. ej. Auditoría de Protocolos): carga esa orden al abrir y
// avisa con `onGuardado` al registrar o actualizar el cuestionario.
export default function AudiometriaCuestionarioConEstado({ nOrdenInicial, onGuardado }) {
  const { token, userlogued, selectedSede, userName } = useSessionData();

  const initialFormState = {
    ...getAudiometriaCuestionarioInitialFormState({ today: getToday(), userName, userlogued }),
    norden: nOrdenInicial ? String(nOrdenInicial) : "",
  };
  const [form, setForm] = useState(initialFormState);

  return (
    <AudiometriaCuestionario
      token={token}
      userlogued={userlogued}
      selectedSede={selectedSede}
      initialFormState={initialFormState}
      form={form}
      setForm={setForm}
      nOrdenInicial={nOrdenInicial}
      onGuardado={onGuardado}
    />
  );
}
