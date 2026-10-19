import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../../../store/auth";
import ModalBase from "../ModuloSalud/components/ModalBase";
import { formularioDe } from "./formulariosExamen";

// Formulario del examen para la orden buscada: ver o registrar sus resultados, o abrir su reporte.
export default function ModalExamen({ examen, orden, onClose }) {
    const token = useAuthStore((state) => state.token);
    const { titulo, Formulario, verReporte } = formularioDe(examen);

    return (
        <ModalBase
            title={`${titulo} · Orden ${orden}`}
            onClose={onClose}
            maxWidth="max-w-4xl"
            footer={
                <>
                    <button
                        type="button"
                        disabled={!examen.completado}
                        title={examen.completado ? undefined : "El examen aún no se realizó"}
                        onClick={() => verReporte(orden, token)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faFilePdf} /> Ver reporte
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    >
                        Cerrar
                    </button>
                </>
            }
        >
            <Formulario nOrdenInicial={orden} onGuardado={onClose} />
        </ModalBase>
    );
}
