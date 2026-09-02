import RevertButton from "./RevertButton";

export default function RadioTable({
  items = [],
  options = [],
  form,
  handleRadioButton,
  labelColumns = 2,
  groupLabel,
  disabled = false,
  isFieldEdited,
  onRevert,
  // Opt-in: en mobile apila cada fila (etiqueta arriba, radios rotulados debajo) y oculta
  // la cabecera; desde sm: vuelve a la grilla tipo tabla. Sin pasarlo, el render es idéntico
  // al original (no afecta al resto de consumidores).
  stackOnMobile = false,
}) {
  const styleButton = ` w-5 h-5
                        rounded-md
                        accent-primario
                        border border-primario
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-50 `
  const hasRevert = typeof onRevert === "function";
  // Calcular el número de columnas dinámicamente (labelColumns para texto + número de opciones
  // + 1 columna extra para el botón de revertir, si aplica).
  const totalColumns = labelColumns + options.length + (hasRevert ? 1 : 0);
  const gridColsClass = `grid-cols-${totalColumns}`;
  const labelColSpanClass = `col-span-${labelColumns}`;

  // Clases que cambian según stackOnMobile. En sm: siempre se comporta como la tabla original.
  const headerRowClass = stackOnMobile ? "hidden sm:grid" : "grid";
  const itemRowClass = stackOnMobile ? "block sm:grid" : "grid";
  const labelCellClass = stackOnMobile
    ? `pt-3 pb-1 px-3 sm:p-3 font-semibold ${labelColSpanClass}`
    : `p-3 font-semibold ${labelColSpanClass}`;
  const optionCellClass = stackOnMobile
    ? "flex items-center gap-1 py-1 sm:p-3 sm:gap-0 sm:justify-center"
    : "p-3 flex justify-center";
  const revertCellClass = stackOnMobile
    ? "flex items-center gap-1 px-3 pb-2 sm:p-3 sm:justify-center"
    : "p-3 flex items-center justify-center";

  return (
    <div>
      {/* Encabezados de columna */}
      <div>
        {groupLabel && (
          <div className={`${headerRowClass} ${gridColsClass}  border-b`}>
            <div className={`col-span-${labelColumns}`}></div>
            <div className={`col-span-${options.length} text-center font-bold p-2`}>
              {groupLabel}
            </div>
            {hasRevert && <div></div>}
          </div>
        )}
        <div className={`${headerRowClass} ${gridColsClass} bg-gray-100 border-b rounded-t-lg`}>
          <div className={`p-3 font-semibold text-gray-700 ${labelColSpanClass}`}></div>
          {options.map((option, index) => (
            <div key={index} className="p-3 text-center font-semibold ">
              {option.label}
            </div>
          ))}
          {hasRevert && <div></div>}
        </div>
      </div>

      {/* Filas de items */}
      {items.map((item, itemIndex) => {
        const edited = hasRevert && typeof isFieldEdited === "function" && isFieldEdited(item.name);
        const optionCells = options.map((option, optionIndex) => (
          <div key={optionIndex} className={optionCellClass}>
            <input
              type="radio"
              name={item.name}
              value={option.value}
              checked={form?.[item.name] === option.value}
              onChange={(e) => (disabled ? null : handleRadioButton(e, option.value))}
              disabled={disabled}
              className={styleButton}
            />
            {stackOnMobile && (
              <span className="text-sm sm:hidden">{option.label}</span>
            )}
          </div>
        ));
        return (
          <div
            key={itemIndex}
            className={`${itemRowClass} ${gridColsClass} ${itemIndex < items.length - 1 ? 'border-b border-gray-200 ' : 'rounded-b-lg'
              } hover:bg-gray-300 `}
          >
            {/* Columna de texto (ocupa labelColumns columnas) */}
            <div className={labelCellClass}>
              {item.label}
            </div>

            {/* Columnas de opciones. En mobile (stackOnMobile) fluyen en un wrap; en sm:
                el wrapper se disuelve (display:contents) y vuelven a ser celdas de la grilla. */}
            {stackOnMobile ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 pb-2 sm:contents">
                {optionCells}
              </div>
            ) : (
              optionCells
            )}

            {/* Columna del botón de revertir */}
            {hasRevert && (
              <div className={revertCellClass}>
                {edited && (
                  <RevertButton onClick={() => onRevert(item.name)} title="Revertir selección" />
                )}
              </div>
            )}

            {/* Fila extra para contenido opcional */}
            {item.extraContent && (
              <div className={`col-span-${totalColumns} ${stackOnMobile ? 'px-3 pb-3 sm:p-3' : 'p-3'}`}>
                {item.extraContent}
              </div>
            )}
          </div>
        );
      })}
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
  stackOnMobile   // Opcional: apila en mobile (etiqueta + radios rotulados)
/>
*/
