import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { ListaPorPlantilla } from "../Folio";
import {
    descargarPlantillaCargaMasivaFolio,
    exportarResultadosCargaMasivaFolio,
    handleSubirExcelCargaMasivaFolio,
    procesarCargaMasivaFolio,
} from "./controllerCargaMasivaFolio";

export default function CargaMasivaFolio({ onClose, token, userlogued, selectedSede, datosFooter }) {
    const abortControllerRef = useRef(null);
    const [data, setData] = useState([]);
    const [selectedListType, setSelectedListType] = useState("COMPLETO");
    const [sobrescribir, setSobrescribir] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [resultadosFinales, setResultadosFinales] = useState([]);
    const [progresoLote, setProgresoLote] = useState(null);

    const handleSubir = () => {
        setResultadosFinales([]);
        handleSubirExcelCargaMasivaFolio(setData);
    };

    const handleDescargar = () => {
        descargarPlantillaCargaMasivaFolio();
    };

    const actualizarFila = (resultado) => {
        setData((prev) =>
            prev.map((row) =>
                row.norden === resultado.norden
                    ? {
                        ...row,
                        estado: resultado.omitido ? "omitido" : resultado.ok ? "success" : "error",
                        nomenclatura: resultado.nomenclatura || "",
                        mensaje: resultado.mensaje,
                    }
                    : row
            )
        );
    };

    const puedeProcesar = data.length > 0 && !procesando;

    const handleProcesar = async () => {
        if (!puedeProcesar) return;

        const confirm = await Swal.fire({
            title: "¿Generar y subir los folios?",
            html: `Se generarán <b>${data.length}</b> folio(s) con la plantilla <b>${selectedListType}</b>.<br/>${sobrescribir
                ? "Se sobrescribirán los que ya existan."
                : "Los N° de Orden que ya tengan un folio subido con la misma nomenclatura serán <b>omitidos</b>."
                }`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, generar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setProcesando(true);
        setResultadosFinales([]);
        setProgresoLote(null);
        setData((prev) => prev.map((row) => ({ ...row, estado: "procesando", mensaje: "" })));

        const resultados = await procesarCargaMasivaFolio(
            data,
            {
                token,
                userlogued,
                selectedSede,
                datosFooter,
                selectedListType,
                comprimidoz: true,
                urlType: "azure",
                sobrescribir,
                signal: controller.signal,
            },
            actualizarFila,
            setProgresoLote
        );

        setProcesando(false);
        setProgresoLote(null);
        setResultadosFinales(resultados);

        const okCount = resultados.filter((r) => r.ok).length;
        const omitidosCount = resultados.filter((r) => r.omitido).length;
        const failCount = resultados.filter((r) => !r.ok && !r.omitido).length;

        Swal.fire({
            icon: failCount === 0 ? "success" : "warning",
            title: "Carga masiva finalizada",
            html: `✅ Generados y subidos: <b>${okCount}</b><br/>⊘ Omitidos: <b>${omitidosCount}</b><br/>⚠️ Con errores: <b>${failCount}</b>`,
        });
    };

    const handleCancelar = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };

    const handleExportar = () => {
        exportarResultadosCargaMasivaFolio(resultadosFinales);
    };

    const totalOk = data.filter((r) => r.estado === "success").length;
    const totalError = data.filter((r) => r.estado === "error").length;
    const totalOmitido = data.filter((r) => r.estado === "omitido").length;
    const totalPendiente = data.filter((r) => r.estado === "pendiente" || r.estado === "procesando").length;

    const rowColor = (estado) => {
        if (estado === "success") return "bg-green-50";
        if (estado === "error") return "bg-red-50";
        if (estado === "omitido") return "bg-orange-50";
        if (estado === "procesando") return "bg-blue-50";
        return "";
    };

    const estadoLabel = (estado) => {
        if (estado === "success") return "✔ Generado";
        if (estado === "error") return "✖ Error";
        if (estado === "omitido") return "⊘ Omitido";
        if (estado === "procesando") return "⏳ Procesando";
        return "— Pendiente";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[85%] max-h-[90vh] flex flex-col p-6 gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-xl font-semibold">Carga Masiva — Folio</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: 14 }}
                        onClick={onClose}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4 border border-gray-200 rounded p-3">
                    <div>
                        <label className="block font-semibold mb-1">Plantilla Protocolo:</label>
                        <select
                            className="border rounded px-2 py-1 w-full"
                            value={selectedListType}
                            disabled={procesando}
                            onChange={(e) => setSelectedListType(e.target.value)}
                        >
                            {Object.keys(ListaPorPlantilla).map((elemento) => (
                                <option value={elemento} key={elemento}>{elemento}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={sobrescribir}
                                disabled={procesando}
                                onChange={(e) => setSobrescribir(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">Sobrescribir si ya existe</span>
                        </label>
                    </div>
                </div>

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
                            <p className="text-sm text-green-700">Generados</p>
                            <p className="text-xl font-bold text-green-800">{totalOk}</p>
                        </div>
                        <div className="bg-orange-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-orange-700">Omitidos</p>
                            <p className="text-xl font-bold text-orange-800">{totalOmitido}</p>
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

                {procesando && progresoLote && (
                    <div className="border border-gray-200 rounded p-3 flex flex-col gap-3 bg-gray-50">
                        <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>
                                    Procesando N° Orden <b>{progresoLote.norden}</b> ({progresoLote.index + 1} de {progresoLote.totalNordenes})
                                </span>
                                <span>{Math.round(((progresoLote.index) / progresoLote.totalNordenes) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-200"
                                    style={{ width: `${Math.round((progresoLote.index / progresoLote.totalNordenes) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{progresoLote.reportName || "Preparando..."}</span>
                                <span>{progresoLote.total ? `${progresoLote.current} / ${progresoLote.total}` : ""}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-purple-500 h-3 rounded-full transition-all duration-200"
                                    style={{ width: `${progresoLote.percentage || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">N° ORDEN</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">ESTADO</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">NOMENCLATURA</th>
                                    <th className="border px-4 py-2 bg-gray-100">MENSAJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={`${row.norden}-${i}`} className={rowColor(row.estado)}>
                                        <td className="border px-4 py-2 whitespace-nowrap">{row.norden}</td>
                                        <td className="border px-4 py-2 font-semibold whitespace-nowrap">
                                            {estadoLabel(row.estado)}
                                        </td>
                                        <td className="border px-4 py-2 whitespace-nowrap">{row.nomenclatura}</td>
                                        <td className="border px-4 py-2">{row.mensaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="flex justify-end gap-3">
                        {resultadosFinales.length > 0 && (
                            <button
                                onClick={handleExportar}
                                className="azul-btn px-4 py-2 rounded flex items-center gap-2"
                            >
                                Exportar Resultado <FontAwesomeIcon icon={faFileExcel} />
                            </button>
                        )}
                        {procesando && (
                            <button
                                onClick={handleCancelar}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={handleProcesar}
                            disabled={!puedeProcesar}
                            className={`px-4 py-2 rounded ${!puedeProcesar ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "verde-btn"}`}
                        >
                            {procesando ? "Procesando..." : "Generar y Subir Todos"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
