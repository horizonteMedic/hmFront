import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import { TIPOS_EVENTO, diasEntre } from "./controllerDescansoMedico";

/**
 * Descanso Médico de las Historias Clínicas del módulo (solo con "La Arena" marcado).
 *
 * No tiene botón propio: se guarda con el Guardar de la Historia Clínica y se imprime desde las opciones que
 * aparecen al guardar (o desde el bloque IMPRIMIR N° TICKET). Cantidad de días y Fecha fin siempre concuerdan:
 * al cambiar uno se recalcula el otro (la lógica está en `onChange`, ver actualizarDescanso).
 */
export default function DescansoMedico({ form, onChange, disabled = false }) {
    // Un tipo de evento ya guardado que no está en la lista (p. ej. cargado desde otro sistema) se conserva.
    const tipos = !form.descansoTipoEvento || TIPOS_EVENTO.includes(form.descansoTipoEvento)
        ? TIPOS_EVENTO
        : [...TIPOS_EVENTO, form.descansoTipoEvento];

    const finAnteriorAlInicio =
        Boolean(form.descansoFechaFin) && (diasEntre(form.descansoFechaInicio, form.descansoFechaFin) ?? 1) < 1;

    return (
        <SectionFieldset legend="Descanso Médico" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 items-start">
                <InputTextOneLine
                    label="Fecha Inicio"
                    name="descansoFechaInicio"
                    type="date"
                    value={form.descansoFechaInicio}
                    onChange={(e) => onChange("descansoFechaInicio", e.target.value)}
                    disabled={disabled}
                    labelWidth="130px"
                />
                <InputTextOneLine
                    label="Cantidad de días"
                    name="descansoDias"
                    value={form.descansoDias}
                    onChange={(e) => {
                        if (/^\d{0,3}$/.test(e.target.value)) onChange("descansoDias", e.target.value);
                    }}
                    disabled={disabled}
                    labelWidth="130px"
                />
                <InputTextOneLine
                    label="Fecha Fin"
                    name="descansoFechaFin"
                    type="date"
                    value={form.descansoFechaFin}
                    onChange={(e) => onChange("descansoFechaFin", e.target.value)}
                    disabled={disabled}
                    error={finAnteriorAlInicio ? "La fecha fin no puede ser anterior a la fecha de inicio." : ""}
                    labelWidth="130px"
                />
                <div className="flex items-center gap-4">
                    <label className="font-semibold" style={{ minWidth: "130px", maxWidth: "130px" }} htmlFor="descansoTipoEvento">
                        Tipo de Evento :
                    </label>
                    <select
                        id="descansoTipoEvento"
                        name="descansoTipoEvento"
                        value={form.descansoTipoEvento}
                        onChange={(e) => onChange("descansoTipoEvento", e.target.value)}
                        disabled={disabled}
                        className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-300" : "bg-white"}`}
                    >
                        <option value="">-- Seleccione --</option>
                        {tipos.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="text-sm italic text-gray-600">
                Se guarda junto con la Historia Clínica
                {form.descansoRegistrado ? " (este ticket ya tiene un descanso médico registrado)" : ""}. Si no se completa, no se registra.
            </p>
        </SectionFieldset>
    );
}
