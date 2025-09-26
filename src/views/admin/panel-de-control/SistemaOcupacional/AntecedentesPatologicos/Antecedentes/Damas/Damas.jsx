
import { InputTextOneLine, InputTextArea } from "../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Damas
export default function Damas({
  form,
  handleChangeNumber,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold mb-4">Antecedentes de Reproducción - Damas</h4>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Inicio de mestruación"
              name="inicioMenstruacion"
              value={form?.inicioMenstruacion}
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
            <span className="font-medium">Años</span>
          </div>

          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Inicio de vida sexual"
              name="inicioVidaSexual"
              value={form?.inicioVidaSexual}
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
            <span className="font-medium">Años</span>
          </div>

          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de parejas sexuales a la actualidad"
              name="parejasSexuales"
              value={form?.parejasSexuales}
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
          </div>

          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de hijos vivos"
              name="hijosVivosDamas"
              value={form?.hijosVivosDamas}
              onChange={(e) => handleSiNoChange("hijosVivosDamas", e, e.target.value)}
              labelWidth="250px"
            />
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de hijos fallecidos"
              name="hijosFallecidosDamas"
              value={form?.hijosFallecidosDamas}
              onChange={(e) => handleSiNoChange("hijosFallecidosDamas", e, e.target.value)}
              labelWidth="250px"
            />
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de Abortos"
              name="abortosDamas"
              value={form?.abortosDamas}
              onChange={(e) => handleSiNoChange("abortosDamas", e, e.target.value)}
              labelWidth="250px"
            />
          </div>
          <InputTextArea
            label="Precisar causas"
            rows={4}
            name="causasAbortosDamas"
            value={form?.causasAbortosDamas}
            onChange={(e) => handleSiNoChange("causasAbortosDamas", e, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
