import { FloatingAutocomplete, FloatingInput } from "../components/FloatingField";
import { PRESENTACIONES_OPTIONS } from "../presentaciones";

// Campos del medicamento, compartidos por el alta y la edición. `valores` y `errores` son objetos
// { campo: texto } (ver controllerProductosEnInventario) y `onChange(campo, valor)` los actualiza.
export default function MedicamentoForm({ id, valores, errores, onChange }) {
    const campo = (name) => ({
        id: `${id}-${name}`,
        name,
        value: valores[name],
        error: errores[name],
        onChange: (e) => onChange(name, e.target.value),
    });

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingInput {...campo("nombre")} label="Nombre" required className="sm:col-span-2" />
            <FloatingAutocomplete {...campo("presentacion")} label="Presentación" required groupedOptions={PRESENTACIONES_OPTIONS} />
            <FloatingInput {...campo("stockMinimo")} label="Stock mínimo" required type="number" min="0" />
            <FloatingInput {...campo("uso")} label="Uso" className="sm:col-span-2" />
            <FloatingInput {...campo("laboratorio")} label="Laboratorio" />
            <FloatingInput {...campo("marca")} label="Marca" />
            <FloatingInput {...campo("unidadMedida")} label="Unidad de medida" className="sm:col-span-2" />
        </div>
    );
}
