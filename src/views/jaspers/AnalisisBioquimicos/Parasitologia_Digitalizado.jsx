// src/views/jaspers/AnalisisBioquimicos/Parasitologia_Digitalizado.jsx
import jsPDF from "jspdf";
import headerLabGenerico from "./Header/headerLabGenerico";
import footer from "../components/footer";

export default function Parasitologia_Digitalizado(datos = {}) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // === HEADER genérico ===
  headerLabGenerico(doc, datos);

  // Bajamos el contenido y estrechamos el área de texto
  let y = 70;
  const xLeft = margin * 2;               // 30 mm
  const xRight = pageW - margin * 2;      // pageW - 30 mm

  // === TÍTULO ===
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text("PARASITOLOGÍA", pageW / 2, y, { align: "center" });
  y += 12;

  // Definimos las muestras
  const muestras = [
    { title: "I MUESTRA",   prefix: "1" },
    { title: "II MUESTRA",  prefix: "2" },
    { title: "III MUESTRA", prefix: "3" },
  ];

  muestras.forEach(({ title, prefix }) => {
    // Título de la muestra
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text(title, xLeft, y);
    y += 8;

    // Campos de la muestra
    const fields = [
      { label: "COLOR",               key: `color${prefix}` },
      { label: "ASPECTO",             key: `aspecto${prefix}` },
      { label: "EXAMEN MICROSCÓPICO", key: `microscopico${prefix}` },
      { label: "LUGOL",               key: `lugol${prefix}` },
    ];

    doc.setFont("helvetica", "normal").setFontSize(11);
    fields.forEach(({ label, key }) => {
      const value = datos[key] != null ? datos[key] : "N/A";
      doc.text(label, xLeft, y);
      doc.text(value, xRight, y, { align: "right" });
      y += 7;
    });

    // Separación antes de la siguiente muestra
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
