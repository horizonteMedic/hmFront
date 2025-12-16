import { addYears, format, parse } from "date-fns";

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

