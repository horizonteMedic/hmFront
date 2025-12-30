import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faClock } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { getToday } from "../../../../../../../utils/helpers";


const ModalPagos = ({ close, datos, set, ListFormaPago }) => {

    const [currentTime, setCurrentTime] = useState(new Date())

    const handleChange = (e) => {
        const { name, value } = e.target;

        set((f) => {
            const upper = value.toUpperCase();
            return { ...f, [name]: upper };
        });
    };

    const handleChangeNumberDecimals = (e, maxDecimals = 0) => {
        const { name, value } = e.target;
        const md = Number.isInteger(maxDecimals) && maxDecimals >= 0 ? maxDecimals : 1;
        // Solo permite punto como separador decimal
        const decimalPart = md === 0 ? '' : `(?:\\.\\d{0,${md}})?`;
        // Regex que acepta solo números + punto opcional
        const regex = new RegExp(`^\\d*${decimalPart}$`);
        if (regex.test(value)) {
            set((f) => ({ ...f, [name]: value }));
        }
    };

    const handleChangeNumber = (e) => {
        const { name, value } = e.target;
        if (/^[\d/]*$/.test(value)) {
            set((f) => ({ ...f, [name]: value }));
        }
    };
    // Timer for current time display
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Auto-calculate total when montoProtocolo or montoAdicionales change
    useEffect(() => {
        const protocolo = parseFloat(datos.montoProtocolo) || 0
        const adicionales = parseFloat(datos.montoAdicionales) || 0
        const total = protocolo + adicionales

        set(prev => ({ ...prev, montoTotal: total }))
    }, [datos.montoProtocolo, datos.montoAdicionales])

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[800px] relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-blue-600 text-xl font-semibold">
                            Información de Pagos
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <FontAwesomeIcon icon={faClock} className="text-xs" />
                                <span>{currentTime.toLocaleTimeString('es-ES')}</span>
                            </div>
                            <div className="text-xl font-bold cursor-pointer text-gray-500">
                                <FontAwesomeIcon onClick={close} icon={faX} />
                            </div>
                        </div>
                    </div>

                    {/* Fecha de Pago y Forma de Pago */}
                    <div className="mt-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Fecha de Pago */}
                            <div className="relative flex flex-col">
                                <label htmlFor="fechaPago" className="block mb-2 text-base">
                                    Fecha de Pago:
                                </label>
                                <input
                                    autoComplete="off"
                                    type="date"
                                    value={datos.fechaPago}
                                    onChange={handleChange}
                                    id="fechaPago"
                                    name="fechaPago"
                                    className="border border-gray-300 px-3 py-2 text-base rounded-md focus:outline-none w-full"
                                />
                            </div>

                            {/* Forma de Pago */}
                            <div className="relative flex flex-col">
                                <label htmlFor="formaPago" className="block mb-2 text-base">
                                    Forma de Pago:
                                </label>
                                <select
                                    id="formaPago"
                                    name="formaPago"
                                    value={datos.formaPago}
                                    onChange={handleChange}
                                    className="border border-gray-300 px-3 py-2 text-base rounded-md focus:outline-none w-full"
                                >
                                    <option value="">Seleccionar...</option>
                                    {ListFormaPago?.map((item) => (
                                        <option key={item.id} value={item.descripcion}>
                                            {item.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Montos que componen el total */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">Detalle de Montos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Monto Adicionales */}
                            <div className="relative flex flex-col">
                                <label htmlFor="montoAdicionales" className="block mb-2 text-base">
                                    Monto Adicionales:
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">S/</span>
                                    <input
                                        autoComplete="off"
                                        type="number"
                                        id="montoAdicionales"
                                        name="montoAdicionales"
                                        value={datos.montoAdicionales}
                                        onChange={handleChangeNumber}
                                        step="0.01"
                                        className="border border-gray-300 pl-10 pr-3 py-2 text-base rounded-md focus:outline-none w-full"
                                    />
                                </div>
                            </div>

                            {/* Monto Protocolo */}
                            <div className="relative flex flex-col">
                                <label htmlFor="montoProtocolo" className="block mb-2 text-base">
                                    Monto Protocolo:
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">S/</span>
                                    <input
                                        autoComplete="off"
                                        type="number"
                                        id="montoProtocolo"
                                        value={datos.montoProtocolo}
                                        onChange={handleChangeNumberDecimals}
                                        name="montoProtocolo"
                                        step="0.01"
                                        className="border border-gray-300 pl-10 pr-3 py-2 text-base rounded-md focus:outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monto Total - Destacado */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-200">
                        <div className="relative flex flex-col">
                            <label htmlFor="montoTotal" className="block mb-3 text-lg font-semibold text-blue-600">
                                Monto Total a Pagar:
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xl">S/</span>
                                <input
                                    autoComplete="off"
                                    type="number"
                                    id="montoTotal"
                                    name="montoTotal"
                                    value={datos.montoTotal}
                                    onChange={handleChangeNumberDecimals}
                                    step="0.01"
                                    className="border-2 border-blue-400 pl-14 pr-4 py-3 text-xl font-bold rounded-lg focus:outline-none w-full bg-blue-50 text-blue-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalPagos