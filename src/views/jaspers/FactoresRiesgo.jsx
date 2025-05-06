import React from "react";
import jsPDF from "jspdf";
import footer from "./components/footer";
import headerHR from "./components/headerHR";
import drawBox from "./components/drawBox";
import drawC from "./components/drawC";

export default function FactoresRiesgo (datos) {

    const doc = new jsPDF();
    // Encabezado (logo, datos de empresa, etc.)
    headerHR(doc,datos);

    // Ajusta fuente y color por defecto
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

    let startY = 50;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título principal, más grande y negrita, centrado
    startY += 10;
    const drawLine = (x1, y1, x2, y2) => {
      doc.line(x1, y1, x2, y2);
    };
    // Dibuja el diagrama de flujo
    drawBox(doc,"ADMISION", 90, 65, 30, 10, 4, datos.orden ? true : false);
    drawLine(105, 75, 105, 80); // Línea desde "TRIAJE" hacia abajo
    drawBox(doc,"TRIAJE", 90, 80, 30, 10, 4, datos.triaje ? true : false);
    drawLine(105, 90, 105, 95); // Línea desde "TRIAJE" hacia abajo
    drawBox(doc,"LABORATORIO", 90, 95, 30, 10, 4, datos.laboratorio ? true : false);
    drawLine(105, 105, 105, 110); // Línea desde "TRIAJE" hacia abajo
    drawBox(doc,"EVALUACION MEDICA", 80, 110, 50, 10, 4, datos.anexo7c ? true : false);

    let finalY = startY + 80;

    // INDICACIONES en rojo y negrita, tamaño 10
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text("INDICACIONES:", 15, finalY);
    finalY += 5;

    // Vuelve a normal, tamaño 8, color negro para el listado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

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
      "- Si ud. va a pasar examen psicosensométrico dejar copia de su DNI.",
      20,
      finalY
    );
    finalY += 10;

    // Footer (paginación, datos de contacto, etc.)
    footer(doc,datos);

    // Abre el PDF en una nueva pestaña
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


