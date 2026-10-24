import { useMemo, useState } from 'react';
import { INPUT } from './estilos.js';

const MAX_SUGERENCIAS = 100;
const textoDe = (opcion) => opcion?.mensaje ?? '';

// Input con sugerencias. El texto lo controla quien lo usa (`value` / `onChange`); aquí solo vive
// si el desplegable está abierto. Enter elige la primera sugerencia; con `estricto` solo elige
// una coincidencia exacta (o la única sugerencia) y, si no la hay, avisa con `onSinCoincidencia`.
// `children` se muestra a la derecha del input (p. ej. un botón "Agregar").
const AutocompleteInput = ({
  id,
  name = id,
  value,
  onChange,
  onSelect,
  opciones,
  placeholder,
  disabled,
  siguienteId,
  estricto = false,
  onSinCoincidencia,
  children,
}) => {
  const [abierto, setAbierto] = useState(false);
  const texto = value ?? '';
  const lista = useMemo(() => (Array.isArray(opciones) ? opciones : []), [opciones]);

  const sugerencias = useMemo(() => {
    if (!abierto || !texto) return [];
    const buscado = texto.toLowerCase();
    return lista.filter((o) => textoDe(o).toLowerCase().includes(buscado)).slice(0, MAX_SUGERENCIAS);
  }, [abierto, texto, lista]);

  const elegir = (opcion) => {
    onSelect(opcion);
    setAbierto(false);
    if (siguienteId) document.getElementById(siguienteId)?.focus();
  };

  const alPresionar = (e) => {
    if (e.key !== 'Enter') return;
    if (estricto) {
      e.preventDefault();
      const exacta =
        sugerencias.length === 1
          ? sugerencias[0]
          : lista.find((o) => textoDe(o).trim().toUpperCase() === texto.trim().toUpperCase());
      if (exacta) elegir(exacta);
      else onSinCoincidencia?.();
    } else if (sugerencias.length > 0) {
      e.preventDefault();
      elegir(sugerencias[0]);
    }
  };

  return (
    <div className="flex items-center gap-[8px]">
      <div className="relative min-w-0 flex-1">
        <input
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          value={texto}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            onChange(e.target.value.toUpperCase());
            setAbierto(true);
          }}
          onKeyDown={alPresionar}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          className={INPUT}
        />
        {sugerencias.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-[200px] overflow-y-auto rounded-md border-[1px] border-slate-300 bg-white py-[2px] shadow-[0_4px_12px_rgba(15,23,42,0.15)]">
            {sugerencias.map((opcion) => (
              <li
                key={opcion.id ?? textoDe(opcion)}
                className="cursor-pointer px-[10px] py-[5px] text-lg font-semibold hover:bg-blue-50"
                onMouseDown={(e) => {
                  e.preventDefault(); // evita que el input pierda el foco antes de elegir
                  elegir(opcion);
                }}
              >
                {textoDe(opcion)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  );
};

export default AutocompleteInput;
