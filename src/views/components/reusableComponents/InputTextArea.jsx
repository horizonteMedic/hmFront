export default function InputTextArea({
  label = "",
  name,
  value,
  onChange,
  onKeyUp,
  disabled = false,
  rows = 1,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block font-semibold mb-1" htmlFor={name}>
          {label}:
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value ?? ""}
        onKeyUp={onKeyUp}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded px-2 py-1 w-full resize-none ${
          disabled ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}
