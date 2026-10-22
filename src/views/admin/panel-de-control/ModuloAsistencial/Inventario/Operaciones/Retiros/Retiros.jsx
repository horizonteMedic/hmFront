import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../../utils/listUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import { etiquetaMedicamento, rangoMesActual } from "../../Compartido/inventarioUtils";
import { formatearMonto, sumarValores, textoValorTotal, valorDeMovimiento } from "../../Compartido/precioReferencial";
import PaginadorTabla from "../../Compartido/components/PaginadorTabla";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import { useLotesInventario } from "../../Compartido/hooks/useLotesInventario";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../../Compartido/hooks/useOrdenTabla";
import { ObtenerMotivosRetiro, ObtenerRetiros } from "./controllerRetiros";
import ModalRegistrarRetiro from "./ModalRegistrarRetiro/ModalRegistrarRetiro";
import ModalRetirarVencidos from "./ModalRetirarVencidos/ModalRetirarVencidos";

// Cada columna lleva un `id` y se ordena al pulsar su cabecera: por su `accessor` o, si se dibuja con `render`,
// por lo que devuelva su `valorOrden`. `valorDe(retiro)` da el valor referencial de lo retirado.
const crearColumnas = (valorDe) => conOrden([
    { id: "fecha", label: "Fecha", width: "11%", valorOrden: (row) => row.fechaRegistro, render: (row) => formatearFechaHora(row.fechaRegistro) },
    {
        id: "medicamento",
        label: "Medicamento",
        width: "21%",
        valorOrden: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    {
        id: "lote",
        label: "Lote",
        width: "15%",
        valorOrden: (row) => row.numeroLote,
        render: (row) => `${row.numeroLote || "Sin lote"} · ${formatearFechaCorta(row.fechaVencimiento) || "—"}`,
    },
    { id: "cantidad", label: "Cantidad", accessor: "cantidad", width: "7%" },
    {
        id: "motivo",
        label: "Motivo",
        width: "12%",
        valorOrden: (row) => row.motivo,
        render: (row) => (
            <span>
                {row.motivo}
                {row.automatico && <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-semibold">AUTO</span>}
            </span>
        ),
    },
    { id: "observacion", label: "Observación", width: "15%", valorOrden: (row) => row.observacion, render: (row) => row.observacion || "—" },
    { id: "usuario", label: "Usuario", accessor: "usuarioRegistro", width: "10%" },
    { id: "valor", label: "Valor", width: "9%", valorOrden: valorDe, render: (row) => formatearMonto(valorDe(row)) },
]);

// Ancho común de las etiquetas de la barra de filtros, para que las cajas empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

const CLASES_BOTON_BASE = `
    text-white text-base px-6 py-2 rounded
    flex items-center gap-2
    transition-all duration-150 ease-out
    hover:shadow-lg
    active:scale-95 active:shadow-inner
    disabled:opacity-50 disabled:cursor-not-allowed`;

// "Registrar nuevo" y "Buscar" llenan la última columna, así que miden lo mismo (el ancho lo marca el más largo).
const CLASES_BOTON = `w-full justify-center ${CLASES_BOTON_BASE}`;

export default function Retiros() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);

    const motivos = useConsultaInventario();
    const historial = useConsultaInventario();
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [filtroMotivo, setFiltroMotivo] = useState("");
    const [modalRegistro, setModalRegistro] = useState(false);
    const [modalVencidos, setModalVencidos] = useState(false);
    const { orden, alternarOrden } = useOrdenTabla();

    // El historial de retiros no trae precios: el valor sale del lote de cada retiro (`loteId`).
    const precios = useLotesInventario(inventarioId, token);
    const valorDe = useCallback((retiro) => valorDeMovimiento(retiro, precios.lotesPorId), [precios.lotesPorId]);
    const columnas = useMemo(() => crearColumnas(valorDe), [valorDe]);

    const opcionesMotivo = useMemo(() => motivos.datos.map((motivo) => ({ value: motivo, label: motivo })), [motivos.datos]);

    // Si se ordenó por una cabecera, ese orden manda sobre toda la lista (no solo la página).
    const retirosFiltrados = useMemo(
        () =>
            ordenarPorColumna(
                historial.datos.filter((retiro) => !filtroMotivo || retiro.motivo === filtroMotivo),
                columnas,
                orden
            ),
        [historial.datos, filtroMotivo, columnas, orden]
    );

    // Valor de todo lo que muestra el filtro (no solo de la página). Los retiros cuyo lote no tiene precio no suman.
    const valorRetirado = useMemo(() => sumarValores(retirosFiltrados.map(valorDe)), [retirosFiltrados, valorDe]);

    const paginacion = usePagination(retirosFiltrados, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const cargarMotivos = () => motivos.ejecutar(() => ObtenerMotivosRetiro(token));

    const buscarHistorial = () => {
        if (rango.desde && rango.hasta && rango.desde > rango.hasta) {
            setErrorRango("La fecha inicial no puede ser mayor a la fecha final");
            return;
        }
        setErrorRango("");
        setFiltroMotivo("");
        setCurrentPage(1);
        if (inventarioId) historial.ejecutar(() => ObtenerRetiros({ inventarioId, ...rango }, token));
    };

    useEffect(() => {
        cargarMotivos();
    }, []);

    // Al cambiar de inventario el historial es otro.
    useEffect(() => {
        buscarHistorial();
    }, [inventarioId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroMotivo, orden]);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Retiros Registrados">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} />
                <AvisoError mensaje={motivos.error} onRetry={cargarMotivos} />

                {/* Una sola cuadrícula para toda la barra: el inventario ocupa la columna de "Desde" (llega hasta donde
                    termina esa caja), "Retirar vencidos" queda sobre "Motivo" y "Registrar nuevo" y "Buscar" comparten la
                    última columna. */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] items-start gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <button
                        type="button"
                        onClick={() => setModalVencidos(true)}
                        disabled={!inventarioActual || opcionesMotivo.length === 0}
                        className={`md:col-start-3 md:justify-self-end bg-red-600 hover:bg-red-700 ${CLASES_BOTON_BASE}`}
                    >
                        <FontAwesomeIcon icon={faBoxOpen} /> Retirar vencidos
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalRegistro(true)}
                        disabled={!inventarioActual || opcionesMotivo.length === 0}
                        className={`bg-emerald-600 hover:bg-emerald-700 ${CLASES_BOTON}`}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Registrar nuevo
                    </button>

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
                    <SelectField
                        label="Motivo"
                        name="filtroMotivo"
                        value={filtroMotivo}
                        onChange={(e) => setFiltroMotivo(e.target.value)}
                        options={opcionesMotivo}
                        placeholder="Todos"
                        inline
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <button
                        type="button"
                        onClick={buscarHistorial}
                        disabled={!inventarioId || historial.cargando}
                        className={`bg-blue-600 hover:bg-blue-700 ${CLASES_BOTON}`}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar
                    </button>
                </div>

                <AvisoError mensaje={historial.error} onRetry={buscarHistorial} />
                <AvisoError mensaje={precios.error} onRetry={precios.recargar} />

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    sort={orden}
                    onSort={alternarOrden}
                    emptyText={historial.cargando ? "Cargando retiros..." : "No hay retiros para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={retirosFiltrados.length} etiqueta="retiros" />

                {retirosFiltrados.length > 0 && !precios.cargando && (
                    <p className="mt-2 text-right font-semibold">Valor referencial retirado: {textoValorTotal(valorRetirado)}</p>
                )}
            </SectionFieldset>

            <ModalRegistrarRetiro
                isOpen={modalRegistro}
                onRequestClose={() => setModalRegistro(false)}
                inventario={inventarioActual}
                opcionesMotivo={opcionesMotivo}
                token={token}
                usuario={userlogued}
                onSuccess={buscarHistorial}
            />

            <ModalRetirarVencidos
                isOpen={modalVencidos}
                onRequestClose={() => setModalVencidos(false)}
                inventario={inventarioActual}
                motivos={motivos.datos}
                token={token}
                usuario={userlogued}
                onRetirado={buscarHistorial}
            />
        </div>
    );
}
