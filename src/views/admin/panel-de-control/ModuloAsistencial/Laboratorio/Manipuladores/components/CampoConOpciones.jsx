import { InputTextOneLine } from '../../../../../../components/reusableComponents/ResusableComponents';

// "__ x campo": quita o agrega " X CAMPO" al valor (conserva el número digitado: "3 X CAMPO").
const alternarXCampo = (actual = "") => {
  if (/x campo/i.test(actual)) return actual.replace(/ *x campo/gi, "").trim();
  return /\d/.test(actual) ? `${actual.trim()} X CAMPO`.toUpperCase() : "X CAMPO";
};

/**
 * Campo de texto con opciones rápidas debajo (casillas que fijan o limpian el valor). El valor guardado es la
 * opción en mayúsculas; volver a marcarla restaura `vacio`.
 *
 * @param {string}   label
 * @param {string}   name
 * @param {string}   value
 * @param {Function} onChange   Evento del input (handleChange de useForm).
 * @param {Function} onSelect   (valor) => void; recibe el nuevo valor al marcar una casilla.
 * @param {string[]} opciones   Casillas; el texto es la etiqueta.
 * @param {boolean}  xCampo     Agrega la casilla "__ x campo".
 * @param {string}   vacio      Valor al desmarcar ("" o "-").
 * @param {boolean}  labelOnTop Etiqueta sobre el input (sin sangría para las casillas).
 */
export default function CampoConOpciones({
  label,
  name,
  value,
  onChange,
  onSelect,
  opciones = [],
  xCampo = false,
  vacio = "",
  disabled,
  edited,
  onRevert,
  labelOnTop = false,
}) {
  const casilla = (clave, etiqueta, marcada, alAlternar) => (
    <label key={clave} className="flex items-center gap-2 text-xs md:text-sm">
      <input type="checkbox" disabled={disabled} checked={marcada} onChange={alAlternar} />
      {etiqueta}
    </label>
  );

  return (
    <div className="space-y-2">
      <InputTextOneLine
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        edited={edited}
        onRevert={onRevert}
        labelWidth="120px"
        labelOnTop={labelOnTop}
      />
      <div className="flex items-start gap-4">
        {!labelOnTop && <span className="hidden md:block shrink-0" style={{ width: "120px" }} />}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {opciones.map((opcion) => {
            const valor = opcion.toUpperCase();
            return casilla(opcion, opcion, value === valor, () => onSelect(value === valor ? vacio : valor));
          })}
          {xCampo && casilla("x-campo", "__ x campo", /x campo/i.test(value ?? ""), () => onSelect(alternarXCampo(value ?? "")))}
        </div>
      </div>
    </div>
  );
}
