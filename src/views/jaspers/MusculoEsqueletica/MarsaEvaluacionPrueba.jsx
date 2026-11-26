import EvaluacionMuscoloEsqueletica2021_Marsa from "./EvaluacionMuscoloEsqueletica2021_Marsa.jsx";
import { VisorPdfPrueba, firmaDePrueba, huellaDePrueba, selloDePrueba } from "../ModuloAsistencial/pruebaJasper.jsx";

// Simulador de la "Evaluación Músculo Esquelética 2021 - MARSA" para la ruta /fichapi: genera el PDF con datos de
// prueba y lo muestra en la misma página.

const joint = (prefijo, valores) =>
  Object.fromEntries(
    ["Abduccion", "Aduccion", "Flexion", "Extension", "RotExterna", "RotInterna", "Irradiacion", "MasaMuscular"].map((s, i) => [
      `${prefijo}${s}`, valores[i] ?? "0",
    ])
  );

export const datosPrueba = () => ({
  norden: 123456,
  sede: "Trujillo",
  nombres: "CARLOS ANDRÉS MENDOZA QUISPE",
  edad: "38",
  sexo: "M",
  fechaExamen: "2026-11-24",
  empresa: "MINERA AURIFERA RETAMAS S.A.",
  area: "OPERACIONES MINA",
  cargo: "OPERADOR DE EQUIPO PESADO",

  aptitudEspaldaAbdomen: "2", aptitudEspaldaCadera: "1", aptitudEspaldaMuslo: "3", aptitudEspaldaAbdomenL: "2",
  totalPuntosAptitudEspalda: "8", observacionAptitudEspalda: "Buena flexibilidad general.",
  rangosArticularesAbduccion180: "1", rangosArticularesAbduccion60: "2", rangosArticularesRotacion90: "1",
  rangosArticularesRotacionInterna: "2", totalPuntosRangosArticulares: "6",
  rangosArticularesAbduccion180No: true, rangosArticularesAbduccion60No: true,
  rangosArticularesRotacion90No: true, rangosArticularesRotacionInternaNo: true,
  observacionRangosArticulares: "Rangos dentro de parámetros normales.",
  columnaVertebralDesviacionNo: true, columnaVertebralAdamsNegativo: true, columnaVertebralDandyNegativo: true,
  columnaVertebralLasegueNegativo: true, columnaVertebralContracturaSi: true,
  columnaVertebralContracturaDescripcion: "Paravertebral lumbar", columnaVertebralCicatrizNo: true,
  testJobederechaSi: true, testJobeizquierdaSi: true, testPateDerechaSi: true, testPateIzquierdaSi: true,
  testGerberDerechaSi: true, testGerberIzquierdaSi: true, testPulmDerechaSi: true, testPulmIzquierdaSi: true,
  epiconDilitisDerechaSi: true, epiconDilitisizquierdaSi: true, epitroCleitisDerechaSi: true, epitroCleitisIzquierdaSi: true,
  phalenDerechaSi: true, phalenIzquierdaSi: true, phalenInvertidoDerechaSi: true, phalenInvertidoIzquierdaSi: true,
  tinnelDerechaSi: true, tinnelIzquierdaSi: true, finkelsTeinDerechaSi: true, finkelsTeinIzquierdaSi: true,

  ...joint("caderaDerecha", ["0", "0", "1", "0"]),
  ...joint("caderaIzquierda", []),
  ...joint("rodillaDerecha", ["", "", "0"]),
  ...joint("rodillaIzquierda", ["", "", "1"]),
  ...joint("tobilloDerecho", []),
  ...joint("tobilloIzquierdo", []),

  conclusiones: "NORMAL",
  cie10: "Z00",
  recomendaciones: "- EVALUACIÓN ANUAL",

  adicional: {
    horasDia: "8",
    tiempoTarea: "continuo4",
    movHombro: true, movPronosupinacion: false, repetidas: true, contraResistencia: false, posturasForzadas: true,
    ciclo: "moderado",
    carga: "entre1y3",
    cervicalLateral: "normal", cervicalAnteroPosterior: "normal",
    dorsalLateral: "concavidadDerecha", dorsalAnteroPosterior: "aumentada", dorsalContractura: true,
    lumbarLateral: "normal", lumbarAnteroPosterior: "disminuida", lumbarApofisis: true, lumbarContractura: true,
    ...Object.fromEntries(["cervical", "dorsal", "lumbar"].flatMap((c) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [`${c}Din${i}`, i === 2 && c === "lumbar" ? "1" : "0"]))),
    ...Object.fromEntries(
      ["hombroDerecho", "hombroIzquierdo", "codoDerecho", "codoIzquierdo", "munecaDerecha", "munecaIzquierda", "manosDerechas", "manosIzquierdas"]
        .flatMap((k) => ["abduccion", "aduccion", "flexion", "extension", "rotacionExterna", "rotacionInterna", "irradiacion", "altMasaMuscular"].map((mv) => [`${k}_${mv}`, "0"]))
    ),
    hallazgoGrado0: "Sin hallazgos", hallazgoGrado1: "Contractura lumbar leve", hallazgoGrado2: "", hallazgoGrado3: "", hallazgoGrado4: "",
    valoracion: "apto",
  },

  digitalizacion: [
    { nombreDigitalizacion: "FIRMAP", url: firmaDePrueba() },
    { nombreDigitalizacion: "HUELLA", url: huellaDePrueba() },
    { nombreDigitalizacion: "SELLOFIRMA", url: selloDePrueba("Dra. Ana Torres Rojas", "012345") },
  ],
});

export default function EvaluacionMusculoEsqueleticaMarsaPrueba() {
  return (
    <VisorPdfPrueba
      titulo="Evaluación Músculo Esquelética 2021 - MARSA"
      generar={(doc) => EvaluacionMuscoloEsqueletica2021_Marsa(datosPrueba(), doc)}
    />
  );
}
