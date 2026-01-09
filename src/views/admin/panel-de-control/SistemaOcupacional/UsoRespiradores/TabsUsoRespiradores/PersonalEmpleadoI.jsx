import { InputTextOneLine, RadioTable, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";

export default function PersonalEmpleadoI({ form, setForm, handleRadioButtonBoolean, handleChange }) {
  return (
    <div className="space-y-3">
      <div className="bg-orange-100 border border-orange-300 text-orange-900 rounded-md p-3">
        Sección 1: Las Preguntas de la 1 a 4 deben ser respondidas por los empleados que usarán cualquier respirador. Por favor colocar "SI" o "NO".
      </div>
      <div className="grid xl:grid-cols-2 gap-x-4 gap-y-3">
        {/* 1. ¿Fuma o fumó en el último mes? */}
        <SectionFieldset legend="1. ¿Fuma o fumó en el último mes?">
          <RadioTable
            items={[
              { name: "fumaUltimoMes", label: "1. ¿Fuma o fumó en el último mes?" }
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>
        {/* 2. ¿Ha tenido alguna vez cualquiera de las siguientes condiciones? */}
        <SectionFieldset legend="2. ¿Ha tenido alguna vez cualquiera de las siguientes condiciones?">
          <RadioTable
            items={[
              { name: "condPalpitaciones", label: "a. Palpitaciones" },
              { name: "condConvulsiones", label: "b. Convulsiones" },
              { name: "condDiabetes", label: "c. Diabetes" },
              { name: "condReaccionesAlergicasRespiracion", label: "d. Reacciones alérgicas que dificultan su respiración" },
              { name: "condClaustrofobia", label: "e. Claustrofobia" },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={handleRadioButtonBoolean}
          />
        </SectionFieldset>

        {/* 3. ¿Problemas pulmonares o de pulmón? */}
        <SectionFieldset legend="3. ¿Ha tenido alguna vez algunos de los siguientes problemas pulmonares o de pulmón?" className="space-y-3">
          <RadioTable
            items={[
              { name: "probPulmonAsbestosis", label: "a. Asbestosis." },
              { name: "probPulmonAsma", label: "b. Asma." },
              { name: "probPulmonBronquitisCronica", label: "c. Bronquitis crónica." },
              { name: "probPulmonEnfisema", label: "d. Enfisema." },
              { name: "probPulmonNeumonia", label: "e. Neumonía." },
              { name: "probPulmonTuberculosis", label: "f. Tuberculosis." },
              { name: "probPulmonSilicosis", label: "g. Silicosis." },
              { name: "probPulmonNeumotorax", label: "h. Neumotórax (pulmón colapsado)." },
              { name: "probPulmonCancer", label: "i. Cáncer al pulmón." },
              { name: "probPulmonCostillasFracturadas", label: "j. Costillas fracturadas." },
              { name: "probPulmonLesionCirugia", label: "k. Cualquier lesión al pulmón o cirugías." },
              { name: "probPulmonOtros", label: "m. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "probPulmonOtros" && !value) {
                setForm(prev => ({ ...prev, probPulmonOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          {/* Input debajo de la tabla */}
          <InputTextOneLine
            label="Especifique"
            name="probPulmonOtrosDescripcion"
            value={form?.probPulmonOtrosDescripcion}
            disabled={!form?.probPulmonOtros}
            onChange={handleChange}
          />
        </SectionFieldset>


        {/* 4. ¿Síntomas pulmonares/enfermedades del pulmón? */}
        <SectionFieldset
          legend="4. ¿Tiene algunos de los siguientes síntomas pulmonares o de enfermedades al pulmón?"
          className="space-y-3"
        >
          <RadioTable
            items={[
              { name: "sintRespirarReposo", label: "a. Dificultad para respirar en reposo." },
              { name: "sintRespirarCaminaNivel", label: "b. Dificultad para respirar cuando camina a nivel del suelo." },
              { name: "sintRespirarCaminaInclinacion", label: "c. Dificultad para respirar cuando camina en una inclinación." },
              { name: "sintRespirarAlTarea", label: "d. Dificultad para respirar cuando realiza alguna tarea." },
              { name: "sintTosExpectoracion", label: "e. Tos que le produce expectoración." },
              { name: "sintTosDespiertaManana", label: "f. Tos que lo despierta temprano por la mañana." },
              { name: "sintTosEchado", label: "g. Tos que ocurre cuando se encuentra echado." },
              { name: "sintTosConSangre", label: "h. Tos con sangre." },
              { name: "sintSilbidosPecho", label: "i. Silbidos del pecho cuando respira." },
              { name: "sintDolorPechoRespira", label: "j. Dolor en el pecho cuando respira profundamente." },
              { name: "sintOtros", label: "l. Otros." },
            ]}
            options={[
              { label: "SI", value: true },
              { label: "NO", value: false },
            ]}
            form={form}
            handleRadioButton={(e, value) => {
              if (e.target.name === "sintOtros" && !value) {
                setForm(prev => ({ ...prev, sintOtrosDescripcion: "" }));
              }
              handleRadioButtonBoolean(e, value);
            }}
          />

          {/* Input debajo de la tabla */}
          <InputTextOneLine
            label="Especifique"
            name="sintOtrosDescripcion"
            value={form?.sintOtrosDescripcion}
            disabled={!form?.sintOtros}
            onChange={handleChange}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}