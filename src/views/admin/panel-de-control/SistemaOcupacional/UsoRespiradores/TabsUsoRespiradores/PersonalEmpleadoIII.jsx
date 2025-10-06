import { InputsBooleanRadioGroup, InputTextOneLine } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoIII({ form, setForm, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="text-[11px]  space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3 mb-4">
          Sección 2: (Discrecional). Deben ser contestadas por empleados que han sido seleccionados para usar un respirador de cara completa o un aparato de respiración autónomo. (SCBA)
          <br />Para los empleados que han sido seleccionados para utilizar otros tipos de respiradores contestar a estas preguntas de manera voluntaria. Responda SI o NO.
        </div>

        {/* 9. Visión */}
        <div className="mt-2">
          <div className="flex items-start justify-between">
            <p className="font-semibold mb-2">9. ¿Ha perdido la visión en cualquier ojo (temporal o permanente)?</p>
            <InputsBooleanRadioGroup name="visionPerdidaOjo" value={form?.visionPerdidaOjo} onChange={handleRadioButtonBoolean} />
          </div>
        </div>

        {/* 10. Condiciones relacionadas con la visión */}
        <div className="mt-4">
          <p className="font-semibold mb-2">10. En relación a su visión, indique si presenta alguna de las siguientes condiciones:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Usa lentes de contacto.</span><InputsBooleanRadioGroup name="visionUsaLentesContacto" value={form?.visionUsaLentesContacto} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Usa lentes.</span><InputsBooleanRadioGroup name="visionUsaLentes" value={form?.visionUsaLentes} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Daltonismo.</span><InputsBooleanRadioGroup name="visionDaltonismo" value={form?.visionDaltonismo} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Otros.</span><InputsBooleanRadioGroup name="visionOtros" value={form?.visionOtros} onChange={(e, v) => { setForm(p => ({ ...p, visionOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="visionOtrosDescripcion" value={form?.visionOtrosDescripcion} disabled={!form?.visionOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 11. Lesiones de oído */}
        <div className="mt-4">
          <div className="flex items-start justify-between">
            <p className="font-semibold mb-2">11. ¿Ha tenido alguna lesión en sus oídos, incluyendo un tímpano roto?</p>
            <InputsBooleanRadioGroup name="oidoLesionTimpanoRoto" value={form?.oidoLesionTimpanoRoto} onChange={handleRadioButtonBoolean} />
          </div>
        </div>

        {/* 12. Problemas de audición actuales */}
        <div className="mt-4">
          <p className="font-semibold mb-2">12. ¿Tiene actualmente algunos de los siguientes problemas de audición?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Dificultad para escuchar.</span><InputsBooleanRadioGroup name="audicionDificultadEscuchar" value={form?.audicionDificultadEscuchar} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Usa un audífono.</span><InputsBooleanRadioGroup name="audicionUsaAudifono" value={form?.audicionUsaAudifono} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Otros.</span><InputsBooleanRadioGroup name="audicionOtros" value={form?.audicionOtros} onChange={(e, v) => { setForm(p => ({ ...p, audicionOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="audicionOtrosDescripcion" value={form?.audicionOtrosDescripcion} disabled={!form?.audicionOtros} onChange={handleChange} />
          </div>
        </div>

        {/* 13. Lesiones a la espalda */}
        <div className="mt-4">
          <p className="font-semibold mb-2">13. ¿Ha tenido alguna lesión a la espalda?</p>
          <div className="flex items-start justify-between">
            <span className="pr-4">Respuesta:</span>
            <InputsBooleanRadioGroup name="espaldaLesion" value={form?.espaldaLesion} onChange={handleRadioButtonBoolean} />
          </div>
        </div>

        {/* 14. Problemas musculoesqueléticos y de movilidad */}
        <div className="mt-4">
          <p className="font-semibold mb-2">14. ¿Ha tenido alguna vez algunos de los siguientes problemas?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start justify-between"><span className="pr-4">a. Debilidad en los brazos, manos, piernas o pies.</span><InputsBooleanRadioGroup name="probGenDebilidadExtremidades" value={form?.probGenDebilidadExtremidades} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">b. Dolor de espalda.</span><InputsBooleanRadioGroup name="probGenDolorEspalda" value={form?.probGenDolorEspalda} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">c. Dificultad para mover sus brazos y piernas.</span><InputsBooleanRadioGroup name="probGenDificultadMoverBrazosPiernas" value={form?.probGenDificultadMoverBrazosPiernas} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">d. Dolor o rigidez cuando se inclina hacia adelante o atrás en la cintura.</span><InputsBooleanRadioGroup name="probGenDolorRigidezCintura" value={form?.probGenDolorRigidezCintura} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">e. Dificultad para mover su cabeza de arriba o abajo.</span><InputsBooleanRadioGroup name="probGenDificultadMoverCabezaArribaAbajo" value={form?.probGenDificultadMoverCabezaArribaAbajo} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">f. Dificultad al doblar las rodillas.</span><InputsBooleanRadioGroup name="probGenDificultadDoblarRodillas" value={form?.probGenDificultadDoblarRodillas} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">g. Dificultad en ponerse en cuclillas.</span><InputsBooleanRadioGroup name="probGenDificultadCuclillas" value={form?.probGenDificultadCuclillas} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">h. Subir las escaleras o una escalera.</span><InputsBooleanRadioGroup name="probGenSubirEscaleras" value={form?.probGenSubirEscaleras} onChange={handleRadioButtonBoolean} /></div>
            <div className="flex items-start justify-between"><span className="pr-4">i. Otros.</span><InputsBooleanRadioGroup name="probGenOtros" value={form?.probGenOtros} onChange={(e, v) => { setForm(p => ({ ...p, probGenOtrosDescripcion: "" })); handleRadioButtonBoolean(e, v); }} /></div>
          </div>
          <div className="mt-3">
            <InputTextOneLine label="Especifique" name="probGenOtrosDescripcion" value={form?.probGenOtrosDescripcion} disabled={!form?.probGenOtros} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}