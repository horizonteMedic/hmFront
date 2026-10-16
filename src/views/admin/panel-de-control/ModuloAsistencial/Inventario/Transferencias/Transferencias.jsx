import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import { rangoMesActual } from "../inventarioUtils";
import PaginadorTabla from "../PaginadorTabla";
import SelectorInventario from "../SelectorInventario";
import { ObtenerLotesMedicamento, ObtenerStockResumen, OpcionesLote } from "../Stock/controllerStock";
import { useConsultaInventario } from "../useConsultaInventario";
import { useInventarios } from "../useInventarios";
import {
    ConfirmarCambioOrigen,
    CrearItemTransferencia,
    ObtenerTransferencias,
    RegistrarTransferencia,
    ValidarItemTransferencia,
} from "./controllerTransferencias";
import ModalDetalleTransferencia from "./ModalDetalleTransferencia/ModalDetalleTransferencia";

const columnasHistorial = [
    { label: "N°", accessor: "id", width: "6%" },
    { label: "Fecha", width: "14%", render: (row) => formatearFechaHora(row.fechaRegistro) },
    { label: "Origen", accessor: "inventarioOrigenNombre", width: "17%" },
    { label: "Destino", accessor: "inventarioDestinoNombre", width: "17%" },
    { label: "Lotes", width: "7%", render: (row) => row.items?.length ?? "—" },
    { label: "Observación", width: "24%", render: (row) => row.observacion || "—" },
    { label: "Usuario", accessor: "usuarioRegistro", width: "15%" },
];

