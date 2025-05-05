import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";

export default function TestAltura(datos) {
  const doc = new jsPDF();
  // componente header
  headerHR(doc, datos);

  // Encabezado
  doc.setFontSize(8);
  const leftspace = 10;
  const headspace = 60;
  const drawLine = (x1, y1, x2, y2) => {
    doc.line(x1, y1, x2, y2);
  };

  // 🟡 Dibujar cuadros del organigrama
  drawBox(doc, "ADMISION", 90, 65, 30, 10, 4, datos.orden);
  drawLine(105, 75, 105, 80);
  drawBox(doc, "TRIAJE", 90, 80, 30, 10, 4, datos.triaje);
  drawLine(105, 90, 105, 95);

  drawC(doc, "LABORATORIO\n(HTO-HB)", leftspace, headspace + 35, 25, 10, datos.laboratorio);
  drawC(doc, "A. VISUAL", leftspace + 28, headspace + 35, 30, 10, datos.oftalmologia);
  drawC(doc, "EKG ( > 40 años )", leftspace + 61, headspace + 35, 25, 10, datos.electrocardiograma);
  drawC(doc, "PSICOLOGIA", leftspace + 90, headspace + 35, 20, 10, datos.psicologia);
  drawC(doc, "PSICOSENSOMETRICO\nPARA ALTURA", leftspace + 120, headspace + 35, 35, 10, datos.psicosen);
  drawC(doc, "AUDIOMETRIA", leftspace + 160, headspace + 35, 25, 10, datos.audiologia);

  drawLine(leftspace + 25, headspace + 40, leftspace + 28, headspace + 40);
  drawLine(leftspace + 58, headspace + 40, leftspace + 61, headspace + 40);
  drawLine(leftspace + 86, headspace + 40, leftspace + 90, headspace + 40);
  drawLine(leftspace + 110, headspace + 40, leftspace + 120, headspace + 40);

  // 🟡 Evaluación Médica y Audiometría
  drawLine(leftspace + 15, headspace + 45, leftspace + 15, headspace + 50);
  drawLine(leftspace + 40, headspace + 45, leftspace + 40, headspace + 50);
  drawLine(leftspace + 70, headspace + 45, leftspace + 70, headspace + 50);
  drawLine(leftspace + 100, headspace + 45, leftspace + 100, headspace + 50);
  drawLine(leftspace + 130, headspace + 45, leftspace + 130, headspace + 50);

  drawLine(leftspace + 15, headspace + 50, leftspace + 130, headspace + 50);

  drawC(doc, "EVALUACIÓN MEDICA", leftspace + 60, headspace + 55, 33, 10, datos.anexo7c);
  drawLine(leftspace + 70, headspace + 50, leftspace + 70, headspace + 55);

  // 🟡 BLOQUE DE INDICACIONES debajo del mapa
  const indX = leftspace;
  const indY = headspace + 70;  // baja unas líneas bajo el mapa
  const maxW = 180;             // ancho máximo para el texto
  doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(200, 0, 0)
     .text("INDICACIONES:", indX, indY);
  doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(0, 0, 0);
  let cursor = indY + 4;
  [
    "• Si ud. es conductor y/o operador dejar copia a color de DNI y licencia de conducir.",
    "• Si ud. no es conductor dejar copia a color de su DNI.",
    "• Si ud. va a examen psicosensométrico para conducir dejar copia a color de su DNI."
  ].forEach(lineText => {
    const lines = doc.splitTextToSize(lineText, maxW);
    doc.text(lines, indX, cursor);
    cursor += lines.length * 3.5;
  });

  // footer e impresión
  footer(doc, datos);
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
