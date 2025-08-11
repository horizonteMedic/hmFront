const headerEvaluacionMuscoloEsqueletica = (doc, datos, mostrarFrame = true, numeroPagina = 1) => {
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // Datos de prueba
  const datosPrueba = {
    nombres: "JUAN CARLOS PÉREZ GONZÁLEZ CAPORALES",
    edad: "38",
    sexo: "M",
    fecha: "15/12/2024",
    empresa: "ESTE ES UNA EMPRESA MUY LARGO PARA VER COMO SE VE EN LA HOJA",
    areaTrabajo: "ESTE ES UN AREA DE TRABAJO MUY LARGO PARA VER COMO SE VE EN LA HOJ",
    cargo: "ESTE ES UN CARGO MUY LARGO PARA VER COMO SE VE EN LA HOJA"
  };

  // Usar datos reales o datos de prueba
  const datosFinales = datos && Object.keys(datos).length > 0 ? datos : datosPrueba;

  // === NUEVO: Usar imagen de fondo para la cabecera ===
  if (mostrarFrame) {
    const fondoImg = "/img/header_EvaluacionMusculoEsqueletica_boro.png";
    const fondoH = 47; // altura aproximada de la cabecera en mm (ajusta si es necesario)
    let yHeader = 0; // Pegado a la parte superior
    try {
      doc.addImage(fondoImg, "PNG", 0, yHeader, pageW, fondoH); // Todo el ancho de la hoja
    } catch (e) {
      doc.text("Imagen de cabecera no disponible", margin, yHeader + 10);
    }
  }

  // 2) TÍTULO centrado - FICHA DE EVALUACIÓN MÚSCULO ESQUELÉTICA
  const titulo1 = "FICHA DE EVALUACIÓN MÚSCULO";
  const titulo2 = "ESQUELÉTICA";
  const tituloY = y - 4; // Subido de y + 15 a y + 8
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(titulo1, pageW / 2, tituloY, { align: "center" });
  doc.text(titulo2, pageW / 2, tituloY + 6, { align: "center" });
  
  // Subrayado para los títulos
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  const titulo1Width = doc.getTextWidth(titulo1);
  const titulo2Width = doc.getTextWidth(titulo2);
  doc.line((pageW - titulo1Width) / 2, tituloY + 1, (pageW + titulo1Width) / 2, tituloY + 1);
  doc.line((pageW - titulo2Width) / 2, tituloY + 7, (pageW + titulo2Width) / 2, tituloY + 7);

  // 3) Información de sede y número de ficha a la derecha
  const sedeValue = datosFinales.sede || 'Trujillo-Pierola';
  const sedeX = pageW - margin - 25;
  const sedeY = y + 1; // Subido de y + 6 a y + 2
  
  // Número de ficha primero
  const fichaNum = datosFinales.norden || datosFinales.numeroFicha || datosFinales.nroFicha || "96639";
  const fichaY = sedeY;
  
  // Texto "N° Ficha :" delante del número
  const fichaLabelX = sedeX - 45;
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
  const sedeY2 = sedeY + 5;
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

  // 4) NÚMERO DE PÁGINA
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Pag. ${numeroPagina}`, pageW - margin, margin + 5, { align: "right" });

  // === 5) DATOS DEL PACIENTE ===
  // Solo mostrar datos del paciente en la página 1
  if (numeroPagina === 1) {
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Nombre completo
    const xNombres = margin + 20.5;
    const yNombres = margin + 18;
    doc.text(String(datosFinales.nombres || ""), xNombres, yNombres, { maxWidth: 90 });

    // Edad
    const xEdad = margin + 122.5;
    const yEdad = margin + 18;
    const edadTexto = datosFinales.edad ? `${datosFinales.edad} años` : "";
    doc.text(edadTexto, xEdad, yEdad);

    // Sexo
    const xSexo = margin + 148.5;
    const ySexo = margin + 18;
    doc.text(String(datosFinales.sexo || ""), xSexo, ySexo);

    // Fecha
    const xFecha = margin + 167;
    const yFecha = margin + 18;
    let fechaFormateada = datosFinales.fecha || "";
    
    // Formatear fecha a DD/MM/YYYY si viene en formato YYYY-MM-DD
    if (fechaFormateada && fechaFormateada.includes("-")) {
      const [yyyy, mm, dd] = fechaFormateada.split("-");
      fechaFormateada = `${dd}/${mm}/${yyyy}`;
    }
    
    doc.text(fechaFormateada, xFecha, yFecha);

    // Empresa
    const xEmpresa = margin + 20.5;
    const yEmpresa = margin + 25;
    doc.text(String(datosFinales.empresa || ""), xEmpresa, yEmpresa, { maxWidth: 170 });

    // Área de Trabajo
    const xAreaTrabajo = margin + 28;
    const yAreaTrabajo = margin + 31.5;
    doc.setFontSize(8);
    doc.text(String(datosFinales.areaTrabajo || ""), xAreaTrabajo, yAreaTrabajo, { maxWidth: 75 });

    // Cargo
    const xCargo = margin + 116;
    const yCargo = margin + 31.5;
    doc.text(String(datosFinales.cargo || ""), xCargo, yCargo, { maxWidth: 80 });
  }

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default headerEvaluacionMuscoloEsqueletica;
