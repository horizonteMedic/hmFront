import RadioTable from "../../../../../../../components/reusableComponents/RadioTable";
import SectionFieldset from "../../../../../../../components/reusableComponents/SectionFieldset";

export default function CriteriosPsicologicosI({
  form,
  handleRadioButton,
}) {

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!form.anual && (
          <SectionFieldset legend="ASPECTO INTELECTUAL">
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
                { value: "I", label: "Inferior" },
                { value: "NPI", label: "Nivel Promedio Inferior" },
                { value: "NP", label: "Nivel Promedio" },
                { value: "NPS", label: "Nivel Promedio Superior" },
                { value: "S", label: "Superior" }
              ]}
              form={form}
              handleRadioButton={handleRadioButton}
            />
          </SectionFieldset>
        )}


        <SectionFieldset legend="ASPECTOS PERSONALIDAD">
          <RadioTable
            items={[
              { name: "estabilidadEmocional", label: "1. Estabilidad Emocional" },
              { name: "toleranciaFrustracion", label: "2. Tolerancia a la Frustración" },
              { name: "autoestima", label: "3. Autoestima" },
              { name: "asertividad", label: "4. Asertividad" },
              { name: "ansiedadEstado", label: "5. Ansiedad ESTADO" },
              { name: "ansiedadRasgo", label: "6. Ansiedad RASGO" }
            ].slice(0, form.anual ? 4 : 6)}
            options={[
              { value: "B", label: "Bajo" },
              { value: "NPB", label: "Nibel Promedio Bajo" },
              { value: "NP", label: "Nivel Promedio" },
              { value: "NPA", label: "Nivel Promedio Alto" },
              { value: "A", label: "Alto" }
            ]}
            form={form}
            handleRadioButton={handleRadioButton}
          />
        </SectionFieldset>
      </div>
    </div>
  );
}