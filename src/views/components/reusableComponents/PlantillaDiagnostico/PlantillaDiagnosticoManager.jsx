import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical, faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { usePlantillaDiagnostico } from "./usePlantillaDiagnostico";
import PlantillaDiagnosticoBuscador from "./PlantillaDiagnosticoBuscador";
import PlantillaDiagnosticoForm from "./PlantillaDiagnosticoForm";
import CatalogoSimpleManager from "./CatalogoSimpleManager";
import {
    crearRecomendacion,
    actualizarRecomendacion,
    eliminarRecomendacion,
    getRecomendaciones,
    crearRestriccion,
    actualizarRestriccion,
    eliminarRestriccion,
    getRestricciones,
} from "./model";

const recomendacionApi = {
    list: getRecomendaciones,
    create: crearRecomendacion,
    update: actualizarRecomendacion,
    remove: eliminarRecomendacion,
};

const restriccionApi = {
    list: getRestricciones,
    create: crearRestriccion,
    update: actualizarRestriccion,
    remove: eliminarRestriccion,
};

/**
 * Módulo reutilizable de Plantillas de Diagnóstico. Se incrusta en
 * cualquier formulario (botón/ícono) y permite buscar/vincular una
 * plantilla existente, o crear/editar/eliminar plantillas, recomendaciones
 * y restricciones desde el mismo modal.
 *
 * onVincular(plantilla) se dispara cuando el usuario elige vincular una
 * plantilla al formulario que incrusta este componente.
 */
export default function PlantillaDiagnosticoManager({
    token,
    usuarioCreacion,
    onVincular,
    buttonLabel = "Plantillas de Diagnóstico",
    buttonClassName = "bg-[#233245] hover:bg-[#1a2535] text-white text-sm px-4 py-2 rounded flex items-center gap-2",
}) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("buscar"); // buscar | form
    const [catalogoAbierto, setCatalogoAbierto] = useState(null); // 'recomendacion' | 'restriccion' | null

    const hook = usePlantillaDiagnostico({ token, usuarioCreacion });

    const close = () => {
        setOpen(false);
        setTab("buscar");
    };

    const handleVincular = (plantilla) => {
        if (onVincular) onVincular(plantilla);
        close();
    };

    return (
        <>
            <button type="button" className={buttonClassName} onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faFileMedical} />
                {buttonLabel}
            </button>

            {open && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[680px] max-h-[90vh] flex flex-col">
                        <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                            <h1 className="font-semibold text-base">Plantillas de Diagnóstico</h1>
                            <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={close} />
                        </div>

                        <div className="flex border-b">
                            <button
                                type="button"
                                onClick={() => setTab("buscar")}
                                className={`flex-1 py-2 text-sm font-semibold ${
                                    tab === "buscar" ? "bg-blue-50 text-blue-700" : "text-gray-500"
                                }`}
                            >
                                Buscar / Vincular
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab("form")}
                                className={`flex-1 py-2 text-sm font-semibold ${
                                    tab === "form" ? "bg-blue-50 text-blue-700" : "text-gray-500"
                                }`}
                            >
                                {hook.form.idPlantilla ? "Editar" : "Nueva"}
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            {tab === "buscar" ? (
                                <PlantillaDiagnosticoBuscador hook={hook} onVincular={handleVincular} />
                            ) : (
                                <PlantillaDiagnosticoForm hook={hook} token={token} />
                            )}
                        </div>

                        <div className="p-3 border-t flex justify-between items-center">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCatalogoAbierto("recomendacion")}
                                    className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faListCheck} /> Recomendaciones
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCatalogoAbierto("restriccion")}
                                    className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faListCheck} /> Restricciones
                                </button>
                            </div>
                            <button
                                onClick={close}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CatalogoSimpleManager
                open={catalogoAbierto === "recomendacion"}
                onClose={() => setCatalogoAbierto(null)}
                title="Recomendaciones"
                api={recomendacionApi}
                token={token}
                usuarioCreacion={usuarioCreacion}
            />
            <CatalogoSimpleManager
                open={catalogoAbierto === "restriccion"}
                onClose={() => setCatalogoAbierto(null)}
                title="Restricciones"
                api={restriccionApi}
                token={token}
                usuarioCreacion={usuarioCreacion}
            />
        </>
    );
}
