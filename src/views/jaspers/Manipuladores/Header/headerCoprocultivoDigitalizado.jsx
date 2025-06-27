// src/views/jaspers/AnalisisBioquimicos/Header/headerManipuladores.jsx
const headerCoprocultivoDigitalizado = (doc, datos = {}) => {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 10;

  // 1. Logo
  const img = "./img/logo-color.png";
  doc.addImage(img, "PNG", margin, y, 50, 16);
  y += 18;

  // 2. Sede (derecha)
//   doc.setFontSize(11).setFont("helvetica", "bold");
//   doc.text("Sede :", pageW - margin - 60, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(`${datos.sede || ""}`, pageW - margin - 10, y, { align: "right" });
  y += 7;

  // 3. Nro Orden (derecha)
  doc.setFontSize(11).setFont("helvetica", "bold");
doc.text("Nro Orden :", pageW - margin - 60, y);

doc.setFontSize(17).setFont("helvetica", "bold");
doc.text(`${datos.norden || ""}`, pageW - margin - 10, y, { align: "right" });

const texto = `${datos.norden || ""}`;
const textWidth = doc.getTextWidth(texto);

// Línea subrayada justo debajo del número de orden
doc.setDrawColor(0);
doc.setLineWidth(0.5);
doc.line(
  pageW - margin - 10 - textWidth, // inicio: alineado al principio del texto
  y + 2.5,                         // un poco debajo del texto
  pageW - margin - 10,            // fin: alineado al final del texto
  y + 2.5
);
  
  y += 12;


  // 4. Apellidos y Nombres (izquierda)
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Apellidos y Nombres :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.nombre || datos.nombres || ""}`, margin + 55, y);
  y += 7;

  // 5. Edad (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Edad :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.edad || ""} AÑOS`, margin + 20, y);
  y += 7;

  // 6. Fecha (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Fecha :", margin, y);
  doc.setFont("helvetica", "normal");

const fechaISO = datos.fecha ;
const fecha = new Date(fechaISO);

const dia = String(fecha.getDate()).padStart(2, "0");
const mes = fecha.toLocaleString("es-ES", { month: "long" }); // mes como texto
const anio = fecha.getFullYear();

const formato = `${dia} ${mes} ${anio}`;
  doc.text(`${datos.fecha ? formato : ""}`, margin + 22, y);
  y += 7;

  // 7. Muestra (izquierda)
  doc.setFont("helvetica", "bold");
  doc.text("Muestra :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${datos.txtmuestra || ""}`, margin + 25, y);
};

export default headerCoprocultivoDigitalizado;
