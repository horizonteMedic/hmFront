// Descarga de imágenes (firmas, sellos...) para los reportes en Excel y en PDF.

const EXTENSIONES_IMAGEN = { "image/png": "png", "image/jpeg": "jpeg", "image/jpg": "jpeg", "image/gif": "gif" };

// Formato de una imagen según sus primeros bytes (PNG, JPEG o GIF), o null si no es ninguno. El almacenamiento de archivos
// entrega las imágenes como "application/octet-stream", así que el tipo que dice el servidor no sirve para reconocerlas.
const extensionPorContenido = (bytes) => {
    const [a, b, c, d] = bytes;
    if (a === 0x89 && b === 0x50 && c === 0x4e && d === 0x47) return "png";
    if (a === 0xff && b === 0xd8 && c === 0xff) return "jpeg";
    if (a === 0x47 && b === 0x49 && c === 0x46 && d === 0x38) return "gif";
    return null;
};

// Ancho y alto en píxeles leídos de la cabecera de la imagen, o null si no se pueden leer.
const dimensionesDeImagen = (bytes, extension) => {
    if (extension === "png" && bytes.length >= 24) {
        const vista = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return { ancho: vista.getUint32(16), alto: vista.getUint32(20) };
    }
    if (extension === "gif" && bytes.length >= 10) {
        return { ancho: bytes[6] | (bytes[7] << 8), alto: bytes[8] | (bytes[9] << 8) };
    }
    if (extension === "jpeg") {
        // Se recorren los bloques hasta el de inicio de cuadro (SOF), que trae el alto y el ancho.
        let i = 2;
        while (i + 9 < bytes.length) {
            if (bytes[i] !== 0xff) {
                i++;
                continue;
            }
            const marcador = bytes[i + 1];
            const esSof = marcador >= 0xc0 && marcador <= 0xcf && marcador !== 0xc4 && marcador !== 0xc8 && marcador !== 0xcc;
            if (esSof) return { alto: (bytes[i + 5] << 8) | bytes[i + 6], ancho: (bytes[i + 7] << 8) | bytes[i + 8] };
            i += 2 + ((bytes[i + 2] << 8) | bytes[i + 3]);
        }
    }
    return null;
};

// Descarga una imagen (URL o data URL). Devuelve { bytes, extension, ancho, alto } (ancho y alto en píxeles, null si no se
// pudieron leer), o null si no se pudo obtener: sin permiso CORS, enlace caído o un archivo que no es PNG, JPEG ni GIF.
export const descargarImagen = async (url) => {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) return null;

        const bytes = new Uint8Array(await respuesta.arrayBuffer());
        const tipo = String(respuesta.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
        const extension = extensionPorContenido(bytes) ?? EXTENSIONES_IMAGEN[tipo];
        if (!extension) return null;

        const dimensiones = dimensionesDeImagen(bytes, extension);
        return { bytes, extension, ancho: dimensiones?.ancho ?? null, alto: dimensiones?.alto ?? null };
    } catch {
        return null;
    }
};

// Descarga varias imágenes (cada URL una sola vez) de a pocas a la vez; una que falla se vuelve a intentar una vez, por si
// fue un corte momentáneo. Devuelve Map<url, imagen|null>.
export const descargarImagenes = async (urls, simultaneas = 6) => {
    const imagenes = new Map();
    const pendientes = [...new Set(urls)];
    const trabajador = async () => {
        while (pendientes.length > 0) {
            const url = pendientes.shift();
            imagenes.set(url, (await descargarImagen(url)) ?? (await descargarImagen(url)));
        }
    };
    await Promise.all(Array.from({ length: Math.min(simultaneas, pendientes.length) }, trabajador));
    return imagenes;
};

// Tamaño con el que una imagen entra en un cuadro de `maxAncho` x `maxAlto` sin deformarse. Por defecto no se agranda más
// allá de sus píxeles (para medidas en píxeles); con `permitirAgrandar` llena el cuadro (para medidas en otras unidades,
// como los milímetros del PDF). Si no se conocen las medidas de la imagen ocupa el cuadro entero.
export const ajustarAlCuadro = (imagen, maxAncho, maxAlto, permitirAgrandar = false) => {
    if (!imagen?.ancho || !imagen?.alto) return { ancho: maxAncho, alto: maxAlto };
    const escala = Math.min(maxAncho / imagen.ancho, maxAlto / imagen.alto, permitirAgrandar ? Infinity : 1);
    return { ancho: imagen.ancho * escala, alto: imagen.alto * escala };
};
