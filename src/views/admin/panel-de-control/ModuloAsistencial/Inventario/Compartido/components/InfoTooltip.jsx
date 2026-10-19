import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// Icono "i" que explica algo al pasar el mouse por encima (o al enfocarlo con el teclado). Está pensado para los
// encabezados de las tablas, que tienen fondo oscuro, y abre el texto hacia abajo, centrado bajo el icono.
export default function InfoTooltip({ texto }) {
    return (
        <span
            className="group relative inline-flex align-middle ml-1.5 outline-none"
            tabIndex={0}
            aria-label={texto}
            onClick={(e) => e.stopPropagation()}
        >
            <FontAwesomeIcon icon={faCircleInfo} className="text-sm text-sky-300 group-hover:text-white group-focus:text-white cursor-help" />
            <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-60 -translate-x-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm font-normal normal-case text-gray-800 shadow-lg group-hover:block group-focus:block"
            >
                {texto}
            </span>
        </span>
    );
}
