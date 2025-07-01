/**
 * Formatea una fecha en formato "19 diciembre 2024".
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 * @returns {string} - La fecha formateada.
 */
const formatDateToLong = (dateString) => {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Dibuja el encabezado para el reporte de Prueba Cuantitativa de Antígenos.
 * @param {jsPDF} doc - La instancia del documento jsPDF.
 * @param {object} datos - Los datos a imprimir.
 */
const header_PCuantiAntigeno = (doc, datos = {}) => {
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 10;

  // 1. Logo a la izquierda
  const img = "./img/logo-color.png";
  try {
    doc.addImage(img, "PNG", margin, y, 60, 20);
  } catch (error) {
    console.error("No se pudo cargar el logo.", error);
    doc.text("Policlinico Horizonte Medic", margin, y + 8);
  }

  // 2. Número a la derecha
  const numeroValue = String(datos.norden || "");
  doc.setFont("helvetica", "bold").setFontSize(17);
  doc.text(numeroValue, pageW - margin - 40, y + 10, { align: "right" });

  // 3. Datos del paciente (debajo)
  y += 30;
  const labelX = margin;
  const valueX = margin + 35;
  const lineHeight = 9;

  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("PACIENTE:", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombre || datos.nombres || ""}`, valueX, y);
  y += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("EDAD :", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.edad ? `${datos.edad} años` : "", valueX, y);
  y += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("DNI:", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dni || ""), valueX, y);
  y += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("FECHA :", labelX, y);
  doc.setFont("helvetica", "normal");
  let fecha = datos.fechaExamen || "";
  if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    // yyyy-mm-dd => dd/mm/yyyy
    const [a, m, d] = fecha.split("-");
    fecha = `${d}/${m}/${a}`;
  }
  doc.text(fecha, valueX, y);

  doc.setFont("helvetica", "normal").setFontSize(10);
};

export default header_PCuantiAntigeno;
