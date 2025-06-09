import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import headerConsentimiento from "./components/headerConsentimiento";
import footer from "./components/footer";

export default function Consentimiento_Panel5D_Digitalizado(datos) {
  const doc = new jsPDF();
  headerConsentimiento(doc, datos);

  const huella = datos.digitalizacion.find(d => d.nombreDigitalizacion === "HUELLA");
  const firma = datos.digitalizacion.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello = datos.digitalizacion.find(d => d.nombreDigitalizacion === "SELLOFIRMA");

  const loadImg = src =>
    new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => rej(`No se pudo cargar ${src}`);
    });
  Promise.all([
    huella && huella.url ? loadImg(huella.url) : Promise.resolve(null),
    firma && firma.url ? loadImg(firma.url) : Promise.resolve(null),
    sello && sello.url ? loadImg(sello.url) : Promise.resolve(null)
  ])
   .then(([huellap, firmap, sellop]) => {
   let y = 44; // Más espacio bajo el logo
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Título principal
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      "CONSENTIMIENTO INFORMADO PARA REALIZAR LA PRUEBA DE DROGAS PANEL 5D",
      pageW / 2,
      y,
      { align: "center" }
    );
    y += 6;
    doc.setFontSize(11);
    doc.text(
      "(COCAINA, MARIHUANA, ÉXTASIS, OPIÁCEOS Y BENZODIACEPINA)",
      pageW / 2,
      y,
      { align: "center" }
    );
    y += 11;

    // Bloque de datos personales y consentimiento en un solo string
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const bloque =
      `Yo ${datos.nombres || '_________________________'} , de ${datos.edad || '___'} años de edad, identificado con DNI nº ${datos.dni || '__________'}; habiendo recibido consejería e información acerca de la prueba para el panel de 5 drogas en orina; y en pleno uso de mis facultades mentales AUTORIZO se me tome la muestra para el dosaje de dichas sustancias, así mismo me comprometo a regresar para recibir la consejería Post-Test y mis resultados.`;
    const lines = doc.splitTextToSize(bloque, pageW - 2 * margin - 4);
    const altoLinea = 7;
    const altoCaja = lines.length * altoLinea + 6;
    doc.text(lines, margin + 3, y, { maxWidth: pageW - 2 * margin - 6, lineHeightFactor: 1.5 });
    y += altoCaja + 2;

    // Declaración adicional
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text("Además, declaro que la información que brindaré a continuación es verdadera:", margin, y);
    y += 8;

    // Tabla de antecedentes (según la segunda imagen)
    autoTable(doc, {
      startY: y,
      body: [
        ['CONSUME MARIHUANA', `NO ( ${!datos.antConsumeMarih ? "X" : " "})`, `SI ( ${datos.antConsumeMarih ? "X" : " " })`],
        ['CONSUME COCAINA', `NO ( ${!datos.antConsumeCocacina ? "X" : " "})`, `SI ( ${datos.antConsumeCocacina ? "X" : " " })`],
        ['CONSUME HOJA DE COCA EN LOS 14 DIAS PREVIOS', `NO ( ${!datos.antConsumeHojaCoca ? "X" : " "})`, `SI ( ${datos.antConsumeHojaCoca ? "X" : " " })   ${datos.antConsumeHojaCoca ? `Fecha:  ${datos.fechaConsumoHojaCoca}` : ""}`],
        ['CONSUME DE ÉXTASIS', `NO ( ${!datos.antConsumeAnfetaminaOExtasis ? "X" : " "})`, `SI ( ${datos.antConsumeAnfetaminaOExtasis ? "X" : " " })`],
        ['CONSUME DE OPIÁCEOS', `NO ( ${!datos.antConsumeOpiaceos ? "X" : " "})`, `SI ( ${datos.antConsumeOpiaceos ? "X" : " " })`],
        ['CONSUME DE BENZODIACEPINAS', `NO ( ${!datos.antConsumeBenzodiacepinas ? "X" : " "})`, `SI ( ${datos.antConsumeBenzodiacepinas ? "X" : " " })`],
      ],
      theme: 'plain',
      styles: { fontSize: 9, textColor: [0, 0, 0], cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 }
      },
      margin: { left: margin, right: margin }
    });
    y = doc.lastAutoTable.finalY + 5;

    // Fecha
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${datos.fecha || ''}`, pageW / 2, y, { align: "center" });
    y += 12;

    // Firma y huella - centrado
    const firmasY = y;
    const blockWidth = 170;
    const blockX = (pageW - blockWidth) / 2;

    // Cuadro de huella digital a la izquierda
    doc.setDrawColor(0);
    doc.rect(blockX, firmasY, 40, 40);
    doc.setFontSize(11);
    doc.text("Huella", blockX + 20, firmasY + 45, { align: "center" });
    if (huellap) {
      const boxW = 40;
      const boxH = 40;
      const imgRatio = huellap.width / huellap.height;
      let imgW = boxW;
      let imgH = boxW / imgRatio;

      if (imgH > boxH) {
        imgH = boxH;
        imgW = boxH * imgRatio;
      }
      const imgX = blockX + (boxW - imgW) / 2;
      const imgY = firmasY + (boxH - imgH) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = huellap.width;
      canvas.height = huellap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(huellap, 0, 0);
      const huellaBase64 = canvas.toDataURL('image/png');
      doc.addImage(huellaBase64, 'PNG', imgX, imgY, imgW, imgH);
    }
    // Firmas centradas
    const firma1X = blockX + 60;
    const firma2X = blockX + 111;
    const firmaLineWidth = 40;
    const firmaY = firmasY + 25;
    // Línea de firma del paciente
    doc.line(firma1X, firmaY, firma1X + firmaLineWidth, firmaY);
    doc.text("Firma del Paciente", firma1X + firmaLineWidth / 2, firmaY + 7, { align: "center" });
    if (firmap) {
      const firmaW = 40;
      const firmaH = (firmap.height / firmap.width) * firmaW;
      const firmaX = firma1X + (firmaLineWidth - firmaW) / 2;
      const firmaImgY = firmaY - firmaH - 1;

      const canvas = document.createElement('canvas');
      canvas.width = firmap.width;
      canvas.height = firmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(firmap, 0, 0);
      const firmaBase64 = canvas.toDataURL('image/png');
      doc.addImage(firmaBase64, 'PNG', firmaX, firmaImgY, firmaW, firmaH);
    }
    // Línea de firma y sello del consejero
    doc.line(firma2X, firmaY, firma2X + firmaLineWidth, firmaY);
    doc.text("Firma y sello del Consejero", firma2X + firmaLineWidth / 2, firmaY + 7, { align: "center" });
    if (sellop) {
      const selloW = 35;
      const selloH = (sellop.height / sellop.width) * selloW;
      const selloX = firma2X + (firmaLineWidth - selloW) / 2;
      const selloY = lineaY - selloH - 1;

      const canvas = document.createElement('canvas');
      canvas.width = sellop.width;
      canvas.height = sellop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(sellop, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      doc.addImage(selloBase64, 'PNG', selloX, selloY, selloW, selloH);
    }
    // Footer
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