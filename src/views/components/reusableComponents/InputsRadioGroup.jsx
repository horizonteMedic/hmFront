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
}) {
  const firstOptionId = options.length > 0 ? `${name}-${options[0].value}` : `${name}-first`;

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

      <div className={`flex ${vertical ? "flex-col gap-y-2" : "flex-row gap-4"} ${groupClassName}`}>
        {options.map((option, index) => {
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
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
