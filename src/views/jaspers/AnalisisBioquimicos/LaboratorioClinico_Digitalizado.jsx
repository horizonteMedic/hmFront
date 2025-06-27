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

   const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {

    let y = 55;

    // === TÍTULO HEMATOLOGÍA ===
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("HEMATOLOGÍA", pageW / 2, y, { align: "center" });
    y += 5;

    // === TABLA HEMATOLOGÍA (formato clásico laboratorio) ===
    const leftX = margin * 2;
    const rightX = pageW / 2 + 5;
    const labelW = 38;
    const valueW = 32;
    let yTable = y;
    doc.setFontSize(11);
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

    const totalRows = Math.max(leftItems.length, rightItems.length);
    const rowH = 7; // compacto
    const tableW = (rightX + labelW + valueW + 8) - leftX;
    const tableH = rowH * totalRows;
    // Contorno exterior
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.rect(leftX, yTable, tableW, tableH);
    // Línea vertical central
    doc.line(rightX - 8, yTable, rightX - 8, yTable + tableH);
    // Dibujar filas (sin líneas horizontales entre filas)
    for (let i = 0; i < totalRows; i++) {
      // Izquierda
      if (leftItems[i]) {
        const { label, key, value, suffix } = leftItems[i];
        const val = value != null
          ? value + suffix
          : (key && datos[key] != null ? datos[key] + suffix : "N/A");
        doc.setFont("helvetica", "normal");
        doc.text(label, leftX + labelW, yTable + rowH * (i + 0.7), { align: "right" });
        doc.text(":", leftX + labelW + 2, yTable + rowH * (i + 0.7), { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(val, leftX + labelW + 8, yTable + rowH * (i + 0.7), { align: "left" });
      }
      // Derecha
      if (rightItems[i]) {
        const { label, key, value, suffix } = rightItems[i];
        const val = value != null
          ? value + suffix
          : (key && datos[key] != null ? datos[key] + suffix : "N/A");
        doc.setFont("helvetica", "normal");
        doc.text(label, rightX + labelW, yTable + rowH * (i + 0.7), { align: "right" });
        doc.text(":", rightX + labelW + 2, yTable + rowH * (i + 0.7), { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(val, rightX + labelW + 8, yTable + rowH * (i + 0.7), { align: "left" });
      }
      // Línea horizontal debajo de Leucocitos (derecha)
      if (rightItems[i] && rightItems[i].label === "Leucocitos") {
        // Línea negra, más delgada y discontinua
        doc.setDrawColor(0, 0, 0); // Negro
        doc.setLineWidth(0.4);
        doc.setLineDash([2, 2], 0);
        const yLinea = yTable + rowH * (i + 1.1);
        doc.line(rightX - 8, yLinea, rightX + labelW + valueW + 8, yLinea);
        doc.setLineDash([]);
        doc.setDrawColor(0); // Reset color
        doc.setLineWidth(0.5);
      }
    }
    y = yTable + tableH + 8; // avanza Y para el siguiente bloque

    // === BIOQUÍMICA ===
    const contentMargin = margin + 20; // margen lateral aún más amplio
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(10);
    const bioqMargin = contentMargin;
    const bioqRight = pageW - contentMargin;
    y += 5;
    // Formato tabla clásico: dos columnas, etiquetas a la derecha, valores a la izquierda, valores normales a la derecha
    const bioqItems = [
      {
        label: "Glucosa",
        value: datos.txtGlucosaBio || "N/A",
        unidad: "mg/dl",
        normales: "70 - 110 mg/dl"
      },
      {
        label: "Creatinina",
        value: datos.txtCreatininaBio || "N/A",
        unidad: "mg/dl",
        normales: "0.8 - 1.4 mg/dl"
      },
    ];
    const bioqLabelW = 32;
    const bioqValueW = 22;
    const bioqNormW = 38;
    for (let i = 0; i < bioqItems.length; i++) {
      const { label, value, unidad, normales } = bioqItems[i];
      // Etiqueta
      doc.setFont("helvetica", "normal");
      doc.text(label, bioqMargin + bioqLabelW, y, { align: "right" });
      doc.text(":", bioqMargin + bioqLabelW + 2, y, { align: "left" });
      // Valor
      doc.setFont("helvetica", "bold");
      doc.text(`${value} ${unidad}`, bioqMargin + bioqLabelW + 8, y, { align: "left" });
      // Valores normales a la derecha
      doc.setFont("helvetica", "normal");
      doc.text(`Valores Normales ${normales}`, bioqRight, y, { align: "right" });
      y += 5;
    }

    // === SERO - INMUNOLÓGICO ===
    y += 10;
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("SUERO - INMUNOLÓGICO", pageW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(10);
    y += 5;
    // Formato tabla clásico: dos columnas, etiquetas a la derecha, valores a la izquierda
    const sueroL = [
      { label: "RPR", value: datos.rprPos || "N/A" },
    ];
    const sueroR = [
      { label: "VIH", value: datos.txtVih || "N/A" },
    ];
    const sueroLabelW = 22;
    for (let i = 0; i < Math.max(sueroL.length, sueroR.length); i++) {
      // Lado izquierdo
      if (sueroL[i]) {
        const { label, value } = sueroL[i];
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqMargin + sueroLabelW, y, { align: "right" });
        doc.text(":", bioqMargin + sueroLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(value, bioqMargin + sueroLabelW + 8, y, { align: "left" });
      }
      // Lado derecho
      if (sueroR[i]) {
        const { label, value } = sueroR[i];
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqRight - sueroLabelW, y, { align: "right" });
        doc.text(":", bioqRight - sueroLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(value, bioqRight - sueroLabelW + 8, y, { align: "left" });
      }
    }

    // === EXAMEN DE ORINA ===
    y += 10;
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("EXAMEN DE ORINA", pageW / 2, y, { align: "center" });

    // Examen Físico
    doc.setFont("helvetica", "bold").setFontSize(10);
    y += 7;
    doc.text("Examen Físico :", bioqMargin, y);
    doc.setFont("helvetica", "normal");
    const fisicoL = [
      { label: "Color", key: "txtColorEf" },
      { label: "Densidad", key: "txtDensidadEf" },
    ];
    const fisicoR = [
      { label: "Aspecto", key: "txtAspectoEf" },
      { label: "pH", key: "txtPhEf" },
    ];
    const fisicoLabelW = 38;
    for (let i = 0; i < Math.max(fisicoL.length, fisicoR.length); i++) {
      y += 5;
      // Lado izquierdo
      if (fisicoL[i]) {
        const { label, key } = fisicoL[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqMargin + fisicoLabelW, y, { align: "right" });
        doc.text(":", bioqMargin + fisicoLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqMargin + fisicoLabelW + 8, y, { align: "left" });
      }
      // Lado derecho
      if (fisicoR[i]) {
        const { label, key } = fisicoR[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqRight - fisicoLabelW, y, { align: "right" });
        doc.text(":", bioqRight - fisicoLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqRight - fisicoLabelW + 8, y, { align: "left" });
      }
    }

    // Examen Químico
    doc.setFont("helvetica", "bold").setFontSize(10);
    y += 9;
    doc.text("Examen Químico :", bioqMargin, y);
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
    const chemLabelW = 38;
    for (let i = 0; i < Math.max(chemL.length, chemR.length); i++) {
      y += 5;
      // Lado izquierdo
      if (chemL[i]) {
        const { label, key } = chemL[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqMargin + chemLabelW, y, { align: "right" });
        doc.text(":", bioqMargin + chemLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqMargin + chemLabelW + 8, y, { align: "left" });
      }
      // Lado derecho
      if (chemR[i]) {
        const { label, key } = chemR[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqRight - chemLabelW, y, { align: "right" });
        doc.text(":", bioqRight - chemLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqRight - chemLabelW + 8, y, { align: "left" });
      }
    }

    // Sedimento Unitario
    y += 9;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Sedimento Urinario :", bioqMargin, y);
    doc.setFont("helvetica", "normal");
    const sedL = [
      { label: "Cel. Epiteliales",    key: "txtCelEpitelialesSu" },
      { label: "Leucocitos",          key: "txtLeucocitosSu", campo: true },
      { label: "Hematíes",            key: "txtHematiesSu", campo: true },
      { label: "Cristales",           key: "txtCristalesSu" },
    ];
    const sedR = [
      { label: "Cilindros",        key: "txtCilindrosSu" },
      { label: "Bacterias",        key: "txtBacteriasSu" },
      { label: "Gram S/C",         key: "txtPusSu" },
      { label: "Otros",            key: "txtOtrosSu" },
    ];
    const sedLabelW = 38;
    for (let i = 0; i < Math.max(sedL.length, sedR.length); i++) {
      y += 5;
      // Lado izquierdo
      if (sedL[i]) {
        const { label, key, campo } = sedL[i];
        let v = datos[key] || "N/A";
        if (campo && v !== "N/A" && v !== "") {
          v = `${v} x campo`;
        }
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqMargin + sedLabelW, y, { align: "right" });
        doc.text(":", bioqMargin + sedLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqMargin + sedLabelW + 8, y, { align: "left" });
      }
      // Lado derecho
      if (sedR[i]) {
        const { label, key } = sedR[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqRight - sedLabelW, y, { align: "right" });
        doc.text(":", bioqRight - sedLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(v, bioqRight - sedLabelW + 8, y, { align: "left" });
      }
    }

    // === DROGAS & OBSERVACIONES ===
    y += 8;
    // Label principal
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Drogas :", bioqMargin, y);
    y += 6;
    // Resultados en dos columnas
    const drogaCol1Label = "Cocaína:";
    const drogaCol1Value = String(datos.txtCocaina || "N/A");
    const drogaCol2Label = "Marihuana:";
    const drogaCol2Value = String(datos.txtMarihuana || "N/A");
    doc.setFont("helvetica", "bold");
    doc.text(drogaCol1Label, bioqMargin + 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(drogaCol1Value, bioqMargin + 10 + doc.getTextWidth(drogaCol1Label) + 4, y);
    doc.setFont("helvetica", "bold");
    doc.text(drogaCol2Label, bioqRight - 60, y);
    doc.setFont("helvetica", "normal");
    doc.text(drogaCol2Value, bioqRight - 60 + doc.getTextWidth(drogaCol2Label) + 4, y);
    y += 6;
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Observaciones :", bioqMargin, y);
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(datos.txtObservacionesLb || "", pageW - contentMargin * 2);
    doc.text(obs, bioqMargin, y + 2);
    y += obs.length * 5 + 2;

    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 30;
      // Apilar a la derecha
      const sigX = pageW - sigW + 3;
      const sigY = y - 80;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 30;
      // Apilar a la derecha, debajo del primero
      const sigX = pageW - sigW + 3;
      const sigY = y - 80 + sigH;

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    // === IMPRIMIR ===
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  })

  // Bajamos el cursor por debajo del header
  
}
