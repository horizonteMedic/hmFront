/**
 * Header maqueta para RADIOGRAFÍA DE TORAX P.A REPORTE POR FECHAS
 * @param {jsPDF} doc - Instancia de jsPDF
 */
// === FOOTER FICHA RADIOGRAFÍA CABECERA ===
function footerFichaRadiografiaCabecera(doc, opts = {}, datos = {}) {
  const margin = 15;
  const logoW = 38;
  const y = 12;
  const xOffset = opts.xOffset !== undefined ? opts.xOffset : 25;
  const fontSize = opts.fontSize !== undefined ? opts.fontSize : 6;
  const yOffset = opts.yOffset !== undefined ? opts.yOffset : -8;
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

const HeaderReporteFechasRadiografia = (doc, datos) => {
  // Función para formatear fechas en DD/MM/YYYY
  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    // Si ya está en formato DD/MM/YYYY, retornar tal como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      return fecha;
    }

    // Si está en formato YYYY-MM-DD, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split("-");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato YYYY/MM/DD, convertir
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split("/");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato DD-MM-YYYY, convertir
    if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
      const [day, month, year] = fecha.split("-");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato MM/DD/YYYY (formato americano), convertir
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
      const partes = fecha.split("/");
      if (partes.length === 3) {
        const [month, day, year] = partes;
        // Validar que sea formato americano (mes <= 12)
        if (parseInt(month) <= 12 && parseInt(day) <= 31) {
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
      }
    }

    // Si está en formato DD.MM.YYYY (con puntos), convertir
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(fecha)) {
      const [day, month, year] = fecha.split(".");
      return `${day}/${month}/${year}`;
    }

    // Si está en formato YYYY.MM.DD (con puntos), convertir
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split(".");
      return `${day}/${month}/${year}`;
    }

    // Para cualquier otro formato, intentar parsear como Date y convertir
    try {
      const fechaObj = new Date(fecha);
      if (!isNaN(fechaObj.getTime())) {
        const day = fechaObj.getDate().toString().padStart(2, '0');
        const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const year = fechaObj.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (error) {
      // Si falla el parsing, continuar
    }

    // Si no coincide con ningún formato conocido, retornar tal como está
    return fecha;
  };

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
  footerFichaRadiografiaCabecera(doc, { xOffset: 25, fontSize: 6, yOffset: -8 }, datos);

  // 2) TÍTULO centrado - RADIOGRAFÍA DE TORAX P.A
  const titulo1 = "RADIOGRAFÍA DE TORAX P.A";
  const titulo2 = "REPORTE POR FECHAS";
  const tituloY = y + 20; // Bajado de 12 a 20
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(titulo1, pageW / 2, tituloY, { align: "center" });
  doc.text(titulo2, pageW / 2, tituloY + 6, { align: "center" });

  // 3) Información de sede y fecha de impresión a la derecha
  const sedeValue = `${datos.sede || 'Trujillo-Pierola'}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6; // Mantenido en posición original
  
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY, { align: "right" });
  
  // Fecha de impresión del reporte
  const fechaImpresion = datos.fechaImpresion || new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Fecha Impresión Reporte ${fechaImpresion}`, sedeX, sedeY + 6, { align: "right" });

  // === BLOQUE CÓDIGO DE COLOR ===
  // Prueba: si no hay datos.color, usar uno de ejemplo
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 150;
  if (colorValido) {
    const color = datos.codigoColor || "#008f39";
    const boxText = (datos.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y + 2;
    
    // Forzar a mostrar para prueba visual - siempre mostrar
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

  // 4) Rango de fechas centrado en la parte inferior
  const desdeFecha = formatearFecha(datos.desdeFecha) || "";
  const hastaFecha = formatearFecha(datos.hastaFecha) || "";
  const fechaRangoY = y + 35; // Bajado de 25 a 35
  
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Desde : ${desdeFecha} Hasta : ${hastaFecha}`, pageW / 2, fechaRangoY, { align: "center" });

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default HeaderReporteFechasRadiografia; 