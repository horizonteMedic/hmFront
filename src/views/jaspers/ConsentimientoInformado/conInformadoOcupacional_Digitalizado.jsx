import jsPDF from "jspdf";
import CabeceraLogo from "../components/CabeceraLogo.jsx";
import footerTR from "../components/footerTR.jsx";
import drawColorBox from "../components/ColorBox.jsx";

export default function conInformadoOcupacional_Digitalizado(data = {}, docExistente = null) {
    const doc = docExistente || new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
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
        ocupacion: obtenerStringMayus("ocupacion"),
        empresa: obtenerStringMayus("empresa"),
        fecha: toDDMMYYYY(obtenerString("fecha")),
        hora: obtenerString("hora"),
    };

    // Header con datos de ficha, sede y fecha
    const drawHeader = () => {
        CabeceraLogo(doc, { ...data, tieneMembrete: false });

        // Número de Ficha
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Nro de ficha: ", pageW - 80, 15);
        doc.setFont("helvetica", "normal").setFontSize(18);
        doc.text(String(data.norden || data.numeroFicha || ""), pageW - 50, 16);

        // Sede
        doc.setFont("helvetica", "normal").setFontSize(8);
        doc.text("Sede: " + (data.sede || data.nombreSede || data.codigoSede || ""), pageW - 80, 20);

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

    return Promise.all([
        isValidUrl(sello1?.url) ? loadImg(sello1.url) : Promise.resolve(null),
        isValidUrl(sello2?.url) ? loadImg(sello2.url) : Promise.resolve(null),
    ]).then(([s1, s2]) => {
        // Usar datos reales
        const datosFinales = datosReales;

        // === 0) HEADER CON LOGO, N° FICHA, SEDE Y BLOQUE DE COLOR ===
        drawHeader();

        // === 1) TÍTULO PRINCIPAL ===
        const titulo1 = "CONSENTIMIENTO INFORMADO PARA AUTORIZAR";
        const titulo2 = "EL EXAMEN MEDICO OCUPACIONAL";

        doc.setFont("helvetica", "bold").setFontSize(16);
        doc.text(titulo1, pageW / 2, margin + 25, { align: "center" });
        doc.text(titulo2, pageW / 2, margin + 35, { align: "center" });

        // Subrayado para los títulos
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        const titulo1Width = doc.getTextWidth(titulo1);
        const titulo2Width = doc.getTextWidth(titulo2);
        doc.line((pageW - titulo1Width) / 2, margin + 27, (pageW + titulo1Width) / 2, margin + 27);
        doc.line((pageW - titulo2Width) / 2, margin + 37, (pageW + titulo2Width) / 2, margin + 37);

        // === 2) PÁRRAFO CON TEXTO EN NEGRITA PARA NOMBRE, DNI Y OCUPACIÓN ===
        let currentY = margin + 55;
        doc.setFont("helvetica", "normal").setFontSize(11);

        // Texto completo dividido en partes
        const textoPartes = [
            { text: "Yo  ", bold: false },
            { text: datosFinales.nombre, bold: true },
            { text: " identificado con documento de identidad ", bold: false },
            { text: `N°: ${datosFinales.dni}`, bold: true },
            { text: " con ocupación laboral ", bold: false },
            { text: datosFinales.ocupacion, bold: true },
            {
                text: " certifico que he sido informado/a acerca de la naturaleza y propósito del examen médico ocupacional así como pruebas complementarias determinada por la empresa:",
                bold: false,
            },
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
        currentY += lineHeight;
        const parrafoEndY = currentY;

        // === 3) NOMBRE DE LA EMPRESA ===
        doc.setFont("helvetica", "bold").setFontSize(12);

        // Calcular el ancho máximo disponible para la empresa
        const maxEmpresaWidth = pageW - 2 * margin - 20;
        const empresaLines = doc.splitTextToSize(datosFinales.empresa, maxEmpresaWidth);

        // Usar la posición final del párrafo + espaciado
        const empresaStartY = parrafoEndY + 5;

        empresaLines.forEach((line, index) => {
            doc.text(line, pageW / 2, empresaStartY + index * 6, { align: "center" });
        });

        // Ajustar la posición Y para la siguiente sección basándose en el número de líneas
        const empresaEndY = empresaStartY + empresaLines.length * 6;

        // === 4) CUERPO DEL CONSENTIMIENTO ===
        doc.setFont("helvetica", "normal").setFontSize(11);
        const consentimiento =
            "De acuerdo a los peligros y riesgos identificados en mi puesto de trabajo. En ese sentido en forma consiente y voluntaria doy mi consentimiento, para que se me realice el examen médico ocupacional de acuerdo a la Resolución ministerial N° 312-2011/MINSA . Y doy fe que la información brindada a HORIZONTE MEDIC es verídica. Así mismo, autorizo a HORIZONTE MEDIC para que brinde mi historia clínica y toda información resultante de mi examen medico ocupacional al Medico Ocupacional de mi empresa para que tenga acceso a mi Historia Clínica de acuerdo a la N.T.N° 022 MINSA/dgsp-V.02 y Ley N° 26842, Ley general de salud.";

        // Usar la posición final de la empresa + espaciado para el cuerpo del consentimiento
        const cuerpoY = empresaEndY + 5;
        doc.text(consentimiento, margin, cuerpoY, { maxWidth: pageW - 2 * margin, align: "justify" });

        // === 5) FOOTER CON FECHA, HORA Y FIRMAS ===
        const footerY = pageH - 80;

        // Calcular el ancho total del bloque (huella + espacio + firma)
        const huellaSize = 35;
        const espacioEntre = 40;
        const firmaWidth = 60;
        const anchoTotal = huellaSize + espacioEntre + firmaWidth;

        // Calcular la posición X para centrar el bloque completo
        const bloqueX = (pageW - anchoTotal) / 2;
        let horaTexto = datosFinales.hora;
        let [hora] = horaTexto.split(":");
        hora = parseInt(hora, 10);

        let sufijo = hora >= 12 ? "PM" : "AM";
        // Fecha y Hora (centradas con la misma separación que huella y firma, 15 puntos más arriba)
        const fechaHoraY = footerY - 30;
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text(`Fecha: ${datosFinales.fecha}`, bloqueX, fechaHoraY);
        doc.text(`Hora: ${datosFinales.hora} ${sufijo}`, bloqueX + huellaSize + espacioEntre + 18, fechaHoraY);

        // Cuadro para huella (más grande)
        const huellaX = bloqueX;
        const huellaY = footerY - 15;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(huellaX, huellaY, huellaSize, huellaSize);
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text("Huella", huellaX + huellaSize / 2, huellaY + huellaSize + 5, { align: "center" });

        if (s2) {
            const canvas = document.createElement("canvas");
            canvas.width = s2.width;
            canvas.height = s2.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(s2, 0, 0);
            const selloBase64 = canvas.toDataURL("image/png");

            // Dimensiones máximas permitidas dentro del cuadro de huella
            const maxImgW = huellaSize - 4;
            const maxImgH = huellaSize - 4;

            // Tamaño real de la imagen
            let imgW = s2.width;
            let imgH = s2.height;

            // Escalado proporcional para que quepa dentro del cuadro
            const scaleW = maxImgW / imgW;
            const scaleH = maxImgH / imgH;
            const scale = Math.min(scaleW, scaleH, 1);

            imgW *= scale;
            imgH *= scale;

            // Posición centrada dentro del cuadro de huella
            const imgX = huellaX + (huellaSize - imgW) / 2;
            const imgY = huellaY + (huellaSize - imgH) / 2;

            doc.addImage(selloBase64, "PNG", imgX, imgY, imgW, imgH);
        }

        // Línea para firma (más cerca del cuadro de huella)
        const firmaX = huellaX + huellaSize + espacioEntre;
        const firmaY = footerY + 7;
        doc.setLineWidth(0.5);
        doc.line(firmaX, firmaY + 12, firmaX + firmaWidth, firmaY + 12);
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text("Firma", firmaX + firmaWidth / 2, firmaY + 20, { align: "center" });
        if (s1) {
            const canvas = document.createElement("canvas");
            canvas.width = s1.width;
            canvas.height = s1.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(s1, 0, 0);
            const firmaBase64 = canvas.toDataURL("image/png");

            // Máximo ancho y alto permitidos para la firma
            const maxImgW = 70;
            const maxImgH = 35;

            let imgW = s1.width;
            let imgH = s1.height;

            const scaleW = maxImgW / imgW;
            const scaleH = maxImgH / imgH;
            const scale = Math.min(scaleW, scaleH, 1);

            imgW *= scale;
            imgH *= scale;

            // Centrar horizontalmente en la línea de firma
            const imgX = firmaX + (firmaWidth - imgW) / 2;

            // Ubicar justo encima de la línea
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
        return doc;
    });
}
