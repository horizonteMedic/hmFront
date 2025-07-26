import jsPDF from "jspdf";
import header_OftalmologiaLO from "./headers/header_OftalmologiaLO.jsx";

export default function OftalmologiaLO(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  header_OftalmologiaLO(doc, datos);
  const margin = 10;
  let y = 60;
  const pageW = doc.internal.pageSize.getWidth();
  
  // Función para formatear fecha a DD/MM/YYYY
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    
    if (fecha.includes("-")) {
      // Formato yyyy-mm-dd del backend
      const [yyyy, mm, dd] = fecha.split("-");
      return `${dd}/${mm}/${yyyy}`;
    } else if (fecha.includes("/")) {
      // Si ya viene con /, verificar el formato
      const partes = fecha.split("/");
      if (partes.length === 3) {
        if (partes[0].length === 4) {
          // Formato yyyy/mm/dd
          const [yyyy, mm, dd] = partes;
          return `${dd}/${mm}/${yyyy}`;
        }
        // Si ya está en dd/mm/yyyy, se mantiene igual
        return fecha;
      }
    }
    return fecha;
  };
  
  // Datos personales
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`Nombres :  ${datos.nombres || ""}`, margin, y);
  
  // Calcular posición dinámica para la edad basada en el ancho del nombre
  const nombreCompleto = `Nombres :  ${datos.nombres || ""}`;
  const nombreWidth = doc.getTextWidth(nombreCompleto);
  const edadX = Math.max(margin + nombreWidth + 10, pageW / 2); // Mínimo 10 unidades de separación
  doc.text(`Edad:  ${datos.edad || ""}  años`, edadX, y, {
    align: "left",
  });
  
  doc.text(`Fecha :  ${formatearFecha(datos.fechaOf)}`, pageW - margin, y, {
    align: "right",
  });
  y += 8;
  // Caja principal
  const boxH = 120; // Aumentado de 100 a 120 para que contenga todo el contenido
  doc.setLineWidth(0.7);
  doc.rect(margin, y, pageW - 2 * margin, boxH);
  doc.setLineWidth(0.2);
  // Encabezados de la caja
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SIN CORREGIR", margin + 60, y + 10, { align: "center" });
  doc.text("CORREGIDA", margin + 140, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("O.D", margin + 45, y + 18, { align: "center" });
  doc.text("O.I", margin + 75, y + 18, { align: "center" });
  doc.text("O.D", margin + 125, y + 18, { align: "center" });
  doc.text("O.I", margin + 155, y + 18, { align: "center" });
  // Visión de cerca
  doc.text("Visión de Cerca :", margin + 5, y + 28);
  doc.rect(margin + 40, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOd || ""}`, margin + 49, y + 26, {
    align: "center",
  });
  doc.rect(margin + 70, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOi || ""}`, margin + 79, y + 26, {
    align: "center",
  });
  doc.rect(margin + 120, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOd || ""}`, margin + 129, y + 26, {
    align: "center",
  });
  doc.rect(margin + 150, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOi || ""}`, margin + 159, y + 26, {
    align: "center",
  });
  // Visión de lejos
  doc.text("Visión de Lejos :", margin + 5, y + 48);
  doc.rect(margin + 40, y + 42, 18, 8);
  doc.text(`${datos.vlejosSOd || ""}`, margin + 49, y + 46, {
    align: "center",
  });
  doc.rect(margin + 70, y + 42, 18, 8);
  doc.text(`${datos.vlejosSOi || ""}`, margin + 79, y + 46, {
    align: "center",
  });
  doc.rect(margin + 120, y + 42, 18, 8);
  doc.text(`${datos.vlejosCOd || ""}`, margin + 129, y + 46, {
    align: "center",
  });
  doc.rect(margin + 150, y + 42, 18, 8);
  doc.text(`${datos.vlejosCOi || ""}`, margin + 159, y + 46, {
    align: "center",
  });
  
  // Sección de observaciones con formato de dos columnas
  const labelX = margin + 45; // Movido más a la derecha para que no se corte
  const dataX = margin + 55; // Movido muy cerca del label para eliminar espacio vacío
  const startY = y + 65;
  const lineHeight = 8;
  
  // Visión de colores
  doc.text("Visión de Colores", labelX, startY, { align: "right" });
  doc.text(":", labelX + 2, startY);
  doc.text(`${(datos.vcolores || "").toUpperCase()}`, dataX, startY);
  
  // Visión binocular
  doc.text("Visión Binocular", labelX, startY + lineHeight, { align: "right" });
  doc.text(":", labelX + 2, startY + lineHeight);
  doc.text(`${(datos.vbinocular || "").toUpperCase()}`, dataX, startY + lineHeight);
  
  // Reflejos pupilares
  doc.text("Reflejos Pupilares", labelX, startY + lineHeight * 2, { align: "right" });
  doc.text(":", labelX + 2, startY + lineHeight * 2);
  doc.text(`${(datos.rpupilares || "").toUpperCase()}`, dataX, startY + lineHeight * 2);
  
  // Enfermedades oculares
  doc.text("Enfermedades Oculares", labelX, startY + lineHeight * 3, { align: "right" });
  doc.text(":", labelX + 2, startY + lineHeight * 3);
  doc.text(`${(datos.eoculares || "").toUpperCase()}`, dataX, startY + lineHeight * 3);
  
  // Observación extra - alineada con el primer dato, no con la etiqueta
  if (datos.eoculares1) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(`${(datos.eoculares1 || "").toUpperCase()}`, dataX, startY + lineHeight * 4);
  }

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "SELLOFIRMADOCASIG", x: 80, y: 180, maxw: 120 },
  ];
  agregarFirmas(doc, datos.digitalizacion, firmasAPintar).then(() => {
    imprimir(doc);
  });
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

function agregarFirmas(doc, digitalizacion = [], firmasAPintar = []) {
  const addSello = (imagenUrl, x, y, maxw = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagenUrl;

      img.onload = () => {
        let sigW = maxw;
        const sigH = 35;
        const baseX = x;
        const baseY = y;
        const maxW = sigW - 10;
        const maxH = sigH - 10;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxW / imgW, maxH / imgH, 1);
        imgW *= scale;
        imgH *= scale;
        const imgX = baseX + (sigW - imgW) / 2;
        const imgY = baseY + (sigH - imgH) / 2;
        doc.addImage(imagenUrl, "PNG", imgX, imgY, imgW, imgH);
        resolve();
      };

      img.onerror = (e) => {
        console.error("Error al cargar la imagen:", e);
        resolve();
      };
    });
  };

  const firmas = digitalizacion.reduce(
    (acc, d) => ({ ...acc, [d.nombreDigitalizacion]: d.url }),
    {}
  );

  const promesasFirmas = firmasAPintar
    .filter((f) => firmas[f.nombre])
    .map((f) => addSello(firmas[f.nombre], f.x, f.y, f.maxw));

  return Promise.all(promesasFirmas);
}
