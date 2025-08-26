import { parse, format } from "date-fns";

export function formatearStringFechaSimple(fechaStr) {
    return fechaStr ? format(parse(fechaStr, "dd-MM-yyyy", new Date()), "dd/MM/yyyy") : "";
}
export function formatearStringFechaSimpleFirstYear(fechaStr) {
    return fechaStr ? format(parse(fechaStr, "yyyy-MM-dd", new Date()), "dd/MM/yyyy") : "";
}