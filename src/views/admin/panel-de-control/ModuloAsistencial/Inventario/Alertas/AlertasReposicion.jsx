import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faRotate } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
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
import { AYUDA_STOCK_DISPONIBLE, AYUDA_STOCK_FISICO, AYUDA_STOCK_RESERVADO } from "../textosAyudaStock";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { DescargarAlertasExcel, Faltante, ObtenerAlertasReposicion, OrdenarPorUrgencia } from "./controllerAlertasReposicion";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas. `label` es el texto simple
// (selector de columnas) y `encabezado`, si existe, lo que se ve en la cabecera de la tabla (con su "i" de ayuda). Los
// encabezados largos se parten en dos líneas.
const columnas = [
    { id: "nombre", label: "Medicamento", accessor: "nombre", width: "21%" },
    { id: "presentacion", label: "Presentación", accessor: "presentacion", width: "11%" },
    { id: "tipo", label: "Tipo", accessor: "tipoMedicamentoDescripcion", width: "11%" },
    {
        id: "stockFisico",
        label: "Stock Físico",
        encabezado: <>Stock Físico<InfoTooltip texto={AYUDA_STOCK_FISICO} /></>,
        accessor: "cantidadActual",
        width: "9%",
    },
    {
        id: "stockReservado",
        label: "Stock Reservado",
        encabezado: <>Stock Reservado<InfoTooltip texto={AYUDA_STOCK_RESERVADO} /></>,
        accessor: "cantidadReservada",
        width: "10%",
    },
    {
        id: "stockDisponible",
        label: "Stock Disponible",
        encabezado: <>Stock Disponible<InfoTooltip texto={AYUDA_STOCK_DISPONIBLE} /></>,
        accessor: "cantidadDisponible",
        width: "10%",
    },
    { id: "stockMinimo", label: "Stock Mínimo", accessor: "stockMinimo", width: "8%" },
    { id: "faltante", label: "Faltante para el mínimo", width: "11%", render: (row) => <strong className="text-red-600">{Faltante(row)}</strong> },
    { id: "proximoVencimiento", label: "Próx. Vencimiento", width: "11%", render: (row) => formatearFechaCorta(row.proximoVencimiento) || "—" },
];

// Columnas que la tabla trae ocultas; el usuario puede mostrarlas desde "Columnas".
const COLUMNAS_OCULTAS_INICIALES = ["stockFisico", "stockReservado"];

// Ancho común de las etiquetas de la barra, para que el inventario y el buscador midan lo mismo y sus cajas empiecen en
// la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function AlertasReposicion() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const { datos, cargando, error, ejecutar } = useConsultaInventario();
    const [filtroNombre, setFiltroNombre] = useState("");
    const [columnasOcultas, setColumnasOcultas] = useState(COLUMNAS_OCULTAS_INICIALES);

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
        if (inventarioId) ejecutar(() => ObtenerAlertasReposicion(inventarioId, token));
    };

    useEffect(() => {
        cargar();
    }, [inventarioId]);

    const alertas = useMemo(() => OrdenarPorUrgencia(datos), [datos]);

    const alertasFiltradas = useMemo(() => {
        const texto = normalizarTexto(filtroNombre);
        return alertas.filter((fila) => !texto || normalizarTexto(`${fila.nombre} ${fila.presentacion}`).includes(texto));
    }, [alertas, filtroNombre]);

    const paginacion = usePagination(alertasFiltradas, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNombre, inventarioId]);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Alertas de Reposición">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} />

                {/* Una sola cuadrícula de dos columnas: el inventario y el buscador están en la primera, así que miden lo
                    mismo. A la derecha van la actualización, y el Excel y las columnas. */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <div className="flex items-center gap-4">
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
                        {!cargando && !error && inventarioId && (
                            <span className={`font-semibold ${alertas.length > 0 ? "text-red-600" : "text-emerald-700"}`}>
                                {alertas.length > 0 ? `${alertas.length} medicamentos requieren reposición` : "No hay medicamentos por reponer"}
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
                            onClick={() => DescargarAlertasExcel(alertasFiltradas, inventarioActual)}
                            disabled={!inventarioActual || cargando || alertasFiltradas.length === 0}
                            title="Exporta todas las alertas de la búsqueda, no solo la página que se ve"
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

                <AvisoError mensaje={error} onRetry={cargar} />

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    emptyText={cargando ? "Cargando alertas..." : "No hay alertas de reposición"}
                />

                <PaginadorTabla paginacion={paginacion} total={alertasFiltradas.length} etiqueta="medicamentos" />
            </SectionFieldset>
        </div>
    );
}
