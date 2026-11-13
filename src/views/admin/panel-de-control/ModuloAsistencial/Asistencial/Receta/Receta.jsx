import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { InputTextOneLine, SectionFieldset } from "../../../../../components/reusableComponents/ResusableComponents";
import TablaTemplate from "../../../../../components/templates/TablaTemplate";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import AvisoError from "../../Inventario/Compartido/components/AvisoError";
import BuscadorMedicamentoStock from "../../Inventario/Compartido/components/BuscadorMedicamentoStock";
import SelectorInventario from "../../Inventario/Compartido/components/SelectorInventario";
import {
    RECETA_LINEA_VACIA,
    avisoSinDisponible,
    cantidadStock,
    crearItemReceta,
    detalleStockReceta,
    estadoDeReceta,
    estadoItemReceta,
    formNuevaReceta,
    numeroDeReceta,
    puedeAbrirNuevaReceta,
    recetaBloqueada,
    validarLineaReceta,
} from "./controllerReceta";
import RecetaGuardada from "./RecetaGuardada";
import { useMedicamentosReceta } from "./useMedicamentosReceta";

const ANCHO_ETIQUETA = "150px";

// Estado de cada línea de la tabla (ver estadoItemReceta): lo entregado por farmacia, lo registrado que falta entregar y
// lo que aún no se guarda con la Historia Clínica.
const ESTADOS_ITEM = {
    entregado: { texto: "ENTREGADO", clases: "bg-emerald-100 text-emerald-700" },
    pendiente: { texto: "FALTA ENTREGAR", clases: "bg-amber-100 text-amber-700" },
    porGuardar: { texto: "POR GUARDAR", clases: "bg-gray-100 text-gray-600" },
};

/**
 * Receta (reserva de medicamentos) de las Historias Clínicas del módulo (solo en tickets de La Arena).
 *
 * No tiene botón propio: se guarda con el Guardar de la Historia Clínica y solo RESERVA el stock; farmacia la entrega
 * desde Inventario > Entrega por Ticket. El estado vive en el formulario de la Historia (campos `receta*`, ver
 * RECETA_ESTADO_INICIAL): la sección lo modifica con `setForm`.
 *
 * Bloqueados (solo informativos): N° de ticket, Entregado, Usuario y Fecha y hora de creación. El Inventario es un
 * combo con el central por defecto (guarda la elección en `recetaInventarioId` y muestra el stock de ese inventario);
 * con la receta ya registrada pasa a ser el inventario que registró el backend, bloqueado. Una receta ya registrada
 * (pendiente o entregada) queda de solo lectura: se crea una sola vez; `disabled` la bloquea también (registro
 * existente sin "Habilitar edición").
 *
 * Un ticket puede tener varias recetas (una pendiente a la vez). Todas las ya guardadas se muestran completas, cada una
 * en su bloque (ver RecetaGuardada), y la PENDIENTE va primero y destacada para que se note que falta entregarla. Los
 * campos para armar una receta solo aparecen cuando se puede crear una: el ticket aún no tiene ninguna, o se pulsó
 * «Nueva receta» (disponible cuando no queda ninguna pendiente; `recetaNueva`: el guardado envía `nuevaReceta`).
 * `acciones` (opcional) son los botones o sellos de la barra del título (ver ComplementoDesplegable).
 */
