import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../../../hooks/useForm";
import { formatearFechaCorta } from "../../../../../../../utils/formatDateUtils";
import AvisoError from "../../../Compartido/components/AvisoError";
import BuscadorMedicamentoStock from "../../../Compartido/components/BuscadorMedicamentoStock";
import SelectorInventario from "../../../Compartido/components/SelectorInventario";
import { ObtenerLotesMedicamento, ObtenerStockResumen, OpcionesLote } from "../../../Stock/controllerStock";
import { useConsultaInventario } from "../../../Compartido/hooks/useConsultaInventario";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../../../Compartido/hooks/useOrdenTabla";
import {
    ConfirmarCambioOrigen,
    ConfirmarCerrarTransferencia,
    CrearItemTransferencia,
    RegistrarTransferencia,
    ValidarItemTransferencia,
} from "../controllerTransferencias";

Modal.setAppElement("#root");

// Campos de la línea que se está armando (la observación es de toda la transferencia y se conserva al agregar).
const lineaVacia = { medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "" };

const initialFormState = { ...lineaVacia, observacion: "" };

// Ancho común de todas las etiquetas del formulario.
const ANCHO_ETIQUETA = "120px";

// Formulario de una transferencia entre inventarios: se eligen origen y destino, se arma el detalle lote por lote y se
// registra todo junto. El origen arranca en `origenInicialId` (el inventario que muestra el historial) y desde aquí se
// puede cambiar; el destino siempre es otro inventario.
export default function ModalNuevaTransferencia({
    isOpen,
    onRequestClose,
    inventarios,
    errorInventarios,
    cargarInventarios,
    origenInicialId,
    token,
    usuario,
    onSuccess,
}) {
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [origenId, setOrigenId] = useState("");
    const [destinoId, setDestinoId] = useState("");
    const [items, setItems] = useState([]);
    const [errores, setErrores] = useState({});
    const [registrando, setRegistrando] = useState(false);
    const stock = useConsultaInventario();
    const lotes = useConsultaInventario();
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    const origenActual = inventarios.find((inventario) => String(inventario.id) === origenId) ?? null;
    const destinoActual = inventarios.find((inventario) => String(inventario.id) === destinoId) ?? null;

    // Solo se transfiere lo disponible (lo reservado por recetas no se puede mover) y que no esté vencido.
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadDisponible > 0), [stock.datos]);
    const lotesDisponibles = useMemo(() => lotes.datos.filter((lote) => lote.cantidadDisponible > 0 && !lote.vencido), [lotes.datos]);
    const lote = lotesDisponibles.find((l) => String(l.id) === form.loteId) ?? null;

    const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0);
    // Sin ningún lote agregado no hay nada que revisar ni registrar: el detalle y el botón de registrar quedan bloqueados.
    const hayItems = items.length > 0;

    const cargarStock = () => {
        if (origenId) stock.ejecutar(() => ObtenerStockResumen(origenId, token));
    };

    const cargarLotes = (medicamentoId = form.medicamentoId) => {
        if (origenId && medicamentoId) lotes.ejecutar(() => ObtenerLotesMedicamento(origenId, medicamentoId, false, token));
    };

    // Cada vez que se abre el formulario empieza vacío, con el origen que traía la pantalla (o el primer inventario activo).
    useEffect(() => {
        if (!isOpen) return;
        handleClear();
        setItems([]);
        setErrores({});
        quitarOrden();
        lotes.limpiar();
        const primerActivo = inventarios.find((inventario) => inventario.activo !== false);
        setOrigenId(origenInicialId || String(primerActivo?.id ?? ""));
    }, [isOpen]);

    // El destino no puede ser el origen: se mantiene el elegido mientras siga siendo válido.
    useEffect(() => {
        const otros = inventarios.filter((inventario) => inventario.activo !== false && String(inventario.id) !== origenId);
        setDestinoId((actual) => (otros.some((inventario) => String(inventario.id) === actual) ? actual : String(otros[0]?.id ?? "")));
    }, [inventarios, origenId]);

    // Al abrir y al cambiar el origen el stock es otro y el medicamento y lote elegidos ya no valen.
    useEffect(() => {
        if (!isOpen) return;
        setForm((prev) => ({ ...prev, ...lineaVacia }));
        lotes.limpiar();
        cargarStock();
    }, [isOpen, origenId]);

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

    // Cambiar el origen quita lo agregado al detalle (son lotes del origen anterior), así que antes se pide confirmar.
    const onChangeOrigen = async (e) => {
        const nuevoOrigen = e.target.value;
        if (nuevoOrigen === origenId) return;
        if (hayItems && !(await ConfirmarCambioOrigen(items.length))) return;

        setItems([]);
        setErrores({});
        setOrigenId(nuevoOrigen);
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
        setForm((prev) => ({ ...prev, ...lineaVacia }));
        lotes.limpiar();
    };

    const quitarItem = (uid) => setItems((prev) => prev.filter((item) => item.uid !== uid));

    const cerrar = async () => {
        if (registrando) return;
        if (hayItems && !(await ConfirmarCerrarTransferencia(items.length))) return;
        onRequestClose();
    };

    const handleSave = async () => {
        setRegistrando(true);
        const registrada = await RegistrarTransferencia({ origen: origenActual, destino: destinoActual, observacion: form.observacion, items }, token, usuario);
        setRegistrando(false);
        if (!registrada) return;

        onSuccess();
        onRequestClose();
    };

    const handleLimpiar = () => {
        handleClear();
        setItems([]);
        setErrores({});
        quitarOrden();
        lotes.limpiar();
    };

    // Cada cabecera ordena por lo que muestra la columna.
    const columnasDetalle = conOrden([
        { id: "medicamento", label: "Medicamento", accessor: "medicamento", width: "38%" },
        { id: "numeroLote", label: "N° Lote", width: "18%", valorOrden: (row) => row.numeroLote, render: (row) => row.numeroLote || "—" },
        {
            id: "fechaVencimiento",
            label: "Vencimiento",
            width: "16%",
            valorOrden: (row) => row.fechaVencimiento,
            render: (row) => formatearFechaCorta(row.fechaVencimiento) || "—",
        },
        { id: "cantidad", label: "Cantidad", accessor: "cantidad", width: "14%" },
        {
            id: "accion",
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
    ]);

    const itemsOrdenados = ordenarPorColumna(items, columnasDetalle, orden);

    // Sin <form>: Enter en una caja de texto no debe registrar la transferencia.
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Nueva Transferencia"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Nueva Transferencia entre Inventarios</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="px-4 py-3 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4 items-start">
                        <SectionFieldset legend="Datos de la Transferencia" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectorInventario
                                inventarios={inventarios}
                                inventarioId={origenId}
                                onChange={onChangeOrigen}
                                error={errorInventarios}
                                onRetry={cargarInventarios}
                                label="Origen"
                                name="origenId"
                                labelWidth={ANCHO_ETIQUETA}
                            />
                            <SelectorInventario
                                inventarios={inventarios}
                                inventarioId={destinoId}
                                onChange={(e) => setDestinoId(e.target.value)}
                                excluirId={origenId}
                                label="Destino"
                                name="destinoId"
                                labelWidth={ANCHO_ETIQUETA}
                            />
                            <div className="md:col-span-2">
                                <InputTextOneLine
                                    label="Observación"
                                    name="observacion"
                                    labelWidth={ANCHO_ETIQUETA}
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
                                    labelWidth={ANCHO_ETIQUETA}
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
                                    labelWidth={ANCHO_ETIQUETA}
                                    disabled={!form.medicamentoId || lotesDisponibles.length === 0}
                                    required
                                    error={errores.loteId}
                                />
                            </div>

                            <InputTextOneLine
                                label="Cantidad"
                                name="cantidad"
                                labelWidth={ANCHO_ETIQUETA}
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

                        <SectionFieldset legend="Detalle de la Transferencia">
                            <div
                                aria-disabled={!hayItems}
                                className={`transition-opacity duration-150 ${hayItems ? "" : "opacity-50 pointer-events-none select-none"}`}
                            >
                                <TablaTemplate
                                    columns={columnasDetalle}
                                    data={itemsOrdenados}
                                    height={220}
                                    sort={orden}
                                    onSort={alternarOrden}
                                    emptyText="Aún no se agregó ningún lote"
                                />
                                <p className="mt-2 text-right font-semibold">
                                    {items.length} lote(s) · {totalUnidades} unidades
                                </p>
                            </div>
                        </SectionFieldset>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        disabled={registrando}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
                    >
                        Limpiar
                    </button>
                    <button
                        type="button"
                        onClick={cerrar}
                        disabled={registrando}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!hayItems || registrando}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={registrando ? faSpinner : faSave} spin={registrando} /> Registrar Transferencia
                    </button>
                </div>
            </div>
        </Modal>
    );
}
