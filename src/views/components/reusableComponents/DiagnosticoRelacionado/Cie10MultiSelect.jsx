import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { buscarCie10 } from "./model";

/**
 * Selector múltiple de CIE10. Solo permite seleccionar del catálogo
 * existente (no crea nuevos), usando el mismo endpoint de búsqueda que el
 * formulario de Triaje: GET /api/v01/ct/cie10/buscar?q=
 *
 * splitLayout=true muestra el buscador a la izquierda y los seleccionados
 * a la derecha (2 columnas); por defecto van apilados.
 * color: "green" | "blue" | "red" tiñe el título y los ítems seleccionados.
 * selectedLabel: título de la columna derecha (por defecto "<label> seleccionados").
 */
const COLOR_STYLES = {
    green: { text: "text-green-700", box: "bg-green-50 border-green-200", badge: "text-green-700 bg-green-100", desc: "text-green-800" },
    blue: { text: "text-sky-700", box: "bg-sky-50 border-sky-200", badge: "text-sky-700 bg-sky-100", desc: "text-sky-800" },
    red: { text: "text-red-700", box: "bg-red-50 border-red-200", badge: "text-red-700 bg-red-100", desc: "text-red-800" },
};

export default function Cie10MultiSelect({
    token,
    selected = [],
    onChange,
    disabled = false,
    label = "CIE10",
    splitLayout = false,
    color = "green",
    selectedLabel,
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const boxRef = useRef(null);

    const c = COLOR_STYLES[color] || COLOR_STYLES.green;
    // El color del título solo se aplica si se pide explícitamente, para no
    // alterar formularios que ya usan este componente sin `color`.
    const titleColor = COLOR_STYLES[color] ? c.text : "";
    const selTitle = selectedLabel || (label ? `${label} seleccionados` : "Seleccionados");

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

    const isSelected = (codigo) => selected.some((s) => s.codigo === codigo);

    const addItem = (item) => {
        if (isSelected(item.codigo)) return;
        onChange([...selected, { codigo: item.codigo, descripcion: item.descripcion }]);
        setQuery("");
        setResults([]);
        setShowDropdown(false);
    };

    const removeItem = (codigo) => {
        onChange(selected.filter((s) => s.codigo !== codigo));
    };

    const filteredResults = results.filter((r) => !isSelected(r.codigo));

    const inputBlock = (
        <div className="relative">
            <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
            />
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
                className={`block pl-9 pr-8 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#084788] ${
                    disabled ? "bg-gray-100" : ""
                }`}
            />
            {loading && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm animate-spin pointer-events-none"
                />
            )}

            {showDropdown && query.trim().length >= 2 && (
                <div className="absolute top-full left-0 z-40 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
    );

    const selectedBlock =
        selected.length > 0 ? (
            <div className={`space-y-1 ${splitLayout ? "" : "pt-1"}`}>
                {selected.map((item) => (
                    <div
                        key={item.codigo}
                        className={`flex items-center gap-3 p-1 border rounded-md ${c.box}`}
                    >
                        <span className={`text-sm font-mono font-bold px-2 py-1 rounded shrink-0 ${c.badge}`}>
                            {item.codigo}
                        </span>
                        <span className={`text-sm flex-1 break-words ${c.desc}`}>
                            {item.descripcion}
                        </span>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeItem(item.codigo)}
                                className="text-red-500 hover:text-red-700 shrink-0 pr-2"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        ) : null;

    return (
        <div className="space-y-1" ref={boxRef}>
            {label && <label className={`font-semibold block ${titleColor}`}>{label} :</label>}
            {splitLayout ? (
                <div className="grid grid-cols-2 gap-4 items-start">
                    {inputBlock}
                    <div>
                        <span className={`font-semibold block mb-1 ${titleColor}`}>{selTitle} :</span>
                        {selectedBlock || <p className="text-xs text-gray-400">Ninguno</p>}
                    </div>
                </div>
            ) : (
                <>
                    {inputBlock}
                    {selectedBlock}
                </>
            )}
        </div>
    );
}
