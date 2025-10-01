export default function InputsBooleanRadioGroup({
  name,
  value,
  onChange,
  trueLabel = "SÍ",
  falseLabel = "NO",
  disabled = false,
}) {
  return (
    <div className="flex gap-4">
      <label className="flex items-center gap-1">
        <input
          type="radio"
          name={name}
          value="true"
          checked={value === true}
          onChange={disabled ? null : (e) => onChange(e, true)}
        // disabled={disabled}
        />
        <span>{trueLabel}</span>
      </label>

      <label className="flex items-center gap-1">
        <input
          type="radio"
          name={name}
          value="false"
          checked={value === false}
          onChange={disabled ? null : (e) => onChange(e, false)}
        // disabled={disabled}
        />
        <span>{falseLabel}</span>
      </label>
    </div>
  );
}
