import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ButtonsPDF({
    handleSave = () => { },
    handleRead = () => { },
}) {
    return (
        <div className="flex justify-center items-center gap-3">
            <button onClick={() => { handleSave() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} />
                Subir Archivo
            </button>
            <button onClick={() => { handleRead() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                Ver Archivo
            </button>
        </div>
    );
}