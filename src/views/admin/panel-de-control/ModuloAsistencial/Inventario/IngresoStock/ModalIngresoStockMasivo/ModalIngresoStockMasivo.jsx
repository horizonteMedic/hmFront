import { useRef, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faCheck, faDownload, faFileExcel, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { RegistrarIngresoStock } from "../controllerIngresoStock";
import { DescargarPlantillaIngresoStock, LeerExcelIngresoStock } from "./controllerIngresoStockMasivo";

Modal.setAppElement("#root");

const columnas = ["Fila", "Medicamento", "N° Lote", "Vencimiento", "Cantidad", "Estado"];

export default function ModalIngresoStockMasivo({ isOpen, onRequestClose, inventario, referencia, medicamentos, token, usuario, onSuccess }) {
    const [filas, setFilas] = useState([]);
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [leyendo, setLeyendo] = useState(false);
    const [registrando, setRegistrando] = useState(false);
    const inputArchivo = useRef(null);

    const conErrores = filas.filter((fila) => fila.error).length;
    const validas = filas.length - conErrores;
    const totalUnidades = filas.reduce((total, fila) => total + (fila.error ? 0 : fila.cantidad), 0);
    const puedeRegistrar = filas.length > 0 && conErrores === 0 && !registrando && !leyendo;

    const limpiar = () => {
        setFilas([]);
        setNombreArchivo("");
        if (inputArchivo.current) inputArchivo.current.value = "";
    };

    const cerrar = () => {
        if (registrando) return;
        limpiar();
        onRequestClose();
    };

    const handleArchivo = async (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        setLeyendo(true);
        const res = await LeerExcelIngresoStock(archivo, medicamentos);
        setLeyendo(false);

        if (!res.ok) {
            limpiar();
            await Swal.fire("Error", res.mensaje, "error");
            return;
        }
        setFilas(res.filas);
        setNombreArchivo(archivo.name);
        // Permite volver a elegir el mismo archivo después de corregirlo.
        e.target.value = "";
    };

    const handleRegistrar = async () => {
        setRegistrando(true);
        const registrado = await RegistrarIngresoStock({ inventario, referencia, items: filas }, token, usuario);
        setRegistrando(false);
        if (!registrado) return;

        limpiar();
        onSuccess();
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Ingreso Masivo de Stock"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Ingreso Masivo de Stock</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <p className="text-sm">
                        Inventario: <strong>{inventario?.nombre}</strong>
                        {referencia ? <> · Referencia: <strong>{referencia}</strong></> : null}
                    </p>

                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-0.5">
                        <li>Descargue la plantilla: trae todos los medicamentos activos con su ID y nombre (no se modifican).</li>
                        <li>Complete NUMERO LOTE, VENCIMIENTO (dd/mm/aaaa o mm/aaaa) y CANTIDAD solo de los que ingresan. Para varios lotes, copie la fila completa y péguela debajo.</li>
                        <li>Suba el archivo, revise las filas y registre. El usuario, la fecha y la hora los asigna el sistema.</li>
                    </ol>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => DescargarPlantillaIngresoStock(medicamentos)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95"
                        >
                            <FontAwesomeIcon icon={faDownload} /> Descargar Plantilla
                        </button>

                        <label
                            htmlFor="archivoIngresoStock"
                            className={`bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 ${leyendo || registrando ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
                        >
                            <FontAwesomeIcon icon={leyendo ? faSpinner : faFileExcel} spin={leyendo} />
                            {leyendo ? "Leyendo..." : "Subir Excel"}
                        </label>
                        <input
                            ref={inputArchivo}
                            id="archivoIngresoStock"
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            onChange={handleArchivo}
                        />

                        {filas.length > 0 && (
                            <button
                                type="button"
                                onClick={limpiar}
                                disabled={registrando}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 disabled:opacity-60"
                            >
                                <FontAwesomeIcon icon={faBroom} /> Limpiar
                            </button>
                        )}

                        {nombreArchivo && <span className="text-sm text-gray-600 truncate">Archivo: <strong>{nombreArchivo}</strong></span>}
                    </div>

                    {filas.length > 0 && (
                        <>
                            <p className="text-sm">
                                Filas leídas: <strong>{filas.length}</strong> · Correctas: <strong className="text-emerald-700">{validas}</strong> · Con error:{" "}
                                <strong className={conErrores > 0 ? "text-red-600" : ""}>{conErrores}</strong> · Unidades a ingresar: <strong>{totalUnidades}</strong>
                            </p>
                            {conErrores > 0 && (
                                <p className="text-sm text-red-600">Corrija las filas marcadas en el Excel y vuelva a subirlo para poder registrar.</p>
                            )}

                            <div className="rounded-lg border border-gray-300 overflow-auto max-h-[40vh]">
                                <table className="w-full table-auto border-collapse text-sm">
                                    <thead className="sticky top-0 z-10 bg-[#233245] text-white">
                                        <tr>
                                            {columnas.map((columna) => (
                                                <th key={columna} className="border px-2 py-2 text-left font-semibold">{columna}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filas.map((fila) => (
                                            <tr key={fila.fila} className={fila.error ? "bg-red-50" : ""}>
                                                <td className="border px-2 py-1">{fila.fila}</td>
                                                <td className="border px-2 py-1">{fila.medicamento}</td>
                                                <td className="border px-2 py-1">{fila.numeroLote || "—"}</td>
                                                <td className="border px-2 py-1">
                                                    {fila.fechaVencimiento ? formatearFechaCorta(fila.fechaVencimiento) : fila.vencimientoTexto}
                                                </td>
                                                <td className="border px-2 py-1">{fila.cantidad}</td>
                                                <td className="border px-2 py-1">
                                                    {fila.error ? (
                                                        <span className="text-red-600 font-semibold">{fila.error}</span>
                                                    ) : (
                                                        <span className="text-emerald-700"><FontAwesomeIcon icon={faCheck} /> Correcta</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={cerrar}
                        disabled={registrando}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleRegistrar}
                        disabled={!puedeRegistrar}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={registrando ? faSpinner : faSave} spin={registrando} />
                        {filas.length > 0 && conErrores === 0 ? `Registrar ${filas.length} lote(s)` : "Registrar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
