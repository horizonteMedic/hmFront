import jsPDF from "jspdf";
import { formatearFechaCorta } from "../../utils/formatDateUtils";

// Ticket asistencial en hoja A4: solo los datos del formulario de Registro de Ticket 

// Logo horizontal (POLICLÍNICO HORIZONTE MEDIC / Cuidamos tu Salud!), 3517x1260px, el mismo del ticket.
const LOGO_URL = "/img/logo-color_nuevocreado.png";
const LOGO_RATIO = 3517 / 1260;

// Mismos datos de empresa/sede que el encabezado de TicketVenta.jsx.
const RAZON_SOCIAL = "CORPORACIÓN PERUANA DE CENTROS MÉDICOS S.A.C.";
const RUC = "20477167561";
const DIRECCION_SEDE = "Jr. Leoncio Prado N°786 - Huamachuco";
const CONTACTO_SEDE = "Telf: 044-348070 · Cel: 990094744-969603777";
const WEB_SEDE = "www.horizontemedic.com";

const NAVY = [35, 50, 69]; // #233245
const ORANGE = [252, 107, 3]; // #fc6b03
const GRIS = [110, 110, 110];

const PAGE_W = 210;
const MARGEN = 20;
const ANCHO_UTIL = PAGE_W - MARGEN * 2;
const GAP_COLUMNAS = 10;
const ANCHO_COLUMNA = (ANCHO_UTIL - GAP_COLUMNAS) / 2;
const X_COLUMNA_2 = MARGEN + ANCHO_COLUMNA + GAP_COLUMNAS;
const GAP_FILAS = 7;

const valor = (v) => String(v ?? "").trim() || "-";

function separador(doc, y) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(MARGEN, y, PAGE_W - MARGEN, y);
    doc.setLineDashPattern([], 0);
}

// Mide un campo (etiqueta arriba, valor debajo) sin dibujarlo: líneas del valor y alto total.
function medirCampo(doc, { texto, ancho, size = 12, bold = false }) {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(size);
    const lineas = doc.splitTextToSize(texto, ancho - 4);
    const interlinea = size * 0.42;
    return { lineas, size, bold, interlinea, alto: 10 + (lineas.length - 1) * interlinea + 1.5 };
}

// Dibuja un campo ya medido: barra de acento naranja a la izquierda, etiqueta pequeña en gris
// (mayúsculas) y el valor debajo.
function dibujarCampo(doc, campo, medida, x, y) {
    doc.setFillColor(...ORANGE);
    doc.rect(x, y, 0.9, medida.alto, "F");

    doc.setFont("helvetica", "bold").setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(campo.etiqueta.toUpperCase(), x + 4, y + 3);

    doc.setFont("helvetica", medida.bold ? "bold" : "normal").setFontSize(medida.size);
    doc.setTextColor(0, 0, 0);
    medida.lineas.forEach((linea, i) => doc.text(linea, x + 4, y + 9.5 + i * medida.interlinea));
}

// Fila de 1 o 2 campos (ancho completo o dos columnas); todos se alinean arriba. Devuelve la Y siguiente.
function fila(doc, campos, y) {
    const completa = campos.length === 1;
    const posiciones = completa ? [MARGEN] : [MARGEN, X_COLUMNA_2];
    const medidas = campos.map((c) =>
        medirCampo(doc, { ...c, ancho: completa ? ANCHO_UTIL : ANCHO_COLUMNA })
    );
    campos.forEach((c, i) => dibujarCampo(doc, c, medidas[i], posiciones[i], y));
    return y + Math.max(...medidas.map((m) => m.alto)) + GAP_FILAS;
}

export default async function TicketAsistencialA4({
    numeroTicket = "",
    numeroHistoriaClinica = "",
    sede = "",
    fecha = "",
    tipoDocumento = "",
    documentoIdentidad = "",
    nombres = "",
    edad = null,
    empresa = "",
    cargo = "",
    area = "",
    medico = "",
} = {}) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const centro = PAGE_W / 2;
    const pageH = doc.internal.pageSize.getHeight();

    let y = 14;

    // ── Logo (siempre Horizonte Medic) ────────────────────────────────────────
    const logoAncho = 85;
    const logoAlto = logoAncho / LOGO_RATIO;
    try {
        doc.addImage(LOGO_URL, "PNG", centro - logoAncho / 2, y, logoAncho, logoAlto);
    } catch {
        // si el logo no carga, el reporte se imprime igual sin él
    }
    y += logoAlto + 8;

    // ── Datos de la empresa / sede ────────────────────────────────────────────
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold").setFontSize(12);
    const razonSocialLineas = doc.splitTextToSize(RAZON_SOCIAL, ANCHO_UTIL);
    doc.text(razonSocialLineas, centro, y, { align: "center" });
    y += razonSocialLineas.length * 5 + 1;

    doc.setFontSize(10);
    doc.text(`RUC: ${RUC}`, centro, y, { align: "center" });
    y += 6;

    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(DIRECCION_SEDE, centro, y, { align: "center" });
    y += 4.8;
    doc.text(CONTACTO_SEDE, centro, y, { align: "center" });
    y += 4.8;
    doc.text(WEB_SEDE, centro, y, { align: "center" });
    y += 9;

    separador(doc, y);
    y += 10;

    // ── Fecha y N° de Ticket (el protagonista del reporte) ────────────────────
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(`Fecha de atención: ${formatearFechaCorta(fecha) || valor(fecha)}`, centro, y, { align: "center" });
    y += 11;

    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("N° DE TICKET", centro, y, { align: "center" });
    y += 24;

    doc.setFont("helvetica", "bold").setFontSize(80);
    doc.setTextColor(...NAVY);
    doc.text(String(numeroTicket || "-"), centro, y, { align: "center" });
    doc.setTextColor(0, 0, 0);
    y += 11;

    separador(doc, y);
    y += 11;

    // ── Datos del formulario ──────────────────────────────────────────────────
    const etiquetaDocumento = /pasaporte/i.test(tipoDocumento) ? "Pasaporte" : valor(tipoDocumento) === "-" ? "Documento" : tipoDocumento;
    const edadTexto = edad !== null && edad !== undefined && edad !== "" ? `${edad} años` : "-";

    y = fila(doc, [{ etiqueta: "Paciente", texto: valor(nombres), size: 14, bold: true }], y);
    y = fila(
        doc,
        [
            { etiqueta: etiquetaDocumento, texto: valor(documentoIdentidad) },
            { etiqueta: "Edad", texto: edadTexto },
        ],
        y
    );
    y = fila(
        doc,
        [
            { etiqueta: "N° Historia Clínica", texto: valor(numeroHistoriaClinica) },
            { etiqueta: "Sede", texto: valor(sede) },
        ],
        y
    );
    y = fila(doc, [{ etiqueta: "Empresa", texto: valor(empresa) }], y);
    y = fila(
        doc,
        [
            { etiqueta: "Cargo", texto: valor(cargo) },
            { etiqueta: "Área", texto: valor(area) },
        ],
        y
    );
    y = fila(doc, [{ etiqueta: "Doctor", texto: valor(medico) }], y);

    // ── Cierre (al pie de la hoja, o a continuación si el contenido llega hasta ahí) ──
    const yCierre = Math.max(y + 2, pageH - 28);
    separador(doc, yCierre);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("HORIZONTE MEDIC", centro, yCierre + 8, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text("cuidamos tu salud", centro, yCierre + 13.5, { align: "center" });

    imprimir(doc);
}

function imprimir(doc) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };
}
