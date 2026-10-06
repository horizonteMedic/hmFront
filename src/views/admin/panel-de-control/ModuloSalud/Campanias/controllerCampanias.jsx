import { URLAzure } from "../../../../config/config";
import { errorDeRespuesta, getLista, postJson } from "../utils/apiSalud";

const URL_CAMPANIAS = "/api/campanias";
const URL_IMAGENES_EMPRESA = "/api/imagenes-empresa";

export const getCampanias = async (token) => {
    const campanias = await getLista(URL_CAMPANIAS, token, "No se pudo cargar la lista de campañas");
    return campanias.sort((a, b) => b.id - a.id); // la última registrada primero
};

// Paso 1 del alta con foto: sube la imagen (multipart). Devuelve el registro creado;
// su `id` se manda después como `imagenEmpresaId`.
export const subirImagenEmpresa = async ({ archivo, nombre, empresa }, token, usuarioRegistro) => {
    const params = new URLSearchParams({ nombre, empresa: empresa ?? "", usuarioRegistro });
    const formData = new FormData();
    formData.append("archivo", archivo);

    const res = await fetch(`${URLAzure}${URL_IMAGENES_EMPRESA}?${params}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) throw await errorDeRespuesta(res, "No se pudo subir la foto de la campaña");

    const imagen = await res.json();
    // Sin id la campaña se crearía sin foto en silencio
    if (!imagen?.id) throw new Error("El servidor no devolvió el id de la imagen subida");
    return imagen;
};

// Paso 2: crea la campaña. `empresa` e `imagenEmpresaId` son opcionales y no se envían si no hay valor.
export const crearCampania = ({ codigo, nombre, fechaCampania, empresa, imagenEmpresaId }, token, usuarioRegistro) =>
    postJson(
        URL_CAMPANIAS,
        {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            fechaCampania,
            usuarioRegistro,
            ...(empresa?.trim() && { empresa: empresa.trim() }),
            ...(imagenEmpresaId && { imagenEmpresaId }),
        },
        token,
        "No se pudo registrar la campaña"
    );

// Forma en que la campaña activa se guarda en la sesión (useAuthStore).
// `urlRuta` es un alias de `fotoUrl` que solo lee el módulo Configuración (se eliminará).
export const toCampaniaActiva = ({ id, codigo, nombre, empresa, fechaCampania, fotoUrl }) => ({
    id,
    codigo,
    nombre,
    empresa,
    fechaCampania,
    fotoUrl,
    urlRuta: fotoUrl,
});
