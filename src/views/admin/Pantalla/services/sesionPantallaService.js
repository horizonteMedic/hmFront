import { URLAzure } from "../../../config/config";
import { USUARIO_PANTALLA } from "../config/usuarioPantalla";

const URL_LOGIN = "/api/v01/st/auth/login";

/** Inicia sesión con el usuario de servicio de la pantalla y devuelve el token. */
export const loginPantalla = async (signal) => {
    const res = await fetch(`${URLAzure}${URL_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(USUARIO_PANTALLA),
        signal,
    });

    // `esLogin` distingue "credenciales/permiso rechazado" de "sin conexión" (que lanza fetch).
    if (!res.ok) throw Object.assign(new Error("No se pudo iniciar sesión"), { esLogin: true, status: res.status });

    const { mensaje: token } = await res.json();
    if (!token) throw Object.assign(new Error("Respuesta de login sin token"), { esLogin: true });
    return token;
};
