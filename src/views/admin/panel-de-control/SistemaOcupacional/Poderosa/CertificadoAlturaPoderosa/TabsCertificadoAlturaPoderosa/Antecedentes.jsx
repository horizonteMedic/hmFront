import {
  InputTextOneLine,
  InputTextArea,
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function Antecedentes({
  form,
  setForm,
  handleChange,
  handleRadioButtonBoolean,
  disabled = false,
  isFieldEdited = () => false,
  revertField = () => {},
}) {
  // Antecedentes psiconeurológicos: cada fila es un radio Sí/No + un input de descripción
  // (habilitado solo si el radio está en "Sí"). Al cambiar el radio se limpia su descripción.
  const psicoNeuro = [
    { name: "tecModeradoGrave", desc: "tecModeradoGraveDescripcion", label: "TEC Moderado/ Grave" },
    { name: "convulsiones", desc: "convulsionesDescripcion", label: "Convulsiones" },
    { name: "mareosModosidadAcatisia", desc: "mareosModosidadAcatasiaDescripcion", label: "Mareos/ Modosidad/ Acatisia" },
    { name: "problemasAudicion", desc: "problemasAudicionDescripcion", label: "Problemas de Audición" },
    { name: "problemasEquilibrio", desc: "problemasEquilibrioDescripcion", label: "Problemas de Equilibrio" },
    { name: "acrofobia", desc: "acrofobiaDescripcion", label: "Acrofobia" },
    { name: "agarofobia", desc: "agarofobiaDescripcion", label: "Agarofobia" },
  ];

  const sustancias = [
    { name: "tabaco", frec: "tabacoFrecuencia", label: "Tabaco" },
    { name: "alcohol", frec: "alcoholFrecuencia", label: "Alcohol" },
    { name: "drogas", frec: "drogasFrecuencia", label: "Drogas" },
    { name: "hojaCoca", frec: "hojaCocaFrecuencia", label: "Hoja de Coca" },
    { name: "cafe", frec: "cafeFrecuencia", label: "Café" },
  ];

  return (
    <div className="space-y-6">
      {/* Accidentes de Trabajo o Enfermedades Profesionales */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-4 ">
        <legend className="font-bold mb-2 text-gray-800 text-[10px]">
          Historial
        </legend>
        <div className="grid md:grid-cols-2 gap-4">
          <InputTextArea
            label="Accidentes de Trabajo o Enfermedades Profesionales"
            name="accidentesTrabajoEnfermedades"
            value={form?.accidentesTrabajoEnfermedades}
            onChange={handleChange}
            disabled={disabled}
            rows={6}
            edited={isFieldEdited("accidentesTrabajoEnfermedades")}
            onRevert={() => revertField("accidentesTrabajoEnfermedades")}
          />
          <InputTextArea
            label="Antecedentes Familiares"
            name="antecedentesFamiliares"
            value={form?.antecedentesFamiliares}
            onChange={handleChange}
            disabled={disabled}
            rows={6}
            edited={isFieldEdited("antecedentesFamiliares")}
            onRevert={() => revertField("antecedentesFamiliares")}
          />
        </div>
      </fieldset>
      {/* Antecedentes Psiconeuroológicos */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
        <legend className="font-bold mb-2 text-gray-800 text-[10px]">
          Antecedentes Psiconeuroológicos
        </legend>
        <div className="grid grid-cols-1 gap-3">
          {psicoNeuro.map((row) => (
            <div key={row.name} className="flex gap-4">
              <InputsBooleanRadioGroup
                label={row.label}
                name={row.name}
                value={form?.[row.name]}
                onChange={(e, value) => {
                  handleRadioButtonBoolean(e, value);
                  setForm((prev) => ({ ...prev, [row.desc]: "" }));
                }}
                labelWidth="130px"
                disabled={disabled}
                edited={isFieldEdited(row.name)}
                onRevert={() => revertField(row.name)}
              />
              <InputTextOneLine
                name={row.desc}
                value={form?.[row.desc]}
                onChange={handleChange}
                className="w-full my-auto"
                disabled={disabled || !form?.[row.name]}
                edited={isFieldEdited(row.desc)}
                onRevert={() => revertField(row.desc)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Consumo de Sustancias */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
        <legend className="font-bold text-gray-800 text-[10px]">
          Consumo de Sustancias
        </legend>
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="px-4 py-2 text-center font-semibold">CANTIDAD</th>
              <th className="px-4 py-2 text-center font-semibold">FRECUENCIA</th>
            </tr>
          </thead>
          <tbody>
            {sustancias.map((row) => (
              <tr key={row.name}>
                <td className=" px-2 py-2">
                  <InputTextOneLine
                    label={row.label}
                    name={row.name}
                    value={form?.[row.name]}
                    onChange={handleChange}
                    disabled={disabled}
                    labelWidth="60px"
                    edited={isFieldEdited(row.name)}
                    onRevert={() => revertField(row.name)}
                  />
                </td>
                <td className=" px-2 py-2">
                  <InputTextOneLine
                    name={row.frec}
                    value={form?.[row.frec]}
                    onChange={handleChange}
                    disabled={disabled}
                    edited={isFieldEdited(row.frec)}
                    onRevert={() => revertField(row.frec)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}
