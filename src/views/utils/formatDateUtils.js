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

export function formatearFechaHora(fechaStr) {
    // INPUT:  "2026-07-18T09:32:15" | "2026-07-18 09:32:15" | Date
    // OUTPUT: "18/07/2026 09:32:15"  (vacío si no hay valor / es inválido)
    if (!fechaStr) return "";
    const fecha = fechaStr instanceof Date ? fechaStr : new Date(fechaStr);
    if (isNaN(fecha.getTime())) return "";
    return format(fecha, "dd/MM/yyyy HH:mm:ss");
}

export function formatearHora(horaStr) {
    // INPUT: "16:57:08.318"
    // OUTPUT: "16:57"

    if (!horaStr) return "";

    try {
        const horaLimpia = String(horaStr).split(".")[0];

        const partes = horaLimpia.split(":");

        if (partes.length < 2) return "";

        const [hora, minutos] = partes;

        return `${hora}:${minutos}`;
    } catch (error) {
        console.warn("Error formateando hora:", horaStr, error);
        return "";
    }
}