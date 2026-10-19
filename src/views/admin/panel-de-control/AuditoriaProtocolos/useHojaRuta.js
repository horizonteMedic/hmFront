import { useCallback, useState } from "react";
import { ErrorBusqueda, getHojaRuta } from "./controllerAuditoriaProtocolos";

const ESTADO_INICIAL = { hoja: null, cargando: false, error: "" };

// Consulta la hoja de ruta de una orden. El buscador no deja lanzar otra mientras `cargando`.
export default function useHojaRuta(token) {
    const [estado, setEstado] = useState(ESTADO_INICIAL);

    const buscar = useCallback(
        async (orden) => {
            setEstado({ ...ESTADO_INICIAL, cargando: true });
            try {
                setEstado({ ...ESTADO_INICIAL, hoja: await getHojaRuta(orden, token) });
            } catch (error) {
                console.error(error);
                const mensaje =
                    error instanceof ErrorBusqueda
                        ? error.message
                        : "No se pudo consultar la orden. Revisa tu conexión e inténtalo de nuevo.";
                setEstado({ ...ESTADO_INICIAL, error: mensaje });
            }
        },
        [token]
    );

    // Vuelve a pedir la orden abierta sin vaciar la pantalla (p. ej. tras registrar un examen).
    // Si mientras tanto se buscó otra orden, la respuesta se descarta.
    const refrescar = useCallback(
        async (orden) => {
            try {
                const hoja = await getHojaRuta(orden, token);
                setEstado((actual) => (actual.hoja?.orden === hoja.orden ? { ...actual, hoja } : actual));
            } catch (error) {
                console.error(error);
            }
        },
        [token]
    );

    return { ...estado, buscar, refrescar };
}
