import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";

export default function LabClinico(datos) {
  const doc = new jsPDF();
  
  // componente header
  const finalY = headerHR(doc, datos);

  // Encabezado
  doc.setFontSize(8);
  const leftspace = 10;
  const headspace = finalY + 2;

  // Define the drawLine function
  const drawLine = (x1, y1, x2, y2) => {
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y2);
  };

  // 🟡 Dibujar cuadros del organigrama
  drawBox(doc, "ADMISION", 90, headspace + 5, 30, 10, 4, datos.orden);
  drawLine(105, headspace + 15, 105, headspace + 20);
  drawBox(doc, "TRIAJE", 90, headspace + 20, 30, 10, 4, datos.triaje);
  drawLine(105, headspace + 30, 105, headspace + 35);
  drawBox(doc, "PSICOLOGIA", 90, headspace + 35, 30, 10, 4, datos.psicologia);

  // 🟡 BLOQUE DE INDICACIONES al costado derecho
  const indX = 130;
  const indY = headspace + 5;  // Align with first box
  const indW = doc.internal.pageSize.getWidth() - indX - 10;
  doc.setFont("helvetica","bold").setFontSize(9).setTextColor(200, 0, 0);
  doc.text("INDICACIONES:", indX, indY);
  doc.setFont("helvetica","normal").setFontSize(9).setTextColor(0, 0, 0);
  let cursor = indY + 4;
  [
    "• Si ud. es conductor y/o operador dejar copia a color de DNI y licencia de conducir.",
    "• Si ud. no es conductor dejar copia a color de su DNI.",
    "• Si ud. va a examen psicosensométrico para conducir dejar copia a color de su DNI."
  ].forEach(txt => {
    const lines = doc.splitTextToSize(txt, indW);
    doc.text(lines, indX, cursor);
    cursor += lines.length * 3.5;
  });

  // footer e impresión
  footer(doc, datos);
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src     = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
