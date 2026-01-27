import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ButtonsPDF({
    handleSave = () => { },
    handleRead = () => { },
    Nombre_1 = "Subir Archivo",
    Nombre_2 = "Ver Archivo",
}) {
    return (
        <div className="flex justify-center items-center gap-3">
            <button onClick={() => { handleSave() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} />
                {Nombre_1}
            </button>
            <button onClick={() => { handleRead() }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2 rounded flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                {Nombre_2}
            </button>
        </div>
    );
}