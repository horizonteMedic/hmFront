// Estados del odontograma que no tienen un ícono PNG (public/img/iconos_odonto): se dibujan con trazos sobre el
// diente, dentro del mismo marco (cuadrado con diagonales y cuadrado interior) que traen los PNG. Los demás
// estados usan su Icon_<nombre>.png (ver mapeoTiposIconos en el reporte).

const ROJO = [220, 38, 38];
const AZUL = [37, 99, 235];
const NEGRO = [0, 0, 0];

const DIBUJOS = {
  Fractura: (doc, { x, y, w, h }) => {
    doc.setDrawColor(...ROJO);
    doc.setLineWidth(0.9);
    doc.line(x, y + h, x + w, y);
  },
  Corona: (doc, { cx, cy, w, h }) => {
    const radio = Math.min(w, h) * 0.32;
    doc.setDrawColor(...AZUL);
    doc.setTextColor(...AZUL);
    doc.setLineWidth(0.5);
    doc.circle(cx, cy, radio, "S");
    doc.setFont("helvetica", "bold").setFontSize(radio * 3.4);
    doc.text("C", cx, cy + radio * 0.42, { align: "center" });
    doc.setFont("helvetica", "normal");
  },
  PPR: (doc, { x, cy, w, h }) => {
    doc.setDrawColor(...AZUL);
    doc.setLineWidth(0.8);
    doc.line(x + w * 0.15, cy - h * 0.08, x + w * 0.85, cy - h * 0.08);
    doc.line(x + w * 0.15, cy + h * 0.08, x + w * 0.85, cy + h * 0.08);
  },
  Implante: (doc, { cx, cy, w, h }) => {
    doc.setDrawColor(...NEGRO);
    doc.setLineWidth(0.5);
    doc.line(cx, cy - h * 0.3, cx, cy + h * 0.3);
    doc.line(cx - w * 0.3, cy + h * 0.3, cx + w * 0.3, cy + h * 0.3);
  },
  "Resina Roja": (doc, forma) => cuadrado(doc, forma, ROJO),
  "Resina Azul": (doc, forma) => cuadrado(doc, forma, AZUL),
  "Amalgama Roja": (doc, forma) => rombo(doc, forma, ROJO),
  "Amalgama Azul": (doc, forma) => rombo(doc, forma, AZUL),
  "Remanente Radicular": (doc, { cx, cy, h }) => {
    doc.setTextColor(...NEGRO);
    doc.setFont("helvetica", "bold").setFontSize(h * 1.1);
    doc.text("RR", cx, cy + h * 0.15, { align: "center" });
    doc.setFont("helvetica", "normal");
  },
};

function cuadrado(doc, { cx, cy, w, h }, color) {
  const lado = Math.min(w, h) * 0.55;
  doc.setFillColor(...color);
  doc.rect(cx - lado / 2, cy - lado / 2, lado, lado, "F");
}

function rombo(doc, { cx, cy, w, h }, color) {
  const rx = w * 0.32;
  const ry = h * 0.32;
  doc.setFillColor(...color);
  doc.triangle(cx - rx, cy, cx, cy - ry, cx + rx, cy, "F");
  doc.triangle(cx - rx, cy, cx, cy + ry, cx + rx, cy, "F");
}

// Marco del diente (igual al de los PNG): cuadrado con sus diagonales y un cuadrado interior.
function marco(doc, { x, y, w, h, cx, cy }) {
  doc.setDrawColor(...NEGRO);
  doc.setLineWidth(0.25);
  doc.rect(x, y, w, h);
  doc.line(x, y, x + w, y + h);
  doc.line(x + w, y, x, y + h);
  doc.rect(cx - w * 0.18, cy - h * 0.18, w * 0.36, h * 0.36);
}

export const tieneDibujoVectorial = (tipo) => tipo in DIBUJOS;

// Dibuja el estado en el recuadro (x, y, w, h) del diente y deja el color de trazo/relleno/texto como estaba.
export const dibujarEstadoVectorial = (doc, tipo, x, y, w, h) => {
  const dibujo = DIBUJOS[tipo];
  if (!dibujo) return;
  const forma = { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  marco(doc, forma);
  dibujo(doc, forma);
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(255, 255, 255);
  doc.setTextColor(0, 0, 0);
  doc.setLineWidth(0.2);
};
