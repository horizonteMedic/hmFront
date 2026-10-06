import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Contenedor base de los modales del módulo: fondo oscuro, cabecera con título y cierre,
// cuerpo con scroll propio (nunca se sale de la pantalla, ni en móvil) y pie opcional para las acciones.
export default function ModalBase({ title, onClose, children, footer, maxWidth = "max-w-lg" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`flex max-h-full w-full ${maxWidth} flex-col overflow-hidden rounded-lg bg-white shadow-xl`}
            >
                <div className="flex items-center justify-between bg-primario px-4 py-3 text-white">
                    <h2 className="font-bold">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Cerrar" className="px-1 hover:opacity-70">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4">{children}</div>

                {footer && <div className="flex justify-end gap-3 border-t bg-gray-50 px-4 py-3">{footer}</div>}
            </div>
        </div>
    );
}
