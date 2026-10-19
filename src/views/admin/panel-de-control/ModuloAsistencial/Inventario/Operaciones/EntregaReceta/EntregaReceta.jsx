import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faHandHoldingMedical, faMagnifyingGlass, faRotate } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../../utils/listUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import { etiquetaMedicamento, resumenLotes } from "../../Compartido/inventarioUtils";
import PaginadorTabla from "../../Compartido/components/PaginadorTabla";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import {
    AnularReceta,
    EntregarReceta,
    EstadoReceta,
    NombrePaciente,
    ObtenerRecetaPorTicket,
    ObtenerRecetasPendientes,
    PuedeEntregarse,
    ValidarNumeroTicket,
} from "./controllerEntregaReceta";

const columnasDetalle = [
    {
        label: "Medicamento",
        width: "28%",
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    { label: "Indicación", width: "28%", render: (row) => row.indicacion || "—" },
    { label: "Cantidad", accessor: "cantidad", width: "9%" },
    {
        label: "Faltante",
        width: "9%",
        render: (row) => (row.cantidadFaltante > 0 ? <strong className="text-red-600">{row.cantidadFaltante}</strong> : "—"),
    },
    { label: "Lotes entregados", width: "26%", render: (row) => <span className="text-sm">{resumenLotes(row.lotes) || "—"}</span> },
];

const columnasPendientes = [
    { label: "N° Ticket", accessor: "numeroTicket", width: "11%" },
    { label: "Paciente", width: "29%", render: (row) => NombrePaciente(row) || "—" },
    { label: "Documento", width: "14%", render: (row) => row.pacienteDocumento || "—" },
    { label: "Medicamentos", width: "13%", render: (row) => row.detalles?.length ?? "—" },
    {
        label: "Stock",
        width: "13%",
        render: (row) =>
            row.conFaltante ? (
                <span className="px-2 py-0.5 rounded text-sm font-semibold bg-red-100 text-red-700">Con faltante</span>
            ) : (
                <span className="px-2 py-0.5 rounded text-sm font-semibold bg-emerald-100 text-emerald-700">Completo</span>
            ),
    },
    { label: "Registrada", width: "20%", render: (row) => formatearFechaHora(row.fechaRegistro) },
];

// Anular es más delicado que entregar (libera la reserva de un paciente), por eso tiene permiso propio.
const PERMISO_ANULAR = "Anular Receta Asistencial";

export default function EntregaReceta({ tieneVista }) {
    const { token, userlogued } = useSessionData();
    const puedeAnular = Boolean(tieneVista?.(PERMISO_ANULAR));
    const { inventarios, inventarioId, setInventarioId, errorInventarios, cargarInventarios } = useInventarios(token);
    const pendientes = useConsultaInventario();

    const [numeroTicket, setNumeroTicket] = useState("");
    const [errorTicket, setErrorTicket] = useState("");
    const [receta, setReceta] = useState(null);
    const [cargandoReceta, setCargandoReceta] = useState(false);
    const [errorReceta, setErrorReceta] = useState("");
    // Solo se aplica la respuesta de la última búsqueda: si se buscan dos tickets seguidos, la lenta no pisa a la nueva.
    const busqueda = useRef(0);

    const paginacion = usePagination(pendientes.datos, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    // Al recargar la lista (por ejemplo tras entregar una receta) puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [pendientes.datos]);

    const cargarPendientes = () => {
        if (inventarioId) pendientes.ejecutar(() => ObtenerRecetasPendientes(inventarioId, token));
    };

    useEffect(() => {
        cargarPendientes();
    }, [inventarioId]);

    const buscarReceta = async (numero = numeroTicket) => {
        const error = ValidarNumeroTicket(numero);
        setErrorTicket(error);
        if (error) return;

        const id = ++busqueda.current;
        setCargandoReceta(true);
        setErrorReceta("");
        setReceta(null);

        const res = await ObtenerRecetaPorTicket(String(numero).trim(), token);
        if (id !== busqueda.current) return;

        setCargandoReceta(false);
        if (!res.ok) {
            setErrorReceta(res.mensaje);
            return;
        }
        setReceta(res.resultado);
    };

    const onChangeTicket = (e) => {
        // Solo dígitos; al escribir se quita el aviso de error.
        if (!/^\d*$/.test(e.target.value)) return;
        setNumeroTicket(e.target.value);
        setErrorTicket("");
    };

    const abrirPendiente = (fila) => {
        const numero = String(fila.numeroTicket);
        setNumeroTicket(numero);
        buscarReceta(numero);
    };

    // Tras entregar o anular se recarga la receta y la lista de pendientes. También cuando el backend rechazó la
    // acción: puede que otro usuario ya la haya cambiado y el estado en pantalla esté viejo.
    const recargarTrasAccion = (resultado) => {
        if (resultado === "cancelado") return;

        buscarReceta(String(receta.numeroTicket));
        cargarPendientes();
    };

    const handleEntregar = async () => recargarTrasAccion(await EntregarReceta(receta, token, userlogued));

    const handleAnular = async () => recargarTrasAccion(await AnularReceta(receta, token, userlogued));

    const estado = receta ? EstadoReceta(receta) : null;

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Buscar Receta por Ticket">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <InputTextOneLine
                        label="N° Ticket"
                        name="numeroTicket"
                        labelWidth="110px"
                        className="w-full md:w-1/2"
                        value={numeroTicket}
                        onChange={onChangeTicket}
                        onKeyUp={(e) => e.key === "Enter" && buscarReceta()}
                        required
                        error={errorTicket}
                    />
                    <button
                        type="button"
                        onClick={() => buscarReceta()}
                        disabled={cargandoReceta}
                        className="
                            bg-blue-600 hover:bg-blue-700
                            text-white text-base px-6 py-2 rounded
                            flex items-center gap-2
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar
                    </button>
                </div>
            </SectionFieldset>

            {(cargandoReceta || errorReceta || receta) && (
                <SectionFieldset legend={receta ? `Receta del Ticket N° ${receta.numeroTicket}` : "Receta"}>
                    {cargandoReceta && <p className="text-gray-500">Buscando receta...</p>}
                    <AvisoError mensaje={errorReceta} onRetry={() => buscarReceta()} />

                    {receta && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                                <p>Paciente: <strong>{NombrePaciente(receta) || "—"}</strong></p>
                                <p>Documento: <strong>{receta.pacienteDocumento || "—"}</strong></p>
                                <p>N° Historia Clínica: <strong>{receta.numeroHistoriaClinica ?? "—"}</strong></p>
                                <p>Inventario: <strong>{receta.inventarioNombre || "—"}</strong></p>
                                <p>Registrada: <strong>{formatearFechaHora(receta.fechaRegistro) || "—"}</strong> por <strong>{receta.usuarioRegistro || "—"}</strong></p>
                                <p className="flex items-center gap-2">
                                    Estado:
                                    <span className={`px-2 py-0.5 rounded font-semibold ${estado.clases}`}>{estado.texto}</span>
                                    {receta.conFaltante && !receta.entregado && (
                                        <span className="px-2 py-0.5 rounded font-semibold bg-red-100 text-red-700">Con faltante</span>
                                    )}
                                </p>
                                {receta.entregado && (
                                    <p className="md:col-span-2">
                                        Entregada el <strong>{formatearFechaHora(receta.fechaEntrega)}</strong> por <strong>{receta.usuarioEntrega || "—"}</strong>
                                    </p>
                                )}
                                {receta.anulada && (
                                    <p className="md:col-span-2 text-red-700">
                                        Anulada el <strong>{formatearFechaHora(receta.fechaAnulacion)}</strong> por <strong>{receta.usuarioAnulacion || "—"}</strong>
                                        {receta.motivoAnulacion ? ` · Motivo: ${receta.motivoAnulacion}` : ""}
                                    </p>
                                )}
                            </div>

                            <TablaTemplate
                                columns={columnasDetalle}
                                data={receta.detalles ?? []}
                                height={260}
                                emptyText="La receta no tiene medicamentos"
                            />

                            <div className="flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    onClick={handleEntregar}
                                    disabled={!PuedeEntregarse(receta)}
                                    className="
                                        bg-emerald-600 hover:bg-emerald-700
                                        text-white text-base px-6 py-2 rounded
                                        flex items-center gap-2
                                        transition-all duration-150 ease-out
                                        hover:shadow-lg
                                        active:scale-95 active:shadow-inner
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FontAwesomeIcon icon={faHandHoldingMedical} />
                                    {receta.entregado ? "Ya entregada" : receta.anulada ? "Receta anulada" : "Entregar Receta"}
                                </button>

                                {puedeAnular && PuedeEntregarse(receta) && (
                                    <button
                                        type="button"
                                        onClick={handleAnular}
                                        className="
                                            bg-red-600 hover:bg-red-700
                                            text-white text-base px-6 py-2 rounded
                                            flex items-center gap-2
                                            transition-all duration-150 ease-out
                                            hover:shadow-lg
                                            active:scale-95 active:shadow-inner"
                                    >
                                        <FontAwesomeIcon icon={faBan} /> Anular Receta
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </SectionFieldset>
            )}

            <SectionFieldset legend="Recetas Pendientes de Entrega">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                    <div>
                        <button
                            type="button"
                            onClick={cargarPendientes}
                            disabled={!inventarioId || pendientes.cargando}
                            className="
                                bg-blue-600 hover:bg-blue-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faRotate} spin={pendientes.cargando} /> Actualizar
                        </button>
                    </div>
                </div>

                <AvisoError mensaje={pendientes.error} onRetry={cargarPendientes} />

                <p className="text-sm text-gray-500 mb-2">Haga clic en una receta para abrirla.</p>

                <TablaTemplate
                    columns={columnasPendientes}
                    data={paginatedData}
                    height={400}
                    onRowClick={abrirPendiente}
                    emptyText={pendientes.cargando ? "Cargando recetas..." : "No hay recetas pendientes en este inventario"}
                />

                <PaginadorTabla paginacion={paginacion} total={pendientes.datos.length} etiqueta="recetas" />
            </SectionFieldset>
        </div>
    );
}
