// El N° de ticket del sistema asistencial se MUESTRA con una "A-" al inicio (23 -> "A-23"), pero es solo
// estético: el backend, los formularios y las búsquedas siguen usando solo el número.
export const PREFIJO_TICKET_ASISTENCIAL = "A-";

/** 23 -> "A-23". Vacío/nulo -> "" (o `vacio`). Si ya trae el prefijo no lo duplica. */
export const formatearTicketAsistencial = (numero, vacio = "") => {
    if (numero === null || numero === undefined) return vacio;
    const texto = String(numero).trim();
    if (!texto) return vacio;
    return /^A-/i.test(texto) ? texto.toUpperCase() : `${PREFIJO_TICKET_ASISTENCIAL}${texto}`;
};

/** "A-23" / "a23" / "23" -> "23" (para buscar escribiendo solo los números, o pegando el código completo). */
export const soloNumerosTicket = (valor) => String(valor ?? "").replace(/\D/g, "");
