import Swal from "sweetalert2";
import { LoadingDefault } from "../../../../../../utils/functionUtils";
import { consultarInventario, enviarInventario, inventarioUrl, limpiarTexto } from "../../Compartido/inventarioUtils";

const retirosUrl = `${inventarioUrl}/retiros`;
const lotesUrl = `${inventarioUrl}/stock/lotes`;

// Con este motivo el backend exige explicar qué pasó en la observación.
export const MOTIVO_OTRO = "OTRO";

// Motivos de retiro que define el backend (vencimiento, pérdida, otro...).
export const ObtenerMotivosRetiro = (token) =>
    consultarInventario(`${retirosUrl}/motivos`, token, "No se pudieron cargar los motivos de retiro.");

// Retiros del inventario en un rango de fechas (las fechas son opcionales).
export const ObtenerRetiros = ({ inventarioId, desde, hasta }, token) => {
    const query = new URLSearchParams({ inventarioId });
    if (desde) query.set("desde", desde);
    if (hasta) query.set("hasta", hasta);

    return consultarInventario(`${retirosUrl}?${query}`, token, "No se pudo cargar el historial de retiros.");
};

// Lotes vencidos del inventario que todavía tienen unidades, del que venció primero al último. El backend no tiene un
// endpoint para listarlos solos: se piden todos los lotes con los vencidos incluidos (sin filtrar por medicamento) y
// aquí se quedan los vencidos.
export const ObtenerLotesVencidos = async (inventarioId, token) => {
    const query = new URLSearchParams({ inventarioId, incluirVencidos: true });
    const res = await consultarInventario(`${lotesUrl}?${query}`, token, "No se pudieron cargar los lotes vencidos.");
    if (!res.ok) return res;

    const vencidos = (Array.isArray(res.resultado) ? res.resultado : [])
        .filter((lote) => lote.vencido && lote.cantidadActual > 0)
        .sort(
            (a, b) =>
                String(a.fechaVencimiento ?? "").localeCompare(String(b.fechaVencimiento ?? "")) ||
                String(a.medicamentoNombre ?? "").localeCompare(String(b.medicamentoNombre ?? ""), "es")
        );
    return { ...res, resultado: vencidos };
};

// { campo: mensaje } solo con lo que falta o es inválido. `lote` es el lote elegido (para avisar antes de
// enviar si se pide más de lo que tiene).
export const ValidarRetiro = (form, lote) => {
    const errores = {};
    const cantidad = String(form.cantidad ?? "").trim();

    if (!form.medicamentoId) errores.medicamento = "Seleccione el medicamento de la lista";
    else if (!form.loteId) errores.loteId = "Seleccione el lote";

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    } else if (lote && Number(cantidad) > lote.cantidadActual) {
        errores.cantidad = `El lote solo tiene ${lote.cantidadActual} unidades`;
    }

    if (!form.motivo) errores.motivo = "Seleccione el motivo del retiro";
    else if (form.motivo === MOTIVO_OTRO && !limpiarTexto(form.observacion)) {
        errores.observacion = "Explique el motivo en la observación";
    }

    return errores;
};

// Envía un retiro de un lote, sin confirmaciones ni mensajes, y devuelve { ok, resultado, mensaje, status }. Lo usa el
// retiro de vencidos, que retira varios lotes seguidos y informa el resultado al final.
export const EnviarRetiroLote = ({ loteId, cantidad, motivo, observacion }, token, usuario) => {
    const url = `${retirosUrl}?usuario=${encodeURIComponent(usuario ?? "")}`;
    const body = { loteId: Number(loteId), cantidad: Number(cantidad), motivo, observacion: limpiarTexto(observacion) || null };

    return enviarInventario(url, body, token, "Ocurrió un error al retirar el lote.");
};

// Devuelve true si el retiro quedó registrado, para que la pantalla limpie el formulario y recargue.
export const RegistrarRetiro = async (form, lote, token, usuario) => {
    // Un retiro descuenta stock y no se puede deshacer desde aquí: se confirma antes.
    const { isConfirmed } = await Swal.fire({
        title: "Registrar retiro",
        text: `Se retirarán ${Number(form.cantidad)} unidades del lote ${lote.numeroLote || "sin número"} de "${form.medicamentoTexto}" por ${form.motivo}. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, retirar",
        cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return false;

    LoadingDefault("Registrando Retiro");
    const res = await EnviarRetiroLote(form, token, usuario);
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", res.mensaje, "error");
        return false;
    }

    await Swal.fire("Éxito", "Retiro registrado correctamente.", "success");
    return true;
};
