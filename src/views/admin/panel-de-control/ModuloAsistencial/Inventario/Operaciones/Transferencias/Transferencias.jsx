import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SelectorColumnas from "../../../../../../components/reusableComponents/SelectorColumnas";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../../utils/listUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import { rangoMesActual } from "../../Compartido/inventarioUtils";
import PaginadorTabla from "../../Compartido/components/PaginadorTabla";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../../Compartido/hooks/useOrdenTabla";
import { ObtenerTransferencias } from "./controllerTransferencias";
import ModalDetalleTransferencia from "./ModalDetalleTransferencia/ModalDetalleTransferencia";
import ModalNuevaTransferencia from "./ModalNuevaTransferencia/ModalNuevaTransferencia";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas, y se ordena al pulsar su
// cabecera: por su `accessor` o, si se dibuja con `render`, por lo que devuelva su `valorOrden`.
const columnas = conOrden([
    { id: "numero", label: "N°", accessor: "id", width: "6%" },
    { id: "fecha", label: "Fecha", width: "14%", valorOrden: (row) => row.fechaRegistro, render: (row) => formatearFechaHora(row.fechaRegistro) },
    { id: "origen", label: "Origen", accessor: "inventarioOrigenNombre", width: "17%" },
    { id: "destino", label: "Destino", accessor: "inventarioDestinoNombre", width: "17%" },
    { id: "lotes", label: "Lotes", width: "7%", valorOrden: (row) => row.items?.length, render: (row) => row.items?.length ?? "—" },
    { id: "observacion", label: "Observación", width: "24%", valorOrden: (row) => row.observacion, render: (row) => row.observacion || "—" },
    { id: "usuario", label: "Usuario", accessor: "usuarioRegistro", width: "15%" },
]);

// Ancho común de las etiquetas de la barra de filtros, para que las cajas empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function Transferencias() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, errorInventarios, cargarInventarios } = useInventarios(token);

    const historial = useConsultaInventario();
    const [historialId, setHistorialId] = useState("");
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [columnasOcultas, setColumnasOcultas] = useState([]);
    const [transferenciaDetalle, setTransferenciaDetalle] = useState(null);
    const [modalTransferencia, setModalTransferencia] = useState(false);
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    // Hacen falta dos inventarios activos: uno de origen y otro, distinto, de destino.
    const puedeTransferir = inventarios.filter((inventario) => inventario.activo !== false).length >= 2;

    const columnasVisibles = useMemo(() => columnas.filter((columna) => !columnasOcultas.includes(columna.id)), [columnasOcultas]);

    // Una columna oculta no puede seguir ordenando la tabla: no se vería por qué las filas están así.
    const alternarColumna = (id) => {
        if (orden?.id === id) quitarOrden();
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));
    };

    // Si se ordenó por una cabecera, ese orden manda sobre toda la lista (no solo la página).
    const transferenciasOrdenadas = useMemo(() => ordenarPorColumna(historial.datos, columnas, orden), [historial.datos, orden]);

    const paginacion = usePagination(transferenciasOrdenadas, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const buscarHistorial = () => {
        if (rango.desde && rango.hasta && rango.desde > rango.hasta) {
            setErrorRango("La fecha inicial no puede ser mayor a la fecha final");
            return;
        }
        setErrorRango("");
        setCurrentPage(1);
        if (historialId) historial.ejecutar(() => ObtenerTransferencias({ inventarioId: historialId, ...rango }, token));
    };

    // El historial parte mostrando el inventario por defecto (el central); después se elige aparte.
    useEffect(() => {
        setHistorialId((actual) => actual || inventarioId);
    }, [inventarioId]);

    // Al cambiar de inventario el historial es otro.
    useEffect(() => {
        buscarHistorial();
    }, [historialId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [orden]);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Transferencias Registradas">
                {/* Una sola cuadrícula para la barra: el inventario ocupa la columna de "Desde" y el botón para transferir
                    va a la derecha. */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={historialId}
                        onChange={(e) => setHistorialId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                        name="historialId"
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setModalTransferencia(true)}
                            disabled={!puedeTransferir}
                            title={puedeTransferir ? undefined : "Se necesitan al menos dos inventarios activos"}
                            className="
                                bg-emerald-600 hover:bg-emerald-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Nueva transferencia
                        </button>
                    </div>

                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={rango.desde}
                        onChange={(e) => setRango((prev) => ({ ...prev, desde: e.target.value }))}
                        error={errorRango}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={rango.hasta}
                        onChange={(e) => setRango((prev) => ({ ...prev, hasta: e.target.value }))}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <button
                        type="button"
                        onClick={buscarHistorial}
                        disabled={!historialId || historial.cargando}
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
                    <SelectorColumnas columnas={columnas} ocultas={columnasOcultas} onToggle={alternarColumna} />
                </div>

                <AvisoError mensaje={historial.error} onRetry={buscarHistorial} />

                <p className="text-sm text-gray-500 mb-2">Haga clic en una transferencia para ver sus lotes.</p>

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    sort={orden}
                    onSort={alternarOrden}
                    onRowClick={setTransferenciaDetalle}
                    emptyText={historial.cargando ? "Cargando transferencias..." : "No hay transferencias para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={transferenciasOrdenadas.length} etiqueta="transferencias" />
            </SectionFieldset>

            <ModalNuevaTransferencia
                isOpen={modalTransferencia}
                onRequestClose={() => setModalTransferencia(false)}
                inventarios={inventarios}
                errorInventarios={errorInventarios}
                cargarInventarios={cargarInventarios}
                origenInicialId={historialId}
                token={token}
                usuario={userlogued}
                onSuccess={buscarHistorial}
            />

            <ModalDetalleTransferencia
                isOpen={Boolean(transferenciaDetalle)}
                onRequestClose={() => setTransferenciaDetalle(null)}
                transferencia={transferenciaDetalle}
                token={token}
            />
        </div>
    );
}
