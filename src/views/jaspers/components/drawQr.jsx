import qrcode from "qrcode-generator";

/**
 * Dibuja en el PDF un QR estándar (módulos cuadrados, negro sobre blanco, sin logo ni
 * adornos) pensado para que lo lea cualquier escáner, incluso pistolas láser baratas.
 * Se dibuja con vectores, así que queda nítido al imprimir.
 *
 * IMPORTANTE: el QR necesita una "zona de silencio" en blanco a su alrededor
 * (idealmente 4 módulos, mínimo 2). No dibujes líneas ni textos pegados a él.
 * Con 21 módulos (QR de 7 dígitos), size = 16 mm → 0.76 mm por módulo = 9 puntos a 300 dpi.
 *
 * Uso:  drawQr(doc, "1065952", 179, 12, 16);
 *
 * @param {jsPDF} doc
 * @param {string} texto  contenido del QR
 * @param {number} x      esquina izquierda del QR, sin contar la zona de silencio (mm)
 * @param {number} y      esquina superior del QR, sin contar la zona de silencio (mm)
 * @param {number} size   lado del QR (mm)
 * @param {object} [opts] opcionales:
 *   ecc    nivel de corrección de errores L|M|Q|H — "Q". Con textos cortos (N° de orden)
 *          no agranda el QR, solo lo hace más tolerante a manchas o impresión pobre.
 */
const drawQr = (doc, texto, x, y, size, opts = {}) => {
  const { ecc = "Q" } = opts;
  if (!texto) return;

  const dato = String(texto);
  const qr = qrcode(0, ecc);
  // Modo numérico (si aplica) usa menos módulos → cada módulo sale más grande
  qr.addData(dato, /^\d+$/.test(dato) ? "Numeric" : "Byte");
  qr.make();
  const n = qr.getModuleCount();
  const m = size / n; // lado de cada módulo

  // Los visores suavizan los bordes y dejan rayas blancas entre rectángulos pegados;
  // se solapan 0.04 mm (media gota de impresión a 300 dpi) para taparlas
  const solape = 0.04;
  doc.setFillColor(0, 0, 0);
  for (let r = 0; r < n; r++) {
    // Une los módulos oscuros contiguos de la fila en un solo rectángulo
    let c = 0;
    while (c < n) {
      if (!qr.isDark(r, c)) {
        c++;
        continue;
      }
      const inicio = c;
      while (c < n && qr.isDark(r, c)) c++;
      doc.rect(x + inicio * m, y + r * m, (c - inicio) * m + solape, m + solape, "F");
    }
  }

  // Restablece colores para no afectar lo que se dibuja después
  doc.setFillColor(0, 0, 0);
  doc.setDrawColor(0);
};

export default drawQr;
