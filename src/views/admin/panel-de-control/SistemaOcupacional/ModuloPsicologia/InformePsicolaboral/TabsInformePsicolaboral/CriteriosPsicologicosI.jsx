import RadioTable from "../../../../../../components/reusableComponents/RadioTable";

export default function CriteriosPsicologicosI({
  form,
  handleRadioButton,
}) {

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASPECTO INTELECTUAL */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-red-100 text-red-800 py-2 rounded">
            ASPECTO INTELECTUAL
          </h3>
          {/* Tabla de aspectos intelectuales */}
          <RadioTable
            items={[
              { name: "razonamientoProblemas", label: "1. Razonamiento y resolución de problemas" },
              { name: "memoria", label: "2. Memoria" },
              { name: "atencionConcentracion", label: "3. Atención y concentración" },
              { name: "coordinacionVisoMotora", label: "4. Coordinación viso-motora" },
              { name: "orientacionEspacial", label: "5. Orientación espacial" },
              { name: "comprensionVerbal", label: "6. Comprensión verbal" }
            ]}
            options={[
              { value: "I", label: "I" },
              { value: "NP1", label: "NP1" },
              { value: "NP", label: "NP" },
              { value: "NPS", label: "NPS" },
              { value: "S", label: "S" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
          />
        </div>

        {/* ASPECTOS PERSONALIDAD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-center bg-blue-100 text-blue-800 py-2 rounded">
            ASPECTOS PERSONALIDAD
          </h3>
          {/* Tabla de aspectos personalidad */}
          <RadioTable
            items={[
              { name: "estabilidadEmocional", label: "1. Estabilidad Emocional" },
              { name: "toleranciaFrustracion", label: "2. Tolerancia a la Frustración" },
              { name: "autoestima", label: "3. Autoestima" },
              { name: "asertividad", label: "4. Asertividad" },
              { name: "ansiedadEstado", label: "5. Ansiedad ESTADO" },
              { name: "ansiedadRasgo", label: "6. Ansiedad RASGO" }
            ]}
            options={[
              { value: "B", label: "B" },
              { value: "NPB", label: "NPB" },
              { value: "NP", label: "NP" },
              { value: "NPA", label: "NPA" },
              { value: "A", label: "A" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
          />
        </div>
      </div>
    </div>
  );
}