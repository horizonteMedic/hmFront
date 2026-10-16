import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, limpiarTexto } from "../inventarioUtils";

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

// Una receta solo se entrega o se anula mientras siga pendiente.
export const PuedeEntregarse = (receta) => !receta.entregado && !receta.anulada;

export const NombrePaciente = (receta) => [receta.pacienteApellidos, receta.pacienteNombres].filter(Boolean).join(" ");

export const EstadoReceta = (receta) => {
    if (receta.anulada) return { texto: "Anulada", clases: "bg-red-100 text-red-700" };
    if (receta.entregado) return { texto: "Entregada", clases: "bg-emerald-100 text-emerald-700" };
    return { texto: "Pendiente", clases: "bg-amber-100 text-amber-700" };
};

// Avisa por qué la receta ya no admite la acción. Devuelve true si estaba pendiente y se puede seguir.
const verificarPendiente = async (receta, accion) => {
    if (PuedeEntregarse(receta)) return true;

    const motivo = receta.anulada ? "está anulada" : "ya fue entregada";
    await Swal.fire("Aviso", `La receta ${motivo} y no se puede ${accion}.`, "info");
    return false;
};

// Envía la acción sobre la receta (entregar o anular) y devuelve "ok" o "error"; en ambos casos el que llama
// debe recargar la receta, porque otro usuario pudo haberla cambiado mientras estaba abierta.
const ejecutarAccionReceta = async ({ url, titulo, mensajeError, mensajeExito }, token) => {
    LoadingDefault(titulo);
    const res = await enviarInventario(url, undefined, token, mensajeError);
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return "error";
    }

    await Swal.fire("Éxito", mensajeExito, "success");
    return "ok";
};

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
            url: `${recetasUrl}/ticket/${receta.numeroTicket}/entregar?${new URLSearchParams({ usuario: usuario ?? "" })}`,
            titulo: "Entregando Receta",
            mensajeError: "Ocurrió un error al entregar la receta.",
            mensajeExito: `Receta del ticket N° ${receta.numeroTicket} entregada correctamente.`,
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
