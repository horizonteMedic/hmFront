import { addYears, format, parse } from "date-fns";

export function fixEncodingModern(str) {
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

export function convertirGenero(genero) { // Convierte F/M a Femenino/Masculino
    if (!genero) return "";
    const generoUpper = String(genero).toUpperCase().trim();
    switch (generoUpper) {
        case 'F':
            return 'Femenino';
        case 'M':
            return 'Masculino';
        default:
            return genero; // Retorna el valor original si no es F o M
    }
}

