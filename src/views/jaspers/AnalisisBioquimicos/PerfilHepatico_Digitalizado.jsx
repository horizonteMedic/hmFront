// src/views/jaspers/AnalisisBioquimicos/PerfilHepatico_Digitalizado.jsx
import jsPDF from "jspdf";
import headerPerfilHepatico from "./Header/headerPerfilHepatico";
import footer from "../components/footer";

const config = {
  margin: 15,
  fontSize: {
    title: 14,
    subtitle: 11,
    header: 11,
    body: 10,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: 'helvetica',
};

const drawRow = (doc, y, test, datos, cols) => {
  doc.setFont(config.font, 'normal').setFontSize(config.fontSize.body);
  doc.text(test.label, cols.col1, y);
  
  const result = datos[test.key] != null ? String(datos[test.key]) : "0";
  doc.text(result, cols.col2, y, { align: "center" });

  if (typeof test.ref === "string") {
    doc.text(test.ref, cols.col3, y, { align: "right" });
    return y + config.lineHeight.normal;
  } else if (Array.isArray(test.ref)) {
    let tempY = y;
    test.ref.forEach((line, index) => {
      // Divide la línea en parte de etiqueta y parte de valor para alinearlas
      const parts = line.split(/(Hasta .*|10 - 50 U\/L|8 - 35 U\/L)/);
      const labelPart = parts[0] || '';
      const valuePart = parts[1] || '';
      const textRightAligned = labelPart.trim() + " " + valuePart.trim();

      doc.text(textRightAligned, cols.col3, tempY, { align: "right" });
      if (index < test.ref.length - 1) {
        tempY += config.lineHeight.small;
      }
    });
    // Devuelve la posición Y más baja alcanzada, más un pequeño espacio, 
    // o la altura de línea normal, lo que sea mayor, para evitar solapamientos.
    return Math.max(y + config.lineHeight.normal, tempY + config.lineHeight.small + 2);
  }
  return y + config.lineHeight.normal;
};

export default function PerfilHepatico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 70; // Posición inicial después del header

  headerPerfilHepatico(doc, datos);

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
  y += config.lineHeight.normal * 1.5;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
  doc.text(`MUESTRA: ${datos.muestra || "SUERO"}`, config.margin, y);
  y += config.lineHeight.normal;
  doc.text("PERFIL HEPÁTICO", config.margin, y);
  y += config.lineHeight.normal * 1.5;

  const tableCols = {
    col1: config.margin,
    col2: pageW / 2,
    col3: pageW - config.margin,
  };

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", tableCols.col1, y);
  doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
  doc.text("RANGO REFERENCIAL", tableCols.col3, y, { align: "right" });
  y += 3;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight.normal;

  const tests = [
    { label: "TGO", key: "tgo", ref: "Hasta 31 U/L" },
    { label: "TGP", key: "tgp", ref: ["Hombres  Hasta 40 U/L", "Mujeres  Hasta 35 U/L"] },
    { label: "GGT", key: "ggt", ref: ["Hombres  10 - 50 U/L", "Mujeres  8 - 35 U/L"] },
    { label: "FOSFATASA ALCALINA", key: "fosfAlc", ref: "Hasta 300 U/L" },
    { label: "BILIRRUBINA TOTAL", key: "biliTotal", ref: "0.2 - 1.20 mg/dL" },
    { label: "BILIRRUBINA INDIRECTA", key: "biliInd", ref: "0.1 - 1 mg/dL" },
    { label: "BILIRRUBINA DIRECTA", key: "biliDir", ref: "Hasta 0.25 mg/dL" },
    { label: "PROTEÍNAS TOTALES", key: "protTot", ref: "6.6 - 8.3 g/dL" },
    { label: "ALBÚMINA", key: "albumina", ref: "3.5 - 5.5 g/dL" },
    { label: "GLOBULINA SÉRICA", key: "globSer", ref: "2.3 - 3.5 g/dL" },
  ];

  tests.forEach(test => {
    y = drawRow(doc, y, test, datos, tableCols);
  });

  footer(doc, datos);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
