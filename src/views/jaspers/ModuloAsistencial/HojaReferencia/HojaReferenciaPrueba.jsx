import HojaReferencia from "./HojaReferencia.jsx";
import { VisorPdfPrueba, selloDePrueba } from "../pruebaJasper.jsx";

// Simulador de la "Hoja de Referencia" para la ruta /fichapi: genera el PDF con datos de prueba y lo
// muestra en la misma página. El sello del médico es un dibujo generado al vuelo.

export const datosPrueba = () => ({
  numeroTicket: "1234",
  numeroHistoriaClinica: "50987",
  sede: "Huamachuco",
  fecha: "2026-09-11",
  codigoColor: "#008f39",
  textoColor: "F",

  fechaReferencia: "2026-09-11",
  numeroReferencia: "0001",
  establecimientoOrigen: "CENTRO MEDICO LA ARENA",
  establecimientoDestino: "HOSPITAL PRIMAVERA",
  areaAtencionDestino: "APOYO DIAGNOSTICO / CONSULTA EXTERNA",

  apellidoPaterno: "RAMÍREZ",
  apellidoMaterno: "TORRES",
  nombres: "LUIS ALBERTO",
  direccion: "HUAMACHUCO",
  celular: "900000000",
  sexo: "M",
  edad: "42",
  empresa: "LA ARENA",
  numeroCitaSgss: "",
  codigoTrabajador: "",

  resumenClinico:
    "TRABAJADOR ACUDE A TOPICO POR PRESENTAR DOLOR DE INTENSIDAD MODERADA TIPO ARDOR EN HEMICARA DERECHA, PRURITO Y HORMIGUEO",
  temperatura: "36.3",
  presionArterial: "117/88",
  frecuenciaCardiaca: "91",
  frecuenciaRespiratoria: "20",
  saturacionOxigeno: "92",
  fio2: "0.21",
  msnm: "3300",
  examenFisico: ["GENERAL: AREG, AREN, AREH.", "PIEL: EVIDENCIA DE VESICULAS EN CARA Y COMISURA LABIAL SUPERIOR"],
  diagnosticos: [{ descripcion: "INFECCION DEBIDA AL VIRUS DEL HERPES", cie10: "B00" }],
  tratamiento: ["CLORFENAMINA+DEXAMETASONA IM STAT", "ACICLOVIR C/4HRS"],

  motivoReferencia: "MANEJO ESPECIALIZADO",
  especialidad: "INFECTOLOGIA",
  condicion: "ESTABLE",
  relacionPertenencias: "",
  autoridadTraslado: "DRA. ANA TORRES ROJAS",
  personaRecibe: "",
  fechaHoraRecepcion: "2026-09-11",
  datosResponsableTraslado: "-",
  condicionLlegada: "ESTABLE",

  digitalizacion: [{ nombreDigitalizacion: "SELLOFIRMA", url: selloDePrueba("Dra. Ana Torres Rojas", "012345") }],
});

export default function HojaReferenciaPrueba() {
  return <VisorPdfPrueba titulo="Hoja de Referencia" generar={(doc) => HojaReferencia(datosPrueba(), doc)} />;
}
