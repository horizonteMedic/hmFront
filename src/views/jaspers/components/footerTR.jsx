import React from "react";
 
 function footerTR(doc,datos) {
   const pageHeight = doc.internal.pageSize.getHeight();
   // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
   const marginBottom = 25;
   // Posición base para el footer
   const baseY = pageHeight - marginBottom;
   const col1X = 15;
   const col2X = 70;
   const col3X = 120;
   const col4X = 175;
 
   // Ajustamos la fuente a 8 y color a negro
   doc.setFontSize(7);
   doc.setTextColor(0, 0, 0);
 
   //       COLUMNA 1
   let col1Y = baseY;
   doc.text(`${datos?.dir_tru_pierola || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dir_huamachuco || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dir_huancayo || ""}`, col1X, col1Y);
   col1Y += 4;
   doc.text(`${datos?.dir_trujillo || ""}`, col1X, col1Y);
 
   //       COLUMNA 2
   let col2Y = baseY;
   doc.text(`Cel. ${datos?.cel_trujillo_pie || ""}`, col2X+29, col2Y);
   col2Y += 4;
   doc.text(`Cel. ${datos?.cel_huamachuco || ""}`, col2X+10, col2Y);
 
   //       COLUMNA 3
   let col3Y = baseY;
   doc.text(`${datos?.email_tru_pierola || ""}`, col3X+7, col3Y);
   col3Y += 4;
   doc.text(`${datos?.email_huancayo || ""}`, col3X, col3Y);
 
   //       COLUMNA 4
   let col4Y = baseY;
   doc.text(`Telf. ${datos?.telf_tru_pierola || ""}`, col4X, col4Y);
   col4Y += 4;
   doc.text(`Telf. ${datos?.telf_huamachuco || ""}`, col4X, col4Y);
   col4Y += 4;
   doc.text(`Telf. ${datos?.telf_huancayo || ""}`, col4X, col4Y);
 }
 
 export default footerTR;