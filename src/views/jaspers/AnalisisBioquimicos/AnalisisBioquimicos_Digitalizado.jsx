// src/views/jaspers/AnalisisBioquimicos/AnalisisBioquimicos_Digitalizado.jsx
import jsPDF from "jspdf";
import headerAnalisisBioquimicos from "./Header/headerAnalisisBioquimicos";
import footer from "../components/footer";

export default function AnalisisBioquimicos_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ==== HEADER ====
  headerAnalisisBioquimicos(doc, datos);

  // ==== TÍTULOS ====
  let y = 50;  // <-- antes era 40, ahora bajamos todo 10 mm más
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text("LABORATORIO CLÍNICO", pageW / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(14);
  doc.text("ANÁLISIS BIOQUÍMICOS", pageW / 2, y, { align: "center" });
  const titleW = doc.getTextWidth("ANÁLISIS BIOQUÍMICOS");
  doc.setLineWidth(0.5);
  doc.line((pageW - titleW) / 2, y + 1.5, (pageW + titleW) / 2, y + 1.5);
  y += 12;

  // ==== TABLA ====
  const tests = [
    { label: "CREATININA", key: "creatinina", range: "(V.N. 0.8 - 1.4 mg/dl)" },
    { label: "COLESTEROL TOTAL", key: "colesterol_total", range: "(V.N. < 200 mg/dl)" },
    { label: "L.D.L. COLESTEROL", key: "ldl", range: "(V.N. < 129 mg/dl)" },
    { label: "H.D.L. COLESTEROL", key: "hdl", range: "(V.N. 40 - 60 mg/dl)" },
    { label: "V.L.D.L. COLESTEROL", key: "vldl", range: "(V.N. < 30 mg/dl)" },
    { label: "TRIGLICÉRIDOS", key: "trigliceridos", range: "(V.N. < 150 mg/dl)" },
  ];
  const tableW = pageW - margin * 4;
  const tableX = (pageW - tableW) / 2;
  const rowH = 8;
  const totalRows = 2 + tests.length; 
  const tableH = totalRows * rowH;

  // contorno
  doc.setLineWidth(0.3);
  doc.roundedRect(tableX, y, tableW, tableH, 2, 2);
  // líneas horizontales delgadas
  for (let i = 1; i <= totalRows; i++) {
    const yy = y + i * rowH;
    doc.line(tableX, yy, tableX + tableW, yy);
  }

  // contenido de la tabla
  doc.setFontSize(11);
  let textY = y + rowH - 2;
  // Paciente
  doc.setFont("helvetica", "bold").text("PACIENTE", tableX + 2, textY);
  doc.text(":", tableX + 40, textY);
  doc.setFont("helvetica", "normal").text(datos.nombre || "", tableX + 44, textY);
  // Fecha
  textY += rowH;
  doc.setFont("helvetica", "bold").text("FECHA", tableX + 2, textY);
  doc.text(":", tableX + 40, textY);
  doc.setFont("helvetica", "normal").text(datos.fecha || "", tableX + 44, textY);

  // Tests
  let currentY = y + rowH * 2 - 2;
  tests.forEach(({ label, key, range }) => {
    currentY += rowH;
    doc.setFont("helvetica", "bold").text(label, tableX + 2, currentY);
    doc.text(":", tableX + 40, currentY);
    doc.setFont("helvetica", "normal")
       .text(datos[key] != null ? String(datos[key]) : "-", tableX + tableW * 0.45, currentY, { align: "left" });
    doc.text(range, tableX + tableW - 2, currentY, { align: "right" });
  });

  // ==== FIRMA ====
  const sigW = 70, sigH = 30, sigX = tableX, sigY = y + tableH + 10;
  doc.setLineWidth(0.3).roundedRect(sigX, sigY, sigW, sigH, 2, 2);
  doc.setFont("helvetica", "italic").setFontSize(12)
     .text("V° B°", sigX + sigW/2, sigY + sigH/2, { align: "center", baseline: "middle" });

  // ==== FOOTER ====
  footer(doc, datos);

  // ==== IMPRIMIR ====
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => { iframe.contentWindow.focus(); iframe.contentWindow.print(); };
}
