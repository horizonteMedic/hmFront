import { faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Swal from "sweetalert2";
import { descargarPlantillaExcel, handleSubirExcel, submitMasivo } from "../controllerConsentimientoInformado";

const ModalSubidaMasiva = ({ onClose, token, userlogued, sede }) => {
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [resultados, setResultados] = useState([]);

    const handleSubir = () => {
        handleSubirExcel(setData, setTotalPages);
    };

    const handleDescargar = () => {
        descargarPlantillaExcel();
    };

    const hayInvalidos = data.some(row => !row["NORDEN"]?.toString().trim());

    const getEstado = (row, index) => {
        if (!row["NORDEN"]?.toString().trim()) return "invalid";
        const res = resultados[index];
        if (!res) return "pending";
        return res.ok ? "success" : "error";
    };

    const getError = (index) => resultados[index]?.error ?? null;

    const rowColor = (estado) => {
        if (estado === "invalid") return "bg-red-50";
        if (estado === "success") return "bg-green-50";
        if (estado === "error") return "bg-yellow-50";
        return "";
    };

    const estadoLabel = (estado) => {
        if (estado === "invalid") return "✖ Incompleto";
        if (estado === "success") return "✔ Registrado";
        if (estado === "error") return "⚠ Error";
        return "—";
    };

    const SubirDatos = async () => {
        try {
            const { resultados, response } = await submitMasivo(data, token, userlogued);
            setResultados(resultados);

            const okCount = response?.cantidadExitosos ?? resultados.filter(r => r.ok).length;
            const failCount = resultados.filter(r => !r.ok).length;

            Swal.fire({
                icon: failCount === 0 ? "success" : "warning",
                title: "Carga masiva completada",
                html: `✅ Correctos: <b>${okCount}</b><br/>⚠️ Fallidos: <b>${failCount}</b>`,
            });
        } catch {
            Swal.fire("Error", "Ocurrió un error al subir los datos", "error");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[70%] max-h-[90vh] flex flex-col p-6 gap-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-xl font-semibold">Registro Masivo — Consentimiento Informado</h2>
                    <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-black" style={{ fontSize: 14 }} onClick={onClose} />
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                    <button onClick={handleSubir} className="verde-btn px-4 py-1 rounded flex items-center gap-2">
                        Subir Excel <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <button onClick={handleDescargar} className="verde-btn px-4 py-1 rounded flex items-center gap-2">
                        Descargar Plantilla <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                </div>

                {/* Contadores */}
                {data.length > 0 && (
                    <div className="flex gap-4 flex-wrap">
                        <div className="bg-gray-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold">{data.length}</p>
                        </div>
                        <div className="bg-green-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-green-700">Correctos</p>
                            <p className="text-xl font-bold text-green-800">{resultados.filter(r => r.ok).length}</p>
                        </div>
                        <div className="bg-yellow-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-yellow-700">Errores</p>
                            <p className="text-xl font-bold text-yellow-800">{resultados.filter(r => !r.ok).length}</p>
                        </div>
                    </div>
                )}

                {/* Tabla */}
                {data.length > 0 && (
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">ESTADO</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">N° ORDEN</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">FECHA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => {
                                    const estado = getEstado(row, i);
                                    return (
                                        <tr key={i} className={rowColor(estado)}>
                                            <td className="border px-4 py-2 font-semibold whitespace-nowrap">
                                                {estadoLabel(estado)}
                                            </td>
                                            <td className={`border px-4 py-2 whitespace-nowrap ${!row["NORDEN"]?.toString().trim() ? "bg-red-200 text-red-800" : ""}`}>
                                                {row["NORDEN"]}
                                            </td>
                                            <td className="border px-4 py-2 whitespace-nowrap">
                                                {row["FECHA"]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {data.length > 0 && (
                    <div className="flex justify-end">
                        <button
                            onClick={SubirDatos}
                            disabled={hayInvalidos}
                            className={`px-4 py-1 rounded ${hayInvalidos ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "verde-btn"}`}
                            title={hayInvalidos ? "Hay filas sin N° Orden" : ""}
                        >
                            Subir Datos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalSubidaMasiva;
