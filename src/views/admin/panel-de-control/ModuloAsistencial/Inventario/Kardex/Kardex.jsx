import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AutocompleteInput from "../../../../../components/reusableComponents/AutocompletableInput";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import SelectorColumnas from "../../../../../components/reusableComponents/SelectorColumnas";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import InfoTooltip from "../InfoTooltip";
import { etiquetaMedicamento, normalizarTexto } from "../inventarioUtils";
import { ObtenerListaMedicamentos } from "../Medicamentos/controllerMedicamentos";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../useOrdenTabla";
import { ObtenerMovimientos, RangoInicialKardex, TipoMovimiento, ValidarFiltrosKardex } from "./controllerKardex";

const AYUDA_CANTIDAD = "Unidades que se movieron en este movimiento. No es el stock que quedó en el inventario.";
const AYUDA_STOCK_FISICO = "Stock físico que quedó en el inventario luego de este movimiento. No considera las reservas.";
const AYUDA_STOCK_RESERVADO = "Stock reservado (aún no recogido en farmacia) que quedó luego de este movimiento.";

// Cada columna lleva un `id` para poder mostrarla u ocultarla desde el selector de columnas. `label` es el texto simple
// (selector de columnas) y `encabezado`, si existe, lo que se ve en la cabecera de la tabla (con su "i" de ayuda). Los
// encabezados largos se parten en varias líneas. Al pulsar la cabecera se ordena por el `accessor` de la columna o, si se
// dibuja con `render`, por lo que devuelva su `valorOrden`. El medicamento va primero y luego el tipo de movimiento.
const columnas = [
    {
        id: "medicamento",
        label: "Medicamento / Lote",
        width: "26%",
        valorOrden: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
        render: (row) => (
            <div>
                <div>{etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion })}</div>
                <div className="text-sm opacity-70">
                    Lote {row.numeroLote || "—"} · Vence {formatearFechaCorta(row.fechaVencimiento) || "—"}
                </div>
            </div>
        ),
    },
    {
        id: "tipo",
        label: "Tipo",
        width: "11%",
        valorOrden: (row) => TipoMovimiento(row.tipo).texto,
        render: (row) => {
            const tipo = TipoMovimiento(row.tipo);
            return <span className={`px-2 py-0.5 rounded text-sm font-semibold ${tipo.clases}`}>{tipo.texto}</span>;
        },
    },
    { id: "fecha", label: "Fecha", width: "12%", valorOrden: (row) => row.fecha, render: (row) => formatearFechaHora(row.fecha) },
    {
        id: "cantidad",
        label: "Cantidad del movimiento",
        encabezado: <>Cantidad del movimiento<InfoTooltip texto={AYUDA_CANTIDAD} /></>,
        accessor: "cantidad",
        width: "10%",
    },
    {
        id: "stockFisico",
        label: "Stock físico tras el movimiento",
        encabezado: <>Stock físico tras el movimiento<InfoTooltip texto={AYUDA_STOCK_FISICO} /></>,
        accessor: "saldoActual",
        width: "11%",
    },
    {
        id: "stockReservado",
        label: "Stock reservado tras el movimiento",
        encabezado: <>Stock reservado tras el movimiento<InfoTooltip texto={AYUDA_STOCK_RESERVADO} /></>,
        accessor: "saldoReservado",
        width: "11%",
    },
    {
        id: "motivo",
        label: "Motivo / Referencia",
        width: "14%",
        valorOrden: (row) => [row.motivo, row.referencia].filter(Boolean).join(" · "),
        render: (row) => [row.motivo, row.referencia].filter(Boolean).join(" · ") || "—",
    },
    { id: "ticket", label: "Ticket", width: "6%", valorOrden: (row) => row.numeroTicket, render: (row) => row.numeroTicket ?? "—" },
    { id: "usuario", label: "Usuario", accessor: "usuario", width: "8%" },
];

// Columnas que la tabla trae ocultas; el usuario puede mostrarlas desde "Columnas".
const COLUMNAS_OCULTAS_INICIALES = ["stockFisico", "stockReservado"];

