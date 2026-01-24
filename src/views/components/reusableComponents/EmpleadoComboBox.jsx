import { useEffect, useState } from "react";
import { useSessionData } from "../../hooks/useSessionData";

export default function EmpleadoComboBox({
    value,
    onChange,
    form,
    className = "",
    label = "Médico que Certifica",
    nameField = "nombre_medico",
    idField = "user_medicoFirma"
}) {
    const { listaEmpleados: empleados } = useSessionData();
    const safeEmpleados = empleados || [];
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);

    // Estado local para manejar la entrada del usuario y permitir escritura natural
    const [inputValue, setInputValue] = useState(value || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Sincronizar el estado local con el prop value si cambia externamente
    useEffect(() => {
        if (value !== undefined && !isFocused) {
            const valStr = value || "";
            if (valStr !== inputValue) {
                setInputValue(valStr);
            }
        }
    }, [value, isFocused]);

    const filterEmpleados = (query) => {
        if (!query) return safeEmpleados;
        const q = query.toLowerCase();
        return safeEmpleados
            .filter((emp) => (emp.nombres || "").toLowerCase().includes(q))
            .sort((a, b) => {
                const nameA = (a.nombres || "").toLowerCase();
                const nameB = (b.nombres || "").toLowerCase();
                const startA = nameA.startsWith(q);
                const startB = nameB.startsWith(q);
                if (startA && !startB) return -1;
                if (!startA && startB) return 1;
                return 0;
            });
    };

    // Efecto para debounce del filtrado
    useEffect(() => {
        // Solo filtrar si está enfocado
        if (!isFocused) {
            setFilteredEmpleados([]); // Limpiar lista si no está enfocado
            return;
        }

        setIsLoading(true);
        const handler = setTimeout(() => {
            setFilteredEmpleados(filterEmpleados(inputValue));
            setIsLoading(false);
        }, 0); // 50ms de retraso

        return () => {
            clearTimeout(handler);
            setIsLoading(false); // Asegurar que loading se apague al desmontar/cambiar
        };
    }, [inputValue, safeEmpleados, isFocused]);

    const handleSearch = (e) => {
        const v = e.target.value.toUpperCase();
        setInputValue(v);

        // Buscar coincidencia exacta
        const exactMatch = safeEmpleados.find(
            (emp) => (emp.nombres || "").toUpperCase() === v
        );

        if (exactMatch) {
            onChange({
                target: {
                    name: nameField,
                    value: exactMatch.nombres
                }
            });
            onChange({
                target: {
                    name: idField,
                    value: exactMatch.username
                }
            });
        } else {
            onChange({
                target: {
                    name: nameField,
                    value: ""
                }
            });
            onChange({
                target: {
                    name: idField,
                    value: ""
                }
            });
        }
    };

    useEffect(() => {
        if (!form[idField]) return
        const empleadoEncontrado = safeEmpleados.find((emp) => emp.username === form[idField]);
        if (empleadoEncontrado && empleadoEncontrado.nombres) {
            // Actualizamos input local también
            if (inputValue.toUpperCase() !== empleadoEncontrado.nombres.toUpperCase()) {
                setInputValue(empleadoEncontrado.nombres);
            }
            onChange({
                target: {
                    name: nameField,
                    value: empleadoEncontrado.nombres
                }
            });
        }
    }, [form[idField], idField, nameField]);

    const handleSelect = (emp) => {
        setFilteredEmpleados([]);
        setInputValue(emp.nombres);
        onChange({
            target: {
                name: nameField,
                value: emp.nombres
            }
        });
        onChange({
            target: {
                name: idField,
                value: emp.username
            }
        });
        // Mantener el foco o permitir blur? Normalmente selección cierra la lista.
        // isFocused se manejará con onBlur.
    };

    return (
        <div className={className}>
            <label className="block font-semibold mb-1">{label} :</label>
            <div className="relative flex-grow flex items-center">
                <input
                    id={nameField}
                    name={nameField}
                    type="text"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleSearch}
                    className={`border rounded px-2 py-1 w-full ${isLoading ? 'pr-8' : ''}`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredEmpleados.length > 0) {
                            e.preventDefault();
                            handleSelect(filteredEmpleados[0]);
                        }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() =>
                        // Retraso para permitir click en la lista
                        setTimeout(() => setIsFocused(false), 200)
                    }
                />
                {isLoading && (
                    <div className="absolute right-2 text-gray-400">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                {isFocused && filteredEmpleados.length > 0 && !isLoading && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10 shadow-lg">
                        {filteredEmpleados.map((emp, index) => (
                            <li
                                key={index}
                                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                onMouseDown={() => handleSelect(emp)}
                            >
                                {emp.nombres}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}