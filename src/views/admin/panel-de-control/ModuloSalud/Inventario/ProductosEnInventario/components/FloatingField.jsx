import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export const PRESENTACIONES_OPTIONS = [
  {
    group: '💊 Sólidas',
    items: ['Tableta / comprimido', 'Cápsula', 'Gragea', 'Polvo', 'Granulado', 'Pastilla', 'Tableta masticable', 'Tableta sublingual', 'Tableta efervescente']
  },
  {
    group: '🧴 Líquidas',
    items: ['Jarabe', 'Solución oral', 'Suspensión', 'Gotas', 'Emulsión', 'Elixir']
  },
  {
    group: '💉 Inyectables',
    items: ['Ampolla', 'Vial / frasco ampolla', 'Jeringa prellenada', 'Solución inyectable', 'Suspensión inyectable']
  },
  {
    group: '🧴 Uso tópico (piel)',
    items: ['Crema', 'Pomada', 'Ungüento', 'Gel', 'Loción', 'Pasta', 'Spray']
  },
  {
    group: '👁️ Otras vías',
    items: [
      'Oftálmica: gotas o solución ocular',
      'Ótica: gotas para los oídos',
      'Nasal: gotas o spray nasal',
      'Rectal: supositorio o enema',
      'Vaginal: óvulo, crema o gel vaginal',
      'Inhalatoria: inhalador, aerosol o nebulización',
      'Transdérmica: parche'
    ]
  }
];

export function FloatingInput({ id, label, value, onChange, type = 'text', min, required = false, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        min={min}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#084788] peer"
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1 peer-focus:px-2 peer-focus:text-[#084788] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4"
      >
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}

export function FloatingAutocomplete({ id, label, value, onChange, groupedOptions, required = false, className = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterText = (value || '').trim().toLowerCase();
  const filteredGroups = groupedOptions
    .map((g) => ({ ...g, items: g.items.filter((item) => item.toLowerCase().includes(filterText)) }))
    .filter((g) => g.items.length > 0);

  const handleSelect = (item) => {
    onChange({ target: { value: item } });
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setOpen(true)}
        placeholder=" "
        autoComplete="off"
        className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#084788] peer"
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1 peer-focus:px-2 peer-focus:text-[#084788] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4"
      >
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {open && filteredGroups.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
          {filteredGroups.map((g) => (
            <li key={g.group}>
              <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">{g.group}</div>
              {g.items.map((item) => (
                <div
                  key={item}
                  onMouseDown={() => handleSelect(item)}
                  className="px-3 py-1.5 cursor-pointer hover:bg-[#084788] hover:text-white"
                >
                  {item}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FloatingSelect({ id, label, value, onChange, options, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#084788] peer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-200 transform -translate-y-4 scale-90 top-2 z-10 origin-[0] bg-white px-2 left-1 peer-focus:text-[#084788]"
      >
        {label}
      </label>
      <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none absolute right-3 top-1/2 -translate-y-3 text-gray-400 text-xs" />
    </div>
  );
}
