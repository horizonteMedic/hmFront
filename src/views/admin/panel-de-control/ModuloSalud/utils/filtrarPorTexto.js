// Minúsculas y sin tildes, para comparar textos sin que importe cómo se escribieron.
export const normalizar = (texto) =>
    (texto ?? "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Filtra sin tildes ni mayúsculas: cada palabra escrita debe aparecer en alguno de los
// textos que devuelve `textosDe(item)` (p. ej. (c) => [c.codigo, c.nombre]).
export const filtrarPorTexto = (items, texto, textosDe) => {
    const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
    if (!palabras.length) return items;

    return items.filter((item) => {
        const contenido = normalizar(textosDe(item).filter((t) => t != null).join(" "));
        return palabras.every((palabra) => contenido.includes(palabra));
    });
};
