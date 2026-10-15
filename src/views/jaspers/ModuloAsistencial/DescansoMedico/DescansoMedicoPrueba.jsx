import DescansoMedico from "./DescansoMedico.jsx";
import { VisorPdfPrueba, selloDePrueba } from "../pruebaJasper.jsx";

// Simulador del "Descanso médico" para la ruta /fichapi: genera el PDF con datos de prueba y lo muestra
// en la misma página. El sello del médico es un dibujo generado al vuelo.

export const datosPrueba = () => ({
  numeroTicket: "1234",
  numeroHistoriaClinica: "50987",
  sede: "Huamachuco",
  fecha: "2026-09-08",
  codigoColor: "#008f39",
  textoColor: "F",

  nombres: "CARLOS ANDRÉS",
  apellidos: "MENDOZA QUISPE",
  dni: "12345678",
  empresa: "LA ARENA S.A.",
  area: "OPERACIONES MINA",
  cargo: "OPERADOR DE MOTONIVELADORA",

  diagnostico: "CRISIS HIPERTENSIVA",
  tipoEvento: "ENFERMEDAD COMÚN",
  fechaInicio: "2026-09-08",
  cantidadDias: 3,
  fechaFin: "2026-09-10",

  digitalizacion: [{ nombreDigitalizacion: "SELLOFIRMA", url: selloDePrueba("Dra. Ana Torres Rojas", "012345") }],
});

export default function DescansoMedicoPrueba() {
  return <VisorPdfPrueba titulo="Descanso médico" generar={(doc) => DescansoMedico(datosPrueba(), doc)} />;
}
