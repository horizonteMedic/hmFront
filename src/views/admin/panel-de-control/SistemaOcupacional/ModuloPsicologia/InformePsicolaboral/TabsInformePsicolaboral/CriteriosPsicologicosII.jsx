
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
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Encabezados de columna */}
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              <div className="p-3 font-semibold text-gray-700 col-span-2"></div>
              <div className="p-3 text-center font-semibold text-gray-700">PD</div>
              <div className="p-3 text-center font-semibold text-gray-700">NM</div>
              <div className="p-3 text-center font-semibold text-gray-700">A</div>
              <div className="p-3 text-center font-semibold text-gray-700">D</div>
              <div className="p-3 text-center font-semibold text-gray-700">E</div>
            </div>

            {/* Fila 1: Capacidad de influencia */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">1. Capacidad de influencia</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="capacidadInfluencia"
                  value="PD"
                  checked={form?.capacidadInfluencia === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="capacidadInfluencia"
                  value="NM"
                  checked={form?.capacidadInfluencia === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="capacidadInfluencia"
                  value="A"
                  checked={form?.capacidadInfluencia === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="capacidadInfluencia"
                  value="D"
                  checked={form?.capacidadInfluencia === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="capacidadInfluencia"
                  value="E"
                  checked={form?.capacidadInfluencia === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 2: Adaptación a los cambios */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">2. Adaptación a los cambios</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="adaptacionCambios"
                  value="PD"
                  checked={form?.adaptacionCambios === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="adaptacionCambios"
                  value="NM"
                  checked={form?.adaptacionCambios === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="adaptacionCambios"
                  value="A"
                  checked={form?.adaptacionCambios === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="adaptacionCambios"
                  value="D"
                  checked={form?.adaptacionCambios === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="adaptacionCambios"
                  value="E"
                  checked={form?.adaptacionCambios === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 3: Trabajo en equipo y colaboración */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">3. Trabajo en equipo y colaboración</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="trabajoEquipoColaboracion"
                  value="PD"
                  checked={form?.trabajoEquipoColaboracion === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="trabajoEquipoColaboracion"
                  value="NM"
                  checked={form?.trabajoEquipoColaboracion === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="trabajoEquipoColaboracion"
                  value="A"
                  checked={form?.trabajoEquipoColaboracion === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="trabajoEquipoColaboracion"
                  value="D"
                  checked={form?.trabajoEquipoColaboracion === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="trabajoEquipoColaboracion"
                  value="E"
                  checked={form?.trabajoEquipoColaboracion === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 4: Orientación a la acción y mejora de procesos */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">4. Orientación a la acción y mejora de procesos</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionAccionMejoraProcesos"
                  value="PD"
                  checked={form?.orientacionAccionMejoraProcesos === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionAccionMejoraProcesos"
                  value="NM"
                  checked={form?.orientacionAccionMejoraProcesos === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionAccionMejoraProcesos"
                  value="A"
                  checked={form?.orientacionAccionMejoraProcesos === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionAccionMejoraProcesos"
                  value="D"
                  checked={form?.orientacionAccionMejoraProcesos === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="orientacionAccionMejoraProcesos"
                  value="E"
                  checked={form?.orientacionAccionMejoraProcesos === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 5: Autonomía y proactividad */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">5. Autonomía y proactividad</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autonomiaProactividad"
                  value="PD"
                  checked={form?.autonomiaProactividad === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autonomiaProactividad"
                  value="NM"
                  checked={form?.autonomiaProactividad === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autonomiaProactividad"
                  value="A"
                  checked={form?.autonomiaProactividad === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autonomiaProactividad"
                  value="D"
                  checked={form?.autonomiaProactividad === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="autonomiaProactividad"
                  value="E"
                  checked={form?.autonomiaProactividad === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 6: Toma de decisiones */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">6. Toma de decisiones</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="tomaDecisiones"
                  value="PD"
                  checked={form?.tomaDecisiones === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="tomaDecisiones"
                  value="NM"
                  checked={form?.tomaDecisiones === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="tomaDecisiones"
                  value="A"
                  checked={form?.tomaDecisiones === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="tomaDecisiones"
                  value="D"
                  checked={form?.tomaDecisiones === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="tomaDecisiones"
                  value="E"
                  checked={form?.tomaDecisiones === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 7: Crecimiento personal */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">7. Crecimiento personal</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="crecimientoPersonal"
                  value="PD"
                  checked={form?.crecimientoPersonal === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="crecimientoPersonal"
                  value="NM"
                  checked={form?.crecimientoPersonal === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="crecimientoPersonal"
                  value="A"
                  checked={form?.crecimientoPersonal === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="crecimientoPersonal"
                  value="D"
                  checked={form?.crecimientoPersonal === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="crecimientoPersonal"
                  value="E"
                  checked={form?.crecimientoPersonal === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 8: Motivación */}
            <div className="grid grid-cols-7 border-b border-gray-200 hover:bg-gray-50">
              <div className="p-3 font-semibold text-gray-700 bg-gray-50 col-span-2">8. Motivación</div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="motivacion"
                  value="PD"
                  checked={form?.motivacion === "PD"}
                  onChange={(e) => handleRadioButton(e, "PD")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="motivacion"
                  value="NM"
                  checked={form?.motivacion === "NM"}
                  onChange={(e) => handleRadioButton(e, "NM")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="motivacion"
                  value="A"
                  checked={form?.motivacion === "A"}
                  onChange={(e) => handleRadioButton(e, "A")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="motivacion"
                  value="D"
                  checked={form?.motivacion === "D"}
                  onChange={(e) => handleRadioButton(e, "D")}
                />
              </div>
              <div className="p-3 flex justify-center">
                <input
                  type="radio"
                  name="motivacion"
                  value="E"
                  checked={form?.motivacion === "E"}
                  onChange={(e) => handleRadioButton(e, "E")}
                />
              </div>
            </div>

            {/* Fila 9: Estrés laboral - mantiene el input de texto */}
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