import { InputTextOneLine } from "../../../../../../../components/reusableComponents/ResusableComponents";
import InputsRadioGroup from "../../../../../../../components/reusableComponents/InputsRadioGroup";
import SectionFieldset from "../../../../../../../components/reusableComponents/SectionFieldset";

export default function ParteI({ form, handleChange, handleRadioButton, disabled = false, isFieldEdited, revertField }) {
  return (
    <SectionFieldset legend="Preguntas (durante el último mes)">
      <div className="space-y-4">
        <InputTextOneLine
          label="1. Hora de acostarse habitualmente"
          name="horaAcostarse"
          value={form?.horaAcostarse}
          onChange={handleChange}
          labelWidth="200px"
          disabled={disabled}
          edited={isFieldEdited("horaAcostarse")}
          onRevert={() => revertField("horaAcostarse")}
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
          disabled={disabled}
          edited={isFieldEdited("tiempoDormir")}
          onRevert={() => revertField("tiempoDormir")}
        />
        <InputTextOneLine
          label="3. Hora de levantarse normalmente"
          name="horaLevantarse"
          value={form?.horaLevantarse}
          onChange={handleChange}
          labelWidth="200px"
          disabled={disabled}
          edited={isFieldEdited("horaLevantarse")}
          onRevert={() => revertField("horaLevantarse")}
        />
        <InputTextOneLine
          label="4. Horas dormidas por noche (promedio)"
          name="horasDormidas"
          value={form?.horasDormidas}
          onChange={handleChange}
          labelWidth="200px"
          disabled={disabled}
          edited={isFieldEdited("horasDormidas")}
          onRevert={() => revertField("horasDormidas")}
        />
      </div>
    </SectionFieldset>
  );
}