// Ancho común de las etiquetas de los filtros, para que todas las cajas empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function Kardex() {
    const { token } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, errorInventarios, cargarInventarios } = useInventarios(token);
    // El rango se calcula al abrir la pestaña (no al cargar el módulo) para que "hoy" sea el de ese momento.
    const initialFormState = { medicamentoTexto: "", medicamentoId: "", ...RangoInicialKardex() };
    const { form, setForm, handleChangeSimple } = useForm(initialFormState);
    const { datos: movimientos, cargando, error, ejecutar } = useConsultaInventario();

    // Para el kardex se listan también los medicamentos inactivos: pueden tener historial.
    const [medicamentos, setMedicamentos] = useState([]);
    const [errorMedicamentos, setErrorMedicamentos] = useState("");
    const [errores, setErrores] = useState({});
    const [columnasOcultas, setColumnasOcultas] = useState(COLUMNAS_OCULTAS_INICIALES);
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    const columnasVisibles = useMemo(
        () =>
            conOrden(columnas.filter((columna) => !columnasOcultas.includes(columna.id))).map(({ encabezado, ...columna }) => ({
                ...columna,
                label: encabezado ?? columna.label,
            })),
        [columnasOcultas]
    );

    // Una columna oculta no puede seguir ordenando la tabla: no se vería por qué las filas están así.
    const alternarColumna = (id) => {
        if (orden?.id === id) quitarOrden();
        setColumnasOcultas((actuales) => (actuales.includes(id) ? actuales.filter((oculta) => oculta !== id) : [...actuales, id]));
    };

    const opcionesMedicamento = useMemo(
        () => medicamentos.map((medicamento) => ({ id: medicamento.id, etiqueta: etiquetaMedicamento(medicamento) })),
        [medicamentos]
    );

    // Si se ordenó por una cabecera, ese orden manda sobre toda la lista (no solo la página).
    const movimientosOrdenados = useMemo(() => ordenarPorColumna(movimientos, columnas, orden), [movimientos, orden]);

    const paginacion = usePagination(movimientosOrdenados, 25);
    const { setCurrentPage, paginatedData } = paginacion;

    useEffect(() => {
        setCurrentPage(1);
    }, [orden]);

    const cargarMedicamentos = async () => {
        const res = await ObtenerListaMedicamentos(token);
        if (!res.ok) {
            setErrorMedicamentos(res.mensaje);
            return;
        }
        setErrorMedicamentos("");
        setMedicamentos(res.resultado);
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    // Sin `filtros` busca con lo que hay en el formulario; con ellos (clic en un movimiento) busca con esos, porque el
    // estado del formulario todavía no se actualizó en este render.
    const buscar = (filtros = form) => {
        const erroresForm = ValidarFiltrosKardex({ inventarioId, ...filtros });
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        setCurrentPage(1);
        ejecutar(() => ObtenerMovimientos({ inventarioId, ...filtros }, token));
    };

    // Al abrir y al cambiar de inventario se busca con los filtros que haya.
    useEffect(() => {
        if (inventarioId) buscar();
    }, [inventarioId]);

    // Al corregir un campo se le quita el mensaje de error.
    const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

    const onChangeFecha = (e) => {
        handleChangeSimple(e);
        limpiarError("desde");
    };

    // Escribir en el buscador descarta el medicamento elegido: hay que volver a elegirlo de la lista.
    const onChangeMedicamento = (texto) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: texto, medicamentoId: "" }));
        limpiarError("medicamento");
    };

    const onSelectMedicamento = (opcion) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: opcion.etiqueta, medicamentoId: String(opcion.id) }));
        limpiarError("medicamento");
    };

    // Clic en un movimiento: el medicamento queda en el buscador y se trae la traza de ese medicamento (mismo
    // inventario y fechas). Si el movimiento no trae el id, se busca en el catálogo por nombre y presentación.
    const verTrazaMedicamento = (fila) => {
        const medicamento =
            fila.medicamentoId != null
                ? medicamentos.find((m) => String(m.id) === String(fila.medicamentoId))
                : medicamentos.find(
                      (m) =>
                          normalizarTexto(m.nombre) === normalizarTexto(fila.medicamentoNombre) &&
                          normalizarTexto(m.presentacion) === normalizarTexto(fila.presentacion)
                  );
        const medicamentoId = fila.medicamentoId ?? medicamento?.id;
        if (medicamentoId == null) {
            setErrores((prev) => ({ ...prev, medicamento: "No se pudo identificar el medicamento de ese movimiento. Búsquelo en la lista." }));
            return;
        }

        const medicamentoTexto = etiquetaMedicamento(medicamento ?? { nombre: fila.medicamentoNombre, presentacion: fila.presentacion });
        setForm((prev) => ({ ...prev, medicamentoTexto, medicamentoId: String(medicamentoId) }));
        limpiarError("medicamento");
        buscar({ ...form, medicamentoTexto, medicamentoId: String(medicamentoId) });
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Kardex" className="space-y-3">
                <AvisoError mensaje={errorInventarios} onRetry={cargarInventarios} className="" />

                {/* Primera fila: inventario, desde y hasta. Segunda: medicamento (ocupa dos columnas, así su caja empieza en
                    la misma columna que la del inventario) y el botón Buscar. */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.desde}
                        onChange={onChangeFecha}
                        error={errores.desde}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.hasta}
                        onChange={onChangeFecha}
                    />

                    <div className="md:col-span-2">
                        <AutocompleteInput
                            label="Medicamento"
                            id="medicamentoKardex"
                            labelWidth={ANCHO_ETIQUETA}
                            value={form.medicamentoTexto}
                            options={opcionesMedicamento}
                            searchKey="etiqueta"
                            placeholder="Todos (escriba para filtrar)"
                            onChange={onChangeMedicamento}
                            onSelect={onSelectMedicamento}
                        />
                        {errores.medicamento && <p className="mt-1 text-sm text-red-600">{errores.medicamento}</p>}
                        {errorMedicamentos && (
                            <p className="mt-1 text-sm text-red-600">
                                {errorMedicamentos}{" "}
                                <button type="button" onClick={cargarMedicamentos} className="underline">Reintentar</button>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => buscar()}
                            disabled={cargando}
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
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Movimientos">
                <AvisoError mensaje={error} onRetry={() => buscar()} />

                <p className="text-sm text-gray-500 mb-2">Haga clic en un movimiento para ver la traza de ese medicamento.</p>

                <TablaTemplate
                    columns={columnasVisibles}
                    data={paginatedData}
                    height={500}
                    sort={orden}
                    onSort={alternarOrden}
                    onRowClick={verTrazaMedicamento}
                    emptyText={cargando ? "Cargando movimientos..." : "No hay movimientos para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={movimientosOrdenados.length} etiqueta="movimientos" />
            </SectionFieldset>
        </div>
    );
}
