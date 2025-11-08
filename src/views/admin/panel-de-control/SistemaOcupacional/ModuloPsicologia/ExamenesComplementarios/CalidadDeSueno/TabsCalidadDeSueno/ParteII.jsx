import RadioTable from "../../../../../../../components/reusableComponents/RadioTable";

const opcionesFrecuencia = [
  { value: "NUNCA", label: "Ninguna vez" },
  { value: "MENOS_SEMANA", label: "Menos de una vez/sem" },
  { value: "UNO_DOS_SEMANA", label: "Una o dos veces/sem" },
  { value: "TRES_SEMANA", label: "Tres veces/sem" },
];

export default function ParteII({ form, handleRadioButton }) {
  const items = [
    { name: "probPrimeraHora", label: "a) No pudo quedarse dormido la primera hora" },
    { name: "probDespertoNoche", label: "b) Se despertó durante la noche o de madrugada" },
    { name: "probLevantarseBano", label: "c) Se tuvo que levantar para ir al baño" },
    { name: "probNoRespirarBien", label: "d) No podía respirar bien" },
    { name: "probTosiaRonca", label: "e) Tosía o roncaba fuertemente" },
    { name: "probSentiaFrio", label: "f) Sentía frío" },
    { name: "probSentiaCalor", label: "g) Sentía demasiado calor" },
    { name: "probPesadillas", label: "h) Tenía pesadilla o malos sueños" },
    { name: "probDolores", label: "i) Tenía dolores" },
  ];

  return (
    <fieldset className="bg-white border border-gray-200 rounded-lg p-4">
      <legend className="font-bold mb-4 text-[10px]">5. Problemas para dormir durante el último mes</legend>
      <RadioTable
        items={items}
        options={opcionesFrecuencia}
        form={form}
        handleRadioButton={handleRadioButton}
        labelColumns={1}
      />
    </fieldset>
  );
}