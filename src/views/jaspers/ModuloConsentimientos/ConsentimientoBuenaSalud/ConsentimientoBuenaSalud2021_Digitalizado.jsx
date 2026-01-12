import jsPDF from "jspdf";
import { formatearFechaLargaConDia } from "../../../utils/formatDateUtils.js";
import CabeceraLogo from '../../components/CabeceraLogo.jsx';
import drawColorBox from '../../components/ColorBox.jsx';
import footerTR from '../../components/footerTR.jsx';
import { dibujarFirmas } from "../../../utils/dibujarFirmas.js";

export default async function ConsentimientoBuenaSalud2021_Digitalizado(data = {}) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const margin = 20;
    const pageW = doc.internal.pageSize.getWidth();

    // Función para formatear fecha a DD/MM/YYYY
    const toDDMMYYYY = (fecha) => {
        if (!fecha) return "";
        if (fecha.includes("/")) return fecha; // ya está en formato correcto
        const [anio, mes, dia] = fecha.split("-");
        if (!anio || !mes || !dia) return fecha;
        return `${dia}/${mes}/${anio}`;
    };

    // Función para obtener string de datos
    const obtenerString = (nombre) => {
        return data[nombre] != null ? `${data[nombre]}` : "";
    };

    // Función para convertir a mayúsculas los campos específicos
    const obtenerStringMayus = (nombre) => {
        const valor = data[nombre] != null ? `${data[nombre]}` : "";
        return valor.toUpperCase();
    };

    // Datos reales
    const datosReales = {
        nombre: obtenerStringMayus("nombres"),
        dni: obtenerString("dni"),
        edad: obtenerString("edad"),
        fecha: obtenerString("fecha"),
        codigoSede: obtenerString("codigoSede") || obtenerString("nombreSede") || obtenerString("sedeDescripcion") || "",
    };

    // Header con datos de ficha, sede y fecha
    const drawHeader = async () => {
        const margin = 8;
        let y = 12;

        // === 1) LOGO A LA IZQUIERDA ===
        await CabeceraLogo(doc, { ...data, tieneMembrete: false, yOffset: 12 });

        // === 2) NÚMERO DE FICHA Y SEDE AL COSTADO DEL BLOQUE DE COLOR ===
        const sedeValue = `${data.sedeDescripcion || data.nombreSede || data.codigoSede || ''}`;
        const sedeX = pageW - margin - 20;
        const sedeY = y + 6;
        
        // Número de ficha primero
        const fichaNum = String(data.norden || data.numeroFicha || "");
        const fichaY = sedeY;
        
        // Texto "N° Ficha :" delante del número
        const fichaLabelX = sedeX - 40;
        doc.setFont("helvetica", "normal").setFontSize(9);
        doc.text("N° Ficha :", fichaLabelX - 4, fichaY);
        
        // Número de ficha grande y subrayado
        const fichaNumX = fichaLabelX + doc.getTextWidth("N° Ficha :") + 5;
        doc.setFont("helvetica", "bold").setFontSize(22);
        doc.text(fichaNum, fichaNumX - 4, fichaY);
        
        // Subrayar el número de ficha
        const fichaWidth = doc.getTextWidth(fichaNum);
        doc.setLineWidth(0.3);
        doc.line(fichaNumX - 4, fichaY + 1, fichaNumX - 4 + fichaWidth, fichaY + 1);
        
        // Sede debajo del número de ficha
        const sedeY2 = sedeY + 8;
        doc.setFont("helvetica", "normal").setFontSize(9);
        doc.text(`Sede : ${sedeValue}`, sedeX, sedeY2, { align: "right" });

        // Fecha de examen
        const fechaExamen = toDDMMYYYY(data.fecha || data.fechaExamen || "");
        doc.text(`Fecha de examen: ${fechaExamen}`, sedeX, sedeY2 + 6, { align: "right" });

        // Página
        doc.text("Pag. 01", pageW - 30, 10);

        // === 3) BLOQUE CÓDIGO DE COLOR ===
        drawColorBox(doc, {
            color: data.codigoColor,
            text: data.textoColor,
            x: pageW - 30,
            y: 10,
            size: 22,
            showLine: true,
            fontSize: 30,
            textPosition: 0.9
        });
    };

    // Usar datos reales
    const datosFinales = datosReales;

    // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
    await drawHeader();

        // === 1) TÍTULO PRINCIPAL ===
        const titulo = "Consentimiento de Buena Salud".toUpperCase();

        doc.setFont("helvetica", "bold").setFontSize(16);
        doc.text(titulo, pageW / 2, margin + 25, { align: "center" });

        // Subrayado para el título
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        const tituloWidth = doc.getTextWidth(titulo);
        doc.line((pageW - tituloWidth) / 2, margin + 27, (pageW + tituloWidth) / 2, margin + 27);

        // === 2) PÁRRAFO CON TEXTO EN NEGRITA PARA NOMBRE, DNI Y EDAD ===
        let currentY = margin + 55;
        doc.setFont("helvetica", "normal").setFontSize(11);

        // Texto completo dividido en partes para buena salud
        const textoPartes = [
            { text: "Mediante el presente pongo en conocimiento que Yo, ", bold: false },
            { text: datosFinales.nombre, bold: true },
            { text: " de ", bold: false },
            { text: `${datosFinales.edad} `, bold: true },
            { text: `años de edad`, bold: false },
            { text: ", identificado con DNI: ", bold: false },
            { text: datosFinales.dni, bold: true },
            { text: ", declaro que :", bold: false },
        ];

        // Configuración de formato
        const lineHeight = 5;
        const maxWidth = pageW - 2 * margin;
        let currentX = margin;

        // Función para agregar una línea completa
        const agregarLinea = (texto, esNegrita) => {
            doc.setFont("helvetica", esNegrita ? "bold" : "normal");
            doc.text(texto, currentX, currentY);
            currentX += doc.getTextWidth(texto);
        };

        // Procesar cada parte del texto
        textoPartes.forEach((parte) => {
            const palabras = parte.text.split(" ");
            palabras.forEach((palabra, i) => {
                const palabraConEspacio = i > 0 ? " " + palabra : palabra;
                const anchoPalabra = doc.getTextWidth(palabraConEspacio);

                if (currentX + anchoPalabra <= maxWidth + margin) {
                    // Agregar a la línea actual
                    agregarLinea(palabraConEspacio, parte.bold);
                } else {
                    // Nueva línea
                    currentY += lineHeight;
                    currentX = margin;
                    agregarLinea(palabra, parte.bold);
                }
            });
        });

        // Ajustar posición Y para siguiente sección
        currentY += lineHeight + 5;

        // === 3) CUERPO DEL CONSENTIMIENTO ===
        doc.setFont("helvetica", "normal").setFontSize(11);
        const consentimiento =
            "NO PADEZCO DE ENFERMEDAD ALGUNA, NI PRESENTO SÍNTOMAS DE NINGÚN TIPO, por lo cual me considero una persona completamente SANA.";

        // Usar la posición final del párrafo + espaciado para el cuerpo del consentimiento
        const cuerpoY = currentY + 5;

        // Usar el mismo método simple que en conInformadoOcupacional_Digitalizado.jsx
        doc.text(consentimiento, margin, cuerpoY, {
            maxWidth: pageW - 2 * margin,
            align: "justify",
        });

        // Calcular la posición final del cuerpo del consentimiento (aproximada)
        const cuerpoEndY = cuerpoY + 25; // Espacio aproximado para el texto del consentimiento

        doc.setFont("helvetica", "normal").setFontSize(11);
        doc.text("Por lo que soy responsable de lo anteriormente declarado.", margin, cuerpoEndY + 5);

        // === 4) FECHA Y HORA ===
        const fechaHoraY = cuerpoEndY + 15;
        doc.setFont("helvetica", "normal").setFontSize(11);
        doc.text(`${formatearFechaLargaConDia(datosFinales.fecha)}`, pageW - margin, fechaHoraY, { align: "right" });

        // === 5) FIRMA Y HUELLA DEL PACIENTE (usando dibujarFirmas) ===
        let yPos = fechaHoraY + 45;
        
        // Usar la función dibujarFirmas del utils
        const yPosFinalFirmas = await dibujarFirmas({
            doc,
            datos: data,
            y: yPos,
            pageW: pageW
        });

        // Agregar DNI debajo de la firma y huella
        const centroX = pageW / 2;
        doc.setFont("helvetica", "normal").setFontSize(9);
        doc.text(`DNI: ${datosFinales.dni}`, centroX, yPosFinalFirmas + 1.5, { align: "center" });

        // === 6) FOOTER ===
        footerTR(doc, { footerOffsetY: 8, fontSize: 8 });

        // === 7) Generar blob y abrir en iframe para imprimir automáticamente ===
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
