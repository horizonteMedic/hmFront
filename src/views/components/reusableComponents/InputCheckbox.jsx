export default function InputCheckbox({
  label,
  checked,
  onChange,
  name,
  labelRight = true,
  disabled = false,
}) {
  return (
    <label className="flex items-center gap-2">
      {!labelRight && <span>{label} :</span>}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {labelRight && <span>{label}</span>}
    </label>
  );
}
