import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import {
    descargarPlantillaMedicamentos,
    exportarResultadosMedicamentos,
    guardarCargaMasivaMedicamentos,
    handleSubirExcelMedicamentos,
} from "./ControllerCargaMasivaMedicamentos";

export default function CargaMasivaMedicamentos({ onClose, token, Refresgpag }) {
    const [data, setData] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [procesado, setProcesado] = useState(false);

    const handleSubir = () => {
        setProcesado(false);
        handleSubirExcelMedicamentos(setData);
    };

    const handleDescargar = () => {
        descargarPlantillaMedicamentos();
    };

    const puedeProcesar = data.length > 0 && !procesando;

    const handleProcesar = async () => {
        if (!puedeProcesar) return;

        const confirm = await Swal.fire({
            title: "¿Procesar y guardar los medicamentos?",
            html: `Se enviarán <b>${data.length}</b> medicamento(s) al servidor.<br/>Todos se crean con stock actual en 0; el "Stock Mínimo" indicado se usará como umbral de alerta.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        setProcesando(true);
        setProcesado(false);
        LoadingDefault("Registrando medicamentos...");

        try {
            const { resultados } = await guardarCargaMasivaMedicamentos(data, token);
            setData(resultados);
            setProcesado(true);
            Swal.close();

            const exitosos = resultados.filter((r) => r.estado === "success").length;
            const fallidos = resultados.filter((r) => r.estado === "error").length;

            Swal.fire({
                icon: fallidos === 0 ? "success" : "warning",
                title: "Carga masiva finalizada",
                html: `✅ Registrados: <b>${exitosos}</b><br/>⚠️ Con errores: <b>${fallidos}</b>`,
            });

            if (exitosos > 0) Refresgpag?.();
        } catch (error) {
            console.error("Error en carga masiva de medicamentos:", error);
            Swal.close();
            Swal.fire("Error", "No se pudo procesar la carga masiva", "error");
        } finally {
            setProcesando(false);
        }
    };

    const handleExportar = () => {
        exportarResultadosMedicamentos(data);
    };

    const totalOk = data.filter((r) => r.estado === "success").length;
    const totalError = data.filter((r) => r.estado === "error").length;
    const totalPendiente = data.filter((r) => r.estado === "pendiente").length;

    const rowColor = (estado) => {
        if (estado === "success") return "bg-green-50";
        if (estado === "error") return "bg-red-50";
        return "";
    };

    const estadoLabel = (estado) => {
        if (estado === "success") return "✔ Registrado";
        if (estado === "error") return "✖ Error";
        return "— Pendiente";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[90%] max-h-[90vh] flex flex-col p-6 gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-xl font-semibold">Carga Masiva — Medicamentos</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: 14 }}
                        onClick={onClose}
                    />
                </div>

                <p className="text-xs text-gray-500 -mt-2">
                    Ninguna columna es obligatoria, excepto "Stock Mínimo" (si la celda viene vacía se registra como 0).
                    Todos los medicamentos se crean con stock actual en 0; para cargar stock use luego el ingreso individual de cada medicamento.
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSubir}
                        disabled={procesando}
                        className="verde-btn px-4 py-1 rounded flex items-center gap-2"
                    >
                        Subir Excel <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <button
                        type="button"
                        onClick={handleDescargar}
                        disabled={procesando}
                        className="verde-btn px-4 py-1 rounded flex items-center gap-2"
                    >
                        Descargar Plantilla <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                </div>

                {data.length > 0 && (
                    <div className="flex gap-4 flex-wrap">
                        <div className="bg-gray-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold">{data.length}</p>
                        </div>
                        <div className="bg-green-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-green-700">Registrados</p>
                            <p className="text-xl font-bold text-green-800">{totalOk}</p>
                        </div>
                        <div className="bg-red-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-red-700">Errores</p>
                            <p className="text-xl font-bold text-red-800">{totalError}</p>
                        </div>
                        <div className="bg-blue-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-blue-700">Pendientes</p>
                            <p className="text-xl font-bold text-blue-800">{totalPendiente}</p>
                        </div>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">NOMBRE</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">PRESENTACIÓN</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">USO</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">LABORATORIO</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">MARCA</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">UNIDAD MEDIDA</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">STOCK MÍNIMO</th>
                                    <th className="border px-3 py-2 bg-gray-100 whitespace-nowrap">ESTADO</th>
                                    <th className="border px-3 py-2 bg-gray-100">MENSAJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} className={rowColor(row.estado)}>
                                        <td className="border px-3 py-2 whitespace-nowrap font-semibold">{row.nombre}</td>
                                        <td className="border px-3 py-2 whitespace-nowrap">{row.presentacion}</td>
                                        <td className="border px-3 py-2">{row.uso}</td>
                                        <td className="border px-3 py-2 whitespace-nowrap">{row.laboratorio}</td>
                                        <td className="border px-3 py-2 whitespace-nowrap">{row.marca}</td>
                                        <td className="border px-3 py-2 whitespace-nowrap">{row.unidadMedida}</td>
                                        <td className="border px-3 py-2 whitespace-nowrap text-center">{row.stockMinimo}</td>
                                        <td className="border px-3 py-2 font-semibold whitespace-nowrap">{estadoLabel(row.estado)}</td>
                                        <td className="border px-3 py-2">{row.mensaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="flex justify-end gap-3">
                        {procesado && (
                            <button
                                onClick={handleExportar}
                                className="azul-btn px-4 py-2 rounded flex items-center gap-2"
                            >
                                Exportar Resultado <FontAwesomeIcon icon={faFileExcel} />
                            </button>
                        )}
                        <button
                            onClick={handleProcesar}
                            disabled={!puedeProcesar}
                            className={`px-4 py-2 rounded ${!puedeProcesar ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "verde-btn"}`}
                        >
                            {procesando ? "Procesando..." : "Procesar y Guardar Todos"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
