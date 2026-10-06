import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";

const formatearPeso = (bytes) =>
    bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// Selector de una imagen: clic o arrastrar y soltar, con vista previa y botón para quitarla.
// Es controlado: `file` (File | null) y `onChange(file | null)`.
export default function ImageUploadField({ label, hint, file, onChange }) {
    const [preview, setPreview] = useState(null);
    const [arrastrando, setArrastrando] = useState(false);
    const [invalido, setInvalido] = useState(false);

    useEffect(() => {
        if (!file) return setPreview(null);
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const seleccionar = (archivo) => {
        if (!archivo) return;
        const esImagen = archivo.type.startsWith("image/");
        setInvalido(!esImagen);
        if (esImagen) onChange(archivo);
    };

    return (
        <div>
            <span className="font-semibold">{label}</span>

            {/* El <input> va dentro del <label>: el clic, el teclado y el foco funcionan sin código extra */}
            <label
                onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                onDragLeave={() => setArrastrando(false)}
                onDrop={(e) => { e.preventDefault(); setArrastrando(false); seleccionar(e.dataTransfer.files[0]); }}
                className={`mt-1 flex min-h-[7rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors focus-within:border-blue-500 ${arrastrando ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"}`}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => { seleccionar(e.target.files[0]); e.target.value = ""; }}
                />
                {preview ? (
                    <img src={preview} alt="Vista previa" className="max-h-28 rounded object-contain" />
                ) : (
                    <>
                        <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-400" />
                        <span className="text-sm text-gray-500">Haz clic o arrastra una imagen aquí</span>
                    </>
                )}
            </label>

            {invalido && <p className="mt-1 text-sm text-red-600">El archivo seleccionado no es una imagen.</p>}

            {file ? (
                <div className="mt-1 flex items-center justify-between gap-3 text-xs text-gray-600">
                    <span className="truncate">{file.name} · {formatearPeso(file.size)}</span>
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="flex flex-shrink-0 items-center gap-1 font-semibold text-red-600 hover:underline"
                    >
                        <FontAwesomeIcon icon={faTrash} /> Quitar
                    </button>
                </div>
            ) : (
                hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>
            )}
        </div>
    );
}
