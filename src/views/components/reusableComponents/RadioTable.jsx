export default function RadioTable({
  items = [],
  options = [],
  form,
  handleRadioButton,
  labelColumns = 2,
}) {

  // Calcular el número de columnas dinámicamente (labelColumns para texto + número de opciones)
  const totalColumns = labelColumns + options.length;
  const gridColsClass = `grid-cols-${totalColumns}`;
  const labelColSpanClass = `col-span-${labelColumns}`;

  return (
    <div>
      {/* Encabezados de columna */}
      <div className={`grid ${gridColsClass} bg-gray-100 border-b rounded-lg`}>
        <div className={`p-3 font-semibold text-gray-700 ${labelColSpanClass}`}></div>
        {options.map((option, index) => (
          <div key={index} className="p-3 text-center font-semibold ">
            {option.label}
          </div>
        ))}
      </div>

      {/* Filas de items */}
      {items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className={`grid ${gridColsClass} ${itemIndex < items.length - 1 ? 'border-b border-gray-200' : ''
            } hover:bg-gray-200`}
        >
          {/* Columna de texto (ocupa labelColumns columnas) */}
          <div className={`p-3 font-semibold ${labelColSpanClass}`}>
            {item.label}
          </div>

          {/* Columnas de opciones */}
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="p-3 flex justify-center">
              <input
                type="radio"
                name={item.name}
                value={option.value}
                checked={form?.[item.name] === option.value}
                onChange={(e) => handleRadioButton(e, option.value)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Ejemplo de uso:
/*
const items = [
  { name: "razonamientoProblemas", label: "1. Razonamiento y resolución de problemas" },
  { name: "memoria", label: "2. Memoria" },
  { name: "atencionConcentracion", label: "3. Atención y concentración" },
  { name: "coordinacionVisoMotora", label: "4. Coordinación viso-motora" },
  { name: "orientacionEspacial", label: "5. Orientación espacial" },
  { name: "comprensionVerbal", label: "6. Comprensión verbal" }
];

const options = [
  { value: "I", label: "I" },
  { value: "NP1", label: "NP1" },
  { value: "NP", label: "NP" },
  { value: "NPS", label: "NPS" },
  { value: "S", label: "S" }
];

<RadioTable
  items={items}
  options={options}
  form={form}
  handleRadioButton={handleRadioButton}
  labelColumns={3} // Opcional: por defecto es 2
/>
*/