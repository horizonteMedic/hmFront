// src/views/jaspers/Microbiologia/InmunologiaAglutinacion_Digitalizado.jsx
import jsPDF from "jspdf";
import header_HistoriaOcupacional from "./Header/HistoriaOcupacionalHeader";
import footerEnHeader from "./footerEnHeader";
import autoTable from "jspdf-autotable";
import { getSignCompressed, compressImage } from "../../utils/helpers.js";
// --- Configuración Centralizada (Estándar) ---
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    header: 11,
    body: 11,
  },
  font: "helvetica",
  lineHeight: 8,
};

// --- Funciones de Ayuda (Estándar) ---

// --- Componente Principal ---

export default async function HistoriaOcupacional_Digitalizado(
  datos = {},
  docExistente = null
) {
  const doc = docExistente || new jsPDF({
    unit: "mm",
    format: "letter",
    orientation: "landscape",
  });
  const pageW = doc.internal.pageSize.getWidth();
  const logoHistoriaOcup = await compressImage("/img/logo-color.webp");
  const datosHeader = { ...datos, logoHistoriaOcup };
  const getAñoInicial = (fecha) => {
    const match = fecha?.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : Infinity;
  };
  const tabla = [...datos.detalles].sort(
    (a, b) => getAñoInicial(a.fecha) - getAñoInicial(b.fecha)
  );
  const datoss = {
    detalles: [
      {
        fecha: "2023-01-11",
        empresa: "Minerales del Sur",
        actividad: "Perforación y voladura",
        areaEmpresa: "Superficie",
        ocupacion: "Técnico de seguridad",
        superficie: "Sí",
        socavon: "No",
        riesgo: "Polvo, gases",
        proteccion: "Mascarilla, gafas de seguridad",
        altitud: "2800 msnm",
      },
      {
        fecha: "2021-03-16",
        empresa: "Minera Andina Del Peru SAC",
        actividad: "Extracción de minerales",
        areaEmpresa: "Subterránea",
        ocupacion: "Operador de maquinaria",
        superficie: "No",
        socavon: "Sí",
        riesgo: "Ruido, vibraciones",
        proteccion: "Casco, tapones auditivos",
        altitud: "3000 msnm",
      },
      {
        fecha: null,
        empresa: null,
        actividad: null,
        areaEmpresa: null,
        ocupacion: null,
        superficie: null,
        socavon: null,
        riesgo: null,
        proteccion: null,
        altitud: null,
      },
      {
        fecha: null,
        empresa: null,
        actividad: null,
        areaEmpresa: null,
        ocupacion: null,
        superficie: null,
        socavon: null,
        riesgo: null,
        proteccion: null,
        altitud: null,
      },
      {
        fecha: null,
        empresa: null,
        actividad: null,
        areaEmpresa: null,
        ocupacion: null,
        superficie: null,
        socavon: null,
        riesgo: null,
        proteccion: null,
        altitud: null,
      },
      {
        fecha: null,
        empresa: null,
        actividad: null,
        areaEmpresa: null,
        ocupacion: null,
        superficie: null,
        socavon: null,
        riesgo: null,
        proteccion: null,
        altitud: null,
      },
    ],
  };
  // === HEADER ===
  await header_HistoriaOcupacional(doc, datosHeader);
  console.log(tabla)
  // Obtener firmas comprimidas (JPEG por defecto)
  // getSignCompressed toma el objeto de datos completo, ya que internamente accede a data.digitalizacion
  const firmap = await getSignCompressed(datos, "FIRMAP");
  const huellap = await getSignCompressed(datos, "HUELLA");
  const sellofirma = await getSignCompressed(datos, "SELLOFIRMA");

  // === CUERPO ===
  let y = 53;
  // ... (autoTable setup remains same until we reach signatures)
  autoTable(doc, {
    startY: y,
    margin: { top: y, left: 3, right: 3 }, // MÁRGENES PERSONALIZADOS
    columnStyles: {
      0: { cellWidth: 15 }, // Fecha
      1: { cellWidth: 35 }, // Empresa
      2: { cellWidth: 15 }, // Altitud
      3: { cellWidth: 25 }, // Actividad
      4: { cellWidth: 30 }, // Área de Trabajo
      5: { cellWidth: 25 }, // Ocupación
      6: { cellWidth: 15 }, // Subsuelo
      7: { cellWidth: 15 }, // Superficie
      8: { cellWidth: 49 }, // Peligros
      9: { cellWidth: 49 }, // EPP
    },
    head: [
      [
        {
          content: "Fecha",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Empresa",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Altitud",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Actividad",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Área de Trabajo",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Ocupación",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Tiempo de labor",
          colSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Peligros/Agentes Ocupacionales",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Uso EPP Tipo EPP",
          rowSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
      ],
      [
        {
          content: "Subsuelo",
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
        {
          content: "Superficie",
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
      ],
    ],
    body: tabla?.map((d) => [
      d.fecha?.toUpperCase() ?? "",
      d.empresa?.toUpperCase() ?? "",
      d.altitud?.toUpperCase() ?? "",
      d.actividad?.toUpperCase() ?? "",
      d.areaEmpresa?.toUpperCase() ?? "",
      d.ocupacion?.toUpperCase() ?? "",
      d.socavon?.toUpperCase() ?? "",
      d.superficie?.toUpperCase() ?? "",
      d.riesgo?.toUpperCase() ?? "",
      d.proteccion?.toUpperCase() ?? "",
    ]),
    theme: "grid",
    styles: {
      fontSize: 6,
      textColor: [0, 0, 0],
      cellPadding: 1,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    didDrawPage: (data) => {
      header_HistoriaOcupacional(doc, datosHeader);
      if (data.pageNumber > 1) {
        data.settings.margin.top = 53;
      }
    },
  });

  let finalY = doc.lastAutoTable.finalY; // ✅ usar let en vez de const
  const signatureBlockHeight = 50; // espacio estimado total (firma + texto + margen)
  const spacingAfterTable = 1;
  const totalRequired = spacingAfterTable + signatureBlockHeight;
  const tablaVacia =
    !tabla.length ||
    tabla.every(
      (d) =>
        !d.fecha &&
        !d.empresa &&
        !d.altitud &&
        !d.actividad &&
        !d.areaEmpresa &&
        !d.ocupacion &&
        !d.socavon &&
        !d.superficie &&
        !d.riesgo &&
        !d.proteccion
    );

  const pageHeight = doc.internal.pageSize.getHeight();

  if (pageHeight - finalY < totalRequired) {
    doc.addPage();
    await header_HistoriaOcupacional(doc, datosHeader);
    const newY = 53;
    finalY = newY;
  }

  const signatureTop = finalY + spacingAfterTable;
  if (tablaVacia) {
    doc.setFontSize(20);
    doc.setTextColor(255, 0, 0); // Rojo en RGB
    doc.text("SIN EXPERIENCIA LABORAL", 95, signatureTop + 7);
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // Color negro
  }

  doc.text(`Fecha: ${datos.fechaHo}`, 15, signatureTop + 35);
  //FIRMA
  const lineY = signatureTop + 35; // 5px debajo de la imagen
  const lineX1 = 70; // inicio de la línea
  const lineX2 = 150; // fin de la línea

  // Dibujar línea
  doc.setLineWidth(0.2);
  doc.line(lineX1, lineY, lineX2, lineY);

  // Texto centrado debajo de la línea
  const label = "Firma del Trabajador";
  const fontSize = 9;
  doc.setFontSize(fontSize);

  const textWidth = doc.getTextWidth(label);
  const textX = (lineX1 + lineX2) / 2 - textWidth / 2;
  const textY = lineY + 4.5; // Ajusta según altura visual
  const midX = (lineX1 + lineX2) / 2;
  const sigW = (lineX2 - lineX1) / 2; // 40 px
  const sigH = 35;
  const sigY = 110; // altura vertical para ambas
  doc.text(label, textX, textY);

  //SELLO
  const lineYS = lineY; // 5px debajo de la imagen
  const lineX1S = 190; // inicio de la línea
  const lineX2S = 270; // fin de la línea

  // Dibujar línea
  doc.setLineWidth(0.2);
  doc.line(lineX1S, lineYS, lineX2S, lineYS);

  // Texto centrado debajo de la línea
  const labelS = "Firma y Sello";
  const fontSizeS = 9;
  doc.setFontSize(fontSizeS);

  const textWidthS = doc.getTextWidth(labelS);
  const textXS = (lineX1S + lineX2S) / 2 - textWidthS / 2;
  const textYS = lineYS + 4.5; // Ajusta según altura visual
  const selloW = lineX2S - lineX1S; // 80 px
  const selloH = 35; // Alto reservado
  const selloY = 110;
  doc.text(labelS, textXS, textYS);
  doc.text(`Medico: ${datos.medicoAsignado}`, textXS - 30, textYS + 8, {
    maxWidth: 80,
  });

  // FIRMAP
  if (firmap) {
    const imgW = 35;
    const imgH = 20;

    const sigX1 = lineX1;
    const imgX = sigX1 + (sigW - imgW) / 2;
    const imgY = signatureTop + (sigH - imgH) / 2;

    doc.addImage(firmap, "JPEG", imgX, imgY, imgW, imgH);
  }

  // HUELLA
  if (huellap) {
    const imgW = 20;
    const imgH = 25;

    const sigX2 = midX;
    // Ajuste posición original: sigX2 + (sigW - imgW) / 2
    // sigW = 40. (midX + (40 - 20)/2) = midX + 10.
    const imgX = sigX2 + (sigW - imgW) / 2;
    const imgY = signatureTop + (sigH - imgH) / 2;

    doc.addImage(huellap, "JPEG", imgX, imgY, imgW, imgH);
  }

  // SELLOFIRMA
  if (sellofirma) {
    const imgW = 50;
    const imgH = 25;

    // Centrado dentro del área del sello
    // lineX1S + (selloW - imgW) / 2
    const imgX = lineX1S + (selloW - imgW) / 2;
    const imgY = signatureTop + (selloH - imgH) / 2;

    doc.addImage(sellofirma, "JPEG", imgX, imgY, imgW, imgH);
  }

  // === FOOTER ===
  // footerEnHeader(doc, datos);

  // === Imprimir ===
  if (!docExistente) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  }

  return doc;
}
