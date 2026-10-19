import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlus } from "@fortawesome/free-solid-svg-icons";
import InputTextOneLine from "../../../../../../components/reusableComponents/InputTextOneLine";
import SectionFieldset from "../../../../../../components/reusableComponents/SectionFieldset";
import BotonesForm from "../../../../../../components/templates/BotonesForm";
import TablaTemplate from "../../../../../../components/templates/TablaTemplate";
import { useForm } from "../../../../../../hooks/useForm";
import { useSessionData } from "../../../../../../hooks/useSessionData";
import { formatearFechaCorta } from "../../../../../../utils/formatDateUtils";
import AvisoError from "../../Compartido/components/AvisoError";
import BuscadorMedicamentoStock from "../../Compartido/components/BuscadorMedicamentoStock";
import InputCelda from "./InputCelda";
import { ObtenerListaMedicamentos } from "../../Catalogo/Medicamentos/controllerMedicamentos";
import SelectorInventario from "../../Compartido/components/SelectorInventario";
import { ObtenerStockResumen } from "../../Stock/controllerStock";
import { useConsultaInventario } from "../../Compartido/hooks/useConsultaInventario";
import { useInventarios } from "../../Compartido/hooks/useInventarios";
import { conOrden, useOrdenEstable, useOrdenTabla } from "../../Compartido/hooks/useOrdenTabla";
import {
    CrearItemIngreso,
    DetalleIngresoValido,
    NormalizarItemsIngreso,
    RegistrarIngresoStock,
    ValidarItemIngreso,
    ValidarItemsIngreso,
} from "./controllerIngresoStock";
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

// Ancho común de todas las etiquetas del formulario. "Medicamento :" es la más larga y con 110px quedaba justa.
const ANCHO_ETIQUETA = "120px";

