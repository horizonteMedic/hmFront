import jsPDF from "jspdf";
import CabeceraLogo from "../../components/CabeceraLogo.jsx";
import footerTR from "../../components/footerTR.jsx";
import drawColorBox from "../../components/ColorBox.jsx";
import { formatearFechaLargaConDia } from "../../../utils/formatDateUtils.js";

export default async function ConsentimientoBuenaSalud2021_Digitalizado(data = {}) {
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const margin = 20;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

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
        await CabeceraLogo(doc, { ...data, tieneMembrete: false });

        // Número de Ficha
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Nro de ficha: ", pageW - 80, 15);
        doc.setFont("helvetica", "normal").setFontSize(18);
        doc.text(String(data.norden || data.numeroFicha || ""), pageW - 50, 16);

        // Sede
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Sede: " + (data.sedeDescripcion || data.nombreSede || data.codigoSede || ""), pageW - 80, 20);

        // Fecha de examen
        const fechaExamen = toDDMMYYYY(data.fecha || data.fechaExamen || "");
        doc.text("Fecha de examen: " + fechaExamen, pageW - 80, 25);

        // Página
        doc.text("Pag. 01", pageW - 30, 10);

        // Bloque de color
        drawColorBox(doc, {
            color: data.codigoColor,
            text: data.textoColor,
            x: pageW - 30,
            y: 10,
            size: 22,
            showLine: true,
            fontSize: 30,
            textPosition: 0.9,
        });
    };

    const sello1 = data.digitalizacion?.find((d) => d.nombreDigitalizacion === "FIRMAP");
    const sello2 = data.digitalizacion?.find((d) => d.nombreDigitalizacion === "HUELLA");
    const isValidUrl = (url) => url && url !== "Sin registro";
    const loadImg = (src) =>
        new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "anonymous";
            img.onload = () => res(img);
            img.onerror = () => rej(`No se pudo cargar ${src}`);
        });

    Promise.all([
        isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
        isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
    ]).then(([s1, s2]) => {
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
            { text: ", declaro que ", bold: false },
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

        // === 5) FOOTER CON FIRMAS ===
        const footerY = pageH - 80;

        // Calcular el ancho total del bloque (huella + espacio + firma)
        const huellaSize = 35;
        const espacioEntre = 40;
        const firmaWidth = 60;
        const anchoTotal = huellaSize + espacioEntre + firmaWidth;

        // Calcular la posición X para centrar el bloque completo
        const bloqueX = (pageW - anchoTotal) / 2;

        // Línea para firma (ahora a la izquierda)
        const firmaX = bloqueX;
        const firmaY = footerY + 7;
        doc.setLineWidth(0.5);
        doc.line(firmaX, firmaY + 12, firmaX + firmaWidth, firmaY + 12);
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text("Firma", firmaX + firmaWidth / 2, firmaY + 20, {
            align: "center",
        });
        doc.text(`DNI: ${datosFinales.dni}`, firmaX + firmaWidth / 2, firmaY + 25, {
            align: "center",
        });

        // Cuadro para huella (ahora a la derecha)
        const huellaX = firmaX + firmaWidth + espacioEntre;
        const huellaY = footerY - 15;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(huellaX, huellaY, huellaSize, huellaSize);
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text("Huella Digital", huellaX + huellaSize / 2, huellaY + huellaSize + 5, {
            align: "center",
        });

        // --- Imagen de huella ---
        if (s2) {
            const canvas = document.createElement("canvas");
            canvas.width = s2.width;
            canvas.height = s2.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(s2, 0, 0);
            const selloBase64 = canvas.toDataURL("image/png");

            // Dimensiones máximas dentro del cuadro de huella
            const maxImgW = huellaSize - 4; // margen interno de 2px por lado
            const maxImgH = huellaSize - 4;

            // Escalar proporcionalmente
            let imgW = s2.width;
            let imgH = s2.height;
            const scale = Math.min(maxImgW / imgW, maxImgH / imgH, 1);
            imgW *= scale;
            imgH *= scale;

            // Centrar dentro del cuadro
            const imgX = huellaX + (huellaSize - imgW) / 2;
            const imgY = huellaY + (huellaSize - imgH) / 2;

            doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
        }

        // --- Imagen de firma ---
        if (s1) {
            const canvas = document.createElement("canvas");
            canvas.width = s1.width;
            canvas.height = s1.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(s1, 0, 0);
            const firmaBase64 = canvas.toDataURL("image/png");

            // Tamaño máximo permitido para la firma
            const maxImgW = firmaWidth - 4; // pequeño margen
            const maxImgH = 35; // altura máxima recomendada

            let imgW = s1.width;
            let imgH = s1.height;
            const scale = Math.min(maxImgW / imgW, maxImgH / imgH, 1);
            imgW *= scale;
            imgH *= scale;

            // Centrar horizontalmente en el área de firma
            const imgX = firmaX + (firmaWidth - imgW) / 2;

            // Colocar justo encima de la línea de firma
            const imgY = firmaY + 12 - imgH - 2;

            doc.addImage(firmaBase64, "PNG", imgX, imgY, imgW, imgH);
        }

        // === 6) FOOTER CON LÍNEA PÚRPURA Y DATOS DE CONTACTO ===
        footerTR(doc, data);

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
    });
}
