import { useEffect, useRef, useState } from "react";
import { getFetch } from "../../../../utils/apiHelpers";
import { URLAzure } from "../../../../config/config";
import { useSessionData } from "../../../../hooks/useSessionData";
import TablaTemplate from "../../../../components/templates/TablaTemplate";
import SectionFieldset from "../../../../components/reusableComponents/SectionFieldset";
import { formatearFechaCorta } from "../../../../utils/formatDateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faCheck, faImage, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

// ── Modal de registro ─────────────────────────────────────────────────────────
function ModalRegistroImagen({ token, userlogued, onClose, onGuardado }) {
    const [nombre,    setNombre]    = useState("");
    const [empresa,   setEmpresa]   = useState("");
    const [archivo,   setArchivo]   = useState(null);
    const [preview,   setPreview]   = useState(null);
    const [guardando, setGuardando] = useState(false);
    const inputFileRef = useRef(null);

    const handleArchivo = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setArchivo(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!nombre.trim())  return Swal.fire("Incompleto", "Ingresa el nombre de la imagen", "warning");
        if (!empresa.trim()) return Swal.fire("Incompleto", "Ingresa el nombre de la empresa", "warning");
        if (!archivo)        return Swal.fire("Incompleto", "Selecciona un archivo de imagen", "warning");

        setGuardando(true);
        try {
            const params = new URLSearchParams({
                nombre:          nombre.trim(),
                empresa:         empresa.trim(),
                usuarioRegistro: userlogued,
            });
            const formData = new FormData();
            formData.append("archivo", archivo);

            const res = await fetch(`${URLAzure}/api/imagenes-empresa?${params.toString()}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                Swal.fire("Error", err.mensaje ?? "No se pudo registrar la imagen", "error");
                return;
            }

            const data = await res.json();
            Swal.fire("Éxito", `Imagen "${data.nombre}" registrada correctamente`, "success");
            onGuardado(data);
            onClose();
        } catch {
            Swal.fire("Error", "Ocurrió un error al registrar la imagen", "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-lg font-semibold">Registrar Imagen</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} style={{ fontSize: 16 }} />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Nombre <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value.toUpperCase())}
                            placeholder="Ej: Logo horizontal 2026"
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Empresa <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
                            placeholder="Ej: Horizonte Medic"
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Archivo de imagen <span className="text-red-500">*</span></label>
                        <div
                            onClick={() => inputFileRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[100px]"
                        >
                            {preview ? (
                                <img src={preview} alt="preview" className="max-h-24 object-contain rounded" />
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faImage} className="text-gray-400 text-3xl" />
                                    <span className="text-sm text-gray-500">Haz clic para seleccionar una imagen</span>
                                </>
                            )}
                        </div>
                        <input ref={inputFileRef} type="file" accept="image/*" onChange={handleArchivo} className="hidden" />
                        {archivo && <span className="text-xs text-gray-500">{archivo.name}</span>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={guardando}
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        {guardando ? "Guardando..." : "Registrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Configuracion() {
    const { token, userlogued, campaniaActiva, setCampaniaActiva } = useSessionData();
    const [data,  setData]  = useState([]);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (!token) return;
        getFetch("/api/imagenes-empresa", token).then((res) => {
            setData(Array.isArray(res) ? res : []);
        });
    }, [token]);

    const handleGuardado = (nuevaFila) => {
        setData((prev) => [nuevaFila, ...prev]);
    };

    const handleToggle = async (row) => {
        const esActiva = campaniaActiva?.id === row.id;

        if (esActiva) {
            const confirm = await Swal.fire({
                title: "¿Desactivar campaña?",
                text: `"${row.nombre}" dejará de ser la campaña activa.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, desactivar",
                cancelButtonText: "Cancelar",
            });
            if (!confirm.isConfirmed) return;
            setCampaniaActiva(null);
        } else {
            if (campaniaActiva) {
                const confirm = await Swal.fire({
                    title: "Cambiar campaña activa",
                    html: `La campaña activa es <b>"${campaniaActiva.nombre}"</b>.<br/>¿Deseas cambiarla por <b>"${row.nombre}"</b>?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cambiar",
                    cancelButtonText: "Cancelar",
                });
                if (!confirm.isConfirmed) return;
            }
            setCampaniaActiva({ id: row.id, nombre: row.nombre, urlRuta: row.urlRuta, empresa: row.empresa });
        }
    };

    const columns = [
        { label: "ID",      accessor: "id",      width: "60px" },
        { label: "Nombre",  accessor: "nombre" },
        { label: "Empresa", accessor: "empresa" },
        {
            label: "Imagen",
            accessor: "urlRuta",
            width: "130px",
            render: (row) =>
                row.urlRuta
                    ? <img src={row.urlRuta} alt={row.nombre} className="h-14 object-contain rounded" />
                    : <span className="text-gray-400 text-sm">Sin imagen</span>,
        },
        {
            label: "Fecha Registro",
            accessor: "fechaRegistro",
            render: (row) => formatearFechaCorta(row.fechaRegistro),
        },
        { label: "Registrado por", accessor: "usuarioRegistro" },
        {
            label: "Acción",
            accessor: "_accion",
            width: "120px",
            render: (row) => {
                const esActiva = campaniaActiva?.id === row.id;
                return (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleToggle(row); }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            esActiva
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        <FontAwesomeIcon icon={faPowerOff} />
                        {esActiva ? "Desactivar" : "Activar"}
                    </button>
                );
            },
        },
    ];

    return (
        <div className="px-4 max-w-[95%] mx-auto space-y-4">
            <SectionFieldset legend="Imágenes de Empresa">

                {/* Banner de campaña activa */}
                {campaniaActiva ? (
                    <div className="flex items-center gap-3 mb-3 px-4 py-2 rounded-lg bg-green-50 border border-green-300 text-green-800">
                        {campaniaActiva.urlRuta && (
                            <img src={campaniaActiva.urlRuta} alt={campaniaActiva.nombre} className="h-8 object-contain rounded" />
                        )}
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs text-green-600 font-medium">Campaña activa</span>
                            <span className="text-sm font-bold">{campaniaActiva.nombre}</span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3 px-4 py-2 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
                        ⚠ No hay ninguna campaña activa. Activa una fila para usarla en el sistema.
                    </div>
                )}

                <div className="flex justify-end mb-3">
                    <button
                        onClick={() => setModal(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Registrar
                    </button>
                </div>

                <TablaTemplate
                    columns={columns}
                    data={data}
                    height={520}
                    getRowClassName={(row) =>
                        campaniaActiva?.id === row.id ? "bg-green-100" : "bg-red-50"
                    }
                />
            </SectionFieldset>

            {modal && (
                <ModalRegistroImagen
                    token={token}
                    userlogued={userlogued}
                    onClose={() => setModal(false)}
                    onGuardado={handleGuardado}
                />
            )}
        </div>
    );
}
