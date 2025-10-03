import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Visualer = ({closeModal,file}) => {
    return(
        <>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800/50 z-50">
                <div className="bg-white rounded-lg overflow-hidden overflow-y-auto shadow-xl w-[700px] h-[auto] max-h-[90%]">
                    <div className="px-4 py-2 azuloscurobackground flex items-center justify-between">
                        <h2 className="text-lg !font-bold color-blanco">Historial de Carga Masiva</h2>
                        <FontAwesomeIcon
                        icon={faTimes}
                        size="lg"
                        className="p-1 cursor-pointer color-blanco"
                        onClick={closeModal}
                        />
                    </div>
                    <div className="py-4 overflow-y-auto flex h-auto justify-center items-center">
                    {file ? (
                        <embed src={file.uri} type="application/pdf" className="h-[500px] w-[500px] max-w-full" />
                    ) : (
                        <img src={currentFile.uri} alt={currentFile.name} className="h-auto  w-auto max-w-full" />
                    )}
                    </div>
                    <div className="flex justify-center">
                    <a href={file.uri} download={file.name} className="azul-btn font-bold py-2 px-4 rounded mb-4">
                        <FontAwesomeIcon icon={faDownload} className="mr-2" /> Descargar
                    </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Visualer