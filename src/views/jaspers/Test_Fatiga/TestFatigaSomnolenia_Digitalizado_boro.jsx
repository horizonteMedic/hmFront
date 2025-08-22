import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header_TestFAtiga from "./Header_TestFatiga";

export default function TestFatigaSomnolenia_Digitalizado_boro(datos = {}) {

  function drawXInBox(doc, x, y, width, height, color = [0, 0, 255], scale = 3) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    doc.setTextColor(...color);   // Color (por defecto azul)
    doc.setFontSize(Math.min(width, height) * scale); // Tamaño proporcional al cuadro
    doc.text("X", centerX, centerY, { align: "center", baseline: "middle" });

    // Resetear color a negro para no afectar el resto
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8)
  }

  function drawX(docInst, x, y, boxSize) {
    docInst.setTextColor(0, 0, 255); // Azul
    docInst.setFontSize(10);
    docInst.text("X", x + boxSize / 2, y + boxSize / 2 + 1.5, { align: "center" });
    doc.setTextColor(0, 0, 0);
    docInst.setFontSize(9)
  }

  function drawCircle(doc, x, y) {
    doc.setDrawColor(0);     // Color negro para el borde
    doc.setLineWidth(0.5);   // Grosor del borde
    doc.circle(x, y, 1.3, "S"); // "S" = solo borde (stroke)
  }

  function drawXInCircle(doc, cx, cy, r) {
    const offset = r * 0.8; // tamaño de la X en función del radio
    doc.setDrawColor(0, 0, 255); // azul para la X
    doc.setLineWidth(0.5);

    // Línea diagonal \
    doc.line(cx - offset, cy - offset, cx + offset, cy + offset);

    // Línea diagonal /
    doc.line(cx - offset, cy + offset, cx + offset, cy - offset);
    doc.setDrawColor(0, 0, 0);
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 5;
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  // 2) Encabezado (logo, campos, título)

  // 2) Encabezado (logo, campos, título)
  const sello1 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "SELLOFIRMA");
  const sello2 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "FIRMAP");
  const sello3 = datos.digitalizacion?.find(d => d.nombreDigitalizacion === "HUELLA");
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
    isValidUrl(sello3?.url) ? loadImg(sello3.url) : Promise.resolve(null),
  ]).then(([s1,s2,s3]) => {
    // 2) Encabezado (logo, campos, título)
    header_TestFAtiga(doc, datos);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("TEST DE FATIGA Y SOMNOLENCIA",pageW / 2, y, { align: "center" })

  

      


      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow.print();

    })

    
}