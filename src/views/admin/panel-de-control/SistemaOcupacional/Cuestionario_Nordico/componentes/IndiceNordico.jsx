import { createPortal } from "react-dom";

/**
 * Índice horizontal del Cuestionario Nórdico.
 *
 * Se renderiza dos veces desde el formulario:
 *  - `mode="inline"`  → una vez, al inicio del bloque del cuestionario, en el flujo.
 *  - `mode="fixed"`   → barra fija arriba (`position: fixed`, no `sticky`: los
 *    contenedores `.container/.mainContent` de SistemaOcupacional usan
 *    `overflow: hidden` y eso rompe `position: sticky`). Aparece/desaparece con
 *    `visible` mientras se recorren las secciones 1 → 5.
 *
 * La variante fija se monta con `createPortal` directamente en `document.body`:
 * así `top: 0` siempre queda pegado al borde del viewport y ningún ancestro con
 * `transform`/`filter` puede "empujarla" hacia abajo.
 */

const Brand = () => (
  <div className="hidden shrink-0 items-center gap-[8px] md:flex">
    <span className="grid h-8 w-8 place-items-center rounded bg-primario text-[12px] font-bold text-white">
      CN
    </span>
    <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">
      Cuestionario Nórdico
    </span>
  </div>
);

const Chips = ({ items, activeId, onNavigate }) => (
  <ol className="scrollbar-tabs flex flex-1 items-center gap-[8px] overflow-x-auto py-[2px]">
    {items.map((s) => {
      const active =
        activeId === s.id || (activeId || "").startsWith(`${s.id}-`);
      return (
        <li key={s.id} className="shrink-0">
          <a
            href={`#${s.id}`}
            onClick={(e) => onNavigate(e, s.id)}
            className={`flex items-center gap-[8px] rounded-lg border px-[16px] py-[8px] text-lg transition-colors ${
              active
                ? "border-primario bg-primario font-semibold text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-primario/50 hover:text-primario"
            }`}
          >
            <span
              className={`text-[12px] font-bold tabular-nums ${
                active ? "text-white/75" : "text-primario/60"
              }`}
            >
              {s.num}
            </span>
            <span className="whitespace-nowrap">{s.label}</span>
          </a>
        </li>
      );
    })}
  </ol>
);

export default function IndiceNordico({
  secciones,
  activeId,
  onNavigate,
  mode = "inline",
  visible = false,
}) {
  const items = secciones.filter((s) => !s.sub);

  if (mode === "fixed") {
    if (typeof document === "undefined") return null;
    return createPortal(
      <nav
        aria-hidden={!visible}
        className={`fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
          visible ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
        style={{ top: 0 }}
      >
        <div className="mx-auto flex max-w-[95%] items-center gap-[16px] px-4 py-[8px] xl:max-w-[85%]">
          <Brand />
          <Chips items={items} activeId={activeId} onNavigate={onNavigate} />
        </div>
      </nav>,
      document.body
    );
  }

  return (
    <nav className="rounded-lg border border-gray-200 bg-primarioClaro">
      <div className="flex items-center gap-[16px] px-[16px] py-[10px]">
        <Brand />
        <Chips items={items} activeId={activeId} onNavigate={onNavigate} />
      </div>
    </nav>
  );
}
