import { InputTextOneLine } from "../../../../../../../components/reusableComponents/ResusableComponents";
import InputsRadioGroup from "../../../../../../../components/reusableComponents/InputsRadioGroup";

export default function ParteI({ form, handleChange, handleRadioButton }) {
  return (
    <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
      <legend className="font-bold mb-4 text-[10px]">Preguntas (durante el último mes)</legend>
      <div className="space-y-4">
        <InputTextOneLine
          label="1. Hora de acostarse habitualmente"
          name="horaAcostarse"
          value={form?.horaAcostarse}
          onChange={handleChange}
          labelWidth="200px"
        />
        <InputsRadioGroup
          label="2. Tiempo para quedarse dormido"
          name="tiempoDormir"
          value={form?.tiempoDormir}
          onChange={handleRadioButton}
          labelWidth="200px"
          options={[
            { label: "Menos de 15 min", value: "MENOS_15" },
            { label: "Entre 16 y 30 min", value: "ENTRE_16_30" },
            { label: "Entre 31 y 60 min", value: "ENTRE_31_60" },
            { label: "Más de 60 min", value: "MAS_60" },
          ]}
        />
        <InputTextOneLine
          label="3. Hora de levantarse normalmente"
          name="horaLevantarse"
          value={form?.horaLevantarse}
          onChange={handleChange}
          labelWidth="200px"
        />
        <InputTextOneLine
          label="4. Horas dormidas por noche (promedio)"
          name="horasDormidas"
          value={form?.horasDormidas}
          onChange={handleChange}
          labelWidth="200px"
        />
      </div>
    </fieldset>
  );
}