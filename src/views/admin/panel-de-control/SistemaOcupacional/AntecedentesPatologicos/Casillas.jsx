import InputCheckbox from "../../../../components/reusableComponents/InputCheckbox";

/**
 * Grilla de casillas de verificación en columnas.
 *
 * @param {Array<Array<[string, string]>>} columnas  Cada columna es una lista de [campo, etiqueta].
 * @param {object}   form      Estado del formulario (cada casilla lee `form[campo]`).
 * @param {Function} onChange  Handler de las casillas (handleCheckBoxChange de useForm).
 * @param {boolean}  disabled  Bloquea todas las casillas (edición no habilitada).
 * @param {string}   className Clases de la grilla (con sus columnas literales, p. ej. "grid grid-cols-3 gap-2").
 */
export default function Casillas({
  columnas,
  form,
  onChange,
  disabled = false,
  className = "grid grid-cols-3 gap-2",
  espacio = "space-y-2",
}) {
  return (
    <div className={className}>
      {columnas.map((columna, i) => (
        <div key={i} className={espacio}>
          {columna.map(([name, label]) => (
            <InputCheckbox
              key={name}
              label={label}
              name={name}
              checked={form?.[name]}
              onChange={onChange}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
