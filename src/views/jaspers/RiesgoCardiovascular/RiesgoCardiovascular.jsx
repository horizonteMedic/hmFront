import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import drawColorBox from "../components/ColorBox.jsx";
import footerTR from "../components/footerTR.jsx";
import { dibujarFirmas } from "../../utils/dibujarFirmas.js";

const config = {
  margin: 15,
  font: "helvetica",
  fontSize: {
    title: 14,
    header: 9,
    body: 9,
  },
  lineHeight: 6,
};

const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (String(fecha).includes("/")) return String(fecha);
  const [anio, mes, dia] = String(fecha).split("-");
  if (!anio || !mes || !dia) return String(fecha);
  return `${dia}/${mes}/${anio}`;
};

const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  const nroFicha = String(datos.norden || datos.numeroFicha || datos.norden_n_orden || datos.n_orden || "");
  const sede = String(datos.sede || datos.nombreSede || "");
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || datos.fechaRegistro || "");

  doc.setFont(config.font, "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont(config.font, "normal").setFontSize(18);
  doc.text(nroFicha, pageW - 50, 16);

  doc.setFont(config.font, "normal").setFontSize(8);
  doc.text(`Sede: ${sede}`, pageW - 80, 20);
  doc.text(`Fecha de examen: ${fechaExamen}`, pageW - 80, 25);

  doc.text("Pag. 01", pageW - 30, 10);

  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9,
  });
};

