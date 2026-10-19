import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faBoxOpen, faDownload, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../../components/reusableComponents/InputTextOneLine";
import TablaTemplate from "../../../../../../../components/templates/TablaTemplate";
import { formatearFechaCorta } from "../../../../../../../utils/formatDateUtils";
import AvisoError from "../../../Compartido/components/AvisoError";
import { useConsultaInventario } from "../../../Compartido/hooks/useConsultaInventario";
import { ObtenerLotesVencidos } from "../controllerRetiros";
import {
    ConfirmarRetiroVencidos,
    DescargarListaVencidos,
    DescargarRelacionRetirados,
    DiasVencido,
    MedicamentoDelLote,
    MotivoVencimiento,
    RetirarLotesVencidos,
} from "./controllerRetirarVencidos";

Modal.setAppElement("#root");

// Ancho común de las etiquetas, igual que en el resto de formularios de Retiros.
const ANCHO_ETIQUETA = "110px";

const CLASES_BOTON = `
    text-white text-base px-6 py-2 rounded
    flex items-center gap-2
    transition-all duration-150 ease-out
    hover:shadow-lg
    active:scale-95 active:shadow-inner
    disabled:opacity-50 disabled:cursor-not-allowed`;

// Tres pasos en la misma ventana:
//   "seleccion"   lista de los lotes vencidos, todos marcados; se desmarcan los que no se quieren retirar y se puede
//                 descargar la lista en Excel antes de confirmar,
//   "procesando"  retira uno por uno los marcados, con avance,
//   "resultado"   qué se retiró y qué no, con la relación de retirados descargable en Excel.
export default function ModalRetirarVencidos({ isOpen, onRequestClose, inventario, motivos, token, usuario, onRetirado }) {
    const lotes = useConsultaInventario();
    const [seleccionados, setSeleccionados] = useState(() => new Set());
    const [fase, setFase] = useState("seleccion");
    const [procesados, setProcesados] = useState(0);
    const [resultado, setResultado] = useState(null);

    const motivo = MotivoVencimiento(motivos);

    const elegidos = useMemo(() => lotes.datos.filter((lote) => seleccionados.has(lote.id)), [lotes.datos, seleccionados]);
    const unidades = elegidos.reduce((total, lote) => total + lote.cantidadActual, 0);
    const conReservas = elegidos.filter((lote) => lote.cantidadReservada > 0).length;
    const todosMarcados = lotes.datos.length > 0 && elegidos.length === lotes.datos.length;

    const cargar = () => {
        if (inventario) lotes.ejecutar(() => ObtenerLotesVencidos(inventario.id, token));
    };

    // Cada vez que se abre vuelve al primer paso con la lista al día.
    useEffect(() => {
        if (!isOpen) return;
        setFase("seleccion");
        setResultado(null);
        setProcesados(0);
        cargar();
    }, [isOpen]);

    // Al llegar la lista todos los lotes quedan marcados; el usuario desmarca los que no quiere retirar.
    useEffect(() => {
        setSeleccionados(new Set(lotes.datos.map((lote) => lote.id)));
    }, [lotes.datos]);

    const alternar = (lote) =>
        setSeleccionados((prev) => {
            const siguiente = new Set(prev);
            if (siguiente.has(lote.id)) siguiente.delete(lote.id);
            else siguiente.add(lote.id);
            return siguiente;
        });

    const alternarTodos = () => setSeleccionados(todosMarcados ? new Set() : new Set(lotes.datos.map((lote) => lote.id)));

    const cerrar = () => {
        if (fase === "procesando") return;
        onRequestClose();
    };

    const handleRetirar = async () => {
        if (!(await ConfirmarRetiroVencidos(elegidos, inventario))) return;

        setFase("procesando");
        setProcesados(0);
        const res = await RetirarLotesVencidos({ lotes: elegidos, motivo, onProgreso: setProcesados }, token, usuario);
        setResultado(res);
        setFase("resultado");

        // El historial de la pantalla se actualiza de fondo mientras se ve el resultado.
        if (res.retirados.length > 0) onRetirado();
    };

    // Para reintentar lo que no se pudo retirar: se vuelve a la lista, que ya no trae lo retirado.
    const handleVolverALista = () => {
        setFase("seleccion");
        setResultado(null);
        cargar();
    };

    const columnasSeleccion = [
        {
            label: (
                <input
                    type="checkbox"
                    checked={todosMarcados}
                    onChange={alternarTodos}
                    disabled={lotes.datos.length === 0}
                    aria-label="Marcar o desmarcar todos"
                    className="w-4 h-4 cursor-pointer"
                />
            ),
            width: "5%",
            render: (row) => (
                <input
                    type="checkbox"
                    checked={seleccionados.has(row.id)}
                    onChange={() => alternar(row)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Retirar ${MedicamentoDelLote(row)}, lote ${row.numeroLote || "sin lote"}`}
                    className="w-4 h-4 cursor-pointer"
                />
            ),
        },
        { label: "Medicamento", width: "29%", render: (row) => MedicamentoDelLote(row) },
        { label: "N° Lote", width: "14%", render: (row) => row.numeroLote || "Sin lote" },
        { label: "Vencimiento", width: "13%", render: (row) => formatearFechaCorta(row.fechaVencimiento) },
        { label: "Vencido hace", width: "12%", render: (row) => `${DiasVencido(row.fechaVencimiento) ?? "—"} días` },
        { label: "Actual", accessor: "cantidadActual", width: "9%" },
        { label: "Reservado", accessor: "cantidadReservada", width: "9%" },
        { label: "Disponible", accessor: "cantidadDisponible", width: "9%" },
    ];

    const columnasRetirados = [
        { label: "Medicamento", width: "38%", render: (row) => MedicamentoDelLote(row.lote) },
        { label: "N° Lote", width: "20%", render: (row) => row.lote.numeroLote || "Sin lote" },
        { label: "Vencimiento", width: "20%", render: (row) => formatearFechaCorta(row.lote.fechaVencimiento) },
        { label: "Cantidad retirada", accessor: "cantidad", width: "22%" },
    ];

    const columnasFallidos = [
        { label: "Medicamento", width: "32%", render: (row) => MedicamentoDelLote(row.lote) },
        { label: "N° Lote", width: "16%", render: (row) => row.lote.numeroLote || "Sin lote" },
        { label: "Motivo", width: "52%", render: (row) => <span className="text-red-600">{row.mensaje}</span> },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Retirar Vencidos"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Retirar Vencidos</h2>
                    <button type="button" onClick={cerrar} disabled={fase === "procesando"} className="text-2xl leading-none disabled:opacity-40" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <InputTextOneLine
                        label="Inventario"
                        name="inventario"
                        labelWidth={ANCHO_ETIQUETA}
                        value={inventario?.nombre ?? ""}
                        disabled
                        inputClassName="font-bold"
                    />

                    {fase === "seleccion" && (
                        <>
                            {!motivo && !lotes.cargando && (
                                <AvisoError
                                    mensaje="No se encontró el motivo de retiro por vencimiento entre los motivos del sistema, así que no se puede registrar el retiro."
                                    className=""
                                />
                            )}
                            <AvisoError mensaje={lotes.error} onRetry={cargar} className="" />

                            <p className="text-sm text-gray-600">
                                Estos son los lotes vencidos con stock del inventario. Se retira todo lo que queda de cada lote marcado: desmarque los que no
                                quiere retirar. Puede descargar la lista antes de confirmar.
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm">
                                    Marcados: <strong>{elegidos.length}</strong> de <strong>{lotes.datos.length}</strong> lote(s) · <strong>{unidades}</strong> unidades
                                </p>
                                <button
                                    type="button"
                                    onClick={() => DescargarListaVencidos(elegidos, inventario)}
                                    disabled={elegidos.length === 0}
                                    className={`bg-blue-600 hover:bg-blue-700 ${CLASES_BOTON}`}
                                >
                                    <FontAwesomeIcon icon={faDownload} /> Descargar Excel
                                </button>
                            </div>

                            {conReservas > 0 && (
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-300 rounded p-2">
                                    {conReservas} lote(s) marcados tienen unidades reservadas por recetas pendientes. Si el sistema no permite retirarlos, quedarán como
                                    &quot;No retirados&quot; con el motivo.
                                </p>
                            )}

                            <TablaTemplate
                                columns={columnasSeleccion}
                                data={lotes.datos}
                                height={340}
                                onRowClick={alternar}
                                getRowClassName={(row) => (seleccionados.has(row.id) ? "" : "opacity-50")}
                                emptyText={lotes.cargando ? "Cargando lotes vencidos..." : "No hay lotes vencidos con stock en este inventario"}
                            />
                        </>
                    )}

                    {fase === "procesando" && (
                        <div className="py-10 text-center space-y-3">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-[#233245]" />
                            <p className="font-semibold">Retirando lotes vencidos... {procesados} de {elegidos.length}</p>
                            <div className="w-full max-w-md mx-auto h-2 bg-gray-200 rounded overflow-hidden">
                                <div
                                    className="h-full bg-emerald-600 transition-all duration-150"
                                    style={{ width: `${elegidos.length ? (procesados / elegidos.length) * 100 : 0}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500">No cierre esta ventana hasta que termine.</p>
                        </div>
                    )}

                    {fase === "resultado" && resultado && (
                        <>
                            <p className="font-semibold">
                                Se retiraron <span className="text-emerald-700">{resultado.retirados.length}</span> de {resultado.retirados.length + resultado.fallidos.length} lote(s)
                                {resultado.fallidos.length > 0 && <>; <span className="text-red-600">{resultado.fallidos.length} no se pudieron retirar</span></>}.
                            </p>

                            {resultado.retirados.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Retirados</h3>
                                    <TablaTemplate columns={columnasRetirados} data={resultado.retirados} height={220} />
                                </div>
                            )}

                            {resultado.fallidos.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-red-600">No retirados</h3>
                                    <TablaTemplate columns={columnasFallidos} data={resultado.fallidos} height={200} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 px-4 py-3">
                    {fase === "seleccion" && (
                        <>
                            <button
                                type="button"
                                onClick={cerrar}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleRetirar}
                                disabled={elegidos.length === 0 || !motivo || lotes.cargando}
                                className={`bg-red-600 hover:bg-red-700 ${CLASES_BOTON}`}
                            >
                                <FontAwesomeIcon icon={faBoxOpen} /> Retirar {elegidos.length} lote(s)
                            </button>
                        </>
                    )}

                    {fase === "resultado" && resultado && (
                        <>
                            {resultado.fallidos.length > 0 && (
                                <button type="button" onClick={handleVolverALista} className={`bg-amber-500 hover:bg-amber-600 ${CLASES_BOTON}`}>
                                    <FontAwesomeIcon icon={faArrowRotateLeft} /> Volver a la lista
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => DescargarRelacionRetirados(resultado, inventario, usuario)}
                                className={`bg-blue-600 hover:bg-blue-700 ${CLASES_BOTON}`}
                            >
                                <FontAwesomeIcon icon={faDownload} /> Descargar Excel de retirados
                            </button>
                            <button type="button" onClick={cerrar} className={`bg-gray-600 hover:bg-gray-700 ${CLASES_BOTON}`}>
                                Cerrar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}
