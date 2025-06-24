import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "../components/header";
import footer from "../components/footer";
import Header_HematologiaBioquimica from "./Header/Header_HematologiaBioquimica ";

export default function Hematologia_Digitalizado(datos) {
  const doc = new jsPDF();
  header(doc, datos);
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

    let y = 58;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('HEMOGRAMA AUTOMATIZADO', 105, y, { align: 'center' });
  doc.setFontSize(11);

  y += 6;
  autoTable(doc, {
    startY: y,
    head: [[
      { content: 'PRUEBA', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'RESULTADO', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'VALORES NORMALES', styles: { halign: 'center', fontStyle: 'bold' } }
    ]],
    body: [
      [
        { content: 'HEMOGLOBINA', styles: { fontStyle: 'bold' } },
        datos.txtHemoglobina || '',
        'Mujeres 12 - 16 g/dL\nHombres 14 - 18 g/dL'
      ],
      [
        { content: 'HEMATOCRITO', styles: { fontStyle: 'bold' } },
        datos.txtHematocrito || '',
        'Mujeres 38 - 50 %\nHombres 40 - 54 %'
      ],
      [
        { content: 'HEMATÍES', styles: { fontStyle: 'bold' } },
        datos.txtHematies || '',
        '4.0 - 5.5 x 10^6/mm³'
      ],
      ['Volumen Corpuscular Medio', datos.txtVolumen || '', '80 - 100 fL'],
      ['Hemoglobina Corpuscular Media', datos.txtHemocorpuscular || '', '26 - 34 pg'],
      ['Concentración de la Hemoglobina Corpuscular Media', datos.txtConcentracion || '', '31 - 37  g/dl'],
      [
        { content: 'LEUCOCITOS', styles: { fontStyle: 'bold' } },
        datos.txtLeucocitos || '',
        '4 - 10 x 10^3/mm³'
      ],
      [
        { content: 'RECUENTO DIFERENCIAL', styles: { fontStyle: 'bold' } },
        '',
        ''
      ],
      [
        { content: 'NEUTRÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtNeutrofilos || '',
        '55-65 %'
      ],
      [
        { content: 'ABASTONADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtAbastonados || '',
        '0 - 5 %'
      ],
      [
        { content: 'SEGMENTADOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtSegmentados || '',
        '55 - 65 %'
      ],
      [
        { content: 'MONOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtMonocitos || '',
        '4 - 8 %'
      ],
      [
        { content: 'EOSINÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtEosinofios || '',
        '0 - 4 %'
      ],
      [
        { content: 'BASÓFILOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtBasofilos || '',
        '0 - 1 %'
      ],
      [
        { content: 'LINFOCITOS (%)', styles: { fontStyle: 'bold' } },
        datos.txtLinfocitos || '',
        '20 - 40 %'
      ],
      [
        { content: 'PLAQUETAS', styles: { fontStyle: 'bold' } },
        datos.txtPlaquetas || '',
        '1.5 - 4.5 x 10^5/mm³'
      ],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 35 },
      2: { cellWidth: 60 }
    },
    margin: { left: 15, right: 15 },
    tableWidth: 180,
    didDrawPage: () => {}
  });
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
        const sigY = 210; // ⬅️ Aquí usas el Y actual + espacio deseado

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
        const sigY = 210; // ⬅️ Aquí usas el Y actual + espacio deseado

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

  // Mostrar PDF
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