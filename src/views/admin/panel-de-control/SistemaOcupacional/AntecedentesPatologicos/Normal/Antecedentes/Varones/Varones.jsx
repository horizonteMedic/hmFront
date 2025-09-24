/* eslint-disable react/prop-types */
import { InputTextOneLine, InputTextArea } from "../../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Varones
export default function Varones() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Varones</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos vivos:</span>
            <InputTextOneLine
              name="hijosVivos"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de hijos fallecidos:</span>
            <InputTextOneLine
              name="hijosFallecidos"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[200px]">Número de Abortos en sus parejas:</span>
            <InputTextOneLine
              name="abortosParejas"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="space-y-2">
            <span className="font-medium">Precisar causas:</span>
            <InputTextArea
              rows={4}
              name="causasAbortos"
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
