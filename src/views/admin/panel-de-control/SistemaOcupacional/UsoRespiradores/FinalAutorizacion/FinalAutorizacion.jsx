import InputsRadioGroup from "../../../../../components/reusableComponents/InputsRadioGroup";
import { InputTextArea, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function FinalAutorizacion({ form, handleChange }) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.6 Autorización Final</h4>
        <p className="text-sm text-gray-600 mb-4">Selección de aptitud y observaciones finales.</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Aptitud para usar respirador</label>
          <InputsRadioGroup
            name="aptitudUsoRespirador"
            value={form?.aptitudUsoRespirador}
            onChange={(e, v) => handleChange({ target: { name: "aptitudUsoRespirador", value: v } })}
            options={[
              { label: "Apto", value: "APTO" },
              { label: "Apto con restricciones", value: "APTO_RESTRICCIONES" },
              { label: "No apto", value: "NO_APTO" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextOneLine label="Médico evaluador" name="medicoEvaluador" value={form?.medicoEvaluador} onChange={handleChange} />
          <InputTextOneLine label="CMP" name="cmpEvaluador" value={form?.cmpEvaluador} onChange={handleChange} />
          <InputTextOneLine label="Fecha" name="fechaEvaluacion" value={form?.fechaEvaluacion} onChange={handleChange} />
        </div>

        <div className="mt-6">
          <InputTextArea label="Observaciones" name="observacionesFinales" value={form?.observacionesFinales} onChange={handleChange} rows={3} />
        </div>
      </div>
    </div>
  );
}