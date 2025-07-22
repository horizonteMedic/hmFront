import jsPDF from "jspdf";
import header_Oftalmologia from "./headers/header_Oftalmologia.jsx";

function drawOftalmoBody(doc, datos = {}) {
  const margin = 10;
  let y = 60;
  const pageW = doc.internal.pageSize.getWidth();
  // Datos personales
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`Nombres :  ${datos.nombres || 'JOSUE SPENCER ROJAS SIGUENZA'}`, margin, y);
  doc.text(`Edad:  ${datos.edad || 'EEE'}  años`, pageW / 2, y, { align: "center" });
  doc.text(`Fecha :  ${datos.fecha || 'martes 01 julio 2025'}`, pageW - margin, y, { align: "right" });
  y += 8;
  // Caja principal
  const boxH = 70;
  doc.setLineWidth(0.7);
  doc.rect(margin, y, pageW - 2 * margin, boxH);
  doc.setLineWidth(0.2);
  // Encabezados de la caja
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SIN CORREGIR", margin + 60, y + 10, { align: "center" });
  doc.text("CORREGIDA", margin + 140, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("O.D", margin + 45, y + 18, { align: "center" });
  doc.text("O.I", margin + 75, y + 18, { align: "center" });
  doc.text("O.D", margin + 125, y + 18, { align: "center" });
  doc.text("O.I", margin + 155, y + 18, { align: "center" });
  // Visión de cerca
  doc.text("Visión de Cerca :", margin + 5, y + 28);
  doc.rect(margin + 40, y + 22, 18, 12);
  doc.text(`${datos.cercaOD || '10'}`, margin + 49, y + 30, { align: "center" });
  doc.rect(margin + 70, y + 22, 18, 12);
  doc.text(`${datos.cercaOI || '10'}`, margin + 79, y + 30, { align: "center" });
  doc.rect(margin + 120, y + 22, 18, 12);
  doc.text(`${datos.cercaODCorregida || '10'}`, margin + 129, y + 30, { align: "center" });
  doc.rect(margin + 150, y + 22, 18, 12);
  doc.text(`${datos.cercaOICorregida || '10'}`, margin + 159, y + 30, { align: "center" });
  // Visión de lejos
  doc.text("Visión de Lejos :", margin + 5, y + 48);
  doc.rect(margin + 40, y + 42, 18, 12);
  doc.text(`${datos.lejosOD || '10'}`, margin + 49, y + 50, { align: "center" });
  doc.rect(margin + 70, y + 42, 18, 12);
  doc.text(`${datos.lejosOI || '10'}`, margin + 79, y + 50, { align: "center" });
  doc.rect(margin + 120, y + 42, 18, 12);
  doc.text(`${datos.lejosODCorregida || '10'}`, margin + 129, y + 50, { align: "center" });
  doc.rect(margin + 150, y + 42, 18, 12);
  doc.text(`${datos.lejosOICorregida || '10'}`, margin + 159, y + 50, { align: "center" });
  // Visión de colores
  doc.text("Visión de Colores :", margin + 5, y + 65);
  doc.text(`${datos.colores || 'NORMAL'}`, margin + 49, y + 65);
  // Visión binocular
  doc.text("Visión Binocular :", margin + 5, y + 75);
  doc.text(`${datos.binocular || '10'}`, margin + 49, y + 75);
  // Reflejos pupilares
  doc.text("Reflejos Pupilares :", margin + 80, y + 65);
  doc.text(`${datos.reflejos || 'CONSERVADO'}`, margin + 130, y + 65);
  // Enfermedades oculares
  doc.text("Enfermedades Oculares :", margin + 80, y + 75);
  doc.text(`${datos.enfermedades || 'NINGUNA'}`, margin + 130, y + 75);
  // Observación extra
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`${datos.observacion || 'PTERIGIÓN OJO IZQUIERDO.'}`, margin + 80, y + 85);
}

export default function Oftalmologia(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  header_Oftalmologia(doc, datos);
  drawOftalmoBody(doc, datos);
  return doc;
} 