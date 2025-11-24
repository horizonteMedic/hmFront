// src/views/jaspers/AnalisisBioquimicos/HematologiaBioquimica_digitalizado.jsx
import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split('-');
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Función para formatear fecha larga
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return toDDMMYYYY(dateString) || '';
  }
};

// Header con datos de ficha, sede y fecha
const drawHeader = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  
  CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 3 }); // Subido 7mm (de 10 a 3) para que sea visible
  
  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8.5);
  doc.text("Nro de ficha: ", pageW - 80, 8); // Ajustado para que sea visible
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 9); // Ajustado para que sea visible
  
  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8.5);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 13); // Ajustado para que sea visible
  
  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaLab || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 18); // Ajustado para que sea visible
  
  // Página
  doc.text("Pag. 01", pageW - 30, 3); // Ajustado para que sea visible

  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor || "#008f39",
    text: datos.textoColor || "F",
    x: pageW - 30,
    y: 3, // Ajustado para que sea visible
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente
const drawPatientData = (doc, datos = {}) => {
  const margin = 15;
  let y = 28; // Ajustado para alinearse con el header subido
  const lineHeight = 5.5; // Reducido de 6 a 5.5
  const patientDataX = margin;
  
  const drawPatientDataRow = (label, value) => {
    const labelWithColon = label.endsWith(':') ? label : label + ' :';
    doc.setFontSize(8.5).setFont('helvetica', 'bold');
    doc.text(labelWithColon, patientDataX, y);
    let valueX = patientDataX + doc.getTextWidth(labelWithColon) + 2;
    if (label.toLowerCase().includes('apellidos y nombres')) {
      const minGap = 23;
      if (doc.getTextWidth(labelWithColon) < minGap) valueX = patientDataX + minGap;
    }
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '').toUpperCase(), valueX, y);
    y += lineHeight;
  };
  
  drawPatientDataRow("Apellidos y Nombres :", datos.nombres || datos.nombresPaciente || '');
  
  // Solo mostrar Edad si está presente
  if (datos.edad || datos.edadPaciente) {
    drawPatientDataRow("Edad :", `${datos.edad || datos.edadPaciente} AÑOS`);
  }
  
  // Solo mostrar DNI si está presente
  if (datos.dni || datos.dniPaciente) {
    drawPatientDataRow("DNI :", datos.dni || datos.dniPaciente);
  }
  
  // Fecha
  doc.setFontSize(8.5).setFont('helvetica', 'bold');
  const fechaLabel = "Fecha :";
  doc.text(fechaLabel, patientDataX, y);
  doc.setFont('helvetica', 'normal');
  const fechaLabelWidth = doc.getTextWidth(fechaLabel);
  doc.text(formatDateToLong(datos.fechaExamen || datos.fecha || datos.fechaLab || ''), patientDataX + fechaLabelWidth + 2, y);
  
  // Reseteo
  doc.setFont('helvetica', 'normal').setFontSize(8.5).setLineWidth(0.2);
  
  return y + lineHeight;
};

