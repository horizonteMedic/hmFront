/* eslint-disable react/prop-types */
import Normal from "./Normal/Normal";

// Componente de Antecedentes Patológicos - Solo Normal
export default function AntecedentesPatologicos({
  form,
  handleSiNoChange,
}) {
  return (
    <div className="space-y-4">
      <Normal
        form={form}
        handleSiNoChange={handleSiNoChange}
      />
    </div>
  );
}
