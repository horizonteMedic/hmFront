import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../components/reusableComponents/InputSelect";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../../hooks/useForm";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import AvisoError from "../../AvisoError";
import BuscadorMedicamentoStock from "../../BuscadorMedicamentoStock";
import SelectorInventario from "../../SelectorInventario";
import { ObtenerStockResumen } from "../../Stock/controllerStock";
import { useConsultaInventario } from "../../useConsultaInventario";
import { conOrden, ordenarPorColumna, useOrdenTabla } from "../../useOrdenTabla";
import {
    ConfirmarCambioInventarioEntrega,
    ConfirmarCerrarEntrega,
    CrearItemEntrega,
    OTRA_AREA,
    RegistrarEntregaArea,
    ValidarDatosEntrega,
    ValidarItemEntrega,
    opcionesArea,
} from "../controllerEntregasArea";

Modal.setAppElement("#root");

// Campos de la línea que se está armando (los datos generales de la entrega se conservan al agregar).
const lineaVacia = { medicamentoTexto: "", medicamentoId: "", cantidad: "" };

const initialFormState = { ...lineaVacia, motivo: "", personaEntrega: "", area: "", areaOtro: "" };

// Ancho común de todas las etiquetas del formulario. "Medicamento :" es la más larga y con 110px quedaba justa.
const ANCHO_ETIQUETA = "120px";

