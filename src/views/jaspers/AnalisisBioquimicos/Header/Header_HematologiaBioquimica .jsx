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

  // --- Nro Orden con sufijo "-TP" a la derecha (movido más a la izquierda) ---
  const nro = datos.norden ? `${datos.norden}-TP` : "";
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text(nro, pageW - margin - 30, y + 2, { align: "right" });

  // --- Sede debajo del Nro Orden (alineado con el nuevo Nro Orden) ---
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Sede : ${datos.sede || ""}`, pageW - margin - 30, y + 8, { align: "right" });

  // --- Fecha debajo de la Sede (alineado con Sede) ---
  doc.text(`Fecha : ${datos.fechaLab || ""}`, pageW - margin - 30, y + 14, { align: "right" });

  // --- Título centrado ---
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("LABORATORIO CLÍNICO", pageW / 2, y + 24, { align: "center" });

  // Avanzamos la línea base para los datos de trabajador/ficha
  let y2 = y +  thirty; // 10 + 20

  // --- Trabajador a la izquierda ---
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Trabajador :", margin, y2);
  doc.setFont("helvetica", "normal");
  doc.text(datos.nombres || "", margin + 30, y2);

  // --- N° Ficha a la derecha de la mitad ---
  const fichaXStart = pageW / 2 + 10;
  doc.setFont("helvetica", "bold");
  doc.text("N° Ficha :", fichaXStart, y2);

  // Caja para el número de ficha
  const ficha = String(datos.norden) || "";
  const boxW = 25;
  const boxH = 6;
  const boxX = fichaXStart + 20;
  const boxY = y2 - 4;
  doc.setLineWidth(0.3).rect(boxX, boxY, boxW, boxH);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(ficha, boxX + boxW / 2, y2, { align: "center" });

  // Bajamos para la siguiente línea
  y2 += 8;

  // --- Empresa Contratista a la izquierda ---
  doc.setFont("helvetica", "bold");
  doc.text("Empresa Contratista :", margin, y2);
  doc.setFont("helvetica", "normal");
  doc.text(datos.contrata || "N/A", margin + 45, y2);

  // --- Empresa principal a la derecha ---
  doc.setFont("helvetica", "bold");
  doc.text("Empresa :", fichaXStart, y2);
  doc.setFont("helvetica", "normal");
  doc.text(datos.empresa || "", fichaXStart + 25, y2);
};

export default Header_HematologiaBioquimica;
