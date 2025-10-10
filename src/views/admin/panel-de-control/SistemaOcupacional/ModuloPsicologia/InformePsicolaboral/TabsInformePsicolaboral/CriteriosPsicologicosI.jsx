import {
  InputsRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function CriteriosPsicologicosI({
  form,
  handleRadioButton,
}) {
  const aspectoIntelectualOptions = [
    { value: "I", label: "I" },
    { value: "NP1", label: "NP1" },
    { value: "NP", label: "NP" },
    { value: "NPS", label: "NPS" },
    { value: "S", label: "S" },
  ];

  const aspectosPersonalidadOptions = [
    { value: "B", label: "B" },
    { value: "NPB", label: "NPB" },
    { value: "NP", label: "NP" },
    { value: "NPA", label: "NPA" },
    { value: "A", label: "A" },
  ];

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASPECTO INTELECTUAL */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-red-100 text-red-800 py-2 rounded">
            ASPECTO INTELECTUAL
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                1. Razonamiento y resolución de problemas
              </label>
              <InputsRadioGroup
                name="razonamientoProblemas"
                options={aspectoIntelectualOptions}
                value={form?.razonamientoProblemas}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                2. Memoria
              </label>
              <InputsRadioGroup
                name="memoria"
                options={aspectoIntelectualOptions}
                value={form?.memoria}
                onChange={handleRadioButton}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                3. Atención y concentración
              </label>
              <InputsRadioGroup
                name="atencionConcentracion"
                options={aspectoIntelectualOptions}
                value={form?.atencionConcentracion}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                4. Coordinación viso-motora
              </label>
              <InputsRadioGroup
                name="coordinacionVisoMotora"
                options={aspectoIntelectualOptions}
                value={form?.coordinacionVisoMotora}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                5. Orientación espacial
              </label>
              <InputsRadioGroup
                name="orientacionEspacial"
                options={aspectoIntelectualOptions}
                value={form?.orientacionEspacial}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                6. Comprensión verbal
              </label>
              <InputsRadioGroup
                name="comprensionVerbal"
                options={aspectoIntelectualOptions}
                value={form?.comprensionVerbal}
                onChange={handleRadioButton}
              />
            </div>
          </div>
        </div>

        {/* ASPECTOS PERSONALIDAD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-blue-100 text-blue-800 py-2 rounded">
            ASPECTOS PERSONALIDAD
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                1. Estabilidad Emocional
              </label>
              <InputsRadioGroup
                name="estabilidadEmocional"
                options={aspectosPersonalidadOptions}
                value={form?.estabilidadEmocional}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                2. Tolerancia a la Frustración
              </label>
              <InputsRadioGroup
                name="toleranciaFrustracion"
                options={aspectosPersonalidadOptions}
                value={form?.toleranciaFrustracion}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                3. Autoestima
              </label>
              <InputsRadioGroup
                name="autoestima"
                options={aspectosPersonalidadOptions}
                value={form?.autoestima}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                4. Asertividad
              </label>
              <InputsRadioGroup
                name="asertividad"
                options={aspectosPersonalidadOptions}
                value={form?.asertividad}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                5. Ansiedad ESTADO
              </label>
              <InputsRadioGroup
                name="ansiedadEstado"
                options={aspectosPersonalidadOptions}
                value={form?.ansiedadEstado}
                onChange={handleRadioButton}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                6. Ansiedad RASGO
              </label>
              <InputsRadioGroup
                name="ansiedadRasgo"
                options={aspectosPersonalidadOptions}
                value={form?.ansiedadRasgo}
                onChange={handleRadioButton}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}