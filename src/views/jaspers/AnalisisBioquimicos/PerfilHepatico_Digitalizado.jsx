// src/views/jaspers/AnalisisBioquimicos/PerfilHepatico_Digitalizado.jsx
import jsPDF from "jspdf";
import headerPerfilHepatico from "./Header/headerPerfilHepatico";
import footer from "../components/footer";

export default function PerfilHepatico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER ===
  headerPerfilHepatico(doc, datos);

  // === CUERPO: más abajo y con márgenes laterales ampliados ===
  let y = 80;                        // iniciamos más abajo
  const xLeft = margin * 2;          // margen izquierdo 30mm
  const xMid = pageW / 2;            // columna central
  const tableX = margin * 2;         // inicio de tabla
  const tableW = pageW - margin * 4; // ancho de tabla reducido
  const xRight = tableX + tableW;    // fin de tabla

  // Título
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
  y += 10;

  // Muestra y perfil
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text(`MUESTRA: ${datos.muestra || "SUERO"}`, xLeft, y);
  y += 7;
  doc.text("PERFIL HEPÁTICO", xLeft, y);
  y += 10;

  // Encabezado de tabla
  doc.setFont("helvetica", "bold");
  doc.text("PRUEBA", tableX, y);
  doc.text("RESULTADO", xMid, y, { align: "center" });
  doc.text("RANGO REFERENCIAL", xRight, y, { align: "right" });
  y += 4;
  doc.setLineWidth(0.5);
  doc.line(tableX, y, tableX + tableW, y);
  y += 6;

  // Definición de pruebas
  const tests = [
    { label: "TGO", key: "tgo", ref: "Hasta 31 U/L" },
    {
      label: "TGP",
      key: "tgp",
      ref: [
        { text: "Hombres  Hasta 40 U/L" },
        { text: "Mujeres  Hasta 35 U/L" },
      ],
    },
    {
      label: "GGT",
      key: "ggt",
      ref: [
        { text: "Hombres  10 - 50 U/L" },
        { text: "Mujeres  8 - 35 U/L" },
      ],
    },
    { label: "FOSFATASA ALCALINA", key: "fosfatasa", ref: "Hasta 300 U/L" },
    { label: "BILIRRUBINA TOTAL", key: "bilirrubina_total", ref: "0.2 - 1.20 mg/dL" },
    { label: "BILIRRUBINA INDIRECTA", key: "bilirrubina_indirecta", ref: "0.1 - 1 mg/dL" },
    { label: "BILIRRUBINA DIRECTA", key: "bilirrubina_directa", ref: "Hasta 0.25 mg/dL" },
    { label: "PROTEÍNAS TOTALES", key: "proteinas", ref: "6.6 - 8.3 g/dL" },
    { label: "ALBÚMINA", key: "albumina", ref: "3.5 - 5.5 g/dL" },
    { label: "GLOBULINA SÉRICA", key: "globulina", ref: "2.3 - 3.5 g/dL" },
  ];

  doc.setFont("helvetica", "normal").setFontSize(11);

  tests.forEach(t => {
    // columna prueba y resultado
    doc.text(t.label, tableX, y);
    doc.text(`${datos[t.key] ?? ""}`, xMid, y, { align: "center" });

    // columna rango
    if (typeof t.ref === "string") {
      doc.text(t.ref, xRight, y, { align: "right" });
      y += 7;
    } else {
      // array de líneas
      t.ref.forEach(r => {
        doc.text(r.text, xRight, y, { align: "right" });
        y += 7;
      });
    }
  });

  // === FOOTER ===
  footer(doc, datos);

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl  = URL.createObjectURL(pdfBlob);
  const iframe  = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
