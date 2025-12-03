import jsPDF from "jspdf";
import CabeceraLogo from '../components/CabeceraLogo.jsx';
import drawColorBox from '../components/ColorBox.jsx';
import { formatearFechaCorta } from "../../utils/formatDateUtils.js";
import footerTR from "../components/footerTR.jsx";

export default function ReporteTriaje(datos) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();

    // === ANCHO DE TABLA REDUCIDO ===
    const tablaInicioX = 10;               // aumentamos un poco el margen izquierdo
    const tablaAncho = 190;                // ← ¡AQUÍ EL NUEVO ANCHO!

    // === HEADER ===
    const drawHeader = () => {
        CabeceraLogo(doc, { tieneMembrete: false, yOffset: 12 });

        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Nro de ficha: ", pageW - 80, 15);
        doc.setFont("helvetica", "normal").setFontSize(18);
        doc.text(String(datos.n_orden || ""), pageW - 60, 16);

        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Sede: " + (datos.sede || ""), pageW - 80, 20);
        doc.text("Fecha de examen: " + formatearFechaCorta(datos.fecha_triaje || ""), pageW - 80, 25);

         drawColorBox(doc, {
            color: datos.codigoColor,
            text: datos.textoColor,
            x: pageW - 30,
            y: 10,
            size: 22,
            showLine: true,
            fontSize: 30,
            textPosition: 0.9
        });

        doc.setFont("helvetica", "normal").setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("INFORME TRIAJE", pageW / 2, 45, { align: "center" });
    };

    drawHeader();

    // === FUNCIONES AUXILIARES ===
    const dibujarHeaderSeccion = (titulo, yPos, alturaHeader = 5) => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);

        // Fondo gris
        doc.setFillColor(196, 196, 196);
        doc.rect(tablaInicioX, yPos, tablaAncho, alturaHeader, 'F');

        // Bordes
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaHeader);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaHeader);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
        doc.line(tablaInicioX, yPos + alturaHeader, tablaInicioX + tablaAncho, yPos + alturaHeader);

        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text(titulo, tablaInicioX + 2, yPos + 3.5);

        return yPos + alturaHeader;
    };

    let yPos = 50;
    const filaAltura = 5;

    // === SECCIÓN 1: DATOS PERSONALES ===
    yPos = dibujarHeaderSeccion("1. DATOS PERSONALES", yPos, filaAltura);

    // Apellidos y Nombres
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const textoY = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Apellidos y Nombres:", tablaInicioX + 2, textoY);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const nombresCompletos = ((datos.nombres || '') + ' ' + (datos.apellidos || '')).trim();
    if (nombresCompletos) {
        const lineasNombres = doc.splitTextToSize(nombresCompletos.toUpperCase(), tablaAncho - 50);
        doc.text(lineasNombres, tablaInicioX + 40, textoY);
    }
    yPos += filaAltura;

    // Edad, Sexo, Fecha Nac.
    doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
    doc.line(tablaInicioX + 60, yPos, tablaInicioX + 60, yPos + filaAltura);
    doc.line(tablaInicioX + 120, yPos, tablaInicioX + 120, yPos + filaAltura);
    doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
    doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
    doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

    const textoY2 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Edad:", tablaInicioX + 2, textoY2);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(datos.edad ? `${datos.edad} AÑOS` : "", tablaInicioX + 15, textoY2);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Género:", tablaInicioX + 62, textoY2);
    doc.setFont("helvetica", "normal").setFontSize(8);
    const sexoText = datos.sexo_pa === "M" ? "MASCULINO" : datos.sexo_pa === "F" ? "FEMENINO" : "";
    doc.text(sexoText, tablaInicioX + 78, textoY2);

    doc.setFont("helvetica", "bold").setFontSize(8);
    doc.text("Fecha Nac.:", tablaInicioX + 122, textoY2);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text(formatearFechaCorta(datos.fecha_nac || ""), tablaInicioX + 140, textoY2);
    yPos += filaAltura;

    // Empresa (opcional)
    if (datos.razon_empresa) {
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
        doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

        const textoY3 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text("Empresa:", tablaInicioX + 2, textoY3);
        doc.setFont("helvetica", "normal").setFontSize(8);
        const lineasEmpresa = doc.splitTextToSize(datos.razon_empresa.toUpperCase(), tablaAncho - 30);
        doc.text(lineasEmpresa, tablaInicioX + 24, textoY3);
        yPos += filaAltura;
    }

    // Contratista (opcional)
    if (datos.razon_contrata && datos.razon_contrata !== "N/A") {
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
        doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

        const textoY4 = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text("Contratista:", tablaInicioX + 2, textoY4);
        doc.setFont("helvetica", "normal").setFontSize(8);
        const lineasContrata = doc.splitTextToSize(datos.razon_contrata.toUpperCase(), tablaAncho - 30);
        doc.text(lineasContrata, tablaInicioX + 24, textoY4);
        yPos += filaAltura;
    }

    // === SECCIÓN 2: SIGNOS VITALES ===
    yPos = dibujarHeaderSeccion("2. SIGNOS VITALES", yPos, 5);

    const dibujarFilaSignoVital = (label, valor) => {
        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + filaAltura);
        doc.line(tablaInicioX + 80, yPos, tablaInicioX + 80, yPos + filaAltura);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + filaAltura);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
        doc.line(tablaInicioX, yPos + filaAltura, tablaInicioX + tablaAncho, yPos + filaAltura);

        const textoY = yPos + (filaAltura / 2) + (8 * 0.35) / 2;
        doc.setFont("helvetica", "bold").setFontSize(8);
        doc.text(label + ":", tablaInicioX + 2, textoY);
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text(valor || "", tablaInicioX + 85, textoY);

        yPos += filaAltura;
    };

    dibujarFilaSignoVital("Talla", datos.talla ? `${datos.talla} cm` : "");
    dibujarFilaSignoVital("Peso", datos.peso ? `${datos.peso} kg` : "");
    dibujarFilaSignoVital("IMC", datos.imc ? `${datos.imc} kg/m²` : "");
    dibujarFilaSignoVital("ICC", datos.icc ? `${datos.icc}` : "");
    dibujarFilaSignoVital("Perímetro Cuello", datos.perimetro_cuello ? `${datos.perimetro_cuello} cm` : "");
    dibujarFilaSignoVital("Cintura", datos.cintura ? `${datos.cintura} cm` : "");
    dibujarFilaSignoVital("Cadera", datos.cadera ? `${datos.cadera} cm` : "");
    dibujarFilaSignoVital("Temperatura", datos.temperatura ? `${datos.temperatura} °C` : "");
    dibujarFilaSignoVital("Frecuencia Cardiaca", datos.f_cardiaca ? `${datos.f_cardiaca} x'` : "");
    dibujarFilaSignoVital("SatO2", datos.sat_02 ? `${datos.sat_02} %` : "");
    dibujarFilaSignoVital("Sistólica", datos.sistolica ? `${datos.sistolica} mmHg` : "");
    dibujarFilaSignoVital("Diastólica", datos.diastolica ? `${datos.diastolica} mmHg` : "");
    dibujarFilaSignoVital("Frec. Respiratoria", datos.f_respiratoria ? `${datos.f_respiratoria} x'` : "");

    // === SECCIÓN 3: OBSERVACIONES ===
    if (datos.conclusion) {
        yPos = dibujarHeaderSeccion("3. OBSERVACIONES", yPos, 5);

        const alturaMinima = 50;
        const calcularAlturaOBS = (texto) => {
            if (!texto) return alturaMinima;
            doc.setFont("helvetica", "normal").setFontSize(8);
            const lineas = doc.splitTextToSize(texto, tablaAncho - 8);
            return Math.max(alturaMinima, lineas.length * 3.5 + 6);
        };

        const alturaObservaciones = calcularAlturaOBS(datos.conclusion);

        doc.line(tablaInicioX, yPos, tablaInicioX, yPos + alturaObservaciones);
        doc.line(tablaInicioX + tablaAncho, yPos, tablaInicioX + tablaAncho, yPos + alturaObservaciones);
        doc.line(tablaInicioX, yPos, tablaInicioX + tablaAncho, yPos);
        doc.line(tablaInicioX, yPos + alturaObservaciones, tablaInicioX + tablaAncho, yPos + alturaObservaciones);

        doc.setFont("helvetica", "normal").setFontSize(8);
        const lineasObs = doc.splitTextToSize(datos.conclusion, tablaAncho - 8);
        doc.text(lineasObs, tablaInicioX + 4, yPos + 5);

        yPos += alturaObservaciones;
    }

    // === FOOTER ===
    footerTR(doc, datos);

    // === Imprimir ===
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };
}