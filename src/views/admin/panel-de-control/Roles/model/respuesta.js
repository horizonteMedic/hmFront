/**
 * Lee la respuesta de un fetch de los endpoints de roles.
 *  - Tolera cuerpos vacíos (p. ej. un DELETE sin contenido).
 *  - Lanza un Error si el HTTP no es 2xx, para que quien llama pueda avisar del fallo
 *    (antes un 4xx/5xx con cuerpo JSON se tomaba como éxito).
 */
export const leerRespuesta = async (res) => {
  const texto = await res.text();
  let cuerpo = {};
  try {
    cuerpo = texto ? JSON.parse(texto) : {};
  } catch {
    cuerpo = { mensaje: texto };
  }

  if (!res.ok) {
    throw Object.assign(new Error(cuerpo?.mensaje || `Error ${res.status}`), {
      status: res.status,
      cuerpo,
    });
  }
  return cuerpo;
};