export default function LaboratorioClinico_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER ===
  drawHeader(doc, datos);
  
  // === DATOS DEL PACIENTE ===
  drawPatientData(doc, datos);

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

    let y = 42; // Ajustado para alinearse con el header y datos del paciente subidos

    // === TÍTULO HEMATOLOGÍA ===
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("HEMATOLOGÍA", pageW / 2, y, { align: "center" });
    y += 4; // Reducido de 5 a 4

    // === TABLA HEMATOLOGÍA (formato clásico laboratorio) ===
    const leftX = margin * 2;
    const rightX = pageW / 2 + 5;
    const labelW = 38;
    const valueW = 32;
    let yTable = y;
    doc.setFontSize(8.5); // Reducido de 11 a 10
    const leftItems = [
      { label: "Grupo Sanguíneo", value: `${datos.chko ? 'O' : datos.chka ? 'A' : datos.chkb ? 'B' : datos.chkab ? 'AB' : ''}`, suffix: "" },
      { label: "Factor Rh",       value: `${datos.rbrhpositivo === true ? 'POSITIVO' : datos.rbrhnegativo === true ? 'NEGATIVO' : ''}`,      suffix: "" },
      { label: "Hematocrito",     key: "txtHematocrito",    suffix: " %" },
      { label: "Hemoglobina",     key: "txtHemoglobina",    suffix: " g/dl" },
      { label: "Hematíes",        key: "txtHematiesHematologia",       suffix: "" },
      { label: "V.S.G",           key: "txtVsg",            suffix: " mm/HORA" },
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
    const rowH = 5.5; // Reducido de 7 a 5.5 para hacer la tabla más compacta
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
          : (key && datos[key] != null ? key=="txtVsg" && datos[key]=="N/A"? datos[key] : datos[key] + suffix : "N/A");
        doc.setFont("helvetica", "normal");
        doc.text(label, leftX + labelW, yTable + rowH * (i + 0.65), { align: "right" });
        doc.text(":", leftX + labelW + 2, yTable + rowH * (i + 0.65), { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(val, leftX + labelW + 8, yTable + rowH * (i + 0.65), { align: "left" });
      }
      // Derecha
      if (rightItems[i]) {
        const { label, key, value, suffix } = rightItems[i];
        const val = value != null
          ? value + suffix
          : (key && datos[key] != null ? datos[key] + suffix : "N/A");
        doc.setFont("helvetica", "normal");
        doc.text(label, rightX + labelW, yTable + rowH * (i + 0.65), { align: "right" });
        doc.text(":", rightX + labelW + 2, yTable + rowH * (i + 0.65), { align: "left" });
        doc.setFont("helvetica", "bold");
        doc.text(val, rightX + labelW + 8, yTable + rowH * (i + 0.65), { align: "left" });
      }
      // Línea horizontal debajo de Leucocitos (derecha)
      if (rightItems[i] && rightItems[i].label === "Leucocitos") {
        // Línea negra, más delgada y discontinua
        doc.setDrawColor(0, 0, 0); // Negro
        doc.setLineWidth(0.2); // más delgada
        doc.setLineDash([1, 1], 0); // guiones más juntos y cortos
        const yLinea = yTable + rowH * (i + 0.95); // más pegada a la fila
        // Largo original
        doc.line(rightX - 8, yLinea, rightX + labelW + valueW + 8, yLinea);
        doc.setLineDash([]);
        doc.setDrawColor(0); // Reset color
        doc.setLineWidth(0.5);
      }
    }
    y = yTable + tableH + 5; // Reducido de 8 a 5

    // === BIOQUÍMICA ===
    const contentMargin = margin + 20; // margen lateral aún más amplio
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(8.5);
    const bioqMargin = contentMargin;
    const bioqRight = pageW - contentMargin;
    y += 4; // Reducido de 5 a 4
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
      y += 4; // Reducido de 5 a 4
    }

    // === SERO - INMUNOLÓGICO ===
    y += 6; // Reducido de 10 a 6
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("SUERO - INMUNOLÓGICO", pageW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(8.5);
    y += 4; // Reducido de 5 a 4
    // Formato tabla clásico: dos columnas, etiquetas a la derecha, valores a la izquierda
    const sueroL = [
      { label: "RPR", value: datos.chkPositivo === true ? 'REACTIVO' : datos.chkNegativo === true ? 'NO REACTIVO' : datos.chkNegativo === false && datos.chkPositivo === false ? 'N/A' : '' || "N/A" },
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
    y += 6; // Reducido de 10 a 6
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("EXAMEN DE ORINA", pageW / 2, y, { align: "center" });

    // Examen Físico
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    y += 5; // Reducido de 7 a 5
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
      y += 4; // Reducido de 5 a 4
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
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    y += 6; // Reducido de 9 a 6
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
      y += 4; // Reducido de 5 a 4
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
    y += 6; // Reducido de 9 a 6
    doc.setFont("helvetica", "bold").setFontSize(8.5);
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
    let maxY = y;
    for (let i = 0; i < Math.max(sedL.length, sedR.length); i++) {
      y += 4; // Reducido de 5 a 4
      // Lado izquierdo
      if (sedL[i]) {
        const { label, key, campo } = sedL[i];
        let v = datos[key] || "N/A";
        if (campo && v !== "N/A" && v !== "" && v !== null) {
          v = `${v} x campo`;
        }
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqMargin + sedLabelW, y, { align: "right" });
        doc.text(":", bioqMargin + sedLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        if (label === "Cristales") {
          const lineasCristales = doc.splitTextToSize(v, 50);
          let currentY = y;
          lineasCristales.forEach((linea) => {
            doc.text(linea, bioqMargin + sedLabelW + 8, currentY, { align: "left" });
            currentY += 4;
          });
          maxY = Math.max(maxY, currentY);
        } else {
          doc.text(v, bioqMargin + sedLabelW + 8, y, { align: "left" });
          maxY = Math.max(maxY, y);
        }
      }
      // Lado derecho
      if (sedR[i]) {
        const { label, key } = sedR[i];
        let v = datos[key] || "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(label, bioqRight - sedLabelW, y, { align: "right" });
        doc.text(":", bioqRight - sedLabelW + 2, y, { align: "left" });
        doc.setFont("helvetica", "bold");
        if (label === "Otros") {
          const lineasOtros = doc.splitTextToSize(v, 50);
          let currentY = y;
          lineasOtros.forEach((linea) => {
            doc.text(linea, bioqRight - sedLabelW + 8, currentY, { align: "left" });
            currentY += 4;
          });
          maxY = Math.max(maxY, currentY);
        } else {
          doc.text(v, bioqRight - sedLabelW + 8, y, { align: "left" });
          maxY = Math.max(maxY, y);
        }
      }
    }
    // Observaciones adicionales del sedimento (si hay datos de Hematíes, Cristales u Otros)
    y = maxY + 4;
    const obsSedimento = [];
    if (datos.txtHematiesSu && datos.txtHematiesSu !== "N/A" && datos.txtHematiesSu !== "") {
      obsSedimento.push(`Hematíes N° ${datos.txtHematiesSu} x campo`);
    }
    if (datos.txtCristalesSu && datos.txtCristalesSu !== "N/A" && datos.txtCristalesSu !== "") {
      obsSedimento.push(datos.txtCristalesSu);
    }
    if (datos.txtOtrosSu && datos.txtOtrosSu !== "N/A" && datos.txtOtrosSu !== "") {
      obsSedimento.push(datos.txtOtrosSu);
    }
    if (obsSedimento.length > 0) {
      const textoObs = obsSedimento.join(" ");
      const lineasObs = doc.splitTextToSize(textoObs, pageW - contentMargin * 2);
      doc.setFont("helvetica", "normal");
      lineasObs.forEach((linea) => {
        doc.text(linea, bioqMargin, y, { align: "left" });
        y += 4;
      });
    }

    // === DROGAS & OBSERVACIONES ===
    y += 5; // Reducido de 8 a 5
    // Label principal
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    doc.text("Drogas :", bioqMargin, y);
    y += 5; // Reducido de 6 a 5
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
    y += 5; // Reducido de 6 a 5
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    doc.text("Observaciones :", bioqMargin, y);
    y += 5; // Reducido de 6 a 5
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(datos.txtObservacionesLb || "", pageW - contentMargin * 2);
    if (obs && obs.length > 0) {
      doc.text(obs, bioqMargin, y);
      y += obs.length * 4 + 5; // Reducido el espacio
    } else {
      y += 2; // Si no hay observaciones, solo un pequeño espacio
    }

    // Centrar los sellos en la hoja - Mismo tamaño fijo para ambos
    const sigW = 53; // Reducido de 60 a 56 (4mm menos)
    const sigH = 23; // Reducido de 30 a 26 (4mm menos)
    const sigY = y + 2; // Reducido de 8 a 5 para acercar la firma
    const gap = 16; // Espacio entre sellos (reducido 4mm: 20 - 4 = 16)
    
    if (s1 && s2) {
      // Si hay dos sellos, centrarlos juntos
      const totalWidth = sigW * 2 + gap;
      const startX = (pageW - totalWidth) / 2;
      
      const addSello = (img, xPos) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const selloBase64 = canvas.toDataURL('image/png');
        doc.addImage(selloBase64, 'PNG', xPos, sigY, sigW, sigH);
      };
      addSello(s1, startX);
      addSello(s2, startX + sigW + gap);
    } else if (s1) {
      // Si solo hay un sello, centrarlo con tamaño fijo
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2; // Center single stamp
      doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
    } else if (s2) {
      // Si solo hay el segundo sello, centrarlo con tamaño fijo
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = (pageW - sigW) / 2; // Center single stamp
      doc.addImage(selloBase64, 'PNG', imgX, sigY, sigW, sigH);
    }
    
    // === FOOTER ===
    footerTR(doc, { ...datos, footerOffsetY: 16 }); // Bajado 12 puntos

    // === Imprimir ===
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
