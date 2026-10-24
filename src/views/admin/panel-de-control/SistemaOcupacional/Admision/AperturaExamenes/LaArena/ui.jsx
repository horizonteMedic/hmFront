import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { INPUT } from './estilos.js';

export const Seccion = ({ icono, titulo, derecha = null, children }) => (
  <section className="rounded-lg border-[1px] border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
    <div className="flex items-center justify-between gap-2 rounded-t-lg border-b border-slate-200 bg-slate-50 px-[14px] py-[8px]">
      <h3 className="mb-0 flex items-center gap-[8px] text-lg font-bold text-primario">
        <FontAwesomeIcon icon={icono} className="text-blue-800" />
        {titulo}
      </h3>
      {derecha}
    </div>
    <div className="p-[14px]">{children}</div>
  </section>
);

export const Campo = ({ label, htmlFor, className = '', children }) => (
  <div className={`flex min-w-0 flex-col gap-[3px] ${className}`}>
    <label htmlFor={htmlFor} className="mb-0 text-lg font-semibold">
      {label}
    </label>
    {children}
  </div>
);

const textoOpcion = (opcion) => opcion.mensaje || opcion.descripcion;

export const Selector = ({ id, name = id, value, onChange, opciones, disabled, vacio = 'Seleccione una opción...' }) => {
  const lista = Array.isArray(opciones) ? opciones : [];
  return (
    <select id={id} name={name} value={value ?? ''} onChange={onChange} disabled={disabled} className={INPUT}>
      <option value="">{vacio}</option>
      {lista.map((opcion, i) => (
        <option key={opcion.id ?? i} value={textoOpcion(opcion)}>
          {textoOpcion(opcion)}
        </option>
      ))}
    </select>
  );
};
