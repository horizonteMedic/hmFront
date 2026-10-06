import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Caja de búsqueda con lupa. Controlada: `onChange` recibe el texto, no el evento.
export default function BuscadorTexto({ value, onChange, placeholder, className = "" }) {
    return (
        <label className={`relative block w-full ${className}`}>
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 focus:border-primario focus:outline-none"
            />
        </label>
    );
}
