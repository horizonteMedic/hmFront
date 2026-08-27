import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

let tempIdCounter = 0;
const nextTempId = () => `nuevo-${Date.now()}-${tempIdCounter++}`;

/**
 * Selector múltiple reutilizable: carga TODA la lista de {id, descripcion}
 * una sola vez (vía `fetchAll`) y filtra en el front mientras el usuario
 * escribe. Al hacer click sin escribir nada, muestra la lista completa.
 * Si no existe el ítem que se busca, permite crearlo en el momento (queda
 * marcado `isNew` hasta que el formulario padre lo persista).
 */
export default function CreatableMultiSelect({
    label,
    fetchAll,
    selected = [],
    onChange,
    placeholder = "Buscar...",
    disabled = false,
    allowCreate = true,
    labelWidth,
}) {
    const [allItems, setAllItems] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingAll, setLoadingAll] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const boxRef = useRef(null);

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

    const addNew = () => {
        const descripcion = query.trim().toUpperCase();
        if (!descripcion) return;
        const yaExiste = selected.some(
            (s) => (s.descripcion || "").toUpperCase() === descripcion
        );
        if (yaExiste) return;
        onChange([...selected, { tempId: nextTempId(), descripcion, isNew: true }]);
        setQuery("");
        setShowDropdown(false);
    };

    const removeItem = (item) => {
        onChange(
            selected.filter((s) =>
                item.id != null ? s.id !== item.id : s.tempId !== item.tempId
            )
        );
    };

    const q = query.trim().toUpperCase();
    const visibleResults = allItems.filter(
        (item) => !isSelected(item) && (!q || (item.descripcion || "").toUpperCase().includes(q))
    );
    const exactMatch = allItems.some((r) => (r.descripcion || "").toUpperCase() === q);

    return (
        <div className="space-y-1" ref={boxRef}>
            {label && (
                <label
                    className="font-semibold block"
                    style={labelWidth ? { minWidth: labelWidth } : undefined}
                >
                    {label} :
                </label>
            )}
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
                {loadingAll && (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm animate-spin pointer-events-none"
                    />
                )}
                {showDropdown && !loadingAll && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-52 overflow-y-auto">
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
                        {allowCreate && query.trim() && !exactMatch && (
                            <div
                                onMouseDown={addNew}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Crear "{query.trim().toUpperCase()}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {selected.map((item) => (
                        <span
                            key={item.id ?? item.tempId}
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm border ${
                                item.isNew
                                    ? "bg-amber-50 border-amber-300 text-amber-800"
                                    : "bg-green-50 border-green-200 text-green-800"
                            }`}
                        >
                            {item.descripcion}
                            {item.isNew && (
                                <span className="text-[10px] uppercase font-bold">nuevo</span>
                            )}
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
            )}
        </div>
    );
}
