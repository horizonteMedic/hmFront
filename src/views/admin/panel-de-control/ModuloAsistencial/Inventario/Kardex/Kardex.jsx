import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AutocompleteInput from "../../../../../components/reusableComponents/AutocompletableInput";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import { etiquetaMedicamento } from "../inventarioUtils";
import { ObtenerListaMedicamentos } from "../Medicamentos/controllerMedicamentos";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { ObtenerMovimientos, RangoInicialKardex, TipoMovimiento, ValidarFiltrosKardex } from "./controllerKardex";

const columnas = [
    { label: "Fecha", width: "12%", render: (row) => formatearFechaHora(row.fecha) },
    {
        label: "Tipo",
        width: "12%",
        render: (row) => {
            const tipo = TipoMovimiento(row.tipo);
            return <span className={`px-2 py-0.5 rounded text-sm font-semibold ${tipo.clases}`}>{tipo.texto}</span>;
        },
    },
    {
        label: "Medicamento / Lote",
        width: "26%",
        render: (row) => (
            <div>
                <div>{etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion })}</div>
                <div className="text-sm opacity-70">
                    Lote {row.numeroLote || "—"} · Vence {formatearFechaCorta(row.fechaVencimiento) || "—"}
                </div>
            </div>
        ),
    },
    { label: "Cantidad", accessor: "cantidad", width: "8%" },
    { label: "Saldo", accessor: "saldoActual", width: "7%" },
    { label: "Reservado", accessor: "saldoReservado", width: "8%" },
    { label: "Motivo / Referencia", width: "14%", render: (row) => [row.motivo, row.referencia].filter(Boolean).join(" · ") || "—" },
    { label: "Ticket", width: "6%", render: (row) => row.numeroTicket ?? "—" },
    { label: "Usuario", accessor: "usuario", width: "7%" },
];

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

    const opcionesMedicamento = useMemo(
        () => medicamentos.map((medicamento) => ({ id: medicamento.id, etiqueta: etiquetaMedicamento(medicamento) })),
        [medicamentos]
    );

    const paginacion = usePagination(movimientos, 25);
    const { setCurrentPage, paginatedData } = paginacion;

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

    const buscar = () => {
        const erroresForm = ValidarFiltrosKardex({ inventarioId, ...form });
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        setCurrentPage(1);
        ejecutar(() => ObtenerMovimientos({ inventarioId, ...form }, token));
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

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Kardex" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                    <div>
                        <AutocompleteInput
                            label="Medicamento"
                            id="medicamentoKardex"
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
                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelWidth="110px"
                        value={form.desde}
                        onChange={onChangeFecha}
                        error={errores.desde}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelWidth="110px"
                        value={form.hasta}
                        onChange={onChangeFecha}
                    />
                </div>

                <button
                    type="button"
                    onClick={buscar}
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
            </SectionFieldset>

            <SectionFieldset legend="Movimientos">
                {error && (
                    <div className="flex items-center justify-between gap-4 mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={buscar}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={500}
                    emptyText={cargando ? "Cargando movimientos..." : "No hay movimientos para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={movimientos.length} etiqueta="movimientos" />
            </SectionFieldset>
        </div>
    );
}
