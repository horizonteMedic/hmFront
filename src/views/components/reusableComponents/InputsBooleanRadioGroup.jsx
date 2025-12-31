export default function InputsBooleanRadioGroup({
  name,
  value,
  onChange,
  trueLabel = "SÍ",
  falseLabel = "NO",
  disabled = false,
  //nuevo opcional
  label = "",
  labelOnTop = false,
  labelWidth = "80px",
  className = "",
  labelClassName = "",
  groupClassName = "",
  vertical = false,
}) {
  const trueId = `${name}-true`;
  const falseId = `${name}-false`;

  const styleButton = ` w-5 h-5
                        rounded-md
                        accent-primario
                        border border-primario
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-50 `

  return (
    <div className={`${labelOnTop ? "flex flex-col gap-2" : "flex items-center gap-4"} ${className}`}>
      {label && (
        <label
          className={`font-semibold ${labelClassName}`}
          style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
          htmlFor={trueId}
        >
          {label} :
        </label>
      )}

      <div className={`flex ${vertical ? "flex-col gap-y-2" : "flex-row gap-4"} ${groupClassName}`}>
        <label className="flex items-center gap-1" htmlFor={trueId}>
          <input
            id={trueId}
            type="radio"
            name={name}
            value="true"
            checked={value === true}
            onChange={(e) => (disabled ? null : onChange(e, true))}
            className={styleButton}
          // disabled={disabled}
          />
          <span>{trueLabel}</span>
        </label>

        <label className="flex items-center gap-1" htmlFor={falseId}>
          <input
            id={falseId}
            type="radio"
            name={name}
            value="false"
            checked={value === false}
            onChange={(e) => (disabled ? null : onChange(e, false))}
            // disabled={disabled}
            className={styleButton}
          />
          <span>{falseLabel}</span>
        </label>
      </div>
    </div>
  );
}
