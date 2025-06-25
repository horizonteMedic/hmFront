// src/views/jaspers/AnalisisBioquimicos/Header/Header_HematologiaBioquimica.jsx
import jsPDF from "jspdf";

const Header_HematologiaBioquimica = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const thirty = 30; // Define the vertical spacing constant
  // Punto de partida Y
  let y = 10;

  // --- Logo a la izquierda ---
  const img = "./img/logo-color.png"; // Ajusta la ruta si es necesario
  doc.addImage(img, "PNG", margin, y, 50, 16);

  // --- Sede debajo del Nro Orden (alineado con el nuevo Nro Orden) ---
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Sede : ${datos.sede || ""}`, pageW - margin - 30, y + 8, { align: "right" });

  // --- Fecha debajo de la Sede (alineado con Sede) ---
  // Formatea la fecha a dd/mm/yyyy
  let fechaFormateada = "";
  if (datos.fechaLab) {
    const d = new Date(datos.fechaLab);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    fechaFormateada = `${day}/${month}/${year}`;
  }
  doc.text(`Fecha : ${fechaFormateada}`, pageW - margin - 30, y + 14, { align: "right" });

  // --- Título centrado ---
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("LABORATORIO CLÍNICO", pageW / 2, y + 20, { align: "center" });

  // Nuevo bloque de datos, más arriba y ordenado
  let yDatos = y + 27; // Subido más cerca del logo
  const leftX = margin;
  const rightX = pageW / 2 + 30;

  // Primera línea: Trabajador y N° Ficha
  if (datos.nombres) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    const label = "Trabajador:";
    doc.text(label, leftX, yDatos);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    let xDato = leftX + labelWidth + 4;
    doc.text(String(datos.nombres), xDato, yDatos);
    // Si hay número de ficha, lo mostramos al costado
    if (datos.norden) {
      const nombreWidth = doc.getTextWidth(String(datos.nombres));
      const fichaLabel = "N° Ficha:";
      doc.setFont("helvetica", "bold");
      doc.text(fichaLabel, xDato + nombreWidth + 12, yDatos); // 12 de espacio entre nombre y ficha
      const fichaLabelWidth = doc.getTextWidth(fichaLabel);
      doc.setFont("helvetica", "normal");
      doc.text(String(datos.norden), xDato + nombreWidth + 12 + fichaLabelWidth + 4, yDatos);
    }
    yDatos += 6;
  }

  // Segunda línea: Contrata
  if (datos.contrata) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    const label = "Contrata:";
    doc.text(label, leftX, yDatos);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.contrata), leftX + labelWidth + 4, yDatos);
    yDatos += 6;
  }

  // Tercera línea: Empresa
  if (datos.empresa) {
    doc.setFont("helvetica", "bold").setFontSize(10);
    const label = "Empresa:";
    doc.text(label, leftX, yDatos);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.text(String(datos.empresa), leftX + labelWidth + 4, yDatos);
    yDatos += 6;
  }
};

export default Header_HematologiaBioquimica;
