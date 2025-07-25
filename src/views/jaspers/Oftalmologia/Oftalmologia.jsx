import jsPDF from "jspdf";
import header_Oftalmologia from "./headers/header_Oftalmologia.jsx";

export default function Oftalmologia(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  header_Oftalmologia(doc, datos);
  const margin = 10;
  let y = 60;
  const pageW = doc.internal.pageSize.getWidth();
  // Datos personales
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`Nombres :  ${datos.nombres || ""}`, margin, y);
  doc.text(`Edad:  ${datos.edad || ""}  años`, pageW / 2, y, {
    align: "center",
  });
  doc.text(`Fecha :  ${datos.fechaOf || ""}`, pageW - margin, y, {
    align: "right",
  });
  y += 8;

  doc.text(`Examen :  ${datos.nomExam || ""}`, margin, y);
  y += 8;
  doc.text(`Contrata :  ${datos.contrata || ""}`, margin, y);
  y += 8;
  doc.text(`Empresa :  ${datos.empresa || ""}`, margin, y);
  y += 8;
  // Caja principal
  const boxH = 70;
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
  doc.rect(margin + 40, y + 22, 18, 12);
  doc.text(`${datos.vcercaSOd || ""}`, margin + 49, y + 30, {
    align: "center",
  });
  doc.rect(margin + 70, y + 22, 18, 12);
  doc.text(`${datos.vcercaSOi || ""}`, margin + 79, y + 30, {
    align: "center",
  });
  doc.rect(margin + 120, y + 22, 18, 12);
  doc.text(`${datos.vcercaCOd || ""}`, margin + 129, y + 30, {
    align: "center",
  });
  doc.rect(margin + 150, y + 22, 18, 12);
  doc.text(`${datos.vcercaCOi || ""}`, margin + 159, y + 30, {
    align: "center",
  });
  // Visión de lejos
  doc.text("Visión de Lejos :", margin + 5, y + 48);
  doc.rect(margin + 40, y + 42, 18, 12);
  doc.text(`${datos.vlejosSOd || ""}`, margin + 49, y + 50, {
    align: "center",
  });
  doc.rect(margin + 70, y + 42, 18, 12);
  doc.text(`${datos.vlejosSOi || ""}`, margin + 79, y + 50, {
    align: "center",
  });
  doc.rect(margin + 120, y + 42, 18, 12);
  doc.text(`${datos.vlejosCOd || ""}`, margin + 129, y + 50, {
    align: "center",
  });
  doc.rect(margin + 150, y + 42, 18, 12);
  doc.text(`${datos.vlejosCOi || ""}`, margin + 159, y + 50, {
    align: "center",
  });
  // Visión de colores
  doc.text("Visión de Colores :", margin + 5, y + 65);
  doc.text(`${datos.vcolores || ""}`, margin + 49, y + 65);
  // Visión binocular
  doc.text("Visión Binocular :", margin + 5, y + 75);
  doc.text(`${datos.vbinocular || ""}`, margin + 49, y + 75);
  // Reflejos pupilares
  doc.text("Reflejos Pupilares :", margin + 80, y + 65);
  doc.text(`${datos.rpupilares || ""}`, margin + 130, y + 65);
  // Enfermedades oculares
  doc.text("Enfermedades Oculares :", margin + 80, y + 75);
  doc.text(`${datos.eoculares || ""}`, margin + 130, y + 75);
  // Observación extra
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(`${datos.eoculares1 || ""}`, margin + 80, y + 85);

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
