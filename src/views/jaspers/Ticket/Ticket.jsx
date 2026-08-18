import { jsPDF } from "jspdf";

export default function Ticket({
    norden = "000001",
    titulo = "Campaña de Salud Integral - Caseríos José Carlos Mariátegui, Llaray, El Hospital, Las Pajillas y Quiruvilca",
    nombres = "Robert Daniel Plasencia",
    dni = "71234567",
    edad = "28",
    especialidades = [
        { nombre: "Medicina General" },
        { nombre: "Laboratorio" },
        { nombre: "Psicología" },
        { nombre: "Odontología" },
        { nombre: "Nutrición" },
    ],
}) {
    const ancho = 80;
    const margen = 5;

    // Altura dinámica: base + espacio por filas de especialidades
    const filas = Math.ceil(especialidades.length / 2);
    const altoCelda = 18;
    const altoBase = 110;
    const altoDoc = altoBase + filas * altoCelda - 10;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [ancho, altoDoc],
    });

    let y = margen;

    // ── Logo ──────────────────────────────────────────────────────────────────
    try {
        const logoAncho = 38;
        const logoAlto = 18;
        doc.addImage("/img/Ticket/Logo.png", "PNG", (ancho - logoAncho) / 2, y, logoAncho, logoAlto);
        y += logoAlto + 3;
    } catch {
        y += 3;
    }

    // ── Título ────────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const tituloLineas = doc.splitTextToSize(titulo, ancho - margen * 2);
    doc.text(tituloLineas, ancho / 2, y, { align: "center" });
    y += tituloLineas.length * 3.2 + 4;

    // ── Datos del paciente ────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Paciente:", margen, y);
    doc.setFont("helvetica", "normal");
    const nombreLineas = doc.splitTextToSize(nombres, ancho - margen * 2 - 24);
    doc.text(nombreLineas, margen + 24, y);
    y += Math.max(nombreLineas.length * 4.2, 5) + 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("DNI:", margen, y);
    doc.setFont("helvetica", "normal");
    doc.text(dni, margen + 12, y);

    doc.setFont("helvetica", "bold");
    doc.text("Edad:", margen + 37, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${edad} años`, margen + 51, y);
    y += 7;

    // ── Línea separadora ──────────────────────────────────────────────────────
    separador(doc, margen, ancho, y);
    y += 6;

    // ── Fecha ─────────────────────────────────────────────────────────────────
    const fechaStr = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(fechaStr, ancho / 2, y, { align: "center" });
    y += 5;

    // ── Label N° de Orden ─────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("N° de Orden", ancho / 2, y, { align: "center" });
    y += 11;

    // ── Norden grande ─────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.text(String(norden), ancho / 2, y, { align: "center" });
    y += 9;

    // ── Línea separadora ──────────────────────────────────────────────────────
    separador(doc, margen, ancho, y);
    y += 6;

    // ── Especialidades en 2 columnas ──────────────────────────────────────────
    const colAncho = (ancho - margen * 2 - 3) / 2;   // ancho de cada celda
    const padding = 2.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);

    especialidades.forEach((esp, i) => {
        const col = i % 2;
        const fila = Math.floor(i / 2);
        const x = margen + col * (colAncho + 3);
        const yCell = y + fila * altoCelda;

        // Borde del cuadro
        doc.setDrawColor(100, 100, 100);
        doc.rect(x, yCell, colAncho, altoCelda);

        // Texto centrado verticalmente con padding
        const lineas = doc.splitTextToSize(esp.nombre.toUpperCase(), colAncho - padding * 2);
        const altoTexto = lineas.length * 3.5;
        const yTexto = yCell + (altoCelda - altoTexto) / 2 + 3;
        doc.text(lineas, x + colAncho / 2, yTexto, { align: "center" });
    });

    // ── Footer ────────────────────────────────────────────────────────────────
    const yFooter = altoDoc - 5;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text("Horizonte Medic — cuidamos tu salud\nJr. Leoncio Prado N°786 - Huamachuco", ancho / 2, yFooter, { align: "center" });
    doc.setTextColor(0, 0, 0);

    imprimir(doc);
}

function separador(doc, margen, ancho, y) {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(margen, y, ancho - margen, y);
    doc.setLineDashPattern([], 0);
}

function imprimir(doc) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}
