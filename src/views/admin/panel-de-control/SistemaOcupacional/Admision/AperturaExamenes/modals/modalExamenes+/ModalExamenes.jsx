import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ModalExamenes = ({ close, idProtocolo, fetch, token, set, datos, listaExamenes = [] }) => {
    const [busqueda, setBusqueda] = useState("");

    const listaFiltrada = listaExamenes?.filter(ex =>
        ex.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleCheck = (examen) => {
        set(prev => {
            const existe = prev.examenesAdicionales.some(e => e.idExamenAdicionalProtocolo === examen.idExamenAdicionalProtocolo);

            return {
                ...prev,
                examenesAdicionales: existe
                    ? prev.examenesAdicionales.filter(item => item.idExamenAdicionalProtocolo !== examen.idExamenAdicionalProtocolo)
                    : [...prev.examenesAdicionales, {
                        idExamenAdicionalProtocolo: examen.idExamenAdicionalProtocolo,
                        nombre: examen.nombre
                    }]
            };
        });
    };
    console.log(listaFiltrada)
    console.log(datos.examenesAdicionales)
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[800px] relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-blue-600 text-xl font-semibold">
                            Seleccionar Exámenes Adicionales
                        </h2>
                        <div className="text-xl font-bold cursor-pointer text-gray-500">
                            <FontAwesomeIcon onClick={close} icon={faX} />
                        </div>
                    </div>
                    <div className="mt-4 mb-2">
                        <div className="relative ">
                            <input
                                type="text"
                                className="w-full border rounded-lg text-lg px-3 py-3"
                                placeholder="Buscar examen..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 px-3 py-3 gap-2">
                        {listaFiltrada?.map((examen) => (
                            <div
                                key={examen.idExamenAdicionalProtocolo}
                                className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-3 hover:bg-blue-500 !text-white transition-colors"
                            >
                                <input
                                    type="checkbox"

                                    checked={datos.examenesAdicionales.some(e => e.idExamenAdicionalProtocolo === examen.idExamenAdicionalProtocolo)}
                                    onChange={() => handleCheck(examen)}
                                    id={examen.idExamenAdicionalProtocolo}

                                />
                                <label
                                    htmlFor={examen.idExamenAdicionalProtocolo}
                                    className="flex-1 !text-lg !font-medium leading-none cursor-pointer select-none group-hover:!text-white"
                                >
                                    {examen.nombre}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalExamenes