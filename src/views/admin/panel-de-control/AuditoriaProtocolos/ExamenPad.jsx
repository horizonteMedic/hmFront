import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ESTADOS = {
    completo: { caja: "border-green-500 bg-green-50 text-green-900", icono: faCircleCheck, colorIcono: "text-green-600", etiqueta: "Completo" },
    pendiente: { caja: "border-red-500 bg-red-50 text-red-900", icono: faCircleXmark, colorIcono: "text-red-600", etiqueta: "Pendiente" },
};

// Pad de un examen del protocolo: verde si ya se realizó, rojo si falta.
// El estado también va escrito y con ícono para no depender solo del color.
// Con `onClick` el pad es un botón (abre el examen); sin él es solo informativo.
export default function ExamenPad({ examen, onClick }) {
    const { caja, icono, colorIcono, etiqueta } = ESTADOS[examen.completado ? "completo" : "pendiente"];
    const clases = `flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left shadow-sm ${caja}`;

    const contenido = (
        <>
            <FontAwesomeIcon icon={icono} className={`flex-shrink-0 text-2xl ${colorIcono}`} />
            <span className="min-w-0 flex-1">
                <span className="block break-words font-semibold leading-tight">{examen.nombre}</span>
                <span className="block text-xs font-bold uppercase tracking-wide">
                    {etiqueta}
                    {examen.adicional && " · Adicional"}
                </span>
            </span>
            {onClick && <FontAwesomeIcon icon={faChevronRight} className="flex-shrink-0 opacity-60" />}
        </>
    );

    return onClick ? (
        <button
            type="button"
            onClick={onClick}
            className={`${clases} transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
        >
            {contenido}
        </button>
    ) : (
        <article className={clases}>{contenido}</article>
    );
}
