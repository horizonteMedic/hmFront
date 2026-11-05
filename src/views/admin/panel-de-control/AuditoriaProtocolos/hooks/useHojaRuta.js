import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { ErrorBusqueda, ErrorSedeIncorrecta, getHojaRuta, validarSedeOrden } from "../services/hojaRutaService";

const ESTADO_INICIAL = { hoja: null, cargando: false, error: "" };

// Mismo popup que muestran los formularios cuando el N° Orden es de otra sede.
const avisarSedeIncorrecta = ({ orden, descripcionSede }, sede) =>
    Swal.fire({
        icon: "warning",
        title: '<i class="fa-solid fa-location-dot"></i>Sede incorrecta',
        html:
            `El N° Orden ${orden} pertenece a la sede${descripcionSede ? `: ${descripcionSede}` : ""}.` +
            (sede?.nombre ? `<br/>Estás trabajando en la sede ${sede.nombre}; cámbiala en el selector de la barra superior.` : ""),
    });

// Consulta la hoja de ruta de una orden. El buscador no deja lanzar otra mientras `cargando`.
export default function useHojaRuta(token) {
    const [estado, setEstado] = useState(ESTADO_INICIAL);

    // `sede` = { codigo, nombre } de la sede del usuario: la orden debe pertenecerle antes de mostrar nada de ella.
    const buscar = useCallback(
        async (orden, sede) => {
            setEstado({ ...ESTADO_INICIAL, cargando: true });
            try {
                await validarSedeOrden(orden, sede?.codigo, token);
                setEstado({ ...ESTADO_INICIAL, hoja: await getHojaRuta(orden, token) });
            } catch (error) {
                if (error instanceof ErrorSedeIncorrecta) {
                    // No es un fallo de la búsqueda: se avisa en popup y la pantalla vuelve a su estado inicial
                    setEstado(ESTADO_INICIAL);
                    avisarSedeIncorrecta(error, sede);
                    return;
                }
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
