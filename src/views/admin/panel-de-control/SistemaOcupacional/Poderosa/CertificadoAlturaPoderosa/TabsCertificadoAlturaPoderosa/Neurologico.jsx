import {
  InputTextOneLine,
  InputsBooleanRadioGroup,
} from "../../../../../../components/reusableComponents/ResusableComponents";

export default function Neurologico({
  form,
  handleChange,
  handleRadioButtonBoolean,
}) {
  // Configuración de pruebas neurológicas
  const leftColumnTests = [
    { name: "pruebaDedoNariz", label: "Dedo-Nariz" },
    { name: "indiceBarany", label: "Índice de Barany" },
    { name: "diadococinesia", label: "Diadococinesia" },
    { name: "rombergSimple", label: "Romberg simple" },
    { name: "rombergSensibilizado", label: "Romberg sensibilizado" },

  ];

  const rightColumnTests = [
    { name: "marchaEnTandem", label: "Marcha en Tandem" },
    { name: "unterberg", label: "Unterberg" },
    { name: "babinskiWeil", label: "Babinski–Weil" },
    { name: "dixHallpike", label: "Dix–Hallpike" },
    { name: "marcha", label: "Marcha" },
  ];
  return (
    <div className="space-y-6">
      {/* Reflejos */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
        <legend className="font-bold mb-3 text-gray-800 text-[10px]">
          Examen Neurológico
        </legend>
        <InputTextOneLine
          label="Reflejos"
          name="reflejos"
          value={form?.reflejos}
          onChange={handleChange}
          labelWidth="100px"
        />
      </fieldset>
      <fieldset className="p-4 bg-white border border-gray-200 rounded-lg">
        <legend className="font-bold mb-3 text-gray-800 text-[10px]">
          Pruebas Neurológicas
        </legend>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Columna izquierda */}
          <div className="space-y-3">
            {leftColumnTests.map((test) => (
              <InputsBooleanRadioGroup
                key={test.name}
                label={test.label}
                name={test.name}
                value={form?.[test.name]}
                onChange={handleRadioButtonBoolean}
                trueLabel="POSITIVO"
                falseLabel="NEGATIVO"
                labelWidth="150px"
              />
            ))}
          </div>

          {/* Columna derecha */}
          <div className="space-y-3">
            {rightColumnTests.map((test) => (
              <InputsBooleanRadioGroup
                key={test.name}
                label={test.label}
                name={test.name}
                value={form?.[test.name]}
                onChange={handleRadioButtonBoolean}
                trueLabel="POSITIVO"
                falseLabel="NEGATIVO"
                labelWidth="150px"
              />
            ))}
          </div>
        </div>
      </fieldset>
    </div>
  );
}