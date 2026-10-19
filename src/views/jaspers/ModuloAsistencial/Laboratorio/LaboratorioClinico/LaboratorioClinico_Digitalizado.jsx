import jsPDF from "jspdf";
import HeaderAsistencial from "../../../components/headerAsistencial.jsx";
import footerTR from "../../../components/footerTR.jsx";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils.js";
import { convertirGenero, getSignCompressed } from "../../../../utils/helpers.js";
import { dnicompletarConCeros } from "../../../../utils/functionUtils.js";

// Informe de Laboratorio Clínico (Hematología, Bioquímica, Suero, Orina y Drogas) del módulo
// asistencial. El cuerpo es el mismo de jaspers/AnalisisBioquimicos/LaboratorioClinico_Digitalizado.jsx
// (ocupacional), pero con la cabecera estándar del módulo asistencial (N° Ticket / N° Historia
// Clínica) y sin datos de empresa (T. Examen, Empresa, Contrata, Cargo, Área).
//
// Recibe el reporte de GET /asistencial/laboratorio/clinico/obtenerReporte?esJasper=true (mismos
// nombres de campo del DTO: nombres, dniPaciente, edadPaciente, txtHemoglobina, digitalizacion...).
// El controller completa numeroTicket, numeroHistoriaClinica y sede si el reporte no los trae.

// Pie de página (footerTR con footerOffsetY 12): su línea queda en y = 297 - 25 + 12 - 3.6.
const PIE_OFFSET_Y = 12;
const Y_LIMITE_CONTENIDO = 297 - 25 + PIE_OFFSET_Y - 3.6 - 1;

