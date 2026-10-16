import { InputTextArea, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

/**
 * Informe Médico de Accidentes de las Historias Clínicas del módulo (solo con "La Arena" marcado).
 *
 * No tiene botón propio: las circunstancias se guardan con el Guardar de la Historia Clínica (si hay texto) y
 * el informe se imprime desde las opciones que aparecen al guardar (o desde el bloque IMPRIMIR N° TICKET).
 * El informe usa los datos de la Historia Clínica (diagnóstico, tratamiento), por eso solo se imprime una vez
 * guardada.
 */
export default function InformeAccidente({ form, onChange, disabled = false }) {
    return (
        <SectionFieldset legend="Informe Médico de Accidentes" className="space-y-3">
            <InputTextArea
                label="Declaro que el accidente fue en las siguientes circunstancias"
                name="accidenteCircunstancias"
                value={form.accidenteCircunstancias}
                onChange={onChange}
                rows={4}
                disabled={disabled}
            />

            <p className="text-sm italic text-gray-600">
                Se guarda junto con la Historia Clínica
                {form.accidenteRegistrado ? " (este ticket ya tiene un informe de accidente registrado)" : ""}. Sin texto, no se registra informe.
            </p>
        </SectionFieldset>
    );
}
