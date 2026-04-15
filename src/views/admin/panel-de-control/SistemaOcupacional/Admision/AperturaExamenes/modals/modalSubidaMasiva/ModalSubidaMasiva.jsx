import { faChevronLeft, faChevronRight, faFileExcel, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";
import { descargarPlantillaExcel, handleSubirExcel } from "../../../controller/HC";

const SubidaMasiva = ({ onClose, MedicosMulti, FormaPago, ExamenMulti }) => {
    const [data, setData] = useState([]);

    const SubirExcel = () => {
        handleSubirExcel(setData)
    }

    const DownloadExcel = () => {
        descargarPlantillaExcel(MedicosMulti, FormaPago, ExamenMulti)
    }

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
                                        {Object.keys(data[0]).map((col, index) => (
                                            <th key={index} className="border px-4 py-2 bg-gray-100">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} className="border px-4 py-2">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="flex w-full justify-end items-center">
                        <button onClick={SubirExcel} className="verde-btn px-4 py-1 rounded flex items-center mr-3">Subir Datos</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubidaMasiva