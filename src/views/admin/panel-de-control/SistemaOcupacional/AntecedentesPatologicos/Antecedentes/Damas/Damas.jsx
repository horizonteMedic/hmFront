import InputTextArea from "../../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";

// Componente Antecedentes de Reproducción - Damas
export default function Damas({
  form,
  handleChangeNumber,
  handleChange,
  disabled = false,
  isFieldEdited = () => false,
  revertField = () => { },
}) {
  // Resaltado + botón de revertir de un campo
  const revertible = (campo) => ({
    edited: isFieldEdited(campo),
    onRevert: () => revertField(campo),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <InputTextOneLine
          label="Inicio de mestruación"
          name="inicioMenstruacion"
          value={form?.inicioMenstruacion}
          onChange={handleChangeNumber}
          disabled={disabled}
          labelWidth="250px"
          className="flex-1"
          {...revertible("inicioMenstruacion")}
        />
        <span className="font-medium">Años</span>
      </div>

      <div className="flex items-center gap-4">
        <InputTextOneLine
          label="Inicio de vida sexual"
          name="inicioVidaSexual"
          value={form?.inicioVidaSexual}
          onChange={handleChangeNumber}
          disabled={disabled}
          labelWidth="250px"
          className="flex-1"
          {...revertible("inicioVidaSexual")}
        />
        <span className="font-medium">Años</span>
      </div>

      <InputTextOneLine
        label="Número de parejas sexuales a la actualidad"
        name="parejasSexuales"
        value={form?.parejasSexuales}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("parejasSexuales")}
      />
      <InputTextOneLine
        label="Número de hijos vivos"
        name="hijosVivosDamas"
        value={form?.hijosVivosDamas}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("hijosVivosDamas")}
      />
      <InputTextOneLine
        label="Número de hijos fallecidos"
        name="hijosFallecidosDamas"
        value={form?.hijosFallecidosDamas}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("hijosFallecidosDamas")}
      />
      <InputTextOneLine
        label="Número de Abortos"
        name="abortosDamas"
        value={form?.abortosDamas}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("abortosDamas")}
      />
      <InputTextArea
        label="Precisar causas"
        rows={4}
        name="causasAbortosDamas"
        value={form?.causasAbortosDamas}
        onChange={handleChange}
        disabled={disabled}
        {...revertible("causasAbortosDamas")}
      />
    </div>
  );
}
