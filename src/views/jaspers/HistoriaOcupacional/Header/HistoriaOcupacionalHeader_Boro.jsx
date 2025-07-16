
// /**
//  * Formatea una fecha en formato "13 diciembre 2024".
//  * @param {string} dateString - La fecha en formato YYYY-MM-DD.
//  * @returns {string} - La fecha formateada.
//  */
// const formatDateToLong = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(`${dateString}T00:00:00`);
//   return date.toLocaleDateString('es-ES', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
// };

// /**
//  * Formatea una fecha en formato dd/mm/yyyy.
//  * @param {string} dateString - La fecha en formato YYYY-MM-DD.
//  * @returns {string} - La fecha formateada.
//  */
// const formatDateToShort = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(`${dateString}T00:00:00`);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// /**
//  * Dibuja el encabezado para el reporte de Inmunología (Aglutinación).
//  * @param {jsPDF} doc - La instancia del documento jsPDF.
//  * @param {object} datos - Los datos a imprimir.
//  */
// const header_HistoriaOcupacional_Boro = (doc, datos = {}) => {
//   const margin = 8;
//   const pageW = doc.internal.pageSize.getWidth();
//   let y = 5;

//   // Logo a la izquierda
//   const img = "./img/logo-color.png";
//   try {
//     doc.addImage(img, "PNG", margin, y, 60, 20);
//   } catch (error) {
//     console.error("No se pudo cargar el logo.", error);
//     doc.text("Policlinico Horizonte Medic", margin, y + 8);
//   }

//   // --- Cuadro de color a la derecha ---
//   const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
//   let boxSize = 15;
//   let boxX = pageW - margin - boxSize;
//   let boxY = y - 3;
//   if (colorValido) {
//     let color = datos.codigoColor || "#008f39";
//     let boxText = (datos.textoColor || "F").toUpperCase();
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
//     doc.setDrawColor(color);
//     doc.setLineWidth(2);
//     doc.setLineCap('round');
//     doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
//     doc.setLineCap('butt');
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(color);
//     doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
//       align: "center",
//       baseline: "middle",
//       maxWidth: boxSize - 1
//     });
//     doc.setDrawColor(0);
//     doc.setTextColor(0);
//     doc.setLineWidth(0.2);
//   }

//   // --- Nro Orden y sede alineados a la derecha, sede bajo el número ---
//   const nroOrdenLabel = "Nro Orden :";
//   const nroOrdenValue = String(datos.norden || '');
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'bold');
//   const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
//   const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
//   let rightMargin = pageW - margin - (boxSize + 10);
//   let nroOrdenX = rightMargin - nroOrdenLabelWidth - nroOrdenValueWidth - 2;
//   let nroOrdenY = y + 8;
//   // Primera línea: label y número
//   doc.text(nroOrdenLabel, nroOrdenX - 10, nroOrdenY, { align: 'left' });
//   doc.setFont('helvetica', 'bold').setFontSize(18);
//   doc.text(nroOrdenValue, rightMargin - nroOrdenValueWidth - 10, nroOrdenY, { align: 'left' });
//   doc.setLineWidth(0.5);
//   doc.line(rightMargin - nroOrdenValueWidth - 10, nroOrdenY + 1.5, rightMargin, nroOrdenY + 1.5);
  
//   // Segunda línea: sede alineada con el número
//   doc.setFontSize(8).setFont('helvetica', 'bold');
//   //DATOS DEBAJO DE NORDEN
 
//   doc.text("Sexo: ", nroOrdenX + 25, nroOrdenY +18)
//   doc.text(`${datos.sexo === 'F' ? 'FEMENINO' : datos.sexo === 'M' ? 'MASCULINO' : ''}`, nroOrdenX + 35, nroOrdenY +18)

//   doc.text("Fecha de Nacimiento: ", nroOrdenX - 60, nroOrdenY + 18)
//   doc.text(datos.fechaNac, nroOrdenX - 30, nroOrdenY + 18)

//   const lugarLabel = "Lugar de Procedencia: ";
//   const lugarTexto = datos.lugarProcedimiento || "";
//   const maxWidth = 90; // ajusta según tu diseño

//   // Imprimir etiqueta (fija)
//   doc.text(lugarLabel, nroOrdenX - 80, nroOrdenY + 24);

//   // Imprimir contenido (ajustado al ancho)
//   doc.text(lugarTexto, nroOrdenX - 44, nroOrdenY + 24, {
//     maxWidth: maxWidth,
//   });

//   doc.setFontSize(10).setFont('helvetica', 'normal');

//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(12).setFont('helvetica', 'bold');
//   doc.text("HISTORIA OCUPACIONAL", 100, nroOrdenY + 10)
//   doc.setFont('helvetica', 'normal');
//   // --- Datos del paciente ---
//   let yDatos = nroOrdenY + 18;
//   const patientDataX = margin;
//   const lineHeight = 5;
//   const drawPatientDataRow = (label, value) => {
//     doc.setFontSize(8).setFont('helvetica', 'bold');
//     doc.text(label, patientDataX, yDatos);
//     let valueX = patientDataX + doc.getTextWidth(label) + 4;
//     if (label.toLowerCase().includes('apellidos y nombres')) {
//       if (doc.getTextWidth(label) < 23) valueX = patientDataX + 23;
//     }
//     doc.setFont('helvetica', 'normal');
//     doc.text(String(value).toUpperCase(), valueX, yDatos);
//     yDatos += lineHeight;
//   };
//   drawPatientDataRow("Apellidos y Nombres :", datos.nombres || '');
//   drawPatientDataRow("Lugar de Nacimiento :", datos.lugarNac || '');
//   drawPatientDataRow("Profesion :", datos.areaO || '');
//   doc.setFontSize(11).setFont('helvetica', 'bold');
//   doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);
// };

