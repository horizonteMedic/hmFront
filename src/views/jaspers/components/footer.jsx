import React from "react";
 
 function footer(doc,datos) {
   // Altura total de la página
   const pageHeight = doc.internal.pageSize.getHeight();
   // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
   const marginBottom = 30;
   // Posición base para el footer
   const baseY = pageHeight - marginBottom;
 
   // Posiciones X para las 4 columnas
   // (Si sigue cortándose, mueve col4X un poco más a la izquierda)
   const col1X = 15;
   const col2X = 70;
   const col3X = 120;
   const col4X = 175;
 
   // Ajustamos la fuente a 8 y color a negro
   doc.setFontSize(8);
   doc.setTextColor(0, 0, 0);
 
   // --------------------------------------
   //       COLUMNA 1
   // --------------------------------------
   let col1Y = baseY;
   doc.text(`${datos?.dirTruPierola || ""}`, col1X, col1Y);
   col1Y += 5;
   doc.text(`${datos?.dirHuamachuco || ""}`, col1X, col1Y);
   col1Y += 5;
   doc.text(`${datos?.dirHuancayo || ""}`, col1X, col1Y);
   col1Y += 5;
   doc.text(`${datos?.dirTrujillo || ""}`, col1X, col1Y);
 
   // --------------------------------------
   //       COLUMNA 2
   // --------------------------------------
   let col2Y = baseY;
   doc.text(`Cel. ${datos?.celTrujilloPie || ""}`, col2X+29, col2Y);
   col2Y += 5;
   doc.text(`Cel. ${datos?.celHuamachuco || ""}`, col2X+10, col2Y);
 
   // --------------------------------------
   //       COLUMNA 3
   // --------------------------------------
   let col3Y = baseY;
   doc.text(`${datos?.emailTruPierola || ""}`, col3X+7, col3Y);
   col3Y += 5;
   doc.text(`${datos?.emailHuancayo || ""}`, col3X, col3Y);
 
   // --------------------------------------
   //       COLUMNA 4
   // --------------------------------------
   let col4Y = baseY;
   doc.text(`Telf. ${datos?.telfTruPierola || ""}`, col4X, col4Y);
   col4Y += 5;
   doc.text(`Telf. ${datos?.telfHuamachuco || ""}`, col4X, col4Y);
   col4Y += 5;
   doc.text(`Telf. ${datos?.telfHuancayo || ""}`, col4X, col4Y);
 }
 
 export default footer;