// src/views/jaspers/Microbiologia/Microbiologia_Digitalizado.jsx
import jsPDF from "jspdf";
import headerLabGenerico from "./Header/headerLabGenerico";
import footer from "../components/footer";

export default function Microbiologia_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER personalizado ===
  headerLabGenerico(doc, datos);

  // Bajamos el cursor aún más para no chocar con el header
  let y = 65;

  // === TÍTULO ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("MICROBIOLOGÍA", pageW / 2, y, { align: "center" });

  // MUESTRA
  y += 14;
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("MUESTRA :", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.muestra || "ESPUTO", margin + 25, y);

  // ENCABEZADO DE TABLA
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("PRUEBA", margin, y);
  doc.text("RESULTADO", pageW - margin, y, { align: "right" });

  // Línea bajo encabezados
  y += 4;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);

  // Datos de pruebas
  const tests = [
    {
      label: "Examen de BK - BACILOSCOPIA 1° Muestra",
      key: "bk1",
      default: "N/A",
    },
    {
      label: "Examen de BK - BACILOSCOPIA 2° Muestra",
      key: "bk2",
      default: "N/A",
    },
  ];

  y += 8;
  doc.setFont("helvetica", "normal").setFontSize(11);
  tests.forEach(({ label, key, default: dflt }) => {
    doc.text(label, margin, y);
    doc.text(datos[key] != null ? datos[key] : dflt, pageW - margin, y, {
      align: "right",
    });
    y += 8;
  });

  // === FOOTER ===
  footer(doc, datos);

  // === IMPRIMIR ===
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
}
