/**
 * Header para FICHA DE EVALUACIÓN AUDIOMÉTRICA (logo izq, título centrado, ficha/sede derecha)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado_boro = (doc, datos = {}) => {
  const margin = 10;
  const pageW  = doc.internal.pageSize.getWidth();
  let   y      = 12;

  // 1) Logo a la izquierda
  const logoW = 38, logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "normal")
       .setFontSize(9)
       .text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2) BLOQUE "No Ficha" / "Sede" (alineados uno debajo del otro, a la derecha)
  const fichaBlockX = pageW - margin;
  const fichaBlockY = y + 2;
  const fichaValue   = String(datos.nroficha || "96639");
  const sedeValue    = String(datos.sede     || "Trujillo-Pierola");

  // No Ficha (solo el valor, alineado a la derecha)
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(fichaValue, fichaBlockX, fichaBlockY, { align: "right" });

  // Sede (solo el valor, alineado a la derecha, justo debajo, más cerca)
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(sedeValue, fichaBlockX, fichaBlockY + 5, { align: "right" });

  // 3) TÍTULO perfectamente centrado
  doc.setFont("helvetica", "bold").setFontSize(12);
  const titulo  = "FICHA DE EVALUACIÓN AUDIOMÉTRICA";
  const tituloY = y + 10;
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });
  // subrayado
  const w = doc.getTextWidth(titulo);
  doc.setLineWidth(0.7)
     .line((pageW - w) / 2, tituloY + 2, (pageW + w) / 2, tituloY + 2)
     .setLineWidth(0.2);

  // 4) Datos del paciente en filas
  let datosY = y + 22;
  const labelW = 34;
  const sep    = 3;
  const col2X  = pageW / 2 - 10;
  const col3X  = pageW - margin - 60;
  const rowH   = 5.2;
  doc.setFontSize(8);

  // Fila 1: Apellidos y Nombres | Edad | Sexo
  const labelNombre = "APELLIDOS Y NOMBRES:";
  const labelEdad = "EDAD:";
  const labelSexo = "SEXO:";
  let xNombre = margin;
  let xEdad = margin + 95;
  let xSexo = margin + 160;
  doc.setFont("helvetica", "bold");
  doc.text(labelNombre, xNombre, datosY);
  doc.setFont("helvetica", "normal");
  const nombreValor = String(datos.nombres || "CASTILLO PLASENCIA HADY KATHERINE").toUpperCase();
  doc.text(nombreValor, xNombre + doc.getTextWidth(labelNombre) + 2, datosY);

  doc.setFont("helvetica", "bold");
  doc.text(labelEdad, xEdad, datosY);
  doc.setFont("helvetica", "normal");
  const edadValor = String(datos.edad || "30 AÑOS").toUpperCase();
  doc.text(edadValor, xEdad + doc.getTextWidth(labelEdad) + 2, datosY);

  doc.setFont("helvetica", "bold");
  doc.text(labelSexo, xSexo, datosY);
  doc.setFont("helvetica", "normal");
  const sexoValor = String(datos.sexo || "F").toUpperCase();
  doc.text(sexoValor, xSexo + doc.getTextWidth(labelSexo) + 2, datosY);

  // Fila 2: Empresa | Puesto de Trabajo | Fecha
  datosY += rowH;
  const labelEmpresa = "EMPRESA:";
  const labelCargo = "PUESTO DE TRABAJO:";
  const labelFecha = "FECHA:";
  let xEmpresa = margin;
  let xCargo = margin + 95;
  let xFecha = margin + 160;
  doc.setFont("helvetica", "bold");
  doc.text(labelEmpresa, xEmpresa, datosY);
  doc.setFont("helvetica", "normal");
  const empresaValor = String(datos.empresa || "MINERA BOROO MISQUICHILCA S.A.").toUpperCase();
  doc.text(empresaValor, xEmpresa + doc.getTextWidth(labelEmpresa) + 2, datosY);

  doc.setFont("helvetica", "bold");
  doc.text(labelCargo, xCargo, datosY);
  doc.setFont("helvetica", "normal");
  const cargoValor = String(datos.cargo || "OPERACIONES").toUpperCase();
  doc.text(cargoValor, xCargo + doc.getTextWidth(labelCargo) + 2, datosY);

  doc.setFont("helvetica", "bold");
  doc.text(labelFecha, xFecha, datosY);
  doc.setFont("helvetica", "normal");
  // Formatear fecha yyyy-mm-dd a dd/mm/yyyy
  let fechaStr = String(datos.fecha || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const [y, m, d] = fechaStr.split('-');
    fechaStr = `${d}/${m}/${y}`;
  }
  doc.text(fechaStr, xFecha + doc.getTextWidth(labelFecha) + 2, datosY);

  // restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_Audiometria2021_Digitalizado_boro;
