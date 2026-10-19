import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, escaparHtml, etiquetaMedicamento, inventarioUrl, limpiarTexto, resumenLotes } from "../../Compartido/inventarioUtils";

const entregasAreaUrl = `${inventarioUrl}/entregas-area`;
const entregaMasivaUrl = `${entregasAreaUrl}/masivo`;

// Áreas del desplegable. "OTRO" abre un campo de texto para escribir una que no esté en la lista. El backend
// guarda el área como texto libre, así que la lista se puede ampliar aquí sin tocar nada más.
export const OTRA_AREA = "OTRO";
export const AREAS_ENTREGA = ["TOPICO", "TRIAJE", "LABORATORIO", "ODONTOLOGIA", "MEDICINA GENERAL"];
export const opcionesArea = [...AREAS_ENTREGA, OTRA_AREA].map((area) => ({ value: area, label: area }));

// Área que se guarda: la elegida, o el texto escrito cuando se eligió "OTRO".
const areaDelForm = (form) => (form.area === OTRA_AREA ? limpiarTexto(form.areaOtro) : form.area);

let contadorItems = 0;

// Entregas del inventario en un rango de fechas (las fechas son opcionales). Cada fila es un medicamento de una entrega;
// las filas de la misma entrega comparten `numeroEntrega`.
export const ObtenerEntregasArea = ({ inventarioId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${entregasAreaUrl}?${query}`, token, "No se pudo cargar el historial de entregas.");
};

// { campo: mensaje } solo con lo que falta o es inválido para agregar un medicamento al detalle. `stockMedicamento` es la
// fila del stock del medicamento elegido (para avisar antes de enviar si se pide más de lo disponible).
export const ValidarItemEntrega = (form, stockMedicamento, items) => {
    const errores = {};
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) {
        errores.medicamento = "Seleccione el medicamento de la lista";
    } else if (items.some((item) => String(item.medicamentoId) === String(form.medicamentoId))) {
        errores.medicamento = "Ese medicamento ya está en el detalle. Quítelo y agréguelo con la cantidad total";
    }

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    } else if (stockMedicamento && Number(cantidad) > stockMedicamento.cantidadDisponible) {
        errores.cantidad = `Solo hay ${stockMedicamento.cantidadDisponible} unidades disponibles`;
    }

    return errores;
};

// Línea del detalle a partir del medicamento elegido. `uid` identifica la fila para poder quitarla.
export const CrearItemEntrega = (form, stockMedicamento) => ({
    uid: ++contadorItems,
    medicamentoId: stockMedicamento.medicamentoId,
    nombre: stockMedicamento.nombre,
    medicamento: etiquetaMedicamento(stockMedicamento),
    cantidad: Number(form.cantidad),
});

// { campo: mensaje } con los datos que comparte toda la entrega (motivo, persona y área) que falten.
export const ValidarDatosEntrega = (form) => {
    const errores = {};

    if (!limpiarTexto(form.motivo)) errores.motivo = "Ingrese el motivo de la entrega";
    if (!limpiarTexto(form.personaEntrega)) errores.personaEntrega = "Ingrese la persona a quien se entrega";
    if (!form.area) errores.area = "Seleccione el área";
    else if (!areaDelForm(form)) errores.areaOtro = "Escriba el área";

    return errores;
};

// Cambiar de inventario invalida lo ya agregado (el stock y los lotes son los del inventario anterior).
export const ConfirmarCambioInventarioEntrega = async (cantidadItems) => {
    const { isConfirmed } = await Swal.fire({
        title: "Cambiar de inventario",
        text: `Se quitarán los ${cantidadItems} medicamento(s) agregados al detalle, porque corresponden al inventario anterior. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
    });
    return isConfirmed;
};

// Cerrar el formulario descarta lo que se haya agregado al detalle, así que antes se pide confirmar.
export const ConfirmarCerrarEntrega = async (cantidadItems) => {
    const { isConfirmed } = await Swal.fire({
        title: "Cerrar sin registrar",
        text: `Hay ${cantidadItems} medicamento(s) en el detalle que no se han entregado. Si cierra, se descartarán. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar",
        cancelButtonText: "Seguir editando",
    });
    return isConfirmed;
};

// Entrega todos los medicamentos del detalle en una sola entrega (POST /entregas-area/masivo). Es todo o nada: si a un
// medicamento le falta stock, el backend no entrega ninguno. El backend descuenta primero del lote que vence antes (FEFO)
// y la respuesta trae el número de la entrega y de qué lotes salió cada medicamento.
// Devuelve true si la entrega quedó registrada, para que la pantalla limpie el formulario y recargue.
export const RegistrarEntregaArea = async ({ inventario, form, items }, token, usuario) => {
    if (!inventario) {
        await Swal.fire("Error", "Seleccione el inventario desde el que se entregará.", "error");
        return false;
    }
    if (items.length === 0) {
        await Swal.fire("Error", "Agregue al menos un medicamento a la entrega.", "error");
        return false;
    }

    const area = areaDelForm(form);
    const persona = limpiarTexto(form.personaEntrega);
    const unidades = items.reduce((total, item) => total + item.cantidad, 0);

    // Una entrega descuenta stock y no se puede deshacer desde aquí: se confirma antes.
    const { isConfirmed } = await Swal.fire({
        title: "Registrar entrega",
        text: `Se entregarán ${items.length} medicamento(s), ${unidades} unidades en total, a ${persona} (${area}). ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, entregar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const body = {
        inventarioId: Number(inventario.id),
        motivo: limpiarTexto(form.motivo),
        personaEntrega: persona,
        area,
        items: items.map(({ medicamentoId, nombre, cantidad }) => ({ medicamentoId, nombre, cantidad })),
    };
    const url = `${entregaMasivaUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Entrega");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar la entrega.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", `${res.mensaje} No se entregó ningún medicamento.`, "error");
        return false;
    }

    const numero = res.resultado?.numeroEntrega;
    const detalle = (res.resultado?.entregas ?? [])
        .map((entrega) => {
            const nombre = etiquetaMedicamento({ nombre: entrega.medicamentoNombre, presentacion: entrega.presentacion });
            return `• ${escaparHtml(nombre)}: ${escaparHtml(resumenLotes(entrega.lotes) || `${entrega.cantidad} unidades`)}`;
        })
        .join("<br>");
    await Swal.fire({
        title: "Éxito",
        html: `Entrega${numero ? ` N° ${escaparHtml(numero)}` : ""} registrada correctamente.${
            detalle ? `<br><br><div style="text-align:left">Se descontó, primero lo que vence antes:<br>${detalle}</div>` : ""
        }`,
        icon: "success",
    });
    return true;
};
