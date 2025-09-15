/**
 * Header maqueta para RADIOGRAFÍA DE TORAX P.A
 * @param {jsPDF} doc - Instancia de jsPDF
 */
// === FOOTER FICHA RADIOGRAFÍA CABECERA ===
function footerFichaRadiografiaCabecera(doc, opts = {}, datos = {}) {
  const margin = 15;
  const logoW = 38;
  const y = 12;
  const xOffset = opts.xOffset;
  const fontSize = opts.fontSize;
  const yOffset = opts.yOffset;
  const baseX = margin + logoW + 8 - xOffset;
  let yFila = y + 2 + yOffset;
  const rowH = 3.2;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  const filas = [
    {
      direccion: datos?.dirTruPierola || "Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando Cel. 964385075",
      celular: datos?.celTrujilloPie || "",
      email: datos?.emailTruPierola || "",
      telefono: datos?.telfTruPierola || "Cl. Guillermo Prescott N°127 Urb. Sto. Dominguito Telf. 044-767608"
    },
    {
      direccion: datos?.dirHuamachuco || "Sede Huamachuco: Jr. Leoncio Prado N°786",
      celular: datos?.celHuamachuco || "Cel. 990094744-969603777",
      email: datos?.emailHuamachuco || "",
      telefono: datos?.telfHuamachuco || "Telf. 044-348070"
    },
    {
      direccion: datos?.dirHuancayo || "Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo",
      celular: datos?.celHuancayo || "",
      email: datos?.emailHuancayo || "",
      telefono: datos?.telfHuancayo || "Telf. 064-659554"
    }
  ];
  filas.forEach((fila) => {
    let x = baseX;
    if (fila.direccion) {
      const idx2 = fila.direccion.indexOf(":");
      if (idx2 !== -1) {
        const sedeNombre = fila.direccion.substring(0, idx2 + 1);
        const sedeResto = fila.direccion.substring(idx2 + 1);
        doc.setFont('helvetica', 'bold');
        doc.text(sedeNombre, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeNombre) + 2;
        doc.setFont('helvetica', 'normal');
        doc.text(sedeResto, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(sedeResto) + 6;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(fila.direccion, x, yFila, { baseline: 'top' });
        x += doc.getTextWidth(fila.direccion) + 6;
      }
    }
    if (fila.celular) {
      doc.setFont('helvetica', 'bold');
      doc.text('Cel.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Cel.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.celular}`, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(` ${fila.celular}`) + 6;
    }
    if (fila.email) {
      doc.setFont('helvetica', 'normal');
      doc.text(fila.email, x, yFila, { baseline: 'top' });
      x += doc.getTextWidth(fila.email) + 6;
    }
    if (fila.telefono) {
      doc.setFont('helvetica', 'bold');
      doc.text('Telf.', x, yFila, { baseline: 'top' });
      x += doc.getTextWidth('Telf.');
      doc.setFont('helvetica', 'normal');
      doc.text(` ${fila.telefono}`, x, yFila, { baseline: 'top' });
    }
    yFila += rowH;
  });
  
  // Agregar website
  doc.setFont('helvetica', 'normal').setFontSize(6);
  doc.text("Web : www.horizontemedic.com", baseX, yFila + 2);
}

const HeaderRagiografiaToraxPA = (doc, datos) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // 1) Logo a la izquierda
  const logoW = 60,
    logoH = 20;
  const logoY = y + 10;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // Footer horizontal de cabecera (datos de contacto)
  footerFichaRadiografiaCabecera(doc, { xOffset: 30, fontSize: 6, yOffset: -13 }, datos);
  // 3) Sección de datos del paciente
  const datosPacienteY = y + 35; // Bajado de 35 a 45
  const datosPacienteX = margin + 25;
  
  // Título "EXAMEN" centrado y con fuente más grande
  doc.setFont("helvetica", "normal").setFontSize(15);
  const examTitle = "EXAMEN : RADIOGRAFIA DE TORAX P.A";
  const examTitleX = pageW / 2;
  doc.text(examTitle, examTitleX, datosPacienteY + 5, { align: "center" }); // Bajado 5 puntos
  
  // Subrayar el texto del examen - LÍNEA ARRIBA DEL TEXTO
  const examWidth = doc.getTextWidth(examTitle);
  const examX = examTitleX - examWidth / 2;
  doc.setLineWidth(0.3);
  doc.line(examX, datosPacienteY + 6, examX + examWidth, datosPacienteY + 6); // Línea arriba del texto
  
    function formatearFecha(fechaStr) {
  if (!fechaStr) return ""; // Si está vacío
  
  const [anio, mes, dia] = fechaStr.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia); // Fecha local
  
  const diasSemana = [
    "DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", 
    "JUEVES", "VIERNES", "SÁBADO"
  ];
  
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  
  const diaSemana = diasSemana[fecha.getDay()];
  const diaMes = fecha.getDate();
  const nombreMes = meses[fecha.getMonth()];
  
  return `${diaSemana} ${diaMes} DE ${nombreMes} DEL ${anio}`;
}
  // Datos del paciente - todos en mayúsculas y labels en negrita
  const pacienteData = [
    { label: "NOMBRES", value: (datos.nombres || "").toUpperCase() },
    { label: "APELLIDOS", value: (datos.apellidos || "").toUpperCase() },
    { label: "FECHA", value: formatearFecha(datos.fechaExamen || "") },
    { label: "EDAD", value: datos.edad ? `${datos.edad} AÑOS` : "" }
  ];
  
  // Calcular el ancho máximo de los labels para alinearlos
  const maxLabelWidth = Math.max(...pacienteData.map(item => doc.getTextWidth(item.label)));
  const labelSpacing = 15; // Espacio entre label y valor
  
  let pacienteY = datosPacienteY + 20; // Ajustar posición después del título centrado
  pacienteData.forEach(item => {
    // Label en negrita con fuente más grande (9 + 1.5 = 10.5)
    doc.setFont("helvetica", "bold").setFontSize(10.5);
    doc.text(item.label, datosPacienteX, pacienteY);
    
    // Agregar los dos puntos alineados
    const labelX = datosPacienteX + maxLabelWidth + 5; // 5 puntos de separación
    doc.text(":", labelX, pacienteY);
    
    // Valor en normal con fuente más grande (9 + 1.5 = 10.5)
    doc.setFont("helvetica", "normal").setFontSize(10.5);
    doc.text(item.value, labelX + 5 + labelSpacing, pacienteY);
    
    pacienteY += 5;
  });

  // 4) Información de sede y número de ficha a la derecha (al costado del bloque de color)
  const sedeValue = `${datos.sede || ''}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  
  // Número de ficha primero
  const fichaNum = `${datos.norden || ""}`;

  const fichaY = sedeY;
  
  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 40;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("N° Ficha :", fichaLabelX, fichaY);
  
  // Número de ficha grande y subrayado
  const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
  doc.setFont("helvetica", "bold").setFontSize(22);
  doc.text(fichaNum, fichaNumX, fichaY);
  
  // Subrayar el número de ficha
  const fichaWidth = doc.getTextWidth(fichaNum);
  doc.setLineWidth(0.3);
  doc.line(fichaNumX, fichaY + 1, fichaNumX + fichaWidth, fichaY + 1);
  
  // Sede debajo del número de ficha
  const sedeY2 = sedeY + 8;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // === BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 500;
  if (colorValido) {
    const color = datos.codigoColor || "#008f39";
    const boxText = (datos.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;
    
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido o para prueba
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap("round");
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap("butt");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize / 2, boxY + boxSize / 2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1,
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default HeaderRagiografiaToraxPA;
