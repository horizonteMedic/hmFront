import { useMemo, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RevertButton from "./RevertButton";

const MAX_SUGERENCIAS = 100;

/**
 * Input con sugerencias, con la misma apariencia que InputTextOneLine (etiqueta en línea,
 * resaltado de campo editado + botón de revertir, error y asterisco de obligatorio).
 *
 * El texto lo controla quien lo usa (`value` / `onChange`); aquí solo vive si el desplegable está
 * abierto. Enter elige la primera sugerencia y, si no hay ninguna, pasa al campo `nextFocusId`.
 *
 * @param {string}   value            Texto actual del campo.
 * @param {Function} onChange         (texto en MAYÚSCULAS) => void. Se llama mientras se escribe.
 * @param {Function} onSelect         (opcion) => void. Se llama al elegir una sugerencia.
 * @param {Array}    options          Lista de opciones (objetos o textos).
 * @param {Function} getLabel         opcion => texto que se muestra y se filtra (por defecto `opcion.mensaje`).
 * @param {Function} getKey           opcion => clave estable de la fila (por defecto `opcion.id` o su texto).
 * @param {string}   nextFocusId      id del campo al que se pasa tras elegir.
 * @param {boolean}  estricto         Enter solo elige una coincidencia exacta (o la única sugerencia);
 *                                    si no la hay llama a `onSinCoincidencia`.
 * @param {boolean}  soloSeleccion    El texto escrito NO es el valor: solo cambia al elegir una opción
 *                                    (`onChange` no se llama). Al salir sin elegir, vuelve a `value`
 *                                    (salvo que lo escrito coincida exactamente con una opción).
 * @param {boolean}  mostrarTodo      Abre el desplegable también sin texto.
 * @param {ReactNode} children        Se muestra a la derecha del input (p. ej. un botón "Agregar").
 */
export default function InputAutocomplete({
  label = "",
  name,
  value,
  onChange = () => {},
  onSelect = () => {},
  options = [],
  getLabel = (opcion) => opcion?.mensaje ?? "",
  getKey,
  placeholder = "Escribe para buscar...",
  disabled = false,
  labelWidth = "80px",
  labelOnTop = false,
  className = "",
  required = false,
  error = "",
  edited = false,
  onRevert,
  nextFocusId,
  estricto = false,
  soloSeleccion = false,
  mostrarTodo = false,
  onSinCoincidencia,
  children,
}) {
  const [abierto, setAbierto] = useState(false);
  const [escribiendo, setEscribiendo] = useState(null); // solo en `soloSeleccion`: texto aún no elegido
  const hasError = Boolean(error);
  const showRevert = edited && typeof onRevert === "function";

  const texto = soloSeleccion && escribiendo !== null ? escribiendo : value ?? "";
  const lista = useMemo(() => (Array.isArray(options) ? options : []), [options]);

  // En `soloSeleccion` sin haber escrito se ofrecen todas las opciones (para poder cambiar la elegida).
  const filtro = soloSeleccion ? escribiendo ?? "" : texto;
  const sugerencias = useMemo(() => {
    if (!abierto || (!filtro && !mostrarTodo && !soloSeleccion)) return [];
    const buscado = filtro.toLowerCase();
    return lista.filter((o) => getLabel(o).toLowerCase().includes(buscado)).slice(0, MAX_SUGERENCIAS);
    // getLabel suele ser una función en línea: depender de ella redibujaría la lista en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, filtro, lista, mostrarTodo, soloSeleccion]);

  const irAlSiguiente = () => {
    if (nextFocusId) document.getElementById(nextFocusId)?.focus();
  };

  const elegir = (opcion) => {
    onSelect(opcion);
    setAbierto(false);
    setEscribiendo(null);
    irAlSiguiente();
  };

  const alPresionar = (e) => {
    if (e.key !== "Enter") return;
    // Sin haber escrito nada, Enter solo avanza: no debe reemplazar la opción ya elegida.
    const candidatas = soloSeleccion && escribiendo === null ? [] : sugerencias;
    if (estricto) {
      e.preventDefault();
      const exacta =
        candidatas.length === 1
          ? candidatas[0]
          : lista.find((o) => getLabel(o).trim().toUpperCase() === texto.trim().toUpperCase());
      if (exacta) elegir(exacta);
      else onSinCoincidencia?.();
    } else if (candidatas.length > 0) {
      e.preventDefault();
      elegir(candidatas[0]);
    } else if (nextFocusId) {
      e.preventDefault();
      irAlSiguiente();
    }
  };

  const alEscribir = (e) => {
    const nuevo = e.target.value.toUpperCase();
    if (soloSeleccion) setEscribiendo(nuevo);
    else onChange(nuevo);
    setAbierto(true);
  };

  // Prioridad de estilos del borde: error (rojo) > editado (naranja) > normal.
  const stateClasses = hasError ? "border-red-500 bg-red-50" : edited ? "border-orange-400 bg-orange-100" : "";

  return (
    <div className={className}>
      <div className={labelOnTop ? "flex flex-col gap-2" : "flex items-center gap-4"}>
        {label && (
          <label
            className="font-semibold"
            style={labelOnTop ? {} : { minWidth: labelWidth, maxWidth: labelWidth }}
            htmlFor={name}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>} :
          </label>
        )}
        <div className="w-full flex items-center gap-1.5">
          <div className="relative flex-1 min-w-0">
            <input
              id={name}
              name={name}
              type="text"
              autoComplete="off"
              value={texto}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${name}-error` : undefined}
              onChange={alEscribir}
              onKeyDown={alPresionar}
              onFocus={() => setAbierto(true)}
              onClick={() => setAbierto(true)}
              onBlur={() => {
                // En `soloSeleccion`, un texto que coincide exactamente con una opción cuenta como elegida.
                if (soloSeleccion && escribiendo !== null) {
                  const exacta = lista.find((o) => getLabel(o).trim().toUpperCase() === escribiendo.trim().toUpperCase());
                  if (exacta) onSelect(exacta);
                }
                setAbierto(false);
                setEscribiendo(null);
              }}
              className={`border rounded px-2 py-1 w-full ${disabled ? "bg-gray-300" : ""} ${stateClasses}`}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded border border-gray-300 bg-white py-0.5 shadow-lg">
                {sugerencias.map((opcion) => (
                  <li
                    key={getKey ? getKey(opcion) : opcion?.id ?? getLabel(opcion)}
                    className="cursor-pointer px-2 py-1 hover:bg-blue-50"
                    onMouseDown={(e) => {
                      e.preventDefault(); // evita que el input pierda el foco antes de elegir
                      elegir(opcion);
                    }}
                  >
                    {getLabel(opcion)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showRevert && <RevertButton onClick={onRevert} />}
          {children}
        </div>
      </div>
      {hasError && (
        <p id={`${name}-error`} className="flex items-center gap-1.5 mt-1 text-sm text-red-600 animate-field-error">
          <FontAwesomeIcon icon={faCircleExclamation} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
