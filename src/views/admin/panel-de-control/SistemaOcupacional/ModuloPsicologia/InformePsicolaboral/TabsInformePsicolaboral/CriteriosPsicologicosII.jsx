
import {
  InputsRadioGroup,
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";
import RadioTable from "../../../../../../components/reusableComponents/RadioTable";

export default function CriteriosPsicologicosII({
  form,
  handleRadioButton,
  handleChange,
}) {
  const aspectosConductualesOptions = [
    { value: "BAJO", label: "BAJO" },
    { value: "PROMEDIO", label: "PROMEDIO" },
    { value: "ALTO", label: "ALTO" },
  ];
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASPECTOS CONDUCTUALES */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-red-100 text-red-800 py-2 rounded">
            ASPECTOS CONDUCTUALES
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Calidad de sueño/Estrés
              </label>
              <InputsRadioGroup
                name="calidadSuenoEstres"
                options={aspectosConductualesOptions}
                value={form?.calidadSuenoEstres}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Nivel de alerta ante el riesgo
              </label>
              <InputTextOneLine
                name="nivelAlertaRiesgo"
                value={form?.nivelAlertaRiesgo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Somnolencia
              </label>
              <InputTextOneLine
                name="somnolencia"
                value={form?.somnolencia}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ASPECTOS PSICOLABORALES */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-blue-100 text-blue-800 py-2 rounded">
            ASPECTOS PSICOLABORALES
          </h3>

          {/* Tabla de aspectos psicolaborales */}
          <RadioTable
            items={[
              { name: "capacidadInfluencia", label: "1. Capacidad de influencia" },
              { name: "adaptacionCambios", label: "2. Adaptación a los cambios" },
              { name: "trabajoEquipoColaboracion", label: "3. Trabajo en equipo y colaboración" },
              { name: "orientacionAccionMejoraProcesos", label: "4. Orientación a la acción y mejora de procesos" },
              { name: "autonomiaProactividad", label: "5. Autonomía y proactividad" },
              { name: "tomaDecisiones", label: "6. Toma de decisiones" },
              { name: "crecimientoPersonal", label: "7. Crecimiento personal" },
              { name: "motivacion", label: "8. Motivación" }
            ]}
            options={[
              { value: "PD", label: "PD" },
              { value: "NM", label: "NM" },
              { value: "A", label: "A" },
              { value: "D", label: "D" },
              { value: "E", label: "E" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
          />
          
          {/* Estrés laboral - mantiene el input de texto */}
          <div className="bg-gray-50 rounded-lg overflow-hidden mt-4">
            <div className="grid grid-cols-7 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">9. Estrés laboral</div>
              <div className="p-3 col-span-5">
                <InputTextOneLine
                  name="estresLaboral"
                  value={form?.estresLaboral}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}