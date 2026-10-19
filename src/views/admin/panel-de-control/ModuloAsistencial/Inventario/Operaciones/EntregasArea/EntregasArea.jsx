import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import SelectorColumnas from "../../../../../../components/reusableComponents/SelectorColumnas";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaHora } from "../../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../../utils/listUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import { etiquetaMedicamento, rangoMesActual, resumenLotes } from "../../Compartido/inventarioUtils";
import PaginadorTabla from "../../Compartido/components/PaginadorTabla";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../../Compartido/hooks/useOrdenTabla";
import { ObtenerEntregasArea } from "./controllerEntregasArea";
import ModalNuevaEntrega from "./ModalNuevaEntrega/ModalNuevaEntrega";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas, y se ordena al pulsar su
// cabecera: por su `accessor` o, si se dibuja con `render`, por lo que devuelva su `valorOrden`.
const columnasHistorial = conOrden([
    { id: "numeroEntrega", label: "N° Entrega", accessor: "numeroEntrega", width: "8%" },
    { id: "fecha", label: "Fecha", width: "11%", valorOrden: (row) => row.fechaRegistro, render: (row) => formatearFechaHora(row.fechaRegistro) },
    {
        id: "medicamento",
        label: "Medicamento",
        width: "19%",
        valorOrden: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    { id: "cantidad", label: "Cantidad", accessor: "cantidad", width: "7%" },
    {
        id: "lotes",
        label: "Lotes",
        width: "19%",
        valorOrden: (row) => resumenLotes(row.lotes),
        render: (row) => <span className="text-sm">{resumenLotes(row.lotes) || "—"}</span>,
    },
    { id: "persona", label: "Persona", accessor: "personaEntrega", width: "12%" },
    { id: "area", label: "Área", accessor: "area", width: "8%" },
    { id: "motivo", label: "Motivo", accessor: "motivo", width: "9%" },
    { id: "usuario", label: "Usuario", accessor: "usuarioRegistro", width: "7%" },
]);

// Ancho común de las etiquetas de la barra de filtros, para que las cajas empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function EntregasArea() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);

    const historial = useConsultaInventario();
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [filtroArea, setFiltroArea] = useState("");
    const [modalEntrega, setModalEntrega] = useState(false);
    const [columnasOcultas, setColumnasOcultas] = useState([]);
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    const columnasVisibles = useMemo(() => columnasHistorial.filter((columna) => !columnasOcultas.includes(columna.id)), [columnasOcultas]);

    // Una columna oculta no puede seguir ordenando la tabla: no se vería por qué las filas están así.
    const alternarColumna = (id) => {
        if (orden?.id === id) quitarOrden();
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));
    };

    const opcionesFiltroArea = useMemo(() => {
        const areas = [...new Set(historial.datos.map((entrega) => entrega.area).filter(Boolean))].sort();
        return areas.map((area) => ({ value: area, label: area }));
    }, [historial.datos]);

    // Si se ordenó por una cabecera, ese orden manda sobre toda la lista (no solo la página).
    const entregasFiltradas = useMemo(
        () =>
            ordenarPorColumna(
                historial.datos.filter((entrega) => !filtroArea || entrega.area === filtroArea),
                columnasHistorial,
                orden
            ),
        [historial.datos, filtroArea, orden]
    );

    const paginacion = usePagination(entregasFiltradas, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const buscarHistorial = () => {
        if (rango.desde && rango.hasta && rango.desde > rango.hasta) {
            setErrorRango("La fecha inicial no puede ser mayor a la fecha final");
            return;
        }
        setErrorRango("");
        setFiltroArea("");
        setCurrentPage(1);
        if (inventarioId) historial.ejecutar(() => ObtenerEntregasArea({ inventarioId, ...rango }, token));
    };

    // Al cambiar de inventario el historial es otro.
    useEffect(() => {
        buscarHistorial();
    }, [inventarioId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroArea, orden]);

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Entregas Registradas">
                {/* Una sola cuadrícula para la barra: el inventario ocupa la columna de "Desde" y el botón para entregar
                    va a la derecha. */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setModalEntrega(true)}
                            disabled={!inventarioActual}
                            className="
                                bg-emerald-600 hover:bg-emerald-700
                                text-white text-base px-6 py-2 rounded
                                flex items-center gap-2
                                transition-all duration-150 ease-out
                                hover:shadow-lg
                                active:scale-95 active:shadow-inner
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Nueva entrega
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
                    <SelectField
                        label="Área"
                        name="filtroArea"
                        value={filtroArea}
                        onChange={(e) => setFiltroArea(e.target.value)}
                        options={opcionesFiltroArea}
                        placeholder="Todas"
                        inline
                        labelWidth={ANCHO_ETIQUETA}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <button
                        type="button"
                        onClick={buscarHistorial}
                        disabled={!inventarioId || historial.cargando}
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
                    <SelectorColumnas columnas={columnasHistorial} ocultas={columnasOcultas} onToggle={alternarColumna} />
                </div>

                <AvisoError mensaje={historial.error} onRetry={buscarHistorial} />

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={450}
                    sort={orden}
                    onSort={alternarOrden}
                    emptyText={historial.cargando ? "Cargando entregas..." : "No hay entregas para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={entregasFiltradas.length} etiqueta="entregas" />
            </SectionFieldset>

            <ModalNuevaEntrega
                isOpen={modalEntrega}
                onRequestClose={() => setModalEntrega(false)}
                inventarios={inventarios}
                inventarioId={inventarioId}
                setInventarioId={setInventarioId}
                inventarioActual={inventarioActual}
                errorInventarios={errorInventarios}
                cargarInventarios={cargarInventarios}
                token={token}
                usuario={userlogued}
                onSuccess={buscarHistorial}
            />
        </div>
    );
}
