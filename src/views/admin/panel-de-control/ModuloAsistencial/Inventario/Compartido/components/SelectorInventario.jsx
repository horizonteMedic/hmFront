import { useMemo } from "react";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import AvisoError from "./AvisoError";

// Select de inventario con su aviso de error y botón de reintento. Lo usan todas las pantallas de stock.
// `excluirId` oculta un inventario de la lista (p. ej. el destino de una transferencia no puede ser el origen).
// `compacto` lo reduce a una línea pequeña (etiqueta y select chicos) para pantallas donde casi no se cambia de inventario.
export default function SelectorInventario({
    inventarios,
    inventarioId,
    onChange,
    error,
    onRetry,
    disabled = false,
    label = "Inventario",
    name = "inventarioId",
    excluirId = "",
    labelWidth = "110px",
    compacto = false,
}) {
    const opciones = useMemo(
        () =>
            inventarios
                .filter((inventario) => inventario.activo !== false && String(inventario.id) !== String(excluirId))
                .map((inventario) => ({ value: String(inventario.id), label: inventario.nombre })),
        [inventarios, excluirId]
    );

    if (compacto) {
        return (
            <div>
                <AvisoError mensaje={error} onRetry={onRetry} />
                <label className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-600">{label}:</span>
                    <select
                        name={name}
                        value={inventarioId}
                        onChange={onChange}
                        disabled={disabled}
                        className={`border border-gray-300 rounded px-2 py-0.5 text-sm max-w-[14rem] focus:outline-none ${disabled ? "bg-gray-300" : ""}`}
                    >
                        <option value="">Seleccionar...</option>
                        {opciones.map(({ value, label: texto }) => (
                            <option key={value} value={value}>{texto}</option>
                        ))}
                    </select>
                </label>
            </div>
        );
    }

    return (
        <div>
            <AvisoError mensaje={error} onRetry={onRetry} />
            <SelectField
                label={label}
                name={name}
                value={inventarioId}
                onChange={onChange}
                options={opciones}
                inline
                labelWidth={labelWidth}
                disabled={disabled}
                required
            />
        </div>
    );
}