export default async function LaboratorioClinico_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // === MAPEO DE DATOS ===
  const datosReales = {
    // Datos Personales del Paciente
    apellidosNombres: String(data.nombres || ""),
    documentoIdentidad: String(data.dniPaciente || ""),
    edad: String(data.edadPaciente || ""),
    sexo: convertirGenero(data.sexoPaciente || ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente || ""),
    lugarNacimiento: String(data.lugarNacimientoPaciente || ""),
    estadoCivil: String(data.estadoCivilPaciente || ""),
    nivelEstudio: String(data.nivelEstudioPaciente || ""),
    ocupacion: String(data.ocupacionPaciente || ""),
  };

  // === FUNCIONES AUXILIARES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;

  // Función para dibujar header de sección con fondo gris
  const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 4) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(titulo, tablaInicioX + 2, yPos + 3.5);
    return yPos + alturaHeader;
  };

  // Fila de una celda o varias: contorno exterior + divisiones verticales (distancia desde tablaInicioX).
  const dibujarFilaCeldas = (yPos, divisiones = []) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
    divisiones.forEach((dx) => doc.line(tablaInicioX + dx, yPos, tablaInicioX + dx, yPos + filaAltura));
  };

  // Celda "Etiqueta: valor" (etiqueta en negrita, valor normal) dentro de la fila que empieza en yPos.
  const dibujarEtiquetaValor = (etiqueta, valor, xEtiqueta, xValor, yPos) => {
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text(etiqueta, tablaInicioX + xEtiqueta, yPos + 3.5);
    doc.setFont("helvetica", "normal");
    doc.text(valor, tablaInicioX + xValor, yPos + 3.5);
  };

  // === DIBUJAR HEADER ===
  // Cabecera compartida del módulo asistencial. Devuelve la Y donde empieza el contenido.
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  let yPos = await HeaderAsistencial(
    doc,
    {
      numeroTicket: data.numeroTicket,
      numeroHistoriaClinica: data.numeroHistoriaClinica,
      sede: data.sede,
      fecha: data.fechaLab,
      codigoColor: data.codigoColor,
      textoColor: data.textoColor,
    },
    { pagina: 1, titulo: "LABORATORIO CLÍNICO", etiquetaFecha: "Fecha de examen" }
  );

  // === SECCIÓN 1: DATOS PERSONALES ===
  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos, filaAltura);

  // Primera fila: Apellidos y Nombres
  dibujarFilaCeldas(yPos);
  dibujarEtiquetaValor("Apellidos y Nombres:", datosReales.apellidosNombres, 2, 40, yPos);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  dibujarFilaCeldas(yPos, [50, 100, 150]);
  dibujarEtiquetaValor("DNI:", dnicompletarConCeros(datosReales.documentoIdentidad), 2, 12, yPos);
  dibujarEtiquetaValor("Edad:", datosReales.edad ? datosReales.edad + " AÑOS" : "", 52, 63, yPos);
  dibujarEtiquetaValor("Sexo:", datosReales.sexo.toUpperCase(), 102, 115, yPos);
  dibujarEtiquetaValor("Fecha Nac.:", datosReales.fechaNacimiento, 152, 168.5, yPos);
  yPos += filaAltura;

  // Tercera fila: Lugar Nacimiento, Estado Civil (2 columnas)
  dibujarFilaCeldas(yPos, [100]);
  dibujarEtiquetaValor("Lugar de Nacimiento:", datosReales.lugarNacimiento, 2, 38, yPos);
  dibujarEtiquetaValor("Estado Civil:", datosReales.estadoCivil, 102, 125, yPos);
  yPos += filaAltura;

  // Cuarta fila: Nivel de Estudio, Ocupación (2 columnas)
  dibujarFilaCeldas(yPos, [100]);
  dibujarEtiquetaValor("Nivel de Estudio:", datosReales.nivelEstudio, 2, 32, yPos);
  dibujarEtiquetaValor("Ocupación:", datosReales.ocupacion, 102, 125, yPos);
  yPos += filaAltura;

  // === SECCIÓN 2: HEMATOLOGÍA ===
  yPos = dibujarHeaderSeccion("HEMATOLOGÍA", yPos, filaAltura);

  // Determinar grupo sanguíneo
  let grupoSanguineo = "";
  if (data.chko) grupoSanguineo = "O";
  else if (data.chka) grupoSanguineo = "A";
  else if (data.chkb) grupoSanguineo = "B";
  else if (data.chkab) grupoSanguineo = "AB";

  // Determinar factor Rh
  let factorRh = "";
  if (data.rbrhpositivo) factorRh = "POSITIVO";
  else if (data.rbrhnegativo) factorRh = "NEGATIVO";

  // Datos de hematología - columna izquierda y derecha
  const hematoLeft = [
    { label: "Grupo Sanguíneo", value: grupoSanguineo },
    { label: "Factor Rh", value: factorRh },
    { label: "Hematocrito", value: data.txtHematocrito || "N/A", suffix: "%" },
    { label: "Hemoglobina", value: data.txtHemoglobina || "N/A", suffix: "g/dl" },
    { label: "Hematíes", value: data.txtHematiesHematologia || "N/A" },
    { label: "V.S.G", value: data.txtVsg || "N/A", suffix: "mm/hora" },
    { label: "Plaquetas", value: data.txtPlaquetas || "N/A", suffix: "mm³" },
  ];

  const hematoRight = [
    { label: "Leucocitos", value: data.txtLeucocitosHematologia || "N/A", suffix: "mm³" },
    { label: "Neutrófilos", value: data.txtNeutrofilos || "N/A", suffix: "%" },
    { label: "Abastonados", value: data.txtAbastonados || "N/A", suffix: "%" },
    { label: "Segmentados", value: data.txtSegmentadosHematologia || "N/A", suffix: "%" },
    { label: "Eosinófilos", value: data.txtEosinofilosHematologia || "N/A", suffix: "%" },
    { label: "Basófilos", value: data.txtBasofilosHematologia || "N/A", suffix: "%" },
    { label: "Linfocitos", value: data.txtLinfocitosHematologia || "N/A", suffix: "%" },
    { label: "Monocitos", value: data.txtMonocitosHematologia || "N/A", suffix: "%" },
  ];

  const totalRows = Math.max(hematoLeft.length, hematoRight.length);
  const rowH = filaAltura;
  const tableH = rowH * totalRows;
  const mitadTabla = tablaAncho / 2;

  // Contorno exterior de la tabla
  doc.setLineWidth(0.3);
  doc.rect(tablaInicioX, yPos, tablaAncho, tableH);

  // Línea vertical central
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + tableH);

  // Dibujar filas - centrado en cada mitad de la tabla
  doc.setFontSize(8);
  const centroIzq = tablaInicioX + mitadTabla / 2; // Centro de la columna izquierda
  const centroDer = tablaInicioX + mitadTabla + mitadTabla / 2; // Centro de la columna derecha

  for (let i = 0; i < totalRows; i++) {
    const rowY = yPos + rowH * i;

    // Columna izquierda
    if (hematoLeft[i]) {
      const { label, value, suffix } = hematoLeft[i];
      const displayValue = value + (suffix && value !== "N/A" && value !== "" ? " " + suffix : "");

      doc.setFont("helvetica", "normal");
      doc.text(label, centroIzq - 5, rowY + 3.5, { align: "right" });
      doc.text(":", centroIzq - 3, rowY + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text(displayValue, centroIzq, rowY + 3.5);
    }

    // Columna derecha
    if (hematoRight[i]) {
      const { label, value, suffix } = hematoRight[i];
      const displayValue = value + (suffix && value !== "N/A" && value !== "" ? " " + suffix : "");

      doc.setFont("helvetica", "normal");
      doc.text(label, centroDer - 5, rowY + 3.5, { align: "right" });
      doc.text(":", centroDer - 3, rowY + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text(displayValue, centroDer, rowY + 3.5);
    }
  }

  yPos += tableH;

  // === SECCIÓN 3: BIOQUÍMICA ===
  yPos = dibujarHeaderSeccion("BIOQUÍMICA", yPos, filaAltura);

  // Tabla Bioquímica (2 filas, 2 columnas)
  const bioqRows = 2;
  const bioqTableH = filaAltura * bioqRows;
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, bioqTableH);
  // Línea vertical divisoria
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + bioqTableH);

  // Centro de cada celda
  const bioqCentroIzq = tablaInicioX + mitadTabla / 2;
  const bioqCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  // Fila 1: Glucosa
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Glucosa", bioqCentroIzq - 5, yPos + 3.5, { align: "right" });
  doc.text(":", bioqCentroIzq - 3, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text((data.txtGlucosaBio || "N/A") + " mg/dl", bioqCentroIzq, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text("Valores Normales 70 - 110 mg/dl", bioqCentroDer, yPos + 3.5, { align: "center" });

  // Fila 2: Creatinina
  doc.setFont("helvetica", "normal");
  doc.text("Creatinina", bioqCentroIzq - 5, yPos + filaAltura + 3.5, { align: "right" });
  doc.text(":", bioqCentroIzq - 3, yPos + filaAltura + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text((data.txtCreatininaBio || "N/A") + " mg/dl", bioqCentroIzq, yPos + filaAltura + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text("Valores Normales 0.8 - 1.4 mg/dl", bioqCentroDer, yPos + filaAltura + 3.5, { align: "center" });

  yPos += bioqTableH;

  // === SECCIÓN 4: SUERO - INMUNOLÓGICO ===
  yPos = dibujarHeaderSeccion("SUERO - INMUNOLÓGICO", yPos, filaAltura);

  // Tabla Suero (1 fila, 2 columnas)
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + filaAltura);

  const rprValue = data.chkPositivo ? "REACTIVO" : data.chkNegativo ? "NO REACTIVO" : "N/A";
  const sueroCentroIzq = tablaInicioX + mitadTabla / 2;
  const sueroCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("RPR", sueroCentroIzq - 5, yPos + 3.5, { align: "right" });
  doc.text(":", sueroCentroIzq - 3, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(rprValue, sueroCentroIzq, yPos + 3.5);

  doc.setFont("helvetica", "normal");
  doc.text("VIH", sueroCentroDer - 5, yPos + 3.5, { align: "right" });
  doc.text(":", sueroCentroDer - 3, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(data.txtVih || "N/A", sueroCentroDer, yPos + 3.5);

  yPos += filaAltura;

  // === SECCIÓN 5: EXAMEN DE ORINA ===
  yPos = dibujarHeaderSeccion("EXAMEN DE ORINA", yPos, filaAltura);

  // Examen Físico (subtítulo + 2 filas)
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Examen Físico :", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const fisicoItems = [
    { labelL: "Color", valueL: data.txtColorEf || "N/A", labelR: "Aspecto", valueR: data.txtAspectoEf || "N/A" },
    { labelL: "Densidad", valueL: data.txtDensidadEf || "N/A", labelR: "pH", valueR: data.txtPhEf || "N/A" },
  ];

  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura * fisicoItems.length);
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + filaAltura * fisicoItems.length);

  const fisicoCentroIzq = tablaInicioX + mitadTabla / 2;
  const fisicoCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  fisicoItems.forEach((item, idx) => {
    const rowY = yPos + filaAltura * idx;
    doc.setFont("helvetica", "normal");
    doc.text(item.labelL, fisicoCentroIzq - 5, rowY + 3.5, { align: "right" });
    doc.text(":", fisicoCentroIzq - 3, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.valueL, fisicoCentroIzq, rowY + 3.5);

    doc.setFont("helvetica", "normal");
    doc.text(item.labelR, fisicoCentroDer - 5, rowY + 3.5, { align: "right" });
    doc.text(":", fisicoCentroDer - 3, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.valueR, fisicoCentroDer, rowY + 3.5);
  });
  yPos += filaAltura * fisicoItems.length;

  // Examen Químico (subtítulo + 5 filas)
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Examen Químico :", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const quimicoItems = [
    { labelL: "Nitritos", valueL: data.txtNitritosEq || "N/A", labelR: "Urobilinógeno", valueR: data.txtUrobilinogenoEq || "N/A" },
    { labelL: "Proteínas", valueL: data.txtProteinasEq || "N/A", labelR: "Bilirrubina", valueR: data.txtBilirrubinaEq || "N/A" },
    { labelL: "Cetonas", valueL: data.txtCetonasEq || "N/A", labelR: "Glucosa", valueR: data.txtGlucosaEq || "N/A" },
    { labelL: "Leucocitos", valueL: data.txtLeucocitosEq || "N/A", labelR: "Sangre", valueR: data.txtSangreEq || "N/A" },
    { labelL: "Ácido ascórbico", valueL: data.txtAcAscorbico || "N/A", labelR: "", valueR: "" },
  ];

  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura * quimicoItems.length);
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + filaAltura * quimicoItems.length);

  const quimicoCentroIzq = tablaInicioX + mitadTabla / 2;
  const quimicoCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  quimicoItems.forEach((item, idx) => {
    const rowY = yPos + filaAltura * idx;
    doc.setFont("helvetica", "normal");
    doc.text(item.labelL, quimicoCentroIzq - 5, rowY + 3.5, { align: "right" });
    doc.text(":", quimicoCentroIzq - 3, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.valueL, quimicoCentroIzq, rowY + 3.5);

    if (item.labelR) {
      doc.setFont("helvetica", "normal");
      doc.text(item.labelR, quimicoCentroDer - 5, rowY + 3.5, { align: "right" });
      doc.text(":", quimicoCentroDer - 3, rowY + 3.5);
      doc.setFont("helvetica", "bold");
      doc.text(item.valueR, quimicoCentroDer, rowY + 3.5);
    }
  });
  yPos += filaAltura * quimicoItems.length;

  // Sedimento Urinario (subtítulo + 4 filas)
  doc.setFillColor(199, 241, 255);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sedimento Urinario :", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sedimentoItems = [
    { labelL: "Cel. Epiteliales", valueL: data.txtCelEpitelialesSu || "N/A", labelR: "Cilindros", valueR: data.txtCilindrosSu || "N/A" },
    { labelL: "Leucocitos", valueL: (data.txtLeucocitosSu && data.txtLeucocitosSu !== "N/A" ? data.txtLeucocitosSu + " X CAMPO" : "N/A"), labelR: "Bacterias", valueR: data.txtBacteriasSu || "N/A" },
    { labelL: "Hematíes", valueL: (data.txtHematiesSu && data.txtHematiesSu !== "N/A" ? data.txtHematiesSu + " X CAMPO" : "N/A"), labelR: "Gram S/C", valueR: data.txtPusSu || "N/A" },
    { labelL: "Cristales", valueL: data.txtCristalesSu || "N/A", labelR: "Otros", valueR: data.txtOtrosSu || "N/A" },
  ];

  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura * sedimentoItems.length);
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + filaAltura * sedimentoItems.length);

  const sedCentroIzq = tablaInicioX + mitadTabla / 2;
  const sedCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  sedimentoItems.forEach((item, idx) => {
    const rowY = yPos + filaAltura * idx;
    const esCristalesOtros = item.labelL === "Cristales";

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(item.labelL, sedCentroIzq - 5, rowY + 3.5, { align: "right" });
    doc.text(":", sedCentroIzq - 3, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    if (esCristalesOtros && item.valueL !== "N/A") doc.setFontSize(6.5);
    doc.text(item.valueL, sedCentroIzq, rowY + 3.5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(item.labelR, sedCentroDer - 5, rowY + 3.5, { align: "right" });
    doc.text(":", sedCentroDer - 3, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    if (esCristalesOtros && item.valueR !== "N/A") doc.setFontSize(6.5);
    doc.text(item.valueR, sedCentroDer, rowY + 3.5);
  });
  yPos += filaAltura * sedimentoItems.length;

  // === SECCIÓN 6: DROGAS ===
  yPos = dibujarHeaderSeccion("DROGAS", yPos, filaAltura);

  // Tabla Drogas (1 fila, 2 columnas)
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + mitadTabla, yPos, tablaInicioX + mitadTabla, yPos + filaAltura);

  const drogasCentroIzq = tablaInicioX + mitadTabla / 2;
  const drogasCentroDer = tablaInicioX + mitadTabla + mitadTabla / 2;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Cocaína", drogasCentroIzq - 5, yPos + 3.5, { align: "right" });
  doc.text(":", drogasCentroIzq - 3, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(data.txtCocaina || "N/A", drogasCentroIzq, yPos + 3.5);

  doc.setFont("helvetica", "normal");
  doc.text("Marihuana", drogasCentroDer - 5, yPos + 3.5, { align: "right" });
  doc.text(":", drogasCentroDer - 3, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(data.txtMarihuana || "N/A", drogasCentroDer, yPos + 3.5);

  yPos += filaAltura;

  // === SECCIÓN 7: OBSERVACIONES ===
  yPos = dibujarHeaderSeccion("OBSERVACIONES", yPos, filaAltura);

  // Bloque de firmas (fila de 32 mm) justo debajo; el pie de página no debe quedar pisado.
  const alturaSeccionFirmas = 32; // Altura ajustada para que quepa el texto completo dentro
  const disponibleObs = Y_LIMITE_CONTENIDO - alturaSeccionFirmas - yPos;

  // 6.5 pt como en el ocupacional; solo si el texto es tan largo que no cabe se achica la letra.
  let obsFont = 6.5;
  let obsLines = [];
  for (; obsFont >= 5; obsFont -= 0.5) {
    doc.setFont("helvetica", "normal").setFontSize(obsFont);
    obsLines = doc.splitTextToSize(data.txtObservacionesLb || "", tablaAncho - 4);
    if (obsLines.length * obsFont * (3 / 6.5) + 2 <= disponibleObs) break;
  }
  obsFont = Math.max(obsFont, 5);
  doc.setFont("helvetica", "normal").setFontSize(obsFont);
  const obsHeight = Math.max(filaAltura, obsLines.length * obsFont * (3 / 6.5) + 2);

  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, obsHeight);

  doc.text(obsLines, tablaInicioX + 2, yPos + 3.5);
  yPos += obsHeight;

  // === SECCIÓN 8: FIRMAS ===
  const baseY = yPos;

  // Dibujar los bordes de la fila de firmas
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, baseY, tablaAncho, alturaSeccionFirmas);

  // LOGICA LINEAL DE FIRMAS
  try {
    // 1. Obtener firmas comprimidas
    const sello1 = await getSignCompressed(data, "SELLOFIRMA");
    const sello2 = await getSignCompressed(data, "SELLOFIRMADOCASIG");

    // 2. Lógica de dibujo
    const tieneSelloProfesional = sello1 || sello2;

    if (tieneSelloProfesional) {
      const sigW = 48;
      const sigH = 20;
      const sigY = baseY + 2;
      const gap = 16;
      let lineY = sigY + sigH + 3;

      // Función auxiliar para dibujar línea y texto
      const dibujarLineaYTexto = (centroX, lineY, tipoSello) => {
        doc.setLineWidth(0.2);
        let texto1, texto2;
        if (tipoSello === 'SELLOFIRMA') {
          texto1 = "Firma y Sello del Profesional";
          texto2 = "Responsable de la Evaluación";
        } else if (tipoSello === 'SELLOFIRMADOCASIG') {
          texto1 = "Firma y Sello Médico Asignado";
          texto2 = null;
        } else {
          texto1 = "Firma y Sello";
          texto2 = null;
        }

        const textoWidth = doc.getTextWidth(texto1);
        const anchoLinea = Math.max(textoWidth, texto2 ? doc.getTextWidth(texto2) : 0);

        doc.line(centroX - anchoLinea / 2, lineY, centroX + anchoLinea / 2, lineY);
        doc.setFont('helvetica', 'normal').setFontSize(9);
        doc.text(texto1, centroX, lineY + 3, { align: "center" });
        if (texto2) {
          doc.text(texto2, centroX, lineY + 6, { align: "center" });
        }
      };

      const centroProfesionalX = pageW / 2;

      // Dibujar Sello 1
      if (sello1 && sello2) {
        // Dos sellos
        const totalWidth = sigW * 2 + gap;
        const startX = centroProfesionalX - totalWidth / 2;

        doc.addImage(sello1, 'JPEG', startX, sigY, sigW, sigH);
        doc.addImage(sello2, 'JPEG', startX + sigW + gap, sigY, sigW, sigH);

        const centroSello1X = startX + sigW / 2;
        const centroSello2X = startX + sigW + gap + sigW / 2;
        dibujarLineaYTexto(centroSello1X, lineY, 'SELLOFIRMA');
        dibujarLineaYTexto(centroSello2X, lineY, 'SELLOFIRMADOCASIG');

      } else if (sello1) {
        // Solo sello 1
        const imgX = centroProfesionalX - sigW / 2;
        doc.addImage(sello1, 'JPEG', imgX, sigY, sigW, sigH);
        dibujarLineaYTexto(centroProfesionalX, lineY, 'SELLOFIRMA');

      } else if (sello2) {
        // Solo sello 2
        const imgX = centroProfesionalX - sigW / 2;
        doc.addImage(sello2, 'JPEG', imgX, sigY, sigW, sigH);
        dibujarLineaYTexto(centroProfesionalX, lineY, 'SELLOFIRMADOCASIG');
      }
    }

  } catch (err) {
    console.error("Error dibujando firmas:", err);
  }

  // === FINALIZACIÓN ===
  // Footer se agrega al final
  footerTR(doc, { footerOffsetY: PIE_OFFSET_Y });

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}
