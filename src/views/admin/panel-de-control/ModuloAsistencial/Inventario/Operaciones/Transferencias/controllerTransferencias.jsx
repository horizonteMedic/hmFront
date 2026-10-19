import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, etiquetaMedicamento, inventarioUrl, limpiarTexto } from "../../Compartido/inventarioUtils";

const transferenciasUrl = `${inventarioUrl}/transferencias`;

let contadorItems = 0;

// Transferencias en las que participa el inventario (como origen o destino, según devuelva el backend), en un
// rango de fechas opcional.
export const ObtenerTransferencias = ({ inventarioId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${transferenciasUrl}?${query}`, token, "No se pudo cargar el historial de transferencias.");
};

// Una transferencia con el detalle de sus lotes.
export const ObtenerTransferencia = (id, token) =>
    consultarInventario(`${transferenciasUrl}/${id}`, token, "No se pudo cargar el detalle de la transferencia.");

// { campo: mensaje } solo con lo que falta o es inválido. `lote` es el lote elegido del inventario de origen: lo que
// se transfiere sale de su cantidad disponible (lo reservado por recetas no se puede mover).
export const ValidarItemTransferencia = (form, lote, items) => {
    const errores = {};
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";
    else if (!form.loteId) errores.loteId = "Seleccione el lote";
    else if (lote && items.some((item) => item.loteId === lote.id)) errores.loteId = "Ese lote ya está en el detalle. Quítelo y agréguelo con la cantidad total";

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    } else if (lote && Number(cantidad) > lote.cantidadDisponible) {
        errores.cantidad = `El lote solo tiene ${lote.cantidadDisponible} unidades disponibles`;
    }

    return errores;
};

// Línea del detalle a partir del lote elegido. `uid` identifica la fila para poder quitarla.
export const CrearItemTransferencia = (form, lote) => ({
    uid: ++contadorItems,
    loteId: lote.id,
    medicamento: etiquetaMedicamento({ nombre: lote.medicamentoNombre, presentacion: lote.presentacion }),
    numeroLote: lote.numeroLote,
    fechaVencimiento: lote.fechaVencimiento,
    cantidad: Number(form.cantidad),
});

// Cambiar el origen invalida los lotes ya agregados (son del inventario anterior): se pide confirmar.
export const ConfirmarCambioOrigen = async (cantidadItems) => {
    const { isConfirmed } = await Swal.fire({
        title: "Cambiar inventario de origen",
        text: `Se quitarán los ${cantidadItems} lote(s) agregados al detalle, porque pertenecen al inventario anterior. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
    });
    return isConfirmed;
};

// Cerrar el formulario descarta lo que se haya agregado al detalle, así que antes se pide confirmar.
export const ConfirmarCerrarTransferencia = async (cantidadItems) => {
    const { isConfirmed } = await Swal.fire({
        title: "Cerrar sin registrar",
        text: `Hay ${cantidadItems} lote(s) en el detalle que no se han transferido. Si cierra, se descartarán. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar",
        cancelButtonText: "Seguir editando",
    });
    return isConfirmed;
};

// Envía la transferencia y devuelve true si quedó registrada, para que la pantalla limpie el formulario y recargue.
export const RegistrarTransferencia = async ({ origen, destino, observacion, items }, token, usuario) => {
    if (!origen || !destino) {
        await Swal.fire("Error", "Seleccione el inventario de origen y el de destino.", "error");
        return false;
    }
    if (String(origen.id) === String(destino.id)) {
        await Swal.fire("Error", "El inventario de destino debe ser distinto al de origen.", "error");
        return false;
    }
    if (items.length === 0) {
        await Swal.fire("Error", "Agregue al menos un lote al detalle de la transferencia.", "error");
        return false;
    }

    const unidades = items.reduce((total, item) => total + item.cantidad, 0);
    const { isConfirmed } = await Swal.fire({
        title: "Registrar transferencia",
        text: `Se transferirán ${items.length} lote(s), ${unidades} unidades en total, de "${origen.nombre}" a "${destino.nombre}". ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, transferir",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const body = {
        inventarioOrigenId: Number(origen.id),
        inventarioDestinoId: Number(destino.id),
        observacion: limpiarTexto(observacion) || null,
        items: items.map(({ loteId, cantidad }) => ({ loteId, cantidad })),
    };
    const url = `${transferenciasUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Transferencia");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar la transferencia.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", `Se transfirieron ${items.length} lote(s) de "${origen.nombre}" a "${destino.nombre}".`, "success");
    return true;
};
