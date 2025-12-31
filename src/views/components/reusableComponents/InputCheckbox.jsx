export default function InputCheckbox({
  label,
  checked,
  onChange,
  name,
  labelRight = true,
  disabled = false,
  className = "",
}) {
  const styleButton = ` w-5 h-5
                        rounded-md
                        accent-primario
                        border border-primario
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-50 `
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      {!labelRight && <span>{label} :</span>}
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(e) => {
          if (disabled) return;
          if (onChange) {
            onChange(e);
          }
        }}
        className={styleButton}
      />
      {labelRight && <span>{label}</span>}
    </label>
  );
}
