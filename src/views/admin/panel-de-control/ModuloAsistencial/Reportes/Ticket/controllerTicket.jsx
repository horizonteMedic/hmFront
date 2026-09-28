import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getFetch } from "../../../../../utils/apiHelpers";
import { LoadingDefault } from "../../../../../utils/functionUtils";

const reporteTicketsUrl = "/api/tickets/reporte";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por
// eso se declara aquí (en el controller) y no dentro del util de impresión.
const jasperModules = import.meta.glob("../../../../../jaspers/TicketAsistencial/*.jsx");
const rutaReporte = "../../../../../jaspers/TicketAsistencial/ReporteTickets.jsx";

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

// Subtotal, descuento y total de un ticket calculados desde sus líneas de detalle (mismo
// criterio que usa el PDF detallado), para que ambos reportes siempre coincidan.
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

// Consulta /api/tickets/reporte y devuelve los tickets ordenados de menor a mayor por
// N° de Ticket. Común al PDF detallado y al Excel resumen.
const obtenerTickets = async (desde, hasta, token) => {
    if (!desde || !hasta) {
        Swal.fire("Error", "Seleccione ambas fechas.", "warning");
        return null;
    }
    if (desde > hasta) {
        Swal.fire("Error", "La fecha inicial no puede ser mayor a la fecha final.", "warning");
        return null;
    }

    const query = new URLSearchParams({ desde, hasta });
    const res = await getFetch(`${reporteTicketsUrl}?${query.toString()}`, token);

    if (!res || res.error) {
        Swal.fire("Error", "No se pudo obtener el reporte. Intente nuevamente.", "error");
        return null;
    }

    const tickets = Array.isArray(res.resultado) ? res.resultado : [];
    if (tickets.length === 0) {
        Swal.fire("Sin resultados", "No se encontraron tickets en el rango de fechas seleccionado.", "info");
        return null;
    }

    return [...tickets].sort((a, b) => (Number(a.numeroTicket) || 0) - (Number(b.numeroTicket) || 0));
};

// ===== Ticket Detallado (PDF, con todas las líneas de servicio de cada ticket) =====
export const GenerarReporteTickets = async (desde, hasta, token) => {
    LoadingDefault("Generando Ticket Detallado");

    const tickets = await obtenerTickets(desde, hasta, token);
    if (!tickets) {
        Swal.close();
        return;
    }

    const modulo = await jasperModules[rutaReporte]();
    if (typeof modulo.default === "function") {
        await modulo.default({ tickets, desde, hasta });
        Swal.close();
    } else {
        console.error(`El módulo ${rutaReporte} no exporta una función por defecto`);
        Swal.close();
        Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
    }
};

