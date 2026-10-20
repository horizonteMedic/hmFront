import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowsRotate,
    faBan,
    faHandHoldingMedical,
    faListCheck,
    faMagnifyingGlass,
    faRotate,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../../utils/listUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import { etiquetaMedicamento } from "../../Compartido/inventarioUtils";
import PaginadorTabla from "../../Compartido/components/PaginadorTabla";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import {
    AnularReceta,
    DetalleConLoteVencido,
    DetalleConProblema,
    EntregarReceta,
    EntregarRecetaParcial,
    EstadoReceta,
    LoteVencido,
    NombrePaciente,
    ObtenerRecetaPorTicket,
    ObtenerRecetasConFaltante,
    ObtenerRecetasPendientes,
    PuedeEntregarse,
    ReReservarReceta,
    TieneFaltante,
    TieneLoteVencido,
    ValidarNumeroTicket,
} from "./controllerEntregaReceta";

// Fondo con el que se resaltan las filas que no se pueden entregar completas por tener un lote vencido.
const CLASES_FILA_VENCIDA = "bg-red-100";

const CLASES_BOTON = `
    text-white text-base px-6 py-2 rounded
    flex items-center gap-2
    transition-all duration-150 ease-out
    hover:shadow-lg
    active:scale-95 active:shadow-inner
    disabled:opacity-50 disabled:cursor-not-allowed`;

const etiqueta = (clases, texto) => <span className={`px-2 py-0.5 rounded text-base font-semibold ${clases}`}>{texto}</span>;

const EtiquetaLoteVencido = () => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-base font-semibold bg-red-600 text-white">
        <FontAwesomeIcon icon={faTriangleExclamation} /> Lote vencido
    </span>
);

// Lotes de un medicamento ("5 de A-OLD (vence 31/12/2026)"), con los vencidos en rojo.
const lotesDelDetalle = (lotes) =>
    lotes?.length ? (
        <ul className="text-base">
            {lotes.map((lote, i) => (
                <li key={i} className={LoteVencido(lote) ? "text-red-600 font-semibold" : ""}>
                    {lote.cantidad} de {lote.numeroLote || "sin lote"} (vence {formatearFechaCorta(lote.fechaVencimiento) || "—"}
                    {LoteVencido(lote) && " · VENCIDO"})
                </li>
            ))}
        </ul>
    ) : (
        "—"
    );

