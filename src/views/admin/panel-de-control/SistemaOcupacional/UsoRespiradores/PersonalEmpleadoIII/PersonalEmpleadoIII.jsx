import { InputsBooleanRadioGroup, InputTextArea } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoIII({ form, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.4 Personal Empleado - Parte III</h4>
        <p className="text-sm text-gray-600 mb-4">Responda SI o NO en relación a antecedentes generales y síntomas durante el trabajo.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputsBooleanRadioGroup label="¿Mareos frecuentes?" name="mareosFrecuentes" value={form?.mareosFrecuentes} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Fatiga extrema con esfuerzo?" name="fatigaExtrema" value={form?.fatigaExtrema} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Dolor de cabeza con frecuencia?" name="dolorCabezaFrecuente" value={form?.dolorCabezaFrecuente} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Desmayos?" name="desmayos" value={form?.desmayos} onChange={handleRadioButtonBoolean} />
          <InputsBooleanRadioGroup label="¿Problemas de visión con uso de respirador?" name="problemasVisionRespirador" value={form?.problemasVisionRespirador} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Claustrofobia?" name="claustrofobia" value={form?.claustrofobia} onChange={handleChange} />
        </div>

        <InputTextArea label="Detalle síntomas" name="detalleSintomasIII" value={form?.detalleSintomasIII} onChange={handleChange} rows={3} />
      </div>
    </div>
  );
}