export default function InputTextOneLine({
  label = "",
  name,
  value,
  onChange,
  onKeyUp,
  disabled = false,
  type = "text",
  labelWidth = "80px",
  labelOnTop = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
}) {
  return (
    <div className={`${labelOnTop ? "flex flex-col gap-2" : "flex items-center gap-4"} ${className}`}>
      {label && (
        <label
          className={`font-semibold ${labelClassName}`}
          style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
          htmlFor={name}
        >
          {label} :
        </label>
      )}
      <input
        type={type}
        className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-100" : ""
          } ${inputClassName}`}
        id={name}
        name={name}
        value={value ?? ""}
        onKeyUp={onKeyUp}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
