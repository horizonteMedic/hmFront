import { jsPDF } from "jspdf";

// Ticket de atención del Triaje asistencial (ticketera 80 mm). Mismo diseño que el ticket de venta
// (jaspers/TicketAsistencial/TicketVenta.jsx: logo de Horizonte Medic, datos de la empresa, N° de ticket
// grande y footer), pero en vez del detalle de servicios imprime los signos vitales del Triaje. No lleva sede.

const LOGO_URL = "/img/logo-color_nuevocreado.png";
const LOGO_RATIO = 3517 / 1260;

const RAZON_SOCIAL = "CORPORACIÓN PERUANA DE CENTROS MÉDICOS S.A.C.";
const RUC = "20477167561";
const DIRECCION_SEDE = "Jr. Leoncio Prado N°786 - Huamachuco";
const CONTACTO_SEDE = "Telf: 044-348070 · Cel: 990094744-969603777";
const WEB_SEDE = "www.horizontemedic.com";

const ANCHO = 80;
// La ticketera no imprime bien cerca de los bordes izquierdo/derecho.
const MARGEN_LATERAL = 7;
const MARGEN_SUPERIOR = 1.5;
const MARGEN_INFERIOR = 3;
const X_VALOR = MARGEN_LATERAL + 34; // columna donde arrancan todos los valores
const ANCHO_VALOR = ANCHO - X_VALOR - MARGEN_LATERAL;

const texto = (v) => String(v ?? "").trim();
const vacio = (v) => texto(v) === "";

const formatearFecha = (fechaIso) => {
    if (!fechaIso) return new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    const [yyyy, mm, dd] = String(fechaIso).slice(0, 10).split("-");
    if (!dd || !mm || !yyyy) return String(fechaIso);
    return `${dd}/${mm}/${yyyy}`;
};

