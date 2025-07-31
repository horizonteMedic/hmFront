import jsPDF from "jspdf";

export default function Odontograma_lo(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 8;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // 1) Header básico
  const y = 12;
  
  // Logo a la izquierda
  const logoW = 38, logoH = 13;
  const logoY = y - 1;
  try {
    doc.addImage("./img/logo-color.png", "PNG", margin, logoY, logoW, logoH);
  } catch {
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .text("Policlinico Horizonte Medic", margin, logoY + 8);
  }

  // Título centrado
  const titulo = "ODONTOGRAMA LO";
  const tituloY = y + 12;
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(titulo, pageW / 2, tituloY, { align: "center" });

  // Sede y N° Ficha a la derecha
  const sedeValue = `${data.sede || ''}`;
  const fichaValue = `${data.norden || ''}`;
  const sedeX = pageW - margin - 20;
  const sedeY = y + 6;
  const fichaY = sedeY + 6;

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Sede:", sedeX - 30, sedeY, { align: "left" });
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text(sedeValue, sedeX, sedeY, { align: "right" });

  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("N° Ficha:", sedeX - 40, fichaY, { align: "left" });
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text(fichaValue, sedeX, fichaY, { align: "right" });

  // 2) Datos del paciente
  doc.setFont("helvetica", "normal").setFontSize(10);
  const datosY = y + 25;

  // Nombre
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Paciente:", margin + 10, datosY);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(data.nombres || ""), margin + 30, datosY, { maxWidth: 80 });

  // DNI
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("DNI:", margin + 120, datosY);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(data.dni || ""), margin + 135, datosY);

  // Edad
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text("Edad:", margin + 170, datosY);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(String(data.edad || ""), margin + 185, datosY);

  // 3) Odontograma LO (Layout Optimizado)
  const odontogramaY = datosY + 15;
  
  // Dibujar cuadrícula del odontograma con layout optimizado
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  
  // Dientes superiores (1-16) - Layout más compacto
  const dienteSize = 6; // Dientes más pequeños para optimizar espacio
  const startX = margin + 15;
  const startY = odontogramaY;
  
  // Fila superior (dientes 1-8)
  for (let i = 0; i < 8; i++) {
    const x = startX + (i * dienteSize);
    doc.rect(x, startY, dienteSize, dienteSize);
    doc.setFont("helvetica", "bold").setFontSize(5);
    doc.text((i + 1).toString(), x + dienteSize/2, startY + dienteSize/2, { align: "center", baseline: "middle" });
  }
  
  // Fila superior (dientes 9-16)
  for (let i = 0; i < 8; i++) {
    const x = startX + ((i + 8) * dienteSize);
    doc.rect(x, startY, dienteSize, dienteSize);
    doc.setFont("helvetica", "bold").setFontSize(5);
    doc.text((i + 9).toString(), x + dienteSize/2, startY + dienteSize/2, { align: "center", baseline: "middle" });
  }
  
  // Dientes inferiores (17-32)
  const startYInferior = startY + dienteSize + 8;
  
  // Fila inferior (dientes 17-24)
  for (let i = 0; i < 8; i++) {
    const x = startX + (i * dienteSize);
    doc.rect(x, startYInferior, dienteSize, dienteSize);
    doc.setFont("helvetica", "bold").setFontSize(5);
    doc.text((i + 17).toString(), x + dienteSize/2, startYInferior + dienteSize/2, { align: "center", baseline: "middle" });
  }
  
  // Fila inferior (dientes 25-32)
  for (let i = 0; i < 8; i++) {
    const x = startX + ((i + 8) * dienteSize);
    doc.rect(x, startYInferior, dienteSize, dienteSize);
    doc.setFont("helvetica", "bold").setFontSize(5);
    doc.text((i + 25).toString(), x + dienteSize/2, startYInferior + dienteSize/2, { align: "center", baseline: "middle" });
  }

  // 4) Leyenda compacta
  const leyendaY = startYInferior + dienteSize + 12;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Leyenda:", margin + 10, leyendaY);
  
  doc.setFont("helvetica", "normal").setFontSize(7);
  const leyendas = [
    "N-Normal",
    "C-Caries", 
    "O-Obturación",
    "E-Extraído",
    "P-Prótesis"
  ];
  
  leyendas.forEach((leyenda, index) => {
    const x = margin + 10 + (index * 25);
    doc.text(leyenda, x, leyendaY + 6);
  });

  // 5) Información adicional
  const infoY = leyendaY + 15;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Información Adicional:", margin + 10, infoY);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  const infoAdicional = [
    "• Estado actual de cada diente",
    "• Tratamientos realizados",
    "• Observaciones especiales"
  ];
  
  infoAdicional.forEach((info, index) => {
    doc.text(info, margin + 10, infoY + 8 + (index * 4));
  });

  // 6) Observaciones
  const observacionesY = infoY + 25;
  doc.setFont("helvetica", "bold").setFontSize(9);
  doc.text("Observaciones:", margin + 10, observacionesY);
  
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(String(data.observaciones || ""), margin + 10, observacionesY + 6, { maxWidth: pageW - 2 * margin - 20 });

  // 7) Fecha
  const fechaY = pageH - 15;
  doc.setFont("helvetica", "normal").setFontSize(8);
  const fecha = new Date().toLocaleDateString('es-ES');
  doc.text(`Fecha: ${fecha}`, pageW - margin - 25, fechaY);

  // Generar blob y abrir en iframe para imprimir automáticamente
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
} 