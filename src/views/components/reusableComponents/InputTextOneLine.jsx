import RevertButton from "./RevertButton";

export default function InputTextOneLine({
  label = "",
  name,
  value,
  onChange,
  onKeyUp,
  onBlur,
  disabled = false,
  type = "text",
  labelWidth = "80px",
  labelOnTop = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  edited = false,
  onRevert,
}) {
  const showRevert = edited && typeof onRevert === "function";

  const inputEl = (
    <input
      type={type}
      className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-300" : ""
        } ${edited ? "border-orange-400 bg-orange-100" : ""} ${inputClassName}`}
      id={name}
      name={name}
      value={value ?? ""}
      onKeyUp={onKeyUp}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );

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
      {showRevert ? (
        <div className="w-full flex items-center gap-1.5">
          {inputEl}
          <RevertButton onClick={onRevert} />
        </div>
      ) : (
        inputEl
      )}
    </div>
  );
}
