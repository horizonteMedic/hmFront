import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
