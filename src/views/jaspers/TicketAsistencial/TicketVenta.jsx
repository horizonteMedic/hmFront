import { jsPDF } from "jspdf";

// Logo horizontal (POLICLÍNICO HORIZONTE MEDIC / Cuidamos tu Salud!), 3517x1260px.
const LOGO_URL = "/img/logo-color_nuevocreado.png";
const LOGO_RATIO = 3517 / 1260;

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

function formatearFecha(fechaIso) {
    if (!fechaIso) {
        return new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    const [yyyy, mm, dd] = fechaIso.split("-");
    if (!dd || !mm || !yyyy) return fechaIso;
    return `${dd}/${mm}/${yyyy}`;
}

function separador(doc, margenLateral, ancho, y) {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(margenLateral, y, ancho - margenLateral, y);
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

// Ticket de venta (80mm) del Registro de Ticket asistencial: recibo con los servicios
// cobrados. A diferencia de jaspers/Ticket/Ticket.jsx (usado en las campañas de salud,
// con logo/título de la campaña y casilleros de especialidad), este siempre usa el logo
// de Horizonte Medic, no muestra título de campaña, y en vez de casilleros imprime el
// detalle de servicios estilo recibo con su total general.
export default async function TicketVenta({
    tipoDocumento = "DNI",
    documentoIdentidad = "",
    nombres = "",
    fechaNacimiento = null,
    medico = "",
    fecha = "",
    numeroTicket = "",
    items = [],
}) {
    const ancho = 80;
    // Margen lateral más grande que el superior/inferior: la ticketera no logra
    // imprimir bien cerca de los bordes izquierdo/derecho.
    const margenLateral = 7;
    const margenSuperior = 1.5;
    const margenInferior = 3;
    const anchoValor = margenLateral + 24; // columna donde arrancan todos los valores (Paciente/Documento/Edad/Médico)
    const edad = calcularEdad(fechaNacimiento);

    const tipoDocLabel =
        tipoDocumento === "PASAPORTE" ? "Pasaporte" : tipoDocumento === "SIN DNI" ? "Documento" : "DNI";
    const documentoValor = documentoIdentidad || (tipoDocumento === "SIN DNI" ? "SIN DNI" : "-");

    // Doc "medidor": mismo ancho, alto de sobra, solo para calcular cuántas líneas
    // ocupará cada texto (splitTextToSize no depende del alto de página) y así poder
    // dimensionar el documento final sin que el contenido se corte.
    const medidor = new jsPDF({ orientation: "portrait", unit: "mm", format: [ancho, 1000] });
    const medir = (fontSize, texto, anchoDisponible) => {
        medidor.setFontSize(fontSize);
        return medidor.splitTextToSize(String(texto ?? ""), anchoDisponible);
    };

    const nombreLineas = medir(9, nombres, ancho - margenLateral * 2 - 24);
    const medicoLineas = medir(9, medico || "-", ancho - anchoValor - margenLateral);
    const itemsMedidos = items.map((item) => ({
        item,
        lineasNombre: medir(8, (item.descripcion || "").toUpperCase(), ancho - margenLateral * 2),
    }));

    // Logo: ancho fijo (algo más chico que antes), alto proporcional a su relación de
    // aspecto real (evita que se vea estirado/deformado, el logo es mucho más ancho que alto).
    const logoAncho = 52;
    const logoAlto = logoAncho / LOGO_RATIO;
    const gapLogo = 6; // más espacio entre el logo y el contenido de abajo

    let altoDoc = margenSuperior; // y inicial
    altoDoc += logoAlto + gapLogo; // logo
    altoDoc += Math.max(nombreLineas.length * 4.2, 5) + 2; // paciente
    altoDoc += 6; // documento
    altoDoc += 6; // edad
    altoDoc += Math.max(medicoLineas.length * 4.2, 5) + 3; // médico
    altoDoc += 6; // separador
    altoDoc += 5; // fecha
    altoDoc += 11; // label N° de Ticket
    altoDoc += 9; // número grande
    altoDoc += 6; // separador
    altoDoc += 6; // encabezado servicios + línea
    itemsMedidos.forEach(({ lineasNombre }) => {
        altoDoc += lineasNombre.length * 3.8 + 1 + 5;
    });
    altoDoc += 6; // separador
    altoDoc += 10; // total general
    altoDoc += 5; // separador chico antes del footer
    altoDoc += 5 + 5; // footer (dos líneas)
    altoDoc += margenInferior;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [ancho, altoDoc],
    });

    let y = margenSuperior;

    // ── Logo (siempre Horizonte Medic, nunca el de una campaña) ───────────────
    try {
        doc.addImage(LOGO_URL, "PNG", (ancho - logoAncho) / 2, y, logoAncho, logoAlto);
        y += logoAlto + gapLogo;
    } catch {
        y += gapLogo;
    }

    // ── Paciente ────────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Paciente:", margenLateral, y);
    doc.setFont("helvetica", "normal");
    doc.text(nombreLineas, anchoValor, y);
    y += Math.max(nombreLineas.length * 4.2, 5) + 2;

    // ── Documento ─────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${tipoDocLabel}:`, margenLateral, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(documentoValor), anchoValor, y);
    y += 6;

    // ── Edad (fila propia) ───────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Edad:", margenLateral, y);
    doc.setFont("helvetica", "normal");
    doc.text(edad ? `${edad} años` : "-", anchoValor, y);
    y += 6;

    // ── Médico (el valor arranca en la misma columna que las filas de arriba) ─
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Médico:", margenLateral, y);
    doc.setFont("helvetica", "normal");
    doc.text(medicoLineas, anchoValor, y);
    y += Math.max(medicoLineas.length * 4.2, 5) + 3;

    // ── Línea separadora ──────────────────────────────────────────────────────
    separador(doc, margenLateral, ancho, y);
    y += 6;

    // ── Fecha ─────────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(formatearFecha(fecha), ancho / 2, y, { align: "center" });
    y += 5;

    // ── N° de Ticket ──────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("N° de Ticket", ancho / 2, y, { align: "center" });
    y += 11;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.text(String(numeroTicket || "-"), ancho / 2, y, { align: "center" });
    y += 9;

    // ── Línea separadora ──────────────────────────────────────────────────────
    separador(doc, margenLateral, ancho, y);
    y += 6;

    // ── Detalle de servicios (estilo recibo) ─────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Servicio", margenLateral, y);
    doc.text("Total", ancho - margenLateral, y, { align: "right" });
    y += 2;
    doc.setDrawColor(0, 0, 0);
    doc.line(margenLateral, y, ancho - margenLateral, y);
    y += 4;

    let totalGeneral = 0;
    itemsMedidos.forEach(({ item, lineasNombre }) => {
        const cantidad = Number(item.cantidad) || 0;
        const precioUnitario = Number(item.precio) || 0;
        const total = Number(item.total) || 0;
        totalGeneral += total;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(lineasNombre, margenLateral, y);
        y += lineasNombre.length * 3.8 + 1;

        doc.text(`${cantidad} x S/ ${precioUnitario.toFixed(2)}`, margenLateral, y);
        doc.setFont("helvetica", "bold");
        doc.text(`S/ ${total.toFixed(2)}`, ancho - margenLateral, y, { align: "right" });
        y += 5;
    });

    // ── Línea separadora ──────────────────────────────────────────────────────
    separador(doc, margenLateral, ancho, y);
    y += 6;

    // ── Total general ─────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("TOTAL", margenLateral, y);
    doc.text(`S/ ${totalGeneral.toFixed(2)}`, ancho - margenLateral, y, { align: "right" });
    y += 8;

    // ── Separador chico + footer ──────────────────────────────────────────────
    separador(doc, margenLateral, ancho, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("HORIZONTE MEDIC", ancho / 2, y, { align: "center" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("cuidamos tu salud", ancho / 2, y, { align: "center" });

    imprimir(doc);
}
