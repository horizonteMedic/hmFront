import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import footerTR from '../components/footerTR.jsx';
import { dibujarFirmas } from '../../utils/dibujarFirmas.js';

// Función para formatear fecha a DD/MM/YYYY
const toDDMMYYYY = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) return fecha; // ya está en formato correcto
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio}`;
};

// Header con datos de ficha, sede y fecha
const drawHeader = async (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();

  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(String(datos.norden || datos.numeroFicha || ""), pageW - 50, 16);

  // Sede
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + (datos.sede || datos.nombreSede || ""), pageW - 80, 20);

  // Fecha de examen
  const fechaExamen = toDDMMYYYY(datos.fecha || datos.fechaExamen || "");
  doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

  // Página
  //doc.text("Pag. 01", pageW - 30, 10);

   
  // Bloque de color
  drawColorBox(doc, {
    color: datos.codigoColor,
    text: datos.textoColor,
    x: pageW - 30,
    y: 10,
    size: 22,
    showLine: true,
    fontSize: 30,
    textPosition: 0.9
  });
};

// Función para dibujar datos del paciente en tabla
const drawPatientData = (doc, datos = {}) => {
  const tablaInicioX = 15;
  const tablaAncho = 180;
  const filaAltura = 5;
  let yPos = 43 - 7;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("I. DATOS PERSONALES", tablaInicioX + 2, yPos + 3.5);
  yPos += filaAltura;

  const sexo = datos.sexo === 'F' ? 'FEMENINO' : datos.sexo === 'M' ? 'MASCULINO' : (datos.sexo || '');

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.apellidos || '') + " " + (datos.nombres || ''), tablaInicioX + 40, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 90, yPos, tablaInicioX + 90, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("DNI:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(String(datos.dniPaciente || datos.dni || ''), tablaInicioX + 12, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Edad:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text((datos.edad || '') + " AÑOS", tablaInicioX + 58, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sexo:", tablaInicioX + 92, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(sexo, tablaInicioX + 105, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 45, yPos, tablaInicioX + 45, yPos + filaAltura);
  doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Estado Civil:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.estadoCivilPaciente || datos.estadoCivil || '', tablaInicioX + 25, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Tipo Examen:", tablaInicioX + 47, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nomExamen || datos.tipoExamen || datos.nombreExamen || '', tablaInicioX + 68, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha Nacimiento:", tablaInicioX + 112, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(toDDMMYYYY(datos.fechaNacimientoPaciente || datos.fechaNacimiento || ''), tablaInicioX + 145, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.line(tablaInicioX + 110, yPos, tablaInicioX + 110, yPos + filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de Nacimiento:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.lugarNacimientoPaciente || datos.lugarNacimiento || '', tablaInicioX + 36, yPos + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text("Nivel de Estudio:", tablaInicioX + 112, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nivelEstudio || datos.nivelEstudios || '', tablaInicioX + 145, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Ocupación:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.ocupacionPaciente || datos.ocupacion || '', tablaInicioX + 22, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Cargo:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.cargoDe || datos.cargoPaciente || datos.cargoDesempenar || '', tablaInicioX + 16, yPos + 3.5);
  yPos += filaAltura;

  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold");
  doc.text("Área:", tablaInicioX + 2, yPos + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(datos.areaO || datos.areaPaciente || datos.area || '', tablaInicioX + 15, yPos + 3.5);
  yPos += filaAltura;

  // EMPRESA
  const empresaTexto = String(datos.razonEmpresa || datos.empresa || '');

  const textXEmp = tablaInicioX + 18;
  const textMaxWidthEmp = 170;

  doc.setFont("helvetica", "normal").setFontSize(9);

  const empresaLines = doc.splitTextToSize(empresaTexto, textMaxWidthEmp);

  // altura dinámica
  const empresaRowHeight = Math.max(
    filaAltura,
    empresaLines.length * 5
  );

  // borde
  doc.rect(tablaInicioX, yPos, tablaAncho, empresaRowHeight);

  // label
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);

  // contenido
  doc.setFont("helvetica", "normal").setFontSize(
    empresaLines.length > 2 ? 7.5 : 9
  );

  empresaLines.forEach((line, index) => {
    doc.text(
      line,
      textXEmp,
      yPos + 3.5 + (index * 4)
    );
  });

  yPos += empresaRowHeight;

  //CONTRATA
  const contrataTexto = String(datos.razonContrata || datos.contrata || '');

  const textXContrata = tablaInicioX + 18;
  const textMaxWidthContrata = 170;

  doc.setFont("helvetica", "normal").setFontSize(9);

  const contrataLines = doc.splitTextToSize(
    contrataTexto,
    textMaxWidthContrata
  );

  const contrataRowHeight = Math.max(
    filaAltura,
    contrataLines.length * 4
  );

  // borde
  doc.rect(tablaInicioX, yPos, tablaAncho, contrataRowHeight);

  // label
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);

  // contenido
  doc.setFont("helvetica", "normal").setFontSize(
    contrataLines.length > 2 ? 7.5 : 9
  );

  contrataLines.forEach((line, index) => {
    doc.text(
      line,
      textXContrata,
      yPos + 3.5 + (index * 4)
    );
  });

  yPos += contrataRowHeight;

  // doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  // doc.setFont("helvetica", "bold");
  // doc.text("Empresa:", tablaInicioX + 2, yPos + 3.5);
  // doc.setFont("helvetica", "normal");
  // doc.text(datos.razonEmpresa || datos.empresa || '', tablaInicioX + 18, yPos + 3.5);
  // yPos += filaAltura;

  // doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura);
  // doc.setFont("helvetica", "bold");
  // doc.text("Contrata:", tablaInicioX + 2, yPos + 3.5);
  // doc.setFont("helvetica", "normal");
  // doc.text(datos.razonContrata || datos.contrata || '', tablaInicioX + 18, yPos + 3.5);
  // yPos += filaAltura;

  return yPos;
};

// Función para dibujar radio buttons con círculos
const drawRadioOption = (doc, x, y, isSelected, label, index) => {
  doc.circle(x, y, 1.8);
  if (isSelected) {
    doc.setFillColor(0, 0, 255); // Azul
    doc.circle(x, y, 1.1, "F");
  }
  doc.setFont("helvetica", "normal").setFontSize(7.5);
  doc.text(`(${index}) ${label}`, x + 3.5, y + 1);
};

export default async function EscalaLakeLouise(datos = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const tablaInicioX = 15;
  const tablaAncho = 180;

  // 1) Header
  await drawHeader(doc, datos);
  // Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Pag. 01", pageW - 30, 10);

  // 2) Título
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("ESCALA DE LAKE LOUISE — MAL DE MONTAÑA AGUDO", pageW / 2, 32, { align: "center" });

  // 3) Tabla de datos del paciente
  let y = drawPatientData(doc, datos);
  y += 6;

  // === II. SÍNTOMAS ===
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("II. SÍNTOMAS", tablaInicioX + 2, y + 3.5);
  doc.line(tablaInicioX + 65, y + 4.6, tablaInicioX + 65, y + 140);
  y += 5;

 const sintomas = [
  {
    name: "cefalea",
    title: "CEFALEA",
    options: ["AUSENTE", "LEVE", "MODERADA", "GRAVE"]
  },
  {
    name: "sintomasDigestivos",
    title: "SÍNTOMAS DIGESTIVOS",
    options: ["BUEN APETITO", "POCO APETITO O NÁUSEAS", "NÁUSEAS MODERADAS O VÓMITOS", "NÁUSEAS O VÓMITOS GRAVES O INCAPACITANTES"]
  },
  {
    name: "fatiga",
    title: "FATIGA Y/O DEBILIDAD",
    options: ["AUSENTES", "LEVE", "MODERADA", "GRAVE O INCAPACITANTE"]
  },
  {
    name: "vertigo",
    title: "VÉRTIGO / MAREOS",
    options: ["AUSENTES", "LEVES", "MODERADOS", "GRAVES O INCAPACITANTES"]
  },
  {
    name: "alteracionesSueno",
    title: "ALTERACIONES DEL SUEÑO",
    options: ["DUERME COMO HABITUALMENTE LO HACE", "NO DUERME COMO HABITUALMENTE LO HACE", "SE DESPIERTA MUCHAS VECES, SUEÑO NOCTURNO ESCASO", "NO PUEDE DORMIR"]
  }
];

  sintomas.forEach((sintoma, idx) => {
    const selectedVal = Number(datos[sintoma.name] || 0);

    doc.rect(tablaInicioX, y, tablaAncho, sintoma.options.length * 6 + 3);
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    doc.text(`${idx + 1}. ${sintoma.title}`, tablaInicioX + 2, y + 4);

    sintoma.options.forEach((opt, optIdx) => {
      drawRadioOption(doc, tablaInicioX + 70, y + 3.5 + optIdx * 6, selectedVal === optIdx, opt, optIdx);
    });

    y += sintoma.options.length * 6 + 3;
  });

  // Footer primera página
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

  // === SEGUNDA PÁGINA ===
  doc.addPage();

  await drawHeader(doc, datos);
  // Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Pag. 02", pageW - 30, 10); 
  y = 45;

  // === III. HALLAZGOS CLÍNICOS ===
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("III. HALLAZGOS CLÍNICOS", tablaInicioX + 2, y + 3.5);
  doc.line(tablaInicioX + 65, y + 4.8, tablaInicioX + 65, y + 100);
  y += 5;

 const hallazgos = [
  {
    name: "alteracionesMentales",
    title: "ALTERACIONES MENTALES",
    options: ["AUSENTES", "LETARGO", "DESORIENTADO / CONFUSO", "ESTUPOR / SEMICONCIENCIA", "COMA"],
    subtitle: null
  },
  {
    name: "ataxia",
    title: "ATAXIA",
    subtitle: "(CAMINAR SOBRE UNA LÍNEA HACIENDO COINCIDIR TACO CON PUNTA)",
    options: ["MARCHA NORMAL", "MARCHA TAMBALEANTE", "PISADAS FUERA DE LÍNEA", "CAÍDAS AL SUELO", "INCAPACIDAD PARA PARARSE"]
  },
  {
    name: "edemasPerifericos",
    title: "EDEMAS PERIFÉRICOS",
    options: ["AUSENTES", "EN UNA EXTREMIDAD", "EN >= 2 EXTREMIDADES"],
    subtitle: null
  }
];

hallazgos.forEach((hallazgo, idx) => {
  const selectedVal = Number(datos[hallazgo.name] || 0);
  const filaAltura = (hallazgo.subtitle ? 7 : 0) + hallazgo.options.length * 6 + 3;

  doc.rect(tablaInicioX, y, tablaAncho, filaAltura);
  doc.setFont("helvetica", "bold").setFontSize(8.5);
  doc.text(`${idx + 1}. ${hallazgo.title}`, tablaInicioX + 2, y + 4);

  if (hallazgo.subtitle) {
    doc.setFont("helvetica", "italic").setFontSize(6.5);
    doc.text("(CAMINAR SOBRE UNA LÍNEA HACIENDO", tablaInicioX + 2, y + 8);
    doc.text("COINCIDIR TACO CON PUNTA)", tablaInicioX + 2, y + 12);
  }

  hallazgo.options.forEach((opt, optIdx) => {
    drawRadioOption(doc, tablaInicioX + 70, y + 3.5 + optIdx * 6, selectedVal === optIdx, opt, optIdx);
  });

  y += filaAltura;
});

  // === IV. CALIFICACIÓN ===
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, y, tablaAncho, 5, 'FD');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("IV. CALIFICACIÓN", tablaInicioX + 2, y + 3.5);
  y += 5;

  const puntaje = Number(datos.calificacion || 0);
  let txtPuntaje = "SIN CLASIFICACIÓN";
  if (puntaje >= 0 && puntaje <= 3) txtPuntaje = "MMA LEVE";
  else if (puntaje >= 4 && puntaje <= 6) txtPuntaje = "MMA MODERADO";
  else if (puntaje >= 7) txtPuntaje = "MMA GRAVE";

  // Tabla de calificación
  const filaCalifH = 5;
  doc.rect(tablaInicioX, y, tablaAncho, filaCalifH * 3);

  // Líneas de la tabla
  doc.line(tablaInicioX + 60, y, tablaInicioX + 60, y + filaCalifH * 3);
  doc.line(tablaInicioX + 120, y, tablaInicioX + 120, y + filaCalifH * 3);
  doc.line(tablaInicioX, y + filaCalifH, tablaInicioX + tablaAncho - 60, y + filaCalifH);
  doc.line(tablaInicioX, y + filaCalifH * 2, tablaInicioX + tablaAncho - 60, y + filaCalifH * 2);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("MMA LEVE", tablaInicioX + 2, y + 3.5);
  doc.text("1 - 3 PTOS.", tablaInicioX + 62, y + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`Puntuación total: ${puntaje}`, tablaInicioX + 122, y + 5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("MMA MODERADO", tablaInicioX + 2, y + filaCalifH + 3.5);
  doc.text("4 - 6 PTOS.", tablaInicioX + 62, y + filaCalifH + 3.5);
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text(`Diagnóstico: ${txtPuntaje}`, tablaInicioX + 122, y + filaCalifH + 5);

  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("MMA GRAVE", tablaInicioX + 2, y + filaCalifH * 2 + 3.5);
  doc.text(">= 7 PTOS.", tablaInicioX + 62, y + filaCalifH * 2 + 3.5);

  y += filaCalifH * 3 + 10;

  // Signatures and Footer
  await dibujarFirmas({ doc, datos, y: y +5, pageW });
  footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

  if (docExistente) {
    return doc;
  } else {
    imprimir(doc);
  }
}

function imprimir(doc) {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}   
