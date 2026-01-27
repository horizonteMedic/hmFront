import { addYears, format, parse } from "date-fns";
import { PDFDocument } from "pdf-lib";

export function fixEncodingModern(str) {
    if (!str) return "";
    const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0)));
    return new TextDecoder("utf-8").decode(bytes);
}
export function getToday() {
    return format(new Date(), "yyyy-MM-dd");
}
export function getTodayPlusOneYear() {
    return format(addYears(new Date(), 1), "yyyy-MM-dd");
}
export function getDatePlusOneYear(fechaStr) {//INPUT 2025-01-28 //OUTPUT 2026-01-28
    return fechaStr ? format(addYears(parse(fechaStr, "yyyy-MM-dd", new Date()), 1), "yyyy-MM-dd") : "";
}
/**
 * Comprime una imagen para reducir el tamaño del PDF
 * @param {string} imageUrl - URL de la imagen a comprimir
 * @param {number} quality - Calidad de compresión (0-1), default 0.6
 * @param {number} maxWidth - Ancho máximo en píxeles, default 800
 * @returns {Promise<string>} - Data URL de la imagen comprimida
 */
export async function compressImage(imageUrl, quality = 0.6, maxWidth = 800) {
    if (!imageUrl || imageUrl === "Sin registro") return "";

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            // Calcular nuevas dimensiones manteniendo aspect ratio
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            // Crear canvas para comprimir
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            // Rellenar fondo blanco (para evitar que transparencia se vuelva negra en JPEG)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a JPEG comprimido
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
        };

        img.onerror = () => {
            console.warn(`No se pudo comprimir la imagen: ${imageUrl}`);
            resolve(imageUrl); // Retornar original si falla
        };

        img.src = imageUrl;
    });
}

/**
 * Obtiene y comprime automáticamente una firma/sello
 * @param {object} data - Objeto con datos de digitalización
 * @param {string} name - Nombre de la digitalización (HUELLA, FIRMAP, SELLOFIRMA, etc)
 * @param {boolean} compress - Si debe comprimir la imagen, default true
 * @returns {Promise<string>|string} - URL o Data URL comprimida
 */
export async function getSignCompressed(data, name, compress = true) {
    const url = getSign(data, name);
    if (!url || !compress) return url;
    return await compressImage(url);
}

export function getSign(data, name) { //HUELLA // FIRMAP // SELLOFIRMA
    return data.digitalizacion?.find(
        item => item.nombreDigitalizacion === name
    )?.url ?? ""
}
export function getHoraActual() { //devuelve la hora con el formato correcto para guardar 09:05:08
    return new Date().toLocaleTimeString('es-PE', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function clearLocalStorageExceptAuth() { // Limpia localStorage excepto la llave 'auth'
    try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key !== 'auth') {
                localStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
    }
}

export function convertirGenero(genero) { // Convierte F/M a FEMENINO/MASCULINO
    if (!genero) return "";
    const generoUpper = String(genero).toUpperCase().trim();
    switch (generoUpper) {
        case 'F':
            return 'FEMENINO';
        case 'M':
            return 'MASCULINO';
        default:
            return String(genero).toUpperCase(); // Retorna el valor en mayúsculas si no es F o M
    }
}

export function formatearTextoATitulo(texto) {
    // Convierte texto a formato título: Primera letra mayúscula, resto minúsculas
    // Ejemplo: "HOLA BUENOS DIAS" -> "Hola Buenos Dias"
    if (!texto || typeof texto !== 'string') return texto;

    return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}
//con la imagen en url
export async function colocarSellosEnPdf(pdfBytes, sellos, coordenadas) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const page = pages[pages.length - 1]; // 👈 última página

    const { height } = page.getSize();

    for (const key of Object.keys(sellos)) {
        const url = sellos[key];
        const coord = coordenadas[key];

        if (!coord || !esUrlImagenValida(url)) {
            console.warn(`Sello omitido: ${key}`, url);
            continue;
        }

        const imgBytes = await fetchImageBytes(url);

        const image =
            url.toLowerCase().endsWith(".png") || url.toLowerCase().endsWith(".jpeg")
                ? await pdfDoc.embedJpg(imgBytes)
                : await pdfDoc.embedPng(imgBytes);

        page.drawImage(image, {
            x: coord.x,
            y: height - coord.y - coord.height, // 👈 conversión PDF
            width: coord.width,
            height: coord.height,
        });
    }

    return await pdfDoc.save();
}

function esUrlImagenValida(url) {
    if (!url || typeof url !== "string") return false;
    if (url === "Sin registro") return false;

    return /\.(png|jpg|jpeg)$/i.test(url.split("?")[0]);
}

export function uint8ToBase64(uint8Array) {
    let binary = '';
    const chunkSize = 0x8000; // 32 KB

    for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const subarray = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, subarray);
    }

    return btoa(binary);
}

export async function fetchImageBytes(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo descargar imagen");
    return new Uint8Array(await response.arrayBuffer());
}

/**
 * Optimiza un PDF reduciendo su tamaño mediante compresión
 * @param {Uint8Array} pdfBytes - Array de bytes del PDF original
 * @returns {Promise<Uint8Array>} - Array de bytes del PDF optimizado
 */
export async function optimizePdf(pdfBytes) {
    try {
        const pdfDoc = await PDFDocument.load(pdfBytes, {
            ignoreEncryption: true,
            updateMetadata: false
        });

        // Guardar el PDF con opciones de optimización
        const optimizedPdfBytes = await pdfDoc.save({
            useObjectStreams: true,  // Comprime estructuras internas
            addDefaultPage: false,
            objectsPerTick: 50
        });

        return optimizedPdfBytes;
    } catch (error) {
        console.error("Error optimizando PDF:", error);
        return pdfBytes; // Retornar original si falla la optimización
    }
}

export async function imagenToPdf(file) {
    const imgBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.create();
    let img;

    if (file.type === "image/png") {
        img = await pdfDoc.embedPng(imgBytes);
    } else {
        img = await pdfDoc.embedJpg(imgBytes);
    }

    const { width, height } = img.scale(1);
    const page = pdfDoc.addPage([width, height]);

    page.drawImage(img, {
        x: 0,
        y: 0,
        width,
        height,
    });

    return await pdfDoc.save();
}

export async function imagenToPdfA4(file) {
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    const imgBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.create();

    let img;
    if (file.type === "image/png") {
        img = await pdfDoc.embedPng(imgBytes);
    } else {
        img = await pdfDoc.embedJpg(imgBytes);
    }

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    // Medidas originales de la imagen
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Margen de seguridad
    const margin = 40;
    const maxW = A4_WIDTH - margin * 2;
    const maxH = A4_HEIGHT - margin * 2;

    // Escala manteniendo proporción
    const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Centrado
    const x = (A4_WIDTH - drawWidth) / 2;
    const y = (A4_HEIGHT - drawHeight) / 2;

    page.drawImage(img, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
    });

    return await pdfDoc.save();
}
