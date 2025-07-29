import jsPDF from "jspdf";
import header_EvaluacionOftalmologica2021_Digitalizado_ohla from "./headers/header_EvaluacionOftalmologica2021_Digitalizado_ohla.jsx";

/**
 * Genera el reporte de Evaluación Oftalmológica 2021 Digitalizado OHLA
 * @param {object} datos - Datos del paciente y evaluación
 */
export default function EvaluacionOftalmologica2021_Digitalizado_ohla(datos = {}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 8;

  // Agregar header
  header_EvaluacionOftalmologica2021_Digitalizado_ohla(doc, datos);

  // Agregar frame de evaluación oftalmológica
  try {
    const frameY = 60; // Posición después del header
    const frameW = pageW - (margin * 2);
    const frameH = pageH - frameY - margin;
    
    doc.addImage(
      "./frames/Frame_EvaluacionOftalmologica2021_Digitalizado_ohla.png",
      "PNG",
      margin,
      frameY,
      frameW,
      frameH
    );
  } catch (error) {
    console.error("Error al cargar el frame:", error);
    // Fallback: mostrar mensaje de error
    doc.setFont("helvetica", "normal")
       .setFontSize(12)
       .setTextColor(255, 0, 0)
       .text("Error al cargar el frame de evaluación oftalmológica", margin, 80);
  }

  // Generar blob y abrir en iframe para imprimir automáticamente
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