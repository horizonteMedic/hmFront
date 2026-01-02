import { InputTextOneLine, RadioTable, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoIII({ form, setForm, handleChange, handleRadioButtonBoolean }) {
  return (
    <div className="space-y-3">
      <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3">
        Sección 2: (Discrecional). Deben ser contestadas por empleados que han sido seleccionados para usar un respirador
        de cara completa o un aparato de respiración autónomo (SCBA).
        <br />
        Para otros respiradores, responder de manera voluntaria. Responda SI o NO.
      </div>
      <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        {/* 9. Visión */}
        <SectionFieldset legend="9. ¿Ha perdido la visión en cualquier ojo (temporal o permanente)?">
          <RadioTable
            items={[
              { name: "visionPerdidaOjo", label: "Respuesta" },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>

        {/* 10. Condiciones relacionadas con la visión */}
        <SectionFieldset
          legend="10. En relación a su visión, indique si presenta alguna de las siguientes condiciones:"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "visionUsaLentesContacto", label: "a. Usa lentes de contacto." },
              { name: "visionUsaLentes", label: "b. Usa lentes." },
              { name: "visionDaltonismo", label: "c. Daltonismo." },
              { name: "visionOtros", label: "d. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "visionOtros" && !value) {
                setForm(p => ({ ...p, visionOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="visionOtrosDescripcion"
            value={form?.visionOtrosDescripcion}
            disabled={!form?.visionOtros}
            onChange={handleChange}
          />
        </SectionFieldset>

        {/* 11. Lesiones de oído */}
        <SectionFieldset legend="11. ¿Ha tenido alguna lesión en sus oídos, incluyendo un tímpano roto?">
          <RadioTable
            items={[
              { name: "oidoLesionTimpanoRoto", label: "Respuesta" },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>

        {/* 12. Problemas de audición actuales */}
        <SectionFieldset
          legend="12. ¿Tiene actualmente algunos de los siguientes problemas de audición?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "audicionDificultadEscuchar", label: "a. Dificultad para escuchar." },
              { name: "audicionUsaAudifono", label: "b. Usa un audífono." },
              { name: "audicionOtros", label: "d. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "audicionOtros" && !value) {
                setForm(p => ({ ...p, audicionOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="audicionOtrosDescripcion"
            value={form?.audicionOtrosDescripcion}
            disabled={!form?.audicionOtros}
            onChange={handleChange}
          />
        </SectionFieldset>

        {/* 13. Lesiones a la espalda */}
        <SectionFieldset legend="13. ¿Ha tenido alguna lesión a la espalda?">
          <RadioTable
            items={[
              { name: "espaldaLesion", label: "Respuesta" },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>

        {/* 14. Problemas musculoesqueléticos y de movilidad */}
        <SectionFieldset
          legend="14. ¿Ha tenido alguna vez algunos de los siguientes problemas?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "probGenDebilidadExtremidades", label: "a. Debilidad en los brazos, manos, piernas o pies." },
              { name: "probGenDolorEspalda", label: "b. Dolor de espalda." },
              { name: "probGenDificultadMoverBrazosPiernas", label: "c. Dificultad para mover sus brazos y piernas." },
              { name: "probGenDolorRigidezCintura", label: "d. Dolor o rigidez al inclinarse en la cintura." },
              { name: "probGenDificultadMoverCabezaArribaAbajo", label: "e. Dificultad para mover la cabeza arriba/abajo." },
              { name: "probGenDificultadMoverCabezaLadoALado", label: "f. Dificultad para mover la cabeza de lado a lado." },
              { name: "probGenDificultadDoblarRodillas", label: "g. Dificultad al doblar las rodillas." },
              { name: "probGenDificultadCuclillas", label: "h. Dificultad para ponerse en cuclillas." },
              { name: "probGenSubirEscaleras", label: "i. Subir escaleras o una escalera." },
              { name: "probGenOtros", label: "j. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "probGenOtros" && !value) {
                setForm(p => ({ ...p, probGenOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          <InputTextOneLine
            label="Especifique"
            name="probGenOtrosDescripcion"
            value={form?.probGenOtrosDescripcion}
            disabled={!form?.probGenOtros}
            onChange={handleChange}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}
