
import {
  InputsRadioGroup,
  InputTextOneLine,
} from "../../../../../../components/reusableComponents/ResusableComponents";

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

  const aspectosPsicolaboralesOptions = [
    { value: "PD", label: "PD" },
    { value: "NM", label: "NM" },
    { value: "A", label: "A" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Capacidad de influencia
              </label>
              <InputsRadioGroup
                name="capacidadInfluencia"
                options={aspectosPsicolaboralesOptions}
                value={form?.capacidadInfluencia}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Adaptación a los cambios
              </label>
              <InputsRadioGroup
                name="adaptacionCambios"
                options={aspectosPsicolaboralesOptions}
                value={form?.adaptacionCambios}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Trabajo en equipo y colaboración
              </label>
              <InputsRadioGroup
                name="trabajoEquipoColaboracion"
                options={aspectosPsicolaboralesOptions}
                value={form?.trabajoEquipoColaboracion}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Orientación a la acción y mejora de procesos
              </label>
              <InputsRadioGroup
                name="orientacionAccionMejoraProcesos"
                options={aspectosPsicolaboralesOptions}
                value={form?.orientacionAccionMejoraProcesos}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5. Autonomía y proactividad
              </label>
              <InputsRadioGroup
                name="autonomiaProactividad"
                options={aspectosPsicolaboralesOptions}
                value={form?.autonomiaProactividad}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6. Toma de decisiones
              </label>
              <InputsRadioGroup
                name="tomaDecisiones"
                options={aspectosPsicolaboralesOptions}
                value={form?.tomaDecisiones}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7. Crecimiento personal
              </label>
              <InputsRadioGroup
                name="crecimientoPersonal"
                options={aspectosPsicolaboralesOptions}
                value={form?.crecimientoPersonal}
                onChange={handleRadioButton}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                8. Motivación
              </label>
              <InputsRadioGroup
                name="motivacion"
                options={aspectosPsicolaboralesOptions}
                value={form?.motivacion}
                onChange={handleRadioButton}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                9. Estrés laboral
              </label>
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
  );
}