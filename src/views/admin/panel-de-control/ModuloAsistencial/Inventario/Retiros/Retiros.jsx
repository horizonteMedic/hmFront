import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import { etiquetaMedicamento, rangoMesActual } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { ObtenerMotivosRetiro, ObtenerRetiros } from "./controllerRetiros";
import ModalRegistrarRetiro from "./ModalRegistrarRetiro/ModalRegistrarRetiro";
import ModalRetirarVencidos from "./ModalRetirarVencidos/ModalRetirarVencidos";

const columnas = [
    { label: "Fecha", width: "12%", render: (row) => formatearFechaHora(row.fechaRegistro) },
    {
        label: "Medicamento",
        width: "24%",
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    {
        label: "Lote",
        width: "16%",
        render: (row) => `${row.numeroLote || "Sin lote"} · ${formatearFechaCorta(row.fechaVencimiento) || "—"}`,
    },
    { label: "Cantidad", accessor: "cantidad", width: "8%" },
    {
        label: "Motivo",
        width: "13%",
        render: (row) => (
            <span>
                {row.motivo}
                {row.automatico && <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-semibold">AUTO</span>}
            </span>
        ),
    },
    { label: "Observación", width: "17%", render: (row) => row.observacion || "—" },
    { label: "Usuario", accessor: "usuarioRegistro", width: "10%" },
];

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

    const opcionesMotivo = useMemo(() => motivos.datos.map((motivo) => ({ value: motivo, label: motivo })), [motivos.datos]);

    const retirosFiltrados = useMemo(
        () => historial.datos.filter((retiro) => !filtroMotivo || retiro.motivo === filtroMotivo),
        [historial.datos, filtroMotivo]
    );

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
    }, [filtroMotivo]);

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

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    emptyText={historial.cargando ? "Cargando retiros..." : "No hay retiros para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={retirosFiltrados.length} etiqueta="retiros" />
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
