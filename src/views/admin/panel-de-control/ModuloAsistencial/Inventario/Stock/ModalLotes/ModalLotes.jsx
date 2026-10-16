import { useEffect, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import { etiquetaMedicamento } from "../../inventarioUtils";
import { useConsultaInventario } from "../../useConsultaInventario";
import { EstadoLote, ObtenerLotesMedicamento } from "../controllerStock";

Modal.setAppElement("#root");

const columnas = [
    { label: "N° Lote", width: "18%", render: (row) => row.numeroLote || "—" },
    { label: "Vencimiento", width: "16%", render: (row) => formatearFechaCorta(row.fechaVencimiento) },
    { label: "Días p/ vencer", width: "14%", render: (row) => (row.vencido ? "—" : row.diasParaVencer ?? "—") },
    { label: "Actual", accessor: "cantidadActual", width: "11%" },
    { label: "Reservada", accessor: "cantidadReservada", width: "12%" },
    { label: "Disponible", accessor: "cantidadDisponible", width: "12%" },
    {
        label: "Estado",
        width: "17%",
        render: (row) => {
            const estado = EstadoLote(row);
            return <span className={`px-2 py-0.5 rounded text-sm font-semibold ${estado.clases}`}>{estado.texto}</span>;
        },
    },
];

// Lotes de un medicamento en un inventario (orden FEFO: primero el que vence antes).
export default function ModalLotes({ isOpen, onRequestClose, inventario, medicamento, token }) {
    const [incluirVencidos, setIncluirVencidos] = useState(false);
    const { datos: lotes, cargando, error, ejecutar } = useConsultaInventario();

    const medicamentoId = medicamento?.medicamentoId;

    const cargar = () => ejecutar(() => ObtenerLotesMedicamento(inventario.id, medicamentoId, incluirVencidos, token));

    useEffect(() => {
        if (isOpen && inventario && medicamentoId) cargar();
    }, [isOpen, medicamentoId, incluirVencidos]);

    const cerrar = () => {
        setIncluirVencidos(false);
        onRequestClose();
    };

    const total = (campo) => lotes.reduce((suma, lote) => suma + (Number(lote[campo]) || 0), 0);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            contentLabel="Lotes del medicamento"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Lotes · {medicamento ? etiquetaMedicamento({ nombre: medicamento.nombre, presentacion: medicamento.presentacion }) : ""}</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm">Inventario: <strong>{inventario?.nombre}</strong> · Orden: primero el que vence antes</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={incluirVencidos} onChange={(e) => setIncluirVencidos(e.target.checked)} />
                            Incluir vencidos
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center justify-between gap-4 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                            <span>{error}</span>
                            <button
                                type="button"
                                onClick={cargar}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    <TablaTemplate
                        columns={columnas}
                        data={lotes}
                        height={320}
                        getRowClassName={(row) => (row.vencido ? "bg-red-50" : "")}
                        emptyText={cargando ? "Cargando lotes..." : "Este medicamento no tiene lotes en el inventario"}
                    />

                    {lotes.length > 0 && (
                        <p className="text-right font-semibold">
                            Actual: {total("cantidadActual")} · Reservada: {total("cantidadReservada")} · Disponible: {total("cantidadDisponible")}
                        </p>
                    )}
                </div>

                <div className="flex justify-end border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={cerrar}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
