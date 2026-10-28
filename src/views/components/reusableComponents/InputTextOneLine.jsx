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
  max,
  labelWidth = "80px",
  labelOnTop = false,
  // En mobile apila la etiqueta sobre el input; desde sm: vuelve a fila con `labelWidth` (comportamiento normal).
  stackOnMobile = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  edited = false,
  onRevert,
  required = false,
  error = "",
  autocomplete = "on",
  placeholder,
  maxLength,
  inputMode,
}) {
  const showRevert = edited && typeof onRevert === "function";
  const hasError = Boolean(error);

  // Prioridad de estilos del borde: error (rojo) > editado (naranja) > normal.
  const stateClasses = hasError
    ? "border-red-500 bg-red-50"
    : edited
      ? "border-orange-400 bg-orange-100"
      : "";

  const wrapperClass = labelOnTop
    ? "flex flex-col gap-2"
    : stackOnMobile
      ? "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4"
      : "flex items-center gap-4";

  // El ancho de la etiqueta llega por variable CSS para poder aplicarlo solo desde sm: cuando se apila en mobile.
  const labelStyle = labelOnTop
    ? {}
    : stackOnMobile
      ? { "--label-w": labelWidth }
      : { minWidth: labelWidth, maxWidth: labelWidth };

  return (
    <div className={className}>
      <div className={wrapperClass}>
        {label && (
          <label
            className={`font-semibold ${stackOnMobile && !labelOnTop ? "sm:min-w-[var(--label-w)] sm:max-w-[var(--label-w)]" : ""} ${labelClassName}`}
            style={labelStyle}
            htmlFor={name}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>} :
          </label>
        )}
        {/* El contenedor y el <input> se renderizan siempre igual (nunca condicionalmente),
            para que React no lo desmonte/remonte -y pierda el foco- cuando `showRevert`
            cambia de valor mientras el usuario escribe. */}
        <div className="w-full flex items-center gap-1.5">
          <input
            type={type}
            max={max}
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
            autoComplete={autocomplete}
            placeholder={placeholder}
            maxLength={maxLength}
            inputMode={inputMode}
          />
          {showRevert && <RevertButton onClick={onRevert} />}
        </div>
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
