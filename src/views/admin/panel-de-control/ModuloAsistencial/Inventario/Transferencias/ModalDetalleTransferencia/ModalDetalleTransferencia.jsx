import { useEffect, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import AvisoError from "../../AvisoError";
import { etiquetaMedicamento } from "../../inventarioUtils";
import { ObtenerTransferencia } from "../controllerTransferencias";

Modal.setAppElement("#root");

const columnas = [
    {
        label: "Medicamento",
        width: "40%",
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    { label: "N° Lote", width: "20%", render: (row) => row.numeroLote || "—" },
    { label: "Vencimiento", width: "20%", render: (row) => formatearFechaCorta(row.fechaVencimiento) || "—" },
    { label: "Cantidad", accessor: "cantidad", width: "20%" },
];

// Detalle de una transferencia: los datos de la fila ya cargada y los lotes que trae el detalle del backend.
export default function ModalDetalleTransferencia({ isOpen, onRequestClose, transferencia, token }) {
    const [detalle, setDetalle] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const id = transferencia?.id;

    const cargar = async () => {
        setCargando(true);
        setError("");
        setDetalle(null);

        const res = await ObtenerTransferencia(id, token);
        setCargando(false);
        if (!res.ok) {
            setError(res.mensaje);
            return;
        }
        setDetalle(res.resultado);
    };

    useEffect(() => {
        if (isOpen && id) cargar();
    }, [isOpen, id]);

    const datos = detalle ?? transferencia;
    const items = detalle?.items ?? [];
    const unidades = items.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalle de la transferencia"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Transferencia N° {id}</h2>
                    <button type="button" onClick={onRequestClose} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto">
                    {datos && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                            <p>Origen: <strong>{datos.inventarioOrigenNombre}</strong></p>
                            <p>Destino: <strong>{datos.inventarioDestinoNombre}</strong></p>
                            <p>Fecha: <strong>{formatearFechaHora(datos.fechaRegistro)}</strong></p>
                            <p>Registrado por: <strong>{datos.usuarioRegistro}</strong></p>
                            {datos.observacion && <p className="md:col-span-2">Observación: <strong>{datos.observacion}</strong></p>}
                        </div>
                    )}

                    <AvisoError mensaje={error} onRetry={cargar} />

                    <TablaTemplate
                        columns={columnas}
                        data={items}
                        height={300}
                        emptyText={cargando ? "Cargando detalle..." : "La transferencia no tiene lotes registrados"}
                    />

                    {items.length > 0 && (
                        <p className="text-right font-semibold">{items.length} lote(s) · {unidades} unidades</p>
                    )}
                </div>

                <div className="flex justify-end border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
