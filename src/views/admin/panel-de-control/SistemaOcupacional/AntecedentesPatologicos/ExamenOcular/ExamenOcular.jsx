import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";

// Valor de solo lectura que se adapta a su contenido: el texto salta de línea y la caja crece,
// en vez de recortarse como en un <input> de ancho fijo.
function ValorLectura({ label, value, rojo = false }) {
  return (
    <div className="min-w-0">
      <span className="block text-xs font-semibold text-gray-700 mb-0.5">{label}</span>
      <div
        className={`min-h-[2rem] px-2 py-1 border rounded bg-gray-300 whitespace-pre-wrap break-words ${rojo ? "text-red-500" : ""}`}
      >
        {value || " "}
      </div>
    </div>
  );
}

// Columnas que se acomodan solas según el ancho disponible (sin breakpoints fijos).
const grillaAuto = (min) => ({ gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))` });

function AgudezaOjos({ titulo, campos, form }) {
  return (
    <div>
      <div className="font-semibold mb-2 text-center">{titulo}</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {campos.map(({ ojo, items }) => (
          <div key={ojo} className="space-y-2 min-w-0">
            <div className="font-semibold text-center">{ojo}</div>
            {items.map(([label, name]) => (
              <ValorLectura key={name} label={label} value={form[name]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const SIN_CORREGIR = [
  { ojo: "O.D", items: [["V.C.", "vcOD"], ["V.L.", "vlOD"]] },
  { ojo: "O.I", items: [["V.C.", "vcOI"], ["V.L.", "vlOI"]] },
];

const CORREGIDA = [
  { ojo: "O.D", items: [["V.C.", "vcCorregidaOD"], ["V.L.", "vlCorregidaOD"]] },
  { ojo: "O.I", items: [["V.C.", "vcCorregidaOI"], ["V.L.", "vlCorregidaOI"]] },
];

/** Examen ocular (solo lectura: datos de Oftalmología y Laboratorio del N° de orden). */
export default function ExamenOcular({ form }) {
  return (
    <SectionFieldset legend="Examen Ocular">
      <div className="space-y-4">
        <AgudezaOjos titulo="Sin Corregir" campos={SIN_CORREGIR} form={form} />
        <AgudezaOjos titulo="Corregida" campos={CORREGIDA} form={form} />

        <div className="grid gap-x-3 gap-y-2" style={grillaAuto("5.5rem")}>
          <ValorLectura label="V.Clrs" value={form.vclrs} />
          <ValorLectura label="V.B." value={form.vb} />
          <ValorLectura label="R.P." value={form.rp} />
        </div>

        <ValorLectura label="Enfermedades Oculares" value={form.enfermedadesOculares} />

        <div className="grid gap-x-3 gap-y-2" style={grillaAuto("7rem")}>
          <ValorLectura label="Cocaína" value={form.cocaina} rojo={form.cocainaRed} />
          <ValorLectura label="Marihuana" value={form.marihuana} rojo={form.marihuanaRed} />
        </div>
      </div>
    </SectionFieldset>
  );
}
