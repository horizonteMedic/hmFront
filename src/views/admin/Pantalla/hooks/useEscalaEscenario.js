import { useEffect, useState } from "react";

const calcular = (ancho, alto) =>
    Math.min(window.innerWidth / ancho, window.innerHeight / alto);

/**
 * Factor de escala para que una escena de tamaño fijo (ancho x alto) quepa completa
 * en la ventana. Así la pantalla se ve igual en un TV 1080p, 4K o en un monitor pequeño.
 */
export function useEscalaEscenario(ancho, alto) {
    const [escala, setEscala] = useState(() => calcular(ancho, alto));

    useEffect(() => {
        const actualizar = () => setEscala(calcular(ancho, alto));
        window.addEventListener("resize", actualizar);
        return () => window.removeEventListener("resize", actualizar);
    }, [ancho, alto]);

    return escala;
}