// export default header_HistoriaOcupacional_Boro; 

import footerEnHeader from "../footerEnHeader";

/**
 * Formatea una fecha en formato "13 diciembre 2024".
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToLong = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha en formato dd/mm/yyyy.
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Dibuja el encabezado para el reporte de Inmunología (Aglutinación).
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir.
 */
const header_HistoriaOcupacional_Boro = (doc, datos = {}) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 5;

  // Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // --- Cuadro de color a la derecha ---
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  let boxSize = 15;
  let boxX = pageW - margin - boxSize;
  let boxY = y - 3;
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // --- Nro Orden y sede alineados a la derecha, sede bajo el número ---
  const nroOrdenLabel = "Nro Orden :";
  const nroOrdenValue = String(datos.norden || '');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const nroOrdenLabelWidth = doc.getTextWidth(nroOrdenLabel);
  const nroOrdenValueWidth = doc.getTextWidth(nroOrdenValue);
  let rightMargin = pageW - margin - (boxSize + 10);
  let nroOrdenX = rightMargin - nroOrdenLabelWidth - nroOrdenValueWidth - 2;
  let nroOrdenY = y + 8;
  // Primera línea: label y número
  doc.text(nroOrdenLabel, nroOrdenX - 10, nroOrdenY, { align: 'left' });
  doc.setFont('helvetica', 'bold').setFontSize(18);
  doc.text(nroOrdenValue, rightMargin - nroOrdenValueWidth - 10, nroOrdenY, { align: 'left' });
  doc.setLineWidth(0.5);
  doc.line(rightMargin - nroOrdenValueWidth - 10, nroOrdenY + 1.5, rightMargin, nroOrdenY + 1.5);
  
  // Segunda línea: sede alineada con el número
  doc.setFontSize(8).setFont('helvetica', 'bold');
  //DATOS DEBAJO DE NORDEN
  // doc.setFont('helvetica', 'normal');
  // doc.text(datos.sede || '', nroOrdenX - 40, nroOrdenY +10);
  doc.setFont('helvetica', 'bold');
  doc.text("HISTORIA OCUPACIONAL", 100, nroOrdenY + 10)
  doc.setFont('helvetica', 'normal');
  // --- Datos del paciente en dos columnas alineadas ---
  let yDatos = nroOrdenY + 18;
  const patientDataX1 = margin;
  const patientDataX2 = Math.floor(pageW / 2) - 20;
  const lineHeight = 5;
  // Pares de label/dato para cada columna
  const patientRows = [
    [
      { label: "Apellidos y Nombres :", value: datos.nombres || '' },
      { label: "Sede :", value: (datos.sede || '') },
    ],
    [
      { label: "Lugar de Nacimiento :", value: datos.lugarNac || '' },
      { label: "Fecha de Nacimiento :", value: datos.fechaNac || '' },
    ],
    [
      { label: "Profesion :", value: datos.areaO || '' },
      { label: "Sexo :", value: datos.sexo === 'F' ? 'FEMENINO' : datos.sexo === 'M' ? 'MASCULINO' : '' },
    ],
    [
      // { label: "Telefono :", value: datos.celularPaciente || '' },
      { label: "", value: "" },
      { label: "Lugar de Procedencia :", value: datos.lugarProcedimiento || '' },
    ],
  ];
  for (const row of patientRows) {
    // Columna 1
    if (row[0]) {
      doc.setFontSize(8).setFont('helvetica', 'bold');
      doc.text(row[0].label.toUpperCase(), patientDataX1, yDatos);
      const labelW = doc.getTextWidth(row[0].label.toUpperCase());
      doc.setFont('helvetica', 'normal');
      doc.text(String(row[0].value).toUpperCase(), patientDataX1 + labelW + 2, yDatos);
    }
    // Columna 2
    if (row[1]) {
      doc.setFontSize(8).setFont('helvetica', 'bold');
      doc.text(row[1].label.toUpperCase(), patientDataX2, yDatos);
      const labelW2 = doc.getTextWidth(row[1].label.toUpperCase());
      doc.setFont('helvetica', 'normal');
      // Si es LUGAR DE PROCEDENCIA, aplicar maxWidth y salto de línea
      if (row[1].label.toUpperCase().includes('LUGAR DE PROCEDENCIA')) {
        doc.text(String(row[1].value).toUpperCase(), patientDataX2 + labelW2 + 2, yDatos, {
          maxWidth: pageW - (patientDataX2 + labelW2 + 10)
        });
      } else {
        doc.text(String(row[1].value).toUpperCase(), patientDataX2 + labelW2 + 2, yDatos);
      }
    }
    yDatos += lineHeight;
  }
  doc.setFontSize(11).setFont('helvetica', 'bold');
  doc.setFont('helvetica', 'normal').setFontSize(10).setLineWidth(0.2);

  footerEnHeader(doc, datos);
};

export default header_HistoriaOcupacional_Boro; 