import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

export function formatearFechaCorta(fechaStr) {//INPUT 2025-01-28 //OUTPUT 28/01/2025
    if (!fechaStr) return "";
    
    // Handle Date objects
    if (fechaStr instanceof Date) {
        if (isNaN(fechaStr.getTime())) return "";
        return format(fechaStr, "dd/MM/yyyy");
    }
    
    // Handle strings
    const fechaStrTrimmed = String(fechaStr).trim();
    if (fechaStrTrimmed === "") return "";
    
    try {
        const parsedDate = parse(fechaStrTrimmed, "yyyy-MM-dd", new Date());
        if (isNaN(parsedDate.getTime())) {
            return "";
        }
        return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
        console.warn("Error formateando fecha:", fechaStr, error);
        return "";
    }
}
export function formatearFechaLarga(fechaStr) {//INPUT 2025-01-28 //OUTPUT 28 de enero de 2025
    return fechaStr
        ? format(new Date(fechaStr + "T00:00:00"), "d 'de' MMMM 'de' yyyy", { locale: es })
        : "";
}

export function formatearFechaLargaConDia(fechaStr) {//INPUT 2025-01-28 //OUTPUT 28 Domingo de enero de 2025
    const resultado = format(
        new Date(fechaStr + "T00:00:00"),
        "EEEE d 'de' MMMM 'de' yyyy",
        { locale: es }
    );
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
}