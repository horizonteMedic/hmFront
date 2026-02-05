import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../../utils/formatDateUtils.js";
import { convertirGenero } from "../../../utils/helpers.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import footerTR from '../../components/footerTR.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import { dibujarFirmas } from '../../../utils/dibujarFirmas.js';

export default async function Informe_burnout_Digitalizado(data = {}, docExistente = null) {
  const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();

  // Mapear y transformar todos los datos del JSON en un solo objeto
  const datos = {
    // Datos personales
    apellidosNombres: String(`${data.apellidosPaciente ?? ""} ${data.nombresPaciente ?? ""}`).trim(),
    fechaExamen: formatearFechaCorta(data.fecha ?? ""),
    tipoExamen: String(data.nombreExamen ?? ""),
    sexo: convertirGenero(data.sexoPaciente) || "",
    documentoIdentidad: String(data.dniPaciente ?? ""),
    edad: String(data.edadPaciente ?? ""),
    areaTrabajo: String(data.areaPaciente ?? ""),
    puestoTrabajo: String(data.cargoPaciente ?? ""),
    empresa: String(data.empresa ?? ""),
    contrata: String(data.contrata ?? ""),
    numeroFicha: String(data.norden ?? ""),
    sede: String(data.sede ?? data.nombreSede ?? ""),
    fechaNacimiento: formatearFechaCorta(data.fechaNacimientoPaciente ?? ""),
    codigoColor: String(data.codigoColor ?? ""),
    textoColor: String(data.textoColor ?? ""),
    // Datos del informe
    sindromeBurnout: String(data.sindromeBurnout ?? ""),
    agotamientoEmocional: String(data.agotamientoEmocional ?? ""),
    despersonalizacion: String(data.despersonalizacion ?? ""),
    realizacionPersonal: String(data.realizacionPersonal ?? ""),
    resultados: String(data.resultados ?? ""),
    conclusiones: String(data.conclusiones ?? ""),
    recomendaciones: String(data.recomendaciones ?? ""),
    // Datos originales para firma
    digitalizacion: data.digitalizacion ?? [],
    usuarioFirma: data.usuarioFirma ?? "",
  };

  // === HEADER / CABECERA ===
  await CabeceraLogo(doc, { ...datos, tieneMembrete: false });

  // Número de Ficha y Página
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Nro de ficha: ", pageW - 80, 15);
  doc.setFont("helvetica", "normal").setFontSize(18);
  doc.text(datos.numeroFicha, pageW - 60, 16);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text("Sede: " + datos.sede, pageW - 80, 20);
  doc.text("Fecha de examen: " + datos.fechaExamen, pageW - 80, 25);

  // === COLOR BOX ===
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

  // === TÍTULO PRINCIPAL ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("INFORME PSICOLÓGICO - BURNOUT", pageW / 2, 35, { align: "center" });

  // === SECCIÓN: DATOS PERSONALES ===
  const tablaInicioX = 10;
  const tablaAncho = 190;
  let yPos = 38;
  const filaAltura = 6;

  // Header de datos personales
  doc.setFillColor(196, 196, 196);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("I. DATOS PERSONALES", tablaInicioX + 2, yPos + 4);
  yPos += filaAltura;

  // Fila 1: Apellidos y Nombres
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Apellidos y Nombres:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.apellidosNombres || "", tablaInicioX + 40, yPos + 4);
  yPos += filaAltura;

  // Fila 2: DNI, Edad, Sexo, Fecha Nac. (4 columnas)
  const col1W = 47.5;
  const col2W = 47.5;
  const col3W = 47.5;
  const col4W = 47.5;

  doc.rect(tablaInicioX, yPos, col1W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W, yPos, col2W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W, yPos, col3W, filaAltura, 'S');
  doc.rect(tablaInicioX + col1W + col2W + col3W, yPos, col4W, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("DNI:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.documentoIdentidad || "", tablaInicioX + 12, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Edad:", tablaInicioX + col1W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text((datos.edad || "") + " años", tablaInicioX + col1W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Sexo:", tablaInicioX + col1W + col2W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.sexo || "", tablaInicioX + col1W + col2W + 14, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Fecha Nac.:", tablaInicioX + col1W + col2W + col3W + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.fechaNacimiento || "", tablaInicioX + col1W + col2W + col3W + 22, yPos + 4);
  yPos += filaAltura;

  // Fila 3: Puesto de Trabajo y Área de Trabajo (2 columnas)
  const col2MitadW = 95;
  doc.rect(tablaInicioX, yPos, col2MitadW, filaAltura, 'S');
  doc.rect(tablaInicioX + col2MitadW, yPos, col2MitadW, filaAltura, 'S');

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Puesto de Trabajo:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.puestoTrabajo || "", tablaInicioX + 32, yPos + 4);

  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Área de Trabajo:", tablaInicioX + col2MitadW + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.areaTrabajo || "", tablaInicioX + col2MitadW + 30, yPos + 4);
  yPos += filaAltura;

  // Fila 4: Empresa
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Empresa:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.empresa || "", tablaInicioX + 20, yPos + 4);
  yPos += filaAltura;

  // Fila 5: Contrata
  doc.rect(tablaInicioX, yPos, tablaAncho, filaAltura, 'S');
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.text("Contratista:", tablaInicioX + 2, yPos + 4);
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(datos.contrata || "", tablaInicioX + 22, yPos + 4);
  yPos += filaAltura;

  // Función para dibujar header gris
  const dibujarHeaderGris = (titulo, y) => {
    doc.setFillColor(196, 196, 196);
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura, 'F');
    doc.rect(tablaInicioX, y, tablaAncho, filaAltura, 'S');
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(titulo, tablaInicioX + 2, y + 4);
    return y + filaAltura;
  };

  // Función para fila con label y data (2 columnas) - CRECIENTE
  const dibujarFilaLabelData = (label, valor, y) => {
    const labelW = 60;
    const dataW = tablaAncho - labelW;
    const padding = 2;
    doc.setFont("helvetica", "normal").setFontSize(8);

    // Calcular altura necesaria para el valor (siempre usar splitTextToSize para calcular correctamente)
    let alturaFila = filaAltura;
    if (valor) {
      const lineas = doc.splitTextToSize(valor, dataW - 4);
      const alturaTexto = lineas.length * 3.5 + padding * 2;
      alturaFila = Math.max(filaAltura, alturaTexto);
    }

    // Dibujar celdas
    doc.rect(tablaInicioX, y, labelW, alturaFila, 'S');
    doc.rect(tablaInicioX + labelW, y, dataW, alturaFila, 'S');

    // Dibujar label (centrado verticalmente en la fila)
    doc.setFont("helvetica", "bold").setFontSize(8);
    // Centrar verticalmente: el punto Y en jsPDF es la línea base del texto
    // Para centrar, usamos: centro de la fila + ajuste para línea base
    const labelY = y + (alturaFila / 2) + 1;
    doc.text(label, tablaInicioX + 2, labelY);

    // Dibujar valor (con salto de línea si es necesario)
    doc.setFont("helvetica", "normal").setFontSize(8);
    if (valor) {
      const lineas = doc.splitTextToSize(valor, dataW - 4);
      lineas.forEach((linea, idx) => {
        doc.text(linea, tablaInicioX + labelW + 2, y + padding + 2 + (idx * 3.5));
      });
    }

    return y + alturaFila;
  };

  // Función para fila con texto creciente (mínimo 15mm)
  const dibujarFilaCreciente = (texto, y) => {
    const alturaMinima = 30;
    const padding = 3;
    doc.setFont("helvetica", "normal").setFontSize(8);

    let alturaFila = alturaMinima;
    if (texto && doc.getTextWidth(texto) > tablaAncho - 4) {
      const lineas = doc.splitTextToSize(texto, tablaAncho - 4);
      const alturaTexto = lineas.length * 3.5 + padding * 2;
      alturaFila = Math.max(alturaMinima, alturaTexto);
    }

    doc.rect(tablaInicioX, y, tablaAncho, alturaFila, 'S');

    if (texto) {
      if (doc.getTextWidth(texto) > tablaAncho - 4) {
        const lineas = doc.splitTextToSize(texto, tablaAncho - 4);
        lineas.forEach((linea, idx) => {
          doc.text(linea, tablaInicioX + 2, y + padding + 2 + (idx * 3.5));
        });
      } else {
        doc.text(texto, tablaInicioX + 2, y + padding + 2);
      }
    }

    return y + alturaFila;
  };

  // === SECCIÓN II: CRITERIOS PSICOLÓGICOS ===
  yPos = dibujarHeaderGris("II. CRITERIOS PSICOLÓGICOS", yPos);
  yPos = dibujarFilaLabelData("- SÍNDROME DE BURNOUT", datos.sindromeBurnout, yPos);

  // === SECCIÓN III: SUB ESCALAS ===
  yPos = dibujarHeaderGris("III. SUB ESCALAS", yPos);
  yPos = dibujarFilaLabelData("- AGOTAMIENTO EMOCIONAL", datos.agotamientoEmocional, yPos);
  yPos = dibujarFilaLabelData("- DESPERSONALIZACIÓN", datos.despersonalizacion, yPos);
  yPos = dibujarFilaLabelData("- REALIZACIÓN PERSONAL", datos.realizacionPersonal, yPos);

  // === SECCIÓN IV: RESULTADOS ===
  yPos = dibujarHeaderGris("IV. RESULTADOS", yPos);
  yPos = dibujarFilaCreciente(datos.resultados, yPos);

  // === SECCIÓN V: CONCLUSIONES ===
  yPos = dibujarHeaderGris("V. CONCLUSIONES", yPos);
  yPos = dibujarFilaCreciente(datos.conclusiones, yPos);

  // === SECCIÓN VI: RECOMENDACIONES ===
  yPos = dibujarHeaderGris("VI. RECOMENDACIONES", yPos);
  yPos = dibujarFilaCreciente(datos.recomendaciones, yPos);

  // === FILA DE FIRMA ===
  const alturaFirma = 32;
  doc.rect(tablaInicioX, yPos, tablaAncho, alturaFirma, 'S');

  // Usar helper para dibujar firmas
  await dibujarFirmas({ doc, datos, y: yPos + 2, pageW });
  yPos += alturaFirma;

  // === FOOTER ===
  footerTR(doc, { footerOffsetY: 8 });

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
