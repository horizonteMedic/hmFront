import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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
import { etiquetaMedicamento, rangoMesActual, resumenLotes } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { ObtenerStockResumen } from "../Stock/controllerStock";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import { OTRA_AREA, ObtenerEntregasArea, RegistrarEntregaArea, ValidarEntregaArea, opcionesArea } from "./controllerEntregasArea";

const columnas = [
    { label: "Fecha", width: "11%", render: (row) => formatearFechaHora(row.fechaRegistro) },
    {
        label: "Medicamento",
        width: "20%",
        render: (row) => etiquetaMedicamento({ nombre: row.medicamentoNombre, presentacion: row.presentacion }),
    },
    { label: "Cantidad", accessor: "cantidad", width: "7%" },
    { label: "Lotes", width: "20%", render: (row) => <span className="text-sm">{resumenLotes(row.lotes) || "—"}</span> },
    { label: "Persona", accessor: "personaEntrega", width: "13%" },
    { label: "Área", accessor: "area", width: "9%" },
    { label: "Motivo", accessor: "motivo", width: "12%" },
    { label: "Usuario", accessor: "usuarioRegistro", width: "8%" },
];

export default function EntregasArea() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);

    // Se parte de un estado sin medicamento ni lote; el rango del historial se calcula al abrir la pestaña.
    const initialFormState = { medicamentoTexto: "", medicamentoId: "", cantidad: "", motivo: "", personaEntrega: "", area: "", areaOtro: "" };
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [errores, setErrores] = useState({});

    const stock = useConsultaInventario();
    const historial = useConsultaInventario();
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [filtroArea, setFiltroArea] = useState("");

    // Solo se puede entregar lo que tiene unidades disponibles (las reservadas por recetas no cuentan).
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadDisponible > 0), [stock.datos]);
    const medicamentoStock = stock.datos.find((fila) => String(fila.medicamentoId) === form.medicamentoId) ?? null;

    const opcionesFiltroArea = useMemo(() => {
        const areas = [...new Set(historial.datos.map((entrega) => entrega.area).filter(Boolean))].sort();
        return areas.map((area) => ({ value: area, label: area }));
    }, [historial.datos]);

    const entregasFiltradas = useMemo(
        () => historial.datos.filter((entrega) => !filtroArea || entrega.area === filtroArea),
        [historial.datos, filtroArea]
    );

    const paginacion = usePagination(entregasFiltradas, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const cargarStock = () => {
        if (inventarioId) stock.ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

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

    // Al cambiar de inventario el stock y el historial son otros, y el medicamento elegido ya no vale.
    useEffect(() => {
        setForm((prev) => ({ ...prev, medicamentoTexto: "", medicamentoId: "", cantidad: "" }));
        cargarStock();
        buscarHistorial();
    }, [inventarioId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroArea]);

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

    // El select y la fecha no usan handleChange: este pasa a mayúsculas y restaura el cursor, algo que
    // solo funciona en cajas de texto.
    const onChangeSelect = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
        if (e.target.name === "area") limpiarError("areaOtro");
    };

    // Escribir en el buscador descarta el medicamento elegido: hay que volver a elegirlo de la lista.
    const onTextoMedicamento = (texto) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: texto, medicamentoId: "" }));
        limpiarError("medicamento");
    };

    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: etiqueta, medicamentoId: String(fila.medicamentoId) }));
        limpiarError("medicamento");
    };

    const handleSave = async () => {
        const erroresForm = ValidarEntregaArea(form, medicamentoStock);
        if (!inventarioActual) erroresForm.inventario = "Seleccione el inventario";
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        const registrada = await RegistrarEntregaArea(form, inventarioActual, token, userlogued);
        if (!registrada) return;

        handleClear();
        setErrores({});
        cargarStock();
        buscarHistorial();
    };

    const handleLimpiar = () => {
        handleClear();
        setErrores({});
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Registrar Entrega a Área o Persona" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                    />
                    {errores.inventario && <p className="mt-1 text-sm text-red-600">{errores.inventario}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                    <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                    <BuscadorMedicamentoStock
                        id="medicamentoEntregaArea"
                        filas={medicamentosConStock}
                        texto={form.medicamentoTexto}
                        onTextoChange={onTextoMedicamento}
                        onSelect={onSelectMedicamento}
                        nextFocusId="cantidad"
                        placeholder={stock.cargando ? "Cargando stock..." : "Escriba para buscar..."}
                        error={errores.medicamento}
                    />
                    {medicamentoStock && (
                        <p className="text-sm text-gray-600">
                            Disponible: <strong>{medicamentoStock.cantidadDisponible}</strong>
                            {medicamentoStock.cantidadReservada > 0 ? ` (${medicamentoStock.cantidadReservada} reservadas por recetas)` : ""}
                            {medicamentoStock.proximoVencimiento ? ` · Próximo vencimiento: ${formatearFechaCorta(medicamentoStock.proximoVencimiento)}` : ""}
                            {" · Se entrega primero lo que vence antes."}
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
                <InputTextOneLine
                    label="Motivo"
                    name="motivo"
                    labelWidth="110px"
                    value={form.motivo}
                    onChange={onChange}
                    required
                    error={errores.motivo}
                />
                <InputTextOneLine
                    label="Persona"
                    name="personaEntrega"
                    labelWidth="110px"
                    value={form.personaEntrega}
                    onChange={onChange}
                    required
                    error={errores.personaEntrega}
                />
                <SelectField
                    label="Área"
                    name="area"
                    value={form.area}
                    onChange={onChangeSelect}
                    options={opcionesArea}
                    inline
                    labelWidth="110px"
                    required
                    error={errores.area}
                />
                {form.area === OTRA_AREA && (
                    <InputTextOneLine
                        label="Especifique"
                        name="areaOtro"
                        labelWidth="110px"
                        value={form.areaOtro}
                        onChange={onChange}
                        required
                        error={errores.areaOtro}
                    />
                )}
            </SectionFieldset>

            <BotonesForm hideEdit hidePrint saveLabel="Registrar Entrega" handleSave={handleSave} handleClear={handleLimpiar} />

            <SectionFieldset legend="Entregas Registradas">
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
                        label="Área"
                        name="filtroArea"
                        value={filtroArea}
                        onChange={(e) => setFiltroArea(e.target.value)}
                        options={opcionesFiltroArea}
                        placeholder="Todas"
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
                    emptyText={historial.cargando ? "Cargando entregas..." : "No hay entregas para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={entregasFiltradas.length} etiqueta="entregas" />
            </SectionFieldset>
        </div>
    );
}
