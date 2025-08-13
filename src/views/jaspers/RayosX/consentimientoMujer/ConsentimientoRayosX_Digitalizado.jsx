import jsPDF from "jspdf";
import footerCons from "./FooterCons.jsx";
import headerConInformadoOcupacional from "./Header/header_conInformadoOcupacional_Digitalizado.jsx";

export default function ConsentimientoRayosX_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba
  const datosPrueba = {
    nombre: "VIVIANA AYDE DELGADO VEGA",
    edad: "19",
    dni: "75461024",
    ocupacion: "CAPATAZ",
    empresa:
      "CORPORACION PERUANA DE CENTROS MEDICOS SAC CON RUC 20123456789 Y DENOMINACION COMERCIAL EXTENDIDA RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    fecha: "2025-08-01",
  };
  function formatearFechaLarga(fecha) {
    if (fecha == "" || fecha == null) {
      return "";
    }
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const [anio, mes, dia] = fecha.split("-");
    return `${dia.padStart(2, "0")} de ${meses[parseInt(mes) - 1]} del ${anio}`;
  }

  // Función para obtener string de datos
  const obtenerString = (nombre) => {
    return data[nombre] != null ? `${data[nombre]}` : "";
  };

  // Función para convertir a mayúsculas los campos específicos
  const obtenerStringMayus = (nombre) => {
    const valor = data[nombre] != null ? `${data[nombre]}` : "";
    return valor.toUpperCase();
  };

  // Datos reales
  const datosReales = {
    nombre: obtenerStringMayus("nombres"),
    dni: obtenerString("dni"),
    edad: obtenerString("edad"),
    ocupacion: obtenerStringMayus("ocupacion"),
    empresa: obtenerStringMayus("empresa"),
    fecha: obtenerString("fecha"),
    codigoSede:obtenerString("codigoSede"), 
  };

  const sello1 = data.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "FIRMAP"
  );
  const sello2 = data.digitalizacion?.find(
    (d) => d.nombreDigitalizacion === "HUELLA"
  );
  const isValidUrl = (url) => url && url !== "Sin registro";
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => {
    // Usar datos reales o datos de prueba
    const datosFinales =
      data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

    // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
    headerConInformadoOcupacional(doc, data);

    // === 1) TÍTULO PRINCIPAL ===
    const titulo1 =
      "Consentimiento de Toma Radiográfica en Mujeres".toUpperCase();
    const titulo2 = "en Edad Fértil".toUpperCase();

    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text(titulo1, pageW / 2, margin + 25, { align: "center" });
    doc.text(titulo2, pageW / 2, margin + 35, { align: "center" });

    // Subrayado para los títulos
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    const titulo1Width = doc.getTextWidth(titulo1);
    const titulo2Width = doc.getTextWidth(titulo2);
    doc.line(
      (pageW - titulo1Width) / 2,
      margin + 27,
      (pageW + titulo1Width) / 2,
      margin + 27
    );
    doc.line(
      (pageW - titulo2Width) / 2,
      margin + 37,
      (pageW + titulo2Width) / 2,
      margin + 37
    );

    // === 2) PÁRRAFO CON TEXTO EN NEGRITA PARA NOMBRE, DNI Y OCUPACIÓN ===
    let currentY = margin + 55;
    doc.setFont("helvetica", "normal").setFontSize(11);

    // Texto completo dividido en partes para rayos X
    const textoPartes = [
        {text: "Yo ", bold: false},
        {text: datosFinales.nombre, bold: true},
        {text: " identificado con DNI: ", bold: false},
        {text: datosFinales.dni, bold: true},
        {text: " de ", bold: false},
        {text: `${datosFinales.edad} años de edad`, bold: true},
        {text: ", con ocupación laboral de: ", bold: false},
        {text: datosFinales.ocupacion, bold: true},
        {text: " de la empresa:", bold: false}
    ];

    // Configuración de formato
    const lineHeight = 5;
    const maxWidth = pageW - 2 * margin;
    let currentX = margin;

    // Función para agregar una línea completa
    const agregarLinea = (texto, esNegrita) => {
        doc.setFont("helvetica", esNegrita ? "bold" : "normal");
        doc.text(texto, currentX, currentY);
        currentX += doc.getTextWidth(texto);
    };

    // Procesar cada parte del texto
    textoPartes.forEach((parte) => {
        const palabras = parte.text.split(' ');
        palabras.forEach((palabra, i) => {
            const palabraConEspacio = i > 0 ? ' ' + palabra : palabra;
            const anchoPalabra = doc.getTextWidth(palabraConEspacio);
            
            if (currentX + anchoPalabra <= maxWidth + margin) {
                // Agregar a la línea actual
                agregarLinea(palabraConEspacio, parte.bold);
            } else {
                // Nueva línea
                currentY += lineHeight;
                currentX = margin;
                agregarLinea(palabra, parte.bold);
            }
        });
    });

    // Ajustar posición Y para siguiente sección
    currentY += lineHeight;

    // === 3) CERTIFICACIÓN ===
    // doc.setFont("helvetica", "normal").setFontSize(11);

    // doc.text("De la empresa:", margin, margin + 85);

    // === 4) NOMBRE DE LA EMPRESA ===
    doc.setFont("helvetica", "bold").setFontSize(12);
    
    // Calcular el ancho máximo disponible para la empresa
    const maxEmpresaWidth = pageW - 2 * margin - 20;
    const empresaLines = doc.splitTextToSize(datosFinales.empresa, maxEmpresaWidth);
    
    // Usar la posición final del párrafo + espaciado
    const empresaStartY = currentY + 5;
    
    empresaLines.forEach((line, index) => {
      doc.text(line, pageW / 2, empresaStartY + (index * 6), { align: "center" });
    });
    
    // Ajustar la posición Y para la siguiente sección basándose en el número de líneas
    const empresaEndY = empresaStartY + (empresaLines.length * 6);

    // === 5) CUERPO DEL CONSENTIMIENTO ===
    doc.setFont("helvetica", "normal").setFontSize(11);
    const consentimiento =
      "Declaro que he recibido explicaciones satisfactorias sobre el propósito, naturaleza y riesgos de la toma de RAYOS X, por lo cual doy de conocimiento y declaro que a la fecha no me encuentro en estado de gestación, ya que soy consciente de los eventuales riesgos que se pueden derivar de la realización de dicho examen en caso de encontrarme gestando. Por lo cual AUTORIZO a que se me realice la radiografía, indicada por el protocolo de la empresa contratante.";

    // Usar la posición final de la empresa + espaciado para el cuerpo del consentimiento
    const cuerpoY = empresaEndY + 5; // 5 puntos de separación después de la empresa
    
    // Dividir el texto en líneas para mejor control del espaciado
    const consentimientoLines = doc.splitTextToSize(consentimiento, pageW - 2 * margin);
    
    consentimientoLines.forEach((line, index) => {
      doc.text(line, margin, cuerpoY + (index * 6), {
        align: "left",
      });
    });
    
    // Calcular la posición final del cuerpo del consentimiento
    const cuerpoEndY = cuerpoY + (consentimientoLines.length * 6);

    doc.text(
      "Y para que así conste, firmo el presente consentimiento.",
      margin,
      cuerpoEndY + 30
    );

    doc.text(
      `${datosFinales.codigoSede}, ${formatearFechaLarga(datosFinales.fecha)}`,
      margin,
      cuerpoEndY + 45
    );

    // === 6) FOOTER CON FECHA, Y FIRMAS ===
    const footerY = pageH - 80;

    // Calcular el ancho total del bloque (huella + espacio + firma)
    const huellaSize = 35;
    const espacioEntre = 40;
    const firmaWidth = 60;
    const anchoTotal = huellaSize + espacioEntre + firmaWidth;

    // Calcular la posición X para centrar el bloque completo
    const bloqueX = (pageW - anchoTotal) / 2;

    // Línea para firma (ahora a la izquierda)
    const firmaX = bloqueX;
    const firmaY = footerY + 7;
    doc.setLineWidth(0.5);
    doc.line(firmaX, firmaY + 12, firmaX + firmaWidth, firmaY + 12);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("Firma", firmaX + firmaWidth / 2, firmaY + 20, {
      align: "center",
    });

    // Cuadro para huella (ahora a la derecha)
    const huellaX = firmaX + firmaWidth + espacioEntre;
    const huellaY = footerY - 15;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(huellaX, huellaY, huellaSize, huellaSize);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("Huella", huellaX + huellaSize / 2, huellaY + huellaSize + 5, {
      align: "center",
    });

    // if (s2) {
    //   const canvas = document.createElement("canvas");
    //   canvas.width = s2.width;
    //   canvas.height = s2.height;
    //   const ctx = canvas.getContext("2d");
    //   ctx.drawImage(s2, 0, 0);
    //   const selloBase64 = canvas.toDataURL("image/png");

    //   // Dimensiones máximas permitidas dentro del cuadro de huella
    //   const maxImgW = huellaSize - 4; // margen interno de 2px por lado
    //   const maxImgH = huellaSize - 4;

    //   // Tamaño real de la imagen
    //   let imgW = s2.width;
    //   let imgH = s2.height;

    //   // Escalado proporcional para que quepa dentro del cuadro
    //   const scaleW = maxImgW / imgW;
    //   const scaleH = maxImgH / imgH;
    //   const scale = Math.min(scaleW, scaleH, 1);

    //   imgW *= scale;
    //   imgH *= scale;

    //   // Posición centrada dentro del cuadro de huella
    //   const imgX = huellaX + (huellaSize - imgW) / 2;
    //   const imgY = huellaY + (huellaSize - imgH) / 2;

    //   doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
    // }

    // if (s1) {
    //   const canvas = document.createElement("canvas");
    //   canvas.width = s1.width;
    //   canvas.height = s1.height;
    //   const ctx = canvas.getContext("2d");
    //   ctx.drawImage(s1, 0, 0);
    //   const firmaBase64 = canvas.toDataURL("image/png");

    //   // Máximo ancho y alto permitidos para la firma (puedes ajustar)
    //   const maxImgW = 70;
    //   const maxImgH = 35;

    //   let imgW = s1.width;
    //   let imgH = s1.height;

    //   const scaleW = maxImgW / imgW;
    //   const scaleH = maxImgH / imgH;
    //   const scale = Math.min(scaleW, scaleH, 1);

    //   imgW *= scale;
    //   imgH *= scale;

    //   // Centrar horizontalmente en la línea de firma
    //   const imgX = firmaX + (firmaWidth - imgW) / 2;

    //   // Ubicar justo encima de la línea (firmaY + 12) con un margen de 2px
    //   const imgY = firmaY + 12 - imgH - 2;

    //   doc.addImage(firmaBase64, "PNG", imgX, imgY, imgW, imgH);
    // }
    // --- Imagen de huella ---
    if (s2) {
      const canvas = document.createElement("canvas");
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL("image/png");

      // Dimensiones máximas dentro del cuadro de huella
      const maxImgW = huellaSize - 4; // margen interno de 2px por lado
      const maxImgH = huellaSize - 4;

      // Escalar proporcionalmente
      let imgW = s2.width;
      let imgH = s2.height;
      const scale = Math.min(maxImgW / imgW, maxImgH / imgH, 1);
      imgW *= scale;
      imgH *= scale;

      // Centrar dentro del cuadro
      const imgX = huellaX + (huellaSize - imgW) / 2;
      const imgY = huellaY + (huellaSize - imgH) / 2;

      doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
    }

    // --- Imagen de firma ---
    if (s1) {
      const canvas = document.createElement("canvas");
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(s1, 0, 0);
      const firmaBase64 = canvas.toDataURL("image/png");

      // Tamaño máximo permitido para la firma
      const maxImgW = firmaWidth - 4; // pequeño margen
      const maxImgH = 35; // altura máxima recomendada

      let imgW = s1.width;
      let imgH = s1.height;
      const scale = Math.min(maxImgW / imgW, maxImgH / imgH, 1);
      imgW *= scale;
      imgH *= scale;

      // Centrar horizontalmente en el área de firma
      const imgX = firmaX + (firmaWidth - imgW) / 2;

      // Colocar justo encima de la línea de firma
      const imgY = firmaY + 12 - imgH - 2;

      doc.addImage(firmaBase64, "PNG", imgX, imgY, imgW, imgH);
    }

    // === 7) FOOTER CON LÍNEA PÚRPURA Y DATOS DE CONTACTO ===
    const footerContactY = pageH - 25;

    // Línea separadora horizontal
    doc.setDrawColor(51, 0, 153); // Color #330099
    doc.setLineWidth(1);
    doc.line(margin, footerContactY - 5, pageW - margin, footerContactY - 5);

    // Restaurar color negro para el texto
    doc.setDrawColor(0, 0, 0);
    doc.setTextColor(0, 0, 0);

    // Agregar footer con datos de contacto
    footerCons(doc, data);

    // === 8) Generar blob y abrir en iframe para imprimir automáticamente ===
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
  });
}
