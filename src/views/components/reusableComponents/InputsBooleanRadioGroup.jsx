import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RevertButton from "./RevertButton";

export default function InputsBooleanRadioGroup({
  name,
  value,
  onChange,
  trueLabel = "SÍ",
  falseLabel = "NO",
  disabled = false,
  //nuevo opcional
  label = "",
  labelOnTop = false,
  // En mobile apila la etiqueta sobre los radios; desde sm: vuelve a fila (comportamiento normal).
  stackOnMobile = false,
  labelWidth = "80px",
  className = "",
  labelClassName = "",
  groupClassName = "",
  vertical = false,
  edited = false,
  onRevert,
  required = false,
  error = "",
}) {
  const trueId = `${name}-true`;
  const falseId = `${name}-false`;
  const showRevert = edited && typeof onRevert === "function";
  const hasError = Boolean(error);

  const styleButton = ` w-5 h-5
                        rounded-md
                        accent-primario
                        border border-primario
                        cursor-pointer
                        disabled:cursor-not-allowed
                        disabled:opacity-50 `

  const wrapperClass = labelOnTop
    ? "flex flex-col gap-2"
    : stackOnMobile
    ? "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4"
    : "flex items-center gap-4";

  return (
    <div className={className}>
      <div className={wrapperClass}>
        {label && (
          <label
            className={`font-semibold ${labelClassName}`}
            style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
            htmlFor={trueId}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>} :
          </label>
        )}

        <div className="flex items-start gap-2">
          <div className={`flex ${vertical ? "flex-col gap-y-2" : "flex-row gap-4"} ${groupClassName}`}>
            <label className="flex items-center gap-1" htmlFor={trueId}>
              <input
                id={trueId}
                type="radio"
                name={name}
                value="true"
                checked={value === true}
                onChange={(e) => (disabled ? null : onChange(e, true))}
                className={styleButton}
              // disabled={disabled}
              />
              <span>{trueLabel}</span>
            </label>

            <label className="flex items-center gap-1" htmlFor={falseId}>
              <input
                id={falseId}
                type="radio"
                name={name}
                value="false"
                checked={value === false}
                onChange={(e) => (disabled ? null : onChange(e, false))}
                // disabled={disabled}
                className={styleButton}
              />
              <span>{falseLabel}</span>
            </label>
          </div>
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
