import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EXAMENES_MOCK = [
  { id: "1", nombre: "FIST-TEST" },
  { id: "2", nombre: "PSICOSEN" },
  { id: "3", nombre: "T.ALTURA" },
  { id: "4", nombre: "T.CAL" },
  { id: "5", nombre: "RX.C.LUMBO" },
  { id: "6", nombre: "VIS.COMPL" },
  { id: "7", nombre: "M.ALIM" },
  { id: "8", nombre: "H.MAN" },
  { id: "9", nombre: "RX.C.DORSE" },
  { id: "10", nombre: "RX.LUMBA" },
  { id: "11", nombre: "PLOMO S." },
  { id: "12", nombre: "MER.O" },
  { id: "13", nombre: "ESP.CONF" },
  { id: "14", nombre: "MARIHUANA" },
  { id: "15", nombre: "COCAINA" },
  { id: "16", nombre: "AUDIOMETRÍA" },
  { id: "17", nombre: "ESPIROMETRÍA" },
  { id: "18", nombre: "ELECTROCARDIOGRAMA" },
  { id: "19", nombre: "HEMOGRAMA COMPLETO" },
  { id: "20", nombre: "PERFIL LIPÍDICO" },
];

const ModalExamenes = ({close}) => {
    return(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[800px] relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-blue-600 text-xl font-semibold">
                        Seleccionar Exámenes Adicionales
                        </h2>
                        <div className="text-lg cursor-pointer text-gray-500">
                            <FontAwesomeIcon onClick={close} icon={faX} />
                        </div>
                    </div>
                    <div className="mt-4 mb-2">
                        <div className="relative ">
                            <input
                            type="text"
                            className="w-full border rounded-lg text-lg px-3 py-3"
                            placeholder="Buscar examen..."
                            
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 px-3 py-3 gap-2">
                        {EXAMENES_MOCK.map((examen) => (
                            <div
                                key={examen.id}
                                className="flex items-center space-x-3 rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
                            >
                            <input
                                type="checkbox"
                                id={examen.id}
                                checked={false}
                                
                            />
                            <label
                                htmlFor={examen.id}
                                className="flex-1 text-sm font-medium leading-none cursor-pointer select-none"
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