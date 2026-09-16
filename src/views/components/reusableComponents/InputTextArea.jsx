import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RevertButton from "./RevertButton";

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
  classNameArea = "",
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
    ? "border-orange-600 bg-orange-100"
    : "";

  return (
    <div className={`w-full ${className}`}>
      {(label || showRevert) && (
        <div className="flex items-center justify-between mb-1">
          {label ? (
            <label className={`block font-semibold ${classNameLabel}`} htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>} :
            </label>
          ) : (
            <span />
          )}
          {showRevert && <RevertButton onClick={onRevert} />}
        </div>
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
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`border rounded px-2 py-1 w-full resize-none transition-colors duration-150 ${classNameArea} ${
          disabled ? "bg-gray-300" : ""
        } ${stateClasses}`}
      />
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
