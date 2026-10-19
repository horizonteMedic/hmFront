import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTableColumns } from "@fortawesome/free-solid-svg-icons";

// Botón con un desplegable de casillas para mostrar u ocultar las columnas de una tabla.
// `columnas` = [{ id, label }], `ocultas` = ids de las columnas ocultas y `onToggle(id)` alterna una.
// Siempre queda al menos una columna visible.
export default function SelectorColumnas({ columnas, ocultas, onToggle, label = "Columnas" }) {
    const [abierto, setAbierto] = useState(false);
    const contenedor = useRef(null);

    // Con el desplegable abierto, un clic fuera de él o la tecla Escape lo cierran.
    useEffect(() => {
        if (!abierto) return;

        const cerrarAlHacerClicFuera = (e) => {
            if (!contenedor.current?.contains(e.target)) setAbierto(false);
        };
        const cerrarConEscape = (e) => {
            if (e.key === "Escape") setAbierto(false);
        };

        document.addEventListener("mousedown", cerrarAlHacerClicFuera);
        document.addEventListener("keydown", cerrarConEscape);
        return () => {
            document.removeEventListener("mousedown", cerrarAlHacerClicFuera);
            document.removeEventListener("keydown", cerrarConEscape);
        };
    }, [abierto]);

    const visibles = columnas.filter((columna) => !ocultas.includes(columna.id)).length;

    return (
        <div ref={contenedor} className="relative">
            <button
                type="button"
                onClick={() => setAbierto((estadoAnterior) => !estadoAnterior)}
                aria-haspopup="true"
                aria-expanded={abierto}
                className="
                    bg-white hover:bg-gray-50 border border-gray-300
                    text-gray-700 px-3 py-1 rounded
                    flex items-center gap-2
                    transition-all duration-150 ease-out
                    active:scale-95"
            >
                <FontAwesomeIcon icon={faTableColumns} /> {label}
                <span className="text-xs text-gray-500">{visibles}/{columnas.length}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-150 ${abierto ? "rotate-180" : ""}`} />
            </button>

            {abierto && (
                <div className="absolute right-0 mt-1 z-30 min-w-[13rem] bg-white border border-gray-300 rounded-md shadow-lg p-2">
                    {columnas.map((columna) => {
                        const marcada = !ocultas.includes(columna.id);
                        return (
                            <label
                                key={columna.id}
                                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 ${marcada && visibles === 1 ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={marcada}
                                    disabled={marcada && visibles === 1}
                                    onChange={() => onToggle(columna.id)}
                                />
                                {columna.label}
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