// Formulario de una entrega a un área: arriba se arma la línea (medicamento y cantidad) y abajo queda el detalle. La
// cantidad de una fila no se edita en la tabla: para cambiarla se quita la fila y se agrega de nuevo. El inventario es
// el que maneja la pantalla de entregas (`inventarioId` / `setInventarioId`), porque de él depende también el historial.
export default function ModalNuevaEntrega({
    isOpen,
    onRequestClose,
    inventarios,
    inventarioId,
    setInventarioId,
    inventarioActual,
    errorInventarios,
    cargarInventarios,
    token,
    usuario,
    onSuccess,
}) {
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [items, setItems] = useState([]);
    const [errores, setErrores] = useState({});
    const [registrando, setRegistrando] = useState(false);
    const stock = useConsultaInventario();
    const { orden, alternarOrden, quitarOrden } = useOrdenTabla();

    // Solo se puede entregar lo que tiene unidades disponibles (las reservadas por recetas no cuentan).
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadDisponible > 0), [stock.datos]);
    const medicamentoStock = stock.datos.find((fila) => String(fila.medicamentoId) === form.medicamentoId) ?? null;

    const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0);
    // Sin ningún medicamento agregado no hay nada que revisar ni registrar: el detalle y los botones quedan bloqueados.
    const hayItems = items.length > 0;

    const cargarStock = () => {
        if (inventarioId) stock.ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    // Cada vez que se abre el formulario empieza vacío.
    useEffect(() => {
        if (!isOpen) return;
        handleClear();
        setItems([]);
        setErrores({});
        quitarOrden();
    }, [isOpen]);

    // Al abrir y al cambiar de inventario el stock es otro, y el medicamento elegido ya no vale.
    useEffect(() => {
        if (!isOpen) return;
        setForm((prev) => ({ ...prev, ...lineaVacia }));
        cargarStock();
    }, [isOpen, inventarioId]);

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
    const onChangeSelect = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
        if (e.target.name === "area") limpiarError("areaOtro");
    };

    // Cambiar de inventario quita lo agregado al detalle (es del inventario anterior), así que antes se pide confirmar.
    const onChangeInventario = async (e) => {
        const nuevoInventario = e.target.value;
        if (nuevoInventario === inventarioId) return;
        if (hayItems && !(await ConfirmarCambioInventarioEntrega(items.length))) return;

        setItems([]);
        setErrores({});
        setInventarioId(nuevoInventario);
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

    const handleAgregar = () => {
        const erroresItem = ValidarItemEntrega(form, medicamentoStock, items);
        // Solo se tocan los errores de la línea: los de los datos generales de la entrega se conservan.
        setErrores((prev) => ({ ...prev, medicamento: "", cantidad: "", ...erroresItem }));
        if (Object.keys(erroresItem).length > 0) return;

        setItems((prev) => [...prev, CrearItemEntrega(form, medicamentoStock)]);
        setForm((prev) => ({ ...prev, ...lineaVacia }));
    };

    const quitarItem = (uid) => setItems((prev) => prev.filter((item) => item.uid !== uid));

    const cerrar = async () => {
        if (registrando) return;
        if (hayItems && !(await ConfirmarCerrarEntrega(items.length))) return;
        onRequestClose();
    };

    const handleSave = async () => {
        const erroresForm = ValidarDatosEntrega(form);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        setRegistrando(true);
        const registrada = await RegistrarEntregaArea({ inventario: inventarioActual, form, items }, token, usuario);
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
    };

    // Cada cabecera ordena por lo que muestra la columna.
    const columnasDetalle = conOrden([
        { id: "medicamento", label: "Medicamento", accessor: "medicamento", width: "56%" },
        { id: "cantidad", label: "Cantidad", accessor: "cantidad", width: "20%" },
        {
            id: "accion",
            label: "Acción",
            width: "24%",
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

    // Sin <form>: Enter en una caja de texto no debe registrar la entrega.
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Nueva Entrega"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-xl w-[95vw] max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Nueva Entrega a un Área</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="px-4 py-3 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4 items-start">
                        <div className="space-y-4 min-w-0">
                            <SectionFieldset legend="Agregar Medicamento" className="space-y-4">
                                <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                                <div className="space-y-2">
                                    <BuscadorMedicamentoStock
                                        id="medicamentoEntregaArea"
                                        labelWidth={ANCHO_ETIQUETA}
                                        required
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
                        </div>

                        <div className="space-y-4 min-w-0">
                            <SectionFieldset legend="Detalle de la Entrega" className="space-y-4">
                                <SelectorInventario
                                    inventarios={inventarios}
                                    inventarioId={inventarioId}
                                    onChange={onChangeInventario}
                                    error={errorInventarios}
                                    onRetry={cargarInventarios}
                                    labelWidth={ANCHO_ETIQUETA}
                                />
                                <InputTextOneLine
                                    label="Motivo"
                                    name="motivo"
                                    labelWidth={ANCHO_ETIQUETA}
                                    value={form.motivo}
                                    onChange={onChange}
                                    required
                                    error={errores.motivo}
                                />
                                <InputTextOneLine
                                    label="Persona"
                                    name="personaEntrega"
                                    labelWidth={ANCHO_ETIQUETA}
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
                                    labelWidth={ANCHO_ETIQUETA}
                                    required
                                    error={errores.area}
                                />
                                {form.area === OTRA_AREA && (
                                    <InputTextOneLine
                                        label="Especifique"
                                        name="areaOtro"
                                        labelWidth={ANCHO_ETIQUETA}
                                        value={form.areaOtro}
                                        onChange={onChange}
                                        required
                                        error={errores.areaOtro}
                                    />
                                )}
                                <div
                                    aria-disabled={!hayItems}
                                    className={`transition-opacity duration-150 ${hayItems ? "" : "opacity-50 pointer-events-none select-none"}`}
                                >
                                    <TablaTemplate
                                        columns={columnasDetalle}
                                        data={itemsOrdenados}
                                        height={260}
                                        sort={orden}
                                        onSort={alternarOrden}
                                        emptyText="Aún no se agregó ningún medicamento"
                                    />
                                    <p className="mt-2 text-right font-semibold">
                                        {items.length} medicamento(s) · {totalUnidades} unidades
                                    </p>
                                </div>
                            </SectionFieldset>
                        </div>
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
                        <FontAwesomeIcon icon={registrando ? faSpinner : faSave} spin={registrando} /> Registrar Entrega
                    </button>
                </div>
            </div>
        </Modal>
    );
}
