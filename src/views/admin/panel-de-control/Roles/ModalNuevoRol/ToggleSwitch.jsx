import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Interruptor accesible. Mientras `loading` es true muestra un spinner dentro de la perilla y se bloquea,
 * para que el usuario vea que el cambio se está guardando y no lo repita.
 */
export default function ToggleSwitch({ checked, loading = false, disabled = false, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={loading}
      disabled={disabled || loading}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6b03] focus-visible:ring-offset-2
        ${checked ? 'bg-emerald-500' : 'bg-gray-300'}
        ${loading ? 'cursor-wait' : disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform duration-200
          ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      >
        {loading && <FontAwesomeIcon icon={faSpinner} spin className="text-[10px] text-gray-600" />}
      </span>
    </button>
  );
}
