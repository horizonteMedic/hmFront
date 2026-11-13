import { jsPDF } from "jspdf";

const TITULO_DEFAULT = "Campaña de Salud Integral - Caseríos José Carlos Mariátegui, Llaray, El Hospital, Las Pajillas y Quiruvilca";

const TAM_FUENTE_PARENTESCO = 6.5;
const INTERLINEADO_PARENTESCO = 3;

async function fetchImageBase64(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        return { data: base64, format: blob.type.includes("png") ? "PNG" : "JPEG" };
    } catch {
        return null;
    }
}

export default async function Ticket({
    datos = null,
    titulo = TITULO_DEFAULT,
    logoUrl = null,
}) {
    const logoImg = logoUrl ? await fetchImageBase64(logoUrl) : null;
    // ── Desestructurar datos de la API ────────────────────────────────────────
    const visita = datos?.visita ?? {};
    const paciente = datos?.paciente ?? {};
    const fichas = datos?.fichas ?? [];

    const norden = String(visita.norden ?? "");
    const nombres = `${paciente.nombres ?? ""} ${paciente.apellidos ?? ""}`.trim();
    const dni = paciente.dni ?? "";
    const edad = calcularEdad(paciente.fechaNacimiento);
    const especialidades = fichas.map((f) => ({ nombre: f.especialidad?.nombre ?? "" }));
    const parentescos = Array.isArray(paciente.parentescos) ? paciente.parentescos : [];
    const ancho = 80;
    const margen = 5;

    // Altura dinámica: base + parentescos + filas de especialidades
    const filas = Math.ceil(especialidades.length / 2);
    const altoCelda = 27;
    // Se miden los parentescos antes de crear el doc para que la altura contemple los saltos de línea
    const bloquesParentesco = medirParentescos(parentescos, ancho, margen);
    const altoParentesco = bloquesParentesco.length > 0
        ? 7.5 + bloquesParentesco.reduce((acc, b) => acc + b.alto, 0)
        : 0;
    const altoBase = 155;
    const altoDoc = altoBase + altoParentesco + filas * altoCelda - 80;

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
        if (logoImg) {
            doc.addImage(logoImg.data, logoImg.format, (ancho - logoAncho) / 2, y, logoAncho, logoAlto);
        } else {
            doc.addImage("/img/Ticket/Logo.png", "PNG", (ancho - logoAncho) / 2, y, logoAncho, logoAlto);
        }
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

    // ── Parentesco (solo si existe) ───────────────────────────────────────────
    if (parentescos.length > 0) {
        y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text("Parentesco:", margen, y);
        y += 4.5;

        doc.setFontSize(TAM_FUENTE_PARENTESCO);
        bloquesParentesco.forEach((b) => {
            doc.setFont("helvetica", "bold");
            doc.text(b.prefijo, margen + 2, y);
            doc.setFont("helvetica", "normal");
            doc.text(b.lineas, b.xTexto, y);
            y += b.alto;
        });
        y += 1;
    }

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
    /*const colAncho = (ancho - margen * 2 - 3) / 2;   // ancho de cada celda
    const padding = 2.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    const esImparSolitario = especialidades.length % 2 !== 0;

    especialidades.forEach((esp, i) => {
        const esUltimoSolitario = esImparSolitario && i === especialidades.length - 1;
        const fila = Math.floor(i / 2);
        const x = esUltimoSolitario
            ? margen + (ancho - margen * 2 - colAncho) / 2
            : margen + (i % 2) * (colAncho + 3);
        const yCell = y + fila * altoCelda;

        // Borde del cuadro
        doc.setDrawColor(100, 100, 100);
        doc.rect(x, yCell, colAncho, altoCelda);

        // Texto centrado verticalmente con padding
        const lineas = doc.splitTextToSize(esp.nombre.toUpperCase(), colAncho - padding * 2);
        const altoTexto = lineas.length * 3.5;
        const yTexto = yCell + (altoCelda - altoTexto) / 2 + 3;
        doc.text(lineas, x + colAncho / 2, yTexto, { align: "center" });
    });*/

    // ── Footer ────────────────────────────────────────────────────────────────
    const yFooter = altoDoc - 5;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text("Horizonte Medic — cuidamos tu salud\nJr. Leoncio Prado N°786 - Huamachuco", ancho / 2, yFooter, { align: "center" });
    doc.setTextColor(0, 0, 0);

    imprimir(doc);
}

// Calcula, para cada parentesco, el prefijo, las líneas del nombre (con salto de línea
// respetando el margen derecho) y el alto que ocupa.
function medirParentescos(parentescos, ancho, margen) {
    if (!parentescos.length) return [];
    const medidor = new jsPDF({ unit: "mm", format: [ancho, 100] });
    medidor.setFontSize(TAM_FUENTE_PARENTESCO);

    return parentescos.map((p) => {
        const prefijo = `Es ${p.tipoRelacion ?? ""} de:`;
        const dniRel = p.dniRelacionado ? ` (DNI: ${p.dniRelacionado})` : "";

        medidor.setFont("helvetica", "bold");
        const xTexto = margen + 2 + medidor.getTextWidth(prefijo) + 1.5;

        medidor.setFont("helvetica", "normal");
        const anchoDisponible = ancho - margen - xTexto; // respeta el margen derecho
        const lineas = medidor.splitTextToSize(`${p.nombreRelacionado ?? ""}${dniRel}`, anchoDisponible);

        return {
            prefijo,
            xTexto,
            lineas,
            alto: Math.max(lineas.length * INTERLINEADO_PARENTESCO, 4) + 1,
        };
    });
}

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return "";
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha)) return "";
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const cumple = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate());
    if (hoy < cumple) edad--;
    return String(edad);
}

function separador(doc, margen, ancho, y) {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(margen, y, ancho - margen, y);
    doc.setLineDashPattern([], 0);
}

function imprimir(doc) {
    doc.autoPrint();
    const url = URL.createObjectURL(doc.output("blob"));
    const a = window.open(url, "_blank");
    if (!a) {
        // fallback si el navegador bloquea la pestaña
        const link = document.createElement("a");
        link.href = url;
        link.download = "ticket.pdf";
        link.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}
