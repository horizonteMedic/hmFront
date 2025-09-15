import { formatearFechaCorta } from "../../../utils/formatDateUtils";

/**
 * Header para ANEXO CB - ANTECEDENTES DE ALTURA (BORO)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {Object} datos - Datos del documento
 */
const Header_AnexoCB_boro_Digitalizado = (doc, datos = {}) => {
  // Datos por defecto para el header
  const headerData = {
    nombreSede: String(datos.sede || ""),
    numeroFicha:  String(datos.norden || ""),
    color: datos.color || 0,
    codigoColor: datos.codigoColor ,
    textoColor: datos.textoColor,
    // Datos del paciente
    apellidosNombres: `${datos.nombres ?? ""} ${datos.apellidos ?? ""}`,
    edad: String(datos.edad || ""),
    empresa: String(datos.empresa || ""),
    sexo: String(datos.sexo || ""),
    puestoTrabajo: String(datos.cargo || ""),
    fecha: formatearFechaCorta(datos?.antecedentes?.fechaAntecedente ?? ""),
  };

  const margin = 12;
  const marginRight = 14;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 12;

  // === 1) LOGO Y TÍTULO PRINCIPAL ===
  const logoW = 60;
  const logoH = 18;
  const logoY = y - 4;
  const logoX = margin;

  try {
    doc.addImage("./img/logo-color.png", "PNG", logoX, logoY, logoW, logoH);
  } catch (error) {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", logoX, logoY + 8);
  }

  // === 2) BLOQUE CÓDIGO DE COLOR ===
  const colorValido = typeof headerData.color === "number" && headerData.color >= 1 && headerData.color <= 500;
  const color = headerData.codigoColor || "#E3BF34";
  
  // Convertir M/F a texto completo
  let boxText = (headerData.textoColor || "L").toUpperCase();
  if (boxText === "M") {
    boxText = "MASCULINO";
  } else if (boxText === "F") {
    boxText = "FEMENINO";
  }
  
  // Ajustar el tamaño de la caja según el texto
  let boxSize = 15;
  if (boxText === "MASCULINO" || boxText === "FEMENINO") {
    boxSize = 35; // Caja más ancha para texto completo
  }
  
  let boxX = pageW - marginRight - boxSize;
  let boxY = y - 6.5;

  if (colorValido) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    
    // Ajustar el tamaño de fuente según el texto
    let fontSize = 25;
    if (boxText === "MASCULINO" || boxText === "FEMENINO") {
      fontSize = 8; // Fuente más pequeña para texto completo
    }
    
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + boxSize/2, {
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2);
  }

  y -= 7;

  // === 3) NÚMERO DE FICHA Y SEDE ===
  const fichaX = pageW - marginRight - 18;
  const bloqueY = y + 5;

  // Número de orden arriba
  const fichaValue = String(headerData.numeroFicha || '');

  doc.setFont("helvetica", "bold").setFontSize(9);
  const fichaLabel = "N° Ficha:";
  const fichaLabelWidth = doc.getTextWidth(fichaLabel);
  const fichaLabelX = fichaX - fichaLabelWidth - 25;

  doc.text(fichaLabel, fichaLabelX, bloqueY + 3, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(23);
  doc.text(fichaValue, fichaX, bloqueY + 3, { align: "right" });

  // === 4) SEDE ===
  const sedeValue = String(headerData.nombreSede || '');
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValueWidth = doc.getTextWidth(sedeValue);

  doc.setFont("helvetica", "bold").setFontSize(9);
  const sedeLabel = "Sede:";
  const sedeLabelWidth = doc.getTextWidth(sedeLabel);
  const sedeLabelX = fichaX - sedeValueWidth - sedeLabelWidth - 5;

  doc.text(sedeLabel, sedeLabelX, bloqueY + 10, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaX, bloqueY + 10, { align: "right" });

  // === 5) TÍTULO PRINCIPAL DEL DOCUMENTO ===
  y = y + 25;

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const titulo = "ENFERMEDADES QUE PUEDEN AGRAVARSE EN ALTITUD GEOGRÁFICA";
  const tituloX = pageW / 2;

  doc.text(titulo, tituloX, y, { align: "center" });

  // === 6) DATOS DEL PACIENTE ===
  y = y + 6;

  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("1. DATOS DEL PACIENTE", margin, y);

  y = y + 6;

  // Fila 1: Apellidos y Nombres | Edad
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelApellidos = "Apellidos y Nombres: ";
  doc.text(labelApellidos, margin, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const apellidosX = margin + doc.getTextWidth(labelApellidos) + 3;
  doc.text(headerData.apellidosNombres, apellidosX, y);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelEdad = "Edad: ";
  doc.text(labelEdad, pageW - marginRight - 45, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const edadX = pageW - marginRight - 45 + doc.getTextWidth(labelEdad) + 3;
  doc.text(headerData.edad + " años", edadX, y);

  y = y + 6;

  // Fila 2: Empresa | Sexo
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelEmpresa = "Empresa: ";
  doc.text(labelEmpresa, margin, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const empresaX = margin + doc.getTextWidth(labelEmpresa) + 3;
  
  // Calcular el ancho máximo disponible para empresa (sin afectar Sexo)
  const maxWidthEmpresa = pageW - marginRight - 45 - empresaX - 10; // 10 de separación
  
  // Dividir el texto de empresa si es muy largo
  const empresaTexto = doc.splitTextToSize(headerData.empresa, maxWidthEmpresa);
  doc.text(empresaTexto, empresaX, y);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelSexo = "Sexo: ";
  doc.text(labelSexo, pageW - marginRight - 45, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const sexoX = pageW - marginRight - 45 + doc.getTextWidth(labelSexo) + 3;
  
  // Convertir M/F a texto completo para el campo Sexo
  let sexoTexto = headerData.sexo;
  if (sexoTexto === "M") {
    sexoTexto = "MASCULINO";
  } else if (sexoTexto === "F") {
    sexoTexto = "FEMENINO";
  }
  
  doc.text(sexoTexto, sexoX, y);

  // Calcular la altura necesaria para empresa (mínimo 6, máximo según líneas)
  const alturaEmpresa = Math.max(6, empresaTexto.length * 4);
  y = y + alturaEmpresa;

  // Fila 3: Puesto de Trabajo | Fecha
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelPuesto = "Puesto de Trabajo: ";
  doc.text(labelPuesto, margin, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const puestoX = margin + doc.getTextWidth(labelPuesto) + 3;
  doc.text(headerData.puestoTrabajo, puestoX, y);
  
  doc.setFont("helvetica", "bold").setFontSize(9);
  const labelFecha = "Fecha: ";
  doc.text(labelFecha, pageW - marginRight - 45, y);
  doc.setFont("helvetica", "normal").setFontSize(9);
  const fechaX = pageW - marginRight - 45 + doc.getTextWidth(labelFecha) + 3;
  doc.text(headerData.fecha, fechaX, y);

  // === 7) CUADRO DE TEXTO "EL PRESENTE..." ===
  y = y + 5;

  const cuadroWidth = 190;
  const cuadroHeight = 12;
  const cuadroX = 10;
  const cuadroY = y;

  // Dibujar el cuadro
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(cuadroX, cuadroY, cuadroWidth, cuadroHeight);

  // Texto dentro del cuadro
  doc.setFont("helvetica", "normal").setFontSize(7);
  doc.setTextColor(0, 0, 0);
  
  const textoCuadro = "El presente listado de patologías deberá ser precisado por la persona que accederá a una operación minera en altitud geográfica. El Médico evaluador deberá evaluar los antecedentes y condición actual del paciente para determinar si es procedente o no el acceso del paciente a altitud geográfica. De ser necesario, el médico evaluador deberá solicitar las pruebas e interconsultas complementarias para evaluar el caso antes de emitir su conclusión.";
  
  doc.text(textoCuadro, cuadroX + 5, cuadroY + 5, {
    align: "justify",
    maxWidth: cuadroWidth - 10
  });

  return y + cuadroHeight + 0;
};

export default Header_AnexoCB_boro_Digitalizado;
