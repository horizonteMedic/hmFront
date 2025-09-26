export default function InputCheckbox({
  label,
  checked,
  onChange,
  name,
  labelRight = true,
  disabled = false,
  className = "",
}) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      {!labelRight && <span>{label} :</span>}
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => disabled ? null : onChange(e)}
      />
      {labelRight && <span>{label}</span>}
    </label>
  );
}
