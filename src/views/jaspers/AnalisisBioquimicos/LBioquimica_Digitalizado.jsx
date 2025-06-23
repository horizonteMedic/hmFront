import jsPDF from "jspdf";
import footer from "../components/footer";
import header_Perfil_Renal_Digitalizado from "./Header/header_Perfil_Renal_Digitalizado";

export default function LBioquimica_Digitalizado(datos) {
  const doc = new jsPDF();
  
  header_Perfil_Renal_Digitalizado(doc, datos);

  const config = {
    startY: 83,
    h1Size: 14,
    h2Size: 11,
    bodySize: 10,
    xMargin: 15,
    pageWidth: doc.internal.pageSize.getWidth(),
    table: {
      x: 15,
      y: 0, 
      col1X: 20,
      col2X: 85,
      col3X: 120,
      col3Width: 70, 
    }
  };
  
  let y = config.startY;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(config.h1Size);
  doc.text('BIOQUÍMICA', config.pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(config.h2Size);
  doc.text('MUESTRA : SUERO', config.xMargin, y);
  y += 10;
  
  config.table.y = y;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(config.bodySize);
  doc.text('PRUEBA', config.table.col1X, config.table.y);
  doc.text('RESULTADO', config.table.col2X, config.table.y);
  doc.text('VALORES NORMALES', config.table.col3X, config.table.y);
  y += 2;
  doc.line(config.xMargin, y, config.pageWidth - config.xMargin, y);
  y += 5;

  const drawRow = (prueba, resultado, normales, isHeader = false) => {
    const rowY = y;
    const lineHeight = doc.getTextDimensions('A').h;

    if (isHeader) {
      doc.setFont(undefined, 'bold');
      doc.text(prueba, config.pageWidth / 2, rowY, { align: 'center' });
      y += 8;
      return;
    }

    doc.setFont(undefined, 'normal');
    doc.setFontSize(config.bodySize);
    
    const pruebaLines = doc.splitTextToSize(prueba, config.table.col2X - config.table.col1X - 5);
    doc.text(pruebaLines, config.table.col1X, rowY);
    
    doc.text(resultado, config.table.col2X, rowY);
    
    const normalesLines = doc.splitTextToSize(normales, config.table.col3Width);
    doc.text(normalesLines, config.table.col3X, rowY);
    
    const maxLines = Math.max(
        (Array.isArray(pruebaLines) ? pruebaLines.length : 1),
        (Array.isArray(normalesLines) ? normalesLines.length : 1)
    );
    
    y += maxLines * lineHeight + 4;
  }
  
  drawRow('PERFIL RENAL', '', '', true);

  const dataRows = [
    {
      prueba: 'CREATININA SÉRICA',
      resultado: datos.txtCreatinina + ' mg/dL' || '',
      normales: 'Adulto: 0.8 - 1.4 mg/dl\nNiño: 0.24 - 0.84 mg/dl'
    },
    {
      prueba: 'UREA SÉRICA',
      resultado: datos.txtUreaSerica + ' mg/dL' || '',
      normales: '10 - 50 mg/dl'
    },
    {
      prueba: 'ÁCIDO ÚRICO SÉRICO',
      resultado: datos.txtAcidoUrico + ' mg/dL' || '',
      normales: 'Mujeres: 2.5 - 6.8 mg/dl\nHombres 3.6 - 7.7 mg/dl'
    }
  ];

  dataRows.forEach(row => {
    drawRow(row.prueba, row.resultado, row.normales);
  });

  footer(doc, datos, y);
  
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
} 