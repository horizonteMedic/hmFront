import jsPDF from "jspdf";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";
import footer from "./components/footer";

export default function TestAltura(datos) {
  // 1) Inicializar PDF (A4 en mm)
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // 2) Header
  headerHR(doc, datos);

  // 3) Fuente y helper para líneas
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(0, 0, 0);
  const leftspace = 10;
  const headspace = 60;
  const line = (x1, y1, x2, y2) => doc.line(x1, y1, x2, y2);

  // 4) Óvalos ADMISION → TRIAJE
  const admX      = leftspace + 80;
  const admY      = headspace;
  const ovalW     = 30;
  const ovalH     = 10;
  drawBox(doc, "ADMISION", admX, admY, ovalW, ovalH, 4, datos.orden);
  drawBox(doc, "TRIAJE",   admX, admY + 15, ovalW, ovalH, 4, datos.triaje);

  // — Línea ADMISION → TRIAJE
  const centerX      = admX + ovalW / 2;
  const admBottomY  = admY + ovalH;
  const triTopY      = admY + 15;
  line(centerX, admBottomY, centerX, triTopY);

  // 5) Línea vertical de TRIAJE hacia los recuadros (sin conectar a EKG)
  const triBottomY = admY + 15 + ovalH;
  const rowY       = headspace + 35;
  line(centerX, triBottomY, centerX, rowY);
  // 6) Fila de recuadros
  drawC(doc, "LABORATORIO\n(HTO-HB)",     leftspace,      rowY, 25, 10, datos.laboratorio);
  drawC(doc, "A. VISUAL",                 leftspace + 28, rowY, 30, 10, datos.oftalmologia);
  drawC(doc, "EKG (> 40 años)",           leftspace + 61, rowY, 25, 10, datos.electrocardiograma);
  drawC(doc, "PSICOLOGIA",                leftspace + 90, rowY, 20, 10, datos.psicologia);
  drawC(doc, "PSICOSENSOMETRICO\nPARA ALTURA", leftspace + 120, rowY, 35, 10, !datos.psicosen);
  drawC(doc, "AUDIOMETRIA",               leftspace + 160, rowY, 25, 10, datos.audiologia);

  // Conexiones horizontales entre recuadros
  [
    [leftspace + 25,  leftspace + 28],
    [leftspace + 58,  leftspace + 61],
    [leftspace + 86,  leftspace + 90],
    [leftspace + 110, leftspace + 120],
  ].forEach(([xs, xt]) => {
    line(xs, rowY + 5, xt, rowY + 5);
  });

  // 7) Conexiones a EVALUACIÓN MÉDICA
  [15, 40, 70, 100, 130].forEach(xOffset =>
    line(leftspace + xOffset, rowY + 10, leftspace + xOffset, rowY + 15)
  );
  line(leftspace + 15, rowY + 15, leftspace + 130, rowY + 15);

  // Recuadro EVALUACIÓN MÉDICA
  drawC(doc, "EVALUACIÓN MÉDICA", leftspace + 60, rowY + 20, 33, 10, datos.anexo7c);
  line(leftspace + 70, rowY + 15, leftspace + 70, rowY + 20);

  // 8) Bloque “INDICACIONES” a la derecha
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 10;
  const indX    = margin + (pageW - 2 * margin) * 0.6;
  const indY    = headspace - 5;
  const indW    = pageW - margin - indX;
  const indH    = 35;

  doc.setFillColor(245, 245, 245)
     .roundedRect(indX, indY, indW, indH, 2, 2, "F")
     .setFont("helvetica", "bold")
     .setFontSize(8)
     .setTextColor(200, 0, 0)
     .text("INDICACIONES:", indX + 2, indY + 7)
     .setFont("helvetica", "normal")
     .setFontSize(8)
     .setTextColor(0, 0, 0);

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

  // 9) Footer e impresión
  footer(doc,datos);

  const blob   = doc.output("blob");
  const url    = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
