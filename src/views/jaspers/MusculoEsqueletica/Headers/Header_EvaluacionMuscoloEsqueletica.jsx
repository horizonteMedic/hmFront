const headerEvaluacionMuscoloEsqueletica = (doc, datos, mostrarFrame = true, numeroPagina = 1) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Datos de prueba
  const datosPrueba = {
    apellidosNombres: "FERNANDEZ VILLANUEVA JOEL JHONY",
    dni: "47053305",
    empresa: "CIA MINERA PODEROSA S A",
    contrata: "MINERA FALCON S.A.C.",
    fecha: "05/08/2025",
    edad: "35",
    areaTrabajo: "INTERIOR MINA",
    sexo: "M"
  };

  const datosReales = {
    apellidosNombres: datos?.paciente?.nombres ?? "",
    dni: datos?.paciente?.dni ?? "",
    empresa: datos?.paciente?.empresa ?? "",
    contrata: datos?.paciente?.contrata ?? "",
    fecha: datos?.fechaExamen ?? "",
    edad: datos?.paciente?.edad ?? "",
    areaTrabajo: datos?.paciente?.areaTrabajo ?? "",
    sexo: datos?.paciente?.sexo ?? "",
    sede: datos?.informacionSede?.sede ?? "",
    color: datos?.informacionSede?.color ?? "",
    codigoColor: datos?.informacionSede?.codigoColor.trim() ?? "",
    textoColor: datos?.informacionSede?.textoColor.trim() ?? "",
    norden: datos?.norden ?? ""
  };

  // Usar datos reales o datos de prueba
  const datosFinales = datos && Object.keys(datos).length > 0 ? datosReales : datosPrueba;

  // === NUEVO: Usar imagen de fondo para la cabecera ===
  if (mostrarFrame) {
    const fondoImg = "/img/Header_EvaluacionMusculoEsqueletica.png";
    const fondoH = 47; // altura aproximada de la cabecera en mm (ajusta si es necesario)
    let yHeader = 0; // Pegado a la parte superior
    try {
      doc.addImage(fondoImg, "PNG", 0, yHeader, pageW, fondoH); // Todo el ancho de la hoja
    } catch (e) {
      doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
    }
  }

  // Solo dibujar elementos del header en la página 1
  if (numeroPagina === 1) {
    // 3) Información de sede y número de ficha a la derecha
    const sedeValue = datosFinales.sede || '';
    
    // Número de ficha primero - con posiciones independientes
    const fichaNum = String(datosFinales.norden ?? "") ;
    const fichaX = pageW - margin - 20; // Posición X independiente
    const fichaY = y + 10.5; // Posición Y independiente
    
    // Número de ficha grande (sin subrayado) - sin etiqueta
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text(fichaNum, fichaX, fichaY);
    
    // Subrayado del número de ficha QUITADO
    
    // Sede debajo del número de ficha - con posiciones independientes
    const sedeX2 = pageW - margin - 18; // Posición X independiente
    const sedeY2 = y + 4; // Posición Y independiente
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`Sede : ${sedeValue}`, sedeX2, sedeY2, { align: "right" });

    // === BLOQUE CÓDIGO DE COLOR ===
    const colorValido = typeof datosFinales.color === "number" && datosFinales.color >= 1 && datosFinales.color <= 50;
    if (colorValido) {
      const color = datosFinales.codigoColor || "#008f39";
      const boxText = (datosFinales.textoColor || "F").toUpperCase();
      let boxSize = 15;
      let boxX = pageW - margin - boxSize; // Posición X independiente
      let boxY = y - 11; // Subido 20 puntos (antes y + 2, ahora y - 18)
      
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
      doc.setFontSize(22); // Aumentado de 18 a 22 para letra más grande
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

    // 4) NÚMERO DE PÁGINA - con posiciones independientes
    const pagX = sedeX2; // Alineado con la sede
    const pagY = sedeY2 - 5; // 3 puntos arriba de la sede
    doc.setFont("helvetica", "normal").setFontSize(12);
    doc.text(`Pag. ${numeroPagina}`, pagX, pagY, { align: "right" });

    // === 5) DATOS DEL PACIENTE ===
    // Solo mostrar datos del paciente en la página 1
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Apellidos y Nombres
    const xApellidosNombres = margin + 32;
    const yApellidosNombres = margin + 19;
    doc.text(String(datosFinales.apellidosNombres || "").toUpperCase(), xApellidosNombres, yApellidosNombres, { maxWidth: 90 });

    // DNI
    const xDni = margin + 32;
    const yDni = margin + 25;
    doc.text(String(datosFinales.dni || "").toUpperCase(), xDni, yDni);

    // Empresa
    const xEmpresa = margin + 32;
    const yEmpresa = margin + 30;
    doc.text(String(datosFinales.empresa || "").toUpperCase(), xEmpresa, yEmpresa, { maxWidth: 170 });

    // Contrata
    const xContrata = margin + 32;
    const yContrata = margin + 36;
    doc.text(String(datosFinales.contrata || "").toUpperCase(), xContrata, yContrata, { maxWidth: 170 });

    // Fecha
    const xFecha = margin + 132;
    const yFecha = margin + 19;
    let fechaFormateada = datosFinales.fecha || "";
    
    // Formatear fecha a DD/MM/YYYY si viene en formato YYYY-MM-DD
    if (fechaFormateada && fechaFormateada.includes("-")) {
      const [yyyy, mm, dd] = fechaFormateada.split("-");
      fechaFormateada = `${dd}/${mm}/${yyyy}`;
    }
    
    doc.text(fechaFormateada, xFecha, yFecha);

    // Edad
    const xEdad = margin + 70;
    const yEdad = margin + 25;
    const edadTexto = datosFinales.edad ? `${datosFinales.edad} AÑOS` : "";
    doc.text(edadTexto, xEdad, yEdad);

    // Área de Trabajo
    const xAreaTrabajo = margin + 122;
    const yAreaTrabajo = margin + 25;
    doc.setFontSize(8);
    doc.text(String(datosFinales.areaTrabajo || "").toUpperCase(), xAreaTrabajo, yAreaTrabajo, { maxWidth: 75 });

    // Sexo
    const xSexo = margin + 175;
    const ySexo = margin + 19;
    let sexoTexto = "";
    if (datosFinales.sexo === "M" || datosFinales.sexo === "m") {
      sexoTexto = "MASCULINO";
    } else if (datosFinales.sexo === "F" || datosFinales.sexo === "f") {
      sexoTexto = "FEMENINO";
    }
    doc.text(sexoTexto, xSexo, ySexo);
  } else {
    // Para la página 2, mostrar solo: número de página, sede y bloque de color
    const sedeValue = datosFinales.sede || 'Trujillo-Pierola';
    
    // Sede en la esquina superior derecha
    const sedeX2 = pageW - margin - 18;
    const sedeY2 = y + 4;
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`Sede : ${sedeValue}`, sedeX2, sedeY2, { align: "right" });

    // === BLOQUE CÓDIGO DE COLOR ===
    const color = datosFinales.codigoColor || "#008f39";
    const boxText = (datosFinales.textoColor || "F").toUpperCase();
    let boxSize = 15;
    let boxX = pageW - margin - boxSize;
    let boxY = y - 11;
    
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
    doc.setFontSize(22);
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

    // Número de página debajo de la sede
    const pagX = sedeX2;
    const pagY = sedeY2 - 5;
    doc.setFont("helvetica", "normal").setFontSize(12);
    doc.text(`Pag. ${numeroPagina}`, pagX, pagY, { align: "right" });
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerEvaluacionMuscoloEsqueletica;
