import jsPDF from "jspdf";
import footerCons from "./FooterCons.jsx";
import headerConInformadoOcupacional from "./Header/header_conInformadoOcupacional_Digitalizado.jsx";

export default function conInformadoOcupacional_Digitalizado(data = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Datos de prueba
  const datosPrueba = {
    nombre: "VIVIANA AYDE DELGADO VEGA",
    dni: "75461024",
    ocupacion: "CAPATAZ",
    empresa: "CORPORACION PERUANA DE CENTROS MEDICOS SAC CON RUC 20123456789 Y DENOMINACION COMERCIAL EXTENDIDA",
    fecha: "05 agosto 2025",
    hora: "4.10 PM"
  };

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
    ocupacion: obtenerStringMayus("ocupacion"),
    empresa: obtenerStringMayus("empresa"),
    fecha: obtenerString("fecha"),
    hora: obtenerString("hora")
  };

  const sello1 = data.digitalizacion?.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello2 = data.digitalizacion?.find(d => d.nombreDigitalizacion === "HUELLA");
  const isValidUrl = url => url && url !== "Sin registro";
  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
    isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
  ]).then(([s1, s2]) => { 
      // Usar datos reales o datos de prueba
    const datosFinales = data && Object.keys(data).length > 0 ? datosReales : datosPrueba;

    // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
    headerConInformadoOcupacional(doc, data);

    // === 1) TÍTULO PRINCIPAL ===
    const titulo1 = "CONSENTIMIENTO INFORMADO PARA AUTORIZAR";
    const titulo2 = "EL EXAMEN MEDICO OCUPACIONAL";
    
    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text(titulo1, pageW / 2, margin + 25, { align: "center" });
    doc.text(titulo2, pageW / 2, margin + 35, { align: "center" });

    // Subrayado para los títulos
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    const titulo1Width = doc.getTextWidth(titulo1);
    const titulo2Width = doc.getTextWidth(titulo2);
    doc.line((pageW - titulo1Width) / 2, margin + 27, (pageW + titulo1Width) / 2, margin + 27);
    doc.line((pageW - titulo2Width) / 2, margin + 37, (pageW + titulo2Width) / 2, margin + 37);

    // === 2) INFORMACIÓN PERSONAL ===
    doc.setFont("helvetica", "normal").setFontSize(12);
    
    // "Yo" seguido del nombre
    doc.text("Yo", margin, margin + 55);
    doc.setFont("helvetica", "bold");
    doc.text(datosFinales.nombre, margin + 8, margin + 55);

    // DNI
    doc.setFont("helvetica", "normal");
    doc.text("identificado con documento de identidad N°:", margin, margin + 65);
    doc.setFont("helvetica", "bold");
    doc.text(datosFinales.dni, margin + 95, margin + 65);

    // Ocupación
    doc.setFont("helvetica", "normal");
    doc.text("Con ocupacion laboral de:", margin, margin + 75);
    doc.setFont("helvetica", "bold");
    doc.text(datosFinales.ocupacion, margin + 50, margin + 75);

    // === 3) CERTIFICACIÓN ===
    doc.setFont("helvetica", "normal").setFontSize(11);
    const certificacion = "certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:";
    doc.text(certificacion, margin, margin + 90, { maxWidth: pageW - 2 * margin, align: "justify" });

    // === 4) NOMBRE DE LA EMPRESA ===
    doc.setFont("helvetica", "bold").setFontSize(12);
    
    // Calcular el ancho máximo disponible para la empresa
    const maxEmpresaWidth = pageW - 2 * margin - 20; // 20 puntos de margen adicional
    const empresaLines = doc.splitTextToSize(datosFinales.empresa, maxEmpresaWidth);
    
    // Calcular la posición Y inicial para centrar verticalmente todas las líneas
    const totalEmpresaHeight = empresaLines.length * 12; // 12 puntos por línea
    const empresaStartY = margin + 105 - (totalEmpresaHeight / 2) + 6; // Centrar y ajustar
    
    empresaLines.forEach((line, index) => {
      doc.text(line, pageW / 2, empresaStartY + (index * 12), { align: "center" });
    });
    
    // Ajustar la posición Y para la siguiente sección basándose en el número de líneas
    const empresaEndY = empresaStartY + (empresaLines.length * 12);

    // === 5) CUERPO DEL CONSENTIMIENTO ===
    doc.setFont("helvetica", "normal").setFontSize(11);
    const consentimiento = "De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consiente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA . Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen medico ocupacional al Medico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.";
    
    // Usar la posición final de la empresa + espaciado para el cuerpo del consentimiento
    const cuerpoY = empresaEndY + 15; // 15 puntos de separación después de la empresa
    doc.text(consentimiento, margin, cuerpoY, { maxWidth: pageW - 2 * margin, align: "justify" });

    // === 6) FOOTER CON FECHA, HORA Y FIRMAS ===
    const footerY = pageH - 80;
    
    // Calcular el ancho total del bloque (huella + espacio + firma)
    const huellaSize = 35;
    const espacioEntre = 40;
    const firmaWidth = 60;
    const anchoTotal = huellaSize + espacioEntre + firmaWidth;
    
    // Calcular la posición X para centrar el bloque completo
    const bloqueX = (pageW - anchoTotal) / 2;
    let horaTexto = datosFinales.hora; // ejemplo "14:25:08"
    let [hora] = horaTexto.split(':'); // solo la hora
    hora = parseInt(hora, 10);

    let sufijo = hora >= 12 ? 'PM' : 'AM';
    // Fecha y Hora (centradas con la misma separación que huella y firma, 15 puntos más arriba)
    const fechaHoraY = footerY - 30;
    doc.setFont("helvetica", "normal").setFontSize(12);
    doc.text(`Fecha: ${datosFinales.fecha}`, bloqueX, fechaHoraY);
    doc.text(`Hora: ${datosFinales.hora} ${sufijo}`, bloqueX + huellaSize + espacioEntre + 18, fechaHoraY);
    
    // Cuadro para huella (más grande)
    const huellaX = bloqueX;
    const huellaY = footerY - 15;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(huellaX, huellaY, huellaSize, huellaSize);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("Huella", huellaX + huellaSize / 2, huellaY + huellaSize + 5, { align: "center" });

    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones máximas permitidas dentro del cuadro de huella
      const maxImgW = huellaSize - 4; // margen interno de 2px por lado
      const maxImgH = huellaSize - 4;

      // Tamaño real de la imagen
      let imgW = s2.width;
      let imgH = s2.height;

      // Escalado proporcional para que quepa dentro del cuadro
      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // Posición centrada dentro del cuadro de huella
      const imgX = huellaX + (huellaSize - imgW) / 2;
      const imgY = huellaY + (huellaSize - imgH) / 2;

      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    }

    // Línea para firma (más cerca del cuadro de huella)
    const firmaX = huellaX + huellaSize + espacioEntre;
    const firmaY = footerY + 7;
    doc.setLineWidth(0.5);
    doc.line(firmaX, firmaY + 12, firmaX + firmaWidth, firmaY + 12);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("Firma", firmaX + firmaWidth / 2, firmaY + 20, { align: "center" });
    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');

      // Máximo ancho y alto permitidos para la firma (puedes ajustar)
      const maxImgW = 70;
      const maxImgH = 35;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1);

      imgW *= scale;
      imgH *= scale;

      // Centrar horizontalmente en la línea de firma
      const imgX = firmaX + (firmaWidth - imgW) / 2;

      // Ubicar justo encima de la línea (firmaY + 12) con un margen de 2px
      const imgY = (firmaY + 12) - imgH - 2;

      doc.addImage(firmaBase64, 'PNG', imgX, imgY, imgW, imgH);
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

  })

  
}
