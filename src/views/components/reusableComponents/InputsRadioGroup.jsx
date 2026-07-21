import RevertButton from "./RevertButton";

export default function InputsRadioGroup({
  name,
  value,
  onChange,
  disabled = false,
  options = [], // [{ label: "Texto", value: "valor" }]
  vertical = false,
  className = "",
  //nuevo opcional - parámetros de label como InputsBooleanRadioGroup
  label = "",
  labelOnTop = false,
  labelWidth = "80px",
  labelClassName = "",
  groupClassName = "",
  allowUncheck = false,
  edited = false,
  onRevert,
}) {
  const styleButton = ` w-5 h-5
                        rounded-md
                        accent-primario
                        border border-primario
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-50 `
  const firstOptionId = options.length > 0 ? `${name}-${options[0].value}` : `${name}-first`;
  const showRevert = edited && typeof onRevert === "function";

  const grupo = (
    <div className={`flex ${vertical ? "flex-col gap-y-2" : "flex-row gap-4"} ${groupClassName}`}>
      {options.map((option) => {
        const optionId = `${name}-${option.value}`;
        return (
          <label
            key={option.value}
            className="flex items-center gap-1"
            htmlFor={optionId}
          >
            <input
              id={optionId}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => disabled ? null : onChange(e, option.value)}
              onClick={(e) => {
                if (allowUncheck && value === option.value && !disabled) {
                  onChange(e, "");
                }
              }}
              className={styleButton}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <div className={`${labelOnTop ? "flex flex-col gap-2" : "flex items-center gap-4"} ${className}`}>
      {label && (
        <label
          className={`font-semibold ${labelClassName}`}
          style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
          htmlFor={firstOptionId}
        >
          {label} :
        </label>
      )}

      {showRevert ? (
        <div className="flex items-start gap-2">
          {grupo}
          <RevertButton onClick={onRevert} title="Revertir selección" />
        </div>
      ) : (
        grupo
      )}
    </div>
  );
}