// ===== Excel (un ticket por fila, con toda su info pero sin el detalle de servicios) =====
export const GenerarExcelTickets = async (desde, hasta, token) => {
    LoadingDefault("Generando Excel");

    const tickets = await obtenerTickets(desde, hasta, token);
    if (!tickets) {
        Swal.close();
        return;
    }

    const headers = [
        { key: "item", label: "N°", width: 5 },
        { key: "numeroTicket", label: "N° Ticket", width: 12, destacado: true },
        { key: "serieTicket", label: "Serie", width: 8 },
        { key: "fecha", label: "Fecha", width: 12 },
        { key: "hora", label: "Hora", width: 10 },
        { key: "nombreCompleto", label: "Apellidos y Nombres", width: 32, destacado: true },
        { key: "tipoDocumento", label: "Tipo Doc.", width: 10 },
        { key: "numeroDocumento", label: "N° Documento", width: 14, destacado: true },
        { key: "numeroHistoriaClinica", label: "N° Historia Clínica", width: 16 },
        { key: "edad", label: "Edad", width: 8 },
        { key: "sexo", label: "Sexo", width: 8 },
        { key: "celular", label: "Celular", width: 14 },
        { key: "empresa", label: "Empresa", width: 26 },
        { key: "medico", label: "Médico", width: 22 },
        { key: "modoPago", label: "Modo Pago", width: 14 },
        { key: "autoriza", label: "Autoriza", width: 14 },
        { key: "operador", label: "Operador", width: 22 },
        { key: "codigoVendedor", label: "Cód. Vendedor", width: 12 },
        { key: "cantidadServicios", label: "Cant. Servicios", width: 12 },
        { key: "subtotal", label: "Subtotal", width: 13, money: true },
        { key: "descuento", label: "Descuento", width: 13, money: true },
        { key: "total", label: "Total", width: 13, money: true, destacado: true },
    ];
    const lastColLetter = String.fromCharCode(64 + headers.length);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("TICKETS");

    // ── Título ────────────────────────────────────────────────────
    sheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = sheet.getCell("A1");
    titleCell.value = `REPORTE DE TICKETS | ${formatFechaLegible(desde)} al ${formatFechaLegible(hasta)}`;
    titleCell.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF233245" } };
    sheet.getRow(1).height = 25;

    // ── Headers ───────────────────────────────────────────────────
    const headerRow = sheet.addRow(headers.map((h) => h.label));
    headerRow.height = 22;
    headerRow.eachCell((cell, colNumber) => {
        const h = headers[colNumber - 1];
        cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = {
            type: "pattern", pattern: "solid",
            fgColor: { argb: h?.destacado ? "FFB8860B" : "FFFC6B03" },
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FFFFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
            left: { style: "thin", color: { argb: "FFFFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFFFF" } },
        };
    });
    sheet.columns = headers.map((h) => ({ width: h.width }));

    // ── Filas de datos (un ticket por fila, sin el detalle de servicios) ───
    const destacadosIdx = headers.map((h, i) => (h.destacado ? i + 1 : null)).filter(Boolean);
    const moneyIdx = headers.map((h, i) => (h.money ? i + 1 : null)).filter(Boolean);

    let sumaSubtotal = 0;
    let sumaDescuento = 0;
    let sumaTotal = 0;

    tickets.forEach((t, rowIdx) => {
        const paciente = t.paciente || {};
        const totales = calcularTotalesTicket(t);
        sumaSubtotal += totales.subtotal;
        sumaDescuento += totales.descuento;
        sumaTotal += totales.total;

        const values = {
            item: rowIdx + 1,
            numeroTicket: t.numeroTicket ?? "",
            serieTicket: t.serieTicket ?? "",
            fecha: formatFechaLegible(t.fechaTicket),
            hora: formatHora(t.horaTicket),
            nombreCompleto: `${(paciente.apellidos ?? "").trim()} ${(paciente.nombres ?? "").trim()}`.trim(),
            tipoDocumento: paciente.tipoDocumento ?? "",
            numeroDocumento: paciente.numeroDocumento ?? "",
            numeroHistoriaClinica: paciente.numeroHistoriaClinica ?? "",
            edad: paciente.edad ?? "",
            sexo: paciente.sexo ?? "",
            celular: paciente.celular ?? "",
            empresa: t.empresa ?? "",
            medico: t.medico ?? "",
            modoPago: t.modoPago ?? "",
            autoriza: t.autoriza ?? "",
            operador: t.operador ?? "",
            codigoVendedor: t.codigoVendedor ?? "",
            cantidadServicios: t.cantidadServicios ?? "",
            subtotal: Number(totales.subtotal.toFixed(2)),
            descuento: Number(totales.descuento.toFixed(2)),
            total: Number(totales.total.toFixed(2)),
        };

        const dataRow = sheet.addRow(headers.map((h) => values[h.key]));
        dataRow.height = 18;
        const esPar = rowIdx % 2 === 0;

        dataRow.eachCell((cell, colNumber) => {
            const esDestacado = destacadosIdx.includes(colNumber);
            const esMoney = moneyIdx.includes(colNumber);

            cell.alignment = { vertical: "middle", horizontal: esMoney ? "right" : "left", wrapText: true };
            cell.font = {
                size: 9,
                bold: esDestacado,
                color: { argb: esDestacado ? "FF233245" : "FF000000" },
            };
            cell.fill = {
                type: "pattern", pattern: "solid",
                fgColor: {
                    argb: esDestacado
                        ? (esPar ? "FFFFF3CD" : "FFFEF9E7")
                        : (esPar ? "FFF2F2F2" : "FFFFFFFF"),
                },
            };
            cell.border = {
                top: { style: "hair", color: { argb: "FFCCCCCC" } },
                bottom: { style: "hair", color: { argb: "FFCCCCCC" } },
                left: { style: "hair", color: { argb: "FFCCCCCC" } },
                right: { style: "hair", color: { argb: "FFCCCCCC" } },
            };
            if (esMoney) {
                cell.numFmt = '"S/" #,##0.00';
            }
        });
    });

    // ── Fila de totales ──────────────────────────────────────────
    const totalRow = sheet.addRow(headers.map((h) => {
        if (h.key === "subtotal") return Number(sumaSubtotal.toFixed(2));
        if (h.key === "descuento") return Number(sumaDescuento.toFixed(2));
        if (h.key === "total") return Number(sumaTotal.toFixed(2));
        return "";
    }));
    totalRow.height = 20;

    const colSubtotal = headers.findIndex((h) => h.key === "subtotal") + 1;
    const colDescuento = headers.findIndex((h) => h.key === "descuento") + 1;
    const colTotal = headers.findIndex((h) => h.key === "total") + 1;
    const letraUltimaColDatos = String.fromCharCode(64 + colSubtotal - 1);

    sheet.mergeCells(`A${totalRow.number}:${letraUltimaColDatos}${totalRow.number}`);
    const totalLabelCell = sheet.getCell(`A${totalRow.number}`);
    totalLabelCell.value = `TOTAL: ${tickets.length} tickets`;
    totalLabelCell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    totalLabelCell.alignment = { horizontal: "right", vertical: "middle" };
    totalLabelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF233245" } };

    [colSubtotal, colDescuento, colTotal].forEach((colNumber) => {
        const cell = totalRow.getCell(colNumber);
        cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF233245" } };
        cell.numFmt = '"S/" #,##0.00';
    });

    // ── Exportar ──────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    Swal.close();
    saveAs(new Blob([buffer]), `Reporte_Tickets_${desde}_${hasta}.xlsx`);
};
