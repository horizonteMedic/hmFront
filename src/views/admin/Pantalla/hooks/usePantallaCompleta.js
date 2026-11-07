import { useCallback, useEffect, useState } from "react";

const CLAVE_PANTALLA_COMPLETA = "pantalla_pacientes_fullscreen";

const leerPreferencia = () => {
    try {
        return localStorage.getItem(CLAVE_PANTALLA_COMPLETA) === "1";
    } catch {
        return false;
    }
};

const guardarPreferencia = (activa) => {
    try {
        if (activa) localStorage.setItem(CLAVE_PANTALLA_COMPLETA, "1");
        else localStorage.removeItem(CLAVE_PANTALLA_COMPLETA);
    } catch {
        // Sin storage: simplemente no se recuerda.
    }
};

const entrar = () => document.documentElement.requestFullscreen().catch(() => {});

/**
 * Controla el modo pantalla completa del navegador (oculta pestañas y barra de direcciones).
 * Escucha `fullscreenchange` para reflejar también la salida con la tecla Esc.
 *
 * Recuerda la preferencia: al recargar (p. ej. por una actualización de versión) el navegador
 * sale de pantalla completa y solo permite volver a entrar con un gesto del usuario. Por eso se
 * intenta entrar al montar y, si el navegador lo rechaza, en el primer clic o tecla.
 */
export function usePantallaCompleta() {
    const [esPantallaCompleta, setEsPantallaCompleta] = useState(
        () => !!document.fullscreenElement
    );

    useEffect(() => {
        let recargando = false;
        const marcarRecarga = () => { recargando = true; };
        window.addEventListener("beforeunload", marcarRecarga);
        window.addEventListener("pagehide", marcarRecarga);

        const sincronizar = () => {
            const activa = !!document.fullscreenElement;
            setEsPantallaCompleta(activa);
            // Salir por Esc/botón borra la preferencia; salir por recarga la conserva.
            if (activa) guardarPreferencia(true);
            else if (!recargando) guardarPreferencia(false);
        };
        document.addEventListener("fullscreenchange", sincronizar);

        // Restaurar tras recarga: intento directo y, si falla, con el primer gesto del usuario.
        const reintentar = () => {
            if (leerPreferencia() && !document.fullscreenElement) entrar();
        };
        const alPrimerGesto = () => {
            reintentar();
            if (document.fullscreenElement) quitarGestos();
        };
        const quitarGestos = () => {
            document.removeEventListener("pointerdown", alPrimerGesto);
            document.removeEventListener("keydown", alPrimerGesto);
        };
        if (leerPreferencia() && !document.fullscreenElement) {
            reintentar();
            document.addEventListener("pointerdown", alPrimerGesto);
            document.addEventListener("keydown", alPrimerGesto);
        }

        return () => {
            window.removeEventListener("beforeunload", marcarRecarga);
            window.removeEventListener("pagehide", marcarRecarga);
            document.removeEventListener("fullscreenchange", sincronizar);
            quitarGestos();
        };
    }, []);

    const alternar = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                guardarPreferencia(false);
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