export default function Transferencias() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);

    const initialFormState = { medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "", observacion: "" };
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [destinoId, setDestinoId] = useState("");
    const [items, setItems] = useState([]);
    const [errores, setErrores] = useState({});

    const stock = useConsultaInventario();
    const lotes = useConsultaInventario();

    const historial = useConsultaInventario();
    const [historialId, setHistorialId] = useState("");
    const [rango, setRango] = useState(rangoMesActual);
    const [errorRango, setErrorRango] = useState("");
    const [transferenciaDetalle, setTransferenciaDetalle] = useState(null);

    const destinoActual = inventarios.find((inventario) => String(inventario.id) === destinoId) ?? null;

    // Solo se transfiere lo disponible (lo reservado por recetas no se puede mover) y que no esté vencido.
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadDisponible > 0), [stock.datos]);
    const lotesDisponibles = useMemo(() => lotes.datos.filter((lote) => lote.cantidadDisponible > 0 && !lote.vencido), [lotes.datos]);
    const lote = lotesDisponibles.find((l) => String(l.id) === form.loteId) ?? null;

    const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0);

    const paginacion = usePagination(historial.datos, 10);
    const { setCurrentPage, paginatedData } = paginacion;

    const cargarStock = () => {
        if (inventarioId) stock.ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    const cargarLotes = (medicamentoId = form.medicamentoId) => {
        if (inventarioId && medicamentoId) lotes.ejecutar(() => ObtenerLotesMedicamento(inventarioId, medicamentoId, false, token));
    };

    const buscarHistorial = () => {
        if (rango.desde && rango.hasta && rango.desde > rango.hasta) {
            setErrorRango("La fecha inicial no puede ser mayor a la fecha final");
            return;
        }
        setErrorRango("");
        setCurrentPage(1);
        if (historialId) historial.ejecutar(() => ObtenerTransferencias({ inventarioId: historialId, ...rango }, token));
    };

    // El destino no puede ser el origen: se mantiene el elegido mientras siga siendo válido.
    useEffect(() => {
        const otros = inventarios.filter((inventario) => inventario.activo !== false && String(inventario.id) !== inventarioId);
        setDestinoId((actual) => (otros.some((inventario) => String(inventario.id) === actual) ? actual : String(otros[0]?.id ?? "")));
    }, [inventarios, inventarioId]);

    // El historial parte mostrando el mismo inventario que el origen; después se elige aparte.
    useEffect(() => {
        setHistorialId((actual) => actual || inventarioId);
    }, [inventarioId]);

    // Al cambiar el origen el stock es otro y el medicamento y lote elegidos ya no valen.
    useEffect(() => {
        setForm((prev) => ({ ...prev, medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "" }));
        lotes.limpiar();
        cargarStock();
    }, [inventarioId]);

    useEffect(() => {
        buscarHistorial();
    }, [historialId]);

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

    // El select no usa handleChange: este pasa a mayúsculas y restaura el cursor, algo que solo funciona
    // en cajas de texto.
    const onChangeLote = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
    };

    const onChangeOrigen = async (e) => {
        const nuevoOrigen = e.target.value;
        if (nuevoOrigen === inventarioId) return;
        if (items.length > 0 && !(await ConfirmarCambioOrigen(items.length))) return;

        setItems([]);
        setErrores({});
        setInventarioId(nuevoOrigen);
    };

    // Escribir en el buscador descarta el medicamento y el lote elegidos.
    const onTextoMedicamento = (texto) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: texto, medicamentoId: "", loteId: "" }));
        lotes.limpiar();
        limpiarError("medicamento");
    };

    // Al elegir el medicamento se traen sus lotes vigentes para elegir de cuál transferir.
    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: etiqueta, medicamentoId: String(fila.medicamentoId), loteId: "" }));
        limpiarError("medicamento");
        cargarLotes(fila.medicamentoId);
    };

    const handleAgregar = () => {
        const erroresItem = ValidarItemTransferencia(form, lote, items);
        setErrores(erroresItem);
        if (Object.keys(erroresItem).length > 0) return;

        setItems((prev) => [...prev, CrearItemTransferencia(form, lote)]);
        setForm((prev) => ({ ...prev, medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "" }));
        lotes.limpiar();
    };

    const quitarItem = (uid) => setItems((prev) => prev.filter((item) => item.uid !== uid));

    const handleSave = async () => {
        const registrada = await RegistrarTransferencia(
            { origen: inventarioActual, destino: destinoActual, observacion: form.observacion, items },
            token,
            userlogued
        );
        if (!registrada) return;

        handleClear();
        setItems([]);
        setErrores({});
        lotes.limpiar();
        cargarStock();
        buscarHistorial();
    };

    const handleLimpiar = () => {
        handleClear();
        setItems([]);
        setErrores({});
        lotes.limpiar();
    };

    const columnasDetalle = [
        { label: "Medicamento", accessor: "medicamento", width: "38%" },
        { label: "N° Lote", width: "18%", render: (row) => row.numeroLote || "—" },
        { label: "Vencimiento", width: "16%", render: (row) => formatearFechaCorta(row.fechaVencimiento) || "—" },
        { label: "Cantidad", accessor: "cantidad", width: "14%" },
        {
            label: "Acción",
            width: "14%",
            render: (row) => (
                <button
                    type="button"
                    onClick={() => quitarItem(row.uid)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-0.5 rounded transition-all duration-150 ease-out active:scale-95"
                >
                    Quitar
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-4 px-4 pb-4">
            <SectionFieldset legend="Datos de la Transferencia" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectorInventario
                    inventarios={inventarios}
                    inventarioId={inventarioId}
                    onChange={onChangeOrigen}
                    error={errorInventarios}
                    onRetry={cargarInventarios}
                    label="Origen"
                    name="origenId"
                />
                <SelectorInventario
                    inventarios={inventarios}
                    inventarioId={destinoId}
                    onChange={(e) => setDestinoId(e.target.value)}
                    excluirId={inventarioId}
                    label="Destino"
                    name="destinoId"
                />
                <div className="md:col-span-2">
                    <InputTextOneLine
                        label="Observación"
                        name="observacion"
                        labelWidth="110px"
                        value={form.observacion}
                        onChange={onChange}
                    />
                </div>
            </SectionFieldset>

            <SectionFieldset legend="Agregar Medicamento" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                    <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                    <BuscadorMedicamentoStock
                        id="medicamentoTransferencia"
                        filas={medicamentosConStock}
                        texto={form.medicamentoTexto}
                        onTextoChange={onTextoMedicamento}
                        onSelect={onSelectMedicamento}
                        placeholder={stock.cargando ? "Cargando stock del origen..." : "Escriba para buscar..."}
                        error={errores.medicamento}
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <AvisoError mensaje={lotes.error} onRetry={() => cargarLotes()} className="" />
                    <SelectField
                        label="Lote"
                        name="loteId"
                        value={form.loteId}
                        onChange={onChangeLote}
                        options={OpcionesLote(lotesDisponibles)}
                        placeholder={
                            !form.medicamentoId
                                ? "Primero elija el medicamento"
                                : lotes.cargando
                                    ? "Cargando lotes..."
                                    : lotesDisponibles.length === 0
                                        ? "El medicamento no tiene lotes disponibles"
                                        : "Seleccione el lote"
                        }
                        inline
                        labelWidth="110px"
                        disabled={!form.medicamentoId || lotesDisponibles.length === 0}
                        required
                        error={errores.loteId}
                    />
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
                <div className="flex items-start">
                    <button
                        type="button"
                        onClick={handleAgregar}
                        className="
                            bg-blue-600 hover:bg-blue-700
                            text-white text-base px-6 py-2 rounded
                            flex items-center gap-2
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Agregar
                    </button>
                </div>
            </SectionFieldset>

            <BotonesForm hideEdit hidePrint saveLabel="Registrar Transferencia" handleSave={handleSave} handleClear={handleLimpiar} />

            <SectionFieldset legend="Detalle de la Transferencia">
                <TablaTemplate columns={columnasDetalle} data={items} height={300} emptyText="Aún no se agregó ningún lote" />
                <p className="mt-2 text-right font-semibold">
                    {items.length} lote(s) · {totalUnidades} unidades
                </p>
            </SectionFieldset>

            <SectionFieldset legend="Transferencias Registradas">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={historialId}
                        onChange={(e) => setHistorialId(e.target.value)}
                        label="Inventario"
                        name="historialId"
                    />
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
                </div>

                <button
                    type="button"
                    onClick={buscarHistorial}
                    disabled={!historialId || historial.cargando}
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

                <p className="text-sm text-gray-500 mb-2">Haga clic en una transferencia para ver sus lotes.</p>

                <TablaTemplate
                    columns={columnasHistorial}
                    data={paginatedData}
                    height={450}
                    onRowClick={setTransferenciaDetalle}
                    emptyText={historial.cargando ? "Cargando transferencias..." : "No hay transferencias para los filtros elegidos"}
                />

                <PaginadorTabla paginacion={paginacion} total={historial.datos.length} etiqueta="transferencias" />
            </SectionFieldset>

            <ModalDetalleTransferencia
                isOpen={Boolean(transferenciaDetalle)}
                onRequestClose={() => setTransferenciaDetalle(null)}
                transferencia={transferenciaDetalle}
                token={token}
            />
        </div>
    );
}
