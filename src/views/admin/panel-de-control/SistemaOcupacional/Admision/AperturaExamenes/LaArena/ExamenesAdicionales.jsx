import { EXAMENES_ADICIONALES } from './constantes.js';

const ExamenesAdicionales = ({ datos, disabled, onToggle }) => (
  <div className="grid grid-cols-2 gap-x-[8px] gap-y-[6px]">
    {EXAMENES_ADICIONALES.map(({ name, title }) => {
      const marcado = Boolean(datos[name]);
      return (
        <label
          key={name}
          htmlFor={name}
          className={`mb-0 flex items-center gap-[8px] rounded-md border-[1px] px-[8px] py-[4px] text-lg font-semibold leading-tight transition-colors ${
            marcado ? 'border-blue-400 bg-blue-50 text-blue-900' : 'border-slate-200 bg-white'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-blue-300'}`}
        >
          <input type="checkbox" id={name} name={name} checked={marcado} disabled={disabled} onChange={onToggle} />
          <span>{title}</span>
        </label>
      );
    })}
  </div>
);

export default ExamenesAdicionales;
