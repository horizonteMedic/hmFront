import { InputTextOneLine, InputsBooleanRadioGroup } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoI({ form, setForm, handleRadioButtonBoolean, handleChange }) {
  return (
    <div className=" text-[11px] space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3  mb-4">
          Sección 1: Las Preguntas de la 1 a 4 deben ser respondidas por los empleados que usarán cualquier respirador. Por favor colocar "SI" o "NO".
        </div>
        {/* 1. ¿Fuma o fumó en el último mes? */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <span className=" font-semibold pr-4">1. ¿Fuma o fumó en el último mes?</span>
            <InputsBooleanRadioGroup
              name="fumaUltimoMes"
              value={form?.fumaUltimoMes}
              onChange={handleRadioButtonBoolean}
            />
          </div>
        </div>
        {/* 2. ¿Ha tenido alguna vez cualquiera de las siguientes condiciones? */}
        <div className="mt-4">
          <p className=" font-semibold mb-2">2. ¿Ha tenido alguna vez cualquiera de las siguientes condiciones?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between">
              <span className=" pr-4">a. Palpitaciones.</span>
              <InputsBooleanRadioGroup name="condPalpitaciones" value={form?.condPalpitaciones} onChange={handleRadioButtonBoolean} />
            </div>
            <div className="flex items-start justify-between">
              <span className=" pr-4">b. Convulsiones.</span>
              <InputsBooleanRadioGroup name="condConvulsiones" value={form?.condConvulsiones} onChange={handleRadioButtonBoolean} />
            </div>
            <div className="flex items-start justify-between">
              <span className=" pr-4">c. Diabetes.</span>
              <InputsBooleanRadioGroup name="condDiabetes" value={form?.condDiabetes} onChange={handleRadioButtonBoolean} />
            </div>
            <div className="flex items-start justify-between">
              <span className=" pr-4">d. Reacciones alérgicas que dificultan su respiración.</span>
              <InputsBooleanRadioGroup name="condReaccionesAlergicasRespiracion" value={form?.condReaccionesAlergicasRespiracion} onChange={handleRadioButtonBoolean} />
            </div>
            <div className="flex items-start justify-between">
              <span className=" pr-4">e. Claustrofobia.</span>
              <InputsBooleanRadioGroup name="condClaustrofobia" value={form?.condClaustrofobia} onChange={handleRadioButtonBoolean} />
            </div>
          </div>
        </div>

        {/* 3. ¿Problemas pulmonares o de pulmón? */}
        <div className="mt-4">
          <p className=" font-semibold mb-2">3. ¿Ha tenido alguna vez algunas de los siguientes problemas pulmonares o de pulmón?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className=" pr-4">a. Asbestosis.</span><InputsBooleanRadioGroup name="probPulmonAsbestosis" value={form?.probPulmonAsbestosis} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">b. Asma.</span><InputsBooleanRadioGroup name="probPulmonAsma" value={form?.probPulmonAsma} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">c. Bronquitis Crónica.</span><InputsBooleanRadioGroup name="probPulmonBronquitisCronica" value={form?.probPulmonBronquitisCronica} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">d. Enfisema.</span><InputsBooleanRadioGroup name="probPulmonEnfisema" value={form?.probPulmonEnfisema} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">e. Neumonía.</span><InputsBooleanRadioGroup name="probPulmonNeumonia" value={form?.probPulmonNeumonia} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">f. Tuberculosis.</span><InputsBooleanRadioGroup name="probPulmonTuberculosis" value={form?.probPulmonTuberculosis} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">g. Silicosis.</span><InputsBooleanRadioGroup name="probPulmonSilicosis" value={form?.probPulmonSilicosis} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">h. Neumotórax (pulmón colapsado).</span><InputsBooleanRadioGroup name="probPulmonNeumotorax" value={form?.probPulmonNeumotorax} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">i. Cáncer al pulmón.</span><InputsBooleanRadioGroup name="probPulmonCancer" value={form?.probPulmonCancer} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">j. Costillas fracturadas.</span><InputsBooleanRadioGroup name="probPulmonCostillasFracturadas" value={form?.probPulmonCostillasFracturadas} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">k. Cualquier lesión al pulmón o cirugías.</span><InputsBooleanRadioGroup name="probPulmonLesionCirugia" value={form?.probPulmonLesionCirugia} onChange={handleRadioButtonBoolean} /></div>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div className="flex items-start justify-between">
              <span className=" pr-4">m. Otros.</span>
              <InputsBooleanRadioGroup
                name="probPulmonOtros"
                value={form?.probPulmonOtros}
                onChange={(e, value) => { setForm(prev => ({ ...prev, probPulmonOtrosDescripcion: "" })); handleRadioButtonBoolean(e, value) }} />
            </div>
            <InputTextOneLine
              label="Especifique"
              name="probPulmonOtrosDescripcion"
              value={form?.probPulmonOtrosDescripcion}
              disabled={!form?.probPulmonOtros}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 4. ¿Síntomas pulmonares/enfermedades del pulmón? */}
        <div className="mt-4">
          <p className=" font-semibold mb-2">4. ¿Tiene algunos de los siguientes síntomas pulmonares o de enfermedades al pulmón?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className=" pr-4">a. Dificultad para respirar en reposo.</span><InputsBooleanRadioGroup name="sintRespirarReposo" value={form?.sintRespirarReposo} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">b. Dificultad para respirar cuando camina a nivel del suelo.</span><InputsBooleanRadioGroup name="sintRespirarCaminaNivel" value={form?.sintRespirarCaminaNivel} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">c. Dificultad para respirar cuando camina en una inclinación.</span><InputsBooleanRadioGroup name="sintRespirarCaminaInclinacion" value={form?.sintRespirarCaminaInclinacion} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">d. Dificultad para respirar cuando realiza alguna tarea.</span><InputsBooleanRadioGroup name="sintRespirarAlTarea" value={form?.sintRespirarAlTarea} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">e. Tos que le produce expectoración.</span><InputsBooleanRadioGroup name="sintTosExpectoracion" value={form?.sintTosExpectoracion} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">f. Tos que lo despierta temprano por la mañana.</span><InputsBooleanRadioGroup name="sintTosDespiertaManana" value={form?.sintTosDespiertaManana} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">g. Tos que ocurre cuando se encuentra echado.</span><InputsBooleanRadioGroup name="sintTosEchado" value={form?.sintTosEchado} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">h. Tos con sangre.</span><InputsBooleanRadioGroup name="sintTosConSangre" value={form?.sintTosConSangre} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">i. Silbidos del pecho cuando respira.</span><InputsBooleanRadioGroup name="sintSilbidosPecho" value={form?.sintSilbidosPecho} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className=" pr-4">j. Dolor en el pecho cuando respira profundamente.</span><InputsBooleanRadioGroup name="sintDolorPechoRespira" value={form?.sintDolorPechoRespira} onChange={handleRadioButtonBoolean} /></div>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div className="flex items-start justify-between">
              <span className=" pr-4">l. Otros.</span>
              <InputsBooleanRadioGroup
                name="sintOtros"
                value={form?.sintOtros}
                  onChange={(e, value) => { setForm(prev => ({ ...prev, sintOtrosDescripcion: "" })); handleRadioButtonBoolean(e, value) }} />
            </div>
            <InputTextOneLine
              label="Especifique"
              name="sintOtrosDescripcion"
              value={form?.sintOtrosDescripcion}
              disabled={!form?.sintOtros}
              onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}