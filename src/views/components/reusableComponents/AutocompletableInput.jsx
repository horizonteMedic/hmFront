import { useState } from "react";

export default function AutocompleteInput({
    label,
    id,
    value,
    options,           // array de objetos con { id, razonSocial, ruc, ... }
    searchKey = "razonSocial",  // campo por el que se filtra
    placeholder = "Escribe para buscar...",
    onSelect,          // (item) => void
    onChange,          // (value: string) => void — opcional, para limpiar form al borrar
    nextFocusId,       // id del siguiente campo a enfocar tras seleccionar
}) {
    const [filtered, setFiltered] = useState([]);

    const handleChange = (e) => {
        const v = e.target.value.toUpperCase();
        onChange?.(v);
        setFiltered(
            v ? options.filter(o => o[searchKey].toLowerCase().includes(v.toLowerCase())) : []
        );
    };

    const handleSelect = (item) => {
        onSelect(item);
        setFiltered([]);
        if (nextFocusId) document.getElementById(nextFocusId)?.focus();
    };

    return (
        <div className="flex w-full justify-center items-center gap-2">
            <p className="font-semibold">{label}:</p>
            <div className="relative flex-grow flex items-center">
                <input
                    autoComplete="off"
                    type="text"
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filtered.length > 0) {
                            e.preventDefault();
                            handleSelect(filtered[0]);
                        }
                    }}
                    onFocus={() => {
                        if (value) {
                            setFiltered(
                                options.filter(o => o[searchKey].toLowerCase().includes(value.toLowerCase()))
                            );
                        }
                    }}
                    onBlur={() => setTimeout(() => setFiltered([]), 100)}
                    className="border border-gray-300 px-3 py-1 mb-1 rounded-md focus:outline-none w-full"
                />
                {value && filtered.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                        {filtered.map((item) => (
                            <li
                                key={item.id}
                                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                onMouseDown={() => handleSelect(item)}
                            >
                                {item[searchKey]}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}