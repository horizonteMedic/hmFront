import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RevertButton from "./RevertButton";

export function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Seleccionar...",
    hidePlaceHolder = false,
    inline = false,
    labelWidth = "120px",
    disabled = false,
    required = false,
    error = "",
    edited = false,
    onRevert,
}) {
    const hasError = Boolean(error);
    const showRevert = edited && typeof onRevert === "function";
    const stateClasses = hasError
        ? "border-red-500 bg-red-50"
        : edited
            ? "border-orange-400 bg-orange-100"
            : "border-gray-300";

    const select = (
        <div className="w-full flex items-center gap-1.5">
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
                className={`pointer border px-3 py-2 rounded-md w-full focus:outline-none ${disabled ? "bg-gray-300" : ""} ${stateClasses}`}
            >
                {!hidePlaceHolder && <option value="">{placeholder}</option>}
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            {showRevert && <RevertButton onClick={onRevert} />}
        </div>
    );

    const errorMsg = hasError && (
        <p id={`${name}-error`} className="flex items-center gap-1.5 mt-1 text-sm text-red-600 animate-field-error">
            <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
            <span>{error}</span>
        </p>
    );

    if (inline) {
        return (
            <div>
                <div className="flex items-center gap-4 flex-grow">
                    {label && (
                        <label className="font-semibold" style={{ minWidth: labelWidth, maxWidth: labelWidth }}>
                            {label}
                            {required && <span className="text-red-500 ml-0.5">*</span>} :
                        </label>
                    )}
                    {select}
                </div>
                {errorMsg}
            </div>
        );
    }
    return (
        <div className="flex flex-col flex-grow">
            <p className="font-semibold">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </p>
            {select}
            {errorMsg}
        </div>
    );
}