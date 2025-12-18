export default function InputTextArea({
  label = "",
  name,
  value,
  onChange,
  onKeyUp,
  disabled = false,
  onBlur,
  rows = 1,
  className = "",
  classNameLabel = "",
  classNameArea = ""
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block font-semibold mb-1 ${classNameLabel}`} htmlFor={name}>
          {label} :
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value ?? ""}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded px-2 py-1 w-full resize-none ${classNameArea} ${
          disabled ? "bg-gray-300" : ""
        }`}
      />
    </div>
  );
}
