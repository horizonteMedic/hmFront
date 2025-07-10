/**
 * Header para FICHA AUDIOLOGICA (solo texto, sin líneas ni cuadros, alineado como en CuestionarioAudiometria_Digitalizado.jsx)
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_FichaAudiologica_Digitalizado = (doc, datos = {}) => {
  const margin = 18;
  const pageW  = doc.internal.pageSize.getWidth();
  let   y      = 16;

  // 1) Logo a la izquierda
  const logoW = 28, logoH = 13;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, y, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "normal").setFontSize(10)
       .text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2) N° Ficha y Sede (arriba derecha)
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text(String(datos.nroficha || "95877"), pageW - margin, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.sede || "Trujillo-Pierola"), pageW - margin, y + 12, { align: "right" });

  // 3) TÍTULO centrado
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("FICHA AUDIOLOGICA", pageW / 2, y + 22, { align: "center" });

  y += 30;
  // 4) Datos principales en filas, alineados
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Fecha del Examen:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.fecha || "01/07/2025"), margin + 45, y);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Ficha Audiológica:", pageW/2, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.nroficha || "95877"), pageW/2 + 38, y);

  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Apellidos y Nombres:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.nombres || "ROJAS SIGUENZA JOSUE SPENCER"), margin + 55, y);

  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Edad:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.edad || "29 AÑOS"), margin + 18, y);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Sexo:", margin + 45, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.sexo || "M"), margin + 60, y);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Ocupación:", margin + 75, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.ocupacion || "ADMINISTRADOR"), margin + 105, y);

  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Empresa Contratista:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.empresaContratista || "CONSTRUCTORA E INMOBILIARIA JAMELY E.I. R.L."), margin + 48, y);

  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Empresa:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.empresa || "OBRASCON HUARTE LAIN S.A"), margin + 25, y);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Años de Trabajo:", pageW/2, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.aniosTrabajo || "2"), pageW/2 + 35, y);
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Tiempo de exposición:", pageW/2 + 50, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(datos.tiempoExposicion || "5 H/D"), pageW/2 + 90, y);

  // Audiómetro y datos técnicos
  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Audiómetro:", margin, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Marca: AMPLIVOX", margin + 30, y);
  doc.text("Modelo: BELL PLUS", margin + 70, y);
  doc.text("Calibración: 01/07/2025", margin + 120, y);

  // Restaurar fuente normal
  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_FichaAudiologica_Digitalizado;
