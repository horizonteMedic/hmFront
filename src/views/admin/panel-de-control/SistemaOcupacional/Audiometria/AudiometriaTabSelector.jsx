import { useState } from "react";
import Audiometria from "./Audiometria/Audiometria";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";
import AudiometriaOhlaTabSelector from "./AudiometriaOhla/AudiometriaOhlaTabSelector";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;


const initialFormStateCuestionarioAudio = {
  norden: "",
  codCuestionario: null,
  fecha: today,
  nombres: "",
  edad: "",

  genero: "",

  // Preguntas del cuestionario
  p1: "NO",
  p2: "NO",
  p3: "NO",
  p4: "NO",
  p5: "NO",
  p6: "NO",
  p7: "NO",
  p8: "NO",
  p9: "NO",
  p10: "NO",
  p11: "NO",
  p12: "NO",
  p13: "NO",
  p14: "NO",
  p15: "NO",
  // Campos condicionales
  p1_cual: "",
  p1_cuando: "",
  p1_quehizo: "",
  p9_cual: "",
  p9_donde: "",
  p9_quehizo: "",
  p10_cual: "",
  p10_donde: "",
  p10_quehizo: "",
  p11_cual: "",
  p11_tiempo: "",
  p12_cual: "",
  p12_tiempo: "",
  p13_tiempo: "",
  p13_cuando: "",
  p13_donde: "",
  p14_cual: "",
  p14_donde: "",
  p14_quehizo: "",
  p15_cuantos: "",
  // Pregunta 16 (todas en false por defecto)
  p16_caza: false,
  p16_caza_tiempo: "",
  p16_tiro: false,
  p16_tiro_tiempo: "",
  p16_discoteca: false,
  p16_discoteca_tiempo: "",
  p16_auriculares: false,
  p16_auriculares_tiempo: "",
  p16_servicio: false,
  p16_servicio_tiempo: "",
  p16_boxeo: false,
  p16_boxeo_tiempo: "",
};

export default function AudiometriaTabSelector({
  token,
  userlogued,
  selectedSede,
  listas,
  subTab,
}) {


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
          userlogued={userlogued.sub}
          selectedSede={selectedSede}
          initialFormState={initialFormStateCuestionarioAudio}
          form={formCuestionarioAudio}
          setForm={setFormCuestionarioAudio}
        />
      )}
    </>
  );
}