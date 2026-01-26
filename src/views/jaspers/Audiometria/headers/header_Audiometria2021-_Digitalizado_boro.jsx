import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';

/**
 * Header para FICHA DE EVALUACIÓN AUDIOMETRÍA
 * @param {jsPDF} doc - Instancia de jsPDF
 * @param {object} datos - Datos del paciente y ficha
 */
const header_Audiometria2021_Digitalizado_boro = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  // Logo y membrete
  await CabeceraLogo(doc, { ...datos, tieneMembrete: false, yOffset: 10 });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  const sedeValue = datos.sede || datos.nombreSede || "";
  doc.text("Sede: " + sedeValue, pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = datos.fechaExamen || datos.fechaRegistro || datos.fecha || "";
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  doc.text("Pag. 01", pageW - 30, 10);

  // Bloque de color
  if (datos.color && datos.textoColor) {
    drawColorBox(doc, {
      color: datos.codigoColor || "#008f39",
      text: datos.textoColor,
      x: pageW - 30,
      y: 10,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  }

  // Título principal
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA DE EVALUACIÓN AUDIOMETRÍA", pageW / 2, 32, { align: "center" });
};

export default header_Audiometria2021_Digitalizado_boro;
