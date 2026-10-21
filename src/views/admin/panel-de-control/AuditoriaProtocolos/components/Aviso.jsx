import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";

const TIPOS = {
    info: { caja: "border-gray-300 bg-gray-50 text-gray-600", icono: null },
    cargando: { caja: "border-blue-300 bg-blue-50 text-blue-700", icono: faSpinner },
    error: { caja: "border-red-300 bg-red-50 text-red-700", icono: faCircleExclamation },
};

// Mensaje de estado a pantalla (sin datos, cargando o error) con el mismo aspecto en todo el módulo.
export default function Aviso({ tipo = "info", children, className = "" }) {
    const { caja, icono } = TIPOS[tipo];

    return (
        <div
            role={tipo === "error" ? "alert" : "status"}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-12 text-center ${caja} ${className}`}
        >
            {icono && <FontAwesomeIcon icon={icono} spin={tipo === "cargando"} className="text-2xl" />}
            <p className="max-w-md">{children}</p>
        </div>
    );
}
