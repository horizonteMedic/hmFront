import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import header from "./components/header";
import footer from "./components/footer";

export default function parasitologia(datos) {
  const doc = new jsPDF();
  header(doc, datos);

  // Offset para bajar el contenido después del header
  let y = 60;

  // Título PARASITOLOGIA
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("PARASITOLOGÍA", 105, y, { align: "center" });
  y += 15;

  // Función para renderizar cada muestra
  function renderMuestra(n, muestra, y) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${n} MUESTRA`, 20, y);
    doc.setFontSize(11);
    doc.text("COLOR", 30, y + 8);
    doc.setFont(undefined, 'normal');
    doc.text(`${muestra.color || ''}`, 60, y + 8);
    doc.setFont(undefined, 'bold');
    doc.text("ASPECTO", 30, y + 16);
    doc.setFont(undefined, 'normal');
    doc.text(`${muestra.aspecto || ''}`, 60, y + 16);
    doc.setFont(undefined, 'bold');
    doc.text("EXAMEN MICROSCOPICO", 30, y + 24);
    doc.setFont(undefined, 'bold');
    doc.text("LUGOL", 30, y + 32);
    doc.setFont(undefined, 'normal');
    doc.text(`${muestra.lugol || ''}`, 60, y + 32);
  }

  // Muestras
  const muestras = datos.muestras || [{}, {}, {}];
  renderMuestra('I', muestras[0], y);
  y += 40;
  renderMuestra('II', muestras[1], y);
  y += 40;
  renderMuestra('III', muestras[2], y);

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
} 