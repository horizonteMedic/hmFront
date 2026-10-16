import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { enviarInventario, etiquetaMedicamento, hoyISO, inventarioUrl, limpiarTexto, normalizarTexto, parsearFechaVencimiento } from "../inventarioUtils";

const ingresoStockUrl = `${inventarioUrl}/stock/ingreso`;

let contadorItems = 0;

// Dos líneas son el mismo lote si coinciden medicamento, número de lote y vencimiento.
export const claveLote = (medicamentoId, numeroLote, fechaVencimiento) =>
    `${medicamentoId}|${normalizarTexto(numeroLote)}|${fechaVencimiento}`;

// { campo: mensaje } solo con lo que falta o es inválido; vacío si la línea se puede agregar al detalle.
export const ValidarItemIngreso = (form, items) => {
    const errores = {};
    const vencimiento = parsearFechaVencimiento(form.fechaVencimiento);
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";

    if (!form.fechaVencimiento) {
        errores.fechaVencimiento = "Ingrese la fecha de vencimiento";
    } else if (!vencimiento) {
        errores.fechaVencimiento = "La fecha de vencimiento no es válida";
    } else if (vencimiento < hoyISO()) {
        errores.fechaVencimiento = "El medicamento ya está vencido";
    }

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    }

    if (!errores.medicamento && !errores.fechaVencimiento) {
        const clave = claveLote(form.medicamentoId, form.numeroLote, vencimiento);
        if (items.some((item) => claveLote(item.medicamentoId, item.numeroLote, item.fechaVencimiento) === clave)) {
            errores.medicamento = "Ese lote ya está en el detalle. Quítelo y agréguelo con la cantidad total";
        }
    }

    return errores;
};

// Línea del detalle a partir del formulario ya validado. `uid` identifica la fila para poder quitarla.
export const CrearItemIngreso = (form, medicamento) => ({
    uid: ++contadorItems,
    medicamentoId: medicamento.id,
    nombre: medicamento.nombre,
    medicamento: etiquetaMedicamento(medicamento),
    numeroLote: limpiarTexto(form.numeroLote).toUpperCase(),
    fechaVencimiento: parsearFechaVencimiento(form.fechaVencimiento),
    cantidad: Number(form.cantidad),
});

const construirBody = (inventario, referencia, items) => ({
    inventarioId: Number(inventario.id),
    referencia: limpiarTexto(referencia),
    items: items.map(({ medicamentoId, nombre, numeroLote, fechaVencimiento, cantidad }) => ({
        medicamentoId,
        nombre,
        numeroLote: numeroLote || null,
        fechaVencimiento,
        cantidad,
    })),
});

// Envía el ingreso (el del detalle o el que sale del Excel) y devuelve true si quedó registrado.
export const RegistrarIngresoStock = async ({ inventario, referencia, items }, token, usuario) => {
    if (!inventario) {
        await Swal.fire("Error", "Seleccione el inventario donde se ingresará el stock.", "error");
        return false;
    }
    if (items.length === 0) {
        await Swal.fire("Error", "Agregue al menos un medicamento al ingreso.", "error");
        return false;
    }

    const unidades = items.reduce((total, item) => total + item.cantidad, 0);
    const { isConfirmed } = await Swal.fire({
        title: "Registrar ingreso de stock",
        text: `Se ingresarán ${items.length} lote(s), ${unidades} unidades en total, en "${inventario.nombre}". ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const url = `${ingresoStockUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Ingreso de Stock");
    const res = await enviarInventario(url, construirBody(inventario, referencia, items), token, "Ocurrió un error al registrar el ingreso de stock.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", `Se ingresaron ${items.length} lote(s) al inventario "${inventario.nombre}".`, "success");
    return true;
};
