import { InputTextOneLine, RadioTable, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoII({ form, setForm, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="space-y-3">
      <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3 ">
        Antecedentes cardiovasculares, síntomas, medicación actual y problemas al usar respirador. Responda SI o NO.
      </div>
      <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        {/* 5. Problemas cardiovasculares */}
        <SectionFieldset
          legend="5. ¿Ha tenido alguna vez cualquiera de los siguientes problemas cardiovasculares?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "cardioInfarto", label: "a. Infarto." },
              { name: "cardioAngina", label: "b. Angina." },
              { name: "cardioInsuficienciaCardiaca", label: "c. Insuficiencia cardiaca." },
              { name: "cardioHinchazonPiernasPies", label: "d. Hinchazón en las piernas/pies (no causado por caminar)." },
              { name: "cardioArritmiaCorazon", label: "e. Arritmia al corazón." },
              { name: "cardioReflujoGastroesofagicoNoComida", label: "f. Reflujo gastroesofágico (no relacionado con la comida)." },
              { name: "cardioOtros", label: "g. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "cardioOtros" && !value) {
                setForm(p => ({ ...p, cardioOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="cardioOtrosDescripcion"
            value={form?.cardioOtrosDescripcion}
            disabled={!form?.cardioOtros}
            onChange={handleChange}
          />
        </SectionFieldset>

        {/* 6. Síntomas cardiovasculares */}
        <SectionFieldset
          legend="6. ¿Ha tenido alguno de los siguientes síntomas cardiovasculares?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "sintCardioDolorPresionPecho", label: "a. Dolor o presión en su pecho." },
              { name: "sintCardioDolorPresionPechoActividadFisica", label: "b. Dolor/presión en su pecho durante actividad física." },
              { name: "sintCardioDolorPresionPechoTrabajo", label: "c. Dolor/presión en su pecho durante su actividad de trabajo." },
              { name: "sintCardioPalpitaciones", label: "d. Palpitaciones." },
              { name: "sintCardioAcidezIndigestionNoComida", label: "e. Acidez estomacal o indigestión (no relacionado con la comida)." },
              { name: "sintCardioOtros", label: "f. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "sintCardioOtros" && !value) {
                setForm(p => ({ ...p, sintCardioOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="sintCardioOtrosDescripcion"
            value={form?.sintCardioOtrosDescripcion}
            disabled={!form?.sintCardioOtros}
            onChange={handleChange}
          />
        </SectionFieldset>

        {/* 7. Medicación actual */}
        <SectionFieldset
          legend="7. ¿Toma actualmente medicinas para cualquiera de las siguientes condiciones?"
        >
          <RadioTable
            items={[
              { name: "medsProblemaRespiratorio", label: "g. Problema respiratorio." },
              { name: "medsProblemasCorazon", label: "h. Problemas al corazón." },
              { name: "medsPresionSanguinea", label: "i. Presión sanguínea." },
              { name: "medsConvulsiones", label: "j. Convulsiones." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>

        {/* 8. Problemas al usar respirador */}
        <SectionFieldset
          legend="8. Si ha utilizado un respirador, ¿ha tenido alguno de los siguientes problemas?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "respIrritacionOjos", label: "a. Irritación a los ojos." },
              { name: "respAlergiasPielErupciones", label: "b. Alergias a la piel o erupciones." },
              { name: "respAnsiedad", label: "c. Ansiedad." },
              { name: "respFatigaDebilidad", label: "d. Fatiga o debilidad." },
              { name: "respOtros", label: "e. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "respOtros" && !value) {
                setForm(p => ({ ...p, respOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="respOtrosDescripcion"
            value={form?.respOtrosDescripcion}
            disabled={!form?.respOtros}
            onChange={handleChange}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}
