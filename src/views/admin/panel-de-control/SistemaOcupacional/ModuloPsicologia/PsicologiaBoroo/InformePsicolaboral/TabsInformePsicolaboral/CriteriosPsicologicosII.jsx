
import {
  InputsRadioGroup,
  InputTextOneLine,
} from "../../../../../../../components/reusableComponents/ResusableComponents";
import RadioTable from "../../../../../../../components/reusableComponents/RadioTable";

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
                1. Nivel de Alerta ante el riesgo
              </label>
              <InputTextOneLine
                name="nivelAlerta"
                value={form?.nivelAlerta}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Tipo de hostigamiento sexual
              </label>
              <InputTextOneLine
                name="hostigamientoSexual"
                value={form?.hostigamientoSexual}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. Tipo de consecuencia encontrada
              </label>
              <InputTextOneLine
                name="consecuencia"
                value={form?.consecuencia}
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
              { value: "PD", label: "Poco Desarrollado" },
              { value: "NM", label: "Necesita Mejorar" },
              { value: "A", label: "Adecuado" },
              { value: "D", label: "Destacado" },
              { value: "E", label: "Excepcional" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
          />
        </div>
      </div>
    </div>
  );
}