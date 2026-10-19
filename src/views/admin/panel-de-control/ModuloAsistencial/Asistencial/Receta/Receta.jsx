import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import AvisoError from "../../Inventario/Compartido/components/AvisoError";
import BuscadorMedicamentoStock from "../../Inventario/Compartido/components/BuscadorMedicamentoStock";
import { RECETA_LINEA_VACIA, crearItemReceta, recetaBloqueada, validarLineaReceta } from "./controllerReceta";
import { useMedicamentosReceta } from "./useMedicamentosReceta";

const ANCHO_ETIQUETA = "150px";

/**
 * Receta (reserva de medicamentos) de las Historias Clínicas del módulo (solo en tickets de La Arena).
 *
 * No tiene botón propio: se guarda con el Guardar de la Historia Clínica y solo RESERVA el stock; farmacia la entrega
 * desde Inventario > Entrega por Ticket. El estado vive en el formulario de la Historia (campos `receta*`, ver
 * RECETA_ESTADO_INICIAL): la sección lo modifica con `setForm`.
 *
 * Bloqueados (solo informativos): N° de ticket, Entregado, Usuario, Fecha y hora de creación e Inventario. Una receta
 * ya entregada queda de solo lectura; `disabled` la bloquea también (registro existente sin "Habilitar edición").
 * `acciones` (opcional) son los botones o sellos de la barra del título (ver ComplementoDesplegable).
 */
