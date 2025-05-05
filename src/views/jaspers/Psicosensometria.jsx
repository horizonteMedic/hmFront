import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";

export default function Psicosensometria(datos) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  headerHR(doc, datos);

  // Fuente y estilos
  doc.setFont("helvetica", "normal").setFontSize(9);
  const leftspace = 10;
  const headspace = 60;            // posición del bloque de indicaciones
  const mapOffset = 30;            // desplazamiento extra para bajar el mapa
  const drawLine = (x1, y1, x2, y2) => doc.line(x1, y1, x2, y2);

  // 1) Bloque • INDICACIONES (sin espacio extra abajo)
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 10;
  const indX    = margin + (pageW - 2 * margin) * 0.6;
  const indY    = headspace;
  const indW    = pageW - margin - indX;
  const indH    = 35;
  doc.setFillColor(245, 245, 245)
     .roundedRect(indX, indY, indW, indH, 2, 2, "F")
     .setFont("helvetica","bold").setFontSize(8).setTextColor(200,0,0)
     .text("INDICACIONES:", indX + 2, indY + 7)
     .setFont("helvetica","normal").setFontSize(8).setTextColor(0,0,0);
  let cursorY = indY + 11;
  [
    "Si ud. es conductor y/o operador dejar copia a color de DNI y licencia de conducir.",
    "Si ud. no es conductor dejar copia a color de su DNI.",
    "Si ud. va a examen psicosensométrico para conducir dejar copia a color de su DNI."
  ].forEach(txt => {
    const lines = doc.splitTextToSize("• " + txt, indW - 4);
    doc.text(lines, indX + 3, cursorY);
    cursorY += lines.length * 3.5;
  });

  // 2) Óvalos ADMISION → TRIAJE (mapa desplazado abajo)
  const oY = headspace + mapOffset;
  drawBox(doc, "ADMISION", 90, oY,     30, 10, 4, datos.orden);
  drawBox(doc, "TRIAJE",   90, oY + 15,30, 10, 4, datos.triaje);
  drawLine(105, oY + 10, 105, oY + 15);

  // 3) Fila de recuadros
  const rowY = oY + 35;
  const boxH = 10;
  drawBox(doc, "GRUPO SANGUINEO",   leftspace,        rowY,   40, boxH, 4, datos.laboratorio);
  drawBox(doc, "PSICOSENSOMETRIA",  leftspace + 45,   rowY,   50, boxH, 4, datos.psicosen);
  drawBox(doc, "TEST DE ALTURA",    leftspace + 100,  rowY,   40, boxH, 4, datos.examen === "ALTURA");
  drawBox(doc, "A. VISUAL",         leftspace + 150,  rowY,   30, boxH, 4, datos.oftalmologia);

  // 4) Líneas de unión Triaje → recuadros
  drawLine(105, oY + 25, 105, rowY - 5);
  [35, 80, 145, 180].forEach(x => drawLine(105, rowY - 5, x, rowY - 5));
  [35, 80, 130, 180].forEach(x => drawLine(x, rowY - 5, x, rowY));

  // 5) Unión Psicosensometría ↔ Test de Altura → Evaluación Médica
  const psiX   = leftspace + 45  + 25;
  const tstX   = leftspace + 100 + 20;
  const bottomY= rowY + boxH;
  const barY   = bottomY + 5;
  const evalY  = barY + 5;
  drawLine(psiX, bottomY, psiX, barY);
  drawLine(tstX, bottomY, tstX, barY);
  drawLine(psiX, barY, tstX, barY);
  const midX   = (psiX + tstX) / 2;
  drawLine(midX, barY, midX, evalY);

  // 6) Recuadros finales (Evaluación y Audiometría)
  drawBox(doc, "EVALUACIÓN MEDICA", leftspace + 60, evalY,   50, boxH, 4, datos.anexo7c);
  drawBox(doc, "AUDIOMETRIA",      leftspace + 150, evalY,   30, boxH, 4, datos.audiologia);

  // 7) Footer e impresión
  footer(doc);
  const blob   = doc.output("blob");
  const url    = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
