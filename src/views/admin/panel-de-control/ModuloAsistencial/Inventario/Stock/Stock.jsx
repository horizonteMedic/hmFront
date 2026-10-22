import { useCallback, useEffect, useMemo, useState } from "react";
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
import AvisoError from "../Compartido/components/AvisoError";
import InfoTooltip from "../Compartido/components/InfoTooltip";
import { normalizarTexto } from "../Compartido/inventarioUtils";
import PaginadorTabla from "../Compartido/components/PaginadorTabla";
import SelectorInventario from "../Compartido/components/SelectorInventario";
import { sumarValores, textoValorMedicamento, textoValorTotal, valorPorMedicamento } from "../Compartido/precioReferencial";
import {
    AYUDA_STOCK_DISPONIBLE,
    AYUDA_STOCK_FISICO,
    AYUDA_STOCK_MINIMO,
    AYUDA_STOCK_RESERVADO,
    AYUDA_VALOR_STOCK,
} from "../Compartido/textosAyudaStock";
import { useConsultaInventario } from "../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../Compartido/hooks/useInventarios";
import { useLotesInventario } from "../Compartido/hooks/useLotesInventario";
import { esOrdenable, ordenarPorColumna, useOrdenTabla } from "../Compartido/hooks/useOrdenTabla";
import { DescargarStockExcel, Faltante, ObtenerStockResumen, OrdenarPorUrgencia } from "./controllerStock";
import ModalLotes from "./ModalLotes/ModalLotes";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas. `label` es el texto simple
// (selector de columnas) y `encabezado`, si existe, lo que se ve en la cabecera de la tabla (con su "i" de ayuda). Los
// encabezados largos se parten en dos líneas. Al pulsar la cabecera se ordena por el `accessor` de la columna o, si se
// dibuja con `render`, por lo que devuelva su `valorOrden`. `valorDe(fila)` da el valor en stock del medicamento de la fila.
const crearColumnas = (valorDe) => [
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
        valorOrden: (row) => row.cantidadDisponible,
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
        valorOrden: Faltante,
        render: (row) => (Faltante(row) > 0 ? <strong className="text-red-600">{Faltante(row)}</strong> : "—"),
    },
    {
        id: "valorStock",
        label: "Valor en stock",
        encabezado: <>Valor en stock<InfoTooltip texto={AYUDA_VALOR_STOCK} /></>,
        width: "10%",
        valorOrden: (row) => {
            const valor = valorDe(row);
            return !valor || valor.sinPrecio >= valor.lotes ? null : valor.total;
        },
        render: (row) => textoValorMedicamento(valorDe(row)),
    },
    {
        id: "proximoVencimiento",
        label: "Próx. Vencimiento",
        width: "10%",
        valorOrden: (row) => row.proximoVencimiento,
        render: (row) => formatearFechaCorta(row.proximoVencimiento) || "—",
    },
    {
        id: "estado",
        label: "Estado",
        width: "8%",
        valorOrden: (row) => (row.requiereReposicion ? 1 : 0),
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
    // El stock resumido no trae precios: el valor sale de los lotes del inventario (stock físico × precio referencial).
    const precios = useLotesInventario(inventarioId, token);
    const { recargar: recargarPrecios } = precios;

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [soloReposicion, setSoloReposicion] = useState(false);
    const [columnasOcultas, setColumnasOcultas] = useState(COLUMNAS_OCULTAS_INICIALES);
    const [medicamentoLotes, setMedicamentoLotes] = useState(null);
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    const valores = useMemo(() => valorPorMedicamento(precios.lotes), [precios.lotes]);
    const valorDe = useCallback((fila) => valores.get(String(fila.medicamentoId)), [valores]);
    const columnas = useMemo(() => crearColumnas(valorDe), [valorDe]);

    // Valor de todo el inventario (no solo de lo que deja ver el filtro).
    const valorInventario = useMemo(() => {
        const todos = [...valores.values()];
        return { total: sumarValores(todos.map((valor) => valor.total)).total, sinPrecio: todos.reduce((suma, valor) => suma + valor.sinPrecio, 0) };
    }, [valores]);

    const columnasVisibles = useMemo(
        () =>
            columnas
                .filter((columna) => !columnasOcultas.includes(columna.id))
                .map(({ encabezado, ...columna }) => ({ ...columna, label: encabezado ?? columna.label, sortable: esOrdenable(columna) })),
        [columnas, columnasOcultas]
    );

    // Una columna oculta no puede seguir ordenando la tabla: no se vería por qué las filas están así.
    const alternarColumna = (id) => {
        if (orden?.id === id) quitarOrden();
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));
    };

    const cargar = () => {
        if (inventarioId) ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    // Actualizar y Reintentar vuelven a pedir también los lotes. Al cambiar de inventario los lotes se piden solos (los pide
    // `useLotesInventario`), por eso el efecto de abajo solo llama a `cargar`.
    const actualizar = () => {
        cargar();
        recargarPrecios();
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
    // Si se ordenó por una cabecera, ese orden manda sobre toda la lista (no solo la página) y también sale en el Excel.
    const stockFiltrado = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        const filas = stock.filter((fila) => {
            if (filtroTipo && String(fila.tipoMedicamento) !== filtroTipo) return false;
            if (soloReposicion && !fila.requiereReposicion) return false;
            return !texto || normalizarTexto(`${fila.nombre} ${fila.presentacion}`).includes(texto);
        });
        return ordenarPorColumna(soloReposicion ? OrdenarPorUrgencia(filas) : filas, columnas, orden);
    }, [stock, filtroNombre, filtroTipo, soloReposicion, columnas, orden]);

    const paginacion = usePagination(stockFiltrado, 50);
    const { setCurrentPage, paginatedData } = paginacion;

    // Al cambiar un filtro o el orden la lista puede quedar más corta que la página actual.
    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, filtroTipo, soloReposicion, inventarioId, orden]);

    const porReponer = stock.filter((fila) => fila.requiereReposicion).length;

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Stock del Inventario">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} />

                {/* Una sola cuadrícula de dos columnas: el inventario, el buscador y el tipo están en la primera, así que
                    miden lo mismo. A la derecha va la actualización y, en la fila del tipo, el filtro de reposición con
                    el Excel y las columnas. */}
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
                            onClick={actualizar}
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
                                {!precios.cargando && !precios.error && precios.lotes.length > 0 && (
                                    <>
                                        {" "}· Valor referencial: <strong>{textoValorTotal(valorInventario)}</strong>
                                    </>
                                )}
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

                    {/* Va a la primera columna (una fila nueva): si no, la cuadrícula lo pondría junto al buscador. */}
                    <div className="md:col-start-1">
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
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={soloReposicion} onChange={(e) => setSoloReposicion(e.target.checked)} />
                            Solo los que requieren reposición
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => DescargarStockExcel(stockFiltrado, inventarioActual, soloReposicion, valorDe, valorInventario)}
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
                    </div>
                </div>

                <AvisoError mensaje={error} onRetry={cargar} />
                <AvisoError mensaje={precios.error} onRetry={recargarPrecios} />

                <p className="text-sm text-gray-500 mb-2">
                    Haga clic en un medicamento para ver sus lotes. En &quot;Valor en stock&quot;, un * indica que algún lote no tiene precio referencial.
                </p>

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    sort={orden}
                    onSort={alternarOrden}
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
