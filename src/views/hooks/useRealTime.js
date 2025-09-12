import { useState, useEffect } from 'react';

/**
 * Custom hook para obtener la hora actual en tiempo real
 * @returns {string} hora - La hora actual formateada como string
 */
export default function useRealTime() {
    const [hora, setHora] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalo = setInterval(() => {
            setHora(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(intervalo); // limpiar cuando el componente se desmonte
    }, []);

    return hora;
};
