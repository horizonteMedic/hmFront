import { InputTextOneLine, InputTextArea } from "../../../../../../components/reusableComponents/ResusableComponents";


// Componente Antecedentes de Reproducción - Varones
export default function Varones({
  form,
  handleChange,
  handleChangeNumber,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Varones</h4>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos vivos:</span>
            <InputTextOneLine
              name="hijosVivos"
              value={form?.hijosVivos}
              onChange={handleChangeNumber}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos fallecidos:</span>
            <InputTextOneLine
              name="hijosFallecidos"
              value={form?.hijosFallecidos}
              onChange={handleChangeNumber}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de Abortos en sus parejas:</span>
            <InputTextOneLine
              name="abortosParejas"
              value={form?.abortosParejas }
              onChange={handleChangeNumber}
            />
          </div>

          <div className="space-y-2">
            <span className="font-medium">Precisar causas:</span>
            <InputTextArea
              rows={4}
              name="causasAbortos"
              value={form?.causasAbortos}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
