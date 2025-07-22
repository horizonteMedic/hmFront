import jsPDF from "jspdf";
import header_OftalmologiaLO from "./headers/header_OftalmologiaLO.jsx";

function drawOftalmoLOBody(doc, datos = {}) {
  const margin = 10;
  let y = 60;
  const pageW = doc.internal.pageSize.getWidth();
  // Caja principal
  const boxH = 110;
  doc.setLineWidth(0.7);
  doc.rect(margin, y, pageW - 2 * margin, boxH);
  doc.setLineWidth(0.2);

  // Encabezados
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SIN CORREGIR", margin + 60, y + 12, { align: "center" });
  doc.text("CORREGIDA", margin + 140, y + 12, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("O.D", margin + 45, y + 20, { align: "center" });
  doc.text("O.I", margin + 75, y + 20, { align: "center" });
  doc.text("O.D", margin + 125, y + 20, { align: "center" });
  doc.text("O.I", margin + 155, y + 20, { align: "center" });

  // Cuadros pequeños para valores
  const boxW = 14, boxH2 = 9;
  // Centrado de bloques
  // SIN CORREGIR (izquierda)
  const xSinCorregir = margin + 40;
  // CORREGIDA (derecha)
  const xCorregida = margin + 120;

  // Visión de Cerca
  doc.text("Visión de Cerca :", margin + 5, y + 32);
  doc.rect(xSinCorregir, y + 25, boxW, boxH2);
  doc.text(`${datos.cercaOD || '10'}`, xSinCorregir + boxW / 2, y + 32, { align: "center" });
  doc.rect(xSinCorregir + 28, y + 25, boxW, boxH2);
  doc.text(`${datos.cercaOI || '10'}`, xSinCorregir + 28 + boxW / 2, y + 32, { align: "center" });
  doc.rect(xCorregida, y + 25, boxW, boxH2);
  doc.text(`${datos.cercaODCorregida || '10'}`, xCorregida + boxW / 2, y + 32, { align: "center" });
  doc.rect(xCorregida + 28, y + 25, boxW, boxH2);
  doc.text(`${datos.cercaOICorregida || '10'}`, xCorregida + 28 + boxW / 2, y + 32, { align: "center" });

  // Visión de Lejos
  doc.text("Visión de Lejos :", margin + 5, y + 48);
  doc.rect(xSinCorregir, y + 41, boxW, boxH2);
  doc.text(`${datos.lejosOD || '10'}`, xSinCorregir + boxW / 2, y + 48, { align: "center" });
  doc.rect(xSinCorregir + 28, y + 41, boxW, boxH2);
  doc.text(`${datos.lejosOI || '10'}`, xSinCorregir + 28 + boxW / 2, y + 48, { align: "center" });
  doc.rect(xCorregida, y + 41, boxW, boxH2);
  doc.text(`${datos.lejosODCorregida || '10'}`, xCorregida + boxW / 2, y + 48, { align: "center" });
  doc.rect(xCorregida + 28, y + 41, boxW, boxH2);
  doc.text(`${datos.lejosOICorregida || '10'}`, xCorregida + 28 + boxW / 2, y + 48, { align: "center" });

  // Datos en lista alineados a la izquierda
  let yList = y + 62;
  const xLabel = margin + 5;
  const xValue = margin + 60;
  doc.text("Visión de Colores :", xLabel, yList);
  doc.text(`${datos.colores || 'NORMAL'}`, xValue, yList);
  yList += 8;
  doc.text("Visión Binocular :", xLabel, yList);
  doc.text(`${datos.binocular || '10'}`, xValue, yList);
  yList += 8;
  doc.text("Reflejos Pupilares :", xLabel, yList);
  doc.text(`${datos.reflejos || 'CONSERVADO'}`, xValue, yList);
  yList += 8;
  doc.text("Enfermedades Oculares :", xLabel, yList);
  doc.text(`${datos.enfermedades || 'NINGUNA'}`, xValue, yList);
  yList += 8;
  // Observación justo debajo de Enfermedades Oculares
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`${datos.observacion || 'PTERIGIÓN OJO IZQUIERDO.'}`, xValue, yList);
}

export default function OftalmologiaLO(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  header_OftalmologiaLO(doc, datos);
  drawOftalmoLOBody(doc, datos);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 