export default function Receta({ form, setForm, token, usuario, disabled = false, acciones = null }) {
    const registrada = recetaBloqueada(form);
    // Los medicamentos solo se necesitan para armar una receta: con la actual ya registrada no se piden.
    const { cargando, error, inventarios, inventario, medicamentos, recargar } = useMedicamentosReceta(
        token,
        Boolean(form.pacienteId) && !registrada,
        form.recetaInventarioId
    );
    const [errores, setErrores] = useState({});

    const soloLectura = disabled || registrada;

    // El combo muestra el central mientras no se elija otro (o si el elegido ya no existe): se deja ese id en el
    // formulario para que el guardado envíe lo mismo que se ve. Se revisa también cuando el formulario se limpia
    // (queda "" aunque el combo siga mostrando el central).
    const idInventarioMostrado = inventario ? String(inventario.id) : "";
    const idInventarioForm = String(form.recetaInventarioId ?? "");
    useEffect(() => {
        if (soloLectura || !idInventarioMostrado || idInventarioForm === idInventarioMostrado) return;
        setForm((f) => ({ ...f, recetaInventarioId: idInventarioMostrado }));
    }, [soloLectura, idInventarioMostrado, idInventarioForm, setForm]);
    const items = form.recetaItems ?? [];
    const historial = form.recetaHistorial ?? [];
    // La pendiente (si hay) va destacada arriba; el resto de las recetas guardadas, debajo, de la más reciente a la más antigua.
    const pendiente = historial.find((receta) => estadoDeReceta(receta) === "pendiente") ?? null;
    const otras = historial.filter((receta) => receta !== pendiente);
    const bloque = (receta) => <RecetaGuardada key={receta.id} receta={receta} numero={numeroDeReceta(historial, receta)} />;
    const medicamento = medicamentos.find((m) => String(m.id) === form.recetaMedicamentoId) ?? null;
    // Sin el dato de stock (el backend no lo trajo) no se puede afirmar que supere lo disponible.
    const pideMasDeLoDisponible =
        medicamento &&
        medicamento.stockDisponible != null &&
        /^\d+$/.test(String(form.recetaCantidad ?? "")) &&
        Number(form.recetaCantidad) > Number(medicamento.stockDisponible);

    const limpiarError = (campo) => setErrores((anterior) => ({ ...anterior, [campo]: "" }));

    // El stock mostrado es el del inventario: al cambiarlo se descarta el medicamento elegido (hay que volver a elegirlo
    // para ver su saldo en el nuevo). Los ya agregados a la receta se conservan: el catálogo es el mismo.
    const onCambiarInventario = (e) => {
        const recetaInventarioId = e.target.value;
        if (!recetaInventarioId) return;
        setForm((f) => ({ ...f, recetaInventarioId, recetaMedicamentoTexto: "", recetaMedicamentoId: "" }));
        limpiarError("medicamento");
    };

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

    // Abre una receta nueva: lista y línea en blanco (lo entregado sigue a la vista en el historial).
    const handleNuevaReceta = () => {
        setErrores({});
        setForm((f) => ({ ...f, ...formNuevaReceta(f) }));
    };

    const quitarItem = (uid) => setForm((f) => ({ ...f, recetaItems: f.recetaItems.filter((item) => item.uid !== uid) }));

    const columnas = [
        { label: "Medicamento", width: "32%", render: (row) => row.medicamento },
        {
            label: "Cantidad",
            width: "12%",
            render: (row) => (
                <>
                    {row.cantidad}
                    {row.cantidadFaltante > 0 && <strong className="text-red-600"> (faltan {row.cantidadFaltante})</strong>}
                </>
            ),
        },
        { label: "Indicación", width: "26%", render: (row) => row.indicacion || "—" },
        {
            label: "Estado",
            width: "16%",
            render: (row) => {
                const { texto, clases } = ESTADOS_ITEM[estadoItemReceta(row)];
                return (
                    <>
                        <span className={`px-2 py-0.5 rounded text-sm font-semibold whitespace-nowrap ${clases}`}>{texto}</span>
                        {row.entregado && row.fechaEntrega && <span className="block text-xs text-gray-500">{formatearFechaHora(row.fechaEntrega)}</span>}
                    </>
                );
            },
        },
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
            {/* La receta pendiente va primero y destacada: es la que todavía falta entregar. */}
            {pendiente && bloque(pendiente)}

            {/* Armado de una receta: solo cuando se puede crear (el ticket no tiene ninguna, o se abrió una nueva). */}
            {!registrada && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                        <InputTextOneLine label="Entregado" name="recetaEntregado" value="NO" disabled labelWidth={ANCHO_ETIQUETA} />
                        <InputTextOneLine
                            label="Fecha y hora de creación"
                            name="recetaFechaRegistro"
                            value="Se asigna al guardar"
                            disabled
                            labelWidth={ANCHO_ETIQUETA}
                        />
                        {disabled ? (
                            <InputTextOneLine
                                label="Inventario"
                                name="recetaInventario"
                                value={form.recetaInventario || inventario?.nombre || ""}
                                disabled
                                labelWidth={ANCHO_ETIQUETA}
                                className="lg:col-span-2"
                            />
                        ) : (
                            <div className="lg:col-span-2">
                                <SelectorInventario
                                    inventarios={inventarios}
                                    inventarioId={idInventarioMostrado}
                                    onChange={onCambiarInventario}
                                    name="recetaInventarioId"
                                    labelWidth={ANCHO_ETIQUETA}
                                />
                            </div>
                        )}
                    </div>

                    {form.recetaEstado === "anulada" && (
                        <p className="p-2 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
                            La receta anterior de este ticket fue anulada{form.recetaMotivoAnulacion ? ` (motivo: ${form.recetaMotivoAnulacion})` : ""}: ya no
                            reserva medicamentos. Puede armar una nueva.
                        </p>
                    )}
                    {form.recetaNueva && (
                        <p className="p-2 rounded border border-blue-300 bg-blue-50 text-blue-800 text-sm">
                            Está armando una receta nueva para este ticket: las anteriores no cambian. Se registra al guardar la Historia Clínica.
                        </p>
                    )}

                    {!disabled && (
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
                                detalleCantidad={detalleStockReceta}
                                nextFocusId="recetaCantidad"
                                placeholder={cargando ? "Cargando medicamentos..." : "Escriba para buscar..."}
                                error={errores.medicamento}
                            />
                            {medicamento && (
                                <div className="text-sm text-gray-600">
                                    <p>
                                        Disponible: <strong>{cantidadStock(medicamento.stockDisponible)}</strong> · Stock físico: {cantidadStock(medicamento.stockActual)} ·
                                        Reservado por otras recetas: {cantidadStock(medicamento.stockReservado)}
                                    </p>
                                    {avisoSinDisponible(medicamento) && <p className="text-amber-700">{avisoSinDisponible(medicamento)}</p>}
                                </div>
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
                                    Supera el stock disponible ({medicamento.stockDisponible}): al guardar, el sistema rechaza la receta por stock insuficiente.
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
                        Se guarda junto con la Historia Clínica y solo reserva el medicamento; farmacia lo entrega después. Una vez guardada no se puede
                        modificar. Sin medicamentos, no se registra receta.
                    </p>
                </div>
            )}

            {/* Todas las recetas del ticket fueron entregadas: se puede abrir otra (p. ej. la de Odontología). */}
            {puedeAbrirNuevaReceta(form) && !disabled && (
                <div className="p-2 rounded border border-blue-300 bg-blue-50 text-blue-800 text-sm flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="flex-1">Las recetas de este ticket ya fueron entregadas. Si necesita indicar más medicamentos, abra una receta nueva.</p>
                    <button
                        type="button"
                        onClick={handleNuevaReceta}
                        className="
                            bg-blue-600 hover:bg-blue-700
                            text-white text-base px-4 py-1.5 rounded
                            flex items-center justify-center gap-2 whitespace-nowrap
                            transition-all duration-150 ease-out
                            hover:shadow-lg
                            active:scale-95 active:shadow-inner"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Nueva receta
                    </button>
                </div>
            )}

            {otras.map(bloque)}
        </SectionFieldset>
    );
}
