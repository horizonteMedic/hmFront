import jsPDF from "jspdf";
import headerFicha from "./headers/header_FichaAudiologica_Digitalizado.jsx";

/**
 * Genera y muestra la FICHA AUDIOLÓGICA (maqueta, sin datos)
 * Imprime automáticamente al cargar, sin botones.
 */
export default function FichaAudiologica_Digitalizado(datos = {}) {
  const doc = new jsPDF();
  const margin = 12;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 48; // después del header

  // 1) Header
  headerFicha(doc, datos);

  // 2) Maqueta del cuerpo (simulación de secciones, sin datos)
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text("FICHA AUDIOLÓGICA DIGITALIZADA", pageW / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal").setFontSize(11);
  // Simular secciones principales
  const sections = [
    "I. DATOS DEL PACIENTE",
    "II. ANTECEDENTES AUDIOLÓGICOS",
    "III. EXAMEN AUDIOMÉTRICO",
    "IV. INTERPRETACIÓN Y CONCLUSIONES",
    "V. FIRMA Y SELLO"
  ];
  sections.forEach((title, i) => {
    doc.setFont("helvetica", "bold").text(title, margin, y);
    y += 8;
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("[Contenido de maqueta]", margin + 6, y);
    y += 14;
  });

  // 3) Footer opcional (no incluido por ahora)

  // 4) Imprimir automáticamente
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
