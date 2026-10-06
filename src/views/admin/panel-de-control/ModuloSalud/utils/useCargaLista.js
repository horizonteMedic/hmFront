import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

// Carga una lista con `cargar()` al montar y cada vez que cambia `clave` (p. ej. el id de la campaña).
// Con `clave` vacía no hay nada que cargar y la lista queda vacía. Expone `recargar` (tras un alta o
// para reintentar) y `fallo`, para no presentar una carga fallida como "no hay datos".
export default function useCargaLista(cargar, clave, mensajeError) {
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(Boolean(clave));
    const [fallo, setFallo] = useState(false);
    const cargarRef = useRef(cargar);

    useEffect(() => {
        cargarRef.current = cargar;
    });

    const recargar = useCallback(async () => {
        if (!clave) {
            setLista([]);
            setFallo(false);
            setCargando(false);
            return;
        }
        setCargando(true);
        setFallo(false);
        try {
            setLista(await cargarRef.current());
        } catch (error) {
            console.error(error);
            setLista([]);
            setFallo(true);
            Swal.fire("Error", mensajeError, "error");
        } finally {
            setCargando(false);
        }
    }, [clave, mensajeError]);

    useEffect(() => {
        recargar();
    }, [recargar]);

    return { lista, cargando, fallo, recargar };
}
