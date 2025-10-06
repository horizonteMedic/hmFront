import { InputsBooleanRadioGroup, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoII({ form, setForm, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="text-[11px]  space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3 mb-4">
          Antecedentes cardiovasculares, síntomas, medicación actual y problemas al usar respirador. Responda SI o NO.
        </div>

        {/* 5. Problemas cardiovasculares */}
        <div className="mt-2">
          <p className="font-semibold mb-2">5. ¿Ha tenido alguna vez cualquiera de los siguientes problemas cardiovasculares?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Infarto.</span><InputsBooleanRadioGroup name="cardioInfarto" value={form?.cardioInfarto} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Angina.</span><InputsBooleanRadioGroup name="cardioAngina" value={form?.cardioAngina} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Insuficiencia cardiaca.</span><InputsBooleanRadioGroup name="cardioInsuficienciaCardiaca" value={form?.cardioInsuficienciaCardiaca} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Hinchazón en las piernas/pies (no causado por caminar).</span><InputsBooleanRadioGroup name="cardioHinchazonPiernasPies" value={form?.cardioHinchazonPiernasPies} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">e. Arritmia al corazón.</span><InputsBooleanRadioGroup name="cardioArritmiaCorazon" value={form?.cardioArritmiaCorazon} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">f. Reflujo gastroesofágico (no relacionado con la comida).</span><InputsBooleanRadioGroup name="cardioReflujoGastroesofagicoNoComida" value={form?.cardioReflujoGastroesofagicoNoComida} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">g. Otros.</span><InputsBooleanRadioGroup name="cardioOtros" value={form?.cardioOtros} onChange={(e, v) => { setForm(p => ({ ...p, cardioOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="cardioOtrosDescripcion" value={form?.cardioOtrosDescripcion} disabled={!form?.cardioOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 6. Síntomas cardiovasculares */}
        <div className="mt-4">
          <p className="font-semibold mb-2">6. ¿Ha tenido alguno de los siguientes síntomas cardiovasculares?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Dolor o presión en su pecho.</span><InputsBooleanRadioGroup name="sintCardioDolorPresionPecho" value={form?.sintCardioDolorPresionPecho} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Dolor/presión en su pecho durante actividad física.</span><InputsBooleanRadioGroup name="sintCardioDolorPresionPechoActividadFisica" value={form?.sintCardioDolorPresionPechoActividadFisica} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Dolor/presión en su pecho durante su actividad de trabajo.</span><InputsBooleanRadioGroup name="sintCardioDolorPresionPechoTrabajo" value={form?.sintCardioDolorPresionPechoTrabajo} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Palpitaciones.</span><InputsBooleanRadioGroup name="sintCardioPalpitaciones" value={form?.sintCardioPalpitaciones} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">e. Acidez estomacal o indigestión (no relacionado con la comida).</span><InputsBooleanRadioGroup name="sintCardioAcidezIndigestionNoComida" value={form?.sintCardioAcidezIndigestionNoComida} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">f. Otros.</span><InputsBooleanRadioGroup name="sintCardioOtros" value={form?.sintCardioOtros} onChange={(e, v) => { setForm(p => ({ ...p, sintCardioOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="sintCardioOtrosDescripcion" value={form?.sintCardioOtrosDescripcion} disabled={!form?.sintCardioOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 7. ¿Toma actualmente medicinas para alguna condición? */}
        <div className="mt-4">
          <p className="font-semibold mb-2">7. ¿Toma actualmente medicinas para cualquiera de las siguientes condiciones?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">g. Problema respiratorio.</span><InputsBooleanRadioGroup name="medsProblemaRespiratorio" value={form?.medsProblemaRespiratorio} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">h. Problemas al corazón.</span><InputsBooleanRadioGroup name="medsProblemasCorazon" value={form?.medsProblemasCorazon} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">i. Presión sanguínea.</span><InputsBooleanRadioGroup name="medsPresionSanguinea" value={form?.medsPresionSanguinea} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">j. Convulsiones.</span><InputsBooleanRadioGroup name="medsConvulsiones" value={form?.medsConvulsiones} onChange={handleRadioButtonBoolean} /></div>
          </div>
        </div>

        {/* 8. Si ha utilizado un respirador, ¿ha tenido algunos de los siguientes problemas? */}
        <div className="mt-4">
          <p className="font-semibold mb-2">8. Si ha utilizado un respirador, ¿ha tenido alguno de los siguientes problemas?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Irritación a los ojos.</span><InputsBooleanRadioGroup name="respIrritacionOjos" value={form?.respIrritacionOjos} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Alergias a la piel o erupciones.</span><InputsBooleanRadioGroup name="respAlergiasPielErupciones" value={form?.respAlergiasPielErupciones} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Ansiedad.</span><InputsBooleanRadioGroup name="respAnsiedad" value={form?.respAnsiedad} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Fatiga o debilidad.</span><InputsBooleanRadioGroup name="respFatigaDebilidad" value={form?.respFatigaDebilidad} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">e. Otros.</span><InputsBooleanRadioGroup name="respOtros" value={form?.respOtros} onChange={(e, v) => { setForm(p => ({ ...p, respOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="respOtrosDescripcion" value={form?.respOtrosDescripcion} disabled={!form?.respOtros} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}