// horaTicket llega como "HH:mm:ss" o como { hour, minute } según el endpoint.
const formatearHora = (hora) => {
    if (!hora) return "-";
    let h;
    let m;
    if (typeof hora === "object") {
        h = Number(hora.hour ?? 0);
        m = Number(hora.minute ?? 0);
    } else {
        const [hh, mm] = String(hora).split(":");
        h = Number(hh);
        m = Number(mm);
    }
    if (Number.isNaN(h) || Number.isNaN(m)) return String(hora);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

// "Carnet Ext." abreviado a propósito: "Carnet de extranjería:" no cabe en la columna de etiquetas.
const etiquetaTipoDocumento = (tipo) => {
    switch (tipo) {
        case "PASAPORTE": return "Pasaporte";
        case "CARNET_EXTRANJERIA": return "Carnet Ext.";
        case "SIN DNI": return "Documento";
        default: return "DNI";
    }
};

const conUnidad = (valor, unidad) => (vacio(valor) ? "-" : `${texto(valor)} ${unidad}`.trim());

const presionArterial = (sistolica, diastolica) =>
    vacio(sistolica) && vacio(diastolica) ? "-" : `${texto(sistolica) || "-"}/${texto(diastolica) || "-"} mmHg`;

const separador = (doc, y) => {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(MARGEN_LATERAL, y, ANCHO - MARGEN_LATERAL, y);
    doc.setLineDashPattern([], 0);
};

// Dibuja todo el ticket en `doc` y devuelve la Y final. Se ejecuta dos veces: en un doc alto para medir y en el
// doc definitivo, ya con el alto exacto (el rollo de la ticketera no tiene alto fijo).
const dibujar = (doc, d) => {
    let y = MARGEN_SUPERIOR;

    const fila = (etiqueta, valor, { negritaValor = false } = {}) => {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text(etiqueta, MARGEN_LATERAL, y);
        doc.setFont("helvetica", negritaValor ? "bold" : "normal");
        const lineas = doc.splitTextToSize(vacio(valor) ? "-" : texto(valor), ANCHO_VALOR);
        doc.text(lineas, X_VALOR, y);
        y += Math.max(lineas.length * 3.9, 4.6) + 1;
    };

    // Logo
    const logoAncho = 52;
    const logoAlto = logoAncho / LOGO_RATIO;
    try {
        doc.addImage(LOGO_URL, "PNG", (ANCHO - logoAncho) / 2, y, logoAncho, logoAlto);
    } catch {
        /* sin logo: el ticket se imprime igual */
    }
    y += logoAlto + 2;

    // Datos de la empresa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const razon = doc.splitTextToSize(RAZON_SOCIAL, ANCHO - MARGEN_LATERAL * 2);
    doc.text(razon, ANCHO / 2, y, { align: "center" });
    y += razon.length * 3.4 + 1;
    doc.text(`RUC: ${RUC}`, ANCHO / 2, y, { align: "center" });
    y += 3.4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(DIRECCION_SEDE, ANCHO / 2, y, { align: "center" });
    y += 3.2;
    doc.text(CONTACTO_SEDE, ANCHO / 2, y, { align: "center" });
    y += 3.2;
    doc.text(WEB_SEDE, ANCHO / 2, y, { align: "center" });
    y += 5;

    // Título + N° de ticket
    separador(doc, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TICKET DE ATENCIÓN", ANCHO / 2, y, { align: "center" });
    y += 5;
    doc.setFontSize(9);
    doc.text("N° de Ticket", ANCHO / 2, y, { align: "center" });
    y += 10;
    doc.setFontSize(32);
    doc.text(texto(d.numeroTicket) || "-", ANCHO / 2, y, { align: "center" });
    y += 6;
    separador(doc, y);
    y += 5;

    // Paciente y atención
    fila("Paciente:", d.nombres);
    fila(`${etiquetaTipoDocumento(d.tipoDocumento)}:`, d.documentoIdentidad);
    fila("Fecha:", formatearFecha(d.fecha));
    fila("Hora atención:", formatearHora(d.hora));
    fila("Empresa:", d.empresa);
    fila("Cargo:", d.cargo);
    fila("Área:", d.area);
    fila("Doctor:", d.medico);
    y += 1;
    separador(doc, y);
    y += 5;

    // Signos vitales
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SIGNOS VITALES", ANCHO / 2, y, { align: "center" });
    y += 5;
    fila("Saturación:", conUnidad(d.sat02, "%"));
    fila("Temperatura:", conUnidad(d.temperatura, "°C"));
    fila("Frec. cardiaca:", conUnidad(d.fCardiaca, "x'"));
    fila("Frec. respiratoria:", conUnidad(d.fRespiratoria, "x'"));
    fila("Presión arterial:", presionArterial(d.sistolica, d.diastolica));
    fila("Peso:", conUnidad(d.peso, "kg"));
    fila("Talla:", conUnidad(d.talla, "m"));
    y += 1;

    // Footer
    separador(doc, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("HORIZONTE MEDIC", ANCHO / 2, y, { align: "center" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("cuidamos tu salud", ANCHO / 2, y, { align: "center" });

    return y;
};

const imprimir = (doc) => {
    doc.autoPrint();
    const url = URL.createObjectURL(doc.output("blob"));
    const ventana = window.open(url, "_blank");
    if (!ventana) {
        // el navegador bloqueó la pestaña
        const link = document.createElement("a");
        link.href = url;
        link.download = "ticket-atencion.pdf";
        link.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// data: { numeroTicket, nombres, tipoDocumento, documentoIdentidad, fecha, hora, empresa, cargo, area, medico,
//         sat02, temperatura, fCardiaca, fRespiratoria, sistolica, diastolica, peso, talla }
export default async function TicketAtencionTriaje(data = {}) {
    const medidor = new jsPDF({ orientation: "portrait", unit: "mm", format: [ANCHO, 1000] });
    const yFinal = dibujar(medidor, data);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [ANCHO, yFinal + 4 + MARGEN_INFERIOR] });
    dibujar(doc, data);
    imprimir(doc);
}