export default function IngresoStock() {
    const { token, userlogued } = useSessionData();
    const { inventarios, inventarioId, setInventarioId, inventarioActual, errorInventarios, cargarInventarios } = useInventarios(token);
    const { form, setForm, handleChange, handleChangeSimple, handleChangeNumberDecimals, handleClear } = useForm(initialFormState);

    const [medicamentos, setMedicamentos] = useState([]);
    const [errorMedicamentos, setErrorMedicamentos] = useState("");
    const [items, setItems] = useState([]);
    const [errores, setErrores] = useState({});
    const [modalMasivo, setModalMasivo] = useState(false);

    const stock = useConsultaInventario();

    // Se puede ingresar stock de cualquier medicamento, tenga o no saldo en el inventario elegido: los que
    // aún no aparecen en el stock se muestran con 0 disponibles.
    const filasMedicamento = useMemo(() => {
        const stockPorMedicamento = new Map(stock.datos.map((fila) => [String(fila.medicamentoId), fila]));
        return medicamentos.map(
            (medicamento) =>
                stockPorMedicamento.get(String(medicamento.id)) ?? {
                    medicamentoId: medicamento.id,
                    nombre: medicamento.nombre,
                    presentacion: medicamento.presentacion,
                    cantidadDisponible: 0,
                    cantidadReservada: 0,
                    proximoVencimiento: null,
                }
        );
    }, [medicamentos, stock.datos]);
    const medicamentoStock = filasMedicamento.find((fila) => String(fila.medicamentoId) === form.medicamentoId) ?? null;

    // La cantidad de una fila se edita como texto, así que puede estar vacía mientras se corrige.
    const totalUnidades = items.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
    // Sin ningún medicamento agregado no hay nada que revisar ni registrar: el detalle y los botones quedan bloqueados.
    const hayItems = items.length > 0;

    // Lote, vencimiento y cantidad se editan en la tabla: cada cambio se revisa y lo inválido se marca en rojo.
    const erroresItems = useMemo(() => ValidarItemsIngreso(items), [items]);
    const filasConError = Object.keys(erroresItems).length;
    const { orden, alternarOrden } = useOrdenTabla();

    const cargarMedicamentos = async () => {
        const res = await ObtenerListaMedicamentos(token, true);
        if (!res.ok) {
            setErrorMedicamentos(res.mensaje);
            return;
        }
        setErrorMedicamentos("");
        setMedicamentos(res.resultado);
    };

    const cargarStock = () => {
        if (inventarioId) stock.ejecutar(() => ObtenerStockResumen(inventarioId, token));
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    // El disponible depende del inventario elegido: al cambiarlo se vuelve a consultar.
    useEffect(() => {
        cargarStock();
    }, [inventarioId]);

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

    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((prev) => ({ ...prev, medicamentoTexto: etiqueta, medicamentoId: String(fila.medicamentoId) }));
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

    const editarItem = (uid, cambios) => setItems((prev) => prev.map((item) => (item.uid === uid ? { ...item, ...cambios } : item)));

    const handleSave = async () => {
        if (!(await DetalleIngresoValido(items))) return;

        const registrado = await RegistrarIngresoStock(
            { inventario: inventarioActual, referencia: form.referencia, items: NormalizarItemsIngreso(items) },
            token,
            userlogued
        );
        if (!registrado) return;

        handleClear();
        setItems([]);
        setErrores({});
        cargarStock();
    };

    const handleLimpiar = () => {
        handleClear();
        setItems([]);
        setErrores({});
    };

    // El lote, el vencimiento y la cantidad se editan en la misma tabla. Cada cabecera ordena por lo que tenga la fila.
    const columnas = conOrden([
        { id: "medicamento", label: "Medicamento", accessor: "medicamento", width: "26%" },
        {
            id: "numeroLote",
            label: "N° Lote",
            width: "19%",
            valorOrden: (row) => row.numeroLote,
            render: (row) => (
                <InputCelda
                    value={row.numeroLote ?? ""}
                    onChange={(e) => editarItem(row.uid, { numeroLote: e.target.value.toUpperCase() })}
                    error={erroresItems[row.uid]?.numeroLote}
                    aria-label="N° Lote"
                />
            ),
        },
        {
            id: "fechaVencimiento",
            label: "Vencimiento",
            width: "23%",
            valorOrden: (row) => row.fechaVencimiento,
            render: (row) => (
                <InputCelda
                    type="date"
                    value={row.fechaVencimiento ?? ""}
                    onChange={(e) => editarItem(row.uid, { fechaVencimiento: e.target.value })}
                    error={erroresItems[row.uid]?.fechaVencimiento}
                    aria-label="Vencimiento"
                />
            ),
        },
        {
            id: "cantidad",
            label: "Cantidad",
            width: "14%",
            valorOrden: (row) => (row.cantidad === "" ? null : Number(row.cantidad)),
            render: (row) => (
                <InputCelda
                    inputMode="numeric"
                    value={row.cantidad}
                    onChange={(e) => editarItem(row.uid, { cantidad: e.target.value.replace(/\D/g, "") })}
                    error={erroresItems[row.uid]?.cantidad}
                    aria-label="Cantidad"
                />
            ),
        },
        {
            id: "accion",
            label: "Acción",
            width: "18%",
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

    const itemsOrdenados = useOrdenEstable(items, columnas, orden);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start px-4 pb-4">
            <div className="space-y-4 min-w-0">
                <SectionFieldset legend="Agregar Medicamento" className="space-y-4">
                    <AvisoError mensaje={errorMedicamentos} onRetry={cargarMedicamentos} className="" />
                    <AvisoError mensaje={stock.error} onRetry={cargarStock} className="" />
                    <div className="space-y-2">
                        <BuscadorMedicamentoStock
                            id="medicamentoIngreso"
                            labelWidth={ANCHO_ETIQUETA}
                            filas={filasMedicamento}
                            texto={form.medicamentoTexto}
                            onTextoChange={onChangeMedicamento}
                            onSelect={onSelectMedicamento}
                            nextFocusId="numeroLote"
                            placeholder={stock.cargando ? "Cargando stock..." : "Escriba para buscar..."}
                            error={errores.medicamento}
                        />
                        {medicamentoStock && !stock.cargando && (
                            <p className="text-sm text-gray-600">
                                Disponible: <strong>{medicamentoStock.cantidadDisponible}</strong>
                                {medicamentoStock.cantidadReservada > 0 ? ` (${medicamentoStock.cantidadReservada} reservadas por recetas)` : ""}
                                {medicamentoStock.proximoVencimiento ? ` · Próximo vencimiento: ${formatearFechaCorta(medicamentoStock.proximoVencimiento)}` : ""}
                            </p>
                        )}
                    </div>
                    <InputTextOneLine
                        label="N° Lote"
                        name="numeroLote"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.numeroLote}
                        onChange={onChange}
                    />
                    <InputTextOneLine
                        label="Vencimiento"
                        name="fechaVencimiento"
                        type="date"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.fechaVencimiento}
                        onChange={onChangeFecha}
                        required
                        error={errores.fechaVencimiento}
                    />
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
                <div className="flex justify-end">
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
                </div>

                <SectionFieldset legend="Detalle del Ingreso" className="space-y-4">
                    <SelectorInventario
                        inventarios={inventarios}
                        inventarioId={inventarioId}
                        onChange={(e) => setInventarioId(e.target.value)}
                        error={errorInventarios}
                        onRetry={cargarInventarios}
                        labelWidth={ANCHO_ETIQUETA}
                    />
                    <InputTextOneLine
                        label="Referencia"
                        name="referencia"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.referencia}
                        onChange={onChange}
                    />
                    <div
                        aria-disabled={!hayItems}
                        className={`transition-opacity duration-150 ${hayItems ? "" : "opacity-50 pointer-events-none select-none"}`}
                    >
                        <TablaTemplate
                            columns={columnas}
                            data={itemsOrdenados}
                            height={300}
                            sort={orden}
                            onSort={alternarOrden}
                            emptyText="Aún no se agregó ningún medicamento"
                        />
                        {filasConError > 0 && (
                            <p className="mt-2 text-sm text-red-600">
                                {filasConError} fila(s) con datos inválidos, marcadas en rojo. Pase el mouse sobre la caja para ver el motivo.
                            </p>
                        )}
                        <p className="mt-2 text-right font-semibold">
                            {items.length} lote(s) · {totalUnidades} unidades
                        </p>
                    </div>
                </SectionFieldset>

                <BotonesForm hideEdit hidePrint disabled={!hayItems} saveLabel="Registrar Ingreso" handleSave={handleSave} handleClear={handleLimpiar} />
            </div>

            <ModalIngresoStockMasivo
                isOpen={modalMasivo}
                onRequestClose={() => setModalMasivo(false)}
                inventario={inventarioActual}
                referencia={form.referencia}
                medicamentos={medicamentos}
                token={token}
                usuario={userlogued}
                onSuccess={() => {
                    setForm((prev) => ({ ...prev, referencia: "" }));
                    cargarStock();
                }}
            />
        </div>
    );
}
