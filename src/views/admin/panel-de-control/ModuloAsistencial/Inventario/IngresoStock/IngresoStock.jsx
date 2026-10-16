import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlus } from "@fortawesome/free-solid-svg-icons";
import AutocompleteInput from "../../../../../components/reusableComponents/AutocompletableInput";
import InputTextOneLine from "../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../hooks/useForm";
import { useSessionData } from "../../../../../hooks/useSessionData";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { etiquetaMedicamento } from "../inventarioUtils";
import { ObtenerListaMedicamentos } from "../Medicamentos/controllerMedicamentos";
import SelectorInventario from "../SelectorInventario";
import { useInventarios } from "../useInventarios";
import { CrearItemIngreso, RegistrarIngresoStock, ValidarItemIngreso } from "./controllerIngresoStock";
import ModalIngresoStockMasivo from "./ModalIngresoStockMasivo/ModalIngresoStockMasivo";

const initialFormState = {
    referencia: "",
    medicamentoTexto: "",
    medicamentoId: "",
    numeroLote: "",
    fechaVencimiento: "",
    cantidad: "",
};

// Campos de la línea que se está armando (la referencia es del ingreso completo y se conserva).
const lineaVacia = {
    medicamentoTexto: "",
    medicamentoId: "",
    numeroLote: "",
    fechaVencimiento: "",
    cantidad: "",
};

export default function IngresoStock() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);

    const [medicamentos, setMedicamentos] = useState([]);
    const [errorMedicamentos, setErrorMedicamentos] = useState("");
    const [items, setItems] = useState([]);
    const [errores, setErrores] = useState({});
    const [modalMasivo, setModalMasivo] = useState(false);

    const opcionesMedicamento = useMemo(
        () => medicamentos.map((medicamento) => ({ id: medicamento.id, etiqueta: etiquetaMedicamento(medicamento) })),
        [medicamentos]
    );

    const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0);

    const cargarMedicamentos = async () => {
        const res = await ObtenerListaMedicamentos(token, true);
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

    // Al corregir un campo se le quita el mensaje de error.
    const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

    const onChange = (e) => {
        handleChange(e);
        limpiarError(e.target.name);
    };

    // La fecha viene de un <input type="date"> y la cantidad es numérica: ninguna se pasa a mayúsculas.
    const onChangeFecha = (e) => {
        handleChangeSimple(e);
        limpiarError(e.target.name);
    };

    const onChangeCantidad = (e) => {
        handleChangeNumberDecimals(e, 0);
        limpiarError(e.target.name);
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

    const handleAgregar = () => {
        const erroresLinea = ValidarItemIngreso(form, items);
        setErrores(erroresLinea);
        if (Object.keys(erroresLinea).length > 0) return;

        const medicamento = medicamentos.find((m) => String(m.id) === form.medicamentoId);
        setItems((prev) => [...prev, CrearItemIngreso(form, medicamento)]);
        setForm((prev) => ({ ...prev, ...lineaVacia }));
    };

    const quitarItem = (uid) => setItems((prev) => prev.filter((item) => item.uid !== uid));

    const handleSave = async () => {
        const registrado = await RegistrarIngresoStock({ inventario: inventarioActual, referencia: form.referencia, items }, token, userlogued);
        if (!registrado) return;

        handleClear();
        setItems([]);
        setErrores({});
    };

    const handleLimpiar = () => {
        handleClear();
        setItems([]);
        setErrores({});
    };

    const columnas = [
        { label: "Medicamento", accessor: "medicamento", width: "38%" },
        { label: "N° Lote", width: "18%", render: (row) => row.numeroLote || "—" },
        { label: "Vencimiento", width: "16%", render: (row) => formatearFechaCorta(row.fechaVencimiento) },
        { label: "Cantidad", accessor: "cantidad", width: "12%" },
        {
            label: "Acción",
            width: "10%",
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
            <SectionFieldset legend="Datos del Ingreso" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectorInventario
                    inventarios={inventarios}
                    inventarioId={inventarioId}
                    onChange={(e) => setInventarioId(e.target.value)}
                    error={errorInventarios}
                    onRetry={cargarInventarios}
                />
                <InputTextOneLine
                    label="Referencia"
                    name="referencia"
                    labelWidth="110px"
                    value={form.referencia}
                    onChange={onChange}
                />
            </SectionFieldset>

            <SectionFieldset legend="Agregar Medicamento" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {errorMedicamentos && (
                    <div className="md:col-span-2 flex items-center justify-between gap-4 p-3 rounded border border-red-300 bg-red-50 text-red-700">
                        <span>{errorMedicamentos}</span>
                        <button
                            type="button"
                            onClick={cargarMedicamentos}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-all duration-150 ease-out active:scale-95"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
                <div className="md:col-span-2">
                    <AutocompleteInput
                        label="Medicamento"
                        id="medicamentoIngreso"
                        value={form.medicamentoTexto}
                        options={opcionesMedicamento}
                        searchKey="etiqueta"
                        nextFocusId="numeroLote"
                        onChange={onChangeMedicamento}
                        onSelect={onSelectMedicamento}
                    />
                    {errores.medicamento && <p className="mt-1 text-sm text-red-600">{errores.medicamento}</p>}
                </div>
                <InputTextOneLine
                    label="N° Lote"
                    name="numeroLote"
                    labelWidth="110px"
                    value={form.numeroLote}
                    onChange={onChange}
                />
                <InputTextOneLine
                    label="Vencimiento"
                    name="fechaVencimiento"
                    type="date"
                    labelWidth="110px"
                    value={form.fechaVencimiento}
                    onChange={onChangeFecha}
                    required
                    error={errores.fechaVencimiento}
                />
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

            <BotonesForm hideEdit hidePrint saveLabel="Registrar Ingreso" handleSave={handleSave} handleClear={handleLimpiar}>
                <button
                    type="button"
                    onClick={() => setModalMasivo(true)}
                    disabled={!inventarioActual || medicamentos.length === 0}
                    className="
                        bg-blue-600 hover:bg-blue-700
                        text-white text-base px-6 py-2 rounded
                        flex items-center gap-2
                        transition-all duration-150 ease-out
                        hover:shadow-lg
                        active:scale-95 active:shadow-inner
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faFileExcel} /> Ingreso Masivo
                </button>
            </BotonesForm>

            <SectionFieldset legend="Detalle del Ingreso">
                <TablaTemplate columns={columnas} data={items} height={300} emptyText="Aún no se agregó ningún medicamento" />
                <p className="mt-2 text-right font-semibold">
                    {items.length} lote(s) · {totalUnidades} unidades
                </p>
            </SectionFieldset>

            <ModalIngresoStockMasivo
                isOpen={modalMasivo}
                onRequestClose={() => setModalMasivo(false)}
                inventario={inventarioActual}
                referencia={form.referencia}
                medicamentos={medicamentos}
                token={token}
                usuario={userlogued}
                onSuccess={() => setForm((prev) => ({ ...prev, referencia: "" }))}
            />
        </div>
    );
}
