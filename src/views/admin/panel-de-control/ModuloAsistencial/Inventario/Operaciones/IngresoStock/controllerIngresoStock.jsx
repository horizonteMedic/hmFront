import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { enviarInventario, etiquetaMedicamento, hoyISO, inventarioUrl, limpiarTexto, normalizarTexto, parsearFechaVencimiento } from "../../Compartido/inventarioUtils";
import { errorPrecio, formatearMonto, parsearPrecio, sumarValores } from "../../Compartido/precioReferencial";

const ingresoStockUrl = `${inventarioUrl}/stock/ingreso`;

let contadorItems = 0;

// Dos líneas son el mismo lote si coinciden medicamento, número de lote y vencimiento.
export const claveLote = (medicamentoId, numeroLote, fechaVencimiento) =>
    `${medicamentoId}|${normalizarTexto(numeroLote)}|${fechaVencimiento}`;

// Mensaje del problema de una fecha de vencimiento, o "" si es válida.
const errorFechaVencimiento = (valor) => {
    const vencimiento = parsearFechaVencimiento(valor);
    if (!valor) return "Ingrese la fecha de vencimiento";
    if (!vencimiento) return "La fecha de vencimiento no es válida";
    if (vencimiento < hoyISO()) return "El medicamento ya está vencido";
    return "";
};

// Mensaje del problema de una cantidad, o "" si es un entero de 1 o más.
const errorCantidad = (valor) => {
    const cantidad = String(valor ?? "").trim();
    if (!cantidad) return "Ingrese la cantidad";
    if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) return "Ingrese un número entero (1 o más)";
    return "";
};

// { campo: mensaje } solo con lo que falta o es inválido; vacío si la línea se puede agregar al detalle.
export const ValidarItemIngreso = (form, items) => {
    const errores = {};
    const vencimiento = parsearFechaVencimiento(form.fechaVencimiento);

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";

    const errorVencimiento = errorFechaVencimiento(form.fechaVencimiento);
    if (errorVencimiento) errores.fechaVencimiento = errorVencimiento;

    const errorDeCantidad = errorCantidad(form.cantidad);
    if (errorDeCantidad) errores.cantidad = errorDeCantidad;

    const errorDePrecio = errorPrecio(form.precioReferencial);
    if (errorDePrecio) errores.precioReferencial = errorDePrecio;

    if (!errores.medicamento && !errores.fechaVencimiento) {
        const clave = claveLote(form.medicamentoId, form.numeroLote, vencimiento);
        if (items.some((item) => claveLote(item.medicamentoId, item.numeroLote, parsearFechaVencimiento(item.fechaVencimiento)) === clave)) {
            errores.medicamento = "Ese lote ya está en el detalle. Quítelo y agréguelo con la cantidad total";
        }
    }

    return errores;
};

// Como el lote, el vencimiento y la cantidad se editan en la propia tabla del detalle, se revisan todas las filas:
// { [uid]: { numeroLote?, fechaVencimiento?, cantidad? } } solo con las que tienen algún problema. Dos filas con el
// mismo medicamento, lote y vencimiento se marcan las dos en el lote.
export const ValidarItemsIngreso = (items) => {
    const errores = {};
    const marcar = (uid, campo, mensaje) => {
        errores[uid] = { ...errores[uid], [campo]: mensaje };
    };
    const primeraFilaDeLote = new Map();

    items.forEach((item) => {
        const errorVencimiento = errorFechaVencimiento(item.fechaVencimiento);
        if (errorVencimiento) marcar(item.uid, "fechaVencimiento", errorVencimiento);

        const errorDeCantidad = errorCantidad(item.cantidad);
        if (errorDeCantidad) marcar(item.uid, "cantidad", errorDeCantidad);

        const errorDePrecio = errorPrecio(item.precioReferencial);
        if (errorDePrecio) marcar(item.uid, "precioReferencial", errorDePrecio);

        const vencimiento = parsearFechaVencimiento(item.fechaVencimiento);
        if (!vencimiento) return;

        const mensajeRepetido = "Ya hay otra fila con el mismo medicamento, lote y vencimiento";
        const clave = claveLote(item.medicamentoId, item.numeroLote, vencimiento);
        if (primeraFilaDeLote.has(clave)) {
            marcar(primeraFilaDeLote.get(clave), "numeroLote", mensajeRepetido);
            marcar(item.uid, "numeroLote", mensajeRepetido);
        } else {
            primeraFilaDeLote.set(clave, item.uid);
        }
    });

    return errores;
};

// Deja las filas del detalle como las espera el backend: lote en mayúsculas y sin espacios sobrantes, vencimiento
// "yyyy-MM-dd" y cantidad y precio numéricos (en la tabla se editan como texto).
export const NormalizarItemsIngreso = (items) =>
    items.map((item) => ({
        ...item,
        numeroLote: limpiarTexto(item.numeroLote).toUpperCase(),
        fechaVencimiento: parsearFechaVencimiento(item.fechaVencimiento),
        cantidad: Number(item.cantidad),
        precioReferencial: parsearPrecio(item.precioReferencial),
    }));

// Valor referencial de lo que se va a ingresar: suma de cantidad × precio de cada fila. Las filas sin un precio o una
// cantidad válidos no suman y se cuentan en `sinPrecio`.
export const ValorDelIngreso = (items) =>
    sumarValores(
        items.map((item) => {
            const precio = parsearPrecio(item.precioReferencial);
            const cantidad = Number(item.cantidad);
            return precio == null || !Number.isFinite(cantidad) ? null : precio * cantidad;
        })
    );

// Avisa si alguna fila del detalle tiene datos inválidos (están marcados en rojo en la tabla). Devuelve true si todo está bien.
export const DetalleIngresoValido = async (items) => {
    if (Object.keys(ValidarItemsIngreso(items)).length === 0) return true;
    await Swal.fire("Error", "Corrija los datos marcados en rojo en el detalle antes de registrar el ingreso.", "error");
    return false;
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
    precioReferencial: limpiarTexto(form.precioReferencial),
});

const construirBody = (inventario, referencia, items) => ({
    inventarioId: Number(inventario.id),
    referencia: limpiarTexto(referencia),
    items: items.map(({ medicamentoId, nombre, numeroLote, fechaVencimiento, cantidad, precioReferencial }) => ({
        medicamentoId,
        nombre,
        numeroLote: numeroLote || null,
        fechaVencimiento,
        cantidad,
        precioReferencial,
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
    const valor = ValorDelIngreso(items).total;
    const { isConfirmed } = await Swal.fire({
        title: "Registrar ingreso de stock",
        text: `Se ingresarán ${items.length} lote(s), ${unidades} unidades en total (valor referencial ${formatearMonto(valor)}), en "${inventario.nombre}". ¿Desea continuar?`,
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
