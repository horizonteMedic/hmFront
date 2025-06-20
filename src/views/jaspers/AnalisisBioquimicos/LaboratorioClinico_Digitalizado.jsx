// src/views/jaspers/AnalisisBioquimicos/HematologiaBioquimica_digitalizado.jsx
import jsPDF from "jspdf";
import Header_HematologiaBioquimica from "./Header/Header_HematologiaBioquimica ";
import footer from "../components/footer";

export default function LaboratorioClinico_Digitalizado(datos = {}) {
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
    { label: "Grupo Sanguíneo", value: `${datos.chko ? 'O' : datos.chka ? 'A' : datos.chkb ? 'B' : datos.chkab ? 'AB' : ''}`, suffix: "" },
    { label: "Factor Rh",       value: `${datos.rbrhpositivo ? 'POSITIVO' : 'NEGATIVO'}`,      suffix: "" },
    { label: "Hematocrito",     key: "txtHematocrito",    suffix: " %" },
    { label: "Hemoglobina",     key: "txtHemoglobina",    suffix: " g/dl" },
    { label: "Hematíes",        key: "txtHematiesHematologia",       suffix: "" },
    { label: "V.S.G",           key: "txtVsg",            suffix: "" },
    { label: "Plaquetas",       key: "txtPlaquetas",      suffix: " mm³" },
  ];
  const rightItems = [
    { label: "Leucocitos",   key: "txtLeucocitosHematologia",   suffix: " mm³" },
    { label: "Neutrófilos",  key: "txtNeutrofilos",  suffix: " %" },
    { label: "Abastonados",  key: "txtAbastonados",  suffix: " %" },
    { label: "Segmentados",  key: "txtSegmentadosHematologia",  suffix: " %" },
    { label: "Eosinófilos",  key: "txtEosinofilosHematologia",  suffix: " %" },
    { label: "Basófilos",    key: "txtBasofilosHematologia",    suffix: " %" },
    { label: "Linfocitos",   key: "txtLinfocitosHematologia",   suffix: " %" },
    { label: "Monocitos",    key: "txtMonocitosHematologia",    suffix: " %" },
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
        const { label, key, value, suffix } = leftItems[idx];
        const val = value != null
          ? value + suffix
          : (key && datos[key] != null ? datos[key] + suffix : "N/A");
        doc.setFont("helvetica", "normal").text(label + " :", tableX + 2, rowY);
        doc.setFont("helvetica", "bold")
           .text(val, tableX + tableW * 0.25, rowY);
      }
      // derecha
      if (rightItems[idx]) {
        const { label, key, value, suffix } = rightItems[idx];
        const val = value != null
          ? value + suffix
          : (key && datos[key] != null ? datos[key] + suffix : "N/A");
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
  doc.text(`Glucosa    : ${datos.txtGlucosaBio || "N/A"} mg/dl`, margin, y);
  doc.text(`Valores Normales 70 - 110 mg/dl`, pageW - margin, y, { align: "right" });
  y += 5;
  doc.text(`Creatinina : ${datos.txtCreatininaBio || "N/A"} mg/dl`, margin, y);
  doc.text(`Valores Normales 0.8 - 1.4 mg/dl`, pageW - margin, y, { align: "right" });

  // === SERO - INMUNOLÓGICO ===
  y += 10;
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SERO - INMUNOLÓGICO", pageW / 2, y, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  y += 5;
  doc.text(`RPR : ${datos.rprPos || "N/A"}`, margin, y);
  doc.text(`VIH : ${datos.txtVih || "N/A"}`, pageW - margin, y, { align: "right" });

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
  doc.text(`Color    : ${datos.txtColorEf || "N/A"}`, margin, y);
  doc.text(`Aspecto : ${datos.txtAspectoEf || "N/A"}`, pageW - margin, y, { align: "right" });
  y += 5;
  doc.text(`Densidad: ${datos.txtDensidadEf || "N/A"}`, margin, y);
  doc.text(`pH       : ${datos.txtPhEf || "N/A"}`, pageW - margin, y, { align: "right" });

  // Examen Químico
  doc.setFont("helvetica", "bold").setFontSize(10);
  y += 9;
  doc.text("Examen Químico :", margin, y);
  doc.setFont("helvetica", "normal");
  const chemL = [
    { label: "Nitritos",        key: "txtNitritosEq" },
    { label: "Proteínas",       key: "txtProteinasEq" },
    { label: "Cetonas",         key: "txtCetonasEq" },
    { label: "Leucocitos",      key: "txtLeucocitosEq" },
    { label: "Ácido ascórbico", key: "txtAcAscorbico" },
  ];

  const chemR = [
    { label: "Urobilinógeno", key: "txtUrobilinogenoEq" },
    { label: "Bilirrubina",   key: "txtBilirrubinaEq" },
    { label: "Glucosa",       key: "txtGlucosaEq" },
    { label: "Sangre",        key: "txtSangreEq" },
  ];
  for (let i = 0; i < Math.max(chemL.length, chemR.length); i++) {
    y += 5;

    // Lado izquierdo
    if (chemL[i]) {
      const { label, key } = chemL[i];
      const v = datos[key] || "N/A";
      doc.text(`${label} : ${v}`, margin, y);
    }

    // Lado derecho
    if (chemR[i]) {
      const { label, key } = chemR[i];
      const v = datos[key] || "N/A";
      doc.text(`${label} : ${v}`, pageW - margin, y, { align: "right" });
    }
  }

  // Sedimento Unitario
  y += 9;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Sedimento Unitario :", margin, y);
  doc.setFont("helvetica", "normal");
    const sedL = [
    { label: "Cel. Epiteliales",    key: "txtCelEpitelialesSu" },
    { label: "Leucocitos",          key: "txtCelEpitelialesSu" },
    { label: "Hematíes",            key: "txtHematiesSu" },
    { label: "Cristales",           key: "txtCristalesSu" },
  ];

  const sedR = [
    { label: "Cilindros",        key: "txtCilindrosSu" },
    { label: "Bacterias",        key: "txtBacteriasSu" },
    { label: "Gram S/C",         key: "txtPusSu" },
    { label: "Otros",            key: "txtOtrosSu" },
  ];
  for (let i = 0; i < Math.max(sedL.length, sedR.length); i++) {
    y += 5;

    if (sedL[i]) {
      const { label, key } = sedL[i];
      doc.text(`${label} : ${datos[key] || "N/A"}`, margin, y);
    }

    if (sedR[i]) {
      const { label, key } = sedR[i];
      doc.text(`${label} : ${datos[key] || "N/A"}`, pageW - margin, y, { align: "right" });
    }
  }

  // === DROGAS & OBSERVACIONES ===
  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Drogas :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Cocaína : ${datos.txtCocaina || "N/A"}`, margin + 20, y);
  doc.setFont("helvetica", "bold");
  doc.text("Marihuana :", pageW - margin - 30, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.txtMarihuana || "N/A", pageW - margin, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Observaciones :", margin, y);
  doc.setFont("helvetica", "normal");
  const obs = doc.splitTextToSize(datos.txtObservacionesLb || "", pageW - margin * 2);
  doc.text(obs, margin, y + 2);
  y+10
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
