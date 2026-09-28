import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { compressImage } from "../../utils/helpers.js";

// Mismo logo que usa CabeceraLogo en el resto de formatos Jasper, dibujado más chico y
// junto al título para no perder espacio vertical. Se pasa por compressImage (como hace
// CabeceraLogo) para que el navegador lo decodifique por canvas y jsPDF reciba un JPEG:
// pasarle el WEBP directo a jsPDF (su propio decodificador WEBP) salía pixelado.
const LOGO_URL = "/img/logo-color.webp";
const LOGO_RATIO = 669 / 191;

const NAVY = [35, 50, 69]; // #233245
const ORANGE = [252, 107, 3]; // #fc6b03
const MAROON = [153, 27, 27]; // rojo formal para el descuento
const GRAY_LIGHT = [248, 250, 250]; // #F8FAFA
const GRAY_BORDER = [226, 232, 240];

const pad = (n) => String(n).padStart(2, "0");

function formatFechaLegible(iso) {
    if (!iso) return "-";
    const [y, m, d] = iso.split("-");
    if (!d || !m || !y) return iso;
    return `${d}/${m}/${y}`;
}

function formatHora(hora) {
    if (!hora) return "-";
    const h = Number(hora.hour ?? 0);
    const m = Number(hora.minute ?? 0);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${pad(h12)}:${pad(m)} ${ampm}`;
}

const money = (v) => `S/ ${(Number(v) || 0).toFixed(2)}`;

// Subtotal, descuento y total de un ticket, calculados a partir de sus líneas de
// detalle (precio unitario × cantidad, y ese importe × % de descuento de la línea),
// en vez de usar los campos subtotalServicios/descuento/total que trae el ticket.
function calcularTotalesTicket(t) {
    const contenidos = Array.isArray(t.contenidos) ? t.contenidos : [];
    return contenidos.reduce(
        (acc, c) => {
            const cantidad = Number(c.cantidad) || 0;
            const precioUnitario = Number(c.precioUnitario) || 0;
            const descuentoPct = Number(c.descuentoLinea) || 0;
            const bruto = precioUnitario * cantidad;
            const descuentoMonto = bruto * (descuentoPct / 100);
            return {
                subtotal: acc.subtotal + bruto,
                descuento: acc.descuento + descuentoMonto,
                total: acc.total + (bruto - descuentoMonto),
            };
        },
        { subtotal: 0, descuento: 0, total: 0 }
    );
}

// Tarjetas de resumen (tickets, subtotal, descuento y total del periodo). Solo en la
// primera página.
function drawResumenCards(doc, pageWidth, y, resumen) {
    const cards = [
        { label: "N° TICKETS", value: String(resumen.totalTickets), color: NAVY },
        { label: "SUBTOTAL SERVICIOS", value: money(resumen.subtotal), color: [59, 130, 246] },
        { label: "DESCUENTOS", value: money(resumen.descuento), color: [220, 38, 38] },
        { label: "TOTAL GENERAL", value: money(resumen.total), color: ORANGE },
    ];
    const marginX = 10;
    const gap = 4;
    const cardWidth = (pageWidth - marginX * 2 - gap * (cards.length - 1)) / cards.length;
    const cardHeight = 17;

    cards.forEach((card, i) => {
        const x = marginX + i * (cardWidth + gap);
        doc.setFillColor(...GRAY_LIGHT);
        doc.setDrawColor(...GRAY_BORDER);
        doc.setLineWidth(0.2);
        doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, "FD");
        doc.setFillColor(...card.color);
        doc.rect(x, y, 1.6, cardHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        doc.text(card.label, x + 6, y + 6.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...NAVY);
        doc.text(card.value, x + 6, y + 13.5);
    });

    return y + cardHeight + 8;
}

// Barra de cabecera de un ticket. N° de ticket + fecha/hora, paciente, y
// médico/pago/autoriza/operador. El total no va aquí: aparece una sola vez, en el
// recap de abajo (subtotal / descuento total / total).
function drawTicketHeaderBar(doc, t, marginX, contentWidth, y) {
    const barHeight = 19;
    const paciente = t.paciente || {};
    const nombreCompleto = `${(paciente.apellidos ?? "").trim()} ${(paciente.nombres ?? "").trim()}`.trim() || "-";
    const documento = paciente.numeroDocumento ? `${paciente.tipoDocumento ?? ""} ${paciente.numeroDocumento}` : "-";

    doc.setFillColor(...GRAY_LIGHT);
    doc.setDrawColor(...GRAY_BORDER);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginX, y, contentWidth, barHeight, 1.2, 1.2, "FD");
    doc.setFillColor(...ORANGE);
    doc.rect(marginX, y, 1.6, barHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...NAVY);
    doc.text(`Ticket N° ${t.numeroTicket ?? "-"}`, marginX + 6, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`${formatFechaLegible(t.fechaTicket)}  ·  ${formatHora(t.horaTicket)}`, marginX + contentWidth - 4, y + 5, { align: "right" });

    doc.setFontSize(8.3);
    doc.text(`Paciente: ${nombreCompleto}  (${documento})`, marginX + 6, y + 9.8);

    doc.text(`Médico: ${t.medico || "-"}    Pago: ${t.modoPago || "-"}    Autoriza: ${t.autoriza || "-"}`, marginX + 6, y + 14.2);

    doc.setFontSize(7.2);
    doc.setTextColor(120, 120, 120);
    doc.text(`Operador: ${t.operador || "-"}    Cód. Vendedor: ${t.codigoVendedor ?? "-"}`, marginX + 6, y + 17.7);

    return y + barHeight + 3;
}

// Subtotal, Descuento y TOTAL en una sola línea, alineados a la derecha, cada uno con
// su propio color (formal, no llamativo) para distinguirlos de un vistazo: gris para el
// subtotal, granate para el descuento, y naranja institucional -más grande y en negrita-
// para el total.
function drawTotalesLinea(doc, marginX, contentWidth, y, totales) {
    const segmentos = [
        { texto: `Subtotal: ${money(totales.subtotal)}`, size: 7.8, color: [100, 100, 100], bold: false },
        { texto: `Descuento: ${money(totales.descuento)}`, size: 7.8, color: MAROON, bold: false },
        { texto: `TOTAL: ${money(totales.total)}`, size: 10, color: ORANGE, bold: true },
    ];
    const gap = 5;

    const medidos = segmentos.map((s) => {
        doc.setFont("helvetica", s.bold ? "bold" : "normal");
        doc.setFontSize(s.size);
        return { ...s, ancho: doc.getTextWidth(s.texto) };
    });
    const anchoTotal = medidos.reduce((sum, s) => sum + s.ancho, 0) + gap * (medidos.length - 1);

    let x = marginX + contentWidth - anchoTotal;
    medidos.forEach((s) => {
        doc.setFont("helvetica", s.bold ? "bold" : "normal");
        doc.setFontSize(s.size);
        doc.setTextColor(...s.color);
        doc.text(s.texto, x, y);
        x += s.ancho + gap;
    });

    return y;
}

// Dibuja un ticket completo: cabecera, tabla con todas sus líneas de detalle y el
// recap de subtotal/descuento total/total. Devuelve el Y donde continúa el siguiente ticket.
function drawTicketCard(doc, t, marginX, contentWidth, y) {
    y = drawTicketHeaderBar(doc, t, marginX, contentWidth, y);

    const contenidos = Array.isArray(t.contenidos) ? t.contenidos : [];
    const bodyRows = contenidos.length
        ? contenidos.map((c) => [
            c.cantidad ?? 0,
            c.descripcion ?? "-",
            c.unidad ?? "-",
            money(c.precioUnitario),
            `${c.descuentoLinea ?? 0}%`,
            money(c.precioTotal),
        ])
        : [["-", "Sin servicios registrados", "-", "-", "-", "-"]];

    autoTable(doc, {
        startY: y,
        head: [["Cant.", "Descripción", "Unidad", "P. Unit.", "Dscto.", "Subtotal"]],
        body: bodyRows,
        theme: "grid",
        styles: { font: "helvetica", fontSize: 7.3, cellPadding: 1.6, lineColor: GRAY_BORDER, lineWidth: 0.1, textColor: [50, 50, 50] },
        headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold", halign: "center", fontSize: 7.3 },
        columnStyles: {
            0: { halign: "center", cellWidth: 12 },
            2: { halign: "center", cellWidth: 18 },
            3: { halign: "right", cellWidth: 22 },
            4: { halign: "center", cellWidth: 15 },
            5: { halign: "right", cellWidth: 24, fontStyle: "bold" },
        },
        margin: { left: marginX, right: marginX },
    });

    y = doc.lastAutoTable.finalY + 4.5;

    // Un único subtotal, un único descuento total y un único total por ticket, en una
    // sola línea (drawTotalesLinea).
    y = drawTotalesLinea(doc, marginX, contentWidth, y, calcularTotalesTicket(t));

    y += 3.5;
    doc.setDrawColor(...GRAY_BORDER);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, marginX + contentWidth, y);

    return y + 4;
}

// Abre el PDF en un iframe oculto y lanza el diálogo de impresión del navegador,
// igual que el resto de reportes/formatos Jasper del sistema.
function imprimir(doc) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
}

// Reporte de tickets por rango de fechas (GET /api/tickets/reporte). Cada ticket se
// imprime completo -cabecera, todas sus líneas de detalle y su recap de totales- antes
// de pasar al siguiente, ordenados de menor a mayor por N° de Ticket. Sin footer y con
// el logo/título compactos en una sola línea: con ~25 tickets no debe pasar de pocas hojas.
export default async function ReporteTickets({ tickets = [], desde, hasta } = {}) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 10;
    const contentWidth = pageWidth - marginX * 2;
    const contentBottom = pageHeight - 8;

    // Se comprime una sola vez (no en cada página) y se reutiliza el mismo data URI.
    const logoDataUrl = await compressImage(LOGO_URL);

    let paginaActual = 1;

    // Logo y título en la misma línea (en vez de logo arriba + título debajo), para no
    // gastar espacio vertical de más: este reporte se repite en cada página.
    const drawHeader = (mostrarResumen, resumen) => {
        const marginTop = 8;
        const logoAncho = 34;
        const logoAlto = logoAncho / LOGO_RATIO;

        try {
            doc.addImage(logoDataUrl, "JPEG", marginX, marginTop, logoAncho, logoAlto);
        } catch {
            // Si el logo no carga, se continúa sin bloquear la generación del reporte.
        }

        const textX = marginX + logoAncho + 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12.5);
        doc.setTextColor(...NAVY);
        doc.text("REPORTE DE ATENCIÓN Y SERVICIOS POR TICKET", textX, marginTop + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text(`Periodo: ${formatFechaLegible(desde)}  —  ${formatFechaLegible(hasta)}`, textX, marginTop + 9.3);
        doc.text(`Pág. ${paginaActual}`, pageWidth - marginX, marginTop + 4.5, { align: "right" });

        let y = marginTop + Math.max(logoAlto, 13) + 4;

        doc.setDrawColor(...ORANGE);
        doc.setLineWidth(0.8);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 5;

        if (mostrarResumen) {
            y = drawResumenCards(doc, pageWidth, y, resumen);
        }

        return y;
    };

    const ticketsOrdenados = [...tickets].sort(
        (a, b) => (Number(a.numeroTicket) || 0) - (Number(b.numeroTicket) || 0)
    );

    // Resumen general = suma de los totales por ticket, ya calculados desde sus líneas.
    const resumen = ticketsOrdenados.reduce(
        (acc, t) => {
            const totales = calcularTotalesTicket(t);
            return {
                totalTickets: acc.totalTickets + 1,
                subtotal: acc.subtotal + totales.subtotal,
                descuento: acc.descuento + totales.descuento,
                total: acc.total + totales.total,
            };
        },
        { totalTickets: 0, subtotal: 0, descuento: 0, total: 0 }
    );

    let y = drawHeader(true, resumen);

    for (const t of ticketsOrdenados) {
        const filas = (Array.isArray(t.contenidos) ? t.contenidos.length : 0) || 1;
        const alturaEstimada = 22 + 6 + filas * 5.2 + 12;

        if (y + alturaEstimada > contentBottom) {
            doc.addPage();
            paginaActual += 1;
            y = drawHeader(false);
        }

        y = drawTicketCard(doc, t, marginX, contentWidth, y);
    }

    imprimir(doc);
}
