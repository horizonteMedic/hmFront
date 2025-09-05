export default function InputTextOneLine({
  label = "",
  name,
  value,
  onChange,
  onKeyUp,
  disabled = false,
  type = "text",
  labelWidth = "80px",
  className = "",
}) {
  return (
    <div className={`flex items-center gap-4  ${className}`}>
      {label && (
        <label
          className="font-semibold"
          style={{ minWidth: labelWidth, maxWidth: labelWidth }}
          htmlFor={name}
        >
          {label} :
        </label>
      )}
      <input
        type={type}
        className={`border rounded px-2 py-1 w-full ${
          disabled ? "bg-gray-100" : ""
        }`}
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
