import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, escaparHtml, etiquetaMedicamento, hoyISO, limpiarTexto } from "../../Compartido/inventarioUtils";

// Las recetas viven fuera de /inventario: las crea la historia clínica y farmacia las entrega o las anula.
const recetasUrl = "/asistencial/recetas";

// Mensaje de error de validación del N° de ticket, o "" si se puede buscar.
export const ValidarNumeroTicket = (valor) => {
    const texto = String(valor ?? "").trim();
    if (!texto) return "Ingrese el N° de ticket";
    if (!/^\d+$/.test(texto) || Number(texto) < 1) return "El N° de ticket debe ser un número entero";
    return "";
};

// Receta del ticket. Que el ticket no tenga receta no es un fallo del servidor: se avisa con un mensaje claro,
// tanto si el backend responde 404 como si responde vacío.
export const ObtenerRecetaPorTicket = async (numeroTicket, token) => {
    const sinReceta = { ok: false, status: 404, mensaje: `No se encontró una receta para el ticket N° ${numeroTicket}.` };

    const res = await consultarInventario(`${recetasUrl}/ticket/${numeroTicket}`, token, "No se pudo consultar la receta del ticket.");
    if (!res.ok) return res.status === 404 ? sinReceta : res;
    return res.resultado ? res : sinReceta;
};

// Recetas reservadas que aún no se entregan en el inventario (la lista de trabajo de farmacia).
export const ObtenerRecetasPendientes = (inventarioId, token) =>
    consultarInventario(
        `${recetasUrl}/pendientes?${new URLSearchParams({ inventarioId })}`,
        token,
        "No se pudieron cargar las recetas pendientes."
    );

// Recetas pendientes del inventario con un lote reservado vencido (el backend las llama "con faltante": al vencer el
// lote, esa cantidad deja de estar disponible). Son las que no se pueden entregar completas.
export const ObtenerRecetasConFaltante = (inventarioId, token) =>
    consultarInventario(
        `${recetasUrl}/con-faltante?${new URLSearchParams({ inventarioId })}`,
        token,
        "No se pudieron cargar las recetas con lote vencido."
    );

// Una receta solo se entrega o se anula mientras siga pendiente.
export const PuedeEntregarse = (receta) => !receta.entregado && !receta.anulada;

export const LoteVencido = (lote) => Boolean(lote.fechaVencimiento) && String(lote.fechaVencimiento).slice(0, 10) < hoyISO();

// Un medicamento que aún no se entrega "tiene problema" si le falta cantidad o alguno de sus lotes ya venció. Los ya
// entregados no cuentan: tras una entrega parcial siguen en la receta, con los lotes que salieron.
export const DetalleConLoteVencido = (detalle) => !detalle.entregado && (detalle.lotes ?? []).some(LoteVencido);
export const DetalleConProblema = (detalle) => !detalle.entregado && (detalle.cantidadFaltante > 0 || DetalleConLoteVencido(detalle));

// Con lote vencido: lo dice la lista /con-faltante del backend (`idsConFaltante`, ids de receta) o la fecha de sus lotes.
export const TieneLoteVencido = (receta, idsConFaltante) =>
    PuedeEntregarse(receta) && (Boolean(idsConFaltante?.has(receta.id)) || (receta.detalles ?? []).some(DetalleConLoteVencido));

// Le falta stock (por lote vencido o porque no alcanzó al reservar): se puede entregar parcialmente o re-reservar.
export const TieneFaltante = (receta) =>
    PuedeEntregarse(receta) && (Boolean(receta.conFaltante) || (receta.detalles ?? []).some((detalle) => !detalle.entregado && detalle.cantidadFaltante > 0));

export const NombrePaciente = (receta) => [receta.pacienteApellidos, receta.pacienteNombres].filter(Boolean).join(" ");

export const EstadoReceta = (receta) => {
    if (receta.anulada) return { texto: "Anulada", clases: "bg-red-100 text-red-700" };
    if (receta.entregado) return { texto: "Entregada", clases: "bg-emerald-100 text-emerald-700" };
    if (receta.entregaParcial) return { texto: "Entregada parcialmente", clases: "bg-blue-100 text-blue-700" };
    return { texto: "Pendiente", clases: "bg-amber-100 text-amber-700" };
};

