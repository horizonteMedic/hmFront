// src/views/jaspers/AnalisisBioquimicos/HematologiaBioquimica_digitalizado.jsx
import jsPDF from "jspdf";
import Header_HematologiaBioquimica from "./Header/Header_HematologiaBioquimica ";
import footer from "../components/footer";

export default function HematologiaBioquimica_digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER personalizado ===
  Header_HematologiaBioquimica(doc, datos);

  // Bajamos el cursor por debajo del header
  let y = 55;

  // === TÍTULO HEMATOLOGÍA ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("HEMATOLOGÍA", pageW / 2, y, { align: "center" });
  y += 5;

  // === TABLA HEMATOLOGÍA con fila inicial vacía ===
  const leftItems = [
    { label: "Grupo Sanguíneo", key: "grupo_sanguineo", suffix: "" },
    { label: "Factor Rh",       key: "factor_rh",      suffix: "" },
    { label: "Hematocrito",     key: "hematocrito",    suffix: " %" },
    { label: "Hemoglobina",     key: "hemoglobina",    suffix: " g/dl" },
    { label: "Hematíes",        key: "hematies",       suffix: "" },
    { label: "V.S.G",           key: "vsg",            suffix: "" },
    { label: "Plaquetas",       key: "plaquetas",      suffix: " mm³" },
  ];
  const rightItems = [
    { label: "Leucocitos",   key: "leucocitos",   suffix: " mm³" },
    { label: "Neutrófilos",  key: "neutrofilos",  suffix: " %" },
    { label: "Abastonados",  key: "abastonados",  suffix: " %" },
    { label: "Segmentados",  key: "segmentados",  suffix: " %" },
    { label: "Eosinófilos",  key: "eosinofilos",  suffix: " %" },
    { label: "Basófilos",    key: "basofilos",    suffix: " %" },
    { label: "Linfocitos",   key: "linfocitos",   suffix: " %" },
    { label: "Monocitos",    key: "monocitos",    suffix: " %" },
  ];

  // Definimos una fila extra al principio
  const baseRows = Math.max(leftItems.length, rightItems.length);
  const totalRows = baseRows + 1;    // +1 para fila vacía arriba
  const rowH = 6.5;
  const tableW = pageW - margin * 4; // estrecha
  const tableX = margin * 2;         // centrada
  const tableH = rowH * totalRows;

  // Dibujo del contorno y divisiones
  doc.setLineWidth(0.3).rect(tableX, y, tableW, tableH);
  // Línea vertical central
  doc.line(tableX + tableW / 2, y, tableX + tableW / 2, y + tableH);
  // Líneas horizontales
  for (let i = 1; i < totalRows; i++) {
    const yy = y + rowH * i;
    doc.line(tableX, yy, tableX + tableW, yy);
  }

  // Relleno de datos (i=0 queda en blanco)
  doc.setFontSize(10);
  for (let i = 0; i < totalRows; i++) {
    const rowY = y + rowH * (i + 1) - 2;
    // saltamos la fila 0 para dejarla vacía
    if (i > 0) {
      const idx = i - 1;
      // izquierda
      if (leftItems[idx]) {
        const { label, key, suffix } = leftItems[idx];
        const val = datos[key] != null ? datos[key] + suffix : "N/A";
        doc.setFont("helvetica", "normal").text(label + " :", tableX + 2, rowY);
        doc.setFont("helvetica", "bold")
           .text(val, tableX + tableW * 0.25, rowY);
      }
      // derecha
      if (rightItems[idx]) {
        const { label, key, suffix } = rightItems[idx];
        const val = datos[key] != null ? datos[key] + suffix : "N/A";
        doc.setFont("helvetica", "normal")
           .text(label + " :", tableX + tableW / 2 + 2, rowY);
        doc.setFont("helvetica", "bold")
           .text(val, tableX + tableW - 2, rowY, { align: "right" });
      }
    }
  }

  // Avanzamos Y tras la tabla
  y += tableH + 8;

  // === BIOQUÍMICA ===
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("BIOQUÍMICA", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  y += 5;
  doc.text(`Glucosa    : ${datos.glucosa || "N/A"} mg/dl`, margin, y);
  doc.text(`Valores Normales 70 - 110 mg/dl`, pageW - margin, y, { align: "right" });
  y += 5;
  doc.text(`Creatinina : ${datos.creatinina_bio || "N/A"} mg/dl`, margin, y);
  doc.text(`Valores Normales 0.8 - 1.4 mg/dl`, pageW - margin, y, { align: "right" });

  // === SERO - INMUNOLÓGICO ===
  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SERO - INMUNOLÓGICO", pageW / 2, y, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  y += 5;
  doc.text(`RPR : ${datos.rpr || "N/A"}`, margin, y);
  doc.text(`VIH : ${datos.vih || "N/A"}`, pageW - margin, y, { align: "right" });

  // === EXAMEN DE ORINA ===
  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("EXAMEN DE ORINA", pageW / 2, y, { align: "center" });

  // Examen Físico
  doc.setFont("helvetica", "bold").setFontSize(10);
  y += 7;
  doc.text("Examen Físico :", margin, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text(`Color    : ${datos.color || "N/A"}`, margin, y);
  doc.text(`Aspecto : ${datos.aspecto || "N/A"}`, pageW - margin, y, { align: "right" });
  y += 5;
  doc.text(`Densidad: ${datos.densidad || "N/A"}`, margin, y);
  doc.text(`pH       : ${datos.ph || "N/A"}`, pageW - margin, y, { align: "right" });

  // Examen Químico
  doc.setFont("helvetica", "bold").setFontSize(10);
  y += 9;
  doc.text("Examen Químico :", margin, y);
  doc.setFont("helvetica", "normal");
  const chemL = ["nitritos", "proteinas", "cetonas", "leucocitos_q", "ac_ascorbico"];
  const chemR = ["urobilinogeno", "bilirrubina", "glucosa_o", "sangre_o"];
  for (let i = 0; i < Math.max(chemL.length, chemR.length); i++) {
    y += 5;
    if (chemL[i]) {
      const v = datos[chemL[i]] || "N/A";
      doc.text(`${chemL[i]} : ${v}`, margin, y);
    }
    if (chemR[i]) {
      const v = datos[chemR[i]] || "N/A";
      doc.text(`${chemR[i]} : ${v}`, pageW - margin, y, { align: "right" });
    }
  }

  // Sedimento Unitario
  y += 9;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Sedimento Unitario :", margin, y);
  doc.setFont("helvetica", "normal");
  const sedL = ["epiteliales", "leucocitos_s", "hematies_s", "cristales"];
  const sedR = ["cilindros", "bacterias", "gram_sc", "otros_s"];
  for (let i = 0; i < sedL.length; i++) {
    y += 5;
    doc.text(`${sedL[i]} : ${datos[sedL[i]] || "N/A"}`, margin, y);
    doc.text(`${sedR[i]} : ${datos[sedR[i]] || "N/A"}`, pageW - margin, y, { align: "right" });
  }

  // === DROGAS & OBSERVACIONES ===
  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Drogas :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Cocaína : ${datos.cocaina || "N/A"}`, margin + 20, y);
  doc.setFont("helvetica", "bold");
  doc.text("Marihuana :", pageW - margin - 30, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.marihuana || "N/A", pageW - margin, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Observaciones :", margin, y);
  doc.setFont("helvetica", "normal");
  const obs = doc.splitTextToSize(datos.observaciones || "", pageW - margin * 2);
  doc.text(obs, margin, y + 2);

  // === FOOTER ===
  footer(doc, datos);

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
