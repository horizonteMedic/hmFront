import { formatearFechaCorta } from "../../../utils/formatDateUtils";

const SEXOS = { M: "Masculino", F: "Femenino" };

// Texto blanco u oscuro según qué tan clara sea la "hoja de ruta" de color (#RRGGBB)
const textoSobre = (hex) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex ?? "")) return "#111827";
    const n = parseInt(hex.slice(1), 16);
    const luminosidad = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
    return luminosidad > 150 ? "#111827" : "#ffffff";
};

const Dato = ({ etiqueta, valor }) => (
    <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{etiqueta}</dt>
        <dd className="break-words font-medium text-gray-900">{valor || "—"}</dd>
    </div>
);

// Cabecera de la orden: quién es el paciente, su protocolo y el color de su hoja de ruta.
export default function DatosOrden({ hoja }) {
    const { orden, nombres, dni, edad, sexo, empresa, contrata, cargo, protocoloNombre, sede, fecha, hora, textoColor, codigoColor } = hoja;

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-gray-500">ORDEN {orden}</p>
                    <h3 className="break-words text-lg font-bold leading-tight text-primario">{nombres}</h3>
                </div>
                {textoColor && (
                    <span
                        title="Color de la hoja de ruta"
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-lg font-extrabold"
                        style={{ backgroundColor: codigoColor, color: textoSobre(codigoColor) }}
                    >
                        {textoColor}
                    </span>
                )}
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                <Dato etiqueta="DNI" valor={dni} />
                <Dato etiqueta="Edad" valor={edad && `${edad} años`} />
                <Dato etiqueta="Sexo" valor={SEXOS[sexo] ?? sexo} />
                <Dato etiqueta="Protocolo" valor={protocoloNombre} />
                <Dato etiqueta="Empresa" valor={empresa} />
                <Dato etiqueta="Contrata" valor={contrata} />
                <Dato etiqueta="Cargo" valor={cargo} />
                <Dato etiqueta="Sede" valor={sede} />
                <Dato etiqueta="Fecha" valor={[formatearFechaCorta(fecha), hora].filter(Boolean).join(" ")} />
            </dl>
        </section>
    );
}
