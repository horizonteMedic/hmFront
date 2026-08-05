import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  required = false,
  error = "",
}) {
  const showRevert = edited && typeof onRevert === "function";
  const hasError = Boolean(error);

  // Prioridad de estilos del borde: error (rojo) > editado (naranja) > normal.
  const stateClasses = hasError
    ? "border-red-500 bg-red-50"
    : edited
    ? "border-orange-400 bg-orange-100"
    : "";

  const inputEl = (
    <input
      type={type}
      className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-300" : ""
        } ${stateClasses} ${inputClassName}`}
      id={name}
      name={name}
      value={value ?? ""}
      onKeyUp={onKeyUp}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${name}-error` : undefined}
    />
  );

  return (
    <div className={className}>
      <div className={`${labelOnTop ? "flex flex-col gap-2" : "flex items-center gap-4"}`}>
        {label && (
          <label
            className={`font-semibold ${labelClassName}`}
            style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
            htmlFor={name}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>} :
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
      {hasError && (
        <p
          id={`${name}-error`}
          className="flex items-center gap-1.5 mt-1 text-sm text-red-600 animate-field-error"
        >
          <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
