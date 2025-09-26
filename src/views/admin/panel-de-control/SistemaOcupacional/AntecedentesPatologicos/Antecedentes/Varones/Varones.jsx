/* eslint-disable react/prop-types */
import { InputTextOneLine, InputTextArea } from "../../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Varones
export default function Varones({ form, handleSiNoChange }) {
  const handleKeyUp = (e, nextFieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.querySelector(`input[name="${nextFieldName}"]`);
      if (nextField) {
        nextField.focus();
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Varones</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos vivos:</span>
            <InputTextOneLine
              name="hijosVivos"
              value={form?.hijosVivos || ""}
              onChange={(e) => handleSiNoChange("hijosVivos", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "hijosFallecidos")}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos fallecidos:</span>
            <InputTextOneLine
              name="hijosFallecidos"
              value={form?.hijosFallecidos || ""}
              onChange={(e) => handleSiNoChange("hijosFallecidos", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "abortosParejas")}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de Abortos en sus parejas:</span>
            <InputTextOneLine
              name="abortosParejas"
              value={form?.abortosParejas || ""}
              onChange={(e) => handleSiNoChange("abortosParejas", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "causasAbortos")}
            />
          </div>
          
          <div className="space-y-2">
            <span className="font-medium">Precisar causas:</span>
            <InputTextArea
              rows={4}
              name="causasAbortos"
              value={form?.causasAbortos || ""}
              onChange={(e) => handleSiNoChange("causasAbortos", e, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
