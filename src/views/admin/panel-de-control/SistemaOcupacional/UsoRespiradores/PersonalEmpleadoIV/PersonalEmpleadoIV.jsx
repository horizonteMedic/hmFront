import { InputsBooleanRadioGroup, InputTextArea } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoIV({ form, handleChange }) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.5 Personal Empleado - Parte IV</h4>
        <p className="text-sm text-gray-600 mb-4">Responda SI o NO sobre condiciones médicas relevantes para el uso de respirador.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputsBooleanRadioGroup label="¿Diabetes?" name="diabetes" value={form?.diabetes} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Problemas pulmonares crónicos?" name="problemasPulmonaresCronicos" value={form?.problemasPulmonaresCronicos} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Enfermedad cardiaca?" name="enfermedadCardiaca" value={form?.enfermedadCardiaca} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Trastornos neurológicos?" name="trastornosNeurologicos" value={form?.trastornosNeurologicos} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Alteraciones psicológicas?" name="alteracionesPsicologicas" value={form?.alteracionesPsicologicas} onChange={handleChange} />
          <InputsBooleanRadioGroup label="¿Otra condición relevante?" name="otraCondicionRelevante" value={form?.otraCondicionRelevante} onChange={handleChange} />
        </div>

        <InputTextArea label="Detalle condiciones" name="detalleCondicionesIV" value={form?.detalleCondicionesIV} onChange={handleChange} rows={3} />
      </div>
    </div>
  );
}