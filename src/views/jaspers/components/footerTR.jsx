import React from "react";
 
 function footerTR(doc,datos) {
   const pageHeight = doc.internal.pageSize.getHeight();
   const pageWidth = doc.internal.pageSize.getWidth();
   // Aumenta el margen inferior si hace falta (ej. 30 en lugar de 20)
   const marginBottom = 25;
   // Posición base para el footer
   const baseY = pageHeight - marginBottom;
   
   // Calcular el ancho total del contenido del footer para centrarlo
   const contenidoAncho = 180; // Ancho aproximado del contenido
   const inicioX = (pageWidth - contenidoAncho) / 2; // Centrar el contenido
   
   const col1X = inicioX;
   const col2X = inicioX + 55;
   const col3X = inicioX + 105;
   const col4X = inicioX + 160;

   // Línea divisora púrpura antes del footer (centrada)
   const lineY = baseY - 5; // 5mm antes del contenido del footer
   doc.setDrawColor(52, 2, 153); // Color #340299 en RGB
   doc.setLineWidth(0.5); // Grosor de la línea
   doc.line(inicioX, lineY, inicioX + contenidoAncho, lineY); // Línea horizontal centrada

   // Datos de prueba para el footer (si no se pasan datos)
   const datosFooter = datos || {
     dir_tru_pierola: "- Sede Trujillo: Av. Nicolas de Piérola N°1106 Urb. San Fernando",
     dir_huamachuco: "- Sede Huamachuco: Jr. Leoncio Prado N°786",
     dir_huancayo: "- Sede Huancayo: Av. Huancavelica N°2225 - Distrito El Tambo",
     dir_trujillo: "Cl.Guillermo Prescott N°127 Urb. Sto. Dominguito",
     cel_trujillo_pie: "964385075",
     cel_huamachuco: "990094744-969603777",
     email_tru_pierola: "admision@horizontemedic.com",
     email_huancayo: "admision.huancayo@horizontemedic.com",
     telf_tru_pierola: "044-666120",
     telf_huamachuco: "044-348070",
     telf_huancayo: "064-659554"
   };

   // Ajustamos la fuente a normal (no negrita) y color a negro
   doc.setFont("helvetica", "normal").setFontSize(7);
   doc.setTextColor(0, 0, 0);
 
   // Crear líneas de texto centradas
   const lineas = [
     `${datosFooter?.dir_tru_pierola || ""} Cel. ${datosFooter?.cel_trujillo_pie || ""} ${datosFooter?.email_tru_pierola || ""} Telf. ${datosFooter?.telf_tru_pierola || ""}`,
     `${datosFooter?.dir_huamachuco || ""} Cel. ${datosFooter?.cel_huamachuco || ""} ${datosFooter?.email_huancayo || ""} Telf. ${datosFooter?.telf_huamachuco || ""}`,
     `${datosFooter?.dir_huancayo || ""} Telf. ${datosFooter?.telf_huancayo || ""}`,
     `${datosFooter?.dir_trujillo || ""} Telf. 044-767608`
   ];

   // Dibujar cada línea centrada
   let yPos = baseY;
   lineas.forEach((linea) => {
     if (linea.trim()) {
       doc.text(linea, pageWidth / 2, yPos, { align: "center" });
       yPos += 3;
     }
   });
 }
 
 export default footerTR;