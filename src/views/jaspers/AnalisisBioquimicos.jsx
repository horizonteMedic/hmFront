import React from "react";
import jsPDF from "jspdf";
import header from "./components/header";
import footer from "./components/footer";

export default function AnalisisBioquimicos(datos) {
  const doc = new jsPDF();

  // Header
  header(doc);

  // --- Offset para bajar el contenido ---
  const offsetY = 25;

  // --- Título grande y en mayúsculas ---
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text("LABORATORIO CLÍNICO", 105, 38 + offsetY, { align: "center" });
  doc.setFontSize(14);
  doc.text("ANÁLISIS BIOQUÍMICOS", 105, 45 + offsetY, { align: "center" });

  // --- Labels de orden y fecha en negrita ---
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`N° Orden :`, 155, 32 + offsetY);
  doc.text(`Fecha :`, 155, 38 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.n_orden || ''}`, 180, 32 + offsetY, { align: "right" });
  doc.text(`${datos.fecha_ab || ''}`, 180, 38 + offsetY, { align: "right" });

  // --- Datos principales en negrita ---
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`Nombres :`, 20, 55 + offsetY);
  doc.text(`Sede :`, 140, 55 + offsetY);
  doc.setFont(undefined, 'normal');
  doc.text(`${datos.nombres || ''}`, 45, 55 + offsetY);
  doc.text(`${datos.nombre_sede || ''}`, 165, 55 + offsetY);

  // Tabla de resultados
  const startY = 65 + offsetY;
  const table = [
    { label: "CREATININA", value: datos.creatinina, ref: "(V.N. 0.8 - 1.4 mg/dl)" },
    { label: "COLESTEROL TOTAL", value: datos.colesterol_total, ref: "(V.N. < 200 mg/dl)" },
    { label: "L.D.L. COLESTEROL", value: datos.ldl, ref: "(V.N. < 129 mg/dl)" },
    { label: "H.D.L. COLESTEROL", value: datos.hdl, ref: "(V.N. 40 - 60 mg/dl)" },
    { label: "V.L.D.L. COLESTEROL", value: datos.vldl, ref: "(V.N. < 30 mg/dl)" },
    { label: "TRIGLICÉRIDOS", value: datos.trigliceridos, ref: "(V.N. < 150 mg/dl)" },
  ];

  doc.setLineWidth(0.3);
  doc.roundedRect(20, startY, 170, table.length * 10 + 4, 3, 3);

  let currentY = startY + 8;
  table.forEach((row, index) => {
    doc.setFont(undefined, 'bold');
    doc.text(row.label, 25, currentY);
    doc.setFont(undefined, 'normal');
    doc.text(`: ${row.value || ''}`, 80, currentY);
    doc.setFontSize(9);
    doc.text(row.ref, 130, currentY);
    doc.setFontSize(10);
    
    if (index < table.length - 1) {
      doc.line(22, currentY + 2, 188, currentY + 2);
    }
    currentY += 10;
  });

  // Footer
  footer(doc, datos);

  // Mostrar PDF
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 