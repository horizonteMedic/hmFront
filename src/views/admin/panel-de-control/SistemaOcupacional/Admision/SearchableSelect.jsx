import { useState, useRef, useEffect } from 'react';

function SearchableSelect({  
  options = [],            // array de objetos o strings
  value,                   // valor actual (string)
  onSelect,                // callback al elegir
  placeholder = '',        // texto placeholder
  nextFocusId = null       // id para enfocar al dar Enter
}) {
  const [search, setSearch] = useState(value);
  const [filtered, setFiltered] = useState([]);
  const wrapper = useRef();

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    if (search === '') {
      setFiltered([]);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        options.filter(opt =>
          (typeof opt === 'string' ? opt : opt.nombre || opt.descripcion)
            .toLowerCase()
            .includes(lower)
        )
      );
    }
  }, [search, options]);

  const handleKey = e => {
    if (e.key === 'Enter' && filtered.length > 0) {
      const opt = filtered[0];
      onSelect(opt);
      setFiltered([]);
      if (nextFocusId) document.getElementById(nextFocusId)?.focus();
    }
  };

  // cierra dropdown al hacer clic fuera
  useEffect(() => {
    const onClick = ev => {
      if (wrapper.current && !wrapper.current.contains(ev.target)) {
        setFiltered([]);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="relative" ref={wrapper}>
      <input
        type="text"
        value={search}
        placeholder={placeholder}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={handleKey}
        className="border border-gray-300 px-3 py-2 rounded-md w-full"
      />
      {filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto mt-1">
          {filtered.map((opt, i) => {
            const label = typeof opt === 'string' ? opt : opt.nombre || opt.descripcion;
            return (
              <li
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(opt);
                  setFiltered([]);
                  if (nextFocusId) document.getElementById(nextFocusId)?.focus();
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchableSelect;
