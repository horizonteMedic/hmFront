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

  // Función para formatear fecha a DD/MM/YYYY
  const toDDMMYYYY = (fecha) => {
    if (!fecha) return "";
    if (fecha.includes("/")) return fecha; // ya está en formato correcto
    const [anio, mes, dia] = fecha.split("-");
    if (!anio || !mes || !dia) return fecha;
    return `${dia}/${mes}/${anio}`;
  };

  // Sección: 1.- Datos Personales (justo después del título)
  let yPos = 36; // Empezar más cerca del título
  const marginLeft = 16;
  const fontSize = 8;

  // Preparar datos - usando los campos exactos del objeto data proporcionado
  const apellidosNombres = String(datos?.nombres || datos?.apellidosNombres || "");
  const edad = String(datos?.edad || "");
  const fechaExamenFormateada = toDDMMYYYY(datos?.fechaExamen || datos?.fechaAu || datos?.fecha || "");
  const puestoTrabajo = String(datos?.ocupacion || datos?.cargo || "");
  const sexo = datos?.sexo === 'F' ? 'F' : datos?.sexo === 'M' ? 'M' : String(datos?.sexo || "");
  const empresa = String(datos?.empresa || "");

  // Título de la sección
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("1.- Datos Personales", marginLeft, yPos);

  yPos += 4;

  // Apellidos y Nombres
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Apellidos y Nombres:", marginLeft, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text(apellidosNombres, marginLeft + 45, yPos);
  yPos += 3.5;

  // Edad y Fecha en la misma línea
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Edad:", marginLeft, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text((edad ? edad + " AÑOS" : ""), marginLeft + 15, yPos);
  
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Fecha:", marginLeft + 60, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text(fechaExamenFormateada, marginLeft + 75, yPos);
  yPos += 3.5;

  // Puesto de Trabajo
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Puesto de Trabajo:", marginLeft, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text(puestoTrabajo, marginLeft + 40, yPos);
  yPos += 3.5;

  // Sexo y Empresa en la misma línea
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Sexo:", marginLeft, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text(sexo, marginLeft + 15, yPos);
  
  doc.setFont("helvetica", "bold").setFontSize(fontSize);
  doc.text("Empresa:", marginLeft + 60, yPos);
  doc.setFont("helvetica", "normal").setFontSize(fontSize);
  doc.text(empresa, marginLeft + 85, yPos);
  
  // Devolver la posición Y final para que la imagen pueda posicionarse después
  return yPos + 3.5;
};

export default header_Audiometria2021_Digitalizado_boro;
