import React from "react";
import jsPDF from "jspdf";
import header from "./components/header";
import footer from "./components/footer";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default function Ecografia (datos) {

    const doc = new jsPDF();

    // Llamamos al header (si tienes un encabezado personalizado)
    headerHR(doc,datos);

    // Ajustes iniciales de fuente y color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

    // Punto inicial vertical
    let startY = 50;

    // Ancho de la página (para centrar texto y diagrama)
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- TÍTULO PRINCIPAL ---
    
    // --- DIAGRAMA DE FLUJO CENTRADO ---
    // Definimos un ancho/alto para las formas ovaladas
    const shapeWidth = 60;
    const shapeHeight = 12;
    const cornerRadius = 6; // para bordes ovalados
    const centerX = pageWidth / 2; // centro horizontal de la página
    const drawLine = (x1, y1, x2, y2) => {
      doc.line(x1, y1, x2, y2);
    };
    // Dibuja ADMISION (ovalada)
    drawBox(doc,"ADMISION", 90, 65, 30, 10, 4, datos.orden ? true : false);
    drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
    drawBox(doc,"TRIAJE", 90, 80, 30, 10, 4, datos.triaje ? true : false);
    drawLine(105, 90, 105, 95); // Línea desde "TRIAJE" hacia abajo
    drawBox(doc,"ECOGRAFIA", 90, 95, 30, 10, 4);
    

    // Puedes dejar espacio extra al final del diagrama
  // Dibuja el diagrama de flujo

    let finalY = startY + 90;

     // Indicaciones: Título en rojo
     doc.setFontSize(10);               // Establece el tamaño de fuente a 10 para "INDICACIONES:"
     doc.setFont("helvetica", "bold");  // Pone en negrita
     doc.setTextColor(255, 0, 0);       // Cambia el color a rojo
     doc.text("INDICACIONES:", 15, finalY);
     finalY += 5;
     // Vuelve a la configuración original para el resto del texto
     doc.setFont("helvetica", "normal"); // Fuente normal para el resto
     doc.setFontSize(8);                 // Vuelve a tamaño de fuente 8
     doc.setTextColor(0, 0, 0);          // Regresa al color negro
     doc.text(
       "- Si ud. es conductor y/o operador dejar una copia a color de su DNI y licencia de conducir.",
       20,
       finalY
     );
     finalY += 5;
     doc.text(
       "- Si ud. no es conductor dejar una copia a color de su DNI.",
       20,
       finalY
     );
     finalY += 5;
     doc.text(
       "- Si es conductor u operador de maquinaria pesada también debe dejar copia a color de su DNI.",
       20,
       finalY
     );
     finalY += 10;
 
    // Llamamos al footer (si tienes un pie de página personalizado)
    footer(doc,datos);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Crear un iframe invisible para imprimir directamente
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
  }

  
};

