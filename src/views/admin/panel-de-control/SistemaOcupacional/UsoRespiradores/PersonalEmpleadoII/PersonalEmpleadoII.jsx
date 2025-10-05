import { InputsBooleanRadioGroup, InputTextArea } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoII({ form, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.3 Personal Empleado - Parte II</h4>
        <p className="text-sm text-gray-600 mb-4">Responda SI o NO en relación a antecedentes respiratorios y cardiovasculares.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputsBooleanRadioGroup label="¿Tos crónica?" name="tosCronica" value={form?.tosCronica} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Dificultad para respirar?" name="dificultadRespirar" value={form?.dificultadRespirar} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Dolor en el pecho?" name="dolorPecho" value={form?.dolorPecho} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Palpitaciones?" name="palpitaciones" value={form?.palpitaciones} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Hipertensión diagnosticada?" name="hipertensionDiagnosticada" value={form?.hipertensionDiagnosticada} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Antecedentes de asma?" name="antecedentesAsma" value={form?.antecedentesAsma} onChange={handleRadioButtonBoolean} />
        </div>

        <InputTextArea label="Detalle síntomas" name="detalleSintomasII" value={form?.detalleSintomasII} onChange={handleChange} rows={3} />
      </div>
    </div>
  );
}