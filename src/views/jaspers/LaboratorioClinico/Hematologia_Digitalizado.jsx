import jsPDF from "jspdf";
import header_Hematologia from "./header/header_Hematologia_Digitalizado";
import footer from "../components/footer";

export default function Hematologia_Digitalizado(datos = {}) {

        // Datos de ejemplo, reemplazar por datos reales en integración
        
        const doc = new jsPDF();
        header_Hematologia(doc, datos);
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

        // Márgenes y estilos
        const margin = 15;
        let y = 85; // Más abajo
        const lineHeight = 7;
        const lineHeightSmall = 5.5;
        const col1 = margin;
        const col2 = margin + 75;
        const col3 = margin + 120;
        const indent = 8;

        // Título principal
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMOGRAMA AUTOMATIZADO", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += lineHeight + 4;

        // Encabezados
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("PRUEBA", col1, y);
        doc.text("RESULTADO", col2, y);
        doc.text("VALORES NORMALES", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 1 ---
        doc.setFont('helvetica', 'bold');
        doc.text("HEMOGLOBINA", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHemoglobina}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("Mujeres 12 - 16 g/dL", col3, y);
        y += lineHeightSmall;
        doc.text("Hombres 14 - 18 g/dL", col3, y);
        y += lineHeight + 2;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMATOCRITO", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHematocrito}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("Mujeres 38 - 50 %", col3, y);
        y += lineHeightSmall;
        doc.text("Hombres 40 - 54 %", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 2 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("HEMATÍES", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtHematies}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("4.0 - 5.5 x 10^6/mm³", col3, y);
        y += lineHeight + 1;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Volumen Corpuscular Medio", col1 + indent, y);
        doc.text(`${datos.txtVolumen}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("80 - 100 fL", col3, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text("Hemoglobina Corpuscular Media", col1 + indent, y);
        doc.text(`${datos.txtHemocorpuscular}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("26 - 34 pg", col3, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text("Concentración de la Hemoglobina", col1 + indent, y);
        y += lineHeightSmall;
        doc.text("Corpuscular Media", col1 + indent, y);
        doc.text(`${datos.txtConcentracion}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("31 - 37 g/dl", col3, y - lineHeightSmall);
        y += lineHeight + 2;

        // --- BLOQUE 3 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("LEUCOCITOS", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtLeucocitos}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("4 - 10 x 10^3/mm³", col3, y);
        y += lineHeight + 2;

        // --- BLOQUE 4 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("RECUENTO DIFERENCIAL", col1, y);
        y += lineHeight;
        // Subgrupos
        const subgrupos = [
            { label: "NEUTRÓFILOS (%)", key: "txtNeutrofilos", normal: "55 - 65 %" },
            { label: "ABASTONADOS (%)", key: "txtAbastonados", normal: "0 - 5 %" },
            { label: "SEGMENTADOS (%)", key: "txtSegmentados", normal: "55 - 65 %" },
            { label: "MONOCITOS (%)", key: "txtMonocitos", normal: "4 - 8 %" },
            { label: "EOSINÓFILOS (%)", key: "txtEosinofios", normal: "0 - 4 %" },
            { label: "BASÓFILOS (%)", key: "txtBasofilos", normal: "0 - 1 %" },
            { label: "LINFOCITOS (%)", key: "txtLinfocitos", normal: "20 - 40 %" },
        ];
        subgrupos.forEach(({ label, normal, key }) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, col1 + indent, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            // Muestra el valor desde datos, si no existe muestra "-"
            const value = datos[key] ?? "-";
            doc.text(String(value), col2, y);  // Valor actual
            doc.text(normal, col3, y);         // Rango normal

            doc.setFontSize(10);
            y += lineHeight;
            });
        y += 2;

        // --- BLOQUE 5 ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("PLAQUETAS", col1, y); doc.setFont('helvetica', 'normal');
        doc.text(`${datos.txtPlaquetas}`, col2, y); doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text("1.5 - 4.5 x 10^5/mm³", col3, y);
        y += lineHeight;

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
      const sigY = 235; // ⬅️ Aquí usas el Y actual + espacio deseado

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
      const sigY = 190; // ⬅️ Aquí usas el Y actual + espacio deseado

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
    footer(doc, datos);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        };
    })
        
}
