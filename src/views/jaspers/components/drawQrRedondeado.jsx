import qrcode from "qrcode-generator";

/**
 * Dibuja en el PDF un QR de estilo redondeado (marco, ojos y módulos con esquinas
 * redondeadas) con el logo de la empresa en el centro.
 * Se dibuja con vectores, así que queda nítido al imprimir.
 *
 * Uso:  drawQrRedondeado(doc, "1065952", 178, 11, 17);
 *
 * @param {jsPDF} doc
 * @param {string} texto  contenido del QR
 * @param {number} x      esquina izquierda del marco (mm)
 * @param {number} y      esquina superior del marco (mm)
 * @param {number} size   lado del marco (mm)
 * @param {object} [opts] opcionales:
 *   logo       ruta del logo central (png)            — "/img/logo-emblema.png"
 *   logoRatio  ancho/alto del logo                    — 360/232
 *   logoFrac   ancho del logo respecto al marco       — 0.30 (más de ~0.35 puede impedir la lectura en tamaños chicos)
 *   pad        aire entre el marco y el QR (mm)       — 1.0
 *   frame      dibuja el marco redondeado             — true
 *   frameWidth grosor del marco (mm)                  — 0.3
 */
const drawQrRedondeado = (doc, texto, x, y, size, opts = {}) => {
  const { logo = "/img/logo-emblema.png", logoRatio = 360 / 232, pad = 1.0, frame = true, frameWidth = 0.3, logoFrac = 0.30 } = opts;
  if (!texto) return;

  // Corrección de errores alta (H) para que el logo central no impida la lectura
  const qr = qrcode(0, "H");
  qr.addData(String(texto));
  qr.make();
  const n = qr.getModuleCount();

  const m = (size - pad * 2) / n;        // lado de cada módulo
  const qx = x + pad;
  const qy = y + pad;

  // Zona central reservada al logo
  const logoW = size * logoFrac;
  const logoH = logoW / logoRatio + m;
  const logoX = x + (size - logoW) / 2;
  const logoY = y + (size - logoH) / 2;
  const bajoLogo = (r, c) => {
    const mx = qx + c * m;
    const my = qy + r * m;
    return mx + m > logoX - m * 0.3 && mx < logoX + logoW + m * 0.3 &&
      my + m > logoY - m * 0.3 && my < logoY + logoH + m * 0.3;
  };

  // Ojos de posición (7x7 módulos): se dibujan aparte como cuadrados redondeados
  const enOjo = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

  doc.setFillColor(0, 0, 0);
  const rm = m * 0.9;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (enOjo(r, c) || !qr.isDark(r, c) || bajoLogo(r, c)) continue;
      const off = (m - rm) / 2;
      doc.roundedRect(qx + c * m + off, qy + r * m + off, rm, rm, rm * 0.35, rm * 0.35, "F");
    }
  }

  const ojo = (r0, c0) => {
    const ox = qx + c0 * m;
    const oy = qy + r0 * m;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(ox, oy, 7 * m, 7 * m, 2.1 * m, 2.1 * m, "F");
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(ox + m, oy + m, 5 * m, 5 * m, 1.5 * m, 1.5 * m, "F");
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(ox + 2 * m, oy + 2 * m, 3 * m, 3 * m, 1 * m, 1 * m, "F");
  };
  ojo(0, 0);
  ojo(0, n - 7);
  ojo(n - 7, 0);

  // Marco exterior redondeado (igual al cuadro que se usaba antes)
  if (frame) {
    doc.setDrawColor(0);
    doc.setLineWidth(frameWidth);
    doc.roundedRect(x, y, size, size, 2.5, 2.5, "S");
  }

  // Logo al centro sobre fondo blanco redondeado
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoX, logoY, logoW, logoH, 0.9, 0.9, "F");
  try {
    const iw = logoW - m * 0.8;
    const ih = iw / logoRatio;
    doc.addImage(logo, "PNG", logoX + (logoW - iw) / 2, logoY + (logoH - ih) / 2, iw, ih);
  } catch (e) {
    console.error("Error cargando logo del QR", e);
  }

  // Restablece colores para no afectar lo que se dibuja después
  doc.setFillColor(0, 0, 0);
  doc.setDrawColor(0);
};

export default drawQrRedondeado;