export default function Receta({ form, setForm, token, usuario, disabled = false, acciones = null }) {
    const { cargando, error, inventario, medicamentos, recargar } = useMedicamentosReceta(token, form.ticketSede, Boolean(form.pacienteId));
    const [errores, setErrores] = useState({});

    const entregada = recetaBloqueada(form);
    const soloLectura = disabled || entregada;
    const items = form.recetaItems ?? [];
    const medicamento = medicamentos.find((m) => String(m.id) === form.recetaMedicamentoId) ?? null;
    const pideMasDeLoDisponible =
        medicamento && /^\d+$/.test(String(form.recetaCantidad ?? "")) && Number(form.recetaCantidad) > Number(medicamento.stockDisponible ?? 0);

    const limpiarError = (campo) => setErrores((anterior) => ({ ...anterior, [campo]: "" }));

    // Escribir en el buscador descarta el medicamento elegido: hay que volver a elegirlo de la lista.
    const onTextoMedicamento = (texto) => {
        setForm((f) => ({ ...f, recetaMedicamentoTexto: texto, recetaMedicamentoId: "" }));
        limpiarError("medicamento");
    };

    const onSelectMedicamento = (fila, etiqueta) => {
        setForm((f) => ({ ...f, recetaMedicamentoTexto: etiqueta, recetaMedicamentoId: String(fila.id) }));
        limpiarError("medicamento");
    };

    // Solo dígitos.
    const onChangeCantidad = (e) => {
        if (!/^\d*$/.test(e.target.value)) return;
        setForm((f) => ({ ...f, recetaCantidad: e.target.value }));
        limpiarError("cantidad");
    };

    // En mayúsculas como el resto del formulario, sin perder la posición del cursor.
    const onChangeIndicacion = (e) => {
        const { value, selectionStart, selectionEnd } = e.target;
        const input = e.target;
        setForm((f) => ({ ...f, recetaIndicacion: value.toUpperCase() }));
        requestAnimationFrame(() => input.setSelectionRange(selectionStart, selectionEnd));
    };

    const handleAgregar = () => {
        const erroresLinea = validarLineaReceta(form, medicamento, items);
        setErrores({ medicamento: "", cantidad: "", ...erroresLinea });
        if (Object.keys(erroresLinea).length > 0) return;

        setForm((f) => ({ ...f, recetaItems: [...(f.recetaItems ?? []), crearItemReceta(f, medicamento)], ...RECETA_LINEA_VACIA }));
    };

    const quitarItem = (uid) => setForm((f) => ({ ...f, recetaItems: f.recetaItems.filter((item) => item.uid !== uid) }));

    const columnas = [
        { label: "Medicamento", width: "38%", render: (row) => row.medicamento },
        {
            label: "Cantidad",
            width: "14%",
            render: (row) => (
                <>
                    {row.cantidad}
                    {row.cantidadFaltante > 0 && <strong className="text-red-600"> (faltan {row.cantidadFaltante})</strong>}
                </>
            ),
        },
        { label: "Indicación", width: "34%", render: (row) => row.indicacion || "—" },
        ...(soloLectura
            ? []
            : [
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
            ]),
    ];

    return (
        <SectionFieldset legend="Receta (Reserva de Medicamentos)" className="space-y-3" actions={acciones}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                <InputTextOneLine label="Entregado" name="recetaEntregado" value={entregada ? "SÍ" : "NO"} disabled labelWidth={ANCHO_ETIQUETA} />
                <InputTextOneLine
                    label="Fecha y hora de creación"
                    name="recetaFechaRegistro"
                    value={form.recetaFechaRegistro ? formatearFechaHora(form.recetaFechaRegistro) : "Se asigna al guardar"}
                    disabled
                    labelWidth={ANCHO_ETIQUETA}
                />
                <InputTextOneLine
                    label="Inventario"
                    name="recetaInventario"
                    value={form.recetaInventario || inventario?.nombre || ""}
                    disabled
                    labelWidth={ANCHO_ETIQUETA}
                    className="lg:col-span-2"
                />
            </div>

            {form.recetaEstado === "anulada" && (
                <p className="p-2 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
                    La receta anterior de este ticket fue anulada{form.recetaMotivoAnulacion ? ` (motivo: ${form.recetaMotivoAnulacion})` : ""}: ya no reserva
                    medicamentos. Puede armar una nueva.
                </p>
            )}
            {entregada && (
                <p className="p-2 rounded border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm">
                    La receta ya fue entregada por farmacia: no se puede modificar.
                </p>
            )}
            {form.recetaEstado === "pendiente" && form.recetaConFaltante && (
                <p className="p-2 rounded border border-amber-300 bg-amber-50 text-amber-800 text-sm">
                    La receta quedó con faltante de stock en algún medicamento (ver la tabla).
                </p>
            )}

            {!soloLectura && (
                <div className="space-y-3">
                    <AvisoError mensaje={error} onRetry={recargar} className="" />
                    {!form.pacienteId && <p className="text-sm italic text-gray-600">Busque un N° de ticket para cargar los medicamentos disponibles.</p>}

                    <BuscadorMedicamentoStock
                        id="medicamentoReceta"
                        labelWidth={ANCHO_ETIQUETA}
                        label="Medicamento"
                        filas={medicamentos}
                        texto={form.recetaMedicamentoTexto}
                        onTextoChange={onTextoMedicamento}
                        onSelect={onSelectMedicamento}
                        campoCantidad="stockDisponible"
                        nextFocusId="recetaCantidad"
                        placeholder={cargando ? "Cargando medicamentos..." : "Escriba para buscar..."}
                        error={errores.medicamento}
                    />
                    {medicamento && (
                        <p className="text-sm text-gray-600">
                            Disponible: <strong>{medicamento.stockDisponible ?? 0}</strong>
                            {medicamento.stockReservado > 0 ? ` (${medicamento.stockReservado} ya reservadas por otras recetas)` : ""}
                        </p>
                    )}

                    <InputTextOneLine
                        label="Cantidad"
                        name="recetaCantidad"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.recetaCantidad}
                        onChange={onChangeCantidad}
                        required
                        error={errores.cantidad}
                    />
                    {pideMasDeLoDisponible && (
                        <p className="text-sm text-amber-700">
                            Supera el stock disponible ({medicamento.stockDisponible ?? 0}): la receta quedará con faltante para este medicamento.
                        </p>
                    )}

                    <InputTextOneLine
                        label="Indicación"
                        name="recetaIndicacion"
                        labelWidth={ANCHO_ETIQUETA}
                        value={form.recetaIndicacion}
                        onChange={onChangeIndicacion}
                        onKeyUp={(e) => e.key === "Enter" && handleAgregar()}
                    />

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
            )}

            <TablaTemplate columns={columnas} data={items} height={180} emptyText="La receta no tiene medicamentos" />

            <p className="text-sm italic text-gray-600">
                Se guarda junto con la Historia Clínica y solo reserva el medicamento; farmacia lo entrega después. Sin medicamentos, no se registra receta.
            </p>
        </SectionFieldset>
    );
}
