import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const ModalFiltros = ({ closeModal, Refresgpag, id_user, userlogued, token, Filtros, setFiltros }) => {

    const [selected, setSelected] = useState([]);

    const toggleCheckbox = (col) => {
        setFiltros(prev => ({
            ...prev,
            [col]: !prev[col]
        }));
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">

            <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] flex flex-col relative">

                {/* Header */}
                <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                    <h1 className="font-semibold text-sm">Filtro de Columnas</h1>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer"
                        onClick={closeModal}
                    />
                </div>

                {/* Body scrollable */}
                <div className="p-4 overflow-y-auto grid grid-cols-2 gap-3">

                    {Object.keys(Filtros).map((col, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
                        >
                            <input
                                type="checkbox"
                                checked={Filtros[col]}
                                onChange={() => toggleCheckbox(col)}
                            />
                            {col}
                        </label>
                    ))}

                </div>

                {/* Footer */}
                <div className="p-3 border-t flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            console.log("Columnas seleccionadas:", selected);
                            closeModal();
                        }}
                        className="px-3 py-1 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Aplicar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalFiltros;
