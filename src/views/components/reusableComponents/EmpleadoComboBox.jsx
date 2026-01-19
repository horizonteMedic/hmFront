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
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);

    const handleSearch = (e) => {
        const v = e.target.value.toUpperCase();
        const filtered = v
            ? empleados.filter((emp) =>
                (emp.nombres || "").toLowerCase().includes(v.toLowerCase())
            )
            : [];
        setFilteredEmpleados(filtered);
        onChange({
            target: {
                name: nameField,
                value: v
            }
        });
    };

    useEffect(() => {
        if (!form[idField]) return
        const empleadoEncontrado = empleados.find((emp) => emp.username === form[idField]);
        if (empleadoEncontrado && empleadoEncontrado.nombres) {
            onChange({
                target: {
                    name: nameField,
                    value: empleadoEncontrado.nombres
                }
            });
        }
    }, [form[idField], idField, nameField])

    const handleSelect = (emp) => {
        setFilteredEmpleados([]);
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
                    value={value || ""}
                    onChange={handleSearch}
                    className={`border rounded px-2 py-1 w-full`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredEmpleados.length > 0) {
                            e.preventDefault();
                            handleSelect(filteredEmpleados[0]);
                        }
                    }}
                    onFocus={() => {
                        if (value) {
                            setFilteredEmpleados(
                                empleados.filter((emp) =>
                                    (emp.nombres || "")
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                                )
                            );
                        }
                    }}
                    onBlur={() =>
                        setTimeout(() => setFilteredEmpleados([]), 100)
                    }
                />
                {value && filteredEmpleados.length > 0 && (
                    <ul className="absolute inset-x-0 top-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
                        {filteredEmpleados.map((emp) => (
                            <li
                                key={emp.idEmpleado}
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