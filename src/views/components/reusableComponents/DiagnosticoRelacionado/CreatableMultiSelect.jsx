import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

/**
 * Selector múltiple reutilizable: carga TODA la lista de {id, descripcion}
 * una sola vez (vía `fetchAll`) y filtra en el front mientras el usuario
 * escribe. Al hacer click sin escribir nada, muestra la lista completa.
 * Si no existe el ítem que se busca, y se pasa `onCreate`, lo crea de
 * inmediato contra su propio endpoint (el diagnóstico ya no admite crear
 * recomendaciones/restricciones "al vuelo", solo referenciar ids reales).
 *
 * splitLayout=true muestra el buscador a la izquierda y los seleccionados
 * a la derecha (2 columnas); por defecto van apilados.
 * color: "green" | "blue" | "red" tiñe el título y los chips seleccionados.
 * selectedLabel: título de la columna derecha (por defecto "<label> seleccionadas").
 */
const COLOR_STYLES = {
    green: { text: "text-green-700", chip: "bg-green-50 border-green-200 text-green-800" },
    blue: { text: "text-sky-700", chip: "bg-sky-50 border-sky-200 text-sky-800" },
    red: { text: "text-red-700", chip: "bg-red-50 border-red-200 text-red-800" },
};

export default function CreatableMultiSelect({
    label,
    fetchAll,
    onCreate,
    selected = [],
    onChange,
    placeholder = "Buscar...",
    disabled = false,
    allowCreate = true,
    labelWidth,
    splitLayout = false,
    color = "green",
    selectedLabel,
}) {
    const [allItems, setAllItems] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingAll, setLoadingAll] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const boxRef = useRef(null);

    const c = COLOR_STYLES[color] || COLOR_STYLES.green;
    // El color del título solo se aplica si se pide explícitamente, para no
    // alterar formularios que ya usan este componente sin `color`.
    const titleColor = COLOR_STYLES[color] ? c.text : "";
    const selTitle = selectedLabel || (label ? `${label} seleccionadas` : "Seleccionadas");

    useEffect(() => {
        let active = true;
        // El timeout (con su cleanup) evita que React.StrictMode dispare la
        // petición dos veces en desarrollo: el montaje "fantasma" cancela su
        // timer antes de que llegue a ejecutarse, y solo el montaje real
        // termina llamando a fetchAll().
        const timeout = setTimeout(() => {
            setLoadingAll(true);
            Promise.resolve(fetchAll())
                .then((res) => {
                    if (active) setAllItems(Array.isArray(res) ? res : []);
                })
                .catch((err) => {
                    console.error("CreatableMultiSelect: error cargando lista", err);
                    if (active) setAllItems([]);
                })
                .finally(() => {
                    if (active) setLoadingAll(false);
                });
        }, 0);
        return () => {
            active = false;
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const isSelected = (item) =>
        selected.some((s) => (item.id != null && s.id === item.id));

    const addExisting = (item) => {
        if (isSelected(item)) return;
        onChange([...selected, { id: item.id, descripcion: item.descripcion }]);
        setQuery("");
        setShowDropdown(false);
    };

    const addNew = async () => {
        const descripcion = query.trim().toUpperCase();
        if (!descripcion || !onCreate) return;
        const yaExiste = selected.some(
            (s) => (s.descripcion || "").toUpperCase() === descripcion
        );
        if (yaExiste) return;

        setCreating(true);
        try {
            const res = await onCreate(descripcion);
            if (!res || res.error || res.status || res.id == null) {
                Swal.fire("Error", "No se pudo crear el registro", "error");
                return;
            }
            const nuevoItem = { id: res.id, descripcion: res.descripcion || descripcion };
            onChange([...selected, nuevoItem]);
            setAllItems((prev) => [...prev, nuevoItem]);
            setQuery("");
            setShowDropdown(false);
        } finally {
            setCreating(false);
        }
    };

    const removeItem = (item) => {
        onChange(selected.filter((s) => s.id !== item.id));
    };

    const q = query.trim().toUpperCase();
    const visibleResults = allItems.filter(
        (item) => !isSelected(item) && (!q || (item.descripcion || "").toUpperCase().includes(q))
    );
    const exactMatch = allItems.some((r) => (r.descripcion || "").toUpperCase() === q);

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
                placeholder={placeholder}
                className={`block pl-9 pr-8 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#084788] ${
                    disabled ? "bg-gray-100" : ""
                }`}
            />
            {(loadingAll || creating) && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm animate-spin pointer-events-none"
                />
            )}
            {showDropdown && !loadingAll && (
                <div className="absolute top-full left-0 z-40 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {visibleResults.length === 0 && (
                        <p className="text-sm text-gray-500 px-3 py-2">
                            Sin resultados{q ? ` para "${query.trim()}"` : ""}
                        </p>
                    )}
                    {visibleResults.map((item) => (
                        <div
                            key={item.id}
                            onMouseDown={() => addExisting(item)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b last:border-0 border-gray-100"
                        >
                            {item.descripcion}
                        </div>
                    ))}
                    {allowCreate && onCreate && query.trim() && !exactMatch && (
                        <div
                            onMouseDown={creating ? undefined : addNew}
                            className={`px-3 py-2 text-sm flex items-center gap-2 text-emerald-700 font-semibold ${
                                creating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-emerald-50"
                            }`}
                        >
                            <FontAwesomeIcon icon={creating ? faSpinner : faPlus} spin={creating} />
                            Crear "{query.trim().toUpperCase()}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const selectedBlock =
        selected.length > 0 ? (
            <div className={`flex flex-wrap gap-2 ${splitLayout ? "" : "pt-1"}`}>
                {selected.map((item) => (
                    <span
                        key={item.id}
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm border ${c.chip}`}
                    >
                        {item.descripcion}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </span>
                ))}
            </div>
        ) : null;

    return (
        <div className="space-y-1" ref={boxRef}>
            {label && (
                <label
                    className={`font-semibold block ${titleColor}`}
                    style={labelWidth ? { minWidth: labelWidth } : undefined}
                >
                    {label} :
                </label>
            )}
            {splitLayout ? (
                <div className="grid grid-cols-2 gap-4 items-start">
                    {inputBlock}
                    <div>
                        <span className={`font-semibold block mb-1 ${titleColor}`}>{selTitle} :</span>
                        {selectedBlock || <p className="text-xs text-gray-400">Ninguna</p>}
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
