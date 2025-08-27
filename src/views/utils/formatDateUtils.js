import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

export function formatearFechaCorta(fechaStr) {//INPUT 2025-01-28 //OUTPUT 28/01/2025
    return fechaStr ? format(parse(fechaStr, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : "";
}
export function formatearFechaLarga(fechaStr) {//INPUT 2025-01-28 //OUTPUT 28 de enero de 2025
    return fechaStr
        ? format(new Date(fechaStr + "T00:00:00"), "d 'de' MMMM 'de' yyyy", { locale: es })
        : "";
}