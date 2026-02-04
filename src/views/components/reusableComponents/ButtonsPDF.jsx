import { faCloudArrowUp, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ButtonsPDF({
    handleSave = false,
    handleRead = false,
    handleMasivo = false,
    Nombre_1 = "Subir Archivo",
    Nombre_2 = "Ver Archivo",
    Nombre_3 = "Subida Masiva",
}) {
    return (
        <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-3">
                {handleSave && <button onClick={() => { handleSave() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faUpload} />
                    {Nombre_1}
                </button>}
                {handleRead && <button onClick={() => { handleRead() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faDownload} />
                    {Nombre_2}
                </button>}
            </div>
            {handleMasivo && < div className="flex justify-center items-center gap-3">
                <button onClick={() => { handleMasivo() }} className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    {Nombre_3}
                </button>
            </div>}
        </div >
    );
}