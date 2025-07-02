// src/views/jaspers/AnalisisBioquimicos/Header/Header_HematologiaBioquimica.jsx
import jsPDF from "jspdf";

const Header_HematologiaBioquimica = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const thirty = 30; // Define the vertical spacing constant
  // Punto de partida Y
  let y = 10;

  // --- Header superior ---
  const img = "./img/logo-color.png"; // Ajusta la ruta si es necesario
  const logoW = 50;
  const logoH = 16;
  doc.addImage(img, "PNG", margin, y, logoW, logoH);

  // Determinar si hay color
  const colorValido = typeof datos.color === "number" && datos.color >= 1 && datos.color <= 50;
  let colorBoxWidth = 0;
  if (colorValido) colorBoxWidth = 22; // 15mm box + 7mm espacio

  // Datos alineados a la derecha (dejando espacio para el color si existe)
  const datosX = pageW - margin - colorBoxWidth;
  let datosY = y + 2;
  // N° Ficha (solo número, sin label, más grande, subrayado)
  if (datos.norden) {
    doc.setFont("helvetica", "bold").setFontSize(22); // aún más grande
    doc.text(String(datos.norden), datosX, datosY, { align: "right" });
    // Subrayado negro debajo del número
    const fichaWidth = doc.getTextWidth(String(datos.norden));
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(
      datosX - fichaWidth,
      datosY + 2.5,
      datosX,
      datosY + 2.5
    );
    datosY += 10;
  }
  // Sede
  if (datos.sede) {
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(`Sede: ${datos.sede}`, datosX, datosY, { align: "right" });
    datosY += 6;
  }
  // Fecha
  let fechaFormateada = "";
  if (datos.fechaLab) {
    const d = new Date(`${datos.fechaLab}T00:00:00`);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    fechaFormateada = `${day}/${month}/${year}`;
    doc.text(`Fecha: ${fechaFormateada}`, datosX, datosY, { align: "right" });
    datosY += 6;
  }

  // Si hay color, mostrar texto y recuadro de color a la derecha de los datos
  if (colorValido) {
    let color = datos.codigoColor || "#008f39";
    let boxText = (datos.textoColor || "F").toUpperCase();
    const boxSize = 15;
    const boxX = pageW - margin - boxSize; // pegado al margen derecho
    const boxY = y + 2;
    // Draw box outline in black
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxSize, boxSize, 2, 2);
    // Solo renderiza si color es válido
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.setLineCap('round');
    doc.line(boxX + boxSize + 3, boxY, boxX + boxSize + 3, boxY + boxSize);
    doc.setLineCap('butt');
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color);
    doc.text(boxText, boxX + boxSize/2, boxY + (boxSize/2), { 
      align: "center",
      baseline: "middle",
      maxWidth: boxSize - 1
    });
    // Reset color settings after drawing the colored elements
    doc.setDrawColor(0);
    doc.setTextColor(0);
    doc.setLineWidth(0.2)
  }

  // --- Título centrado ---
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("LABORATORIO CLÍNICO", pageW / 2, y + 20, { align: "center" });

  // --- Datos principales debajo del header ---
  let yDatos = y + 27;
  const leftX = margin;

  // Primera línea: Trabajador
  if (datos.nombres) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Trabajador:", leftX, yDatos);
    const labelWidth = doc.getTextWidth("Trabajador:");
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.nombres), leftX + labelWidth + 4, yDatos);
    yDatos += 6;
  }

  // Segunda línea: Empresa
  if (datos.empresa) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Empresa:", leftX, yDatos);
    const labelWidth = doc.getTextWidth("Empresa:");
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.empresa), leftX + labelWidth + 4, yDatos);
    yDatos += 6;
  }

  // Tercera línea: Contrata
  if (datos.contrata) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    doc.text("Contrata:", leftX, yDatos);
    const labelWidth = doc.getTextWidth("Contrata:");
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.contrata), leftX + labelWidth + 4, yDatos);
    yDatos += 6;
  }
};

export default Header_HematologiaBioquimica;
