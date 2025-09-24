/* eslint-disable react/prop-types */
import { InputTextOneLine, InputTextArea } from "../../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Damas
export default function Damas() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Damas</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Inicio de mestruación:</span>
            <InputTextOneLine
              name="inicioMenstruacion"
              value=""
              onChange={() => {}}
            />
            <span className="font-medium">Años</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Inicio de vida sexual:</span>
            <InputTextOneLine
              name="inicioVidaSexual"
              value=""
              onChange={() => {}}
            />
            <span className="font-medium">Años</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de parejas sexuales a la actualidad:</span>
            <InputTextOneLine
              name="parejasSexuales"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de hijos vivos:</span>
            <InputTextOneLine
              name="hijosVivos"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de hijos fallecidos:</span>
            <InputTextOneLine
              name="hijosFallecidos"
              value=""
              onChange={() => {}}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de Abortos:</span>
            <InputTextOneLine
              name="abortos"
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
