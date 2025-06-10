// ./components/AutocompleteSelect.jsx
import React, { useState } from 'react';

export const AutocompleteSelect = ({
  title,
  nombre,
  value,
  disabled,
  options = [],
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showList, setShowList] = useState(false);
  const containerRef = React.useRef(null);

  const selectedOption = options.find(opt => opt.id === value);
  const displayedValue = selectedOption ? selectedOption.nombre : searchTerm;

  const filteredOptions = searchTerm
    ? options.filter(opt =>
        opt.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleInputChange = e => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowList(true);
    if (!newValue) {
      onChange({ target: { name: nombre, value: '' } });
    }
  };

  const handleSelectOption = option => {
    setSearchTerm('');
    onChange({ target: { name: nombre, value: option.id } });
    setShowList(false);
  };

  // Cerrar al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col">
      <label htmlFor={nombre} className="block w-36 mb-1">{title}:</label>
      <input
        type="text"
        id={nombre}
        name={nombre}
        disabled={disabled}
        value={displayedValue}
        onChange={handleInputChange}
        onFocus={() => setShowList(true)}
        placeholder="Buscar..."
        className="border border-gray-300 px-3 py-1 rounded-md focus:outline-none bg-white w-full"
      />
      {showList && (
        <ul className="border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto absolute z-10 bg-white w-72">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li
                key={option.id}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
              >
                {option.nombre}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No se encontraron resultados</li>
          )}
        </ul>
      )}
    </div>
  );
};