const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43;

  const apellidosNombres = String(datos.apellidosPaciente || "").trim() + " " + String(datos.nombresPaciente || "").trim();
  const dni = String(datos.dni || datos.dniPaciente || "");
  const edad = String(datos.edad || datos.edadPaciente || "");
  const sexo =
    datos.sexoPaciente === "F"
      ? "FEMENINO"
      : datos.sexoPaciente === "M"
        ? "MASCULINO"
        : String(datos.sexo || "");
  const ocupacionTexto = String(datos.ocupacionPaciente || datos.ocupacion || "").trim();
  const areaTexto = String(datos.areaPaciente || datos.area || "").trim();

  const col1X = tablaInicioX;
  const col2X = tablaInicioX + 45;
  const col3X = tablaInicioX + 90;
  const colRX = tablaInicioX + tablaAncho;
  const paddingR = 2;
  const firstLineOffset = 3.5;
  const lineGap = 4;

  const splitToLines = (text, maxWidth) => {
    const t = String(text ?? "").trim();
    if (!t) return [""];
    return doc.splitTextToSize(t, Math.max(0, maxWidth));
  };

  const drawLines = (lines, x, y) => {
    const arr = Array.isArray(lines) ? lines : [String(lines ?? "")];
    arr.forEach((line, i) => {
      doc.text(String(line ?? ""), x, y + i * lineGap);
    });
  };

  const calcRowHeight = (maxLines) =>
    Math.max(filaAltura, firstLineOffset + (Math.max(1, maxLines) - 1) * lineGap + 1.5);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, "FD");
  doc.setFont(config.font, "bold").setFontSize(8);
  doc.text("I. DATOS PERSONALES:", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  {
    const valueX = tablaInicioX + 40;
    doc.setFont(config.font, "normal").setFontSize(9);
    const valueLines = splitToLines(apellidosNombres, colRX - paddingR - valueX);
    const rowH = calcRowHeight(valueLines.length);
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(valueLines, valueX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const dniX = tablaInicioX + 12;
    const edadX = tablaInicioX + 58;
    const sexoX = tablaInicioX + 105;
    doc.setFont(config.font, "normal").setFontSize(9);
    const dniLines = splitToLines(dni, col2X - paddingR - dniX);
    const edadLines = splitToLines(edad ? `${edad} AÑOS` : "", col3X - paddingR - edadX);
    const sexoLines = splitToLines(sexo, colRX - paddingR - sexoX);
    const rowH = calcRowHeight(Math.max(dniLines.length, edadLines.length, sexoLines.length));
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(col2X, yPos, col2X, yPos + rowH);
    doc.line(col3X, yPos, col3X, yPos + rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("DNI:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.text("Edad:", tablaInicioX + 47, yPos + firstLineOffset);
    doc.text("Sexo:", tablaInicioX + 92, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(dniLines, dniX, yPos + firstLineOffset);
    drawLines(edadLines, edadX, yPos + firstLineOffset);
    drawLines(sexoLines, sexoX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const estadoX = tablaInicioX + 28;
    const tipoX = tablaInicioX + 115;
    const estado = String(datos.estadoCivil || datos.estadoCivilPaciente || "");
    const tipo = String(datos.nombreExamen || datos.tipoExamen || "");
    doc.setFont(config.font, "normal").setFontSize(9);
    const estadoLines = splitToLines(estado, col3X - paddingR - estadoX);
    const tipoLines = splitToLines(tipo, colRX - paddingR - tipoX);
    const rowH = calcRowHeight(Math.max(estadoLines.length, tipoLines.length));
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(col3X, yPos, col3X, yPos + rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Estado Civil:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.text("Tipo Examen:", tablaInicioX + 92, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(estadoLines, estadoX, yPos + firstLineOffset);
    drawLines(tipoLines, tipoX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const lugarX = tablaInicioX + 38;
    const fechaNX = tablaInicioX + 125;
    const lugar = String(datos.lugarNacimiento || datos.lugarNacimientoPaciente || "");
    const fechaN = toDDMMYYYY(datos.fechaNacimiento || datos.fechaNacimientoPaciente || "");
    doc.setFont(config.font, "normal").setFontSize(9);
    const lugarLines = splitToLines(lugar, col3X - paddingR - lugarX);
    const fechaLines = splitToLines(fechaN, colRX - paddingR - fechaNX);
    const rowH = calcRowHeight(Math.max(lugarLines.length, fechaLines.length));
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(col3X, yPos, col3X, yPos + rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.text("Fecha Nacimiento:", tablaInicioX + 92, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(lugarLines, lugarX, yPos + firstLineOffset);
    drawLines(fechaLines, fechaNX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const ocupX = tablaInicioX + 25;
    const nivelX = tablaInicioX + 125;
    const ocup = ocupacionTexto || areaTexto;
    const nivel = String(datos.nivelEstudios || datos.nivelEstudioPaciente || "");
    doc.setFont(config.font, "normal").setFontSize(9);
    const ocupLines = splitToLines(ocup, col3X - paddingR - ocupX);
    const nivelLines = splitToLines(nivel, colRX - paddingR - nivelX);
    const rowH = calcRowHeight(Math.max(ocupLines.length, nivelLines.length));
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(col3X, yPos, col3X, yPos + rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Ocupación:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.text("Nivel de Estudio:", tablaInicioX + 92, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(ocupLines, ocupX, yPos + firstLineOffset);
    drawLines(nivelLines, nivelX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const cargoX = tablaInicioX + 18;
    const areaX = tablaInicioX + 105;
    const cargo = String(datos.cargoDesempenar || datos.cargoPaciente || "");
    const area = areaTexto || ocupacionTexto;
    doc.setFont(config.font, "normal").setFontSize(9);
    const cargoLines = splitToLines(cargo, col3X - paddingR - cargoX);
    const areaLines = splitToLines(area, colRX - paddingR - areaX);
    const rowH = calcRowHeight(Math.max(cargoLines.length, areaLines.length));
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.line(col3X, yPos, col3X, yPos + rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Cargo:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.text("Área:", tablaInicioX + 92, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(cargoLines, cargoX, yPos + firstLineOffset);
    drawLines(areaLines, areaX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const valueX = tablaInicioX + 20;
    const empresa = String(datos.empresa || "");
    doc.setFont(config.font, "normal").setFontSize(9);
    const valueLines = splitToLines(empresa, colRX - paddingR - valueX);
    const rowH = calcRowHeight(valueLines.length);
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Empresa:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(valueLines, valueX, yPos + firstLineOffset);
    yPos += rowH;
  }

  {
    const valueX = tablaInicioX + 22;
    const contrata = String(datos.contrata || "");
    doc.setFont(config.font, "normal").setFontSize(9);
    const valueLines = splitToLines(contrata, colRX - paddingR - valueX);
    const rowH = calcRowHeight(valueLines.length);
    doc.rect(tablaInicioX, yPos, tablaAncho, rowH);
    doc.setFont(config.font, "bold").setFontSize(9);
    doc.text("Contrata:", tablaInicioX + 2, yPos + firstLineOffset);
    doc.setFont(config.font, "normal").setFontSize(9);
    drawLines(valueLines, valueX, yPos + firstLineOffset);
    yPos += rowH;
  }

  return yPos;
};

const imprimir = (doc) => {
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
};

export default async function RiesgoCardiovascular(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  await drawHeader(doc, datos);

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
  doc.text("RIESGO CARDIOVASCULAR", pageW / 2, 38, { align: "center" });

  const finalYPos = drawPatientData(doc, datos);
  let y = finalYPos + 12;

  const colPrueba = config.margin;
  const colValores = 105 - 10;
  const colResultado = pageW - config.margin - 25;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
  doc.text("PRUEBA", colPrueba, y);
  doc.text("VALORES NORMALES", colValores, y);
  doc.text("RESULTADO", colResultado, y, { align: "center" });
  y += 2;
  doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
  y += config.lineHeight;

  const sist = datos.sistolica ?? datos.tensionSistolica ?? "";
  const diast = datos.diastolica ?? datos.tensionDiastolica ?? "";
  const presion = sist && diast ? `${String(sist)}/${String(diast)}` : "";

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("PRESIÓN ARTERIAL", colPrueba, y);
  doc.text(presion || "/", colResultado, y, { align: "center" });
  doc.setFont(config.font, "normal").setFontSize(7.5);

  y += config.lineHeight + 3;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("ANTECEDENTES", colPrueba, y);
  doc.setLineWidth(0.4).line(config.margin, y + 2, pageW - config.margin, y + 2);
  y += config.lineHeight;

  const boolToSiNo = (v) => {
    if (v === true || v === "true" || v === 1 || v === "1") return "SI";
    if (v === false || v === "false" || v === 0 || v === "0") return "NO";
    return "";
  };

  doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
  doc.text("DIABETES", colPrueba, y);
  doc.text(boolToSiNo(datos.diabetes), colResultado, y, { align: "center" });
  y += config.lineHeight;

  doc.text("FUMA", colPrueba, y);
  doc.text(boolToSiNo(datos.fumar), colResultado, y, { align: "center" });
  y += config.lineHeight;

  const labs = [
    { label: "COLESTEROL TOTAL", value: datos.colesterol ?? datos.colesterolTotal, ref: "< 200 mg/dl" },
    { label: "COLESTEROL HDL", value: datos.hdlColesterol ?? datos.colesterolHdl, ref: "40 - 60 mg/dl" },
    { label: "TRIGLICÉRIDOS", value: datos.trigliseridos ?? datos.trigliceridos, ref: "< 150 mg/dl" },
    { label: "COLESTEROL LDL", value: datos.ldlColesterol ?? datos.colesterolLdl, ref: "< 129 mg/dl" },
  ];

  labs.forEach((row) => {
    doc.text(row.label, colPrueba, y);
    const val = row.value != null && String(row.value).trim() !== "" ? `${String(row.value)} mg/dl` : "";
    doc.text(val || "/", colResultado, y, { align: "center" });
    doc.setFont(config.font, "normal").setFontSize(7.5);
    doc.text(row.ref, colValores, y);
    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    y += config.lineHeight;
  });

  y += 4;

  doc.setFont(config.font, "bold").setFontSize(config.fontSize.body);
  doc.text("RESULTADOS", config.margin, y);
  doc.setLineWidth(0.4).line(config.margin, y + 2, pageW - config.margin, y + 2);
  y += config.lineHeight;

  const riesgo = String(datos.riesgoCoronario ?? datos.riesgoEventoCoronario10 ?? "").trim();
  const riesgoIdeal = String(datos.riesgoIdeal ?? datos.riesgoIdealEventoCoronario10 ?? "").trim();
  const riesgoPromedio = String(datos.riesgoPromedio ?? datos.riesgoPromedioEventoCoronario10 ?? "").trim();
  const riesgoPromSevero = String(
    datos.riesgoPromedioSevero ?? datos.riesgoPromedioEventoCoronarioSevero10 ?? "",
  ).trim();

  if (datos.edadPaciente && datos.edadPaciente >= 30 && datos.edadPaciente <= 74) {
    doc.setFont(config.font, "normal").setFontSize(8.5);
    doc.text(`Su evento de riesgo coronario a 10 años es de un:`, config.margin, y);
    doc.setFont(config.font, "bold").setFontSize(8.5);
    doc.text(`${riesgo}`, colResultado, y, { align: "center" });
    y += 4;
    doc.text(`Para su mismo edad y sexo`, config.margin, y);
    doc.setFont(config.font, "normal").setFontSize(8.5);
    y += 4;
    doc.text(`El riesgo promedio de evento coronario a 10 años es de un:`, config.margin, y);
    doc.setFont(config.font, "bold").setFontSize(8.5);
    doc.text(`${riesgoPromedio}`, colResultado, y, { align: "center" });
    y += 4;
    doc.setFont(config.font, "normal").setFontSize(8.5);
    doc.text(`El riesgo ideal de evento coronario a 10 años es de un:`, config.margin, y);
    doc.setFont(config.font, "bold").setFontSize(8.5);
    doc.text(`${riesgoIdeal}`, colResultado, y, { align: "center" });
    y += 4;
    doc.setFont(config.font, "normal").setFontSize(8.5);
    doc.text(`El riesgo promedio de evento coronario severo a 10 años es de un:`, config.margin, y);
    doc.setFont(config.font, "bold").setFontSize(8.5);
    doc.text(`${riesgoPromSevero}`, colResultado, y, { align: "center" });

  } else {
    doc.setFont(config.font, "bold").setFontSize(10);
    doc.text(`RIESGO CARDIOVASCULAR SEGUN FRAMINGHAM: NO CUANTIFICABLE POR LIMITE DE EDAD.`, config.margin, y + 1, { maxWidth: pageW - config.margin });
  }

  doc.setFont(config.font, "normal").setFontSize(8.5);

  await dibujarFirmas({ doc, datos, y: y + 18, pageW });
  footerTR(doc, datos);

  if (docExistente) return doc;
  imprimir(doc);
}
