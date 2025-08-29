import headerAnexoCB_boro from "./Header/Header_AnexoCB_boro_Digitalizado";

/**
 * AnexoCB_boro_Digitalizado - Documento completo con header y tabla de datos del paciente
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {Object} datos - Datos del documento y paciente
 */
const AnexoCB_boro_Digitalizado = (doc, datos = {}) => {
  // Datos de prueba por defecto
  const datosPrueba = {
    apellidos: "DELGADO VEGA",
    nombres: "VIVIANA AYDE",
    dni: "75461024",
    fechaNacimiento: "19/03/2000",
    edad: "25",
    sexo: "FEMENINO",
    direccion: "AV. EL PELIGRO",
    empresaContratista: "CORPORACION PERUANA DE CENTROS MEDICOS SAC",
    empresa: "MONARCA GOLD S.A.C.",
    actividadRealizar: "CAPATAZ",
    sede: "Trujillo-Pierola",
    norden: "99164",
    color: 1,
    codigoColor: "#FFA500",
    textoColor: "T"
  };

  // Combinar datos de prueba con datos reales
  const datosFinales = datos && Object.keys(datos).length > 0 ? datos : datosPrueba;

  // === HEADER ===
  headerAnexoCB_boro(doc, datosFinales);

  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 50; // Empezar después del header

  // === TÍTULO "DATOS DEL PACIENTE" ===
  const tituloY = y;
  doc.setFont("helvetica", "bold").setFontSize(14);
  const titulo = "DATOS DEL PACIENTE";
  const tituloX = pageW / 2;
  doc.text(titulo, tituloX, tituloY, { align: "center" });

  // === TABLA DE DATOS DEL PACIENTE ===
  const tablaY = tituloY + 8;
  const tableX = margin + 20;
  const tableY = tablaY;
  const tableW = pageW - 2 * (margin + 20);
  const tableH = 32; // Altura para 4 filas

  // Marco de la tabla
  doc.setLineWidth(0.5);
  doc.rect(tableX, tableY, tableW, tableH);

  // Líneas horizontales internas para separar las 4 filas
  doc.line(tableX, tableY + 8, tableX + tableW, tableY + 8);   // Fila 1
  doc.line(tableX, tableY + 16, tableX + tableW, tableY + 16); // Fila 2
  doc.line(tableX, tableY + 24, tableX + tableW, tableY + 24); // Fila 3

  // Líneas verticales para separar columnas
  // Fila 1: Apellidos (50%) + Nombres (50%)
  const col1W = tableW * 0.5;
  doc.line(tableX + col1W, tableY, tableX + col1W, tableY + 8);

  // Fila 2: DNI (25%) + Fecha Nacimiento (25%) + Edad (25%) + Sexo (25%)
  const col2W = tableW * 0.25;
  doc.line(tableX + col2W, tableY + 8, tableX + col2W, tableY + 16);
  doc.line(tableX + col2W * 2, tableY + 8, tableX + col2W * 2, tableY + 16);
  doc.line(tableX + col2W * 3, tableY + 8, tableX + col2W * 3, tableY + 16);

  // Fila 3: Dirección (100%)
  // No necesita líneas verticales

  // Fila 4: Empresa Contratista (33.33%) + Empresa (33.33%) + Actividad (33.33%)
  const col4W = tableW / 3;
  doc.line(tableX + col4W, tableY + 16, tableX + col4W, tableY + 24);
  doc.line(tableX + col4W * 2, tableY + 16, tableX + col4W * 2, tableY + 24);

  // Contenido de la tabla
  doc.setFont("helvetica", "normal").setFontSize(8);

  // Primera fila - Apellidos y Nombres (2 celdas)
  // Primera celda: Apellidos
  doc.setFont("helvetica", "normal");
  doc.text("Apellidos :", tableX + 2, tableY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.apellidos || "", tableX + 25, tableY + 5);

  // Segunda celda: Nombres
  doc.setFont("helvetica", "normal");
  doc.text("Nombres :", tableX + col1W + 2, tableY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.nombres || "", tableX + col1W + 25, tableY + 5);

  // Segunda fila - DNI, Fecha Nacimiento, Edad, Sexo (4 celdas)
  // Primera celda: DNI
  doc.setFont("helvetica", "normal");
  doc.text("DNI / CE / NIE :", tableX + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.dni || "", tableX + 25, tableY + 13);

  // Segunda celda: Fecha Nacimiento
  doc.setFont("helvetica", "normal");
  doc.text("Fecha Nacimiento(dd/mm/aa) :", tableX + col2W + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.fechaNacimiento || "", tableX + col2W + 25, tableY + 13);

  // Tercera celda: Edad
  doc.setFont("helvetica", "normal");
  doc.text("Edad :", tableX + col2W * 2 + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.edad + " AÑOS" || "", tableX + col2W * 2 + 25, tableY + 13);

  // Cuarta celda: Sexo
  doc.setFont("helvetica", "normal");
  doc.text("Sexo :", tableX + col2W * 3 + 2, tableY + 13);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.sexo || "", tableX + col2W * 3 + 25, tableY + 13);

  // Tercera fila - Dirección (1 celda)
  doc.setFont("helvetica", "normal");
  doc.text("Dirección :", tableX + 2, tableY + 21);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.direccion || "", tableX + 25, tableY + 21);

  // Cuarta fila - Empresa Contratista, Empresa, Actividad (3 celdas)
  // Primera celda: Empresa Contratista
  doc.setFont("helvetica", "normal");
  doc.text("Empresa Contratista :", tableX + 2, tableY + 29);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.empresaContratista || "", tableX + 25, tableY + 29);

  // Segunda celda: Empresa
  doc.setFont("helvetica", "normal");
  doc.text("Empresa :", tableX + col4W + 2, tableY + 29);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.empresa || "", tableX + col4W + 25, tableY + 29);

  // Tercera celda: Actividad a Realizar
  doc.setFont("helvetica", "normal");
  doc.text("Actividad a Realizar :", tableX + col4W * 2 + 2, tableY + 29);
  doc.setFont("helvetica", "bold");
  doc.text(datosFinales.actividadRealizar || "", tableX + col4W * 2 + 25, tableY + 29);

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default AnexoCB_boro_Digitalizado;
