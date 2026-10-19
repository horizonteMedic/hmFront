import { useMemo } from "react";
import AutocompleteInput from "../../../../../../components/reusableComponents/AutocompletableInput";
import { etiquetaMedicamento } from "../inventarioUtils";

// Buscador de medicamentos del stock de un inventario (filas de GET /stock/resumen). Cada opción muestra
// cuánto hay (`rotulo` + `campoCantidad`) para que se vea el saldo antes de elegir. Escribir descarta la
// selección anterior: quien lo usa recibe `onTextoChange` y debe dejar sin elegir el medicamento.
// Con `labelWidth` la etiqueta y la caja quedan alineadas con las de InputTextOneLine del mismo formulario.
export default function BuscadorMedicamentoStock({
    id,
    label = "Medicamento",
    filas,
    texto,
    onTextoChange,
    onSelect,
    error,
    campoCantidad = "cantidadDisponible",
    rotulo = "Disp.",
    placeholder,
    nextFocusId,
    labelWidth,
    required = false,
}) {
    const opciones = useMemo(
        () => filas.map((fila) => ({ id: fila.medicamentoId, etiqueta: `${etiquetaMedicamento(fila)} · ${rotulo} ${fila[campoCantidad]}`, fila })),
        [filas, campoCantidad, rotulo]
    );

    return (
        <div>
            <AutocompleteInput
                label={label}
                id={id}
                value={texto}
                options={opciones}
                searchKey="etiqueta"
                placeholder={placeholder}
                nextFocusId={nextFocusId}
                labelWidth={labelWidth}
                required={required}
                onChange={onTextoChange}
                onSelect={(opcion) => onSelect(opcion.fila, opcion.etiqueta)}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
