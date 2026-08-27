import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { buscarCie10 } from "./model";

/**
 * Selector múltiple de CIE10. Solo permite seleccionar del catálogo
 * existente (no crea nuevos), usando el mismo endpoint de búsqueda que el
 * formulario de Triaje: GET /api/v01/ct/cie10/buscar?q=
 */
export default function Cie10MultiSelect({
    token,
    selected = [],
    onChange,
    disabled = false,
    label = "CIE10",
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const boxRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await buscarCie10(query.trim(), token);
                setResults(data.slice(0, 15));
            } catch (err) {
                console.error("Cie10MultiSelect: error buscando", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, token]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const isSelected = (cod) => selected.some((s) => s.cod === cod);

    const addItem = (item) => {
        if (isSelected(item.codigo)) return;
        onChange([...selected, { cod: item.codigo, diagnostico: item.descripcion }]);
        setQuery("");
        setResults([]);
        setShowDropdown(false);
    };

    const removeItem = (cod) => {
        onChange(selected.filter((s) => s.cod !== cod));
    };

    const filteredResults = results.filter((r) => !isSelected(r.codigo));

    return (
        <div className="space-y-1" ref={boxRef}>
            {label && <label className="font-semibold block">{label} :</label>}
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Buscar por código o descripción..."
                    className={`border rounded px-2 py-1.5 pl-9 pr-8 w-full ${
                        disabled ? "bg-gray-300" : ""
                    }`}
                />
                {loading && (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="absolute right-3 top-[30%]  text-blue-500 text-sm animate-spin pointer-events-none"
                    />
                )}

                {showDropdown && query.trim().length >= 2 && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {filteredResults.length === 0 && !loading && (
                            <p className="text-sm text-gray-500 px-3 py-2">
                                Sin resultados para "{query.trim()}"
                            </p>
                        )}
                        {filteredResults.map((item) => (
                            <div
                                key={item.codigo}
                                onMouseDown={() => addItem(item)}
                                className="flex items-start gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b last:border-0 border-gray-100"
                            >
                                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                                    {item.codigo}
                                </span>
                                <span className="text-gray-700 leading-snug">{item.descripcion}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selected.length > 0 && (
                <div className="space-y-1 pt-1">
                    {selected.map((item) => (
                        <div
                            key={item.cod}
                            className="flex items-center gap-3 p-1 bg-green-50 border border-green-200 rounded-md"
                        >
                            <span className="text-sm font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded shrink-0">
                                {item.cod}
                            </span>
                            <span className="text-sm text-green-800 flex-1 break-words">
                                {item.diagnostico}
                            </span>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.cod)}
                                    className="text-red-500 hover:text-red-700 shrink-0 pr-2"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
