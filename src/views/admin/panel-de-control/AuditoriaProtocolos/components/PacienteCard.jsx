import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faBuilding,
    faCakeCandles,
    faCalendarDays,
    faClipboardList,
    faHandshake,
    faIdCard,
    faLocationDot,
    faMars,
    faStethoscope,
    faVenus,
    faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import AvatarPaciente from "./AvatarPaciente";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";

const SEXOS = { M: "Masculino", F: "Femenino" };
const ICONOS_SEXO = { M: faMars, F: faVenus };
const PARTICULAS = new Set(["de", "del", "la", "las", "los", "y"]);

// "PEREZ GOMEZ JUAN" → "Perez Gomez Juan" (las partículas quedan en minúscula)
const aTitulo = (texto = "") =>
    texto
        .toLocaleLowerCase("es")
        .replace(/\S+/g, (palabra, indice) =>
            indice > 0 && PARTICULAS.has(palabra) ? palabra : palabra.charAt(0).toLocaleUpperCase("es") + palabra.slice(1)
        );

// Iniciales del avatar: primera letra de las dos primeras palabras del nombre
const iniciales = (nombre = "") =>
    nombre
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra.charAt(0).toLocaleUpperCase("es"))
        .join("");

// Texto blanco u oscuro según qué tan clara sea la "hoja de ruta" de color (#RRGGBB)
const textoSobre = (hex) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex ?? "")) return "#111827";
    const n = parseInt(hex.slice(1), 16);
    const luminosidad = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
    return luminosidad > 150 ? "#111827" : "#ffffff";
};

// Dato con ícono sobre fondo suave. `compacto` apila ícono y texto (para tres datos en una fila).
const Dato = ({ icono, etiqueta, valor, compacto, className = "" }) => (
    <div
        className={`flex min-w-0 gap-3 rounded-xl bg-slate-50 p-3 ${
            compacto ? "flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start" : "items-center"
        } ${className}`}
    >
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <FontAwesomeIcon icon={icono} />
        </span>
        <div className="min-w-0">
            <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">{etiqueta}</dt>
            <dd className="break-words text-base font-semibold leading-snug text-slate-900">{valor || "—"}</dd>
        </div>
    </div>
);

const Seccion = ({ titulo, children, className }) => (
    <section>
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{titulo}</h4>
        <dl className={className}>{children}</dl>
    </section>
);

// Ficha del paciente de la orden (va en la barra lateral): quién es, sus datos personales y los de su trabajo.
export default function PacienteCard({ hoja }) {
    const { orden, nombres, dni, edad, sexo, empresa, contrata, cargo, protocoloNombre, sede, fecha, hora, textoColor, codigoColor, urlFoto, examen } = hoja;
    const fechaHora = [formatearFechaCorta(fecha), hora].filter(Boolean).join(" · ");

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <header className="flex items-center gap-3 border-b border-gray-200 p-4">
                <AvatarPaciente key={urlFoto} url={urlFoto} iniciales={iniciales(nombres)} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800">Orden #{orden}</span>
                        {textoColor && (
                            <span
                                title="Color de la hoja de ruta"
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-extrabold"
                                style={{ backgroundColor: codigoColor, color: textoSobre(codigoColor) }}
                            >
                                {textoColor}
                            </span>
                        )}
                    </div>
                    <h3 className="mt-1 break-words text-lg font-bold leading-tight text-slate-900">{aTitulo(nombres)}</h3>
                    {fechaHora && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                            <FontAwesomeIcon icon={faCalendarDays} /> {fechaHora}
                        </p>
                    )}
                </div>
            </header>

            <div className="space-y-4 p-4">
                <Seccion titulo="Datos personales" className="grid grid-cols-3 gap-2">
                    <Dato compacto icono={faIdCard} etiqueta="DNI" valor={dni && String(dni)} />
                    <Dato compacto icono={faCakeCandles} etiqueta="Edad" valor={edad && `${edad} años`} />
                    <Dato compacto icono={ICONOS_SEXO[sexo] ?? faVenusMars} etiqueta="Sexo" valor={SEXOS[sexo] ?? sexo} />
                </Seccion>

                <Seccion titulo="Datos laborales" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    <Dato icono={faClipboardList} etiqueta="Protocolo" valor={protocoloNombre} />
                    <Dato icono={faStethoscope} etiqueta="Examen médico" valor={examen} />
                    <Dato icono={faBriefcase} etiqueta="Cargo" valor={cargo} />
                    <Dato icono={faBuilding} etiqueta="Empresa" valor={empresa} className="sm:col-span-2 lg:col-span-1" />
                    <Dato icono={faHandshake} etiqueta="Contrata" valor={contrata} className="sm:col-span-2 lg:col-span-1" />
                    <Dato icono={faLocationDot} etiqueta="Sede" valor={sede} className="sm:col-span-2 lg:col-span-1" />
                </Seccion>
            </div>
        </section>
    );
}
