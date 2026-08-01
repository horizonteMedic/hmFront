import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import EmpleadoComboBox from "../../../../../../components/reusableComponents/EmpleadoComboBox";
import { getDatePlus364Days, getToday } from "../../../../../../utils/helpers";
import {
    descargarPlantillaFA16,
    exportarResultadosFA16,
    guardarCargaMasivaFA16,
    handleSubirExcelFA16,
} from "./ControllerCargaMasivaFA16";

export default function CargaMasivaFA16({ onClose, token, userlogued, userName, userDireccion, sede }) {
    const [data, setData] = useState([]);
    const [medico, setMedico] = useState({ nombre_medico: "", user_medicoFirma: "" });
    const [fecha, setFecha] = useState(getToday());
    const [procesando, setProcesando] = useState(false);
    const [resultadosFinales, setResultadosFinales] = useState([]);

    const handleChangeMedico = (e) => {
        const { name, value } = e.target;
        setMedico((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubir = () => {
        setResultadosFinales([]);
        handleSubirExcelFA16(setData);
    };

    const handleDescargar = () => {
        descargarPlantillaFA16();
    };

    const actualizarFila = (resultado) => {
        setData((prev) =>
            prev.map((row) =>
                row.norden === resultado.norden
                    ? {
                        ...row,
                        estado: resultado.omitido ? "omitido" : resultado.ok ? "success" : "error",
                        mensaje: resultado.mensaje,
                    }
                    : row
            )
        );
    };

    const puedeProcesar =
        data.length > 0 && !!medico.user_medicoFirma && !!fecha && !procesando;

    const handleProcesar = async () => {
        if (!puedeProcesar) return;

        const confirm = await Swal.fire({
            title: "¿Procesar y guardar los registros?",
            html: `Solo se CREARÁN los N° de Orden que no tengan registro previo.<br/>Los que ya existan serán <b>omitidos</b>.<br/><br/>Médico: <b>${medico.nombre_medico}</b><br/>Fecha: <b>${fecha}</b>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        setProcesando(true);
        setResultadosFinales([]);
        setData((prev) => prev.map((row) => ({ ...row, estado: "procesando", mensaje: "" })));

        const resultados = await guardarCargaMasivaFA16(
            data,
            {
                token,
                userlogued,
                userName,
                fecha,
                medicoNombre: medico.nombre_medico,
                medicoUsername: medico.user_medicoFirma,
                sede,
            },
            actualizarFila
        );

        setProcesando(false);
        setResultadosFinales(resultados);

        const okCount = resultados.filter((r) => r.ok).length;
        const omitidosCount = resultados.filter((r) => r.omitido).length;
        const failCount = resultados.filter((r) => !r.ok && !r.omitido).length;

        Swal.fire({
            icon: failCount === 0 ? "success" : "warning",
            title: "Carga masiva finalizada",
            html: `✅ Creados correctamente: <b>${okCount}</b><br/>⊘ Omitidos (ya tenían registro o falta examen): <b>${omitidosCount}</b><br/>⚠️ Con errores: <b>${failCount}</b>`,
        });
    };

    const handleExportar = () => {
        exportarResultadosFA16(resultadosFinales);
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
        if (estado === "success") return "✔ Guardado";
        if (estado === "error") return "✖ Error";
        if (estado === "omitido") return "⊘ Omitido";
        if (estado === "procesando") return "⏳ Procesando";
        return "— Pendiente";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-auto max-w-[80%] max-h-[90vh] flex flex-col p-6 gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-blue-600 text-xl font-semibold">Carga Masiva — Ficha Aptitud Anexo 16</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-black"
                        style={{ fontSize: 14 }}
                        onClick={onClose}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4 border border-gray-200 rounded p-3">
                    <EmpleadoComboBox
                        value={medico.nombre_medico}
                        form={medico}
                        onChange={handleChangeMedico}
                        label="Firma para todos los registros"
                        disabled={procesando}
                    />
                    <div>
                        <label className="block font-semibold mb-1">Fecha de validez por defecto (si el Excel no trae fecha) :</label>
                        <input
                            type="date"
                            value={fecha}
                            disabled={procesando}
                            onChange={(e) => setFecha(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 -mt-2">
                    La plantilla incluye una columna "FECHA (DD/MM/AAAA)" para asignar una fecha distinta a cada N° de Orden.
                    Si una fila trae una fecha con formato inválido, esa fila no se registrará.
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
                            <p className="text-sm text-green-700">Guardados</p>
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

                {data.length > 0 && (
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">N° ORDEN</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">FECHA</th>
                                    <th className="border px-4 py-2 bg-gray-100 whitespace-nowrap">ESTADO</th>
                                    <th className="border px-4 py-2 bg-gray-100">MENSAJE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={`${row.norden}-${i}`} className={rowColor(row.estado)}>
                                        <td className="border px-4 py-2 whitespace-nowrap">{row.norden}</td>
                                        <td className="border px-4 py-2 whitespace-nowrap">
                                            {row.estado === "error" && !row.fecha ? "—" : (row.fecha || fecha)}
                                        </td>
                                        <td className="border px-4 py-2 font-semibold whitespace-nowrap">
                                            {estadoLabel(row.estado)}
                                        </td>
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
                        <button
                            onClick={handleProcesar}
                            disabled={!puedeProcesar}
                            className={`px-4 py-2 rounded ${!puedeProcesar ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "verde-btn"}`}
                            title={!medico.user_medicoFirma ? "Debe seleccionar un médico" : ""}
                        >
                            {procesando ? "Procesando..." : "Procesar y Guardar Todos (Aptos)"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
