import { useRef, useLayoutEffect } from "react";
import RevertButton from "./RevertButton";

/**
 * Igual que InputTextArea pero aplica toUpperCase() automáticamente
 * y preserva la posición del cursor tras cada actualización.
 *
 * onChange recibe (valorEnMayusculas: string) en vez del evento completo.
 * `edited`/`onRevert` (opcionales) resaltan el campo modificado y muestran el botón de revertir.
 */
export default function InputTextAreaUpper({
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
}) {
    const showRevert = edited && typeof onRevert === "function";
    const textareaRef = useRef(null);
    const cursorRef = useRef(null);

    useLayoutEffect(() => {
        if (textareaRef.current && cursorRef.current !== null) {
            textareaRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
            cursorRef.current = null;
        }
    }, [value]);

    const handleChange = (e) => {
        cursorRef.current = e.target.selectionStart;
        onChange?.(e.target.value.toUpperCase(), e);
    };

    return (
        <div className={`w-full ${className}`}>
            {(label || showRevert) && (
                <div className="flex items-center justify-between mb-1">
                    {label && (
                        <label className={`block font-semibold ${classNameLabel}`} htmlFor={name}>
                            {label} :
                        </label>
                    )}
                    {showRevert && <RevertButton onClick={onRevert} className="ml-auto" />}
                </div>
            )}
            <textarea
                ref={textareaRef}
                id={name}
                name={name}
                rows={rows}
                value={value ?? ""}
                onBlur={onBlur}
                onKeyUp={onKeyUp}
                onChange={handleChange}
                disabled={disabled}
                className={`border rounded px-2 py-1 w-full resize-none ${classNameArea} ${
                    disabled ? "bg-gray-300" : ""
                } ${edited ? "border-orange-600 bg-orange-100" : ""}`}
            />
        </div>
    );
}
