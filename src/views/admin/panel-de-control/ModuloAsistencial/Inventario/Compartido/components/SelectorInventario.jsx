import { useMemo } from "react";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import AvisoError from "../../../../../../components/reusableComponents/AvisoError";

// Select de inventario con su aviso de error y botón de reintento. Lo usan todas las pantallas de stock.
// `excluirId` oculta un inventario de la lista (p. ej. el destino de una transferencia no puede ser el origen).
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
}) {
    const opciones = useMemo(
        () =>
            inventarios
                .filter((inventario) => inventario.activo !== false && String(inventario.id) !== String(excluirId))
                .map((inventario) => ({ value: String(inventario.id), label: inventario.nombre })),
        [inventarios, excluirId]
    );

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