// `resaltar` es true mientras la receta sigue pendiente: en una entregada o anulada el lote vencido ya no importa.
const crearColumnasDetalle = (resaltar) => [
    {
        label: "Medicamento",
        width: "24%",
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    { label: "Indicación", width: "20%", render: (row) => row.indicacion || "—" },
    { label: "Cantidad", accessor: "cantidad", width: "8%" },
    {
        label: "Faltante",
        width: "8%",
        render: (row) => (!row.entregado && row.cantidadFaltante > 0 ? <strong className="text-red-600">{row.cantidadFaltante}</strong> : "—"),
    },
    {
        label: "Estado",
        width: "16%",
        render: (row) => {
            if (row.entregado) {
                return (
                    <span className="text-base">
                        {etiqueta("bg-emerald-100 text-emerald-700", "Entregado")}
                        {row.fechaEntrega && <span className="block text-gray-600">{formatearFechaHora(row.fechaEntrega)}</span>}
                    </span>
                );
            }
            if (!resaltar) return "—";
            if (DetalleConLoteVencido(row)) return <EtiquetaLoteVencido />;
            if (DetalleConProblema(row)) return etiqueta("bg-red-100 text-red-700", "Con faltante");
            return etiqueta("bg-amber-100 text-amber-700", "Pendiente");
        },
    },
    { label: "Lotes", width: "24%", render: (row) => lotesDelDetalle(row.lotes) },
];

// `idsConFaltante`: ids de las recetas que el backend lista como "con faltante" (lote vencido).
const crearColumnasPendientes = (idsConFaltante) => [
    { label: "N° Ticket", accessor: "numeroTicket", width: "9%" },
    { label: "Paciente", width: "25%", render: (row) => NombrePaciente(row) || "—" },
    { label: "Documento", width: "12%", render: (row) => row.pacienteDocumento || "—" },
    { label: "Medicamentos", width: "12%", render: (row) => row.detalles?.length ?? "—" },
    {
        label: "Stock",
        width: "22%",
        render: (row) => (
            <span className="inline-flex flex-wrap items-center gap-1">
                {TieneLoteVencido(row, idsConFaltante)
                    ? <EtiquetaLoteVencido />
                    : TieneFaltante(row)
                      ? etiqueta("bg-red-100 text-red-700", "Con faltante")
                      : etiqueta("bg-emerald-100 text-emerald-700", "Completo")}
                {row.entregaParcial && etiqueta("bg-blue-100 text-blue-700", "Parcial")}
            </span>
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
    // Recetas con lote vencido ("con faltante" en el backend): se piden aparte para resaltarlas en la lista y bloquear su entrega completa.
    const conFaltante = useConsultaInventario();
    const idsConFaltante = useMemo(() => new Set(conFaltante.datos.map((receta) => receta.id)), [conFaltante.datos]);
    const columnasPendientes = useMemo(() => crearColumnasPendientes(idsConFaltante), [idsConFaltante]);

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
        if (!inventarioId) return;

        pendientes.ejecutar(() => ObtenerRecetasPendientes(inventarioId, token));
        conFaltante.ejecutar(() => ObtenerRecetasConFaltante(inventarioId, token));
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

    const handleEntregarParcial = async () => recargarTrasAccion(await EntregarRecetaParcial(receta, token, userlogued));

    const handleReReservar = async () => recargarTrasAccion(await ReReservarReceta(receta, token, userlogued));

    const handleAnular = async () => recargarTrasAccion(await AnularReceta(receta, token, userlogued));

    const estado = receta ? EstadoReceta(receta) : null;
    // Con un lote vencido la receta no se entrega completa: solo parcialmente (lo disponible) o re-reservando.
    const loteVencido = receta ? TieneLoteVencido(receta, idsConFaltante) : false;
    const conProblema = loteVencido || (receta ? TieneFaltante(receta) : false);
    const columnasDetalle = useMemo(() => crearColumnasDetalle(Boolean(receta) && PuedeEntregarse(receta)), [receta]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-start gap-4 px-4 pb-4">
            <SectionFieldset legend="Recetas Pendientes de Entrega" fieldsetClassName="min-w-0 order-2 xl:order-1">
                <div className="flex flex-wrap items-start gap-4 mb-3">
                    <div className="flex-1 min-w-[280px]">
                        <SelectorInventario
                            inventarios={inventarios}
                            inventarioId={inventarioId}
                            onChange={(e) => setInventarioId(e.target.value)}
                            error={errorInventarios}
                            onRetry={cargarInventarios}
                        />
                    </div>
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
                <AvisoError mensaje={conFaltante.error} onRetry={cargarPendientes} />

                <p className="text-sm text-gray-500 mb-2">
                    Haga clic en una receta para abrirla.{" "}
                    <span className="inline-flex items-center gap-1 ml-2 text-red-700">
                        <span className={`inline-block w-3 h-3 rounded-sm border border-red-300 ${CLASES_FILA_VENCIDA}`} aria-hidden="true" />
                        Con lote vencido: no se puede entregar completa (solo parcial o re-reservar).
                    </span>
                </p>

                <TablaTemplate
                    columns={columnasPendientes}
                    data={paginatedData}
                    height={400}
                    onRowClick={abrirPendiente}
                    getRowClassName={(row) => (TieneLoteVencido(row, idsConFaltante) ? CLASES_FILA_VENCIDA : "")}
                    emptyText={pendientes.cargando ? "Cargando recetas..." : "No hay recetas pendientes en este inventario"}
                />

                <PaginadorTabla paginacion={paginacion} total={pendientes.datos.length} etiqueta="recetas" />
            </SectionFieldset>

            {/* Derecha: búsqueda por ticket y la receta abierta. En pantallas angostas va arriba de la lista. */}
            <div className="space-y-4 min-w-0 order-1 xl:order-2">
                <SectionFieldset legend="Buscar Receta por Ticket" fieldsetClassName="min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <InputTextOneLine
                            label="N° Ticket"
                            name="numeroTicket"
                            labelWidth="110px"
                            className="w-full md:flex-1"
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
                    <SectionFieldset legend={receta ? `Receta del Ticket N° ${receta.numeroTicket}` : "Receta"} fieldsetClassName="min-w-0">
                        {cargandoReceta && <p className="text-gray-500">Buscando receta...</p>}
                        <AvisoError mensaje={errorReceta} onRetry={() => buscarReceta()} />

                        {receta && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 gap-y-2 text-base">
                                    <p>Paciente: <strong>{NombrePaciente(receta) || "—"}</strong></p>
                                    <p>Documento: <strong>{receta.pacienteDocumento || "—"}</strong></p>
                                    <p>N° Historia Clínica: <strong>{receta.numeroHistoriaClinica ?? "—"}</strong></p>
                                    <p>Inventario: <strong>{receta.inventarioNombre || "—"}</strong></p>
                                    <p>Registrada: <strong>{formatearFechaHora(receta.fechaRegistro) || "—"}</strong> por <strong>{receta.usuarioRegistro || "—"}</strong></p>
                                    <p className="flex flex-wrap items-center gap-2">
                                        Estado:
                                        <span className={`px-2 py-0.5 rounded font-semibold ${estado.clases}`}>{estado.texto}</span>
                                        {loteVencido ? (
                                            <EtiquetaLoteVencido />
                                        ) : (
                                            TieneFaltante(receta) && <span className="px-2 py-0.5 rounded font-semibold bg-red-100 text-red-700">Con faltante</span>
                                        )}
                                    </p>
                                    {receta.entregado && (
                                        <p className="2xl:col-span-2">
                                            Entregada el <strong>{formatearFechaHora(receta.fechaEntrega)}</strong> por <strong>{receta.usuarioEntrega || "—"}</strong>
                                        </p>
                                    )}
                                    {receta.anulada && (
                                        <p className="2xl:col-span-2 text-red-700">
                                            Anulada el <strong>{formatearFechaHora(receta.fechaAnulacion)}</strong> por <strong>{receta.usuarioAnulacion || "—"}</strong>
                                            {receta.motivoAnulacion ? ` · Motivo: ${receta.motivoAnulacion}` : ""}
                                        </p>
                                    )}
                                </div>

                                {loteVencido && (
                                    <div role="alert" className="flex items-start gap-2 text-base text-red-800 bg-red-50 border border-red-300 rounded p-3">
                                        <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
                                        <p>
                                            Esta receta tiene lotes vencidos y no se puede entregar completa. Puede <strong>entregar parcialmente</strong> los
                                            medicamentos disponibles (los demás quedan pendientes) o <strong>re-reservar</strong> para cambiar el lote vencido por
                                            stock vigente.
                                        </p>
                                    </div>
                                )}

                                <TablaTemplate
                                    columns={columnasDetalle}
                                    data={receta.detalles ?? []}
                                    height={320}
                                    getRowClassName={(row) =>
                                        PuedeEntregarse(receta) && DetalleConProblema(row) ? CLASES_FILA_VENCIDA : row.entregado ? "text-gray-500" : ""
                                    }
                                    emptyText="La receta no tiene medicamentos"
                                />

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={handleEntregar}
                                        disabled={!PuedeEntregarse(receta) || loteVencido}
                                        title={loteVencido ? "La receta tiene un lote vencido: entréguela parcialmente o re-reserve." : undefined}
                                        className={`bg-emerald-600 hover:bg-emerald-700 ${CLASES_BOTON}`}
                                    >
                                        <FontAwesomeIcon icon={faHandHoldingMedical} />
                                        {receta.entregado ? "Ya entregada" : receta.anulada ? "Receta anulada" : "Entregar Receta"}
                                    </button>

                                    {conProblema && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleEntregarParcial}
                                                title="Entrega solo los medicamentos disponibles y deja pendientes los que tienen problema."
                                                className={`bg-blue-600 hover:bg-blue-700 ${CLASES_BOTON}`}
                                            >
                                                <FontAwesomeIcon icon={faListCheck} /> Entrega Parcial
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReReservar}
                                                title="Suelta el lote vencido y reserva stock nuevo solo de lo que falta."
                                                className={`bg-amber-500 hover:bg-amber-600 ${CLASES_BOTON}`}
                                            >
                                                <FontAwesomeIcon icon={faArrowsRotate} /> Re-reservar
                                            </button>
                                        </>
                                    )}

                                    {puedeAnular && PuedeEntregarse(receta) && (
                                        <button type="button" onClick={handleAnular} className={`bg-red-600 hover:bg-red-700 ${CLASES_BOTON}`}>
                                            <FontAwesomeIcon icon={faBan} /> Anular Receta
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </SectionFieldset>
                )}
            </div>
        </div>
    );
}
