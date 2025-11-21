import { useState } from "react";
import Audiometria from "./Audiometria/Audiometria";
import AudiometriaCuestionario from "./AudiometriaCuestionario/AudiometriaCuestionario";
import AudiometriaOhlaTabSelector from "./AudiometriaOhla/AudiometriaOhlaTabSelector";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const initialFormStateAudiometria = {
  codAu: "",
  norden: "",
  fecha: today,
  dni: "",
  fechaNac: "",
  nombres: "",
  edad: "",
  nomExam: "",

  sordera: "NO",
  acufenos: "NO",
  vertigo: "NO",
  otalgia: "NO",
  secrecion_otica: "NO",
  otros_sintomas_orl: "",

  rinitis: "NO",
  sinusitis: "NO",
  otitis_media_cronica: "NO",
  medicamentos_ototoxicos: "NO",
  meningitis: "NO",
  tec: "NO",
  sordera_am: "NO",
  parotiditis: "NO",
  sarampion: "NO",
  tbc: "NO",
  cuales_antecedentes: "",

  exposicion_ruido: "NO",
  protectores_auditivos: "NO",
  exposicion_quimicos: "NO",

  promedio_horas: "",
  anios_exposicion: "",
  meses_exposicion: "",

  // tipo_protectores: [],
  tapones: false,
  orejeras: false,

  plomo_hrs: "", // New fields
  mercurio_hrs: "",
  tolueno_hrs: "",
  xileno_hrs: "",
  plaguicidas_hrs: "",
  organofosforados_hrs: "",

  plomo_anios: "",
  mercurio_anios: "",
  tolueno_anios: "",
  xileno_anios: "",
  plaguicidas_anios: "",
  organofosforados_anios: "",
  otros_quimicos: "",

  practica_tiro: "NO",
  uso_walkman: "NO",
  otros_antecedentes: "NO",
  cuales_antecedentes_extralaborales: "",
  otoscopia_odiocho: "Normal",
  otoscopia_odilzquierdo: "Normal",

  od_500: "",
  od_1000: "",
  od_2000: "",
  od_3000: "",
  od_4000: "",
  od_6000: "",
  od_8000: "",

  oi_500: "",
  oi_1000: "",
  oi_2000: "",
  oi_3000: "",
  oi_4000: "",
  oi_6000: "",
  oi_8000: "",

  diagnostico_od: "",
  diagnostico_oi: "",
  comentarios_audiometria: "",

  proteccion_simpleODoble: "",
  control_semestralOAnual: "",
  recomendaciones_otras: "",

  od_o_500: "",
  od_o_1000: "",
  od_o_2000: "",
  od_o_3000: "",
  od_o_4000: "",
  od_o_6000: "",
  od_o_8000: "",
  oi_o_500: "",
  oi_o_1000: "",
  oi_o_2000: "",
  oi_o_3000: "",
  oi_o_4000: "",
  oi_o_6000: "",
  oi_o_8000: "",

  empresa: "",
  contrata: "",
};

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
  
  const [formAudiometria, setFormAudiometria] = useState(
    initialFormStateAudiometria
  );
  const [formCuestionarioAudio, setFormCuestionarioAudio] = useState(
    initialFormStateCuestionarioAudio
  );
  return (
    <>
      {subTab === 0 && (
        <Audiometria
          token={token}
          userlogued={userlogued.sub}
          selectedSede={selectedSede}   
          initialFormState={initialFormStateAudiometria}
          form={formAudiometria}
          setForm={setFormAudiometria}
        />
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