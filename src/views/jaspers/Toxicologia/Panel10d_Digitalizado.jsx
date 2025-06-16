// src/views/jaspers/Toxicologia/Panel10d_Digitalizado.jsx
import jsPDF from "jspdf";
import header from "./Header/Header_toxicologia";
import footer from "../components/footer";

export default function Panel10d_Digitalizado(datos) {
  const doc = new jsPDF();
  // Header común
  header(doc, datos);

  // Ajuste de posición inicial
  let y = 80;

  // --- TÍTULO PRINCIPAL ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOXICOLÓGICO", 105, y, { align: "center" });
  y += 12;

  // --- MUESTRA Y MÉTODO ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("MUESTRA :", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.muestra || "ORINA", 50, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("MÉTODO  :", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(datos.metodo || "INMUNOCROMATOGRÁFICO", 50, y);
  y += 12;

  // --- ENCABEZADO DE COLUMNAS ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PRUEBA CUALITATIVO", 20, y);
  doc.text("RESULTADOS", 85, y);
  doc.text("UNIDADES", 150, y);
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);

  // --- TÍTULO DEL PANEL 10D ---
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PANEL DROGAS 10D", 20, y);

  // --- LISTADO DE ANALITOS ---
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const tests = [
    { label: "Cocaína (COC)", key: "cocaina" },
    { label: "Marihuana (THC)", key: "marihuana" },
    { label: "Anfetamina (AMP)", key: "anfetamina" },
    { label: "Metanfetamina (MET)", key: "metanfetamina" },
    { label: "Benzodiacepina (BZO)", key: "benzodiacepina" },
    { label: "Opiáceos (OPI)", key: "opiaceos" },
    { label: "Barbitúricos", key: "barbituricos" },
    { label: "Metadona (MTD)", key: "metadona" },
    { label: "Fenciclidina (PCP)", key: "fenciclidina" },
    { label: "Antidepresivos Tricíclicos (TCA)", key: "antidepresivos" },
  ];

  tests.forEach(({ label, key }) => {
    doc.text(label, 20, y);
    // Se toma datos[key] o "NEGATIVO" por defecto
    const resultado = (datos[key] || "NEGATIVO").toUpperCase();
    doc.text(resultado, 85, y);
    doc.text("S/U", 150, y);
    y += 7;
  });

  // Footer común
  footer(doc, datos);

  // Abrir PDF invisible y lanzar impresión
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
