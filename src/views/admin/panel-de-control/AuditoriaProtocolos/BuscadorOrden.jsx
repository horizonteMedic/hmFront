import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Caja del número de orden: solo dígitos; se busca con Enter o con el botón.
export default function BuscadorOrden({ onBuscar, cargando }) {
    const [orden, setOrden] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (orden && !cargando) onBuscar(orden);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block w-full sm:max-w-xs">
                <span className="mb-1 block text-sm font-semibold text-gray-700">N° de orden</span>
                <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={orden}
                    onChange={(e) => setOrden(e.target.value.replace(/\D/g, ""))}
                    placeholder="Ej. 1065920"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primario focus:outline-none"
                />
            </label>
            <button
                type="submit"
                disabled={!orden || cargando}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} /> {cargando ? "Buscando..." : "Buscar"}
            </button>
        </form>
    );
}
