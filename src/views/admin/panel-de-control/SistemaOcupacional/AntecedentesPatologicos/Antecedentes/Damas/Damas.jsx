
import { InputTextOneLine, InputTextArea } from "../../../../../../components/reusableComponents/ResusableComponents";

// Componente Antecedentes de Reproducción - Damas
export default function Damas({
  form,
  handleChangeNumber,
  handleChange,
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
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de hijos fallecidos"
              name="hijosFallecidosDamas"
              value={form?.hijosFallecidosDamas}
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
          </div>
          <div className="flex items-center gap-4">
            <InputTextOneLine
              label="Número de Abortos"
              name="abortosDamas"
              value={form?.abortosDamas}
              onChange={handleChangeNumber}
              labelWidth="250px"
            />
          </div>
          <InputTextArea
            label="Precisar causas"
            rows={4}
            name="causasAbortosDamas"
            value={form?.causasAbortosDamas}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