// Avisa por qué la receta ya no admite la acción. Devuelve true si estaba pendiente y se puede seguir.
const verificarPendiente = async (receta, accion) => {
    if (PuedeEntregarse(receta)) return true;

    const motivo = receta.anulada ? "está anulada" : "ya fue entregada";
    await Swal.fire("Aviso", `La receta ${motivo} y no se puede ${accion}.`, "info");
    return false;
};

// Envía la acción sobre la receta (entregar, re-reservar o anular) y devuelve "ok" o "error"; en ambos casos el que
// llama debe recargar la receta, porque otro usuario pudo haberla cambiado mientras estaba abierta. `mensajeExito`
// es un texto o una función que, con la receta que devuelve el backend, da { texto, icono }.
const ejecutarAccionReceta = async ({ url, titulo, mensajeError, mensajeExito }, token) => {
    LoadingDefault(titulo);
    const res = await enviarInventario(url, undefined, token, mensajeError);
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return "error";
    }

    const { texto, icono } = typeof mensajeExito === "function" ? mensajeExito(res.resultado) : { texto: mensajeExito, icono: "success" };
    await Swal.fire(icono === "success" ? "Éxito" : "Aviso", texto, icono);
    return "ok";
};

// POST sobre la receta del ticket: /ticket/{n}/entregar?parcial=...&usuario=... o /ticket/{n}/re-reservar?usuario=...
const urlAccionTicket = (receta, accion, parametros) => `${recetasUrl}/ticket/${receta.numeroTicket}/${accion}?${new URLSearchParams(parametros)}`;

// <ul> con los medicamentos, para el html de un Swal.
const listaMedicamentos = (detalles) =>
    `<ul style="text-align:left;margin:4px 0 8px 20px;list-style:disc">${detalles
        .map((detalle) => `<li>${escaparHtml(etiquetaMedicamento({ nombre: detalle.medicamentoNombre, presentacion: detalle.presentacion }))} (${detalle.cantidad})</li>`)
        .join("")}</ul>`;

