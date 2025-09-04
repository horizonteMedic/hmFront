export default function InputsRadioGroup({
  name,
  value,
  onChange,
  disabled = false,
  options = [], // [{ label: "Texto", value: "valor" }]
}) {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e, option.value)}
            disabled={disabled}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
