import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faEnvelope, faUser, faAt, faFile } from "@fortawesome/free-solid-svg-icons";
// import { GetListArchivosDisponibles } from "./controllerModalCorreo";
// import { useState } from "react";

export default function ModalListaCorreos({ open, onClose, title, listaCorreos }) {

    // const [archivosDisponibles, setArchivosDisponibles] = useState(null);

    const convertirAMB = (tamanio) => {
        if (!tamanio) return 0;

        const str = tamanio.toString().toLowerCase().trim();
        const valor = parseFloat(str) || 0;

        if (str.includes("kb")) return valor / 1024;
        if (str.includes("mb")) return valor;
        if (str.includes("gb")) return valor * 1024;

        // Si no tiene unidad, asumimos MB
        return valor;
    };

    // const obtenerListArchivosDisponibles = async (nordenYSede, setForm, token) => {
    //     await GetListArchivosDisponibles(nordenYSede, setForm, token);
    // }
    // useEffect(() => {
    //     if (open) {
    //         document.body.style.overflow = "hidden";
    //         // obtener plantilla por norden
    //         obtenerListArchivosDisponibles(nordenYSede, setArchivosDisponibles, token);
    //     }
    //     else document.body.style.overflow = "auto";

    //     return () => (document.body.style.overflow = "auto");
    // }, [open]);


    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center ">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-[1000] bg-white rounded-2xl shadow-xl w-full max-h-[80vh] max-w-[80%] flex flex-col ">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                    >
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>

                {/* Content */}
                <div className="py-6 overflow-y-auto px-16">
                    {listaCorreos && listaCorreos.length > 0 ? (
                        <div className="space-y-4">
                            {listaCorreos.map((correo, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-primario px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-white text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                                                Correo #{index + 1}
                                            </span>
                                            {correo.fechaRegistro && (
                                                <span className="text-xs text-gray-500">
                                                    Registrado el: {new Date(correo.fechaRegistro).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-white text-xs font-bold">
                                            Peso Total: {(
                                                correo.archivos?.reduce(
                                                    (acc, arc) => acc + convertirAMB(arc.tamanio),
                                                    0
                                                ) || 0
                                            ).toFixed(2)} MB
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 text-gray-400">
                                                    <FontAwesomeIcon icon={faAt} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Destinatario</p>
                                                    <p className="text-sm text-gray-700 font-medium break-all">{correo.destino}</p>
                                                </div>
                                            </div>
                                            {correo.conCopia && (
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 text-gray-400">
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Con Copia</p>
                                                        <p className="text-sm text-gray-700 font-medium break-all">{correo.conCopia}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Asunto</p>
                                            <p className="text-sm text-gray-800 font-bold">{correo.asunto}</p>
                                        </div>
                                        {correo.archivos && correo.archivos.length > 0 && (
                                            <div className="pt-2">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Archivos Adjuntos</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {correo.archivos.map((archivo, aIdx) => (
                                                        <div key={aIdx} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium border border-blue-100">
                                                            <FontAwesomeIcon icon={faFile} className="text-[10px]" />
                                                            {archivo.nombreTipoArchivo || archivo.nombre || (typeof archivo === 'string' ? archivo : 'Archivo')}
                                                            <span className="text-[10px] opacity-60">({(convertirAMB(archivo.tamanio) || 0).toFixed(2)} MB)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mensaje</p>
                                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 whitespace-pre-wrap border border-gray-100 max-h-96 overflow-y-auto">
                                                {correo.mensaje}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <FontAwesomeIcon icon={faEnvelope} className="text-5xl mb-4 opacity-20" />
                            <p className="text-lg font-medium">No hay correos para mostrar</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