// Entrega la receta: la reserva pasa a ser una salida real de stock y la receta queda entregada. Devuelve:
//   "ok"        se entregó,
//   "error"     el backend la rechazó (p. ej. otro usuario ya la entregó o no hay stock),
//   "cancelado" no se envió nada (la receta no se puede entregar o el usuario no confirmó).
export const EntregarReceta = async (receta, token, usuario) => {
    if (!(await verificarPendiente(receta, "entregar"))) return "cancelado";

    const paciente = NombrePaciente(receta) || "el paciente";
    const faltante = receta.conFaltante ? " Atención: la receta tiene medicamentos con faltante de stock." : "";
    const { isConfirmed } = await Swal.fire({
        title: "Entregar receta",
        text: `Se entregarán ${receta.detalles?.length ?? 0} medicamento(s) del ticket N° ${receta.numeroTicket} a ${paciente} y se descontarán del stock.${faltante} ¿Desea continuar?`,
        icon: receta.conFaltante ? "warning" : "question",
        showCancelButton: true,
        confirmButtonText: "Sí, entregar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return "cancelado";

    return ejecutarAccionReceta(
        {
            url: urlAccionTicket(receta, "entregar", { parcial: false, usuario: usuario ?? "" }),
            titulo: "Entregando Receta",
            mensajeError: "Ocurrió un error al entregar la receta.",
            mensajeExito: `Receta del ticket N° ${receta.numeroTicket} entregada correctamente.`,
        },
        token
    );
};

// Entrega parcial: sale solo lo que está disponible y los medicamentos con lote vencido o faltante quedan pendientes
// en la receta (luego se pueden re-reservar y entregar). Devuelve "ok", "error" o "cancelado", igual que EntregarReceta.
export const EntregarRecetaParcial = async (receta, token, usuario) => {
    if (!(await verificarPendiente(receta, "entregar"))) return "cancelado";

    const pendientes = (receta.detalles ?? []).filter((detalle) => !detalle.entregado);
    const conProblema = pendientes.filter(DetalleConProblema);
    const disponibles = pendientes.filter((detalle) => !DetalleConProblema(detalle));
    if (disponibles.length === 0) {
        await Swal.fire(
            "Aviso",
            "Ningún medicamento de la receta está disponible para entregar. Use «Re-reservar» para cambiar los lotes vencidos por stock vigente.",
            "info"
        );
        return "cancelado";
    }

    const paciente = escaparHtml(NombrePaciente(receta) || "el paciente");
    const { isConfirmed } = await Swal.fire({
        title: "Entrega parcial",
        icon: "question",
        html:
            `<p>Se entregarán solo los medicamentos disponibles del ticket N° ${receta.numeroTicket} a ${paciente} y se descontarán del stock.</p>` +
            `<p style="margin-top:8px"><strong>Se entregan (${disponibles.length}):</strong></p>${listaMedicamentos(disponibles)}` +
            (conProblema.length > 0
                ? `<p><strong>Quedan pendientes (${conProblema.length}):</strong></p>${listaMedicamentos(conProblema)}`
                : "<p>Los medicamentos con lote vencido o faltante que tenga la receta quedarán pendientes.</p>") +
            "<p style='margin-top:8px'>¿Desea continuar?</p>",
        showCancelButton: true,
        confirmButtonText: "Sí, entregar lo disponible",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return "cancelado";

    return ejecutarAccionReceta(
        {
            url: urlAccionTicket(receta, "entregar", { parcial: true, usuario: usuario ?? "" }),
            titulo: "Entregando Receta",
            mensajeError: "Ocurrió un error al entregar parcialmente la receta.",
            mensajeExito: (resultado) => {
                const quedan = (resultado?.detalles ?? []).filter((detalle) => !detalle.entregado).length;
                return {
                    texto:
                        quedan > 0
                            ? `Entrega parcial registrada. Quedan ${quedan} medicamento(s) pendientes en la receta: use «Re-reservar» para reservarles stock vigente.`
                            : `Receta del ticket N° ${receta.numeroTicket} entregada correctamente.`,
                    icono: "success",
                };
            },
        },
        token
    );
};

// Re-reserva: el backend suelta el lote vencido y reserva stock nuevo solo de lo que falta; lo que ya estaba bien
// reservado no se toca. Devuelve "ok", "error" o "cancelado", igual que EntregarReceta.
export const ReReservarReceta = async (receta, token, usuario) => {
    if (!(await verificarPendiente(receta, "re-reservar"))) return "cancelado";

    const { isConfirmed } = await Swal.fire({
        title: "Re-reservar receta",
        text: `Se soltarán los lotes vencidos reservados para el ticket N° ${receta.numeroTicket} y se reservará stock nuevo solo de lo que falta. ¿Desea continuar?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, re-reservar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return "cancelado";

    return ejecutarAccionReceta(
        {
            url: urlAccionTicket(receta, "re-reservar", { usuario: usuario ?? "" }),
            titulo: "Re-reservando Receta",
            mensajeError: "Ocurrió un error al re-reservar la receta.",
            // Si no hay stock vigente suficiente, la receta sigue con faltante: se avisa para no dar a entender que quedó lista.
            mensajeExito: (resultado) =>
                resultado?.conFaltante
                    ? { texto: "Se soltaron los lotes vencidos, pero no hay stock vigente suficiente: la receta sigue con faltante. Puede entregarla parcialmente.", icono: "warning" }
                    : { texto: `Receta del ticket N° ${receta.numeroTicket} re-reservada. Ya se puede entregar.`, icono: "success" },
        },
        token
    );
};

// Anula la receta pendiente y libera la reserva de sus medicamentos (el stock vuelve a quedar disponible). El
// motivo es obligatorio y queda registrado en la receta. Devuelve "ok", "error" o "cancelado", igual que EntregarReceta.
export const AnularReceta = async (receta, token, usuario) => {
    if (!(await verificarPendiente(receta, "anular"))) return "cancelado";

    const { isConfirmed, value } = await Swal.fire({
        title: "Anular receta",
        text: `Se anulará la receta del ticket N° ${receta.numeroTicket} y se liberará la reserva de sus medicamentos. Indique el motivo de la anulación.`,
        icon: "warning",
        input: "textarea",
        inputPlaceholder: "Motivo de la anulación",
        inputValidator: (motivo) => (limpiarTexto(motivo) ? undefined : "Debe indicar el motivo de la anulación"),
        showCancelButton: true,
        confirmButtonText: "Sí, anular",
        confirmButtonColor: "#dc2626",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return "cancelado";

    const query = new URLSearchParams({ motivo: limpiarTexto(value).toUpperCase(), usuario: usuario ?? "" });
    return ejecutarAccionReceta(
        {
            url: `${recetasUrl}/${receta.id}/anular?${query}`,
            titulo: "Anulando Receta",
            mensajeError: "Ocurrió un error al anular la receta.",
            mensajeExito: `Receta del ticket N° ${receta.numeroTicket} anulada. Se liberó la reserva de sus medicamentos.`,
        },
        token
    );
};
