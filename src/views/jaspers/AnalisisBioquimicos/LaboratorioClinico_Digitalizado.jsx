import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import { convertirGenero } from "../../utils/helpers.js";
import { getSign } from "../../utils/helpers.js";
export default function LaboratorioClinico_Digitalizado_nuevo(data = {}, docExistente = null) {

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
    // Datos Laborales
    empresa: String(data.empresa || ""),
    contrata: String(data.contrata || ""),
    cargo: String(data.cargoPaciente || ""),
    areaTrabajo: String(data.areaPaciente || ""),
    // Datos del Documento/Examen
    numeroFicha: String(data.norden || ""),
    codigoClinica: String(data.codigoClinica || ""),
    nombreExamen: String(data.nombreExamen || ""),
    fechaExamen: formatearFechaCorta(data.fechaLab || ""),
    sede: String(data.sede || ""),
    // Datos de Color
    color: data.color || "",
    codigoColor: data.codigoColor || "",
    textoColor: data.textoColor || "",
    // Digitalización
    digitalizacion: data.digitalizacion || [],
  };

  // === FUNCIONES AUXILIARES ===
  const tablaInicioX = 5;
  const tablaAncho = 200;
  const filaAltura = 5;

  // Header reutilizable
  const drawHeader = (pageNumber) => {
    CabeceraLogo(doc, { ...datosReales, tieneMembrete: false, yOffset: 7 });

    // Título principal
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("LABORATORIO CLÍNICO", pageW / 2, 28, { align: "center" });

    // Número de Ficha y Página
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Nro de ficha: ", pageW - 80, 7);
    doc.setFont("helvetica", "normal").setFontSize(18);
    doc.text(datosReales.numeroFicha, pageW - 60, 8);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("Sede: " + datosReales.sede, pageW - 80, 12);
    doc.text("Fecha de examen: " + datosReales.fechaExamen, pageW - 80, 17);
    doc.text("Código Clínica: " + datosReales.codigoClinica, pageW - 80, 22);
    // doc.text("Pag. " + pageNumber.toString().padStart(2, '0'), pageW - 30, 2);

    // Bloque de color
    drawColorBox(doc, {
      color: datosReales.codigoColor,
      text: datosReales.textoColor,
      x: pageW - 30,
      y: 2,
      size: 22,
      showLine: true,
      fontSize: 30,
      textPosition: 0.9
    });
  };

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

  // === DIBUJAR HEADER ===
  drawHeader(1);

  // === SECCIÓN 1: DATOS PERSONALES ===
  let yPos = 30;

  yPos = dibujarHeaderSeccion("DATOS PERSONALES", yPos, filaAltura);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  // Primera fila: Apellidos y Nombres | T. Examen (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datosReales.apellidosNombres, tablaInicioX + 40, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("T. Examen:", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.nombreExamen, tablaInicioX + 168.5, yPos + 3.5);
  yPos += filaAltura;

  // Segunda fila: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 50, yPos, tablaInicioX + 50, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + 150, yPos, tablaInicioX + 150, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.documentoIdentidad, tablaInicioX + 12, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 52, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.edad + " AÑOS", tablaInicioX + 63, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.sexo.toUpperCase(), tablaInicioX + 115, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nac.:", tablaInicioX + 152, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.fechaNacimiento, tablaInicioX + 168.5, yPos + 3.5);
  yPos += filaAltura;

  // Tercera fila: Lugar Nacimiento, Estado Civil (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.lugarNacimiento, tablaInicioX + 38, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.estadoCivil, tablaInicioX + 125, yPos + 3.5);
  yPos += filaAltura;

  // Cuarta fila: Nivel de Estudio, Ocupación (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.nivelEstudio, tablaInicioX + 32, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.ocupacion, tablaInicioX + 125, yPos + 3.5);
  yPos += filaAltura;

  // === SECCIÓN 2: DATOS LABORALES ===
  // Empresa (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.empresa, tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  // Contrata (fila completa)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.contrata, tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  // Cargo, Área (2 columnas)
  doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
  doc.line(tablaInicioX + 100, yPos, tablaInicioX + 100, yPos + filaAltura);
  doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
  doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
  doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.cargo, tablaInicioX + 18, yPos + 3.5);

  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 102, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datosReales.areaTrabajo, tablaInicioX + 115, yPos + 3.5);
  yPos += filaAltura;

  // === SECCIÓN 3: HEMATOLOGÍA ===
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

  // === SECCIÓN 4: BIOQUÍMICA ===
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

  // === SECCIÓN 5: SUERO - INMUNOLÓGICO ===
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

  // === SECCIÓN 6: EXAMEN DE ORINA ===
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

  // === SECCIÓN 7: DROGAS ===
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

  // === SECCIÓN 8: OBSERVACIONES ===
  yPos = dibujarHeaderSeccion("OBSERVACIONES", yPos, filaAltura);

  doc.setFont("helvetica", "normal").setFontSize(6.5);
  const obsLines = doc.splitTextToSize(data.txtObservacionesLb || "", tablaAncho - 4);
  const obsHeight = Math.max(filaAltura, obsLines.length * 3 + 2);

  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, obsHeight);

  doc.text(obsLines, tablaInicioX + 2, yPos + 3.5);
  yPos += obsHeight;

  // === SECCIÓN 9: FIRMAS ===
  const alturaFilaFirmas = 30;

  // Dibujar fila de firmas (sin división)
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFilaFirmas);

  // Obtener firmas disponibles
  const firma1Url = getSign(data, "SELLOFIRMA");
  const firma2Url = getSign(data, "SELLOFIRMADOCASIG");

  const tieneFirma1 = firma1Url && firma1Url !== "Sin registro";
  const tieneFirma2 = firma2Url && firma2Url !== "Sin registro";

  const firmasCentro = tablaInicioX + tablaAncho / 2;
  const firmasIzq = tablaInicioX + tablaAncho / 4;
  const firmasDer = tablaInicioX + (3 * tablaAncho / 4);

  if (firma1Url && firma2Url) {
    // 2 firmas: una izquierda, otra derecha
    try {
      doc.addImage(firma1Url, 'PNG', firmasIzq - 22, yPos + 5, 45, 20);
    } catch (error) {
      console.log("Error cargando firma 1:", error);
    }
    try {
      doc.addImage(firma2Url, 'PNG', firmasDer - 22, yPos + 5, 45, 20);
    } catch (error) {
      console.log("Error cargando firma 2:", error);
    }
  } else if (firma1Url) {
    // Solo firma 1: centrada
    try {
      doc.addImage(firma1Url, 'PNG', firmasCentro - 22, yPos + 5, 45, 20);
    } catch (error) {
      console.log("Error cargando firma 1:", error);
    }
  } else if (firma2Url) {
    // Solo firma 2: centrada
    try {
      doc.addImage(firma2Url, 'PNG', firmasCentro - 22, yPos + 5, 45, 20);
    } catch (error) {
      console.log("Error cargando firma 2:", error);
    }
  }

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 12 });

  // === IMPRIMIR ===
  // === Imprimir ===
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

