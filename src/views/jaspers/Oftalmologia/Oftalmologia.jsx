import jsPDF from "jspdf";
import header_Oftalmologia from "./headers/header_Oftalmologia.jsx";

export default function Oftalmologia(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  header_Oftalmologia(doc, datos);
  const margin = 10;
  let y = 60;
  const pageW = doc.internal.pageSize.getWidth();

  // Función para formatear fecha a DD/MM/YYYY
  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    let partes;
    let dateObj;

    if (fecha.includes("-")) {
      // Formato yyyy-mm-dd
      partes = fecha.split("-");
      dateObj = new Date(`${partes[0]}-${partes[1]}-${partes[2]}`);
    } else if (fecha.includes("/")) {
      partes = fecha.split("/");
      if (partes.length === 3) {
        if (partes[0].length === 4) {
          // yyyy/mm/dd
          dateObj = new Date(`${partes[0]}-${partes[1]}-${partes[2]}`);
        } else {
          // dd/mm/yyyy
          dateObj = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        }
      }
    } else {
      return fecha;
    }

    if (isNaN(dateObj)) return "";

    const opciones = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("es-ES", opciones).format(dateObj);
  };

  // Datos personales
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`Nombres :  ${datos.nombres || ""}`, margin, y);

  doc.text(`Fecha :  ${formatearFecha(datos.fechaOf)}`, pageW - 80, y);
  y += 8;

  doc.text(`Examen :  ${datos.nomExam || ""}`, margin, y);
  doc.text(`Edad:  ${datos.edad || ""}  años`, pageW - 80, y, {
    align: "left",
  });
  y += 8;
  doc.text(`Empresa :  ${datos.empresa || ""}`, margin, y, { maxWidth: 150 });
  y += 8;
  doc.text(`Contrata :  ${datos.contrata || ""}`, margin, y, { maxWidth: 150 });
  y += 8;
  // Caja principal
  const boxH = 120; // Aumentado de 100 a 120 para que contenga todo el contenido
  doc.setLineWidth(0.7);
  doc.rect(margin, y, pageW - 2 * margin, boxH);
  doc.setLineWidth(0.2);
  // Encabezados de la caja
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("SIN CORREGIR", margin + 83, y + 10, { align: "center" });
  doc.text("CORREGIDA", margin + 148, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("O.D", margin + 69, y + 18, { align: "center" });
  doc.text("O.I", margin + 94, y + 18, { align: "center" });
  doc.text("O.D", margin + 134, y + 18, { align: "center" });
  doc.text("O.I", margin + 159, y + 18, { align: "center" });
  // Visión de cerca

  doc.rect(margin + 60, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOd || ""}`, margin + 69, y + 26, {
    align: "center",
  });
  doc.rect(margin + 85, y + 22, 18, 8);
  doc.text(`${datos.vcercaSOi || ""}`, margin + 94, y + 26, {
    align: "center",
  });
  doc.rect(margin + 125, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOd || ""}`, margin + 134, y + 26, {
    align: "center",
  });
  doc.rect(margin + 150, y + 22, 18, 8);
  doc.text(`${datos.vcercaCOi || ""}`, margin + 159, y + 26, {
    align: "center",
  });
  // Visión de lejos

  doc.rect(margin + 60, y + 42, 18, 8);
  doc.text(`${datos.vlejosSOd || ""}`, margin + 69, y + 46, {
    align: "center",
  });
  doc.rect(margin + 85, y + 42, 18, 8);
  doc.text(`${datos.vlejosSOi || ""}`, margin + 94, y + 46, {
    align: "center",
  });
  doc.rect(margin + 125, y + 42, 18, 8);
  doc.text(`${datos.vlejosCOd || ""}`, margin + 134, y + 46, {
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

  doc.text("Visión de Cerca", labelX, y + 28, { align: "right" });
  doc.text(":", labelX + 2, y + 28);
  doc.text("Visión de Lejos", labelX, y + 48, { align: "right" });
  doc.text(":", labelX + 2, y + 48);

  // Visión de colores
  doc.text("Visión de Colores", labelX, startY, { align: "right" });
  doc.text(":", labelX + 2, startY);
  doc.text(`${(datos.vcolores || "").toUpperCase()}`, margin + 60, startY);

  // Visión binocular
  doc.text("Visión Binocular", labelX, startY + lineHeight, { align: "right" });
  doc.text(":", labelX + 2, startY + lineHeight);
  doc.text(
    `${(datos.vbinocular || "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight
  );

  // Reflejos pupilares
  doc.text("Reflejos Pupilares", labelX, startY + lineHeight * 2, {
    align: "right",
  });
  doc.text(":", labelX + 2, startY + lineHeight * 2);
  doc.text(
    `${(datos.rpupilares || "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight * 2
  );

  // Enfermedades oculares
  doc.text("Enfermedades Oculares", labelX, startY + lineHeight * 3, {
    align: "right",
  });
  doc.text(":", labelX + 2, startY + lineHeight * 3);
  doc.text(
    `${(datos.eoculares || "").toUpperCase()}`,
    margin + 60,
    startY + lineHeight * 3
  );

  // Observación extra - alineada con el primer dato, no con la etiqueta
  if (datos.eoculares1) {
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(
      `${(datos.eoculares1 || "").toUpperCase()}`,
      margin + 60,
      startY + lineHeight * 4
    );
  }

  // Arreglo de firmas que quieres cargar
  const firmasAPintar = [
    { nombre: "SELLOFIRMADOCASIG", x: 20, y: 220, maxw: 120 },
    { nombre: "SELLOFIRMA", x: 80, y: 220, maxw: 100 },
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
