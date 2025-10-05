import { InputCheckbox, InputTextArea, InputTextOneLine, InputsBooleanRadioGroup } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoI({ form, handleCheckBoxChange, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">7.2 Personal Empleado - Parte I</h4>
        <p className="text-sm text-gray-600 mb-4">Por favor responder SI o NO a las siguientes preguntas relacionadas al uso de respiradores.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputsBooleanRadioGroup
            label="¿Usó un respirador previamente?"
            name="usadoRespiradorPrevio"
            value={form?.usadoRespiradorPrevio}
            onChange={handleRadioButtonBoolean}
          />
          <InputsBooleanRadioGroup
            label="¿Ha tenido problemas respirando con mascarillas?"
            name="problemasRespirandoMascarillas"
            value={form?.problemasRespirandoMascarillas}
            onChange={handleRadioButtonBoolean}
          />
          <InputsBooleanRadioGroup
            label="¿Tiene alergias a materiales de respiradores?"
            name="alergiaMaterialRespirador"
            value={form?.alergiaMaterialRespirador}
            onChange={handleRadioButtonBoolean}
          />
          <InputsBooleanRadioGroup
            label="¿Trabaja en ambientes con polvo o humo?"
            name="ambientesPolvoHumo"
            value={form?.ambientesPolvoHumo}
            onChange={handleRadioButtonBoolean}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputTextOneLine label="Talla de máscara" name="tallaMascara" value={form?.tallaMascara} onChange={handleChange} />
          <InputTextOneLine label="Modelo preferido" name="modeloPreferido" value={form?.modeloPreferido} onChange={handleChange} />
        </div>

        <div className="mt-6">
          <InputTextArea label="Comentarios adicionales" name="comentariosPersonalI" value={form?.comentariosPersonalI} onChange={handleChange} rows={3} />
        </div>
      </div>
    </div>
  );
}