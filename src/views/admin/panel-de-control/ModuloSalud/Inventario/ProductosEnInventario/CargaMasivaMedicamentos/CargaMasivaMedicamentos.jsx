import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus, faFilePen } from "@fortawesome/free-solid-svg-icons";
import CampaniaActivaBanner from "../../../components/CampaniaActivaBanner";
import ModalBase from "../../../components/ModalBase";
import EdicionInventario from "./EdicionInventario";
import NuevosMedicamentos from "./NuevosMedicamentos";

const OPCIONES = [
    {
        modo: "nuevos",
        icono: faFileCirclePlus,
        titulo: "Nuevo registro",
        descripcion: "Sube un Excel con medicamentos nuevos para esta campaña. Puedes descargar la plantilla.",
    },
    {
        modo: "editar",
        icono: faFilePen,
        titulo: "Editar inventario",
        descripcion:
            "Descarga un Excel con los medicamentos actuales de la campaña, cambia sus datos o aumenta y disminuye su stock, agrega medicamentos nuevos y vuelve a subirlo.",
    },
];

// Carga masiva de medicamentos: primero se elige entre registrar medicamentos nuevos o editar el inventario
// de la campaña; cada opción es un flujo aparte (`onVolver` regresa a esta elección).
export default function CargaMasivaMedicamentos({ onClose, ...props }) {
    const [modo, setModo] = useState(null);
    const volver = () => setModo(null);

    if (modo === "nuevos") return <NuevosMedicamentos {...props} onClose={onClose} onVolver={volver} />;
    if (modo === "editar") return <EdicionInventario {...props} onClose={onClose} onVolver={volver} />;

    return (
        <ModalBase
            title="Carga masiva de medicamentos"
            onClose={onClose}
            maxWidth="max-w-2xl"
            footer={
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                    Cerrar
                </button>
            }
        >
            <div className="space-y-4">
                <CampaniaActivaBanner campania={props.campania} />
                <p className="text-sm text-gray-600">¿Qué quieres hacer?</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {OPCIONES.map(({ modo: clave, icono, titulo, descripcion }) => (
                        <button
                            key={clave}
                            type="button"
                            onClick={() => setModo(clave)}
                            className="flex flex-col items-start gap-2 rounded-lg border border-gray-300 p-4 text-left transition-colors hover:border-[#084788] hover:bg-blue-50"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primario text-white">
                                <FontAwesomeIcon icon={icono} />
                            </span>
                            <span className="font-bold text-primario">{titulo}</span>
                            <span className="text-sm text-gray-600">{descripcion}</span>
                        </button>
                    ))}
                </div>
            </div>
        </ModalBase>
    );
}
