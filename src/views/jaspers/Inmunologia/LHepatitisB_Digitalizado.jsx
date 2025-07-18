import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "../components/header";
import footer from "../components/footer";
import headerHepatitisDigitalizado from "./Header/header_Hepatitis_Digitalizado";

export default function LHepatitisB_Digitalizado(datos) {
  const doc = new jsPDF();
  
  headerHepatitisDigitalizado(doc, datos)
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

    let y = 90;

  // Título principal
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text('INMUNOLOGÍA', 105, y, { align: 'center' });
  doc.setFontSize(11);

  // Muestra y método
  y += 8;
  autoTable(doc, {
    startY: y,
    body: [
      [{ content: 'MUESTRA : SUERO', styles: { fontStyle: 'bold' } }],
      [{ content: 'MÉTODO : INMUNOENSAYO CROMATOGRÁFICO', styles: { fontStyle: 'bold' } }]
    ],
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 1 },
    margin: { left: 15, right: 15 },
    tableWidth: 180
  });

  // Tabla de resultado
  let yTable = doc.lastAutoTable.finalY + 8;
  // Encabezados
  doc.setFont('helvetica', 'bold');
  doc.text('PRUEBA CUALITATIVO', 15, yTable);
  doc.text('RESULTADO', 105 + 40, yTable, { align: 'left' });
  yTable += 3;
  doc.setLineWidth(0.3);
  doc.line(15, yTable, doc.internal.pageSize.getWidth() - 15, yTable);
  doc.setLineWidth(0.2);
  yTable += 8;
  // Fila de datos
  doc.setFont('helvetica', 'normal');
  doc.text(`HEPATITIS B (HBsAg) - ${datos.txtMarca || ''}`, 15, yTable);
  doc.text(datos.txtHepatitisb || '', 105 + 40, yTable, { align: 'left' });

  // Recuadros de imagen
  const imgW = 60, imgH = 25;
  const marginInterno = 10;
  if (s1 && s2) {
    // Dos firmas, una a la izquierda y otra a la derecha
    const addSello = (img, left) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const selloBase64 = canvas.toDataURL('image/png');
      const imgX = left ? marginInterno : doc.internal.pageSize.getWidth() - marginInterno - imgW;
      const imgY = 210;
      doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
    };
    addSello(s1, true);
    addSello(s2, false);
  } else if (s1) {
    // Solo una firma, centrada
    const canvas = document.createElement('canvas');
    canvas.width = s1.width;
    canvas.height = s1.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(s1, 0, 0);
    const selloBase64 = canvas.toDataURL('image/png');
    const imgX = (doc.internal.pageSize.getWidth() - imgW) / 2;
    const imgY = 210;
    doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
  } else if (s2) {
    // Solo la segunda firma, centrada
    const canvas = document.createElement('canvas');
    canvas.width = s2.width;
    canvas.height = s2.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(s2, 0, 0);
    const selloBase64 = canvas.toDataURL('image/png');
    const imgX = (doc.internal.pageSize.getWidth() - imgW) / 2;
    const imgY = 210;
    doc.addImage(selloBase64, 'PNG', imgX, imgY, imgW, imgH);
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