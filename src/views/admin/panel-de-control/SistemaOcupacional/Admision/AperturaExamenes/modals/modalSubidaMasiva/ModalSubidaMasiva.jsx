import { faChevronLeft, faChevronRight, faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import { descargarPlantillaExcel, getRowStatus, handleSubirExcel, isRowValid, submitMasivo } from "../../../controller/HC";
import Swal from "sweetalert2";

const SubidaMasiva = ({ onClose, MedicosMulti, FormaPago, ExamenMulti, sede, token, userlogued }) => {
    const [data, setData] = useState([]);
    const [resultados, setResultados] = useState([]);
    const SubirExcel = () => {
        handleSubirExcel(setData)
    }

    const DownloadExcel = () => {
        descargarPlantillaExcel(MedicosMulti, FormaPago, ExamenMulti)
    }

    const SubirDatos = async () => {
        const res = await submitMasivo(data, sede, token, userlogued);

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
                                        const status = getRowStatus(row, i, resultados);

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
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubidaMasiva