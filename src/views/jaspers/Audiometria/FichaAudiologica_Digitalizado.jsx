import React from 'react';
import jsPDF from 'jspdf';
import headerFicha from './headers/header_FichaAudiologica_Digitalizado.jsx';

/**
 * Dibuja la tabla de Uso de Protectores Auditivos y Apreciación del Ruido
 * @param {jsPDF} doc
 * @param {number} y - posición vertical inicial
 * @param {number} margin - margen izquierdo
 */
export function drawProtectoresYRuido(doc, y, margin = 12) {
  const pageW = doc.internal.pageSize.getWidth();
  const tableW = pageW - 2 * margin;
  // Calcular anchos proporcionales según el texto
  doc.setFont('helvetica', 'bold').setFontSize(9);
  const txt1 = 'Uso de Protectores Auditivos';
  const txt2 = 'Apreciación del Ruido';
  doc.setFont('helvetica', 'normal').setFontSize(9);
  const txtProtectores = 'Tapones ( X )   Orejeras (   )';
  const txtRuido = 'Ruido muy Intenso (   )   Ruido moderado ( X )   Ruido no molesto (   )';

  // Medidas de texto
  const w1 = doc.getTextWidth(txt1) + 6;
  const w2 = doc.getTextWidth(txtProtectores) + 6;
  const w3 = doc.getTextWidth(txt2) + 6;
  const w4 = doc.getTextWidth(txtRuido) + 6;
  let totalW = w1 + w2 + w3 + w4;
  // Si la suma es mayor al ancho disponible, escalamos proporcionalmente
  let scale = 1;
  if (totalW > tableW) {
    scale = tableW / totalW;
  }
  const colW = [w1 * scale, w2 * scale, w3 * scale, w4 * scale];
  const rowH = 10;
  let x = margin;

  // Contorno principal
  doc.rect(margin, y, tableW, rowH);

  // Líneas verticales
  let accX = margin;
  for (let i = 0; i < 3; i++) {
    accX += colW[i];
    doc.line(accX, y, accX, y + rowH);
  }

  // Títulos y opciones
  let cx = margin;
  doc.setFont('helvetica', 'bold').setFontSize(9);
  doc.text(txt1, cx + 2, y + rowH / 2 + 2, { baseline: 'middle' });
  cx += colW[0];
  doc.setFont('helvetica', 'normal').setFontSize(9);
  doc.text(txtProtectores, cx + 2, y + rowH / 2 + 2, { baseline: 'middle' });
  cx += colW[1];
  doc.setFont('helvetica', 'bold').setFontSize(9);
  doc.text(txt2, cx + 2, y + rowH / 2 + 2, { baseline: 'middle' });
  cx += colW[2];
  doc.setFont('helvetica', 'normal').setFontSize(9);
  doc.text(txtRuido, cx + 2, y + rowH / 2 + 2, { baseline: 'middle' });

  // Devuelve la nueva posición Y para continuar
  return y + rowH + 2;
}

/**
 * Genera y muestra el PDF de la FICHA AUDIOLOGICA con header y tabla de protectores auditivos/ruido.
 * @param {object} datos - datos opcionales para el header
 */
export function generarPDF(datos = {}) {
  const doc = new jsPDF();
  const margin = 12;
  let y = 12;

  // 1) Header
  headerFicha(doc, datos);

  // 2) Espacio después del header (más separación visual)
  y = 100; // antes: 80

  // 3) Tabla de protectores auditivos y apreciación del ruido
  y = drawProtectoresYRuido(doc, y, margin);

  // 4) Mostrar PDF en iframe oculto para impresión rápida
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}

const FichaAudiologicaDigitalizadoButton = () => {
  const handleClick = () => {
    generarPDF();
  };
  return (
    <button onClick={handleClick} style={{padding: '8px 16px', fontSize: '16px', margin: '20px'}}>Generar PDF Ficha Audiológica</button>
  );
};

export default FichaAudiologicaDigitalizadoButton;

