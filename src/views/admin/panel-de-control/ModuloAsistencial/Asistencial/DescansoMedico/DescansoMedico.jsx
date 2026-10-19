import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import { diasEntre } from "./controllerDescansoMedico";

/**
 * Descanso Médico de las Historias Clínicas del módulo (solo en tickets de La Arena).
 *
 * No tiene botón propio: se guarda con el Guardar de la Historia Clínica y se imprime desde las opciones que
 * aparecen al guardar (o desde el bloque IMPRIMIR N° TICKET). Cantidad de días y Fecha fin siempre concuerdan:
 * al cambiar uno se recalcula el otro (la lógica está en `onChange`, ver actualizarDescanso).
 * `acciones` (opcional) son los botones o sellos de la barra del título (ver ComplementoDesplegable).
 */
export default function DescansoMedico({ form, onChange, disabled = false, acciones = null }) {
     
    const finAnteriorAlInicio =
        Boolean(form.descansoFechaFin) && (diasEntre(form.descansoFechaInicio, form.descansoFechaFin) ?? 1) < 1;

    return (
        <SectionFieldset legend="Descanso Médico" className="space-y-3" actions={acciones}>
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
                <InputTextOneLine
                    label="Tipo de Evento:"
                    name="descansoTipoEvento"
                    type="text"
                    value={form.descansoTipoEvento}
                    onChange={(e) => onChange("descansoTipoEvento", e.target.value)}
                    disabled={disabled}
                    labelWidth="130px"
                /> 
            </div>

            <p className="text-sm italic text-gray-600">
                Se guarda junto con la Historia Clínica
                {form.descansoRegistrado ? " (este ticket ya tiene un descanso médico registrado)" : ""}. Si no se completa, no se registra.
            </p>
        </SectionFieldset>
    );
}
