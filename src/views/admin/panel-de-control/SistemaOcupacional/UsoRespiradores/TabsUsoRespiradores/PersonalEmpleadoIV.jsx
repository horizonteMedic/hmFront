import { InputsBooleanRadioGroup, InputTextArea, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoIV({ form, setForm, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="text-[11px] space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3 mb-4">
          Sección 3: (Confidencial) El profesional de la salud que va a revisar este cuestionario determinará si esta parte debe ser completada por el empleado.  Responda SI o NO y agregue detalles cuando corresponda.
        </div>

        {/* 1. Sensaciones al trabajar en alturas > 2500 msnm */}
        <div className="mt-2">
          <p className="font-semibold mb-2">1. Cuando trabaja en alturas por encima de 2500 msnm en una atmósfera con menor oxígeno que lo normal, ¿tiene estas sensaciones?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Mareos.</span><InputsBooleanRadioGroup name="alturaMareos" value={form?.alturaMareos} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Dificultad para respirar.</span><InputsBooleanRadioGroup name="alturaDificultadRespirar" value={form?.alturaDificultadRespirar} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Palpitaciones.</span><InputsBooleanRadioGroup name="alturaPalpitaciones" value={form?.alturaPalpitaciones} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Otros.</span><InputsBooleanRadioGroup name="alturaOtros" value={form?.alturaOtros} onChange={(e, v) => { setForm(p => ({ ...p, alturaOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="alturaOtrosDescripcion" value={form?.alturaOtrosDescripcion} disabled={!form?.alturaOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 2. Problemas pulmonares o de pulmón */}
        <div className="mt-4">
          <p className="font-semibold mb-2">2. ¿Ha tenido alguna vez algunos de los siguientes problemas pulmonares o de pulmón?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Asbestos.</span><InputsBooleanRadioGroup name="probPulmonAsbestos" value={form?.probPulmonAsbestos} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Sílice.</span><InputsBooleanRadioGroup name="probPulmonSilice" value={form?.probPulmonSilice} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Tungsteno / Cobalto (Ej.: esmerilado o soldadura).</span><InputsBooleanRadioGroup name="probPulmonTungstenoCobalto" value={form?.probPulmonTungstenoCobalto} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Berilio.</span><InputsBooleanRadioGroup name="probPulmonBerilio" value={form?.probPulmonBerilio} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">e. Aluminio.</span><InputsBooleanRadioGroup name="probPulmonAluminio" value={form?.probPulmonAluminio} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">f. Carbón.</span><InputsBooleanRadioGroup name="probPulmonCarbon" value={form?.probPulmonCarbon} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">g. Hierro.</span><InputsBooleanRadioGroup name="probPulmonHierro" value={form?.probPulmonHierro} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">h. Latón.</span><InputsBooleanRadioGroup name="probPulmonLaton" value={form?.probPulmonLaton} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">i. Ambientes con exceso de polvo.</span><InputsBooleanRadioGroup name="probPulmonAmbienteExcesoPolvo" value={form?.probPulmonAmbienteExcesoPolvo} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">j. Otros.</span><InputsBooleanRadioGroup name="probPulmonIndustrialesOtros" value={form?.probPulmonIndustrialesOtros} onChange={(e, v) => { setForm(p => ({ ...p, probPulmonIndustrialesOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="probPulmonIndustrialesOtrosDescripcion" value={form?.probPulmonIndustrialesOtrosDescripcion} disabled={!form?.probPulmonIndustrialesOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 3. Trabajos/pasatiempos expuestos a peligros respiratorios */}
        <div className="mt-4">
          <InputTextArea
            label="3. Liste cualquier trabajo previo/pasatiempo en los que haya sido expuesto a peligros respiratorios"
            name="trabajosExpuestosPeligrosRespiratorios"
            rows={4}
            value={form?.trabajosExpuestosPeligrosRespiratorios}
            onChange={handleChange} />
        </div>

        {/* 4 y 5. Servicio Militar y MATPEL */}
        <div className="mt-4">
          <div className="grid gap-3 font-semibold">
            <div className="flex items-start justify-between"><span className="pr-4">4. ¿Has hecho alguna vez Servicio Militar?</span><InputsBooleanRadioGroup name="servicioMilitar" value={form?.servicioMilitar} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">5. ¿Has estado alguna vez en un equipo de MATPEL o Respuesta de Emergencias?</span><InputsBooleanRadioGroup name="equipoMatpelEmergencias" value={form?.equipoMatpelEmergencias} onChange={handleRadioButtonBoolean} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}