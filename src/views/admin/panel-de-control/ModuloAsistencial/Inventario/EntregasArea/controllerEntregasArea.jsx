import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { formatearFechaCorta } from "../../../../../utils/formatDateUtils";
import { consultarInventario, enviarInventario, escaparHtml, inventarioUrl, limpiarTexto } from "../inventarioUtils";

const entregasAreaUrl = `${inventarioUrl}/entregas-area`;

// Áreas del desplegable. "OTRO" abre un campo de texto para escribir una que no esté en la lista. El backend
// guarda el área como texto libre, así que la lista se puede ampliar aquí sin tocar nada más.
export const OTRA_AREA = "OTRO";
export const AREAS_ENTREGA = ["TOPICO", "TRIAJE", "LABORATORIO", "ODONTOLOGIA", "MEDICINA GENERAL"];
export const opcionesArea = [...AREAS_ENTREGA, OTRA_AREA].map((area) => ({ value: area, label: area }));

// Área que se guarda: la elegida, o el texto escrito cuando se eligió "OTRO".
const areaDelForm = (form) => (form.area === OTRA_AREA ? limpiarTexto(form.areaOtro) : form.area);

// { campo: mensaje } solo con lo que falta o es inválido. `stockMedicamento` es la fila del stock del medicamento
// elegido (para avisar antes de enviar si se pide más de lo disponible).
export const ValidarEntregaArea = (form, stockMedicamento) => {
    const errores = {};
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    } else if (stockMedicamento && Number(cantidad) > stockMedicamento.cantidadDisponible) {
        errores.cantidad = `Solo hay ${stockMedicamento.cantidadDisponible} unidades disponibles`;
    }

    if (!limpiarTexto(form.motivo)) errores.motivo = "Ingrese el motivo de la entrega";
    if (!limpiarTexto(form.personaEntrega)) errores.personaEntrega = "Ingrese la persona a quien se entrega";
    if (!form.area) errores.area = "Seleccione el área";
    else if (!areaDelForm(form)) errores.areaOtro = "Escriba el área";

    return errores;
};

// Entregas del inventario en un rango de fechas (las fechas son opcionales).
export const ObtenerEntregasArea = ({ inventarioId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${entregasAreaUrl}?${query}`, token, "No se pudo cargar el historial de entregas.");
};

// El backend descuenta primero del lote que vence antes (FEFO); la respuesta trae de qué lotes salió.
// Devuelve true si la entrega quedó registrada, para que la pantalla limpie el formulario y recargue.
export const RegistrarEntregaArea = async (form, inventario, token, usuario) => {
    const area = areaDelForm(form);
    const body = {
        inventarioId: Number(inventario.id),
        medicamentoId: Number(form.medicamentoId),
        cantidad: Number(form.cantidad),
        motivo: limpiarTexto(form.motivo),
        personaEntrega: limpiarTexto(form.personaEntrega),
        area,
    };

    // Una entrega descuenta stock y no se puede deshacer desde aquí: se confirma antes.
    const { isConfirmed } = await Swal.fire({
        title: "Registrar entrega",
        text: `Se entregarán ${body.cantidad} unidades de "${form.medicamentoTexto}" a ${body.personaEntrega} (${area}). ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, entregar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    const url = `${entregasAreaUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;

    LoadingDefault("Registrando Entrega");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar la entrega.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    const lotes = (res.resultado?.lotes ?? [])
        .map((lote) => `• ${lote.cantidad} de ${escaparHtml(lote.numeroLote || "sin lote")} (vence ${formatearFechaCorta(lote.fechaVencimiento) || "—"})`)
        .join("<br>");
    await Swal.fire({
        title: "Éxito",
        html: `Entrega registrada correctamente.${lotes ? `<br><br><div style="text-align:left">Se descontó, primero lo que vence antes:<br>${lotes}</div>` : ""}`,
        icon: "success",
    });
    return true;
};
