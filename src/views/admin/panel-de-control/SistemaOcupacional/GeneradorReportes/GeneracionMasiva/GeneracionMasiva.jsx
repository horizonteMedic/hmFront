import { useRef, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { deleteArchivoPorOrdenNomenclatura, getFetch } from "../../../../../utils/apiHelpers";
import FolioJasper from "../../../../../jaspers/FolioJasper/FolioJasper";
import {
    descargarPlantillaGeneracionMasiva,
    obtenerInfoPacParaMasivo,
    verificarExamenExiste,
    subirPDFGenerado,
} from "../controllerGeneradorReportes";

const GetExamenExterno = `/api/v01/st/registros/detalleUrlArchivos`;

const normalizarNorden = (valor) => {
    if (valor === null || valor === undefined) return "";
    return String(valor).trim();
};

export default function GeneracionMasiva({ examen, onClose, token, selectedSede, userlogued, datosFooter }) {
    const [data, setData] = useState([]);
    const [procesando, setProcesando] = useState(false);
    const [resultadosFinales, setResultadosFinales] = useState([]);
    const [reemplazar, setReemplazar] = useState(false);
    const abortRef = useRef(null);

    const handleSubir = async () => {
        const { value: file } = await Swal.fire({
            title: "Selecciona un archivo Excel",
            input: "file",
            inputAttributes: { accept: ".xlsx,.xls", "aria-label": "Sube tu Excel" },
            showCancelButton: true,
            confirmButtonText: "Cargar",
            cancelButtonText: "Cancelar",
        });
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            const nordenes = jsonData
                .map((row) => {
                    const key = Object.keys(row).find((k) => k.toUpperCase().trim() === "NORDEN");
                    return normalizarNorden(key ? row[key] : "");
                })
                .filter((n) => n !== "");

            const unicos = [...new Set(nordenes)];
            setResultadosFinales([]);
            setData(unicos.map((norden) => ({ norden, estado: "pendiente", mensaje: "" })));
        };
        reader.readAsBinaryString(file);
    };

    const actualizarFila = (norden, estado, mensaje) => {
        setData((prev) =>
            prev.map((row) => row.norden === norden ? { ...row, estado, mensaje } : row)
        );
    };

    const handleProcesar = async () => {
        if (procesando || data.length === 0) return;

        const confirm = await Swal.fire({
            title: "¿Iniciar generación masiva?",
            html: `Se generará y subirá el reporte <b>${examen.nombre}</b> para <b>${data.length}</b> N° de Orden.<br/>${reemplazar
                ? "Los que ya tengan un archivo subido serán <b>eliminados y reemplazados</b> por el nuevo."
                : "Solo se procesarán los que tengan el examen realizado. Los que ya tengan archivo subido se omitirán."
                }`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setProcesando(true);
        setResultadosFinales([]);
        setData((prev) => prev.map((row) => ({ ...row, estado: "procesando", mensaje: "" })));

        let generados = 0;
        let subidos = 0;
        let reemplazados = 0;
        let omitidos = 0;
        let errores = 0;

        for (const row of data) {
            const { norden } = row;

            if (controller.signal.aborted) break;

            try {
                // 1. Verificar que el examen existe para este norden
                const existe = await verificarExamenExiste(norden, examen.tabla, token);
                if (!existe) {
                    actualizarFila(norden, "omitido", "Examen no realizado, se omitió");
                    omitidos++;
                    continue;
                }

                // 2. Verificar si ya tiene archivo subido
                let archivoAReemplazar = false;
                if (examen.nomenclaturaSubida) {
                    const archivoExistente = await getFetch(`${GetExamenExterno}/${norden}/${examen.nomenclaturaSubida}`, token);
                    if (archivoExistente?.id === 1) {
                        if (!reemplazar) {
                            actualizarFila(norden, "omitido", "Ya tiene archivo subido, se omitió");
                            omitidos++;
                            continue;
                        }
                        archivoAReemplazar = true;
                    }
                }

                // 3. Obtener datos del paciente
                const form = await obtenerInfoPacParaMasivo(norden, token, selectedSede);
                if (!form) {
                    actualizarFila(norden, "error", "No se encontró información del paciente");
                    errores++;
                    continue;
                }

                actualizarFila(norden, "procesando", "Generando PDF...");

                // 4. Generar PDF (omitirImpresion=true para no abrir el visor/impresora)
                const soloEsteExamen = [{ ...examen, imprimir: true, resultado: true }];
                const pdfResult = await FolioJasper(
                    norden,
                    token,
                    soloEsteExamen,
                    null,
                    "INDIVIDUAL",
                    controller.signal,
                    form.nombres,
                    form.apellidos,
                    datosFooter,
                    false,   // comprimidoz
                    "azure", // urlType
                    "",      // fechaPersonalizada
                    "",      // diasVencimientoPersonalizado
                    true     // omitirImpresion: no abrir visor ni impresora
                );

                generados++;

                // 5. Si se va a reemplazar, eliminar primero el archivo existente
                if (archivoAReemplazar) {
                    actualizarFila(norden, "procesando", "Eliminando archivo anterior...");
                    await deleteArchivoPorOrdenNomenclatura(norden, examen.nomenclaturaSubida, token);
                }

                actualizarFila(norden, "procesando", "Subiendo archivo...");

                // 6. Subir con nomenclatura
                const uploadRes = await subirPDFGenerado(
                    pdfResult,
                    form,
                    examen.nomenclaturaSubida,
                    selectedSede,
                    userlogued,
                    token
                );

                if (uploadRes?.ok) {
                    if (archivoAReemplazar) {
                        reemplazados++;
                        actualizarFila(norden, "success", "Archivo reemplazado correctamente");
                    } else {
                        subidos++;
                        actualizarFila(norden, "success", "Generado y subido correctamente");
                    }
                } else {
                    errores++;
                    actualizarFila(norden, "error", "PDF generado pero error al subir");
                }

            } catch (error) {
                if (error?.name === "AbortError") break;
                console.error(`Error al procesar N° Orden ${norden}:`, error);
                actualizarFila(norden, "error", "Error interno al procesar");
                errores++;
            }
        }

        const cancelado = controller.signal.aborted;
        setProcesando(false);
        setResultadosFinales(data);

        await Swal.fire({
            icon: errores > 0 ? "warning" : "success",
            title: cancelado ? "Proceso cancelado" : "Generación masiva finalizada",
            html: `✅ Subidos: <b>${subidos}</b><br/>🔁 Reemplazados: <b>${reemplazados}</b><br/>📄 Generados sin subir: <b>${generados - subidos - reemplazados}</b><br/>⊘ Omitidos: <b>${omitidos}</b><br/>⚠️ Errores: <b>${errores}</b>`,
        });
    };

    const handleCancelar = () => {
        if (abortRef.current) abortRef.current.abort();
    };

    const handleDescargarPlantilla = () => {
        descargarPlantillaGeneracionMasiva(examen);
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
        if (estado === "success") return "✔ Subido";
        if (estado === "error") return "✖ Error";
        if (estado === "omitido") return "⊘ Omitido";
        if (estado === "procesando") return "⏳ Procesando";
        return "— Pendiente";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[80%] max-h-[90vh] flex flex-col p-6 gap-4">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-blue-600 text-xl font-semibold">Generación Masiva de Reportes</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Examen: <span className="font-semibold text-gray-700">{examen.nombre}</span>
                            {examen.nomenclaturaSubida && (
                                <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5 font-mono">{examen.nomenclaturaSubida}</span>
                            )}
                        </p>
                    </div>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: 14 }}
                        onClick={onClose}
                    />
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSubir}
                        disabled={procesando}
                        className="verde-btn px-4 py-1 rounded flex items-center gap-2"
                    >
                        Subir Excel <FontAwesomeIcon icon={faUpload} />
                    </button>
                    <button
                        onClick={handleDescargarPlantilla}
                        disabled={procesando}
                        className="verde-btn px-4 py-1 rounded flex items-center gap-2"
                    >
                        Descargar Plantilla <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                </div>

                {/* Opciones */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="reemplazarExistentes"
                        checked={reemplazar}
                        onChange={(e) => setReemplazar(e.target.checked)}
                        disabled={procesando}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    />
                    <label htmlFor="reemplazarExistentes" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Reemplazar archivos existentes (elimina el archivo ya subido y sube el nuevo)
                    </label>
                </div>

                {/* Contadores */}
                {data.length > 0 && (
                    <div className="flex gap-4 flex-wrap">
                        <div className="bg-gray-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold">{data.length}</p>
                        </div>
                        <div className="bg-green-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-green-700">Subidos</p>
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

                {/* Tabla */}
                {data.length > 0 && (
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">N° ORDEN</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">ESTADO</th>
                                    <th className="border px-4 py-2 bg-gray-100">MENSAJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={`${row.norden}-${i}`} className={rowColor(row.estado)}>
                                        <td className="border px-4 py-2 whitespace-nowrap">{row.norden}</td>
                                        <td className="border px-4 py-2 font-semibold whitespace-nowrap">{estadoLabel(row.estado)}</td>
                                        <td className="border px-4 py-2">{row.mensaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {data.length > 0 && (
                    <div className="flex justify-end gap-3">
                        {procesando && (
                            <button
                                onClick={handleCancelar}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={handleProcesar}
                            disabled={procesando}
                            className={`px-4 py-2 rounded ${procesando ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "verde-btn"}`}
                        >
                            {procesando ? "Procesando..." : "Generar y Subir Todos"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
