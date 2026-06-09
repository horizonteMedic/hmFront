import { faChevronLeft, faChevronRight, faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import { descargarPlantillaExcel, getRowStatus, handleSubirExcel, isRowValid, submitMasivo } from "./controllerRegistroPacientes";
import Swal from "sweetalert2";

const SubidaMasiva = ({ onClose, sede, token }) => {
    const [data, setData] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(50);

    const SubirExcel = () => {
        handleSubirExcel(setData, setTotalPages)
    }

    const DownloadExcel = () => {
        descargarPlantillaExcel()
    }

    const SubirDatos = async () => {
        const res = await submitMasivo(data, sede, token);
        console.log(res)
        setResultados(res); // 🔥 guardar resultados

        const okCount = res.filter(r => r.ok).length;
        const failCount = res.filter(r => !r.ok).length;

        Swal.fire({
            icon: "success",
            title: "Carga masiva completada",
            html: `
      ✅ Correctos: <b>${okCount}</b><br/>
      ⚠️ Fallidos: <b>${failCount}</b>
    `
        });
    };

    const getCellError = (key, row) => {
        if (["DNI", "EMPRESA", "EXAMEN"].includes(key)) {
            return !row[key]?.toString().trim();
        }
        return false;
    };

    const hasErrors = data.some(row => !isRowValid(row));
    const startIdx = (currentPage - 1) * recordsPerPage;
    const endIdx = startIdx + recordsPerPage;

    const totalArchivos = data.length;

    const totalCorrectos = resultados.filter(r => r.ok === true).length;

    const totalErrores = resultados.filter(r => r.ok === false).length;

    const totalIncompletos = data.filter(row =>
        Object.keys(row).some(key => getCellError(key, row))
    ).length;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                <div className="bg-white rounded-lg w-auto max-w-[80%]  max-h-[90vh] flex flex-col p-6 ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-blue-600 text-xl font-semibold">
                            Registro Masivo
                        </h2>
                        <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-black" style={{ fontSize: '14px' }} onClick={onClose} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={SubirExcel} className="verde-btn px-4 py-1 rounded flex items-center mr-3">Subir Excel <FontAwesomeIcon icon={faUpload} className="ml-2" /></button>
                        <button onClick={DownloadExcel} className="verde-btn px-4 py-1 rounded flex items-center mr-3">Descargar Excel <FontAwesomeIcon icon={faFileExcel} className="ml-2" /></button>

                    </div>
                    <div className="flex gap-4 mt-4 mb-2 flex-wrap">

                        <div className="bg-gray-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-gray-600">Total Registros</p>
                            <p className="text-xl font-bold">{totalArchivos}</p>
                        </div>

                        <div className="bg-green-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-green-700">Correctos</p>
                            <p className="text-xl font-bold text-green-800">
                                {totalCorrectos}
                            </p>
                        </div>

                        <div className="bg-yellow-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-yellow-700">Errores</p>
                            <p className="text-xl font-bold text-yellow-800">
                                {totalErrores}
                            </p>
                        </div>

                        <div className="bg-red-100 rounded px-4 py-2 shadow-sm">
                            <p className="text-sm text-red-700">Incompletos</p>
                            <p className="text-xl font-bold text-red-800">
                                {totalIncompletos}
                            </p>
                        </div>

                    </div>
                    <div className="overflow-x-auto mt-4">
                        {data.length > 0 && (
                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 bg-gray-100">ESTADO</th>
                                        {Object.keys(data[0]).map((col, index) => (
                                            <th key={index} className="border px-4 py-2 bg-gray-100">
                                                {col}
                                            </th>

                                        ))}
                                    </tr>
                                </thead>
                                <tbody>

                                    {data.map((row, i) => {
                                        const realIndex = startIdx + i; // ← índice real en data completo
                                        const status = getRowStatus(row, realIndex, resultados);

                                        const rowColor =
                                            status === "invalid"
                                                ? "bg-red-100"
                                                : status === "success"
                                                    ? "bg-green-100"
                                                    : status === "error"
                                                        ? "bg-yellow-100"
                                                        : "";

                                        return (
                                            <tr key={i} className={rowColor}>
                                                <td className="border px-4 py-2 font-semibold">
                                                    {status === "success" && "✔ Registrado"}
                                                    {status === "error" && "⚠ Error"}
                                                    {status === "invalid" && "✖ Incompleto"}
                                                </td>
                                                {Object.values(row).map((val, j) => (
                                                    <td
                                                        key={j}
                                                        className={`border px-4 py-2 ${getCellError(Object.keys(row)[j], row)
                                                            ? "bg-red-200 text-red-800"
                                                            : ""
                                                            }`}
                                                    >
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="flex w-full justify-end items-center">
                        {data.length > 0 && (
                            <button
                                onClick={SubirDatos}
                                disabled={hasErrors}
                                className={`px-4 py-1 rounded flex items-center mr-3 ${hasErrors ? "bg-gray-400 cursor-not-allowed" : "verde-btn"
                                    }`}
                            >
                                Subir Datos
                            </button>
                        )}
                        {resultados.length > 0 && resultados.ok === false && (
                            <button
                                onClick={SubirDatos}
                                disabled={hasErrors}
                                className={`px-4 py-1 rounded flex items-center mr-3 ${hasErrors ? "bg-gray-400 cursor-not-allowed" : "verde-btn"
                                    }`}
                            >
                                Descargar errores
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubidaMasiva