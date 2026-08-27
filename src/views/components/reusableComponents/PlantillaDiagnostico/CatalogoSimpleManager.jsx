import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencil,
    faPlus,
    faSave,
    faSpinner,
    faTimes,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import InputTextOneLine from "../InputTextOneLine";
import { useCatalogoSimple } from "./useCatalogoSimple";

/**
 * Pantalla de CRUD genérica para catálogos simples {id, descripcion} con
 * filtro. Se reutiliza tanto para Recomendaciones como para Restricciones,
 * pasando el set de funciones de API correspondiente.
 */
export default function CatalogoSimpleManager({
    open,
    onClose,
    title,
    api,
    token,
    usuarioCreacion,
}) {
    const { items, filtro, setFiltro, loading, crear, actualizar, eliminar, refresh } =
        useCatalogoSimple({ token, usuarioCreacion, api });

    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");
    const [nuevoText, setNuevoText] = useState("");
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    const handleCrear = async () => {
        const descripcion = nuevoText.trim().toUpperCase();
        if (!descripcion) return;
        setSaving(true);
        try {
            const res = await crear(descripcion);
            if (!res || res.error || res.status) {
                Swal.fire("Error", "No se pudo crear el registro", "error");
                return;
            }
            setNuevoText("");
            refresh();
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (item) => {
        setEditId(item.id);
        setEditText(item.descripcion);
    };

    const handleActualizar = async (id) => {
        const descripcion = editText.trim().toUpperCase();
        if (!descripcion) return;
        setSaving(true);
        try {
            const res = await actualizar(id, descripcion);
            if (!res || res.error || res.status) {
                Swal.fire("Error", "No se pudo actualizar el registro", "error");
                return;
            }
            setEditId(null);
            refresh();
        } finally {
            setSaving(false);
        }
    };

    const handleEliminar = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;
        const res = await eliminar(id);
        if (!res || res.error || res.status) {
            Swal.fire("Error", "No se pudo eliminar el registro", "error");
            return;
        }
        refresh();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-[60]">
            <div className="bg-white rounded-xl shadow-xl w-[520px] max-h-[85vh] flex flex-col">
                <div className="azuloscurobackground text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                    <h1 className="font-semibold text-base">{title}</h1>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    <InputTextOneLine
                        label="Buscar"
                        name="filtro"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        labelWidth="70px"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={nuevoText}
                            onChange={(e) => setNuevoText(e.target.value)}
                            placeholder="Nueva descripción..."
                            className="border rounded px-2 py-1 w-full"
                        />
                        <button
                            type="button"
                            disabled={saving || !nuevoText.trim()}
                            onClick={handleCrear}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 rounded flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>

                    <div className="border rounded max-h-72 overflow-y-auto">
                        {loading && (
                            <p className="text-center text-gray-500 py-4">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Cargando...
                            </p>
                        )}
                        {!loading && items.length === 0 && (
                            <p className="text-center text-gray-500 py-4">Sin resultados</p>
                        )}
                        {!loading &&
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 px-3 py-2 border-b last:border-0 border-gray-100"
                                >
                                    {editId === item.id ? (
                                        <>
                                            <input
                                                type="text"
                                                autoFocus
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="border rounded px-2 py-1 flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleActualizar(item.id)}
                                                className="text-emerald-600 hover:text-emerald-800"
                                            >
                                                <FontAwesomeIcon icon={faSave} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditId(null)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm">{item.descripcion}</span>
                                            <button
                                                type="button"
                                                onClick={() => startEdit(item)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleEliminar(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                <div className="p-3 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
