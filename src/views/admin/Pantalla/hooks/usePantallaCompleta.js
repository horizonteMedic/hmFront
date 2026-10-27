import { useCallback, useEffect, useState } from "react";

/**
 * Controla el modo pantalla completa del navegador (oculta pestañas y barra de direcciones).
 * Escucha `fullscreenchange` para reflejar también la salida con la tecla Esc.
 */
export function usePantallaCompleta() {
    const [esPantallaCompleta, setEsPantallaCompleta] = useState(
        () => !!document.fullscreenElement
    );

    useEffect(() => {
        const sincronizar = () => setEsPantallaCompleta(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", sincronizar);
        return () => document.removeEventListener("fullscreenchange", sincronizar);
    }, []);

    const alternar = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch {
            // El navegador puede rechazar la solicitud (p. ej. sin gesto del usuario); no es crítico.
        }
    }, []);

    return { esPantallaCompleta, alternar };
}
