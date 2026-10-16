import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta, formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { usePagination } from "../../../../../utils/listUtils";
import AvisoError from "../AvisoError";
import BuscadorMedicamentoStock from "../BuscadorMedicamentoStock";
import { etiquetaMedicamento, rangoMesActual } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { ObtenerLotesMedicamento, ObtenerStockResumen, OpcionesLote } from "../Stock/controllerStock";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { MOTIVO_OTRO, ObtenerMotivosRetiro, ObtenerRetiros, RegistrarRetiro, RetirarVencidos, ValidarRetiro } from "./controllerRetiros";

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

export default function Retiros() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, errorInventarios, cargarInventarios } = useInventarios(token);

    const initialFormState = { medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "", motivo: "", observacion: "" };
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [errores, setErrores] = useState({});

    const stock = useConsultaInventario();
    const lotes = useConsultaInventario();
    const motivos = useConsultaInventario();
    const historial = useConsultaInventario();
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [filtroMotivo, setFiltroMotivo] = useState("");

    // Se puede retirar lo que existe físicamente, aunque esté reservado o vencido: por eso cuenta el stock actual.
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadActual > 0), [stock.datos]);
    const lotesConStock = useMemo(() => lotes.datos.filter((lote) => lote.cantidadActual > 0), [lotes.datos]);
    const lote = lotesConStock.find((l) => String(l.id) === form.loteId) ?? null;

    const opcionesMotivo = useMemo(() => motivos.datos.map((motivo) => ({ value: motivo, label: motivo })), [motivos.datos]);

    const retirosFiltrados = useMemo(
        () => historial.datos.filter((retiro) => !filtroMotivo || retiro.motivo === filtroMotivo),
        [historial.datos, filtroMotivo]
    );

    const paginacion = usePagination(retirosFiltrados, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const cargarStock = () => {
        if (inventarioId) stock.ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

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

    // Al cambiar de inventario el stock y el historial son otros, y el medicamento y lote elegidos ya no valen.
    useEffect(() => {
        setForm((prev) => ({ ...prev, medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "" }));
        lotes.limpiar();
        cargarStock();
        buscarHistorial();
    }, [inventarioId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroMotivo]);

    // Al corregir un campo se le quita el mensaje de error.
    const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

    const onChange = (e) => {
        handleChange(e);
        limpiarError(e.target.name);
    };

    const onChangeCantidad = (e) => {
        handleChangeNumberDecimals(e, 0);
        limpiarError(e.target.name);
    };

    // Los selects no usan handleChange: este pasa a mayúsculas y restaura el cursor, algo que solo funciona
    // en cajas de texto.
    const onChangeSelect = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
        if (e.target.name === "motivo") limpiarError("observacion");
    };

    // Escribir en el buscador descarta el medicamento y el lote elegidos.
    const onTextoMedicamento = (texto) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: texto, medicamentoId: "", loteId: "" }));
        lotes.limpiar();
        limpiarError("medicamento");
    };

    // Al elegir el medicamento se traen sus lotes (con los vencidos) para elegir de cuál retirar.
    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: etiqueta, medicamentoId: String(fila.medicamentoId), loteId: "" }));
        limpiarError("medicamento");
        lotes.ejecutar(() => ObtenerLotesMedicamento(inventarioId, fila.medicamentoId, true, token));
    };

    const recargar = () => {
        lotes.limpiar();
        cargarStock();
        buscarHistorial();
    };

    const handleSave = async () => {
        const erroresForm = ValidarRetiro(form, lote);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        const registrado = await RegistrarRetiro(form, lote, token, userlogued);
        if (!registrado) return;

        handleClear();
        setErrores({});
        recargar();
    };

    const handleLimpiar = () => {
        handleClear();
        lotes.limpiar();
        setErrores({});
    };

    const handleRetirarVencidos = async () => {
        const ejecutado = await RetirarVencidos(token, userlogued);
        if (!ejecutado) return;

        handleClear();
        setErrores({});
        recargar();
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Registrar Retiro de Stock" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                    <BuscadorMedicamentoStock
                        id="medicamentoRetiro"
                        filas={medicamentosConStock}
                        texto={form.medicamentoTexto}
                        onTextoChange={onTextoMedicamento}
                        onSelect={onSelectMedicamento}
                        campoCantidad="cantidadActual"
                        rotulo="Stock"
                        placeholder={stock.cargando ? "Cargando stock..." : "Escriba para buscar..."}
                        error={errores.medicamento}
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <AvisoError
                        mensaje={lotes.error}
                        onRetry={() => form.medicamentoId && lotes.ejecutar(() => ObtenerLotesMedicamento(inventarioId, form.medicamentoId, true, token))}
                        className=""
                    />
                    <SelectField
                        label="Lote"
                        name="loteId"
                        value={form.loteId}
                        onChange={onChangeSelect}
                        options={OpcionesLote(lotesConStock)}
                        placeholder={
                            !form.medicamentoId
                                ? "Primero elija el medicamento"
                                : lotes.cargando
                                    ? "Cargando lotes..."
                                    : lotesConStock.length === 0
                                        ? "El medicamento no tiene lotes con stock"
                                        : "Seleccione el lote"
                        }
                        inline
                        labelWidth="110px"
                        disabled={!form.medicamentoId || lotesConStock.length === 0}
                        required
                        error={errores.loteId}
                    />
                    {lote && (
                        <p className="text-sm text-gray-600">
                            Actual: <strong>{lote.cantidadActual}</strong> · Reservada: <strong>{lote.cantidadReservada}</strong> · Disponible:{" "}
                            <strong>{lote.cantidadDisponible}</strong>
                            {lote.vencido ? " · Lote vencido" : ""}
                        </p>
                    )}
                </div>

                <InputTextOneLine
                    label="Cantidad"
                    name="cantidad"
                    labelWidth="110px"
                    value={form.cantidad}
                    onChange={onChangeCantidad}
                    required
                    error={errores.cantidad}
                />
                <SelectField
                    label="Motivo"
                    name="motivo"
                    value={form.motivo}
                    onChange={onChangeSelect}
                    options={opcionesMotivo}
                    inline
                    labelWidth="110px"
                    required
                    error={errores.motivo}
                />
                <div className="md:col-span-2">
                    <InputTextOneLine
                        label="Observación"
                        name="observacion"
                        labelWidth="110px"
                        value={form.observacion}
                        onChange={onChange}
                        required={form.motivo === MOTIVO_OTRO}
                        error={errores.observacion}
                    />
                    <AvisoError mensaje={motivos.error} onRetry={cargarMotivos} className="mt-2" />
                </div>
            </SectionFieldset>

            <BotonesForm hideEdit hidePrint saveLabel="Registrar Retiro" handleSave={handleSave} handleClear={handleLimpiar}>
                <button
                    type="button"
                    onClick={handleRetirarVencidos}
                    className="
                        bg-red-600 hover:bg-red-700
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner"
                >
                    <FontAwesomeIcon icon={faBoxOpen} /> Retirar Vencidos
                </button>
            </BotonesForm>

            <SectionFieldset legend="Retiros Registrados">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <InputTextOneLine
                        label="Desde"
                        name="desde"
                        type="date"
                        labelWidth="110px"
                        value={rango.desde}
                        onChange={(e) => setRango((prev) => ({ ...prev, desde: e.target.value }))}
                        error={errorRango}
                    />
                    <InputTextOneLine
                        label="Hasta"
                        name="hasta"
                        type="date"
                        labelWidth="110px"
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
                        labelWidth="110px"
                    />
                </div>

                <button
                    type="button"
                    onClick={buscarHistorial}
                    disabled={!inventarioId || historial.cargando}
                    className="
                        mb-3 bg-blue-600 hover:bg-blue-700
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar
                </button>

                <AvisoError mensaje={historial.error} onRetry={buscarHistorial} />

                <TablaTemplate
                    columns={columnas}
                    data={paginatedData}
                    height={450}
                    emptyText={historial.cargando ? "Cargando retiros..." : "No hay retiros para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={retirosFiltrados.length} etiqueta="retiros" />
            </SectionFieldset>
        </div>
    );
}
