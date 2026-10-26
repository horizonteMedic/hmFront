import { useEffect, useState } from "react";
import { getPacientesPantalla } from "../services/pantallaPacientesService";

const ZONA_HORARIA = "America/Lima";
const UN_DIA_MS = 24 * 60 * 60 * 1000;

// "en-CA" formatea como YYYY-MM-DD, el formato que espera el backend.
const formatoFecha = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA });

// Rango fijo de la pantalla: el día anterior y hoy (hora de Lima).
const rangoFechas = () => {
    const ahora = Date.now();
    return {
        fechaInicio: formatoFecha.format(ahora - UN_DIA_MS),
        fechaFin: formatoFecha.format(ahora),
    };
};

// Primero los que aún tienen exámenes pendientes; dentro de cada grupo, los más recientes arriba.
const ordenar = (pacientes) =>
    [...pacientes].sort(
        (a, b) =>
            Number(a.finalizado) - Number(b.finalizado) ||
            `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`)
    );

/**
 * Carga los pacientes de la pantalla y los refresca cada `intervaloMs`.
 * Ante un fallo conserva la última lista y marca `error`, para que el TV no quede en blanco.
 */
export function usePacientesPantalla({ token, intervaloMs = 30000, habilitado = true }) {
    const [pacientes, setPacientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!habilitado) return;
        const controlador = new AbortController();

        const cargar = async () => {
            try {
                const lista = await getPacientesPantalla(rangoFechas(), token, controlador.signal);
                setPacientes(ordenar(lista));
                setError(null);
            } catch (e) {
                if (e.name === "AbortError") return;
                setError(e.status === 401 || e.status === 403 ? "sesion" : "conexion");
            } finally {
                if (!controlador.signal.aborted) setCargando(false);
            }
        };

        cargar();
        const id = setInterval(cargar, intervaloMs);
        return () => {
            controlador.abort();
            clearInterval(id);
        };
    }, [token, intervaloMs, habilitado]);

    return { pacientes, cargando, error };
}
