import jsPDF from "jspdf";
import header_Acido_Urico_Digitalizado from "./Header/header_Acido_Urico_Digitalizado";
import footer from "../components/footer";
//ACIDO URICO
const config = {
  margin: 15,
  fontSize: {
    title: 14,
    subtitle: 11,
    header: 11,
    body: 10,
  },
  lineHeight: {
    normal: 7,
    small: 5,
  },
  font: 'helvetica',
};

const formatDateForFooter = (dateString) => {
    if (!dateString) return 'Trujillo';
    const date = new Date(`${dateString}T00:00:00`);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    return `Trujillo, ${dayName} ${formattedDate}`;
};


export default function AnalisisClinicosB_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 70;

  header_Acido_Urico_Digitalizado(doc, datos);

  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMADOCASIG");
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

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.title);
    doc.text("BIOQUÍMICA", pageW / 2, y, { align: "center" });
    y += config.lineHeight.normal * 1.5;

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.subtitle);
    doc.text(`MUESTRA :`, config.margin, y);
    doc.setFont(config.font, "normal");
    doc.text(datos.txtMuestra || "SUERO", config.margin + 20, y);
    y += config.lineHeight.normal * 1.5;

    const tableCols = {
      col1: config.margin,
      col2: pageW / 2,
      col3: pageW - config.margin,
    };

    doc.setFont(config.font, "bold").setFontSize(config.fontSize.header);
    doc.text("PRUEBA", tableCols.col1, y);
    doc.text("RESULTADO", tableCols.col2, y, { align: "center" });
    doc.text("VALORES NORMALES", tableCols.col3, y, { align: "right" });
    y += 3;
    doc.setLineWidth(0.4).line(config.margin, y, pageW - config.margin, y);
    y += config.lineHeight.normal;

    doc.setFont(config.font, "normal").setFontSize(config.fontSize.body);
    doc.text(datos.txtPrueba, tableCols.col1, y);
    doc.text(String(datos.txtResultado + ' mg/dL' || ''), tableCols.col2, y, { align: "center" });
    
    const valoresNormales = ["Mujeres : 2.5 - 6.8 mg/dl", "Hombres : 3.6 - 7.7 mg/dl"];
    let tempY = y;
    valoresNormales.forEach((line, index) => {
        doc.text(line, tableCols.col3, tempY, { align: "right" });
        if(index < valoresNormales.length - 1) {
            tempY += config.lineHeight.small;
        }
    });

    // Posiciona la fecha justo debajo de la sección "Valores Normales".
    const dateYPosition = tempY + config.lineHeight.normal * 2;
    const footerDate = String(datos.fecha);
    doc.setFontSize(10).setFont(config.font, 'normal');
    doc.text(footerDate, pageW - config.margin, dateYPosition, { align: 'right' });

    if (s1) {
      const canvas = document.createElement('canvas');
      canvas.width = s1.width;
      canvas.height = s1.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s1, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 35;
      const sigX = 80; // o cualquier X deseado
      const sigY = y + 70; // ⬅️ Aquí usas el Y actual + espacio deseado

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s1.width;
      let imgH = s1.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }

    if (s2) {
      const canvas = document.createElement('canvas');
      canvas.width = s2.width;
      canvas.height = s2.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(s2, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');

      // Dimensiones del área del sello
      const sigW = 70;
      const sigH = 35;
      const sigX = 130; // o cualquier X deseado
      const sigY = y + 70; // ⬅️ Aquí usas el Y actual + espacio deseado

      // Tamaño máximo dentro del área
      const maxImgW = sigW - 10;
      const maxImgH = sigH - 10;

      let imgW = s2.width;
      let imgH = s2.height;

      const scaleW = maxImgW / imgW;
      const scaleH = maxImgH / imgH;
      const scale = Math.min(scaleW, scaleH, 1); // para no escalar de más

      imgW *= scale;
      imgH *= scale;

      // Centramos dentro del rectángulo
      const imgX = sigX + (sigW - imgW) / 2;
      const imgY = sigY + (sigH - imgH) / 2;

      // Dibujar el borde si quieres

      // Insertar la imagen del sello
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);

      // Actualiza Y si después quieres seguir dibujando debajo
    }


    // El footer estándar con las firmas va al final de la página.
    footer(doc, datos);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

  })

  
} 