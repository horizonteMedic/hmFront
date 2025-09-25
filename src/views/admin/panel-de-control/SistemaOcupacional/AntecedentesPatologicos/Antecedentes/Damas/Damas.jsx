/* eslint-disable react/prop-types */
import { InputTextOneLine, InputTextArea } from "../../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Damas
export default function Damas({ form, handleSiNoChange }) {
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
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Damas</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Inicio de mestruación:</span>
            <InputTextOneLine
              name="inicioMenstruacion"
              value={form?.inicioMenstruacion || ""}
              onChange={(e) => handleSiNoChange("inicioMenstruacion", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "inicioVidaSexual")}
            />
            <span className="font-medium">Años</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Inicio de vida sexual:</span>
            <InputTextOneLine
              name="inicioVidaSexual"
              value={form?.inicioVidaSexual || ""}
              onChange={(e) => handleSiNoChange("inicioVidaSexual", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "parejasSexuales")}
            />
            <span className="font-medium">Años</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de parejas sexuales a la actualidad:</span>
            <InputTextOneLine
              name="parejasSexuales"
              value={form?.parejasSexuales || ""}
              onChange={(e) => handleSiNoChange("parejasSexuales", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "hijosVivosDamas")}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de hijos vivos:</span>
            <InputTextOneLine
              name="hijosVivosDamas"
              value={form?.hijosVivosDamas || ""}
              onChange={(e) => handleSiNoChange("hijosVivosDamas", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "hijosFallecidosDamas")}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de hijos fallecidos:</span>
            <InputTextOneLine
              name="hijosFallecidosDamas"
              value={form?.hijosFallecidosDamas || ""}
              onChange={(e) => handleSiNoChange("hijosFallecidosDamas", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "abortosDamas")}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-medium min-w-[250px]">Número de Abortos:</span>
            <InputTextOneLine
              name="abortosDamas"
              value={form?.abortosDamas || ""}
              onChange={(e) => handleSiNoChange("abortosDamas", e, e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "causasAbortosDamas")}
            />
          </div>
          
          <div className="space-y-2">
            <span className="font-medium">Precisar causas:</span>
            <InputTextArea
              rows={4}
              name="causasAbortosDamas"
              value={form?.causasAbortosDamas || ""}
              onChange={(e) => handleSiNoChange("causasAbortosDamas", e, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
