export default function InputsRadioGroup({
  name,
  value,
  onChange,
  disabled = false,
  options = [], // [{ label: "Texto", value: "valor" }]
  vertical = false,
  className = "",
}) {
  return (
    <div
      className={`flex ${vertical ? "flex-col gap-y-2" : "flex-row gap-4"}`}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-1 ${className}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => disabled ? null : onChange(e, option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
