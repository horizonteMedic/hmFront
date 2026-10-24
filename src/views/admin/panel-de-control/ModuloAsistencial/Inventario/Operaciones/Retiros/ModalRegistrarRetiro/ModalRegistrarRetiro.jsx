import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../../components/reusableComponents/InputTextOneLine";
import { SelectField } from "../../../../../../../components/reusableComponents/InputSelect";
import { useForm } from "../../../../../../../hooks/useForm";
import AvisoError from "../../../Compartido/components/AvisoError";
import BuscadorMedicamentoStock from "../../../Compartido/components/BuscadorMedicamentoStock";
import { ObtenerLotesMedicamento, ObtenerStockResumen, OpcionesLote } from "../../../Stock/controllerStock";
import { useConsultaInventario } from "../../../Compartido/hooks/useConsultaInventario";
import { formatearMonto, precioDeLote, valorDeLote } from "../../../Compartido/precioReferencial";
import { MOTIVO_OTRO, RegistrarRetiro, ValidarRetiro } from "../controllerRetiros";

Modal.setAppElement("#root");

const initialFormState = { medicamentoTexto: "", medicamentoId: "", loteId: "", cantidad: "", motivo: "", observacion: "" };

// Ancho común de todas las etiquetas del formulario, para que las cajas empiecen en la misma columna.
const ANCHO_ETIQUETA = "110px";

export default function ModalRegistrarRetiro({ isOpen, onRequestClose, inventario, opcionesMotivo, token, usuario, onSuccess }) {
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);
    const [errores, setErrores] = useState({});
    const [registrando, setRegistrando] = useState(false);

    const stock = useConsultaInventario();
    const lotes = useConsultaInventario();

    // Se puede retirar lo que existe físicamente, aunque esté reservado o vencido: por eso cuenta el stock actual.
    const medicamentosConStock = useMemo(() => stock.datos.filter((fila) => fila.cantidadActual > 0), [stock.datos]);
    const lotesConStock = useMemo(() => lotes.datos.filter((l) => l.cantidadActual > 0), [lotes.datos]);
    const lote = lotesConStock.find((l) => String(l.id) === form.loteId) ?? null;
    // Valor de las unidades que se van a retirar; sale cuando la cantidad escrita ya es un número.
    const valorRetiro = lote && /^\d+$/.test(form.cantidad) ? valorDeLote(lote, Number(form.cantidad)) : null;

    const cargarStock = () => {
        if (inventario) stock.ejecutar(() => ObtenerStockResumen(inventario.id, token));
    };

    // Los lotes se piden con los vencidos incluidos: un lote vencido que aún no se retiró también se puede retirar a mano.
    const cargarLotes = (medicamentoId = form.medicamentoId) => {
        if (inventario && medicamentoId) lotes.ejecutar(() => ObtenerLotesMedicamento(inventario.id, medicamentoId, true, token));
    };

    // Cada vez que se abre el formulario empieza vacío y con el stock actual del inventario.
    useEffect(() => {
        if (!isOpen) return;
        handleClear();
        setErrores({});
        lotes.limpiar();
        cargarStock();
    }, [isOpen]);

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

    // Al elegir el medicamento se traen sus lotes para elegir de cuál retirar.
    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: etiqueta, medicamentoId: String(fila.medicamentoId), loteId: "" }));
        limpiarError("medicamento");
        cargarLotes(fila.medicamentoId);
    };

    const cerrar = () => {
        if (registrando) return;
        onRequestClose();
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const erroresForm = ValidarRetiro(form, lote);
        setErrores(erroresForm);
        if (Object.keys(erroresForm).length > 0) return;

        setRegistrando(true);
        const registrado = await RegistrarRetiro(form, lote, token, usuario);
        setRegistrando(false);
        if (!registrado) return;

        onSuccess();
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cerrar}
            shouldCloseOnOverlayClick={false}
            contentLabel="Registrar Retiro de Stock"
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <form onSubmit={handleSave} noValidate className="bg-white rounded-lg shadow-xl w-[95vw] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between bg-[#233245] text-white px-4 py-3">
                    <h2 className="font-bold text-lg">Registrar Retiro de Stock</h2>
                    <button type="button" onClick={cerrar} className="text-2xl leading-none" title="Cerrar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <InputTextOneLine
                        label="Inventario"
                        name="inventario"
                        labelWidth={ANCHO_ETIQUETA}
                        value={inventario?.nombre ?? ""}
                        disabled
                        inputClassName="font-bold"
                    />

                    <div className="space-y-2">
                        <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                        <BuscadorMedicamentoStock
                            id="medicamentoRetiro"
                            labelWidth={ANCHO_ETIQUETA}
                            required
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

                    <div className="space-y-2">
                        <AvisoError mensaje={lotes.error} onRetry={() => cargarLotes()} className="" />
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
                            labelWidth={ANCHO_ETIQUETA}
                            disabled={!form.medicamentoId || lotesConStock.length === 0}
                            required
                            error={errores.loteId}
                        />
                        {lote && (
                            <p className="text-sm text-gray-600">
                                Actual: <strong>{lote.cantidadActual}</strong> · Reservada: <strong>{lote.cantidadReservada}</strong> · Disponible:{" "}
                                <strong>{lote.cantidadDisponible}</strong>
                                {lote.vencido ? " · Lote vencido" : ""}
                                {precioDeLote(lote) == null ? (
                                    " · Sin precio referencial"
                                ) : (
                                    <>
                                        {" "}· Precio ref.: <strong>{formatearMonto(precioDeLote(lote))}</strong>
                                        {valorRetiro != null && <> · Valor a retirar: <strong>{formatearMonto(valorRetiro)}</strong></>}
                                    </>
                                )}
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
                    <SelectField
                        label="Motivo"
                        name="motivo"
                        value={form.motivo}
                        onChange={onChangeSelect}
                        options={opcionesMotivo}
                        inline
                        labelWidth={ANCHO_ETIQUETA}
                        required
                        error={errores.motivo}
                    />
                    <InputTextOneLine
                        label="Observación"
                        name="observacion"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.observacion}
                        onChange={onChange}
                        required={form.motivo === MOTIVO_OTRO}
                        error={errores.observacion}
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3">
                    <button
                        type="button"
                        onClick={cerrar}
                        disabled={registrando}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={registrando}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-150 ease-out hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={registrando ? faSpinner : faSave} spin={registrando} /> Registrar
                    </button>
                </div>
            </form>
        </Modal>
    );
}
