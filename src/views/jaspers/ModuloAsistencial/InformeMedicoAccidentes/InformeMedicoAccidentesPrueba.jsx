import InformeMedicoAccidentes from "./InformeMedicoAccidentes.jsx";
import { VisorPdfPrueba, firmaDePrueba, huellaDePrueba, selloDePrueba } from "../pruebaJasper.jsx";

// Simulador del "Informe médico de accidentes" para la ruta /fichapi: genera el PDF con datos de prueba
// y lo muestra en la misma página. Las firmas, la huella y el sello son dibujos generados al vuelo.

export const datosPrueba = () => ({
  numeroTicket: "1234",
  numeroHistoriaClinica: "50987",
  sede: "Huamachuco",
  fecha: "2026-10-08",
  codigoColor: "#008f39",
  textoColor: "F",
  nombres: "JUAN CARLOS",
  apellidos: "PÉREZ GARCÍA",
  dni: "12345678",
  medico: "Ana Torres Rojas",
  cmp: "012345",
  diagnosticos: ["Contractura muscular en pantorrilla derecha"],
  tratamiento: [
    "Diclofenaco 75 mg + Dexametasona 4 mg IM x 3 d",
    "Fricción con diclofenaco gel 2 v/día",
    "Orfenadrina 100 mg tb. 1 v/día - (30 min antes de dormir)",
  ],
  circunstancias:
    "Fecha: 06/10/26. Me encontraba jugando fútbol en la loza deportiva del campamento, " +
    "alrededor de las 9:30 pm, y sentí un estirón en la pierna derecha, a la altura de la pantorrilla.",
  lugarFirma: "Unidad Médica",
  fechaFirma: "2026-10-08",
  digitalizacion: [
    { nombreDigitalizacion: "FIRMAP", url: firmaDePrueba() },
    { nombreDigitalizacion: "HUELLA", url: huellaDePrueba() },
    { nombreDigitalizacion: "SELLOFIRMA", url: selloDePrueba("Dra. Ana Torres Rojas", "012345") },
  ],
});

export default function InformeMedicoAccidentesPrueba() {
  return (
    <VisorPdfPrueba
      titulo="Informe médico de accidentes"
      generar={(doc) => InformeMedicoAccidentes(datosPrueba(), doc)}
    />
  );
}
