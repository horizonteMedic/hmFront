import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faRotate } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SelectorColumnas from "../../../../../components/reusableComponents/SelectorColumnas";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import InfoTooltip from "../InfoTooltip";
import { normalizarTexto } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { AYUDA_STOCK_DISPONIBLE, AYUDA_STOCK_FISICO, AYUDA_STOCK_MINIMO, AYUDA_STOCK_RESERVADO } from "../textosAyudaStock";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { DescargarStockExcel, Faltante, ObtenerStockResumen, OrdenarPorUrgencia } from "./controllerStock";
import ModalLotes from "./ModalLotes/ModalLotes";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas. `label` es el texto simple
// (selector de columnas) y `encabezado`, si existe, lo que se ve en la cabecera de la tabla (con su "i" de ayuda). Los
// encabezados largos se parten en dos líneas.
const columnas = [
    { id: "nombre", label: "Medicamento", accessor: "nombre", width: "19%" },
    { id: "presentacion", label: "Presentación", accessor: "presentacion", width: "10%" },
    { id: "tipo", label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "10%" },
    {
        id: "stockFisico",
        label: "Stock Físico",
        encabezado: <>Stock Físico<InfoTooltip texto={AYUDA_STOCK_FISICO} /></>,
        accessor: "cantidadActual",
        width: "8%",
    },
    {
        id: "stockReservado",
        label: "Stock Reservado",
        encabezado: <>Stock Reservado<InfoTooltip texto={AYUDA_STOCK_RESERVADO} /></>,
        accessor: "cantidadReservada",
        width: "9%",
    },
    {
        id: "stockDisponible",
        label: "Stock Disponible",
        encabezado: <>Stock Disponible<InfoTooltip texto={AYUDA_STOCK_DISPONIBLE} /></>,
        width: "9%",
        render: (row) => <strong>{row.cantidadDisponible}</strong>,
    },
    {
        id: "stockMinimo",
        label: "Stock Mínimo",
        encabezado: <>Stock Mínimo<InfoTooltip texto={AYUDA_STOCK_MINIMO} /></>,
        accessor: "stockMinimo",
        width: "8%",
    },
    {
        id: "faltante",
        label: "Faltante para el mínimo",
        width: "10%",
        render: (row) => (Faltante(row) > 0 ? <strong className="text-red-600">{Faltante(row)}</strong> : "—"),
    },
    { id: "proximoVencimiento", label: "Próx. Vencimiento", width: "10%", render: (row) => formatearFechaCorta(row.proximoVencimiento) || "—" },
    {
        id: "estado",
        label: "Estado",
        width: "8%",
        render: (row) => (
            <span className={`px-2 py-0.5 rounded text-sm font-semibold ${row.requiereReposicion ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                {row.requiereReposicion ? "Reponer" : "Suficiente"}
            </span>
        ),
    },
];

// Columnas que la tabla trae ocultas; el usuario puede mostrarlas desde "Columnas".
const COLUMNAS_OCULTAS_INICIALES = ["stockFisico", "stockReservado"];

// Ancho común de las etiquetas de la barra, para que el inventario, el buscador y el tipo midan lo mismo y sus cajas
// empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function Stock() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const { datos: stock, cargando, error, ejecutar } = useConsultaInventario();

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [soloReposicion, setSoloReposicion] = useState(false);
    const [columnasOcultas, setColumnasOcultas] = useState(COLUMNAS_OCULTAS_INICIALES);
    const [medicamentoLotes, setMedicamentoLotes] = useState(null);

    const columnasVisibles = useMemo(
        () =>
            columnas
                .filter((columna) => !columnasOcultas.includes(columna.id))
                .map(({ encabezado, ...columna }) => ({ ...columna, label: encabezado ?? columna.label })),
        [columnasOcultas]
    );

    const alternarColumna = (id) =>
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));

    const cargar = () => {
        if (inventarioId) ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    useEffect(() => {
        cargar();
    }, [inventarioId]);

    // Los tipos del filtro salen del propio stock, así no depende de otra consulta.
    const opcionesTipo = useMemo(() => {
        const tipos = new Map(stock.map((fila) => [fila.tipoMedicamento, fila.tipoMedicamentoDescripcion]));
        return [...tipos].map(([codigo, descripcion]) => ({ value: String(codigo), label: descripcion }));
    }, [stock]);

    // Con "solo por reponer" la lista queda como las alertas de reposición: lo más urgente (mayor faltante) primero.
    const stockFiltrado = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        const filas = stock.filter((fila) => {
            if (filtroTipo && String(fila.tipoMedicamento) !== filtroTipo) return false;
            if (soloReposicion && !fila.requiereReposicion) return false;
            return !texto || normalizarTexto(`${fila.nombre} ${fila.presentacion}`).includes(texto);
        });
        return soloReposicion ? OrdenarPorUrgencia(filas) : filas;
    }, [stock, filtroNombre, filtroTipo, soloReposicion]);

    const paginacion = usePagination(stockFiltrado, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    // Al cambiar un filtro la lista puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, filtroTipo, soloReposicion, inventarioId]);

    const porReponer = stock.filter((fila) => fila.requiereReposicion).length;

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Stock del Inventario">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} />

                {/* Una sola cuadrícula de dos columnas: el inventario, el buscador y el tipo están en la primera, así que
                    miden lo mismo. A la derecha van la actualización, el Excel, las columnas y el filtro de reposición. */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={cargar}
                            disabled={!inventarioId || cargando}
                            className="
                                bg-blue-600 hover:bg-blue-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faRotate} spin={cargando} /> Actualizar
                        </button>
                        {stock.length > 0 && (
                            <span className="text-sm">
                                {stock.length} medicamentos ·{" "}
                                <strong className={porReponer > 0 ? "text-red-600" : "text-emerald-700"}>{porReponer} por reponer</strong>
                            </span>
                        )}
                    </div>

                    <InputTextOneLine
                        label="Buscar"
                        name="filtroNombre"
                        labelWidth={ANCHO_ETIQUETA}
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => DescargarStockExcel(stockFiltrado, inventarioActual, soloReposicion)}
                            disabled={!inventarioActual || cargando || stockFiltrado.length === 0}
                            title="Exporta todo lo que muestra la búsqueda, no solo la página que se ve"
                            className="
                                bg-emerald-600 hover:bg-emerald-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faFileExcel} /> Exportar a Excel
                        </button>
                        <SelectorColumnas columnas={columnas} ocultas={columnasOcultas} onToggle={alternarColumna} />
                    </div>

                    <SelectField
                        label="Filtrar por tipo"
                        name="filtroTipo"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        options={opcionesTipo}
                        placeholder="Todos"
                        inline
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={soloReposicion} onChange={(e) => setSoloReposicion(e.target.checked)} />
                        Solo los que requieren reposición
                    </label>
                </div>

                <AvisoError mensaje={error} onRetry={cargar} />

                <p className="text-sm text-gray-500 mb-2">Haga clic en un medicamento para ver sus lotes.</p>

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    onRowClick={setMedicamentoLotes}
                    getRowClassName={(row) => (row.requiereReposicion ? "bg-red-50" : "")}
                    emptyText={cargando ? "Cargando stock..." : "No hay medicamentos para mostrar"}
                />

                <PaginadorTabla paginacion={paginacion} total={stockFiltrado.length} etiqueta="medicamentos" />
            </SectionFieldset>

            <ModalLotes
                isOpen={Boolean(medicamentoLotes)}
                onRequestClose={() => setMedicamentoLotes(null)}
                inventario={inventarioActual}
                medicamento={medicamentoLotes}
                token={token}
            />
        </div>
    );
}
