import { useEffect, useState } from "react";
import { isTokenExpired } from "../../../../store/auth";
import { INTERVALO_REFRESCO_MS } from "../config/usuarioPantalla";
import { getPacientesPantalla } from "../services/pantallaPacientesService";
import { loginPantalla } from "../services/sesionPantallaService";

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

// Si el token no se puede decodificar se da por válido: el reintento ante un 401 lo cubre.
const tokenVencido = (token) => {
    try {
        return isTokenExpired(token);
    } catch {
        return false;
    }
};

/**
 * Se autentica solo con el usuario de servicio y refresca los pacientes cada `intervaloMs`.
 * Renueva el token cuando vence (o ante un 401/403, con un único reintento) para que la pantalla
 * pueda quedar encendida todo el día. Ante un fallo conserva la última lista y marca `error`.
 */
export function usePacientesPantalla({ intervaloMs = INTERVALO_REFRESCO_MS, habilitado = true } = {}) {
    const [pacientes, setPacientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

    useEffect(() => {
        if (!habilitado) return;
        const controlador = new AbortController();
        const { signal } = controlador;
        let token = null;

        const consultar = async () => {
            if (!token || tokenVencido(token)) token = await loginPantalla(signal);
            try {
                return await getPacientesPantalla(rangoFechas(), token, signal);
            } catch (e) {
                if (e.status !== 401 && e.status !== 403) throw e;
                token = await loginPantalla(signal);
                return getPacientesPantalla(rangoFechas(), token, signal);
            }
        };

        const cargar = async () => {
            try {
                setPacientes(ordenar(await consultar()));
                setUltimaActualizacion(new Date());
                setError(null);
            } catch (e) {
                if (e.name === "AbortError") return;
                token = null;
                setError(e.esLogin || e.status === 401 || e.status === 403 ? "sesion" : "conexion");
            } finally {
                if (!signal.aborted) setCargando(false);
            }
        };

        cargar();
        const id = setInterval(cargar, intervaloMs);
        return () => {
            controlador.abort();
            clearInterval(id);
        };
    }, [intervaloMs, habilitado]);

    return { pacientes, cargando, error, ultimaActualizacion };
}
