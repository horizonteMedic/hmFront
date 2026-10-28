import InputTextArea from "../../../../../../components/reusableComponents/InputTextArea";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";

// Componente Antecedentes de Reproducción - Varones
export default function Varones({
  form,
  handleChange,
  handleChangeNumber,
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
      <InputTextOneLine
        label="Número de hijos vivos"
        name="hijosVivos"
        value={form?.hijosVivos}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("hijosVivos")}
      />
      <InputTextOneLine
        label="Número de hijos fallecidos"
        name="hijosFallecidos"
        value={form?.hijosFallecidos}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("hijosFallecidos")}
      />
      <InputTextOneLine
        label="Número de Abortos en sus parejas"
        name="abortosParejas"
        value={form?.abortosParejas}
        onChange={handleChangeNumber}
        disabled={disabled}
        labelWidth="250px"
        {...revertible("abortosParejas")}
      />
      <InputTextArea
        label="Precisar causas"
        rows={4}
        name="causasAbortos"
        value={form?.causasAbortos}
        onChange={handleChange}
        disabled={disabled}
        {...revertible("causasAbortos")}
      />
    </div>
  );
}
