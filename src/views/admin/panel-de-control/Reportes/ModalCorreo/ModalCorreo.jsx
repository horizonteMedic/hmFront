import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSessionData } from "../../../../hooks/useSessionData";
import { useForm } from "../../../../hooks/useForm";
import { GetListArchivosDisponibles, GetPlantillaPorNorden, SubmitCorreo } from "./controllerModalCorreo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFile, faPlus, faX } from "@fortawesome/free-solid-svg-icons";

const pesoMaximo = 24;

export default function ModalCorreo({ open, onClose, refrescar, norden, nordenYSede, archivosList }) {
    const { token, userlogued, selectedSede, datosFooter, userName } = useSessionData();
    const [archivosDisponibles, setArchivosDisponibles] = useState(null);

    const initialFormState = {
        idRelacionEmpresaContrata: null,
        nombresPaciente: "",
        apellidosPaciente: "",
        rucEmpresa: "",
        empresa: "",
        rucContrata: "",
        contrata: "",
        fechaApartura: "",
        plantillaConfig: null
    };

    const {
        form,
        setForm,
        handleClear
    } = useForm(initialFormState);

    // bloquear scroll del body
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            // obtener plantilla por norden
            obtenerPlantillaPorNorden(norden, setForm, token);
            obtenerListArchivosDisponibles(nordenYSede, setArchivosDisponibles, token);
        }
        else document.body.style.overflow = "auto";

        return () => (document.body.style.overflow = "auto");
    }, [open]);

    const obtenerPlantillaPorNorden = async (norden, setForm, token) => {
        await GetPlantillaPorNorden(norden, setForm, onCloseNew, token, archivosList, userName);
    }

    const obtenerListArchivosDisponibles = async (nordenYSede, setForm, token) => {
        await GetListArchivosDisponibles(nordenYSede, setForm, token);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        // Filtrar archivos que no están disponibles antes de enviar
        const formFiltrado = {
            ...form,
            plantillaConfig: form.plantillaConfig
                .filter(p => !p.anulado) // 1. Filtrar plantillas anuladas
                .map(p => ({
                    ...p,
                    archivos: p.archivos.filter(a =>
                        !a.anulado && // 2. Filtrar archivos anulados
                        archivosDisponibles?.some(ad => ad.nomenclatura === a.nomenclatura) // 3. Filtrar archivos no disponibles
                    )
                }))
        };

        // VALIDACIÓN DE PESO MÁXIMO (2 MB) POR CORREO
        const correosExcedidos = formFiltrado.plantillaConfig
            .filter(p => !p.anulado)
            .map((p, index) => {
                const emailWeight = p.archivos.reduce((eAcc, a) => {
                    const ad = archivosDisponibles?.find(d => d.nomenclatura === a.nomenclatura);
                    return eAcc + (parseFloat(ad?.peso) || 0);
                }, 0);
                return { index: index + 1, emailWeight };
            })
            .filter(e => e.emailWeight > pesoMaximo);

        if (correosExcedidos.length > 0) {
            const indices = correosExcedidos.map(e => e.index).join(", ");
            Swal.fire({
                icon: 'warning',
                title: 'Peso máximo excedido',
                text: `El correo ${correosExcedidos.length > 1 ? `s ${indices}` : indices} excede el límite de ${pesoMaximo} MB por correo.`,
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        await SubmitCorreo({ ...formFiltrado, norden }, token, userlogued, onCloseNew);
    }

    const addEmailForm = () => {
        setForm(prev => ({
            ...prev,
            plantillaConfig: [
                ...prev.plantillaConfig,
                {
                    id: null,
                    destino: "",
                    conCopia: "",
                    asunto: "",
                    mensaje: "",
                    archivos: []
                }
            ]
        }));
    };

    const onCloseNew = () => {
        handleClear();
        onClose();
        refrescar();
    }

    const handleEmailChange = (index, e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];

            newPlantillas[index] = {
                ...newPlantillas[index],
                [name]: value
            };

            return {
                ...prev,
                plantillaConfig: newPlantillas
            };
        });
    };

    const toggleArchivo = (formIndex, archivo) => {
        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];
            const archivosActuales = newPlantillas[formIndex].archivos || [];

            const existe = archivosActuales.find(
                a => a.idTipoArchivo === archivo.idTipoArchivo
            );

            let nuevosArchivos;

            if (existe) {
                if (existe.idArchivoPlantilla) {
                    // toggle anulado
                    nuevosArchivos = archivosActuales.map(a =>
                        a.idTipoArchivo === archivo.idTipoArchivo
                            ? { ...a, anulado: !a.anulado }
                            : a
                    );
                } else {
                    // eliminar del array
                    nuevosArchivos = archivosActuales.filter(
                        a => a.idTipoArchivo !== archivo.idTipoArchivo
                    );
                }
            } else {
                // agregar
                nuevosArchivos = [
                    ...archivosActuales,
                    {
                        idTipoArchivo: archivo.idTipoArchivo,
                        nomenclatura: archivo.nomenclatura,
                        nombreTipoArchivo: archivo.nombreTipoArchivo,
                        anulado: false
                    }
                ];
            }

            newPlantillas[formIndex] = {
                ...newPlantillas[formIndex],
                archivos: nuevosArchivos
            };

            return {
                ...prev,
                plantillaConfig: newPlantillas
            };
        });
    };

    const removeEmailForm = (index) => {
        setForm(prev => {
            const newPlantillas = [...prev.plantillaConfig];

            const item = newPlantillas[index];

            let updated;

            if (item.id) {
                // tiene id → solo marcar como anulado
                updated = newPlantillas.map((a, i) =>
                    i === index ? { ...a, anulado: true } : a
                );
            } else {
                // no tiene id → eliminar
                updated = newPlantillas.filter((_, i) => i !== index);
            }

            return {
                ...prev,
                plantillaConfig: updated
            };
        });
    };

    if (!open || !form.plantillaConfig) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center ">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Modal */}
            <div className="relative z-[1000] bg-white rounded-2xl shadow-xl w-full max-h-[70vh] max-w-[80%] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Guardar Correo(s) para Envio
                    </h2>
                    <button
                        onClick={onCloseNew}
                        className="text-gray-400 hover:text-red-600"
                    >
                        ✕
                    </button>

                </div>
                <button
                    type="button"
                    onClick={addEmailForm}
                    className="self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md  shadow ml-6 mb-4"
                >
                    <FontAwesomeIcon icon={faPlus} /> Nuevo Correo
                </button>
                {/* Content (SCROLL AQUÍ 🔥) */}
                <div className="px-6 overflow-y-auto ">
                    <div className="flex flex-col gap-4  overflow-y-auto pr-2">

                        {form.plantillaConfig?.map((emailForm, index) => {
                            if (emailForm.anulado) return null;
                            return (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow-sm bg-white "
                                >
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center px-4 py-2 bg-primario rounded-t-lg">
                                        <span className=" font-semibold text-white">
                                            Correo
                                        </span>

                                        <button
                                            onClick={() => removeEmailForm(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <FontAwesomeIcon icon={faX} />
                                        </button>

                                    </div>

                                    {/* BODY */}
                                    <div className="p-4 space-y-3">

                                        {/* DESTINO */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Destinatario
                                            </span>
                                            <input
                                                name="destino"
                                                value={emailForm.destino}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                placeholder="correo@empresa.com , email@empresa.com"
                                                className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none "
                                            />
                                        </div>

                                        {/* CC */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Con Copia
                                            </span>

                                            <input
                                                name="conCopia"
                                                value={emailForm.conCopia}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                placeholder="copia@empresa.com , segundacopia@empresa.com"
                                                className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none "
                                            />
                                        </div>

                                        {/* ASUNTO */}
                                        <div className="flex items-center gap-2  pb-1">
                                            <span className="w-32 font-semibold text-gray-500">
                                                Asunto
                                            </span>

                                            <input
                                                name="asunto"
                                                value={emailForm.asunto}
                                                onChange={(e) => handleEmailChange(index, e)}
                                                className="flex-1 outline-none border-b border-gray-300"
                                            />
                                        </div>

                                        {/* ARCHIVOS */}
                                        <div className="flex flex-col gap-2 pt-2">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="w-32 font-semibold text-gray-500">
                                                    Archivos
                                                </span>
                                                {archivosList?.map((archivo) => {
                                                    const seleccionado = form.plantillaConfig[index]?.archivos?.some(
                                                        a => (a.idTipoArchivo === archivo.idTipoArchivo) && !a.anulado
                                                    );
                                                    const archivoDisponible = archivosDisponibles?.find(ad => ad.nomenclatura === archivo.nomenclatura);

                                                    // Si no está disponible pero está seleccionado, lo mostramos abajo en "No subidos"
                                                    if (!archivoDisponible && seleccionado) return null;

                                                    const peso = archivoDisponible?.peso || "0";
                                                    const noDisponible = !archivoDisponible;

                                                    return (
                                                        <button
                                                            key={archivo.idTipoArchivo}
                                                            type="button"
                                                            disabled={noDisponible}
                                                            onClick={() => toggleArchivo(index, archivo)}
                                                            className={`
                                                                           relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full border
                                                                           transition-all duration-200 ease-in-out
                                                                           ${noDisponible ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400" : "transform active:scale-95 hover:scale-105"}
                       
                                                                           ${seleccionado
                                                                    ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                                                    : !noDisponible ? "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md" : ""}
                                                                           `}
                                                        >
                                                            {/* Icono SIEMPRE igual */}
                                                            <FontAwesomeIcon icon={faFile} className="text-[12px]" />
                                                            <span>{archivo.nomenclatura}</span>
                                                            {!noDisponible && (
                                                                <span className={`ml-1 text-[10px] ${seleccionado ? "text-blue-100" : "text-gray-400"}`}>
                                                                    ({peso})
                                                                </span>
                                                            )}
                                                            {/* Check pequeño flotante */}
                                                            {seleccionado && (
                                                                <span className="absolute -top-1 -right-1 bg-white text-blue-500 rounded-full text-[10px] px-1 shadow">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Archivos no subidos */}
                                            {(() => {
                                                const marcadosNoDisponibles = form.plantillaConfig[index]?.archivos?.filter(
                                                    a => !a.anulado && !archivosDisponibles?.some(ad => ad.nomenclatura === a.nomenclatura)
                                                );

                                                if (marcadosNoDisponibles?.length > 0) {
                                                    return (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="w-32 font-semibold text-gray-400 text-[11px]">
                                                                No subidos (No se enviarán)
                                                            </span>
                                                            {marcadosNoDisponibles.map((a, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full border bg-sky-50 border-sky-200 text-sky-400/70 cursor-not-allowed opacity-75"
                                                                >
                                                                    <FontAwesomeIcon icon={faFile} className="text-[12px]" />
                                                                    {a.nomenclatura}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            {/* Peso Total */}
                                            {(() => {
                                                const total = form.plantillaConfig[index]?.archivos?.reduce((acc, a) => {
                                                    if (a.anulado) return acc;
                                                    const ad = archivosDisponibles?.find(d => d.nomenclatura === a.nomenclatura);
                                                    if (!ad) return acc;
                                                    const val = parseFloat(ad.peso) || 0;
                                                    return acc + val;
                                                }, 0) || 0;

                                                return (
                                                    <span
                                                        className={`text-xs font-bold ${total > pesoMaximo ? "text-red-500" : "text-gray-500"
                                                            }`}
                                                    >
                                                        Peso Total: {total.toFixed(2)} MB
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        {/* MENSAJE */}
                                        <textarea
                                            name="mensaje"
                                            value={emailForm.mensaje}
                                            onChange={(e) => handleEmailChange(index, e)}
                                            rows="14"
                                            placeholder="Escribe el mensaje..."
                                            className="w-full border rounded-md p-3  focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        />
                                    </div>

                                </div>
                            )
                        })}

                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 pt-2 ">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-semibold">
                            (Máximo {pesoMaximo} MB por correo)
                        </span>
                        {(() => {
                            const algunCorreoExcedido = form.plantillaConfig?.some(p => {
                                if (p.anulado) return false;
                                const emailWeight = p.archivos?.reduce((eAcc, a) => {
                                    if (a.anulado) return eAcc;
                                    const ad = archivosDisponibles?.find(d => d.nomenclatura === a.nomenclatura);
                                    return eAcc + (parseFloat(ad?.peso) || 0);
                                }, 0);
                                return emailWeight > pesoMaximo;
                            });
                            return algunCorreoExcedido && <span className="text-[10px] text-red-500 font-semibold">⚠️ Un correo excede el límite permitido</span>;
                        })()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2  rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                            Guardar Correo(s)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}