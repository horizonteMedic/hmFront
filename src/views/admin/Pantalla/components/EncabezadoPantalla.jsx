import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";
import { useReloj } from "../hooks/useReloj";
import { useEffect, useState } from "react";

const IDLE_MS = 3000;

const formatoHora = new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});
const formatoFecha = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
});

/** Oculta el botón tras unos segundos sin mover el mouse cuando se está en pantalla completa. */
function useControlesVisibles(activo) {
    const [visibles, setVisibles] = useState(true);

    useEffect(() => {
        if (!activo) {
            setVisibles(true);
            return;
        }
        let timer;
        const mostrar = () => {
            setVisibles(true);
            clearTimeout(timer);
            timer = setTimeout(() => setVisibles(false), IDLE_MS);
        };
        mostrar();
        window.addEventListener("mousemove", mostrar);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", mostrar);
        };
    }, [activo]);

    return visibles;
}

const EncabezadoPantalla = ({ esPantallaCompleta, onAlternarPantallaCompleta }) => {
    const ahora = useReloj();
    const controlesVisibles = useControlesVisibles(esPantallaCompleta);

    return (
        <header className="relative flex h-[136px] shrink-0 items-center justify-between bg-white px-12 shadow-lg">
            <img
                src="/img/logo-color.png"
                alt="Policlínico Horizonte Medic"
                className="h-[104px] w-auto object-contain"
            />

            <div className="text-center">
                <h1 className="text-[46px] font-extrabold leading-none tracking-wide text-[#0e4d8c]">
                    PACIENTES EN ATENCIÓN
                </h1>
                <p className="mt-2 text-[22px] font-medium text-[#ee6f1e]">
                    Siga el avance de sus exámenes en esta pantalla
                </p>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="text-[58px] font-bold leading-none tabular-nums text-[#0e4d8c]">
                        {formatoHora.format(ahora)}
                    </p>
                    <p className="mt-1 text-[20px] font-medium capitalize text-gray-500">
                        {formatoFecha.format(ahora)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAlternarPantallaCompleta}
                    title={esPantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
                    aria-label={esPantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-[#0e4d8c] text-[24px] text-white transition-opacity duration-500 hover:bg-[#0b3d70] ${
                        controlesVisibles ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                >
                    <FontAwesomeIcon icon={esPantallaCompleta ? faCompress : faExpand} />
                </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[6px] bg-gradient-to-r from-[#ee6f1e] via-[#f59e0b] to-[#0e4d8c]" />
        </header>
    );
};

export default EncabezadoPantalla;
